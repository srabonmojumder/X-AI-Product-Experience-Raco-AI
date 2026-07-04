"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MorphCluster } from "./MorphCluster";
import type { FormationKey } from "@/lib/data";

export default function MorphClusterCanvas({
  formation,
  reduced,
}: {
  formation: FormationKey;
  reduced: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 13], fov: 45 }}
      >
        <MorphCluster formation={formation} reduced={reduced} />
      </Canvas>
    </div>
  );
}
