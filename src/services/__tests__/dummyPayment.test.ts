import { describe, it, expect } from 'vitest';
import {
  DUMMY_PAYMENT_METHODS,
  listDummyPaymentMethods,
  getDummyPaymentMethod,
  validateDummyPaymentRequest,
  processDummyPayment,
  getDummyPaymentInstructions,
} from '../dummyPayment';

// RED: payment gateway pura-pura (dummy): bisa milih metode, lalu konfirmasi -> tiket.
// Harus ada tombol "Lanjutkan Pembayaran" (diwakili validasi request) + struk BERHASIL.
describe('DummyPayment Gateway (TDD RED)', () => {
  describe('listDummyPaymentMethods', () => {
    it('menyediakan minimal 8 metode dummy (e-wallet, VA, gerai)', () => {
      const methods = listDummyPaymentMethods();
      expect(methods.length).toBeGreaterThanOrEqual(8);
      const cats = new Set(methods.map((m) => m.category));
      expect(cats.has('e-wallet')).toBe(true);
      expect(cats.has('virtual_account')).toBe(true);
      expect(cats.has('gerai')).toBe(true);
    });

    it('setiap metode punya id unik, nama, badge, dan instruksi', () => {
      const methods = listDummyPaymentMethods();
      const ids = methods.map((m) => m.id);
      expect(new Set(ids).size).toBe(methods.length);
      for (const m of methods) {
        expect(m.name.length).toBeGreaterThan(0);
        expect(m.badge.length).toBeGreaterThan(0);
        expect(m.instructions.length).toBeGreaterThan(0);
        expect(m.fee).toBeGreaterThanOrEqual(0);
      }
    });

    it('memuat gopay, ovo, bca, mandiri (dipakai UI lama)', () => {
      const ids = listDummyPaymentMethods().map((m) => m.id);
      expect(ids).toContain('gopay');
      expect(ids).toContain('ovo');
      expect(ids).toContain('bca_va');
      expect(ids).toContain('mandiri_va');
    });

    it('DUMMY_PAYMENT_METHODS export konsisten', () => {
      expect(DUMMY_PAYMENT_METHODS.length).toBeGreaterThanOrEqual(8);
      expect(DUMMY_PAYMENT_METHODS.map((m) => m.id).sort()).toEqual(
        listDummyPaymentMethods().map((m) => m.id).sort(),
      );
    });
  });

  describe('getDummyPaymentMethod', () => {
    it('mengembalikan metode untuk id valid (case-insensitive, trim)', () => {
      expect(getDummyPaymentMethod('gopay').name.toLowerCase()).toContain('gopay');
      expect(getDummyPaymentMethod('  BCA_VA ').id).toBe('bca_va');
    });

    it('throw untuk metode tidak dikenal / kosong', () => {
      expect(() => getDummyPaymentMethod('tidak-ada')).toThrow(/tidak ditemukan|unknown/i);
      expect(() => getDummyPaymentMethod('')).toThrow();
      expect(() => getDummyPaymentMethod('   ')).toThrow();
    });
  });

  describe('validateDummyPaymentRequest (gerbang tombol Lanjutkan Pembayaran)', () => {
    it('valid untuk request lengkap', () => {
      expect(
        validateDummyPaymentRequest({ methodId: 'gopay', amount: 365000, bookingRef: 'BOOK-1', passengerName: 'Budi' }).valid,
      ).toBe(true);
    });

    it('tidak valid bila metode kosong / tidak dikenal', () => {
      expect(validateDummyPaymentRequest({ methodId: '', amount: 100000, bookingRef: 'B1', passengerName: 'A' }).valid).toBe(false);
      expect(validateDummyPaymentRequest({ methodId: 'paypal-xx', amount: 100000, bookingRef: 'B1', passengerName: 'A' }).valid).toBe(false);
    });

    it('tidak valid bila nominal <= 0 atau bookingRef kosong atau nama kosong', () => {
      expect(validateDummyPaymentRequest({ methodId: 'gopay', amount: 0, bookingRef: 'B1', passengerName: 'A' }).valid).toBe(false);
      expect(validateDummyPaymentRequest({ methodId: 'gopay', amount: -5, bookingRef: 'B1', passengerName: 'A' }).valid).toBe(false);
      expect(validateDummyPaymentRequest({ methodId: 'gopay', amount: 100000, bookingRef: '  ', passengerName: 'A' }).valid).toBe(false);
      expect(validateDummyPaymentRequest({ methodId: 'gopay', amount: 100000, bookingRef: 'B1', passengerName: '  ' }).valid).toBe(false);
    });

    it('memberi reason Indonesia yang bisa ditampilkan ke user', () => {
      const r = validateDummyPaymentRequest({ methodId: '', amount: 0, bookingRef: '', passengerName: '' });
      expect(r.valid).toBe(false);
      expect(r.reason).toBeDefined();
      expect(r.reason!.length).toBeGreaterThan(5);
    });
  });

  describe('processDummyPayment (pura-pura, async)', () => {
    it('BERHASIL dan mengembalikan struk dengan receiptId + amount sama', async () => {
      const receipt = await processDummyPayment({ methodId: 'gopay', amount: 365000, bookingRef: 'BOOK-123', passengerName: 'Budi' });
      expect(receipt.status).toBe('BERHASIL');
      expect(receipt.amount).toBe(365000);
      expect(receipt.bookingRef).toBe('BOOK-123');
      expect(receipt.methodId).toBe('gopay');
      expect(receipt.receiptId.length).toBeGreaterThan(5);
      expect(receipt.paidAtIso.length).toBeGreaterThan(0);
    });

    it('VA methods menyertakan nomor VA dummy', async () => {
      const receipt = await processDummyPayment({ methodId: 'bca_va', amount: 200000, bookingRef: 'BOOK-VA', passengerName: 'Siti' });
      expect(receipt.status).toBe('BERHASIL');
      expect(receipt.vaNumber).toBeDefined();
      expect(receipt.vaNumber!.length).toBeGreaterThan(5);
    });

    it('reject untuk request invalid (metode salah / nominal 0)', async () => {
      await expect(processDummyPayment({ methodId: 'salah', amount: 100000, bookingRef: 'B1', passengerName: 'A' })).rejects.toThrow();
      await expect(processDummyPayment({ methodId: 'gopay', amount: 0, bookingRef: 'B1', passengerName: 'A' })).rejects.toThrow();
    });

    it('dua pembayaran bookingRef berbeda menghasilkan receiptId berbeda', async () => {
      const a = await processDummyPayment({ methodId: 'ovo', amount: 100000, bookingRef: 'BOOK-A', passengerName: 'A' });
      const b = await processDummyPayment({ methodId: 'ovo', amount: 100000, bookingRef: 'BOOK-B', passengerName: 'A' });
      expect(a.receiptId).not.toBe(b.receiptId);
    });
  });

  describe('getDummyPaymentInstructions', () => {
    it('mengembalikan instruksi dummy per metode', () => {
      const ins = getDummyPaymentInstructions('alfamart');
      expect(ins.length).toBeGreaterThan(10);
    });

    it('throw untuk metode tidak dikenal', () => {
      expect(() => getDummyPaymentInstructions('nope')).toThrow();
    });
  });
});
