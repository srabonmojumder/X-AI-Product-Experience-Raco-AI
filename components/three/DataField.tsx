"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { damp } from "@/lib/utils";

/* A dense cloud that grows into an organic bloom (fibonacci sphere). */
const GX = 28;
const GY = 16;
const GZ = 10;
const COUNT = GX * GY * GZ; // 4480
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uReduced;

  attribute vec3  aBloom;
  attribute float aOffset;
  attribute float aScale;
  attribute float aColorMix;
  attribute float aSeed;

  varying float vColorMix;

  float easeInOutQuart(float x){
    return x < 0.5 ? 8.0*x*x*x*x : 1.0 - pow(-2.0*x + 2.0, 4.0) / 2.0;
  }

  void main(){
    // Each particle blooms on a slightly staggered clock.
    float staggered = clamp((uProgress - aOffset * 0.3) / 0.7, 0.0, 1.0);
    float e = easeInOutQuart(staggered);

    // Chaotic cloud drifts organically only while it is still unshaped.
    vec3 chaos = position;
    float driftAmp = (1.0 - e) * 0.5 * (1.0 - uReduced);
    chaos += vec3(
      sin(uTime * 0.30 + position.y * 0.6),
      cos(uTime * 0.26 + position.x * 0.5),
      sin(uTime * 0.22 + position.z * 0.7)
    ) * driftAmp;

    vec3 pos = mix(chaos, aBloom, e);

    // Arc bow at mid-transit — the field feels like it's growing outward.
    float arc = sin(e * 3.14159) * (1.0 - uReduced);
    pos += normalize(pos + vec3(0.0001)) * arc * (0.2 + aSeed * 0.4);

    // Idle shimmer, then slow breathing once bloomed.
    pos += vec3(
      sin(uTime * 0.6 + aSeed * 6.28),
      cos(uTime * 0.5 + aSeed * 5.0),
      sin(uTime * 0.4 + aSeed * 4.0)
    ) * 0.04 * (1.0 - uReduced);
    pos *= 1.0 + sin(uTime * 0.7) * 0.018 * e * (1.0 - uReduced);

    // Cursor gently pushes the field aside.
    vec2 toMouse = pos.xy - uMouse;
    float d = length(toMouse) + 0.0001;
    float force = smoothstep(2.6, 0.0, d) * 1.15 * (1.0 - uReduced);
    pos.xy += (toMouse / d) * force;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mvPosition.z);

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

    // Living gradient: coral → rose → violet.
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

export function DataField({
  progress,
  reduced,
}: {
  progress?: MotionValue<number>;
  reduced: boolean;
}) {
  const { camera } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const curProgress = useRef(0);
  const pointerNDC = useRef(new THREE.Vector2(0, 0));

  const geometry = useMemo(() => {
    const chaos = new Float32Array(COUNT * 3);
    const bloom = new Float32Array(COUNT * 3);
    const offset = new Float32Array(COUNT);
    const scale = new Float32Array(COUNT);
    const colorMix = new Float32Array(COUNT);
    const seed = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // Resolved form: an organic bloom with soft radial variance.
      const fi = i + 0.5;
      const phi = Math.acos(1 - (2 * fi) / COUNT);
      const theta = GOLDEN * fi;
      const r = 5.7 * (0.9 + 0.1 * Math.sin(fi * 0.7));
      bloom[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      bloom[i * 3 + 1] = Math.cos(phi) * r * 0.94;
      bloom[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;

      // Chaotic start: random point in a sphere.
      const cr = 8 * Math.cbrt(Math.random());
      const ct = Math.random() * Math.PI * 2;
      const cp = Math.acos(2 * Math.random() - 1);
      chaos[i * 3] = cr * Math.sin(cp) * Math.cos(ct);
      chaos[i * 3 + 1] = cr * Math.sin(cp) * Math.sin(ct) * 0.7;
      chaos[i * 3 + 2] = cr * Math.cos(cp);

      offset[i] = Math.random();
      scale[i] = 0.6 + Math.random() * 0.9;
      colorMix[i] = THREE.MathUtils.clamp(fi / COUNT + (Math.random() - 0.5) * 0.12, 0, 1);
      seed[i] = Math.random();
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(chaos, 3));
    g.setAttribute("aBloom", new THREE.BufferAttribute(bloom, 3));
    g.setAttribute("aOffset", new THREE.BufferAttribute(offset, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    g.setAttribute("aColorMix", new THREE.BufferAttribute(colorMix, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(999, 999) },
        uSize: { value: 26 },
        uPixelRatio: { value: 1 },
        uReduced: { value: reduced ? 1 : 0 },
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
  }, [reduced, material]);

  useEffect(() => {
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.75);
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointerNDC.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [material, reduced]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = reduced ? 0.85 : progress ? progress.get() : 0;
    curProgress.current = damp(curProgress.current, target, 6, dt);
    material.uniforms.uProgress.value = curProgress.current;

    if (!reduced) {
      material.uniforms.uTime.value += dt;

      const cam = camera as THREE.PerspectiveCamera;
      const vFov = (cam.fov * Math.PI) / 180;
      const h = 2 * Math.tan(vFov / 2) * cam.position.z;
      const w = h * cam.aspect;
      (material.uniforms.uMouse.value as THREE.Vector2).set(
        (pointerNDC.current.x * w) / 2,
        (pointerNDC.current.y * h) / 2
      );

      if (pointsRef.current) {
        pointsRef.current.rotation.y = Math.sin(material.uniforms.uTime.value * 0.05) * 0.14;
      }
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
