"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { stages } from "@/lib/data";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Eyebrow } from "@/components/ui/primitives";

/* ---------------- SVG scenes (pure geometry, no assets) ---------------- */

const SOURCES = [
  { x: 40, y: 70 },
  { x: 40, y: 120 },
  { x: 40, y: 170 },
  { x: 40, y: 220 },
  { x: 40, y: 270 },
];
const FUNNEL = { x: 300, y: 170 };

function SceneIngest() {
  return (
    <g className="scene-a">
      {SOURCES.map((s, i) => (
        <path
          key={`al-${i}`}
          className="a-line"
          d={`M ${s.x} ${s.y} C ${s.x + 120} ${s.y}, ${FUNNEL.x - 120} ${FUNNEL.y}, ${FUNNEL.x} ${FUNNEL.y}`}
          fill="none"
          stroke="rgba(148,163,184,0.5)"
          strokeWidth="1.25"
          pathLength={1}
        />
      ))}
      {SOURCES.map((s, i) => (
        <circle key={`an-${i}`} className="a-node" cx={s.x} cy={s.y} r="5" fill="#57E1CE" />
      ))}
      <circle className="a-core" cx={FUNNEL.x} cy={FUNNEL.y} r="14" fill="none" stroke="#7D8CFF" strokeWidth="1.5" />
      <circle className="a-core" cx={FUNNEL.x} cy={FUNNEL.y} r="6" fill="#7D8CFF" />
      <text x={40} y={40} className="fill-ink-faint font-mono text-[11px]" style={{ letterSpacing: "0.1em" }}>
        SOURCES
      </text>
    </g>
  );
}

const B_NODES = [
  { x: 90, y: 90, hot: false },
  { x: 170, y: 60, hot: true },
  { x: 250, y: 110, hot: false },
  { x: 320, y: 70, hot: false },
  { x: 130, y: 180, hot: false },
  { x: 220, y: 210, hot: true },
  { x: 300, y: 180, hot: false },
  { x: 190, y: 130, hot: false },
];
const B_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [2, 6], [7, 1], [7, 5], [3, 6],
];

function SceneAnalyze() {
  return (
    <g className="scene-b" style={{ opacity: 0 }}>
      {B_EDGES.map(([a, b], i) => (
        <line
          key={`be-${i}`}
          className="b-edge"
          x1={B_NODES[a].x}
          y1={B_NODES[a].y}
          x2={B_NODES[b].x}
          y2={B_NODES[b].y}
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="1"
          pathLength={1}
        />
      ))}
      {B_NODES.map((n, i) => (
        <circle
          key={`bn-${i}`}
          className="b-node"
          cx={n.x}
          cy={n.y}
          r={n.hot ? 7 : 5}
          fill={n.hot ? "#7D8CFF" : "#1E2430"}
          stroke={n.hot ? "#A7B1FF" : "rgba(148,163,184,0.5)"}
          strokeWidth="1.25"
        />
      ))}
      <text x={40} y={40} className="fill-ink-faint font-mono text-[11px]" style={{ letterSpacing: "0.1em" }}>
        SEMANTIC GRAPH
      </text>
    </g>
  );
}

const C_BARS = [110, 150, 130, 200, 240, 210];

function SceneGenerate() {
  const baseY = 280;
  const barW = 34;
  const gap = 18;
  return (
    <g className="scene-c" style={{ opacity: 0 }}>
      {C_BARS.map((h, i) => {
        const x = 60 + i * (barW + gap);
        return (
          <rect
            key={`cb-${i}`}
            className="c-bar"
            x={x}
            y={baseY - h}
            width={barW}
            height={h}
            rx="4"
            fill="url(#cbar)"
            style={{ transformOrigin: `${x + barW / 2}px ${baseY}px` }}
          />
        );
      })}
      <path
        className="c-trend"
        d={`M 77 ${280 - 110} L 129 ${280 - 150} L 181 ${280 - 130} L 233 ${280 - 200} L 285 ${280 - 240} L 337 ${280 - 210}`}
        fill="none"
        stroke="#57E1CE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
      <line x1="50" y1={baseY} x2="360" y2={baseY} stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
      <g className="c-badge" style={{ opacity: 0 }}>
        <rect x="248" y="40" width="120" height="34" rx="17" fill="rgba(87,225,206,0.10)" stroke="rgba(87,225,206,0.4)" />
        <circle cx="266" cy="57" r="4" fill="#57E1CE" />
        <text x="280" y="61" className="fill-ink font-mono text-[12px]">94% confidence</text>
      </g>
      <text x={50} y={40} className="fill-ink-faint font-mono text-[11px]" style={{ letterSpacing: "0.1em" }}>
        INSIGHT
      </text>
      <defs>
        <linearGradient id="cbar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7D8CFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7D8CFF" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </g>
  );
}

/* --------------------------------- Section --------------------------------- */

export function InsightFlow() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced || !rootRef.current || !pinRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      let prev = -1;
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: rootRef.current!,
          start: "top top",
          end: "+=320%",
          scrub: 1,
          pin: pinRef.current!,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const idx = p < 0.36 ? 0 : p < 0.7 ? 1 : 2;
            if (idx !== prev) {
              prev = idx;
              setActive(idx);
            }
          },
        },
      });

      // Stage 1 — Ingest.
      tl.from(".a-node", { scale: 0, transformOrigin: "center", opacity: 0, stagger: 0.05, duration: 0.4 })
        .from(".a-line", { strokeDashoffset: 1, strokeDasharray: 1, duration: 0.6, stagger: 0.04 }, "-=0.2")
        .from(".a-core", { scale: 0, transformOrigin: "center", opacity: 0, duration: 0.4 }, "-=0.3")
        .to({}, { duration: 0.6 }); // hold

      // Ingest → Analyze.
      tl.to(".scene-a", { autoAlpha: 0, y: -24, duration: 0.5 })
        .fromTo(".scene-b", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "<")
        .from(".b-edge", { strokeDashoffset: 1, strokeDasharray: 1, opacity: 0, duration: 0.6, stagger: 0.03 }, "-=0.2")
        .from(".b-node", { scale: 0, transformOrigin: "center", opacity: 0, stagger: 0.04, duration: 0.4 }, "-=0.4")
        .to(".b-node", { filter: "brightness(1.15)", duration: 0.3, yoyo: true, repeat: 1 })
        .to({}, { duration: 0.5 });

      // Analyze → Generate.
      tl.to(".scene-b", { autoAlpha: 0, y: -24, duration: 0.5 })
        .fromTo(".scene-c", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "<")
        .from(".c-bar", { scaleY: 0, transformOrigin: "bottom", opacity: 0, stagger: 0.06, duration: 0.5 }, "-=0.2")
        .from(".c-trend", { strokeDashoffset: 1, strokeDasharray: 1, duration: 0.6 }, "-=0.3")
        .to(".c-badge", { autoAlpha: 1, duration: 0.4 }, "-=0.2")
        .to({}, { duration: 0.4 });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="insight-flow" ref={rootRef} className="relative border-t border-line">
      <div ref={pinRef} className="flex min-h-screen items-center py-20">
        <div className="shell grid w-full gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
          {/* Left: the stage narrative. */}
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-5 max-w-md text-display-md font-medium text-ink">
              Three stages, one continuous pipeline.
            </h2>

            <ol className="mt-10 space-y-1">
              {stages.map((s, i) => {
                const isActive = i === active;
                return (
                  <li key={s.id}>
                    <div
                      className={cn(
                        "group relative rounded-xl border px-5 py-4 transition-colors duration-500",
                        isActive ? "border-line-strong bg-surface" : "border-transparent hover:bg-white/[0.02]"
                      )}
                    >
                      {/* Active rail. */}
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 rounded-full bg-accent transition-all duration-500",
                          isActive && "h-8"
                        )}
                      />
                      <div className="flex items-baseline gap-4">
                        <span
                          className={cn(
                            "font-mono text-xs transition-colors duration-500",
                            isActive ? "text-accent" : "text-ink-faint"
                          )}
                        >
                          {s.index}
                        </span>
                        <div>
                          <h3
                            className={cn(
                              "text-lg font-medium transition-colors duration-500",
                              isActive ? "text-ink" : "text-ink-muted"
                            )}
                          >
                            {s.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.summary}</p>
                          <div
                            className={cn(
                              "grid transition-all duration-500",
                              isActive ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            )}
                          >
                            <div className="overflow-hidden">
                              <p className="text-sm leading-relaxed text-ink-faint">{s.detail}</p>
                              <div className="mt-3 flex items-center gap-2 font-mono text-xs">
                                <span className="text-ink-faint">{s.metric.label}</span>
                                <span className="text-signal">{s.metric.value}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right: the animated geometry. */}
          <div className="panel relative aspect-[4/3] w-full overflow-hidden bg-surface-sunken">
            <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_60%_40%,rgba(125,140,255,0.06),transparent)]" />
            <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" role="img" aria-label="Pipeline visualisation">
              <SceneIngest />
              <SceneAnalyze />
              <SceneGenerate />
            </svg>
            <div className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              stage {String(active + 1).padStart(2, "0")} / 03
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
