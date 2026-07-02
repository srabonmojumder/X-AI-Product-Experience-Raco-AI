"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, inView, ease } from "@/lib/motion";

/** Reveal children on scroll with the shared fade-up ease. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      transition={{ duration: 0.75, ease: ease.outExpo, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Mono, tracked-out label. Optionally shows a leading tick. */
export function Eyebrow({
  children,
  tick = true,
  className,
}: {
  children: React.ReactNode;
  tick?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-2", className)}>
      {tick && <span className="h-1 w-1 rounded-full bg-signal-cyan" />}
      {children}
    </span>
  );
}

/** Section header: eyebrow + display title + optional lede. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mt-5 text-display-md font-medium text-ink">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.12}>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}

/** A faux product-window chrome used to frame the dashboard. */
export function WindowFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="panel overflow-hidden shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-3 border-b border-line bg-surface-sunken px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-md border border-line px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-cyan/80" />
          <span className="font-mono text-[11px] tracking-wide text-ink-muted">{label}</span>
        </div>
        <div className="w-14" />
      </div>
      {children}
    </div>
  );
}
