"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Zap, Check } from "lucide-react";
import { SectionHeading, Reveal, WindowFrame } from "@/components/ui/primitives";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Spark, AreaChart, BarChart, Donut } from "@/components/dashboard/charts";
import { cn } from "@/lib/utils";
import { kpis, insights, automations, type Automation } from "@/lib/data";

const TABS = ["Overview", "Insights", "Automations"] as const;
type Tab = (typeof TABS)[number];

const chipClass: Record<string, string> = {
  high: "text-violet border-violet/40 bg-violet-dim",
  med: "text-coral border-coral/40 bg-coral-dim",
  low: "text-ink-faint border-line-strong",
};

function OverviewView() {
  return (
    <div className="p-5">
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-paper-raised p-4 shadow-soft">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
              <span>{k.label}</span>
              <span className={cn("flex items-center", k.up ? "text-violet" : "text-ink-muted")}>
                {k.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {Math.abs(k.delta)}%
              </span>
            </div>
            <div className="text-living mt-3 font-display text-[2.15rem] font-extrabold leading-none">
              {k.value}
            </div>
            <Spark data={k.spark} color={k.up ? "var(--violet)" : "var(--coral-soft)"} />
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3.5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl bg-paper-raised p-4 shadow-soft">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <div className="font-display text-[15px] font-bold text-ink">Signal vs. noise</div>
              <div className="mt-0.5 font-mono text-[11px] text-ink-faint">last 7 days · resolution 1h</div>
            </div>
            <div className="flex gap-4 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full bg-coral" />
                Signal
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-0.5 w-3 bg-ink-faint" />
                Noise
              </span>
            </div>
          </div>
          <AreaChart />
        </div>
        <div className="rounded-2xl bg-paper-raised p-4 shadow-soft">
          <div className="mb-3.5 font-display text-[15px] font-bold text-ink">Insights by domain</div>
          <BarChart />
        </div>
      </div>
    </div>
  );
}

function InsightsView() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, []);
  return (
    <div className="p-5">
      <div className="overflow-hidden rounded-2xl bg-paper-raised shadow-soft">
        <div className="grid grid-cols-[68px_1fr_92px_150px_64px] items-center gap-3 border-b border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
          <span>ID</span>
          <span>Insight</span>
          <span>Domain</span>
          <span>Confidence</span>
          <span className="text-right">Impact</span>
        </div>
        {insights.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-[68px_1fr_92px_150px_64px] items-center gap-3 border-b border-line px-4 py-3.5 text-sm transition-colors last:border-0 hover:bg-black/[0.015]"
          >
            <span className="font-mono text-xs text-ink-faint">{r.id}</span>
            <span className="flex min-w-0 items-center gap-2">
              {r.up ? (
                <ArrowUpRight size={13} className="shrink-0 text-violet" />
              ) : (
                <ArrowDownRight size={13} className="shrink-0 text-ink-faint" />
              )}
              <span className="truncate text-ink">{r.title}</span>
            </span>
            <span className="text-ink-muted">{r.domain}</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-strong">
                <span
                  className="bg-living block h-full rounded-full transition-[width] duration-1000 ease-out-expo"
                  style={{ width: mounted ? `${r.confidence}%` : "0%" }}
                />
              </span>
              <span className="font-mono text-xs text-ink-muted">{r.confidence}</span>
            </span>
            <span className="text-right">
              <span
                className={cn(
                  "inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
                  chipClass[r.impact]
                )}
              >
                {r.impact}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutoRow({ a }: { a: Automation }) {
  const [on, setOn] = useState(a.on);
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl bg-paper-raised p-4 shadow-soft transition-opacity",
        !on && "opacity-70"
      )}
    >
      <div
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
          on ? "border-coral/40 bg-coral-dim text-coral" : "border-line-strong text-ink-faint"
        )}
      >
        {on ? <Zap size={17} /> : <Check size={17} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-ink">{a.name}</div>
        <div className="text-sm text-ink-muted">{a.desc}</div>
      </div>
      <span className="hidden font-mono text-xs text-ink-faint sm:inline">{a.runs}</span>
      <button
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          on ? "bg-coral" : "bg-line-strong"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            on ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

function AutomationsView() {
  return (
    <div className="grid gap-3.5 p-5 lg:grid-cols-[1.6fr_1fr]">
      <div className="flex flex-col gap-3.5">
        {automations.map((a) => (
          <AutoRow key={a.name} a={a} />
        ))}
      </div>
      <div className="rounded-2xl bg-paper-raised p-4 shadow-soft">
        <div className="font-display text-[15px] font-bold text-ink">Actions this hour</div>
        <div className="mb-2 mt-0.5 font-mono text-[11px] text-ink-faint">by type</div>
        <Donut />
      </div>
    </div>
  );
}

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <section id="workspace" className="relative py-24 md:py-32">
      <div className="shell">
        <div className="mb-9">
          <SectionHeading
            eyebrow="Your workspace"
            title="Every insight, one calm surface."
            lede="Everything the system has learned, gathered on one calm surface — throughput, ranked insights, and the automations already acting on them. Switch panels to move through it."
          />
        </div>

        <Reveal>
          <WindowFrame url="app.xai.dev/workspace">
            <div className="flex">
              <Sidebar />
              <div className="min-w-0 flex-1">
                <TopBar />
                {/* Tabs */}
                <div className="flex gap-1 border-b border-line px-3">
                  {TABS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={cn(
                        "relative px-3 py-3.5 text-[13.5px] transition-colors",
                        tab === t ? "text-ink" : "text-ink-muted hover:text-ink"
                      )}
                    >
                      {t}
                      {tab === t && (
                        <motion.span
                          layoutId="tab-underline"
                          className="bg-coral absolute inset-x-3 -bottom-px h-0.5 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.32, 1] }}
                  >
                    {tab === "Overview" && <OverviewView />}
                    {tab === "Insights" && <InsightsView />}
                    {tab === "Automations" && <AutomationsView />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </WindowFrame>
        </Reveal>
      </div>
    </section>
  );
}
