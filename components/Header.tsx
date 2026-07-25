"use client";

import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-black/8 dark:border-white/8 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-black dark:bg-white rounded-sm flex items-center justify-center">
            <span className="text-white dark:text-black text-xs font-bold tracking-tighter">CC</span>
          </div>
          <span className="text-black dark:text-white font-medium text-sm tracking-wide">CardCompare</span>
          <span className="text-black/20 dark:text-white/20 text-sm">·</span>
          <span className="text-black/40 dark:text-white/40 text-xs">Canada</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-black/30 dark:text-white/30 text-xs">{new Date().getFullYear()} data</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
