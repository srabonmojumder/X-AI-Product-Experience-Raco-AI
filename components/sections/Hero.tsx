"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { fadeUp, stagger, ease } from "@/lib/motion";

const DataFieldCanvas = dynamic(() => import("@/components/three/DataFieldCanvas"), {
  ssr: false,
});

function Ticks() {
  const base = "absolute h-3 w-3 border-field-line";
  return (
    <>
      <span className={`${base} left-3 top-3 border-l border-t`} />
      <span className={`${base} right-3 top-3 border-r border-t`} />
      <span className={`${base} bottom-3 left-3 border-b border-l`} />
      <span className={`${base} bottom-3 right-3 border-b border-r`} />
    </>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState("STILL JUST NOISE");
  const [readout, setReadout] = useState("resting · move to disturb");

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPct(Math.round(v * 99));
    setPhase(v < 0.35 ? "STILL JUST NOISE" : v < 0.8 ? "FINDING ITS SHAPE" : "UNDERSTOOD");
  });

  const onFieldMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const el = fieldRef.current;
    const bloom = bloomRef.current;
    if (!el || !bloom) return;
    const r = el.getBoundingClientRect();
    bloom.style.left = `${e.clientX - r.left}px`;
    bloom.style.top = `${e.clientY - r.top}px`;
    setReadout("drawn to your cursor");
  };

  return (
    <header ref={heroRef} id="hero" className="relative pt-28 md:pt-32">
      <div className="shell grid items-center gap-10 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24">
        {/* Left — message */}
        <motion.div variants={stagger(0.08)} initial="hidden" animate="show">
          <motion.span variants={fadeUp} className="eyebrow">
            Living Intelligence · 01
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="text-display-xl mt-5 text-ink"
          >
            Turn raw noise
            <br />
            into <span className="text-living">living</span>
            <br />
            <span className="font-medium text-ink-muted">intelligence.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-[1.075rem] leading-relaxed text-ink-muted"
          >
            Xai listens to every source, learns how they connect, and grows the noise into
            understanding your team can act on — gently, continuously, in real time.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <a href="#workspace" className="btn-primary">
              Request access <ArrowRight size={16} />
            </a>
            <a href="#flow" className="btn-ghost">
              See how it flows
            </a>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mt-10 flex gap-8 border-t border-line pt-6"
          >
            {[
              ["Sources", "42 live"],
              ["Signals / s", "4,480"],
              ["Understanding", `${String(pct).padStart(2, "0")} → 99`],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
                  {k}
                </div>
                <div className="mt-1 font-display text-[1.35rem] font-bold text-ink">{v}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — the living field */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: ease.outExpo, delay: 0.1 }}
        >
          <div
            ref={fieldRef}
            onPointerMove={onFieldMove}
            className="field group aspect-[4/3] w-full"
          >
            <Ticks />
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3">
              <span className="field-label">The living field</span>
              <span className="field-label">{phase}</span>
            </div>

            {/* Cursor life-bloom */}
            {!reduced && (
              <div
                ref={bloomRef}
                aria-hidden
                className="pointer-events-none absolute z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[4px] transition-opacity duration-300 [mix-blend-mode:screen] group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,138,91,0.44) 0%, rgba(251,90,120,0.22) 38%, transparent 68%)",
                }}
              />
            )}

            <DataFieldCanvas progress={scrollYProgress} reduced={reduced} />

            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-4 py-3">
              <span className="field-label flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-coral shadow-[0_0_10px_var(--coral)]" />
                listening
              </span>
              <span className="field-label">{readout}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="shell flex justify-center pb-10">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          Scroll to watch it grow
          <ArrowDown size={13} className={reduced ? "" : "animate-bounce"} />
        </div>
      </div>
    </header>
  );
}
