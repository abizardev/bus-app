export type LoyaltyTier = 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface TierInfo {
  currentTier: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  milesPoints: number;
  pointsToNextTier: number;
  progressPercentage: number;
  perks: string[];
}

const TIER_THRESHOLDS = {
  Silver: 0,
  Gold: 500,
  Platinum: 1500,
  Diamond: 3000,
};

const TIER_PERKS: Record<LoyaltyTier, string[]> = {
  Silver: ['Standard Boarding', 'Digital E-Ticket'],
  Gold: ['Standard Boarding', 'Priority Seat Selection', '5% Snack Voucher'],
  Platinum: [
    'Standard Boarding',
    'Priority Seat Selection',
    'Free Reschedule',
    'Waived Admin Fees',
  ],
  Diamond: [
    'Standard Boarding',
    'Priority Seat Selection',
    'Free Reschedule',
    'Waived Admin Fees',
    'Executive VIP Lounge Access',
    '24/7 Dedicated Concierge',
  ],
};

/**
 * Calculates miles earned from a completed ticket booking.
 */
export function calculateMilesEarned(totalFare: number, isVip: boolean = false): number {
  if (totalFare <= 0) return 0;
  const baseMiles = Math.floor(totalFare / 1000);
  return isVip ? Math.floor(baseMiles * 1.5) : baseMiles;
}

/**
 * Evaluates user loyalty tier progress and perks.
 */
export function evaluateTierProgress(milesPoints: number): TierInfo {
  const points = Math.max(0, milesPoints);

  if (points >= TIER_THRESHOLDS.Diamond) {
    return {
      currentTier: 'Diamond',
      nextTier: null,
      milesPoints: points,
      pointsToNextTier: 0,
      progressPercentage: 100,
      perks: TIER_PERKS.Diamond,
    };
  }

  if (points >= TIER_THRESHOLDS.Platinum) {
    const range = TIER_THRESHOLDS.Diamond - TIER_THRESHOLDS.Platinum;
    const progress = points - TIER_THRESHOLDS.Platinum;
    return {
      currentTier: 'Platinum',
      nextTier: 'Diamond',
      milesPoints: points,
      pointsToNextTier: TIER_THRESHOLDS.Diamond - points,
      progressPercentage: Math.floor((progress / range) * 100),
      perks: TIER_PERKS.Platinum,
    };
  }

  if (points >= TIER_THRESHOLDS.Gold) {
    const range = TIER_THRESHOLDS.Platinum - TIER_THRESHOLDS.Gold;
    const progress = points - TIER_THRESHOLDS.Gold;
    return {
      currentTier: 'Gold',
      nextTier: 'Platinum',
      milesPoints: points,
      pointsToNextTier: TIER_THRESHOLDS.Platinum - points,
      progressPercentage: Math.floor((progress / range) * 100),
      perks: TIER_PERKS.Gold,
    };
  }

  const range = TIER_THRESHOLDS.Gold - TIER_THRESHOLDS.Silver;
  const progress = points - TIER_THRESHOLDS.Silver;
  return {
    currentTier: 'Silver',
    nextTier: 'Gold',
    milesPoints: points,
    pointsToNextTier: TIER_THRESHOLDS.Gold - points,
    progressPercentage: Math.floor((progress / range) * 100),
    perks: TIER_PERKS.Silver,
  };
}
