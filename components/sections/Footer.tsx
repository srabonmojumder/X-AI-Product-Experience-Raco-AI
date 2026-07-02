"use client";

import { Reveal } from "@/components/ui/primitives";

const columns = [
  { title: "Product", links: ["Overview", "Insight flow", "Dashboard", "Automations"] },
  { title: "Company", links: ["About", "Careers", "Security", "Changelog"] },
  { title: "Resources", links: ["Docs", "API", "Status", "Contact"] },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      {/* Closing statement */}
      <div className="shell py-20 md:py-28">
        <Reveal>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5">
              <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden>
                <rect x="1" y="1" width="20" height="20" rx="6" stroke="url(#flg)" strokeWidth="1.5" />
                <path
                  d="M6.5 6.5L15.5 15.5M15.5 6.5L6.5 15.5"
                  stroke="url(#flg)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="flg" x1="1" y1="1" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#57E1CE" />
                    <stop offset="1" stopColor="#7D8CFF" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-lg font-semibold tracking-tight text-ink">Xai</span>
            </div>
            <p className="mt-6 text-display-md font-medium leading-tight text-ink">
              From raw data to <span className="text-signal">decisions you can trust.</span>
            </p>
            <div className="mt-8">
              <a href="#dashboard" className="btn-primary">
                Request access
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Link grid */}
      <div className="border-t border-line">
        <div className="shell grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="max-w-[22ch] text-sm leading-relaxed text-ink-faint">
              The intelligence workspace for teams that decide with data.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-ink-muted transition-colors duration-300 hover:text-ink"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Baseline */}
      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="font-mono text-[11px] text-ink-faint">
            © {new Date().getFullYear()} Xai Labs · A prototype build
          </p>
          <div className="flex items-center gap-5 font-mono text-[11px] text-ink-faint">
            <a href="#" className="transition-colors hover:text-ink-muted">Privacy</a>
            <a href="#" className="transition-colors hover:text-ink-muted">Terms</a>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-cyan" />
              All systems normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
