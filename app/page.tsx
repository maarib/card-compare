"use client";

import { useState, useMemo } from "react";
import { cards as allCards, categories, issuers } from "@/data/cards";
import type { CreditCard } from "@/types/card";
import CardSelector from "@/components/CardSelector";
import ComparisonTable from "@/components/ComparisonTable";

const MAX_COMPARE = 5;

export default function Home() {
  const [selected, setSelected] = useState<(CreditCard | null)[]>([null, null]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeIssuer, setActiveIssuer] = useState("All Issuers");

  const filteredCards = useMemo(() => {
    return allCards.filter((c) => {
      const matchCat =
        activeCategory === "all" ||
        c.categories.includes(activeCategory as CreditCard["categories"][number]);
      const matchIssuer =
        activeIssuer === "All Issuers" || c.issuer === activeIssuer;
      return matchCat && matchIssuer;
    });
  }, [activeCategory, activeIssuer]);

  const handleSelect = (index: number) => (card: CreditCard | null) => {
    setSelected((prev) => {
      const next = [...prev];
      next[index] = card;
      return next;
    });
  };

  const addSlot = () => {
    if (selected.length < MAX_COMPARE) {
      setSelected((prev) => [...prev, null]);
    }
  };

  const removeSlot = (index: number) => {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFilters = () => {
    setActiveCategory("all");
    setActiveIssuer("All Issuers");
    setSelected((prev) => prev.map(() => null));
  };

  const activeCount = selected.filter(Boolean).length;

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <h1 className="text-black dark:text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
          Compare Canadian Credit Cards
        </h1>
        <p className="text-black/40 dark:text-white/40 text-sm">
          Side-by-side comparison of fees, earn rates, insurance, and perks across{" "}
          <span className="text-black/60 dark:text-white/60">{allCards.length} cards</span> from{" "}
          {issuers.length} issuers.
        </p>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <div className="mb-7 flex flex-wrap items-center gap-2">
        {/* category pills */}
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setActiveCategory(cat.value);
              setSelected((prev) => prev.map(() => null));
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat.value
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black/80 dark:hover:text-white/80"
            }`}
          >
            {cat.label}
          </button>
        ))}

        {/* divider */}
        <div className="w-px h-4 bg-black/12 dark:bg-white/12 mx-1" />

        {/* issuer select */}
        <select
          value={activeIssuer}
          onChange={(e) => {
            setActiveIssuer(e.target.value);
            setSelected((prev) => prev.map(() => null));
          }}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 border-none outline-none cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors appearance-none pr-6"
          style={{ backgroundImage: "none" }}
        >
          <option value="All Issuers">All Issuers</option>
          {issuers.map((iss) => (
            <option key={iss} value={iss}>
              {iss}
            </option>
          ))}
        </select>

        {/* result count */}
        <span className="text-black/25 dark:text-white/25 text-xs ml-1">
          {filteredCards.length} card{filteredCards.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Card Selector Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 items-start">
        {selected.map((card, i) => (
          <div key={i} className="relative group/slot">
            <CardSelector
              cards={filteredCards}
              selected={card}
              onSelect={handleSelect(i)}
              placeholder={`Card ${i + 1}`}
            />
            {/* remove-slot button — only when > 2 slots */}
            {selected.length > 2 && (
              <button
                onClick={() => removeSlot(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black/10 dark:bg-white/10 rounded-full text-black/40 dark:text-white/40 hover:bg-black/25 dark:hover:bg-white/25 hover:text-black dark:hover:text-white transition-all flex items-center justify-center text-xs leading-none z-20 opacity-0 group-hover/slot:opacity-100"
                aria-label="Remove slot"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {/* Add card slot */}
        {selected.length < MAX_COMPARE && (
          <button
            onClick={addSlot}
            className="rounded-2xl border-2 border-dashed border-black/8 dark:border-white/8 hover:border-black/20 dark:hover:border-white/20 transition-colors flex flex-col items-center justify-center gap-1.5 text-black/20 dark:text-white/20 hover:text-black/40 dark:hover:text-white/40"
            style={{ aspectRatio: "85.6 / 53.98" }}
          >
            <span className="text-xl font-light leading-none">+</span>
            <span className="text-[10px] font-medium">Add card</span>
          </button>
        )}
      </div>

      {/* ── Status line ───────────────────────────────────────────────────── */}
      {activeCount > 0 && (
        <div className="mt-5 flex items-center gap-4">
          <span className="text-black/30 dark:text-white/30 text-xs">
            Comparing{" "}
            <span className="text-black/60 dark:text-white/60 font-medium">{activeCount}</span>{" "}
            card{activeCount > 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setSelected(selected.map(() => null))}
            className="text-black/25 dark:text-white/25 text-xs hover:text-black/55 dark:hover:text-white/55 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {activeCount === 0 && (
        <div className="mt-14 text-center">
          <p className="text-black/20 dark:text-white/20 text-sm mb-2">
            Select up to {MAX_COMPARE} cards above to compare them side by side
          </p>
          {(activeCategory !== "all" || activeIssuer !== "All Issuers") && (
            <button
              onClick={clearFilters}
              className="mt-2 text-xs text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Comparison Table ──────────────────────────────────────────────── */}
      <ComparisonTable cards={selected} />

    </main>
  );
}
