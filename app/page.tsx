"use client";

import { useState, useMemo } from "react";
import { cards as allCards, categories } from "@/data/cards";
import type { CreditCard } from "@/types/card";
import CardSelector from "@/components/CardSelector";
import ComparisonTable from "@/components/ComparisonTable";
import FilterBar from "@/components/FilterBar";

const MAX_COMPARE = 5;

export default function Home() {
  const [selected, setSelected] = useState<(CreditCard | null)[]>([null, null]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeIssuer, setActiveIssuer] = useState("All Issuers");

  const filteredCards = useMemo(() => {
    return allCards.filter((c) => {
      const matchCat = activeCategory === "all" || c.categories.includes(activeCategory as CreditCard["categories"][number]);
      const matchIssuer = activeIssuer === "All Issuers" || c.issuer === activeIssuer;
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

  const activeCount = selected.filter(Boolean).length;

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-black dark:text-white text-2xl font-semibold tracking-tight mb-1.5">
          Compare Canadian Credit Cards
        </h1>
        <p className="text-black/40 dark:text-white/40 text-sm">
          Side-by-side comparison of fees, earn rates, insurance, and perks.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          activeCategory={activeCategory}
          activeIssuer={activeIssuer}
          onCategoryChange={(cat) => {
            setActiveCategory(cat);
            setSelected((prev) => prev.map(() => null));
          }}
          onIssuerChange={(issuer) => {
            setActiveIssuer(issuer);
            setSelected((prev) => prev.map(() => null));
          }}
          totalCards={filteredCards.length}
        />
      </div>

      {/* Card Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 items-start">
        {selected.map((card, i) => (
          <div key={i} className="relative">
            <CardSelector
              cards={filteredCards}
              selected={card}
              onSelect={handleSelect(i)}
              placeholder={`Card ${i + 1}`}
              filterCategory={activeCategory}
              filterIssuer={activeIssuer}
            />
            {selected.length > 2 && (
              <button
                onClick={() => removeSlot(i)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black/10 dark:bg-white/10 rounded-full text-black/40 dark:text-white/40 hover:bg-black/20 dark:hover:bg-white/20 hover:text-black/80 dark:hover:text-white/80 transition-colors flex items-center justify-center text-xs leading-none"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {selected.length < MAX_COMPARE && (
          <button
            onClick={addSlot}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-black/10 dark:border-white/10 rounded-lg text-black/30 dark:text-white/30 text-sm hover:border-black/20 dark:hover:border-white/20 hover:text-black/50 dark:hover:text-white/50 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Add card
          </button>
        )}
      </div>

      {/* Status line */}
      {activeCount > 0 && (
        <div className="mt-5 flex items-center gap-3">
          <span className="text-black/30 dark:text-white/30 text-xs">
            Comparing {activeCount} card{activeCount > 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setSelected(selected.map(() => null))}
            className="text-black/25 dark:text-white/25 text-xs hover:text-black/50 dark:hover:text-white/50 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Empty state */}
      {activeCount === 0 && (
        <div className="mt-16 text-center">
          <p className="text-black/20 dark:text-white/20 text-sm">
            Select up to {MAX_COMPARE} cards to compare
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {categories.slice(1).map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="px-3 py-1.5 border border-black/8 dark:border-white/8 rounded-md text-black/30 dark:text-white/30 text-xs hover:border-black/20 dark:hover:border-white/20 hover:text-black/60 dark:hover:text-white/60 transition-colors"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <ComparisonTable cards={selected} />
    </main>
  );
}
