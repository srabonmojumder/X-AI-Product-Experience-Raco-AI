"use client";

import { motion } from "framer-motion";
import { areaSeries, barSeries, donutSeries } from "@/lib/data";
import { ease } from "@/lib/motion";

/* Catmull-Rom → cubic bezier for smooth, natural curves. */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function toPoints(values: number[], w: number, h: number, pad: number, max: number) {
  return values.map((v, i) => ({
    x: pad + (i * (w - pad * 2)) / (values.length - 1),
    y: h - pad - (v / max) * (h - pad * 2),
  }));
}

/* ------------------------------- Sparkline ------------------------------- */

export function Sparkline({ data, color = "#57E1CE" }: { data: number[]; color?: string }) {
  const w = 96;
  const h = 30;
  const max = Math.max(...data) * 1.1;
  const path = smoothPath(toPoints(data, w, h, 2, max));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-24" preserveAspectRatio="none" aria-hidden>
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: ease.outExpo }}
      />
    </svg>
  );
}

/* ------------------------------- Area chart ------------------------------ */

export function AreaChart() {
  const w = 560;
  const h = 220;
  const pad = 24;
  const max = Math.max(...areaSeries.signal, ...areaSeries.noise) * 1.15;

  const signalPts = toPoints(areaSeries.signal, w, h, pad, max);
  const noisePts = toPoints(areaSeries.noise, w, h, pad, max);
  const signalLine = smoothPath(signalPts);
  const noiseLine = smoothPath(noisePts);
  const first = signalPts[0];
  const last = signalPts[signalPts.length - 1];
  const area = `${signalLine} L ${last.x} ${h - pad} L ${first.x} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" role="img" aria-label="Signal vs noise over the week">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#57E1CE" stopOpacity="0.28" />
          <stop offset="1" stopColor="#57E1CE" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* baseline grid */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={pad}
          x2={w - pad}
          y1={pad + t * (h - pad * 2)}
          y2={pad + t * (h - pad * 2)}
          stroke="rgba(148,163,184,0.08)"
          strokeWidth="1"
        />
      ))}

      <motion.path
        d={area}
        fill="url(#areaFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5, ease: ease.outExpo }}
      />
      <motion.path
        d={noiseLine}
        fill="none"
        stroke="rgba(148,163,184,0.4)"
        strokeWidth="1.5"
        strokeDasharray="3 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: ease.outExpo }}
      />
      <motion.path
        d={signalLine}
        fill="none"
        stroke="#57E1CE"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease: ease.outExpo }}
      />
      {signalPts.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="#0B0D12"
          stroke="#57E1CE"
          strokeWidth="1.5"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.05, ease: ease.outExpo }}
        />
      ))}
    </svg>
  );
}

/* ------------------------------- Bar chart ------------------------------- */

export function BarChart() {
  const w = 260;
  const h = 180;
  const pad = 16;
  const max = Math.max(...barSeries.map((b) => b.value)) * 1.1;
  const bw = (w - pad * 2) / barSeries.length - 10;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" role="img" aria-label="Insights by domain">
      {barSeries.map((b, i) => {
        const barH = (b.value / max) * (h - pad * 2 - 14);
        const x = pad + i * ((w - pad * 2) / barSeries.length) + 5;
        const y = h - pad - 14 - barH;
        return (
          <g key={b.label}>
            <motion.rect
              x={x}
              y={y}
              width={bw}
              height={barH}
              rx="3"
              fill="#7D8CFF"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: ease.outExpo }}
              style={{ transformBox: "fill-box", transformOrigin: "bottom", opacity: 0.85 }}
            />
            <text
              x={x + bw / 2}
              y={h - 3}
              textAnchor="middle"
              className="fill-ink-faint font-mono text-[8px]"
              style={{ letterSpacing: "0.05em" }}
            >
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------- Donut chart ----------------------------- */

export function DonutChart() {
  const size = 160;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = donutSeries.reduce((s, d) => s + d.value, 0);
  let offset = 0;

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-40 w-40 -rotate-90" role="img" aria-label="Automation actions by type">
        {donutSeries.map((d, i) => {
          const frac = d.value / total;
          const dash = frac * c;
          const seg = (
            <motion.circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeLinecap="butt"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              initial={{ opacity: 0, pathLength: 0 }}
              whileInView={{ opacity: 1, pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: ease.outExpo }}
            />
          );
          offset += dash;
          return seg;
        })}
      </svg>
      <div className="absolute text-center">
        <div className="font-mono text-xl text-ink">{total}</div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">actions/h</div>
      </div>
    </div>
  );
}
