import { describe, it, expect } from 'vitest';
import {
  calculateBookingFare,
  applyVoucher,
  FareBreakdownInput,
  Voucher,
} from '../pricing';

describe('Pricing & Fare Calculation Service (TDD)', () => {
  const sampleVouchers: Voucher[] = [
    {
      code: 'OMNIPROMO10',
      discountPercent: 10,
      maxDiscount: 50000,
      minSpend: 200000,
      expiryDate: '2026-12-31',
      isActive: true,
    },
    {
      code: 'EXPIRED20',
      discountPercent: 20,
      maxDiscount: 100000,
      minSpend: 100000,
      expiryDate: '2024-01-01',
      isActive: false,
    },
  ];

  describe('applyVoucher', () => {
    it('returns discount when voucher is valid and meets minimum spend', () => {
      const result = applyVoucher('OMNIPROMO10', 300000, sampleVouchers);
      expect(result.valid).toBe(true);
      expect(result.discount).toBe(30000);
    });

    it('caps discount at maxDiscount limit', () => {
      const result = applyVoucher('OMNIPROMO10', 1000000, sampleVouchers);
      expect(result.valid).toBe(true);
      expect(result.discount).toBe(50000); // capped at 50,000
    });

    it('rejects inactive or expired voucher', () => {
      const result = applyVoucher('EXPIRED20', 300000, sampleVouchers);
      expect(result.valid).toBe(false);
      expect(result.discount).toBe(0);
      expect(result.reason).toContain('tidak aktif');
    });

    it('rejects when spend is below minSpend', () => {
      const result = applyVoucher('OMNIPROMO10', 150000, sampleVouchers);
      expect(result.valid).toBe(false);
      expect(result.discount).toBe(0);
      expect(result.reason).toContain('Minimum transaksi');
    });

    it('handles non-existent voucher code gracefully', () => {
      const result = applyVoucher('INVALID_CODE', 500000, sampleVouchers);
      expect(result.valid).toBe(false);
      expect(result.discount).toBe(0);
      expect(result.reason).toContain('tidak ditemukan');
    });

    it('handles case-insensitive voucher codes', () => {
      const result = applyVoucher('omnipromo10', 300000, sampleVouchers);
      expect(result.valid).toBe(true);
      expect(result.discount).toBe(30000);
    });
  });

  describe('calculateBookingFare', () => {
    it('calculates standard fare without surcharges or discount', () => {
      const input: FareBreakdownInput = {
        basePrice: 250000,
        selectedSeats: [
          { id: 's1', number: '01', category: 'Executive Class' },
        ],
        passengerCount: 1,
        baggageWeightKg: 15,
        isVipMember: false,
      };

      const result = calculateBookingFare(input);
      expect(result.baseSeatTotal).toBe(250000);
      expect(result.sleeperSurcharge).toBe(0);
      expect(result.baggageSurcharge).toBe(0);
      expect(result.adminFee).toBe(5000);
      expect(result.discountAmount).toBe(0);
      expect(result.totalFare).toBe(255000);
    });

    it('adds 1st Class Sleeper surcharge (50k per sleeper seat)', () => {
      const input: FareBreakdownInput = {
        basePrice: 300000,
        selectedSeats: [
          { id: 's1', number: '01', category: '1st Class Sleeper' },
          { id: 's2', number: '02', category: '1st Class Sleeper' },
        ],
        passengerCount: 2,
      };

      const result = calculateBookingFare(input);
      expect(result.baseSeatTotal).toBe(600000);
      expect(result.sleeperSurcharge).toBe(100000); // 50k * 2
      expect(result.adminFee).toBe(5000);
      expect(result.totalFare).toBe(705000);
    });

    it('waives admin fee for VIP members', () => {
      const input: FareBreakdownInput = {
        basePrice: 200000,
        selectedSeats: [
          { id: 's1', number: '01', category: 'Executive Class' },
        ],
        passengerCount: 1,
        isVipMember: true,
      };

      const result = calculateBookingFare(input);
      expect(result.adminFee).toBe(0);
      expect(result.totalFare).toBe(200000);
    });

    it('charges baggage surcharge for weight exceeding 20kg limit (10k per excess kg)', () => {
      const input: FareBreakdownInput = {
        basePrice: 200000,
        selectedSeats: [
          { id: 's1', number: '01', category: 'Executive Class' },
        ],
        passengerCount: 1,
        baggageWeightKg: 25, // 5kg excess
      };

      const result = calculateBookingFare(input);
      expect(result.baggageSurcharge).toBe(50000); // 5 * 10000
      expect(result.totalFare).toBe(255000); // 200k + 50k + 5k admin
    });

    it('applies voucher discount to final fare calculation', () => {
      const input: FareBreakdownInput = {
        basePrice: 300000,
        selectedSeats: [
          { id: 's1', number: '01', category: 'Executive Class' },
        ],
        passengerCount: 1,
        voucherCode: 'OMNIPROMO10',
      };

      const result = calculateBookingFare(input, sampleVouchers);
      expect(result.discountAmount).toBe(30000);
      expect(result.totalFare).toBe(275000); // 300k - 30k + 5k
      expect(result.appliedVoucher?.code).toBe('OMNIPROMO10');
    });

    it('throws error when selectedSeats is empty or passengerCount is invalid', () => {
      expect(() =>
        calculateBookingFare({
          basePrice: 200000,
          selectedSeats: [],
          passengerCount: 0,
        })
      ).toThrow('Minimal 1 kursi harus dipilih');
    });

    it('throws error when base price is negative', () => {
      expect(() =>
        calculateBookingFare({
          basePrice: -100,
          selectedSeats: [{ id: 's1', number: '01', category: 'Executive Class' }],
          passengerCount: 1,
        })
      ).toThrow('Harga dasar tidak valid');
    });
  });
});
