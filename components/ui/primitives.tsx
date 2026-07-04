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

/** Tracked-out mono label with a leading gradient tick. */
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
    <span className={cn("eyebrow inline-flex items-center gap-2.5", className)}>
      {tick && <span className="bg-living h-0.5 w-6 rounded-full" />}
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
        <h2 className="text-display-md mt-5 text-ink">{title}</h2>
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
  url,
  status = "live",
}: {
  children: React.ReactNode;
  url: string;
  status?: string;
}) {
  return (
    <div className="panel overflow-hidden shadow-window">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-coral" />
          <span className="h-2.5 w-2.5 rounded-[3px] border border-line-strong" />
          <span className="h-2.5 w-2.5 rounded-[3px] border border-line-strong" />
        </div>
        <span className="font-mono text-[11px] tracking-wide text-ink-faint">{url}</span>
        <span className="ml-auto inline-flex items-center gap-2 font-mono text-[10px] text-ink-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-coral shadow-[0_0_9px_var(--coral)]" />
          {status}
        </span>
      </div>
      {children}
    </div>
  );
}
