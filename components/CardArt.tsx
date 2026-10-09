"use client";

import { useId } from "react";
import type { CreditCard } from "@/types/card";

function Chip() {
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const gradId = `chip-g-${uid}`;

  return (
    <svg viewBox="0 0 40 30" className="w-10 h-[30px] flex-shrink-0">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5E070" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A07820" />
        </linearGradient>
      </defs>
      <rect width="40" height="30" rx="4" fill={`url(#${gradId})`} />
      <rect x="9" y="7" width="22" height="16" rx="2.5" fill="none" stroke="#9A7300" strokeWidth="1" />
      <line x1="0" y1="10" x2="40" y2="10" stroke="#9A7300" strokeWidth="0.8" opacity="0.7" />
      <line x1="0" y1="20" x2="40" y2="20" stroke="#9A7300" strokeWidth="0.8" opacity="0.7" />
      <line x1="20" y1="0" x2="20" y2="30" stroke="#9A7300" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

function VisaLogo() {
  return (
    <svg viewBox="0 0 58 20" className="h-4 w-auto">
      <text
        x="1" y="17"
        fontFamily="Times New Roman, Times, serif"
        fontStyle="italic"
        fontWeight="bold"
        fontSize="21"
        fill="white"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 40 26" className="h-5 w-auto">
      <circle cx="14" cy="13" r="12" fill="#EB001B" />
      <circle cx="26" cy="13" r="12" fill="#F79E1B" />
      <path
        d="M20 3.48a12 12 0 0 1 0 19.04A12 12 0 0 1 20 3.48z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function AmexLogo() {
  return (
    <svg viewBox="0 0 52 18" className="h-3.5 w-auto">
      <text
        x="0" y="14"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="13"
        fill="white"
        letterSpacing="2"
      >
        AMEX
      </text>
    </svg>
  );
}

interface CardArtProps {
  card: CreditCard;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CardArt({ card, className = "", size = "md" }: CardArtProps) {
  // Determine if the brand color is very dark (≤ #303030 brightness)
  const hex = card.color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isDark = brightness < 60;

  const gradient = isDark
    ? `linear-gradient(140deg, #1a1a2e 0%, #252545 55%, #2d2d58 100%)`
    : `linear-gradient(140deg, #0d0d1a 0%, ${card.color}bb 55%, ${card.color} 100%)`;

  const glow = isDark
    ? "0 6px 28px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.35)"
    : `0 6px 28px ${card.color}55, 0 1px 4px rgba(0,0,0,0.35)`;

  const sm = size === "sm";
  const lg = size === "lg";
  const pad = sm ? "p-2" : lg ? "p-4" : "p-3";

  return (
    <div
      className={`relative rounded-2xl overflow-hidden select-none w-full ${className}`}
      style={{ aspectRatio: "85.6 / 53.98", background: gradient, boxShadow: glow }}
    >
      {/* Gloss sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.12) 0%, transparent 45%)" }}
      />

      {/* Issuer — top left */}
      <div className={`absolute top-0 left-0 right-0 flex items-start justify-between ${pad}`}>
        <span
          className="text-white/75 font-semibold tracking-wide truncate max-w-[80%]"
          style={{ fontSize: sm ? "8px" : lg ? "11px" : "9px" }}
        >
          {card.issuer}
        </span>
      </div>

      {/* EMV chip — vertically centred, left side */}
      {!sm && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Chip />
        </div>
      )}

      {/* Card name + network logo — bottom */}
      <div className={`absolute bottom-0 left-0 right-0 flex items-end justify-between ${pad}`}>
        <div className="min-w-0 flex-1 mr-2">
          <p
            className="text-white font-bold leading-tight truncate"
            style={{ fontSize: sm ? "8px" : lg ? "13px" : "10px" }}
          >
            {card.name}
          </p>
          {!sm && (
            <p
              className="text-white/50 capitalize tracking-wider mt-0.5"
              style={{ fontSize: "8px" }}
            >
              {card.rewardType}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          {card.network === "Visa" && <VisaLogo />}
          {card.network === "Mastercard" && <MastercardLogo />}
          {card.network === "Amex" && <AmexLogo />}
        </div>
      </div>
    </div>
  );
}
