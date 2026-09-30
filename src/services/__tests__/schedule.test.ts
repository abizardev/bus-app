import { describe, it, expect } from 'vitest';
import {
  searchAndFilterSchedules,
  sortSchedules,
} from '../schedule';
import { BUS_SCHEDULES } from '../../data/mockData';

describe('Schedule Filter & Search Service (TDD)', () => {
  describe('searchAndFilterSchedules', () => {
    it('returns all schedules when no search parameters are given', () => {
      const results = searchAndFilterSchedules(BUS_SCHEDULES, {});
      expect(results.length).toBe(BUS_SCHEDULES.length);
    });

    it('filters correctly by destination city (case-insensitive)', () => {
      const results = searchAndFilterSchedules(BUS_SCHEDULES, {
        destinationCity: 'yogyakarta',
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((s) => {
        expect(s.arrivalCity.toLowerCase()).toContain('yogyakarta');
      });
    });

    it('filters by service tier keyword', () => {
      const results = searchAndFilterSchedules(BUS_SCHEDULES, {
        serviceTier: 'Executive',
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((s) => {
        expect(s.serviceTier.toLowerCase()).toContain('executive');
      });
    });

    it('filters by maxPrice ceiling', () => {
      const results = searchAndFilterSchedules(BUS_SCHEDULES, {
        maxPrice: 300000,
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((s) => {
        expect(s.pricePerSeat).toBeLessThanOrEqual(300000);
      });
      // pastikan yang mahal ke-filter
      const expensive = BUS_SCHEDULES.filter((s) => s.pricePerSeat > 300000);
      expect(expensive.length).toBeGreaterThan(0);
      expect(results.length).toBe(BUS_SCHEDULES.length - expensive.length);
    });

    it('filters by time window: pagi (05:00-11:59)', () => {
      const results = searchAndFilterSchedules(BUS_SCHEDULES, {
        timeWindow: 'pagi',
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((s) => {
        const hour = parseInt(s.departureTime.split(':')[0], 10);
        expect(hour).toBeGreaterThanOrEqual(5);
        expect(hour).toBeLessThan(12);
      });
    });

    it('filters by time window: malam (18:00-04:59)', () => {
      const results = searchAndFilterSchedules(BUS_SCHEDULES, {
        timeWindow: 'malam',
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((s) => {
        const hour = parseInt(s.departureTime.split(':')[0], 10);
        expect(hour >= 18 || hour < 5).toBe(true);
      });
    });

    it('filters by minAvailableSeats', () => {
      const results = searchAndFilterSchedules(BUS_SCHEDULES, {
        minAvailableSeats: 10,
      });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((s) => {
        expect(s.availableSeats).toBeGreaterThanOrEqual(10);
      });
    });

    it('filters by time window: siang (12:00-17:59)', () => {
      const afternoonBus = {
        ...BUS_SCHEDULES[0],
        id: 'afternoon-1',
        departureTime: '13:00',
      };
      const results = searchAndFilterSchedules([afternoonBus, ...BUS_SCHEDULES], {
        timeWindow: 'siang',
      });
      expect(results.map((r) => r.id)).toContain('afternoon-1');
      results.forEach((s) => {
        const hour = parseInt(s.departureTime.split(':')[0], 10);
        expect(hour).toBeGreaterThanOrEqual(12);
        expect(hour).toBeLessThan(18);
      });
    });

    it('returns empty array when criteria match nothing', () => {
      const results = searchAndFilterSchedules(BUS_SCHEDULES, {
        originCity: 'KotaFiktifTidakAda123',
      });
      expect(results).toEqual([]);
    });
  });

  describe('sortSchedules', () => {
    it('sorts by price ascending', () => {
      const sorted = sortSchedules(BUS_SCHEDULES, 'price_asc');
      const prices = BUS_SCHEDULES.map((s) => s.pricePerSeat);
      expect(sorted[0].pricePerSeat).toBe(Math.min(...prices));
      expect(sorted[sorted.length - 1].pricePerSeat).toBe(Math.max(...prices));
    });

    it('sorts by price descending', () => {
      const sorted = sortSchedules(BUS_SCHEDULES, 'price_desc');
      const prices = BUS_SCHEDULES.map((s) => s.pricePerSeat);
      expect(sorted[0].pricePerSeat).toBe(Math.max(...prices));
      expect(sorted[sorted.length - 1].pricePerSeat).toBe(Math.min(...prices));
    });

    it('sorts by departure earliest', () => {
      const sorted = sortSchedules(BUS_SCHEDULES, 'earliest');
      const times = [...BUS_SCHEDULES.map((s) => s.departureTime)].sort();
      expect(sorted[0].departureTime).toBe(times[0]);
    });

    it('sorts by departure latest', () => {
      const sorted = sortSchedules(BUS_SCHEDULES, 'latest');
      const times = [...BUS_SCHEDULES.map((s) => s.departureTime)].sort();
      expect(sorted[0].departureTime).toBe(times[times.length - 1]);
    });

    it('sorts by duration shortest', () => {
      const sorted = sortSchedules(BUS_SCHEDULES, 'duration');
      const toMin = (d: string) => {
        const h = d.match(/(\d+)j/);
        const m = d.match(/(\d+)m/);
        return (h ? parseInt(h[1], 10) * 60 : 0) + (m ? parseInt(m[1], 10) : 0);
      };
      const min = Math.min(...BUS_SCHEDULES.map((s) => toMin(s.duration)));
      expect(toMin(sorted[0].duration)).toBe(min);
    });
  });
});
