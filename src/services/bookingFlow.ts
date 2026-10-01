import type { BusSchedule, ETicket } from '../data/mockData';
import type { DummyPaymentReceipt } from './dummyPayment';

export type BookingStep = 'jadwal' | 'kursi' | 'tiket-data' | 'pembayaran' | 'etiket';

export interface BookingState {
  currentStep: BookingStep;
  selectedSchedule: BusSchedule | null;
  selectedSeatNumbers: string[];
  passengerName: string;
  paymentReceipt: DummyPaymentReceipt | null;
  isLoggedIn: boolean;
  userId: string | null;
}

export interface SeatHeaderInfo {
  title: string;
  subtitle: string;
  routeLabel: string;
  classBadge: string;
  durationLabel: string;
}

export interface TicketStore {
  list(): ETicket[];
  count(): number;
  save(ticket: ETicket): void;
  clear(): void;
  findByBookingCode(code: string): ETicket | null;
}

export const BOOKING_FLOW_ORDER: BookingStep[] = ['jadwal', 'kursi', 'tiket-data', 'pembayaran', 'etiket'];

export function getInitialBookingState(): BookingState {
  return {
    currentStep: 'jadwal',
    selectedSchedule: null,
    selectedSeatNumbers: [],
    passengerName: '',
    paymentReceipt: null,
    isLoggedIn: false,
    userId: null,
  };
}

function stepIndex(step: BookingStep): number {
  return BOOKING_FLOW_ORDER.indexOf(step);
}

export function canProceedTo(state: BookingState, target: BookingStep): { allowed: boolean; reason?: string } {
  if (!state) return { allowed: false, reason: 'State booking tidak valid.' };
  // Tidak boleh mundur validasi? Mundur selalu boleh.
  if (stepIndex(target) < stepIndex(state.currentStep)) return { allowed: true };

  switch (target) {
    case 'jadwal':
      return { allowed: true };
    case 'kursi':
      if (!state.selectedSchedule) {
        return { allowed: false, reason: 'Pilih jadwal dulu sebelum memilih kursi.' };
      }
      return { allowed: true };
    case 'tiket-data':
      if (!state.selectedSchedule) return { allowed: false, reason: 'Pilih jadwal dulu.' };
      if (!state.selectedSeatNumbers || state.selectedSeatNumbers.length === 0) {
        return { allowed: false, reason: 'Pilih minimal 1 kursi dulu.' };
      }
      return { allowed: true };
    case 'pembayaran':
      if (!state.selectedSchedule) return { allowed: false, reason: 'Pilih jadwal dulu.' };
      if (!state.selectedSeatNumbers || state.selectedSeatNumbers.length === 0) {
        return { allowed: false, reason: 'Pilih minimal 1 kursi dulu sebelum lanjut pembayaran.' };
      }
      if (!state.passengerName || state.passengerName.trim() === '') {
        return { allowed: false, reason: 'Isi nama penumpang dulu sebelum lanjut pembayaran.' };
      }
      return { allowed: true };
    case 'etiket':
      if (!state.paymentReceipt || state.paymentReceipt.status !== 'BERHASIL') {
        return { allowed: false, reason: 'Selesaikan pembayaran dulu. E-tiket terbit setelah bayar BERHASIL.' };
      }
      if (!state.isLoggedIn || !state.userId) {
        return { allowed: false, reason: 'Harus login / punya akun dulu untuk melihat e-tiket.' };
      }
      if (!state.selectedSchedule) return { allowed: false, reason: 'Data jadwal hilang. Ulangi pemesanan.' };
      if (!state.selectedSeatNumbers || state.selectedSeatNumbers.length === 0) {
        return { allowed: false, reason: 'Data kursi hilang. Ulangi pemesanan.' };
      }
      return { allowed: true };
    default:
      return { allowed: false, reason: 'Langkah tidak dikenal.' };
  }
}

export function advanceBookingStep(state: BookingState, target: BookingStep): BookingState {
  const check = canProceedTo(state, target);
  if (!check.allowed) throw new Error(check.reason ?? 'Tidak bisa pindah langkah.');
  return { ...state, currentStep: target };
}

export function resolveBusClassLabel(bus: BusSchedule): string {
  if (!bus || !bus.serviceTier || bus.serviceTier.trim() === '') {
    throw new Error('Data kelas bus tidak valid (serviceTier kosong)');
  }
  const tier = bus.serviceTier.trim();
  const config = (bus.seatConfig ?? '').trim();
  // Format konsisten: "TIER — CONFIG" uppercase untuk badge, contoh "EXECUTIVE PLUS — EKSEKUTIF LEGREST 2-2"
  const label = config ? `${tier} — ${config}` : tier;
  return label.toUpperCase();
}

export function buildSeatSelectionHeader(bus: BusSchedule): SeatHeaderInfo {
  if (!bus) throw new Error('Jadwal bus wajib dipilih dulu');
  const classBadge = resolveBusClassLabel(bus);
  return {
    title: 'Pilih Kursi Bus',
    subtitle: `${bus.operator} ${bus.busCode} • ${bus.departureTime} WIB`,
    routeLabel: `${bus.departureCity} → ${bus.arrivalCity}`,
    classBadge,
    durationLabel: `Est. ${bus.duration}`,
  };
}

export function buildTicketFromBooking(input: {
  bus: BusSchedule;
  seatNumbers: string[];
  passengerName: string;
  travelDate: string;
  paymentReceipt: DummyPaymentReceipt;
}): ETicket {
  const { bus, seatNumbers, passengerName, travelDate, paymentReceipt } = input;
  if (!bus) throw new Error('Jadwal bus wajib ada untuk menerbitkan tiket');
  if (!seatNumbers || seatNumbers.length === 0) throw new Error('Minimal satu kursi wajib dipilih');
  if (!passengerName || passengerName.trim() === '') throw new Error('Nama penumpang tidak boleh kosong');
  if (!paymentReceipt || paymentReceipt.status !== 'BERHASIL') {
    throw new Error('Struk pembayaran BERHASIL wajib ada sebelum tiket terbit');
  }
  const seats = [...seatNumbers].map((s) => s.trim()).filter(Boolean);
  if (seats.length === 0) throw new Error('Minimal satu kursi wajib dipilih');
  const seatStr = seats.join(', ');
  const now = Date.now();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return {
    id: `ticket-${now}`,
    bookingCode: `BUS-${rand}`,
    operator: bus.operator,
    fleetCode: `Armada ${bus.busCode}`,
    passengerName: passengerName.trim(),
    passengerType: 'Dewasa',
    departureTime: bus.departureTime,
    departureDate: travelDate,
    departureCity: bus.departureCity,
    departureTerminal: bus.departureStation.replace('Terminal ', ''),
    departureSub: bus.departureStation,
    arrivalTime: bus.arrivalTime,
    arrivalCity: bus.arrivalCity,
    arrivalTerminal: bus.arrivalStation.replace('Terminal ', ''),
    duration: bus.duration,
    routeType: bus.routeHighlight || 'Langsung',
    seatNumber: seatStr,
    seatType: bus.seatConfig,
    platform: 'Jalur 04',
    platformFloor: 'Lantai 2',
    busClass: bus.serviceTier,
    classConfig: bus.seatConfig,
    terminalGate: 'Gerbang B3',
    barcodeNumber: `9823 ${String(rand).slice(0, 4)} ${paymentReceipt.receiptId.slice(-4)} ${bus.busCode.replace(/\s+/g, '')}`,
    baggageTag: `Tag #${seats[0]}-A`,
    baggageMaxKg: 20,
    status: 'SIAP BOARDING',
  };
}

export function createTicketStore(): TicketStore {
  // Database tiket: awalnya KOSONG. Tiket hanya muncul setelah bayar + konfirmasi.
  let db: ETicket[] = [];
  return {
    list() {
      return [...db];
    },
    count() {
      return db.length;
    },
    save(ticket: ETicket) {
      if (!ticket || !ticket.bookingCode) throw new Error('Tiket tidak valid untuk disimpan');
      db = [...db, ticket];
    },
    clear() {
      db = [];
    },
    findByBookingCode(code: string) {
      return db.find((t) => t.bookingCode === code) ?? null;
    },
  };
}

export function getEmptyTicketMessage(): string {
  return 'Belum ada e-tiket. Pesan dulu dari menu Jadwal — tiket terbit otomatis setelah pembayaran dummy BERHASIL.';
}
