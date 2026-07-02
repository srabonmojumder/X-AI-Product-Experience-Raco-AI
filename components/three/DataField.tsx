"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { damp } from "@/lib/utils";

/* Lattice dimensions — a wide, shallow slab reads as "structured data". */
const GX = 28;
const GY = 16;
const GZ = 10;
const COUNT = GX * GY * GZ; // 4480
const EX = 6; // half-extent x
const EY = 3.4; // half-extent y
const EZ = 2.2; // half-extent z

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uReduced;

  attribute vec3  aOrdered;
  attribute float aOffset;
  attribute float aScale;
  attribute float aColorMix;

  varying float vColorMix;
  varying float vProg;

  float easeInOutQuart(float x){
    return x < 0.5 ? 8.0*x*x*x*x : 1.0 - pow(-2.0*x + 2.0, 4.0) / 2.0;
  }

  void main(){
    // Each particle starts its journey at a slightly different time.
    float staggered = clamp((uProgress - aOffset * 0.35) / 0.65, 0.0, 1.0);
    float e = easeInOutQuart(staggered);

    // Chaotic cloud drifts gently only while it is still unstructured.
    vec3 chaos = position;
    float driftAmp = (1.0 - e) * 0.5 * (1.0 - uReduced);
    chaos += vec3(
      sin(uTime * 0.30 + position.y * 0.6),
      cos(uTime * 0.26 + position.x * 0.5),
      sin(uTime * 0.22 + position.z * 0.7)
    ) * driftAmp;

    vec3 pos = mix(chaos, aOrdered, e);

    // Cursor pushes the field aside within a soft radius.
    vec2 toMouse = pos.xy - uMouse;
    float d = length(toMouse) + 0.0001;
    float force = smoothstep(2.6, 0.0, d) * 1.25 * (1.0 - uReduced);
    pos.xy += (toMouse / d) * force;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mvPosition.z);

    vColorMix = aColorMix;
    vProg = e;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying float vColorMix;
  varying float vProg;

  void main(){
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, d);

    vec3 cyan   = vec3(0.341, 0.882, 0.808);
    vec3 indigo = vec3(0.490, 0.549, 1.000);
    vec3 col = mix(cyan, indigo, clamp(vColorMix + vProg * 0.25, 0.0, 1.0));

    gl_FragColor = vec4(col, alpha * 0.82);
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
  const mouseWorld = useRef(new THREE.Vector3());

  // Build geometry attributes once.
  const geometry = useMemo(() => {
    const chaos = new Float32Array(COUNT * 3);
    const ordered = new Float32Array(COUNT * 3);
    const offset = new Float32Array(COUNT);
    const scale = new Float32Array(COUNT);
    const colorMix = new Float32Array(COUNT);

    let i = 0;
    for (let x = 0; x < GX; x++) {
      for (let y = 0; y < GY; y++) {
        for (let z = 0; z < GZ; z++) {
          const ox = (x / (GX - 1) - 0.5) * 2 * EX;
          const oy = (y / (GY - 1) - 0.5) * 2 * EY;
          const oz = (z / (GZ - 1) - 0.5) * 2 * EZ;
          ordered[i * 3] = ox;
          ordered[i * 3 + 1] = oy;
          ordered[i * 3 + 2] = oz;

          // Chaotic start: random point in a sphere.
          const r = 8 * Math.cbrt(Math.random());
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          chaos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          chaos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
          chaos[i * 3 + 2] = r * Math.cos(phi);

          offset[i] = Math.random();
          scale[i] = 0.6 + Math.random() * 0.9;
          // Ordered colour sweeps cyan → indigo left-to-right, with a touch of noise.
          colorMix[i] = THREE.MathUtils.clamp(x / (GX - 1) + (Math.random() - 0.5) * 0.15, 0, 1);
          i++;
        }
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(chaos, 3));
    g.setAttribute("aOrdered", new THREE.BufferAttribute(ordered, 3));
    g.setAttribute("aOffset", new THREE.BufferAttribute(offset, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    g.setAttribute("aColorMix", new THREE.BufferAttribute(colorMix, 1));
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

  // Keep reduced flag in sync if the OS setting changes.
  useEffect(() => {
    material.uniforms.uReduced.value = reduced ? 1 : 0;
  }, [reduced, material]);

  // Track the cursor in normalised device coords, regardless of DOM layering.
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
    const target = reduced ? 0.72 : progress ? progress.get() : 0;
    curProgress.current = damp(curProgress.current, target, 6, dt);
    material.uniforms.uProgress.value = curProgress.current;

    if (!reduced) {
      material.uniforms.uTime.value += dt;

      // Project NDC cursor onto the z = 0 plane in world units.
      const cam = camera as THREE.PerspectiveCamera;
      const vFov = (cam.fov * Math.PI) / 180;
      const h = 2 * Math.tan(vFov / 2) * cam.position.z;
      const w = h * cam.aspect;
      mouseWorld.current.set(
        (pointerNDC.current.x * w) / 2,
        (pointerNDC.current.y * h) / 2,
        0
      );
      (material.uniforms.uMouse.value as THREE.Vector2).set(
        mouseWorld.current.x,
        mouseWorld.current.y
      );

      // Very slow ambient rotation for depth.
      if (pointsRef.current) {
        pointsRef.current.rotation.y = Math.sin(material.uniforms.uTime.value * 0.05) * 0.12;
      }
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
