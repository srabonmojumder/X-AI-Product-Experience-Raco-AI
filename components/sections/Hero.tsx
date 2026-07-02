"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { ease, stagger } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Eyebrow } from "@/components/ui/primitives";

// Three.js only runs in the browser.
const DataFieldCanvas = dynamic(() => import("@/components/three/DataFieldCanvas"), {
  ssr: false,
  loading: () => null,
});

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: ease.outExpo } },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  // Progress across the hero's extra scroll height (0 = chaos, 1 = structured).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  return (
    <section ref={sectionRef} className="relative h-[135vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* The data field lives behind the copy. */}
        <DataFieldCanvas progress={scrollYProgress} reduced={reduced} />

        {/* Readability washes over the field. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent_35%,rgba(11,13,18,0.55)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

        {/* Centered content. */}
        <div className="relative z-10 flex h-full items-center">
          <div className="shell">
            <motion.div
              variants={stagger(0.12, 0.35)}
              initial="hidden"
              animate="show"
              className="max-w-3xl"
            >
              <motion.div variants={item}>
                <Eyebrow>Intelligence workspace</Eyebrow>
              </motion.div>

              <motion.h1
                variants={item}
                className="mt-6 text-display-xl font-medium text-ink"
              >
                From raw data to{" "}
                <span className="text-signal">structured intelligence</span>.
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
              >
                Xai unifies every source, reasons over the connections between them,
                and turns what it finds into decisions your team can run.
              </motion.p>

              <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#dashboard" className="btn-primary">
                  Request access
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </a>
                <a href="#insight-flow" className="btn-ghost">
                  See how it works
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue. */}
        <motion.a
          href="#insight-flow"
          aria-label="Scroll to how it works"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-ink-faint transition-colors hover:text-ink-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <motion.span
            className="flex flex-col items-center gap-2"
            animate={reduced ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Scroll</span>
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
