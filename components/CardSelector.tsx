"use client";

import { useState, useRef, useEffect } from "react";
import type { CreditCard } from "@/types/card";
import CardArt from "./CardArt";

interface CardSelectorProps {
  cards: CreditCard[];
  selected: CreditCard | null;
  onSelect: (card: CreditCard | null) => void;
  placeholder?: string;
}

export default function CardSelector({
  cards,
  selected,
  onSelect,
  placeholder = "Add card",
}: CardSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hovering, setHovering] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const filtered = cards.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)
    );
  });

  const toggle = () => {
    setOpen((v) => !v);
    if (open) setSearch("");
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* ── trigger ── */}
      {selected ? (
        <div
          className="relative rounded-2xl cursor-pointer group"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={toggle}
        >
          <CardArt card={selected} />

          {/* hover overlay */}
          <div
            className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1.5 bg-black/55 backdrop-blur-[2px] transition-opacity duration-150 ${
              hovering ? "opacity-100" : "opacity-0"
            }`}
          >
            <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 16v-3z" />
            </svg>
            <span className="text-white/90 text-[10px] font-medium tracking-wide">Change card</span>
          </div>
        </div>
      ) : (
        /* empty ghost slot */
        <button
          onClick={toggle}
          className="w-full rounded-2xl border-2 border-dashed border-black/12 dark:border-white/12 hover:border-black/25 dark:hover:border-white/25 transition-colors flex flex-col items-center justify-center gap-1.5 text-black/25 dark:text-white/25 hover:text-black/45 dark:hover:text-white/45"
          style={{ aspectRatio: "85.6 / 53.98" }}
        >
          <span className="text-xl font-light leading-none">+</span>
          <span className="text-[10px] font-medium">{placeholder}</span>
        </button>
      )}

      {/* ── dropdown ── */}
      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 w-72 bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* search */}
          <div className="px-3 py-2.5 border-b border-black/8 dark:border-white/8">
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cards…"
              className="w-full bg-transparent text-black dark:text-white text-sm placeholder-black/30 dark:placeholder-white/30 outline-none"
            />
          </div>

          <div className="max-h-72 overflow-y-auto overscroll-contain">
            {/* clear option */}
            {selected && (
              <button
                onClick={() => {
                  onSelect(null);
                  setOpen(false);
                  setSearch("");
                }}
                className="w-full px-4 py-2 text-left text-black/35 dark:text-white/35 text-xs hover:bg-black/4 dark:hover:bg-white/4 transition-colors border-b border-black/5 dark:border-white/5"
              >
                Remove card
              </button>
            )}

            {filtered.length === 0 ? (
              <p className="px-4 py-4 text-black/30 dark:text-white/30 text-sm text-center">
                No cards found
              </p>
            ) : (
              filtered.map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    onSelect(card);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-black/4 dark:hover:bg-white/4 transition-colors ${
                    selected?.id === card.id ? "bg-black/5 dark:bg-white/5" : ""
                  }`}
                >
                  {/* mini card art */}
                  <div className="w-14 flex-shrink-0">
                    <CardArt card={card} size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-black dark:text-white text-sm font-medium truncate leading-snug">
                      {card.name}
                    </p>
                    <p className="text-black/40 dark:text-white/40 text-xs mt-0.5">
                      {card.issuer} ·{" "}
                      {card.annualFee === 0 ? "No annual fee" : `$${card.annualFee}/yr`}
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
