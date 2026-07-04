"use client";

import { LayoutGrid, LineChart, Radar, Zap, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const groups: { label: string; items: { icon: React.ReactNode; name: string; active?: boolean }[] }[] = [
  {
    label: "Workspace",
    items: [
      { icon: <LayoutGrid size={16} />, name: "Overview", active: true },
      { icon: <LineChart size={16} />, name: "Signals" },
      { icon: <Radar size={16} />, name: "Sources" },
    ],
  },
  {
    label: "Act",
    items: [
      { icon: <Zap size={16} />, name: "Automations" },
      { icon: <Settings size={16} />, name: "Settings" },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-52 shrink-0 border-r border-line p-3 md:block">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="px-2.5 pb-2 pt-3.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-faint">
            {g.label}
          </div>
          {g.items.map((it) => (
            <a
              key={it.name}
              className={cn(
                "flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[13.5px] transition-colors",
                it.active ? "bg-coral-dim text-coral" : "text-ink-muted hover:bg-black/[0.03]"
              )}
            >
              <span className={it.active ? "text-coral" : ""}>{it.icon}</span>
              {it.name}
            </a>
          ))}
        </div>
      ))}
    </aside>
  );
}
