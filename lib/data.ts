/**
 * Single source of truth for the demo's content, so the components stay
 * about presentation and motion. All figures are illustrative.
 */

export const nav = {
  brand: { mark: "XAI", tag: "Living Intelligence" },
  links: [
    { label: "Signal", href: "#top" },
    { label: "Flow", href: "#flow" },
    { label: "Workspace", href: "#workspace" },
    { label: "Bloom", href: "#bloom" },
  ],
  cta: { label: "Request access", href: "#workspace" },
};

export type Stage = {
  index: string;
  name: string;
  summary: string;
  detail: string;
  metric: { label: string; value: string };
};

export const stages: Stage[] = [
  {
    index: "01",
    name: "Listen",
    summary:
      "Every source — warehouses, events, docs, APIs — gathered gently into one living field.",
    detail:
      "Schema drift and duplicates are normalised at the edge, so nothing downstream has to guess.",
    metric: { label: "throughput", value: "4.4K rows/s" },
  },
  {
    index: "02",
    name: "Connect",
    summary:
      "The model feels for the connections — growing a living semantic graph of what relates to what.",
    detail:
      "Weak signals reinforce each other into structure; the strongest relationships surface first.",
    metric: { label: "edges scored", value: "1.2M" },
  },
  {
    index: "03",
    name: "Bloom",
    summary:
      "The shape settles into a ranked, quantified insight — with a confidence you can defend.",
    detail:
      "Each insight ships with its evidence trail and a recommended action, ready to automate.",
    metric: { label: "confidence", value: "94%" },
  },
];

export type Kpi = {
  label: string;
  value: string;
  delta: number;
  up: boolean;
  spark: number[];
};

export const kpis: Kpi[] = [
  { label: "Sources synced", value: "42", delta: 8, up: true, spark: [3, 5, 4, 6, 7, 6, 9] },
  { label: "Insights / day", value: "318", delta: 12, up: true, spark: [10, 12, 11, 15, 14, 18, 22] },
  { label: "Median confidence", value: "94%", delta: 3, up: true, spark: [80, 82, 85, 88, 90, 92, 94] },
  { label: "Actions automated", value: "1.2K", delta: -2, up: false, spark: [20, 18, 19, 17, 16, 15, 14] },
];

export const signalSeries = [60, 72, 66, 88, 84, 110, 102, 120, 116, 140, 150, 168];
export const noiseSeries = [40, 44, 38, 52, 48, 46, 54, 50, 58, 52, 60, 56];

export const domainBars: [string, number][] = [
  ["Revenue", 82],
  ["Product", 64],
  ["Ops", 48],
  ["Growth", 72],
  ["Risk", 38],
];

export type Insight = {
  id: string;
  title: string;
  domain: string;
  confidence: number;
  impact: "high" | "med" | "low";
  up: boolean;
};

export const insights: Insight[] = [
  { id: "IX-207", title: "Churn risk rising in EU enterprise cohort", domain: "Revenue", confidence: 94, impact: "high", up: true },
  { id: "IX-198", title: "Onboarding drop-off at step 3 correlates with trial length", domain: "Product", confidence: 88, impact: "high", up: true },
  { id: "IX-186", title: "Ingestion latency spike traced to source #14", domain: "Ops", confidence: 76, impact: "med", up: false },
  { id: "IX-171", title: "Referral loops outperform paid on 60-day LTV", domain: "Growth", confidence: 82, impact: "med", up: true },
  { id: "IX-160", title: "Anomalous access pattern flagged in region APAC", domain: "Risk", confidence: 69, impact: "low", up: false },
];

export type Automation = {
  name: string;
  desc: string;
  runs: string;
  on: boolean;
};

export const automations: Automation[] = [
  { name: "Alert on churn-risk spike", desc: "Notify #revenue when EU churn signal crosses 90%.", runs: "142 runs", on: true },
  { name: "Route anomalies to on-call", desc: "Page the on-call engineer for Sev-1 ingestion faults.", runs: "38 runs", on: true },
  { name: "Weekly insight digest", desc: "Compile ranked insights into a Monday report.", runs: "12 runs", on: false },
];

export const actionDonut: [string, string, number][] = [
  ["Alerts", "var(--violet)", 42],
  ["Routing", "var(--coral)", 28],
  ["Reports", "var(--coral-soft)", 18],
  ["Other", "var(--ink-faint)", 12],
];

/** The four states the signature cluster morphs between. */
export type FormationKey = "seed" | "bloom" | "flow" | "ranked";

export const formations: { key: FormationKey; label: string; caption: string }[] = [
  { key: "seed", label: "Seed", caption: "Raw signal · unshaped" },
  { key: "bloom", label: "Bloom", caption: "Understanding · taking shape" },
  { key: "flow", label: "Flow", caption: "Related · living flow" },
  { key: "ranked", label: "Ranked", caption: "Ranked · ready to act" },
];
