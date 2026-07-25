export type RewardType = "cashback" | "points" | "miles";
export type Network = "Visa" | "Mastercard" | "Amex";
export type Category = "cashback" | "travel" | "grocery" | "no-fee" | "business" | "student" | "rewards" | "premium" | "dining";

export interface EarnRates {
  groceries: number;
  gas: number;
  dining: number;
  travel: number;
  drugstore: number;
  amazon?: number;
  transit?: number;
  streaming?: number;
  other: number;
}

export interface Insurance {
  travelMedical: boolean;
  travelMedicalDays?: number;
  tripCancellation: boolean;
  tripInterruption: boolean;
  flightDelay: boolean;
  baggageLoss: boolean;
  carRental: boolean;
  purchaseProtection: boolean;
  purchaseProtectionDays?: number;
  extendedWarranty: boolean;
  mobileDevice: boolean;
}

export interface Perks {
  loungeAccess: boolean;
  loungeVisits?: number;
  loungeProgram?: string;
  concierge: boolean;
  hotelStatus?: string;
  priorityPass?: boolean;
  airportParking?: boolean;
  globalEntry?: boolean;
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  network: Network;
  categories: Category[];
  rewardType: RewardType;
  rewardProgram?: string;
  annualFee: number;
  annualFeeWaivable: boolean;
  annualFeeWaiverCondition?: string;
  welcomeBonus?: string;
  welcomeBonusValue?: number;
  earnRates: EarnRates;
  earnRateUnit: string;
  earnCap?: string;
  foreignTransactionFee: number;
  insurance: Insurance;
  perks: Perks;
  minPersonalIncome?: number;
  minHouseholdIncome?: number;
  creditScoreRequired: "Good" | "Very Good" | "Excellent";
  applyUrl: string;
  color: string;
  notes?: string;
}
