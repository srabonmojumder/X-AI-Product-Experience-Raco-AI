"use client";

export function TopBar() {
  return (
    <div className="flex items-center gap-4 border-b border-line px-5 py-3.5">
      <div className="flex-1 max-w-xs rounded-full border border-line bg-paper px-4 py-2 font-mono text-xs text-ink-faint">
        ⌘K &nbsp;·&nbsp; search insights, sources…
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        <span className="font-mono text-xs text-ink-faint">Nadia R.</span>
        <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-coral font-display text-xs font-bold text-white">
          N
        </span>
      </div>
    </div>
  );
}
