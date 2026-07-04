"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/data";

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [sources, setSources] = useState(42);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last.current && y > 200);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Gentle "living" pulse in the source count.
  useEffect(() => {
    const id = setInterval(
      () => setSources(42 + Math.round(Math.sin(Date.now() / 2200) * 3)),
      1200
    );
    return () => clearInterval(id);
  }, []);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b border-line transition-transform duration-500 ease-out-expo"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        background: "color-mix(in srgb, var(--paper) 82%, transparent)",
        backdropFilter: "blur(14px) saturate(1.1)",
        WebkitBackdropFilter: "blur(14px) saturate(1.1)",
      }}
    >
      <div className="shell flex h-16 items-center justify-between">
        <a href="#top" className="flex items-baseline gap-2.5">
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            {nav.brand.mark}
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint sm:inline">
            {nav.brand.tag}
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-muted transition-colors hover:text-ink"
            >
              {l.label}
              <span className="bg-living absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <span className="hidden font-mono text-[10.5px] tracking-[0.05em] text-ink-faint lg:inline">
            <span className="mr-1.5 text-coral">●</span>listening · {sources} sources live
          </span>
          <a href={nav.cta.href} className="btn-primary !px-4 !py-2">
            {nav.cta.label}
          </a>
        </div>
      </div>
    </nav>
  );
}
