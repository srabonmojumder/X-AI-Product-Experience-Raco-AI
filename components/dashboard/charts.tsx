"use client";

import { motion } from "framer-motion";
import { signalSeries, noiseSeries, domainBars, actionDonut } from "@/lib/data";

/** Tiny sparkline used inside KPI cards. */
export function Spark({ data, color }: { data: number[]; color: string }) {
  const w = 90;
  const h = 26;
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const rng = mx - mn || 1;
  const d = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * w} ${h - ((v - mn) / rng) * h}`)
    .join(" ");
  return (
    <svg viewBox="0 0 90 26" width="100%" height="26" preserveAspectRatio="none" className="mt-2">
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Signal vs. noise — filled area + dashed noise line. */
export function AreaChart() {
  const W = 560;
  const H = 210;
  const toXY = (arr: number[]) =>
    arr.map((v, i) => [(i / (arr.length - 1)) * W, H - 8 - (v / 180) * (H - 30)] as const);
  const sp = toXY(signalSeries);
  const np = toXY(noiseSeries);
  const line = (p: readonly (readonly [number, number])[]) =>
    p.map((c, i) => `${i === 0 ? "M" : "L"} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(" ");
  const area = `${line(sp)} L ${W} ${H} L 0 ${H} Z`;

  return (
    <svg viewBox="0 0 560 210" width="100%" height="210" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--coral)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--coral)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((g) => {
        const y = 8 + g * ((H - 24) / 3);
        return <line key={g} x1="0" y1={y} x2={W} y2={y} stroke="var(--line)" strokeWidth="1" />;
      })}
      <path d={area} fill="url(#ag)" />
      <path d={line(np)} fill="none" stroke="var(--ink-faint)" strokeWidth="1.4" strokeDasharray="3 3" />
      <motion.path
        d={line(sp)}
        fill="none"
        stroke="var(--coral)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.32, 1] }}
      />
      {sp
        .filter((_, i) => i % 3 === 0)
        .map((c, i) => (
          <circle key={i} cx={c[0].toFixed(1)} cy={c[1].toFixed(1)} r="2.6" fill="var(--paper-raised)" stroke="var(--coral)" strokeWidth="1.5" />
        ))}
    </svg>
  );
}

/** Insights by domain — bars that grow into view. */
export function BarChart() {
  const W = 240;
  const H = 210;
  const bw = 30;
  const gap = (W - domainBars.length * bw) / (domainBars.length + 1);
  const mx = 100;
  return (
    <svg viewBox="0 0 240 210" width="100%" height="210">
      {domainBars.map(([label, val], i) => {
        const x = gap + i * (bw + gap);
        const h = (val / mx) * (H - 40);
        const y = H - 24 - h;
        return (
          <g key={label}>
            <motion.rect
              x={x}
              width={bw}
              rx="4"
              fill="var(--coral)"
              opacity={0.4 + (val / mx) * 0.6}
              initial={{ height: 0, y: H - 24 }}
              whileInView={{ height: h, y }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.32, 1] }}
            />
            <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontFamily="'JetBrains Mono'" fontSize="9" fill="var(--ink-faint)">
              {label}
            </text>
          </g>
        );
      })}
      <line x1="0" y1={H - 24} x2={W} y2={H - 24} stroke="var(--line-strong)" strokeWidth="1" />
    </svg>
  );
}

/** Actions-by-type donut. */
export function Donut() {
  const cx = 80;
  const cy = 80;
  const r = 52;
  const rw = 18;
  let a0 = -Math.PI / 2;
  const total = 100;
  const arc = (a: number, b: number) => {
    const x1 = cx + r * Math.cos(a);
    const y1 = cy + r * Math.sin(a);
    const x2 = cx + r * Math.cos(b);
    const y2 = cy + r * Math.sin(b);
    const large = b - a > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  return (
    <div>
      <svg viewBox="0 0 160 160" width="100%" height="150">
        {actionDonut.map(([label, color, val]) => {
          const a1 = a0 + (val / total) * Math.PI * 2;
          const p = <path key={label} d={arc(a0, a1)} fill="none" stroke={color} strokeWidth={rw} />;
          a0 = a1;
          return p;
        })}
        <text x="80" y="76" textAnchor="middle" fontFamily="'Bricolage Grotesque'" fontWeight="800" fontSize="22" fill="var(--ink)">
          100
        </text>
        <text x="80" y="94" textAnchor="middle" fontFamily="'JetBrains Mono'" fontSize="8" letterSpacing="1" fill="var(--ink-faint)">
          ACTIONS
        </text>
      </svg>
      <div className="mt-3">
        {actionDonut.map(([label, color, val]) => (
          <div key={label} className="mt-1.5 flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            <span className="flex-1 text-ink-muted">{label}</span>
            <span className="font-mono text-ink-faint">{val}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
