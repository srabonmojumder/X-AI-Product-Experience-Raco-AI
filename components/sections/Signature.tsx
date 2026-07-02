"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";
import { formations, type FormationId } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Reveal, Eyebrow } from "@/components/ui/primitives";

const MorphClusterCanvas = dynamic(() => import("@/components/three/MorphClusterCanvas"), {
  ssr: false,
  loading: () => null,
});

export function Signature() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<FormationId>("raw");

  const activeIndex = formations.findIndex((f) => f.id === active);
  const activeFormation = formations[activeIndex];

  return (
    <section id="signature" className="relative border-t border-line py-24 md:py-32">
      <div className="shell">
        <div className="mb-10 max-w-2xl md:mb-14">
          <Reveal>
            <Eyebrow>Signature interaction</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-display-md font-medium text-ink">
              Watch data find its shape.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              The same 2,600 points, reorganized on command. Move your cursor to
              look around the cluster, then step it through the pipeline — from raw signal to a ranked,
              actionable shape.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.06}>
          <div className="panel relative overflow-hidden bg-surface-sunken">
            {/* Stage backdrop */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(125,140,255,0.10),transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_20%_80%,rgba(87,225,206,0.06),transparent_70%)]" />

            {/* Canvas stage */}
            <div className="relative h-[420px] w-full sm:h-[520px]">
              <MorphClusterCanvas formation={active} reduced={reduced} />

              {/* Corner readout */}
              <div className="pointer-events-none absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                cluster · {String(activeIndex + 1).padStart(2, "0")} / 04
              </div>

              {/* Live caption */}
              <div className="pointer-events-none absolute right-5 top-5 text-right">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.3, ease: ease.outExpo }}
                  >
                    <div className="text-sm font-medium text-ink">{activeFormation.label}</div>
                    <div className="font-mono text-[11px] text-ink-faint">{activeFormation.caption}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Controls */}
            <div className="relative border-t border-line bg-surface/40 px-4 py-3">
              <div
                role="tablist"
                aria-label="Cluster formation"
                className="flex flex-wrap items-center gap-2"
              >
                {formations.map((f, i) => {
                  const isActive = f.id === active;
                  return (
                    <button
                      key={f.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(f.id)}
                      className={cn(
                        "relative flex items-center gap-2 rounded-full px-4 py-2 text-[13px] transition-colors duration-300",
                        isActive ? "text-bg" : "text-ink-muted hover:text-ink"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="formation-pill"
                          className="absolute inset-0 rounded-full bg-ink"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10 font-mono text-[11px] opacity-70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="relative z-10 font-medium">{f.label}</span>
                    </button>
                  );
                })}

                {/* Progress dots on the right */}
                <div className="ml-auto hidden items-center gap-1.5 sm:flex">
                  {formations.map((f, i) => (
                    <span
                      key={f.id}
                      className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        i === activeIndex ? "w-6 bg-signal-cyan" : "w-1.5 bg-white/15"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
