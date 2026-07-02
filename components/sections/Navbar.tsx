"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

const links = [
  { label: "Product", href: "#insight-flow" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Interaction", href: "#signature" },
];

function Logo() {
  return (
    <a href="#top" className="group flex items-center gap-2.5" aria-label="Xai home">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <rect x="1" y="1" width="20" height="20" rx="6" stroke="url(#lg)" strokeWidth="1.5" />
        <path d="M6.5 6.5L15.5 15.5M15.5 6.5L6.5 15.5" stroke="url(#lg)" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="lg" x1="1" y1="1" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#57E1CE" />
            <stop offset="1" stopColor="#7D8CFF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[15px] font-semibold tracking-tight text-ink">Xai</span>
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: ease.outExpo, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "transition-colors duration-500",
          scrolled ? "border-b border-line bg-bg/70 backdrop-blur-xl" : "border-b border-transparent"
        )}
      >
        <nav className="shell flex h-16 items-center justify-between">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-ink-muted transition-colors duration-300 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden text-sm text-ink-muted transition-colors hover:text-ink sm:inline">
              Sign in
            </a>
            <a href="#dashboard" className="btn-primary">
              Request access
            </a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
