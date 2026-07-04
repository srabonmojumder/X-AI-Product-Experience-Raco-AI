"use client";

import { useEffect, useState } from "react";
import { nav } from "@/lib/data";

const cols: { title: string; links: string[] }[] = [
  { title: "Product", links: ["Signal", "Flow", "Workspace", "Bloom"] },
  { title: "Company", links: ["About", "Careers", "Security"] },
  { title: "Connect", links: ["Request access", "Docs", "Status"] },
];

export function Footer() {
  const [clock, setClock] = useState("00:00:00");
  useEffect(() => {
    const id = setInterval(() => setClock(new Date().toLocaleTimeString("en-GB")), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-line pt-20">
      <div className="shell">
        <div className="grid gap-10 pb-16 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="font-display text-2xl font-extrabold tracking-tight text-ink">
              {nav.brand.mark}
            </div>
            <p className="mt-3 max-w-sm text-ink-muted">
              A living workspace that grows raw data into decisions your team can trust.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                  {c.title}
                </h4>
                <div className="mt-3 flex flex-col gap-2">
                  {c.links.map((l) => (
                    <a key={l} href="#top" className="text-sm text-ink-muted transition-colors hover:text-coral">
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Oversized outline watermark */}
        <div
          aria-hidden
          className="pointer-events-none select-none text-center font-display text-[26vw] font-extrabold leading-none tracking-tighter text-transparent"
          style={{ WebkitTextStroke: "1px var(--line-strong)" }}
        >
          XAI
        </div>

        <div className="flex items-center justify-between border-t border-line py-6 font-mono text-[11px] uppercase tracking-wide text-ink-faint">
          <span>© 2026 XAI</span>
          <span>LIVE · {clock}</span>
        </div>
      </div>
    </footer>
  );
}
