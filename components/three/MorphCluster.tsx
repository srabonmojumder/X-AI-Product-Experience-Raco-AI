"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp, lerp } from "@/lib/utils";
import type { FormationId } from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Particle budget and the four target formations.                    */
/* Every particle owns one position per formation; we morph the       */
/* "position" (from) attribute toward "aTarget" (to) on the GPU.      */
/* ------------------------------------------------------------------ */

const COUNT = 2600;
const TWO_PI = Math.PI * 2;

// Grid slab dimensions (20 * 13 * 10 = 2600).
const GX = 20;
const GY = 13;
const GZ = 10;

type Vec = [number, number, number];

function buildFormations() {
  const raw = new Float32Array(COUNT * 3);
  const grid = new Float32Array(COUNT * 3);
  const flow = new Float32Array(COUNT * 3);
  const insight = new Float32Array(COUNT * 3);
  const color = new Float32Array(COUNT);
  const seed = new Float32Array(COUNT);

  const NB = 13; // bar columns
  const perCol = Math.ceil(COUNT / NB);
  const colHeight = Array.from({ length: NB }, (_, c) => {
    // A varied, chart-like silhouette in [0.4, 1].
    const wave = 0.5 + 0.5 * Math.sin((c / NB) * Math.PI * 1.5 + 0.6);
    return 0.4 + wave * 0.6;
  });

  const set = (arr: Float32Array, i: number, v: Vec) => {
    arr[i * 3] = v[0];
    arr[i * 3 + 1] = v[1];
    arr[i * 3 + 2] = v[2];
  };

  for (let i = 0; i < COUNT; i++) {
    // ---- raw: point inside a gently flattened sphere ----
    const r = 4.6 * Math.cbrt(Math.random());
    const theta = Math.random() * TWO_PI;
    const phi = Math.acos(2 * Math.random() - 1);
    set(raw, i, [
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta) * 0.82,
      r * Math.cos(phi) * 0.9,
    ]);

    // ---- grid: ordered lattice slab ----
    const gx = i % GX;
    const gy = Math.floor(i / GX) % GY;
    const gz = Math.floor(i / (GX * GY)) % GZ;
    set(grid, i, [
      (gx / (GX - 1) - 0.5) * 10,
      (gy / (GY - 1) - 0.5) * 6,
      (gz / (GZ - 1) - 0.5) * 4,
    ]);

    // ---- flow: double helix coiled along x (left → right) ----
    const t = i / COUNT;
    const strand = i % 2 === 0 ? 0 : Math.PI;
    const ang = t * TWO_PI * 5 + strand;
    set(flow, i, [
      (t - 0.5) * 10,
      Math.cos(ang) * 1.95 + (Math.random() - 0.5) * 0.2,
      Math.sin(ang) * 1.95 + (Math.random() - 0.5) * 0.2,
    ]);

    // ---- insight: 3D bar columns ----
    const c = i % NB;
    const row = Math.floor(i / NB);
    const h = colHeight[c];
    const top = -3 + h * 6;
    const yBar = -3 + (row / perCol) * (top + 3);
    set(insight, i, [
      (c / (NB - 1) - 0.5) * 10 + (Math.random() - 0.5) * 0.28,
      yBar,
      (Math.random() - 0.5) * 0.7,
    ]);

    // ---- constant per-particle attributes ----
    color[i] = THREE.MathUtils.clamp(gx / (GX - 1) + (Math.random() - 0.5) * 0.14, 0, 1);
    seed[i] = Math.random();
  }

  return { raw, grid, flow, insight, color, seed };
}

const ORDER: FormationId[] = ["raw", "grid", "flow", "insight"];

const vertexShader = /* glsl */ `
  uniform float uMorph;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uReduced;

  attribute vec3  aTarget;
  attribute float aColor;
  attribute float aSeed;

  varying float vColor;

  void main(){
    float m = smoothstep(0.0, 1.0, uMorph);
    vec3 base = mix(position, aTarget, m);

    // Organic arc: particles bow outward at the midpoint of the transit.
    float arc = sin(m * 3.14159265) * (1.0 - uReduced);
    vec3 dir = normalize(base + vec3(0.0001));
    base += dir * arc * (0.35 + aSeed * 0.55);

    // Idle shimmer once settled, so the cluster never looks frozen.
    float idle = (1.0 - uReduced) * 0.05;
    base += vec3(
      sin(uTime * 0.6 + aSeed * 6.28),
      cos(uTime * 0.5 + aSeed * 5.0),
      sin(uTime * 0.4 + aSeed * 4.0)
    ) * idle;

    vec4 mv = modelViewMatrix * vec4(base, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (1.0 / -mv.z);

    vColor = aColor;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying float vColor;

  void main(){
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.04, d);

    vec3 cyan   = vec3(0.341, 0.882, 0.808);
    vec3 indigo = vec3(0.490, 0.549, 1.000);
    vec3 col = mix(cyan, indigo, vColor);

    gl_FragColor = vec4(col, alpha * 0.85);
  }
`;

export function MorphCluster({
  formation,
  reduced,
}: {
  formation: FormationId;
  reduced: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const F = useMemo(buildFormations, []);

  // Working "from" buffer we can snapshot into on each switch.
  const fromBuf = useMemo(() => new Float32Array(F.grid.length), [F]);

  const morph = useRef(1); // eased 0 → 1 across a transition
  const targetKey = useRef<FormationId>(formation);
  const mouse = useRef({ x: 0, y: 0 });
  const rot = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // Start fully settled on the initial formation.
    const init = F[formation];
    fromBuf.set(init);
    g.setAttribute("position", new THREE.BufferAttribute(fromBuf, 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(init.slice(), 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(F.color, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(F.seed, 1));
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMorph: { value: 1 },
          uTime: { value: 0 },
          uSize: { value: 26 },
          uPixelRatio: { value: 1 },
          uReduced: { value: reduced ? 1 : 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    material.uniforms.uReduced.value = reduced ? 1 : 0;
  }, [reduced, material]);

  useEffect(() => {
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.75);
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [material, reduced]);

  // On formation change: snapshot the currently displayed positions into the
  // "from" buffer, point "aTarget" at the new formation, restart the morph.
  useEffect(() => {
    if (formation === targetKey.current && morph.current >= 1) return;
    const g = pointsRef.current?.geometry as THREE.BufferGeometry | undefined;
    if (!g) return;

    const pos = g.getAttribute("position") as THREE.BufferAttribute;
    const tgt = g.getAttribute("aTarget") as THREE.BufferAttribute;
    const prevTarget = tgt.array as Float32Array;
    const posArr = pos.array as Float32Array;

    // Snapshot displayed = mix(from, prevTarget, smoothstep(morph)).
    const m = morph.current;
    const e = m * m * (3 - 2 * m);
    for (let i = 0; i < posArr.length; i++) {
      posArr[i] = lerp(posArr[i], prevTarget[i], e);
    }
    pos.needsUpdate = true;

    // New destination.
    const next = F[formation];
    (tgt.array as Float32Array).set(next);
    tgt.needsUpdate = true;

    morph.current = reduced ? 1 : 0;
    material.uniforms.uMorph.value = morph.current;
    targetKey.current = formation;
  }, [formation, F, material, reduced]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (morph.current < 1) {
      morph.current = Math.min(1, morph.current + dt / (reduced ? 0.0001 : 1.15));
      material.uniforms.uMorph.value = morph.current;
    }

    if (!reduced) {
      material.uniforms.uTime.value += dt;
      // Cursor parallax + slow ambient drift.
      const targetY = mouse.current.x * 0.5 + material.uniforms.uTime.value * 0.04;
      const targetX = mouse.current.y * 0.28;
      rot.current.y = damp(rot.current.y, targetY, 3, dt);
      rot.current.x = damp(rot.current.x, targetX, 3, dt);
      if (pointsRef.current) {
        pointsRef.current.rotation.y = rot.current.y;
        pointsRef.current.rotation.x = rot.current.x;
      }
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export { ORDER };
