import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Database,
  Boxes,
  Sparkles,
  Workflow,
  Settings,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Insight Flow — the three real stages of the pipeline               */
/* (numbering is justified here: it is a genuine ordered sequence)    */
/* ------------------------------------------------------------------ */

export interface Stage {
  id: string;
  index: string;
  title: string;
  summary: string;
  detail: string;
  metric: { label: string; value: string };
}

export const stages: Stage[] = [
  {
    id: "ingest",
    index: "01",
    title: "Ingest",
    summary: "Connect every source into one typed stream.",
    detail:
      "Warehouses, event streams, and files land continuously. Schemas are inferred, deduplicated, and versioned the moment data arrives — no brittle pipelines to babysit.",
    metric: { label: "Sources unified", value: "2,481" },
  },
  {
    id: "analyze",
    index: "02",
    title: "Analyze",
    summary: "Models reason over the graph, not just the rows.",
    detail:
      "Xai builds a live semantic graph across your data and runs analysis against relationships — surfacing correlations, anomalies, and drivers that flat queries miss.",
    metric: { label: "Signals evaluated", value: "1.2M/s" },
  },
  {
    id: "generate",
    index: "03",
    title: "Generate",
    summary: "Turn findings into decisions and actions.",
    detail:
      "Every insight ships with its reasoning, a confidence band, and a ready-to-run automation. Approve it once and Xai keeps it running.",
    metric: { label: "Decision latency", value: "480ms" },
  },
];

/* ------------------------------------------------------------------ */
/* Dashboard — sidebar, tabs, KPIs, charts, table                     */
/* ------------------------------------------------------------------ */

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}

export const navItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "datasets", label: "Datasets", icon: Database, count: 24 },
  { id: "models", label: "Models", icon: Boxes, count: 6 },
  { id: "insights", label: "Insights", icon: Sparkles, count: 12 },
  { id: "automations", label: "Automations", icon: Workflow, count: 3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export type TabId = "overview" | "insights" | "automations";

export const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "insights", label: "Insights" },
  { id: "automations", label: "Automations" },
];

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: "up" | "down";
  spark: number[];
}

export const kpis: Kpi[] = [
  {
    id: "throughput",
    label: "Data throughput",
    value: "84.2 GB/h",
    delta: 12.4,
    trend: "up",
    spark: [12, 18, 14, 22, 26, 24, 31, 34, 30, 38, 42, 47],
  },
  {
    id: "insights",
    label: "Insights generated",
    value: "1,204",
    delta: 8.1,
    trend: "up",
    spark: [40, 42, 38, 44, 48, 50, 47, 53, 58, 55, 61, 66],
  },
  {
    id: "accuracy",
    label: "Model accuracy",
    value: "97.3%",
    delta: 0.6,
    trend: "up",
    spark: [88, 90, 89, 91, 92, 93, 92, 94, 95, 95, 96, 97],
  },
  {
    id: "latency",
    label: "Decision latency",
    value: "480 ms",
    delta: -14.2,
    trend: "down",
    spark: [80, 74, 70, 66, 61, 58, 55, 52, 50, 48, 47, 44],
  },
];

/** Two-series area chart: signal detected vs. noise filtered. */
export const areaSeries = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  signal: [32, 41, 38, 55, 62, 58, 74],
  noise: [22, 26, 24, 30, 28, 25, 27],
};

/** Category bar chart — insights by domain. */
export const barSeries = [
  { label: "Revenue", value: 82 },
  { label: "Product", value: 64 },
  { label: "Growth", value: 71 },
  { label: "Ops", value: 48 },
  { label: "Risk", value: 39 },
];

/** Donut — where automations act. */
export const donutSeries = [
  { label: "Alerts", value: 42, color: "#57E1CE" },
  { label: "Routing", value: 28, color: "#7D8CFF" },
  { label: "Reports", value: 18, color: "#A7B1FF" },
  { label: "Other", value: 12, color: "#3A4150" },
];

export interface InsightRow {
  id: string;
  title: string;
  domain: string;
  confidence: number;
  impact: "High" | "Medium" | "Low";
  trend: "up" | "down";
}

export const insightRows: InsightRow[] = [
  { id: "INS-4821", title: "Churn risk rising in EU enterprise cohort", domain: "Revenue", confidence: 94, impact: "High", trend: "up" },
  { id: "INS-4817", title: "Onboarding drop-off at step 3 correlates with plan tier", domain: "Product", confidence: 88, impact: "High", trend: "down" },
  { id: "INS-4809", title: "Support volume predicts expansion within 30 days", domain: "Growth", confidence: 81, impact: "Medium", trend: "up" },
  { id: "INS-4802", title: "Ingestion latency spikes trace to a single connector", domain: "Ops", confidence: 76, impact: "Medium", trend: "down" },
  { id: "INS-4798", title: "Anomalous refund pattern in APAC region", domain: "Risk", confidence: 69, impact: "Low", trend: "up" },
];

export const trendIcon = { up: TrendingUp, down: TrendingDown };

/* ------------------------------------------------------------------ */
/* Signature interaction — the four narrative formations              */
/* ------------------------------------------------------------------ */

export const formations = [
  { id: "raw", label: "Raw", caption: "Unstructured signal" },
  { id: "grid", label: "Structured", caption: "Typed & indexed" },
  { id: "flow", label: "Flow", caption: "Reasoned over graph" },
  { id: "insight", label: "Insight", caption: "Ranked & actionable" },
] as const;

export type FormationId = (typeof formations)[number]["id"];
