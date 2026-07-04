"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Reveal, Eyebrow } from "@/components/ui/primitives";
import { cn, clamp } from "@/lib/utils";
import { stages } from "@/lib/data";

/* --- The three animated scenes that live inside the dark field. --- */
function Scenes({
  aRef,
  bRef,
  cRef,
  trendRef,
}: {
  aRef: React.RefObject<SVGGElement>;
  bRef: React.RefObject<SVGGElement>;
  cRef: React.RefObject<SVGGElement>;
  trendRef: React.RefObject<SVGPathElement>;
}) {
  const funnel = [72, 116, 160, 204, 248];
  const bars = [
    [77, 150],
    [129, 110],
    [181, 128],
    [233, 78],
    [285, 52],
  ];
  const nodes: [number, number, boolean][] = [
    [90, 96, false],
    [170, 66, true],
    [252, 112, false],
    [322, 76, false],
    [132, 186, false],
    [222, 214, true],
    [302, 184, false],
    [192, 136, false],
  ];
  return (
    <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--coral)" stopOpacity="0.95" />
          <stop offset="1" stopColor="var(--grad-2)" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Scene A — Listen */}
      <g ref={aRef}>
        <text x="30" y="34" fill="var(--field-faint,#8B8072)" fontFamily="'JetBrains Mono'" fontSize="10" letterSpacing="1.5">
          SOURCES
        </text>
        {funnel.map((y, i) => (
          <path
            key={i}
            d={`M 34 ${y} C 150 ${y}, 200 168, 300 168`}
            fill="none"
            stroke="rgba(232,222,210,.4)"
            strokeWidth="1.2"
          />
        ))}
        {funnel.map((y, i) => (
          <circle key={`n${i}`} cx="34" cy={y} r="4.5" fill="var(--violet)" />
        ))}
        <circle cx="300" cy="168" r="14" fill="none" stroke="var(--coral)" strokeWidth="1.5" />
        <circle cx="300" cy="168" r="5.5" fill="var(--coral)" />
      </g>

      {/* Scene B — Connect */}
      <g ref={bRef} opacity={0}>
        <text x="30" y="34" fill="var(--field-faint,#8B8072)" fontFamily="'JetBrains Mono'" fontSize="10" letterSpacing="1.5">
          SEMANTIC GRAPH
        </text>
        {nodes.slice(0, -1).map((n, i) => {
          const m = nodes[i + 1];
          return (
            <line key={`e${i}`} x1={n[0]} y1={n[1]} x2={m[0]} y2={m[1]} stroke="rgba(232,222,210,.3)" strokeWidth="1" />
          );
        })}
        {nodes.map(([x, y, hot], i) => (
          <circle
            key={`bn${i}`}
            cx={x}
            cy={y}
            r={hot ? 7 : 5}
            fill={hot ? "var(--coral)" : "#241A26"}
            stroke={hot ? "var(--violet-soft)" : "rgba(232,222,210,.5)"}
            strokeWidth="1.2"
          />
        ))}
      </g>

      {/* Scene C — Bloom */}
      <g ref={cRef} opacity={0}>
        <text x="30" y="34" fill="var(--field-faint,#8B8072)" fontFamily="'JetBrains Mono'" fontSize="10" letterSpacing="1.5">
          RESOLVED INSIGHT
        </text>
        {bars.map(([x, y], i) => (
          <rect key={`b${i}`} x={x - 18} y={y} width="36" height={196 - y} rx="4" fill="url(#barGrad)" />
        ))}
        <path
          ref={trendRef}
          d="M 77 170 L 129 130 L 181 150 L 233 90 L 285 60 L 337 100"
          fill="none"
          stroke="var(--grad-3)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g>
          <circle cx="256" cy="49" r="4" fill="var(--grad-3)" />
          <text x="270" y="53" fill="var(--field-ink,#E4DBD0)" fontFamily="'JetBrains Mono'" fontSize="12">
            94% confidence
          </text>
        </g>
      </g>
    </svg>
  );
}

export function InsightFlow() {
  const reduced = usePrefersReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<SVGGElement>(null);
  const bRef = useRef<SVGGElement>(null);
  const cRef = useRef<SVGGElement>(null);
  const trendRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);

  useIsomorphicLayoutEffect(() => {
    if (reduced) {
      setActive(2);
      gsap.set(aRef.current, { opacity: 0 });
      gsap.set(bRef.current, { opacity: 0 });
      gsap.set(cRef.current, { opacity: 1 });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
      const st = ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          setActive(p < 0.36 ? 0 : p < 0.7 ? 1 : 2);
          gsap.set(aRef.current, { opacity: 1 - seg(p, 0.32, 0.44) });
          gsap.set(bRef.current, { opacity: seg(p, 0.34, 0.44) * (1 - seg(p, 0.64, 0.72)) });
          gsap.set(cRef.current, { opacity: seg(p, 0.66, 0.74) });
        },
      });
      // draw the trend line once, tied to the scroll
      const len = trendRef.current?.getTotalLength() ?? 0;
      if (trendRef.current) {
        gsap.set(trendRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(trendRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: pinRef.current, start: "top top", end: "+=300%", scrub: 1 },
        });
      }
      return () => st.kill();
    }, pinRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="flow" className="relative">
      <div ref={pinRef} className="flex min-h-screen items-center py-20">
        <div className="shell grid w-full items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          {/* Stage list */}
          <div>
            <Reveal>
              <Eyebrow>How it flows</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="text-display-md mt-5 text-ink">
                Three moves,
                <br />
                one living system.
              </h2>
            </Reveal>

            <div className="mt-10 flex flex-col gap-2">
              {stages.map((s, i) => (
                <div
                  key={s.index}
                  className={cn(
                    "relative rounded-2xl px-5 py-4 transition-all duration-500 ease-out-expo",
                    active === i ? "bg-paper-raised shadow-soft" : "opacity-60"
                  )}
                >
                  <span
                    className={cn(
                      "bg-living absolute left-0 top-5 bottom-5 w-0.5 origin-top rounded-full transition-transform duration-500",
                      active === i ? "scale-y-100" : "scale-y-0"
                    )}
                  />
                  <div className="flex items-center gap-3 pl-3">
                    <span className="font-mono text-xs text-ink-faint">{s.index}</span>
                    <h3 className="font-display text-lg font-bold text-ink">{s.name}</h3>
                  </div>
                  <p className="mt-1.5 pl-3 text-sm leading-relaxed text-ink-muted">{s.summary}</p>
                  <div
                    className={cn(
                      "grid pl-3 transition-all duration-500",
                      active === i ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[0.85rem] leading-relaxed text-ink-faint">{s.detail}</p>
                      <div className="mt-3 flex gap-2.5 font-mono text-[11.5px]">
                        <span className="text-ink-faint">{s.metric.label}</span>
                        <span className="text-coral">{s.metric.value}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Field viewport */}
          <Reveal>
            <div className="field aspect-[4/3] w-full">
              <span className="absolute left-4 bottom-3 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-field-faint">
                stage {String(active + 1).padStart(2, "0")} / 03
              </span>
              <Scenes aRef={aRef} bRef={bRef} cRef={cRef} trendRef={trendRef} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
