"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navItems, type TabId } from "@/lib/data";

/**
 * Product sidebar. Three items double as the live tabs (overview / insights /
 * automations); the rest are chrome that reads as a real workspace.
 * The moving pill uses a shared layoutId so selection glides between rows.
 */
const TAB_IDS: TabId[] = ["overview", "insights", "automations"];

function isTab(id: string): id is TabId {
  return (TAB_IDS as string[]).includes(id);
}

export function Sidebar({
  tab,
  onSelect,
}: {
  tab: TabId;
  onSelect: (t: TabId) => void;
}) {
  return (
    <aside className="hidden w-[212px] shrink-0 flex-col border-r border-line bg-surface-sunken/60 md:flex">
      {/* Workspace switcher */}
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3.5">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-signal-cyan to-signal-indigo text-[13px] font-semibold text-bg">
          A
        </span>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium text-ink">Acme Intelligence</div>
          <div className="truncate font-mono text-[10px] text-ink-faint">workspace</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-2.5">
        {navItems.map((item) => {
          const selectable = isTab(item.id);
          const active = selectable && item.id === tab;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              disabled={!selectable}
              onClick={() => selectable && onSelect(item.id as TabId)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition-colors duration-300",
                active ? "text-ink" : "text-ink-muted",
                selectable ? "hover:text-ink" : "cursor-default opacity-70"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg border border-line-strong bg-surface-raised"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 h-[15px] w-[15px] transition-colors duration-300",
                  active ? "text-accent" : "text-ink-faint group-hover:text-ink-muted"
                )}
                strokeWidth={1.75}
              />
              <span className="relative z-10 flex-1">{item.label}</span>
              {typeof item.count === "number" && (
                <span
                  className={cn(
                    "relative z-10 rounded-full px-1.5 font-mono text-[10px] leading-5 transition-colors duration-300",
                    active ? "bg-accent-dim text-accent-soft" : "bg-white/[0.04] text-ink-faint"
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Storage meter — small honest detail */}
      <div className="border-t border-line p-4">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-ink-faint">
          <span>STORAGE</span>
          <span>68%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
          <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-signal-cyan to-signal-indigo" />
        </div>
      </div>
    </aside>
  );
}
