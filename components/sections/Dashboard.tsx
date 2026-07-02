"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease, inView } from "@/lib/motion";
import {
  kpis,
  insightRows,
  tabs,
  trendIcon,
  type TabId,
} from "@/lib/data";
import { Reveal, Eyebrow, WindowFrame } from "@/components/ui/primitives";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Sparkline, AreaChart, BarChart, DonutChart } from "@/components/dashboard/charts";

/* Shared entrance for a grid of cards. */
const gridParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const gridChild = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.outExpo } },
};

/* Panels fade/slide as tabs switch. */
const panelVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.outExpo } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.22, ease: ease.outExpo } },
};

/* ------------------------------- Card shell ------------------------------ */

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={gridChild}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className={cn(
        "rounded-xl border border-line bg-surface p-4 transition-colors duration-300 hover:border-line-strong",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------- Overview -------------------------------- */

function OverviewPanel() {
  return (
    <motion.div variants={gridParent} initial="hidden" animate="show" className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((k) => {
          const up = k.trend === "up";
          const Trend = trendIcon[k.trend];
          return (
            <Card key={k.id}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[12px] text-ink-muted">{k.label}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-mono text-[11px]",
                    up ? "text-signal-cyan" : "text-ink-muted"
                  )}
                >
                  <Trend className="h-3 w-3" strokeWidth={2} />
                  {Math.abs(k.delta)}%
                </span>
              </div>
              <div className="mt-2 flex items-end justify-between gap-2">
                <span className="text-[22px] font-medium tracking-tight text-ink">{k.value}</span>
                <Sparkline data={k.spark} color={up ? "#57E1CE" : "#7D8CFF"} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[13px] font-medium text-ink">Signal vs. noise</div>
              <div className="mt-0.5 font-mono text-[11px] text-ink-faint">last 7 days</div>
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px] text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-cyan" /> Signal
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-[2px] w-3 rounded-full bg-ink-faint" /> Noise
              </span>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <AreaChart />
          </div>
        </Card>

        <Card>
          <div className="mb-3 text-[13px] font-medium text-ink">Insights by domain</div>
          <div className="h-[220px] w-full">
            <BarChart />
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

/* ------------------------------- Insights -------------------------------- */

const impactStyle: Record<string, string> = {
  High: "border-signal-cyan/30 bg-signal-cyan/10 text-signal-cyan",
  Medium: "border-accent/30 bg-accent-dim text-accent-soft",
  Low: "border-line-strong bg-white/[0.03] text-ink-muted",
};

function InsightsPanel() {
  return (
    <motion.div variants={gridParent} initial="hidden" animate="show">
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint sm:grid-cols-[80px_1fr_110px_130px_70px]">
          <span className="hidden sm:block">ID</span>
          <span>Insight</span>
          <span className="hidden text-right sm:block">Domain</span>
          <span className="hidden sm:block">Confidence</span>
          <span className="text-right">Impact</span>
        </div>

        {insightRows.map((row) => {
          const Trend = trendIcon[row.trend];
          return (
            <motion.div
              key={row.id}
              variants={gridChild}
              className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line px-4 py-3 transition-colors duration-300 last:border-0 hover:bg-white/[0.02] sm:grid-cols-[80px_1fr_110px_130px_70px]"
            >
              <span className="hidden font-mono text-[11px] text-ink-faint sm:block">{row.id}</span>

              <div className="flex min-w-0 items-center gap-2">
                <Trend
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    row.trend === "up" ? "text-signal-cyan" : "text-ink-muted"
                  )}
                  strokeWidth={2}
                />
                <span className="truncate text-[13px] text-ink group-hover:text-white">{row.title}</span>
              </div>

              <span className="hidden text-right text-[12px] text-ink-muted sm:block">{row.domain}</span>

              <div className="hidden items-center gap-2 sm:flex">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-signal-cyan to-signal-indigo"
                    initial={{ width: 0 }}
                    animate={{ width: `${row.confidence}%` }}
                    transition={{ duration: 0.9, ease: ease.outExpo, delay: 0.2 }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-[11px] text-ink-muted">{row.confidence}</span>
              </div>

              <div className="flex justify-end">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                    impactStyle[row.impact]
                  )}
                >
                  {row.impact}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ------------------------------ Automations ------------------------------ */

const automations = [
  {
    id: "a1",
    name: "Alert on churn-risk spike",
    desc: "Notify #revenue when EU churn signal crosses 90%.",
    runs: "142 runs",
    on: true,
  },
  {
    id: "a2",
    name: "Route anomalies to on-call",
    desc: "Page the on-call engineer for Sev-1 ingestion faults.",
    runs: "38 runs",
    on: true,
  },
  {
    id: "a3",
    name: "Weekly insight digest",
    desc: "Compile ranked insights into a Monday report.",
    runs: "12 runs",
    on: false,
  },
];

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300",
        on ? "bg-accent/80" : "bg-white/[0.08]"
      )}
      aria-hidden
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={cn(
          "inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm",
          on ? "ml-[18px]" : "ml-[3px]"
        )}
      />
    </span>
  );
}

function AutomationsPanel() {
  return (
    <motion.div variants={gridParent} initial="hidden" animate="show" className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        {automations.map((a) => (
          <motion.div
            key={a.id}
            variants={gridChild}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 transition-colors duration-300 hover:border-line-strong"
          >
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-lg border",
                a.on
                  ? "border-accent/30 bg-accent-dim text-accent-soft"
                  : "border-line bg-white/[0.02] text-ink-faint"
              )}
            >
              {a.on ? <Zap className="h-4 w-4" strokeWidth={1.75} /> : <Check className="h-4 w-4" strokeWidth={1.75} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[13px] font-medium text-ink">
                {a.name}
              </div>
              <div className="mt-0.5 truncate text-[12px] text-ink-muted">{a.desc}</div>
            </div>
            <span className="hidden font-mono text-[10px] text-ink-faint sm:block">{a.runs}</span>
            <Toggle on={a.on} />
          </motion.div>
        ))}
      </div>

      <Card>
        <div className="mb-1 text-[13px] font-medium text-ink">Actions this hour</div>
        <div className="mb-2 font-mono text-[11px] text-ink-faint">by type</div>
        <DonutChart />
        <div className="mt-4 space-y-1.5">
          {[
            { label: "Alerts", color: "#57E1CE", value: 42 },
            { label: "Routing", color: "#7D8CFF", value: 28 },
            { label: "Reports", color: "#A7B1FF", value: 18 },
            { label: "Other", color: "#3A4150", value: 12 },
          ].map((d) => (
            <div key={d.label} className="flex items-center gap-2 text-[12px]">
              <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
              <span className="flex-1 text-ink-muted">{d.label}</span>
              <span className="font-mono text-ink-faint">{d.value}%</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

/* -------------------------------- Section -------------------------------- */

export function Dashboard() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <section id="dashboard" className="relative border-t border-line py-24 md:py-32">
      <div className="shell">
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>The workspace</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 text-display-md font-medium text-ink">
                Every insight, one calm surface.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                A live view of the pipeline — throughput, ranked insights, and the automations
                acting on them. Switch tabs to move through the product.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.06}>
          <WindowFrame label="app.xai.dev/workspace">
            <div className="flex min-h-[560px]">
              <Sidebar tab={tab} onSelect={setTab} />

              <div className="flex min-w-0 flex-1 flex-col">
                <TopBar />

                {/* Tab bar with sliding underline */}
                <div className="flex items-center gap-1 border-b border-line px-4">
                  {tabs.map((t) => {
                    const active = t.id === tab;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={cn(
                          "relative px-3 py-3 text-[13px] transition-colors duration-300",
                          active ? "text-ink" : "text-ink-muted hover:text-ink"
                        )}
                      >
                        {t.label}
                        {active && (
                          <motion.span
                            layoutId="tab-underline"
                            className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-signal-cyan to-signal-indigo"
                            transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Panel body */}
                <div className="flex-1 bg-surface-sunken/40 p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab}
                      variants={panelVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {tab === "overview" && <OverviewPanel />}
                      {tab === "insights" && <InsightsPanel />}
                      {tab === "automations" && <AutomationsPanel />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </WindowFrame>
        </Reveal>
      </div>
    </section>
  );
}
