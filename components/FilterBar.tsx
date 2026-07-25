"use client";

import { categories, issuers } from "@/data/cards";

interface FilterBarProps {
  activeCategory: string;
  activeIssuer: string;
  onCategoryChange: (cat: string) => void;
  onIssuerChange: (issuer: string) => void;
  totalCards: number;
}

export default function FilterBar({
  activeCategory,
  activeIssuer,
  onCategoryChange,
  onIssuerChange,
  totalCards,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
              activeCategory === cat.value
                ? "bg-black dark:bg-white text-white dark:text-black font-medium"
                : "text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70 hover:bg-black/6 dark:hover:bg-white/6"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <select
          value={activeIssuer}
          onChange={(e) => onIssuerChange(e.target.value)}
          className="bg-black/4 dark:bg-white/4 border border-black/10 dark:border-white/10 rounded-md text-black/60 dark:text-white/60 text-xs px-3 py-1.5 outline-none hover:border-black/20 dark:hover:border-white/20 transition-colors cursor-pointer"
        >
          {issuers.map((issuer) => (
            <option key={issuer} value={issuer}>
              {issuer}
            </option>
          ))}
        </select>
        <span className="text-black/20 dark:text-white/20 text-xs">{totalCards} cards</span>
      </div>
    </div>
  );
}
