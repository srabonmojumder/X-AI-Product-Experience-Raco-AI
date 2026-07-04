"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SectionHeading, Reveal } from "@/components/ui/primitives";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { formations, type FormationKey } from "@/lib/data";

const MorphClusterCanvas = dynamic(
  () => import("@/components/three/MorphClusterCanvas"),
  { ssr: false }
);

export function Signature() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<FormationKey>("seed");
  const current = formations.find((f) => f.key === active)!;
  const idx = formations.findIndex((f) => f.key === active);

  return (
    <section id="bloom" className="relative py-24 md:py-32">
      <div className="shell">
        <div className="mb-8">
          <SectionHeading
            eyebrow="The living cluster"
            title="Watch data find its shape."
            lede="The same 2,600 samples, reshaped on command. Move your cursor to stir the field, then step it through its life — from raw signal to a ranked, ready-to-act shape."
          />
        </div>

        <Reveal>
          <div className="field aspect-[16/10] w-full md:aspect-[2/1]">
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3">
              <span className="field-label">
                field · {String(idx + 1).padStart(2, "0")} / 04
              </span>
              <span className="field-label">{current.caption}</span>
            </div>

            <MorphClusterCanvas formation={active} reduced={reduced} />

            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-4 py-3">
              <span className="field-label flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-coral shadow-[0_0_10px_var(--coral)]" />
                2,600 samples
              </span>
              <span className="field-label">{reduced ? "static" : "cursor to stir"}</span>
            </div>
          </div>
        </Reveal>

        {/* Formation controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {formations.map((f, i) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={cn(
                "relative flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                active === f.key
                  ? "border-transparent bg-coral text-white shadow-[0_10px_24px_-12px_var(--coral)]"
                  : "border-line-strong bg-paper-raised text-ink hover:border-coral/50"
              )}
            >
              <span className={cn("font-mono text-[11px]", active === f.key ? "text-white/70" : "text-ink-faint")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {f.label}
            </button>
          ))}
          <div className="ml-1 flex items-center gap-1.5">
            {formations.map((f, i) => (
              <span
                key={f.key}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === idx ? "w-6 bg-coral" : "w-1.5 bg-line-strong"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
