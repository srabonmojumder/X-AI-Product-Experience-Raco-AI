"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp, damp, lerp } from "@/lib/utils";
import type { FormationKey } from "@/lib/data";

const COUNT = 2600;
const TWO_PI = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const ORDER: FormationKey[] = ["seed", "bloom", "flow", "ranked"];

const vertexShader = /* glsl */ `
  uniform float uMorph, uTime, uSize, uPixelRatio, uReduced;
  uniform vec2 uMouse;
  attribute vec3 aTarget;
  attribute float aColorMix, aSeed;
  varying float vColorMix;

  float easeInOutCubic(float x){
    return x < 0.5 ? 4.0*x*x*x : 1.0 - pow(-2.0*x + 2.0, 3.0) / 2.0;
  }

  void main(){
    float m = easeInOutCubic(clamp(uMorph, 0.0, 1.0));
    vec3 pos = mix(position, aTarget, m);

    // Arc bow during transit + idle shimmer + slow breathing.
    float arc = sin(m * 3.14159) * (1.0 - uReduced);
    pos += normalize(pos + vec3(0.0001)) * arc * (0.25 + aSeed * 0.5);
    pos += vec3(
      sin(uTime * 0.6 + aSeed * 6.28),
      cos(uTime * 0.5 + aSeed * 5.0),
      sin(uTime * 0.4 + aSeed * 4.0)
    ) * 0.045 * (1.0 - uReduced);
    pos *= 1.0 + sin(uTime * 0.7) * 0.02 * (1.0 - uReduced);

    // Cursor gently pushes the field.
    vec2 toMouse = pos.xy - uMouse;
    float d = length(toMouse) + 0.0001;
    pos.xy += (toMouse / d) * smoothstep(2.4, 0.0, d) * 1.0 * (1.0 - uReduced);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aSeed * 0.7) * uPixelRatio * (1.0 / -mv.z);
    vColorMix = aColorMix;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying float vColorMix;
  void main(){
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.04, d);
    vec3 a1 = vec3(1.00, 0.54, 0.34);
    vec3 a2 = vec3(0.98, 0.35, 0.47);
    vec3 a3 = vec3(0.55, 0.36, 0.96);
    vec3 col = vColorMix < 0.5
      ? mix(a1, a2, vColorMix * 2.0)
      : mix(a2, a3, (vColorMix - 0.5) * 2.0);
    col *= 1.08;
    gl_FragColor = vec4(col, alpha * 0.92);
  }
`;

export function MorphCluster({
  formation,
  reduced,
}: {
  formation: FormationKey;
  reduced: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const morph = useRef(1);
  const active = useRef<FormationKey>("seed");
  const pointerNDC = useRef(new THREE.Vector2(0, 0));
  const rot = useRef({ x: 0, y: 0 });

  // Precompute every formation's target positions once.
  const { forms, colorMix, seed } = useMemo(() => {
    const forms: Record<FormationKey, Float32Array> = {
      seed: new Float32Array(COUNT * 3),
      bloom: new Float32Array(COUNT * 3),
      flow: new Float32Array(COUNT * 3),
      ranked: new Float32Array(COUNT * 3),
    };
    const colorMix = new Float32Array(COUNT);
    const seed = new Float32Array(COUNT);
    const NB = 13;
    const perCol = Math.ceil(COUNT / NB);
    const colH = Array.from(
      { length: NB },
      (_, c) => 0.4 + (0.5 + 0.5 * Math.sin((c / NB) * Math.PI * 1.5 + 0.6)) * 0.6
    );
    const set = (a: Float32Array, i: number, x: number, y: number, z: number) => {
      a[i * 3] = x;
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = z;
    };

    for (let i = 0; i < COUNT; i++) {
      // seed — a soft spherical cloud
      const r = 4.6 * Math.cbrt(Math.random());
      const th = Math.random() * TWO_PI;
      const ph = Math.acos(2 * Math.random() - 1);
      set(forms.seed, i, r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.82, r * Math.cos(ph) * 0.9);

      // bloom — a fibonacci shell
      const fi = i + 0.5;
      const bph = Math.acos(1 - (2 * fi) / COUNT);
      const bth = GOLDEN * fi;
      const br = 4.4;
      set(forms.bloom, i, Math.sin(bph) * Math.cos(bth) * br, Math.cos(bph) * br, Math.sin(bph) * Math.sin(bth) * br);

      // flow — a double helix
      const t = i / COUNT;
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const ang = t * TWO_PI * 5 + strand;
      set(forms.flow, i, (t - 0.5) * 11, Math.cos(ang) * 1.95 + (Math.random() - 0.5) * 0.2, Math.sin(ang) * 1.95 + (Math.random() - 0.5) * 0.2);

      // ranked — quantified bars
      const c = i % NB;
      const row = Math.floor(i / NB);
      const top = -3 + colH[c] * 6;
      const yBar = -3 + (row / perCol) * (top + 3);
      set(forms.ranked, i, (c / (NB - 1) - 0.5) * 10 + (Math.random() - 0.5) * 0.28, yBar, (Math.random() - 0.5) * 0.7);

      colorMix[i] = clamp(i / COUNT + (Math.random() - 0.5) * 0.14, 0, 1);
      seed[i] = Math.random();
    }
    return { forms, colorMix, seed };
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(forms.seed.slice(), 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(forms.seed.slice(), 3));
    g.setAttribute("aColorMix", new THREE.BufferAttribute(colorMix, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [forms, colorMix, seed]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uMorph: { value: 1 },
        uTime: { value: 0 },
        uSize: { value: 26 },
        uPixelRatio: { value: 1 },
        uReduced: { value: reduced ? 1 : 0 },
        uMouse: { value: new THREE.Vector2(999, 999) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    material.uniforms.uReduced.value = reduced ? 1 : 0;
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.75);
  }, [reduced, material]);

  // Track cursor for the orbit + gentle push.
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointerNDC.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // React to formation changes by re-baking the "from" state and morphing.
  useEffect(() => {
    if (formation === active.current) return;
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const tgt = geometry.getAttribute("aTarget") as THREE.BufferAttribute;
    const pa = pos.array as Float32Array;
    const prev = tgt.array as Float32Array;
    // Freeze the currently displayed positions as the new starting point.
    const e = morph.current * morph.current * (3 - 2 * morph.current);
    for (let k = 0; k < pa.length; k++) pa[k] = lerp(pa[k], prev[k], e);
    pos.needsUpdate = true;
    (tgt.array as Float32Array).set(forms[formation]);
    tgt.needsUpdate = true;
    morph.current = reduced ? 1 : 0;
    material.uniforms.uMorph.value = morph.current;
    active.current = formation;
  }, [formation, forms, geometry, material, reduced]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (morph.current < 1) {
      morph.current = Math.min(1, morph.current + dt / (reduced ? 0.0001 : 1.15));
      material.uniforms.uMorph.value = morph.current;
    }
    if (!reduced) {
      material.uniforms.uTime.value += dt;
      rot.current.y = damp(rot.current.y, pointerNDC.current.x * 0.5 + material.uniforms.uTime.value * 0.04, 3, dt);
      rot.current.x = damp(rot.current.x, -pointerNDC.current.y * 0.28, 3, dt);
      if (pointsRef.current) {
        pointsRef.current.rotation.y = rot.current.y;
        pointsRef.current.rotation.x = rot.current.x;
      }
      // Project cursor to world for the soft push.
      const cam = state.camera as THREE.PerspectiveCamera;
      const vFov = (cam.fov * Math.PI) / 180;
      const h = 2 * Math.tan(vFov / 2) * cam.position.z;
      const w = h * cam.aspect;
      (material.uniforms.uMouse.value as THREE.Vector2).set(
        (pointerNDC.current.x * w) / 2,
        (pointerNDC.current.y * h) / 2
      );
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export { ORDER };
