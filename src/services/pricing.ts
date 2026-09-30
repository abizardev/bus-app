export interface FareBreakdownInput {
  basePrice: number;
  selectedSeats: Array<{
    id: string;
    number: string;
    category: '1st Class Sleeper' | 'Executive Class';
    deck?: number;
  }>;
  passengerCount: number;
  baggageWeightKg?: number;
  voucherCode?: string;
  isVipMember?: boolean;
}

export interface FareBreakdownResult {
  baseSeatTotal: number;
  sleeperSurcharge: number;
  baggageSurcharge: number;
  adminFee: number;
  discountAmount: number;
  totalFare: number;
  appliedVoucher?: {
    code: string;
    discountPercent: number;
    maxDiscount: number;
  };
}

export interface Voucher {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minSpend: number;
  expiryDate: string;
  isActive: boolean;
}

const SLEEPER_SURCHARGE_PER_SEAT = 50000;
const STANDARD_ADMIN_FEE = 5000;
const FREE_BAGGAGE_LIMIT_KG = 20;
const BAGGAGE_EXCESS_FEE_PER_KG = 10000;

/**
 * Validates and applies voucher to a spend amount.
 */
export function applyVoucher(
  code: string,
  totalSpend: number,
  vouchers: Voucher[]
): { valid: boolean; discount: number; reason?: string } {
  const normalizedCode = code.trim().toUpperCase();
  const voucher = vouchers.find(
    (v) => v.code.toUpperCase() === normalizedCode
  );

  if (!voucher) {
    return { valid: false, discount: 0, reason: 'Kode voucher tidak ditemukan' };
  }

  if (!voucher.isActive) {
    return { valid: false, discount: 0, reason: 'Voucher tidak aktif atau kedaluwarsa' };
  }

  if (totalSpend < voucher.minSpend) {
    return {
      valid: false,
      discount: 0,
      reason: `Minimum transaksi Rp ${voucher.minSpend.toLocaleString('id-ID')} belum terpenuhi`,
    };
  }

  const calculatedDiscount = Math.floor((totalSpend * voucher.discountPercent) / 100);
  const finalDiscount = Math.min(calculatedDiscount, voucher.maxDiscount);

  return { valid: true, discount: finalDiscount };
}

/**
 * Calculates total booking fare with surcharges, baggage fees, and voucher discounts.
 */
export function calculateBookingFare(
  input: FareBreakdownInput,
  vouchers: Voucher[] = []
): FareBreakdownResult {
  const {
    basePrice,
    selectedSeats,
    passengerCount,
    baggageWeightKg = 0,
    voucherCode,
    isVipMember = false,
  } = input;

  if (basePrice < 0) {
    throw new Error('Harga dasar tidak valid');
  }

  if (!selectedSeats || selectedSeats.length === 0 || passengerCount <= 0) {
    throw new Error('Minimal 1 kursi harus dipilih');
  }

  const baseSeatTotal = basePrice * selectedSeats.length;

  const sleeperSeatCount = selectedSeats.filter(
    (seat) => seat.category === '1st Class Sleeper'
  ).length;
  const sleeperSurcharge = sleeperSeatCount * SLEEPER_SURCHARGE_PER_SEAT;

  const excessBaggageKg = Math.max(0, baggageWeightKg - FREE_BAGGAGE_LIMIT_KG);
  const baggageSurcharge = excessBaggageKg * BAGGAGE_EXCESS_FEE_PER_KG;

  const adminFee = isVipMember ? 0 : STANDARD_ADMIN_FEE;

  const subtotal = baseSeatTotal + sleeperSurcharge + baggageSurcharge;

  let discountAmount = 0;
  let appliedVoucher: FareBreakdownResult['appliedVoucher'] = undefined;

  if (voucherCode) {
    const voucherResult = applyVoucher(voucherCode, subtotal, vouchers);
    if (voucherResult.valid) {
      discountAmount = voucherResult.discount;
      const matched = vouchers.find(
        (v) => v.code.toUpperCase() === voucherCode.trim().toUpperCase()
      );
      if (matched) {
        appliedVoucher = {
          code: matched.code,
          discountPercent: matched.discountPercent,
          maxDiscount: matched.maxDiscount,
        };
      }
    }
  }

  const totalFare = Math.max(0, subtotal - discountAmount + adminFee);

  return {
    baseSeatTotal,
    sleeperSurcharge,
    baggageSurcharge,
    adminFee,
    discountAmount,
    totalFare,
    appliedVoucher,
  };
}
