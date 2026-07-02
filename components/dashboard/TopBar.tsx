"use client";

import { Search, Bell, Command } from "lucide-react";

/**
 * Dashboard top bar. Everything here is presentational chrome — a search
 * field, a live-status pulse, notifications, and an account avatar — sized
 * and spaced to read as a genuine product header rather than a mock.
 */
export function TopBar() {
  return (
    <div className="flex items-center gap-3 border-b border-line bg-surface/40 px-4 py-3">
      {/* Search */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-line bg-surface-sunken px-3 py-2">
        <Search className="h-3.5 w-3.5 shrink-0 text-ink-faint" strokeWidth={1.75} />
        <span className="truncate text-[13px] text-ink-faint">Search datasets, insights, automations…</span>
        <span className="ml-auto hidden items-center gap-0.5 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-faint sm:flex">
          <Command className="h-2.5 w-2.5" strokeWidth={2} />K
        </span>
      </div>

      {/* Live status */}
      <div className="hidden items-center gap-2 rounded-lg border border-line px-2.5 py-2 sm:flex">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-cyan opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-cyan" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">Live</span>
      </div>

      {/* Notifications */}
      <button
        type="button"
        aria-label="Notifications"
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-muted transition-colors duration-300 hover:text-ink"
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent ring-2 ring-surface" />
      </button>

      {/* Avatar */}
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-soft text-[12px] font-semibold text-bg">
        MK
      </div>
    </div>
  );
}
