import { describe, it, expect } from 'vitest';
import {
  calculateMilesEarned,
  evaluateTierProgress,
} from '../loyalty';

describe('Loyalty & VIP Tier Service (TDD)', () => {
  describe('calculateMilesEarned', () => {
    it('calculates standard miles earned (1 mile per 1000 IDR)', () => {
      const miles = calculateMilesEarned(250000, false);
      expect(miles).toBe(250);
    });

    it('calculates 1.5x bonus miles for VIP members', () => {
      const miles = calculateMilesEarned(250000, true);
      expect(miles).toBe(375);
    });

    it('returns 0 miles for negative or zero spend', () => {
      expect(calculateMilesEarned(0)).toBe(0);
      expect(calculateMilesEarned(-50000)).toBe(0);
    });
  });

  describe('evaluateTierProgress', () => {
    it('evaluates Silver tier correctly for < 500 points', () => {
      const tier = evaluateTierProgress(250);
      expect(tier.currentTier).toBe('Silver');
      expect(tier.nextTier).toBe('Gold');
      expect(tier.pointsToNextTier).toBe(250);
      expect(tier.progressPercentage).toBe(50);
      expect(tier.perks).toContain('Standard Boarding');
    });

    it('evaluates Gold tier for 500 - 1499 points', () => {
      const tier = evaluateTierProgress(1000);
      expect(tier.currentTier).toBe('Gold');
      expect(tier.nextTier).toBe('Platinum');
      expect(tier.pointsToNextTier).toBe(500);
      expect(tier.progressPercentage).toBe(50);
      expect(tier.perks).toContain('Priority Seat Selection');
    });

    it('evaluates Platinum tier for 1500 - 2999 points', () => {
      const tier = evaluateTierProgress(2000);
      expect(tier.currentTier).toBe('Platinum');
      expect(tier.nextTier).toBe('Diamond');
      expect(tier.pointsToNextTier).toBe(1000);
      expect(tier.perks).toContain('Free Reschedule');
    });

    it('evaluates Diamond tier for >= 3000 points (max tier)', () => {
      const tier = evaluateTierProgress(3500);
      expect(tier.currentTier).toBe('Diamond');
      expect(tier.nextTier).toBeNull();
      expect(tier.pointsToNextTier).toBe(0);
      expect(tier.progressPercentage).toBe(100);
      expect(tier.perks).toContain('Executive VIP Lounge Access');
    });
  });
});
