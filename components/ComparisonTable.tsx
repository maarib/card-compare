"use client";

import type { CreditCard } from "@/types/card";

interface ComparisonTableProps {
  cards: (CreditCard | null)[];
}

function Check({ value }: { value: boolean }) {
  return value ? (
    <span className="text-black/80 dark:text-white/80">✓</span>
  ) : (
    <span className="text-black/20 dark:text-white/20">—</span>
  );
}

function Val({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <span className={highlight ? "text-black dark:text-white font-medium" : "text-black/70 dark:text-white/70"}>
      {children}
    </span>
  );
}

type RowDef =
  | { type: "section"; label: string }
  | { type: "row"; label: string; render: (c: CreditCard) => React.ReactNode };

const rows: RowDef[] = [
  { type: "section", label: "Basics" },
  {
    type: "row", label: "Annual Fee",
    render: (c) => (
      <Val highlight>
        {c.annualFee === 0 ? "Free" : `$${c.annualFee}/yr`}
        {c.annualFeeWaivable && <span className="text-black/40 dark:text-white/40 text-xs ml-1.5">waivable</span>}
      </Val>
    ),
  },
  {
    type: "row", label: "Welcome Bonus",
    render: (c) => c.welcomeBonus ? (
      <div>
        <Val>{c.welcomeBonus}</Val>
        {c.welcomeBonusValue && <span className="text-black/40 dark:text-white/40 text-xs ml-1.5">(~${c.welcomeBonusValue} value)</span>}
      </div>
    ) : <Val><span className="text-black/20 dark:text-white/20">None</span></Val>,
  },
  {
    type: "row", label: "Network",
    render: (c) => <Val>{c.network}</Val>,
  },
  {
    type: "row", label: "Reward Type",
    render: (c) => <Val>{c.rewardProgram ?? (c.rewardType.charAt(0).toUpperCase() + c.rewardType.slice(1))}</Val>,
  },
  {
    type: "row", label: "Foreign Transaction Fee",
    render: (c) => (
      <Val highlight={c.foreignTransactionFee === 0}>
        {c.foreignTransactionFee === 0 ? "None" : `${c.foreignTransactionFee}%`}
      </Val>
    ),
  },
  {
    type: "row", label: "Income Required",
    render: (c) => c.minPersonalIncome ? (
      <Val>${c.minPersonalIncome.toLocaleString()}/yr</Val>
    ) : <Val><span className="text-black/40 dark:text-white/40">None stated</span></Val>,
  },
  { type: "section", label: "Earn Rates" },
  { type: "row", label: "Groceries", render: (c) => <Val highlight>{c.earnRates.groceries}{c.rewardType === "cashback" ? "%" : "x"}</Val> },
  { type: "row", label: "Gas", render: (c) => <Val highlight>{c.earnRates.gas}{c.rewardType === "cashback" ? "%" : "x"}</Val> },
  { type: "row", label: "Dining", render: (c) => <Val highlight>{c.earnRates.dining}{c.rewardType === "cashback" ? "%" : "x"}</Val> },
  { type: "row", label: "Travel", render: (c) => <Val highlight>{c.earnRates.travel}{c.rewardType === "cashback" ? "%" : "x"}</Val> },
  { type: "row", label: "Drug Store", render: (c) => <Val>{c.earnRates.drugstore}{c.rewardType === "cashback" ? "%" : "x"}</Val> },
  {
    type: "row", label: "Amazon",
    render: (c) => c.earnRates.amazon !== undefined ? (
      <Val highlight={c.earnRates.amazon > 2}>{c.earnRates.amazon}{c.rewardType === "cashback" ? "%" : "x"}</Val>
    ) : <Val><span className="text-black/20 dark:text-white/20">—</span></Val>,
  },
  {
    type: "row", label: "Transit",
    render: (c) => c.earnRates.transit !== undefined ? (
      <Val>{c.earnRates.transit}{c.rewardType === "cashback" ? "%" : "x"}</Val>
    ) : <Val><span className="text-black/20 dark:text-white/20">—</span></Val>,
  },
  { type: "row", label: "Everything Else", render: (c) => <Val>{c.earnRates.other}{c.rewardType === "cashback" ? "%" : "x"}</Val> },
  {
    type: "row", label: "Earn Cap",
    render: (c) => c.earnCap ? <Val>{c.earnCap}</Val> : <Val><span className="text-black/40 dark:text-white/40">None</span></Val>,
  },
  { type: "section", label: "Travel Insurance" },
  {
    type: "row", label: "Emergency Medical",
    render: (c) => (
      <div className="flex items-center gap-1.5">
        <Check value={c.insurance.travelMedical} />
        {c.insurance.travelMedical && c.insurance.travelMedicalDays && (
          <span className="text-black/40 dark:text-white/40 text-xs">{c.insurance.travelMedicalDays} days</span>
        )}
      </div>
    ),
  },
  { type: "row", label: "Trip Cancellation", render: (c) => <Check value={c.insurance.tripCancellation} /> },
  { type: "row", label: "Trip Interruption", render: (c) => <Check value={c.insurance.tripInterruption} /> },
  { type: "row", label: "Flight Delay", render: (c) => <Check value={c.insurance.flightDelay} /> },
  { type: "row", label: "Baggage Loss/Delay", render: (c) => <Check value={c.insurance.baggageLoss} /> },
  { type: "row", label: "Car Rental", render: (c) => <Check value={c.insurance.carRental} /> },
  { type: "section", label: "Purchase Protection" },
  {
    type: "row", label: "Purchase Protection",
    render: (c) => (
      <div className="flex items-center gap-1.5">
        <Check value={c.insurance.purchaseProtection} />
        {c.insurance.purchaseProtection && c.insurance.purchaseProtectionDays && (
          <span className="text-black/40 dark:text-white/40 text-xs">{c.insurance.purchaseProtectionDays} days</span>
        )}
      </div>
    ),
  },
  { type: "row", label: "Extended Warranty", render: (c) => <Check value={c.insurance.extendedWarranty} /> },
  { type: "row", label: "Mobile Device", render: (c) => <Check value={c.insurance.mobileDevice} /> },
  { type: "section", label: "Perks" },
  {
    type: "row", label: "Lounge Access",
    render: (c) => (
      <div>
        <Check value={c.perks.loungeAccess} />
        {c.perks.loungeAccess && (
          <span className="text-black/40 dark:text-white/40 text-xs ml-1.5">
            {c.perks.loungeVisits ? `${c.perks.loungeVisits} visits` : "Unlimited"} · {c.perks.loungeProgram}
          </span>
        )}
      </div>
    ),
  },
  { type: "row", label: "Concierge", render: (c) => <Check value={c.perks.concierge} /> },
  { type: "row", label: "Priority Pass", render: (c) => <Check value={!!c.perks.priorityPass} /> },
  { type: "row", label: "Global Entry / NEXUS", render: (c) => <Check value={!!c.perks.globalEntry} /> },
  { type: "section", label: "Notes" },
  {
    type: "row", label: "Highlights",
    render: (c) => c.notes ? (
      <span className="text-black/50 dark:text-white/50 text-xs leading-relaxed">{c.notes}</span>
    ) : <span className="text-black/20 dark:text-white/20 text-xs">—</span>,
  },
];

const COL_GRADIENTS = [
  "from-blue-500/8",
  "from-violet-500/8",
  "from-emerald-500/8",
  "from-amber-500/8",
  "from-rose-500/8",
];

export default function ComparisonTable({ cards }: ComparisonTableProps) {
  const active = cards.filter(Boolean) as CreditCard[];
  if (active.length === 0) return null;

  const colCount = active.length;
  const gridCols =
    colCount === 1 ? "grid-cols-[180px_1fr]"
    : colCount === 2 ? "grid-cols-[180px_1fr_1fr]"
    : colCount === 3 ? "grid-cols-[180px_1fr_1fr_1fr]"
    : colCount === 4 ? "grid-cols-[180px_1fr_1fr_1fr_1fr]"
    : "grid-cols-[180px_1fr_1fr_1fr_1fr_1fr]";

  return (
    <div className="mt-8 overflow-x-auto">
      <div className={`grid ${gridCols} min-w-[600px]`}>
        {/* Column headers */}
        <div className="px-4 py-3" />
        {active.map((card, i) => (
          <div
            key={card.id}
            className={`px-4 py-4 bg-gradient-to-b ${COL_GRADIENTS[i]} to-transparent border-b border-black/6 dark:border-white/6`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card.color }} />
              <span className="text-black/40 dark:text-white/40 text-xs">{card.issuer}</span>
            </div>
            <p className="text-black dark:text-white text-sm font-medium leading-snug">{card.name}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-black/50 dark:text-white/50 text-xs">{card.network}</span>
              <span className="text-black/20 dark:text-white/20 text-xs">·</span>
              <span className="text-black/50 dark:text-white/50 text-xs capitalize">{card.rewardType}</span>
            </div>
          </div>
        ))}

        {/* Rows */}
        {rows.map((row, rowIdx) => {
          if (row.type === "section") {
            return (
              <div key={`section-${rowIdx}`} className="col-span-full px-4 py-2.5 mt-2 bg-black/2 dark:bg-white/2">
                <span className="text-black/30 dark:text-white/30 text-xs uppercase tracking-widest font-medium">
                  {row.label}
                </span>
              </div>
            );
          }
          return (
            <>
              <div key={`label-${rowIdx}`} className="px-4 py-3 border-b border-black/4 dark:border-white/4 flex items-center">
                <span className="text-black/40 dark:text-white/40 text-xs">{row.label}</span>
              </div>
              {active.map((card, i) => (
                <div
                  key={`val-${rowIdx}-${card.id}`}
                  className={`px-4 py-3 border-b border-black/4 dark:border-white/4 text-sm ${
                    i < active.length - 1 ? "border-r border-black/4 dark:border-white/4" : ""
                  }`}
                >
                  {row.render(card)}
                </div>
              ))}
            </>
          );
        })}
      </div>
    </div>
  );
}
