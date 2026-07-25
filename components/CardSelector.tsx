"use client";

import { useState, useRef, useEffect } from "react";
import type { CreditCard } from "@/types/card";

interface CardSelectorProps {
  cards: CreditCard[];
  selected: CreditCard | null;
  onSelect: (card: CreditCard | null) => void;
  placeholder?: string;
  filterCategory?: string;
  filterIssuer?: string;
}

export default function CardSelector({
  cards,
  selected,
  onSelect,
  placeholder = "Select a card",
  filterCategory,
  filterIssuer,
}: CardSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = cards.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.issuer.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCategory || filterCategory === "all" || c.categories.includes(filterCategory as CreditCard["categories"][number]);
    const matchIssuer = !filterIssuer || filterIssuer === "All Issuers" || c.issuer === filterIssuer;
    return matchSearch && matchCat && matchIssuer;
  });

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-black/4 dark:bg-white/4 border border-black/10 dark:border-white/10 rounded-lg text-left hover:border-black/20 dark:hover:border-white/20 transition-colors"
      >
        {selected ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selected.color }} />
            <div className="min-w-0">
              <p className="text-black dark:text-white text-sm font-medium truncate">{selected.name}</p>
              <p className="text-black/40 dark:text-white/40 text-xs">{selected.issuer}</p>
            </div>
          </div>
        ) : (
          <span className="text-black/30 dark:text-white/30 text-sm">{placeholder}</span>
        )}
        <svg
          className={`w-4 h-4 text-black/30 dark:text-white/30 flex-shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 w-full z-50 bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-black/8 dark:border-white/8">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cards..."
              className="w-full bg-transparent text-black dark:text-white text-sm placeholder-black/30 dark:placeholder-white/30 outline-none px-2 py-1"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {selected && (
              <button
                onClick={() => { onSelect(null); setOpen(false); setSearch(""); }}
                className="w-full px-4 py-2.5 text-left text-black/30 dark:text-white/30 text-xs hover:bg-black/4 dark:hover:bg-white/4 transition-colors"
              >
                Clear selection
              </button>
            )}
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-black/30 dark:text-white/30 text-sm">No cards found</p>
            ) : (
              filtered.map((card) => (
                <button
                  key={card.id}
                  onClick={() => { onSelect(card); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-black/4 dark:hover:bg-white/4 transition-colors ${
                    selected?.id === card.id ? "bg-black/6 dark:bg-white/6" : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: card.color }} />
                  <div className="min-w-0">
                    <p className="text-black dark:text-white text-sm truncate">{card.name}</p>
                    <p className="text-black/40 dark:text-white/40 text-xs">
                      {card.issuer} · {card.annualFee === 0 ? "No fee" : `$${card.annualFee}/yr`} · {card.rewardType}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
