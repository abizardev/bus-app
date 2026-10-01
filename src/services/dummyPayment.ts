export type DummyPaymentMethodId =
  | 'gopay'
  | 'ovo'
  | 'dana'
  | 'bca_va'
  | 'mandiri_va'
  | 'bri_va'
  | 'alfamart'
  | 'indomaret';

export type DummyPaymentCategory = 'e-wallet' | 'virtual_account' | 'gerai';

export interface DummyPaymentMethod {
  id: DummyPaymentMethodId;
  name: string;
  category: DummyPaymentCategory;
  badge: string;
  fee: number;
  instructions: string;
}

export interface DummyPaymentRequest {
  methodId: string;
  amount: number;
  bookingRef: string;
  passengerName: string;
}

export interface DummyPaymentReceipt {
  receiptId: string;
  methodId: DummyPaymentMethodId;
  methodName: string;
  amount: number;
  bookingRef: string;
  status: 'BERHASIL';
  paidAtIso: string;
  vaNumber?: string;
}

const METHODS: DummyPaymentMethod[] = [
  {
    id: 'gopay',
    name: 'GoPay',
    category: 'e-wallet',
    badge: 'Instan',
    fee: 2000,
    instructions: 'Dummy: buka aplikasi GoPay (simulasi), scan QR dummy, tekan Bayar. Tidak ada uang asli berpindah.',
  },
  {
    id: 'ovo',
    name: 'OVO',
    category: 'e-wallet',
    badge: 'Cashback',
    fee: 2000,
    instructions: 'Dummy: buka OVO (simulasi), masukkan nomor 0812-xxxx, konfirmasi PIN dummy 123456.',
  },
  {
    id: 'dana',
    name: 'DANA',
    category: 'e-wallet',
    badge: 'Instan',
    fee: 1500,
    instructions: 'Dummy: buka DANA (simulasi), approve pembayaran dummy di notifikasi.',
  },
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    category: 'virtual_account',
    badge: 'Otomatis',
    fee: 4000,
    instructions: 'Dummy: transfer ke VA BCA 88899 + kode booking (simulasi). Otomatis terverifikasi 1 detik.',
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Livin VA',
    category: 'virtual_account',
    badge: 'Otomatis',
    fee: 4000,
    instructions: 'Dummy: transfer ke VA Mandiri 88999 + kode booking (simulasi) via Livin.',
  },
  {
    id: 'bri_va',
    name: 'BRI Virtual Account',
    category: 'virtual_account',
    badge: 'Otomatis',
    fee: 4000,
    instructions: 'Dummy: transfer ke VA BRI 88777 + kode booking (simulasi) via BRImo.',
  },
  {
    id: 'alfamart',
    name: 'Alfamart',
    category: 'gerai',
    badge: 'Tunai',
    fee: 2500,
    instructions: 'Dummy: tunjukkan kode bayar dummy ke kasir Alfamart (simulasi), bayar tunai.',
  },
  {
    id: 'indomaret',
    name: 'Indomaret',
    category: 'gerai',
    badge: 'Tunai',
    fee: 2500,
    instructions: 'Dummy: tunjukkan kode bayar dummy ke kasir Indomaret (simulasi), bayar tunai.',
  },
];

export const DUMMY_PAYMENT_METHODS: DummyPaymentMethod[] = METHODS;

export function listDummyPaymentMethods(): DummyPaymentMethod[] {
  return [...METHODS];
}

function normalizeId(methodId: string): string {
  return (methodId ?? '').trim().toLowerCase();
}

export function getDummyPaymentMethod(methodId: string): DummyPaymentMethod {
  const key = normalizeId(methodId);
  if (!key) throw new Error('Metode pembayaran tidak ditemukan: (kosong)');
  const found = METHODS.find((m) => m.id === key);
  if (!found) throw new Error(`Metode pembayaran tidak ditemukan: ${methodId}`);
  return found;
}

export function validateDummyPaymentRequest(req: DummyPaymentRequest): { valid: boolean; reason?: string } {
  if (!req) return { valid: false, reason: 'Data pembayaran belum lengkap. Pilih metode pembayaran dulu.' };
  const key = normalizeId(req.methodId);
  const known = METHODS.some((m) => m.id === key);
  if (!key || !known) {
    return { valid: false, reason: 'Pilih metode pembayaran dulu (GoPay, OVO, DANA, VA, atau gerai).' };
  }
  if (!Number.isFinite(req.amount) || req.amount <= 0) {
    return { valid: false, reason: 'Nominal pembayaran tidak valid. Ulangi dari layar kursi.' };
  }
  if (!req.bookingRef || req.bookingRef.trim() === '') {
    return { valid: false, reason: 'Referensi booking kosong. Kembali dan pilih kursi lagi.' };
  }
  if (!req.passengerName || req.passengerName.trim() === '') {
    return { valid: false, reason: 'Nama penumpang wajib diisi sebelum lanjut pembayaran.' };
  }
  return { valid: true };
}

function makeVaNumber(methodId: DummyPaymentMethodId, bookingRef: string): string {
  const prefix = methodId === 'bca_va' ? '88899' : methodId === 'mandiri_va' ? '88999' : '88777';
  let hash = 0;
  for (let i = 0; i < bookingRef.length; i++) hash = (hash * 31 + bookingRef.charCodeAt(i)) % 100000;
  return `${prefix}${String(10000 + (hash % 89999))}`;
}

export async function processDummyPayment(req: DummyPaymentRequest): Promise<DummyPaymentReceipt> {
  const check = validateDummyPaymentRequest(req);
  if (!check.valid) throw new Error(check.reason ?? 'Pembayaran dummy tidak valid');
  const method = getDummyPaymentMethod(req.methodId);
  // Simulasi jeda gateway pura-pura (cepat agar test tidak lambat)
  await new Promise((resolve) => setTimeout(resolve, 15));
  const rand = Math.floor(100000 + Math.random() * 900000);
  const receipt: DummyPaymentReceipt = {
    receiptId: `DUMMY-${Date.now()}-${rand}`,
    methodId: method.id,
    methodName: method.name,
    amount: req.amount,
    bookingRef: req.bookingRef.trim(),
    status: 'BERHASIL',
    paidAtIso: new Date().toISOString(),
  };
  if (method.category === 'virtual_account') {
    receipt.vaNumber = makeVaNumber(method.id, req.bookingRef);
  }
  return receipt;
}

export function getDummyPaymentInstructions(methodId: string): string {
  return getDummyPaymentMethod(methodId).instructions;
}
