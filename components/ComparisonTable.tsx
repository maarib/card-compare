"use client";

import type { CreditCard } from "@/types/card";
import CardArt from "./CardArt";

interface ComparisonTableProps {
  cards: (CreditCard | null)[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

function winnerIdx(
  cards: CreditCard[],
  getValue: (c: CreditCard) => number | undefined,
  dir: "lower" | "higher"
): number {
  const pairs = cards
    .map((c, i) => ({ v: getValue(c), i }))
    .filter((x) => x.v !== undefined && !isNaN(x.v!));
  if (pairs.length < 2) return -1;
  const best =
    dir === "lower"
      ? pairs.reduce((a, b) => (a.v! <= b.v! ? a : b))
      : pairs.reduce((a, b) => (a.v! >= b.v! ? a : b));
  const tied = pairs.filter((x) => x.v === best.v).length > 1;
  return tied ? -1 : best.i;
}

function Check({ value }: { value: boolean }) {
  return value ? (
    <span className="text-black/80 dark:text-white/80 text-base leading-none">✓</span>
  ) : (
    <span className="text-black/18 dark:text-white/18 text-base leading-none">—</span>
  );
}

// ── row definitions ───────────────────────────────────────────────────────────

type Compare = {
  getValue: (c: CreditCard) => number | undefined;
  dir: "lower" | "higher";
};

type RowDef =
  | { type: "section"; label: string }
  | {
      type: "row";
      label: string;
      render: (c: CreditCard, best: boolean) => React.ReactNode;
      compare?: Compare;
    };

const rows: RowDef[] = [
  // ── Basics ─────────────────────────────────────────────────────────────────
  { type: "section", label: "Basics" },
  {
    type: "row",
    label: "Annual Fee",
    compare: { getValue: (c) => c.annualFee, dir: "lower" },
    render: (c, best) => (
      <span className={best ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-black/75 dark:text-white/75 font-medium"}>
        {c.annualFee === 0 ? "Free" : `$${c.annualFee}/yr`}
        {c.annualFeeWaivable && (
          <span className="text-black/35 dark:text-white/35 text-xs font-normal ml-1.5">waivable</span>
        )}
      </span>
    ),
  },
  {
    type: "row",
    label: "Welcome Bonus",
    compare: { getValue: (c) => c.welcomeBonusValue, dir: "higher" },
    render: (c, best) =>
      c.welcomeBonus ? (
        <div>
          <span className={best ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-black/75 dark:text-white/75"}>
            {c.welcomeBonus}
          </span>
          {c.welcomeBonusValue && (
            <span className="text-black/35 dark:text-white/35 text-xs ml-1.5">
              (~${c.welcomeBonusValue} value)
            </span>
          )}
        </div>
      ) : (
        <span className="text-black/20 dark:text-white/20">None</span>
      ),
  },
  {
    type: "row",
    label: "Network",
    render: (c) => <span className="text-black/70 dark:text-white/70">{c.network}</span>,
  },
  {
    type: "row",
    label: "Reward Program",
    render: (c) => (
      <span className="text-black/70 dark:text-white/70">
        {c.rewardProgram ?? (c.rewardType.charAt(0).toUpperCase() + c.rewardType.slice(1))}
      </span>
    ),
  },
  {
    type: "row",
    label: "Foreign Transaction",
    compare: { getValue: (c) => c.foreignTransactionFee, dir: "lower" },
    render: (c, best) => (
      <span className={best ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-black/75 dark:text-white/75"}>
        {c.foreignTransactionFee === 0 ? "None" : `${c.foreignTransactionFee}%`}
      </span>
    ),
  },
  {
    type: "row",
    label: "Income Required",
    compare: { getValue: (c) => c.minPersonalIncome ?? 0, dir: "lower" },
    render: (c, best) =>
      c.minPersonalIncome ? (
        <span className={best ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-black/70 dark:text-white/70"}>
          ${c.minPersonalIncome.toLocaleString()}/yr
        </span>
      ) : (
        <span className="text-black/35 dark:text-white/35">None stated</span>
      ),
  },
  {
    type: "row",
    label: "Credit Score",
    render: (c) => <span className="text-black/70 dark:text-white/70">{c.creditScoreRequired}</span>,
  },

  // ── Earn Rates ─────────────────────────────────────────────────────────────
  { type: "section", label: "Earn Rates" },
  {
    type: "row",
    label: "Groceries",
    compare: { getValue: (c) => c.earnRates.groceries, dir: "higher" },
    render: (c, best) => (
      <span className={best ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-black/75 dark:text-white/75 font-medium"}>
        {c.earnRates.groceries}{c.rewardType === "cashback" ? "%" : "×"}
      </span>
    ),
  },
  {
    type: "row",
    label: "Gas",
    compare: { getValue: (c) => c.earnRates.gas, dir: "higher" },
    render: (c, best) => (
      <span className={best ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-black/75 dark:text-white/75 font-medium"}>
        {c.earnRates.gas}{c.rewardType === "cashback" ? "%" : "×"}
      </span>
    ),
  },
  {
    type: "row",
    label: "Dining",
    compare: { getValue: (c) => c.earnRates.dining, dir: "higher" },
    render: (c, best) => (
      <span className={best ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-black/75 dark:text-white/75 font-medium"}>
        {c.earnRates.dining}{c.rewardType === "cashback" ? "%" : "×"}
      </span>
    ),
  },
  {
    type: "row",
    label: "Travel",
    compare: { getValue: (c) => c.earnRates.travel, dir: "higher" },
    render: (c, best) => (
      <span className={best ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-black/75 dark:text-white/75 font-medium"}>
        {c.earnRates.travel}{c.rewardType === "cashback" ? "%" : "×"}
      </span>
    ),
  },
  {
    type: "row",
    label: "Drug Store",
    compare: { getValue: (c) => c.earnRates.drugstore, dir: "higher" },
    render: (c, best) => (
      <span className={best ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-black/70 dark:text-white/70"}>
        {c.earnRates.drugstore}{c.rewardType === "cashback" ? "%" : "×"}
      </span>
    ),
  },
  {
    type: "row",
    label: "Amazon",
    compare: { getValue: (c) => c.earnRates.amazon, dir: "higher" },
    render: (c, best) =>
      c.earnRates.amazon !== undefined ? (
        <span className={best ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-black/70 dark:text-white/70"}>
          {c.earnRates.amazon}{c.rewardType === "cashback" ? "%" : "×"}
        </span>
      ) : (
        <span className="text-black/18 dark:text-white/18">—</span>
      ),
  },
  {
    type: "row",
    label: "Transit",
    compare: { getValue: (c) => c.earnRates.transit, dir: "higher" },
    render: (c, best) =>
      c.earnRates.transit !== undefined ? (
        <span className={best ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-black/70 dark:text-white/70"}>
          {c.earnRates.transit}{c.rewardType === "cashback" ? "%" : "×"}
        </span>
      ) : (
        <span className="text-black/18 dark:text-white/18">—</span>
      ),
  },
  {
    type: "row",
    label: "Everything Else",
    compare: { getValue: (c) => c.earnRates.other, dir: "higher" },
    render: (c, best) => (
      <span className={best ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-black/60 dark:text-white/60"}>
        {c.earnRates.other}{c.rewardType === "cashback" ? "%" : "×"}
      </span>
    ),
  },
  {
    type: "row",
    label: "Earn Cap",
    render: (c) =>
      c.earnCap ? (
        <span className="text-black/60 dark:text-white/60">{c.earnCap}</span>
      ) : (
        <span className="text-black/30 dark:text-white/30">None</span>
      ),
  },

  // ── Travel Insurance ────────────────────────────────────────────────────────
  { type: "section", label: "Travel Insurance" },
  {
    type: "row",
    label: "Emergency Medical",
    render: (c) => (
      <div className="flex items-center gap-1.5">
        <Check value={c.insurance.travelMedical} />
        {c.insurance.travelMedical && c.insurance.travelMedicalDays && (
          <span className="text-black/35 dark:text-white/35 text-xs">{c.insurance.travelMedicalDays} days</span>
        )}
      </div>
    ),
  },
  {
    type: "row",
    label: "Trip Cancellation",
    render: (c) => <Check value={c.insurance.tripCancellation} />,
  },
  {
    type: "row",
    label: "Trip Interruption",
    render: (c) => <Check value={c.insurance.tripInterruption} />,
  },
  {
    type: "row",
    label: "Flight Delay",
    render: (c) => <Check value={c.insurance.flightDelay} />,
  },
  {
    type: "row",
    label: "Baggage Loss/Delay",
    render: (c) => <Check value={c.insurance.baggageLoss} />,
  },
  {
    type: "row",
    label: "Car Rental",
    render: (c) => <Check value={c.insurance.carRental} />,
  },

  // ── Purchase Protection ─────────────────────────────────────────────────────
  { type: "section", label: "Purchase Protection" },
  {
    type: "row",
    label: "Purchase Protection",
    render: (c) => (
      <div className="flex items-center gap-1.5">
        <Check value={c.insurance.purchaseProtection} />
        {c.insurance.purchaseProtection && c.insurance.purchaseProtectionDays && (
          <span className="text-black/35 dark:text-white/35 text-xs">{c.insurance.purchaseProtectionDays} days</span>
        )}
      </div>
    ),
  },
  {
    type: "row",
    label: "Extended Warranty",
    render: (c) => <Check value={c.insurance.extendedWarranty} />,
  },
  {
    type: "row",
    label: "Mobile Device",
    render: (c) => <Check value={c.insurance.mobileDevice} />,
  },

  // ── Perks ───────────────────────────────────────────────────────────────────
  { type: "section", label: "Perks" },
  {
    type: "row",
    label: "Lounge Access",
    render: (c) => (
      <div>
        <Check value={c.perks.loungeAccess} />
        {c.perks.loungeAccess && (
          <span className="text-black/35 dark:text-white/35 text-xs ml-1.5">
            {c.perks.loungeVisits ? `${c.perks.loungeVisits} visits` : "Unlimited"}
            {c.perks.loungeProgram && ` · ${c.perks.loungeProgram}`}
          </span>
        )}
      </div>
    ),
  },
  {
    type: "row",
    label: "Concierge",
    render: (c) => <Check value={c.perks.concierge} />,
  },
  {
    type: "row",
    label: "Priority Pass",
    render: (c) => <Check value={!!c.perks.priorityPass} />,
  },
  {
    type: "row",
    label: "Global Entry / NEXUS",
    render: (c) => <Check value={!!c.perks.globalEntry} />,
  },

  // ── Notes ───────────────────────────────────────────────────────────────────
  { type: "section", label: "Notes" },
  {
    type: "row",
    label: "Highlights",
    render: (c) =>
      c.notes ? (
        <span className="text-black/50 dark:text-white/50 text-xs leading-relaxed">{c.notes}</span>
      ) : (
        <span className="text-black/20 dark:text-white/20 text-xs">—</span>
      ),
  },
];

// ── component ─────────────────────────────────────────────────────────────────

export default function ComparisonTable({ cards }: ComparisonTableProps) {
  const active = cards.filter(Boolean) as CreditCard[];
  if (active.length === 0) return null;

  const LABEL_W = "w-40";

  return (
    <div className="mt-10 rounded-2xl border border-black/8 dark:border-white/8 overflow-hidden">
      <div className="overflow-auto max-h-[620px]">
        <table className="w-full border-collapse" style={{ minWidth: `${160 + active.length * 200}px` }}>

          {/* ── sticky card-art header ── */}
          <thead className="sticky top-0 z-20">
            <tr>
              {/* empty corner — must have same bg as sticky row */}
              <th
                className={`${LABEL_W} sticky left-0 z-30 bg-zinc-50 dark:bg-[#0A0A0A] border-b border-black/8 dark:border-white/8 p-0`}
              />
              {active.map((card, i) => (
                <th
                  key={card.id}
                  className="bg-zinc-50 dark:bg-[#0A0A0A] border-b border-black/8 dark:border-white/8 px-4 py-4 text-left align-bottom font-normal min-w-[180px]"
                >
                  <div className="w-36">
                    <CardArt card={card} size="md" />
                  </div>
                  <div className="mt-3">
                    <a
                      href={card.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-black/40 dark:text-white/40 text-[10px] hover:text-black/70 dark:hover:text-white/70 transition-colors border border-black/10 dark:border-white/10 rounded-md px-2 py-0.5 hover:border-black/25 dark:hover:border-white/25"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Apply →
                    </a>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* ── body ── */}
          <tbody>
            {rows.map((row, rowIdx) => {
              if (row.type === "section") {
                return (
                  <tr key={`s-${rowIdx}`}>
                    <td
                      colSpan={active.length + 1}
                      className="sticky left-0 px-4 py-2.5 bg-black/[0.025] dark:bg-white/[0.025] border-t border-b border-black/6 dark:border-white/6"
                    >
                      <span className="text-black/30 dark:text-white/30 text-[10px] uppercase tracking-[0.15em] font-semibold">
                        {row.label}
                      </span>
                    </td>
                  </tr>
                );
              }

              // compute winner for this row
              const wi = row.compare
                ? winnerIdx(active, row.compare.getValue, row.compare.dir)
                : -1;

              return (
                <tr
                  key={`r-${rowIdx}`}
                  className="group hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors"
                >
                  {/* sticky label */}
                  <td
                    className={`${LABEL_W} sticky left-0 z-10 bg-zinc-50 dark:bg-[#0A0A0A] group-hover:bg-zinc-100 dark:group-hover:bg-white/[0.02] px-4 py-3 border-b border-black/4 dark:border-white/4 transition-colors`}
                  >
                    <span className="text-black/40 dark:text-white/40 text-xs">{row.label}</span>
                  </td>

                  {/* values */}
                  {active.map((card, i) => (
                    <td
                      key={`${rowIdx}-${card.id}`}
                      className={`px-4 py-3 border-b border-black/4 dark:border-white/4 text-sm align-middle ${
                        i < active.length - 1
                          ? "border-r border-black/4 dark:border-white/4"
                          : ""
                      } ${wi === i ? "bg-emerald-50/60 dark:bg-emerald-950/20" : ""}`}
                    >
                      {row.render(card, wi === i)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
