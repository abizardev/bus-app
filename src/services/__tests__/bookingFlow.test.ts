import { describe, it, expect } from 'vitest';
import {
  BOOKING_FLOW_ORDER,
  getInitialBookingState,
  canProceedTo,
  advanceBookingStep,
  resolveBusClassLabel,
  buildSeatSelectionHeader,
  buildTicketFromBooking,
  createTicketStore,
  getEmptyTicketMessage,
} from '../bookingFlow';
import { BUS_SCHEDULES } from '../../data/mockData';

// RED: flow jadwal -> kursi -> tiket-data -> pembayaran -> etiket harus berurutan & konsisten.
// Nama eksekutif/kelas + rute dari jadwal harus sama persis di layar kursi & tiket.
// E-tiket butuh akun + database yang awalnya kosong (tidak langsung dapat tiket).
describe('BookingFlow Konsistensi + DB Kosong + Akun (TDD RED)', () => {
  describe('BOOKING_FLOW_ORDER & getInitialBookingState', () => {
    it('urutan flow mencakup 5 langkah wajib', () => {
      expect(BOOKING_FLOW_ORDER).toEqual(['jadwal', 'kursi', 'tiket-data', 'pembayaran', 'etiket']);
    });

    it('state awal: di jadwal, belum pilih apa-apa, belum login, DB tiket kosong', () => {
      const s = getInitialBookingState();
      expect(s.currentStep).toBe('jadwal');
      expect(s.selectedSchedule).toBeNull();
      expect(s.selectedSeatNumbers).toEqual([]);
      expect(s.paymentReceipt).toBeNull();
      expect(s.isLoggedIn).toBe(false);
    });
  });

  describe('canProceedTo — guard tiap langkah', () => {
    it('tidak bisa ke kursi tanpa pilih jadwal', () => {
      const s = getInitialBookingState();
      const r = canProceedTo(s, 'kursi');
      expect(r.allowed).toBe(false);
      expect(r.reason).toBeDefined();
    });

    it('bisa ke kursi setelah pilih jadwal', () => {
      const s = { ...getInitialBookingState(), selectedSchedule: BUS_SCHEDULES[0] };
      expect(canProceedTo(s, 'kursi').allowed).toBe(true);
    });

    it('tidak bisa ke pembayaran tanpa kursi / tanpa nama penumpang', () => {
      const base = { ...getInitialBookingState(), selectedSchedule: BUS_SCHEDULES[0] };
      expect(canProceedTo(base, 'pembayaran').allowed).toBe(false);
      const withSeat = { ...base, selectedSeatNumbers: ['06'], passengerName: '' };
      expect(canProceedTo(withSeat, 'pembayaran').allowed).toBe(false);
      const ok = { ...base, selectedSeatNumbers: ['06'], passengerName: 'Budi Santoso' };
      expect(canProceedTo(ok, 'pembayaran').allowed).toBe(true);
    });

    it('tidak bisa ke etiket tanpa struk pembayaran BERHASIL', () => {
      const s = {
        ...getInitialBookingState(),
        selectedSchedule: BUS_SCHEDULES[0],
        selectedSeatNumbers: ['06'],
        passengerName: 'Budi',
        isLoggedIn: true,
        userId: 'u-1',
        paymentReceipt: null,
      };
      expect(canProceedTo(s, 'etiket').allowed).toBe(false);
    });

    it('tidak bisa ke etiket bila belum login (wajib punya akun)', () => {
      const s = {
        ...getInitialBookingState(),
        selectedSchedule: BUS_SCHEDULES[0],
        selectedSeatNumbers: ['06'],
        passengerName: 'Budi',
        isLoggedIn: false,
        userId: null,
        paymentReceipt: {
          receiptId: 'RC-1', methodId: 'gopay' as const, methodName: 'GoPay',
          amount: 100000, bookingRef: 'B1', status: 'BERHASIL' as const, paidAtIso: new Date().toISOString(),
        },
      };
      const r = canProceedTo(s, 'etiket');
      expect(r.allowed).toBe(false);
      expect(r.reason).toMatch(/login|akun/i);
    });

    it('bisa ke etiket bila sudah bayar + sudah login', () => {
      const s = {
        ...getInitialBookingState(),
        selectedSchedule: BUS_SCHEDULES[0],
        selectedSeatNumbers: ['06'],
        passengerName: 'Budi',
        isLoggedIn: true,
        userId: 'u-1',
        paymentReceipt: {
          receiptId: 'RC-1', methodId: 'gopay' as const, methodName: 'GoPay',
          amount: 100000, bookingRef: 'B1', status: 'BERHASIL' as const, paidAtIso: new Date().toISOString(),
        },
      };
      expect(canProceedTo(s, 'etiket').allowed).toBe(true);
    });
  });

  describe('advanceBookingStep', () => {
    it('pindah maju bila guard lolos', () => {
      const s = { ...getInitialBookingState(), selectedSchedule: BUS_SCHEDULES[0] };
      expect(advanceBookingStep(s, 'kursi').currentStep).toBe('kursi');
    });

    it('throw bila guard tidak lolos (loncat jadwal -> pembayaran)', () => {
      const s = getInitialBookingState();
      expect(() => advanceBookingStep(s, 'pembayaran')).toThrow();
    });

    it('tidak mutasi state asal (immutable)', () => {
      const s = { ...getInitialBookingState(), selectedSchedule: BUS_SCHEDULES[0] };
      const next = advanceBookingStep(s, 'kursi');
      expect(s.currentStep).toBe('jadwal');
      expect(next.currentStep).toBe('kursi');
    });
  });

  describe('resolveBusClassLabel — nama eksekutif konsisten', () => {
    it('menampilkan label eksekutif dari jadwal (bukan hardcode)', () => {
      const bus = BUS_SCHEDULES[0]; // Sinar Jaya Executive Plus / Eksekutif Legrest 2-2
      const label = resolveBusClassLabel(bus);
      expect(label.toLowerCase()).toContain('eksekutif');
      expect(label.length).toBeGreaterThan(5);
    });

    it('VIP / Bisnis / Sleeper ikut terbawa', () => {
      const vip = BUS_SCHEDULES.find((b) => b.serviceTier === 'VIP')!;
      expect(resolveBusClassLabel(vip).toLowerCase()).toMatch(/vip/);
      const sleeper = { ...BUS_SCHEDULES[0], serviceTier: 'Sleeper', seatConfig: 'Sleeper 1-1-1' };
      expect(resolveBusClassLabel(sleeper).toLowerCase()).toMatch(/sleeper/);
    });

    it('throw untuk bus null / tanpa tier', () => {
      // @ts-expect-error sengaja null untuk edge case
      expect(() => resolveBusClassLabel(null)).toThrow();
      expect(() => resolveBusClassLabel({ ...BUS_SCHEDULES[0], serviceTier: '' })).toThrow();
    });
  });

  describe('buildSeatSelectionHeader — rute & kelas sama dengan jadwal', () => {
    it('routeLabel memakai kota aktual bus (bukan hardcode Pulogebang->Giwangan)', () => {
      const sby = BUS_SCHEDULES.find((b) => b.id === 'hj-jkt-sby-01')!; // Jakarta -> Surabaya
      const h = buildSeatSelectionHeader(sby);
      expect(h.routeLabel).toContain('Jakarta');
      expect(h.routeLabel).toContain('Surabaya');
      expect(h.routeLabel).not.toBe('Terminal Pulogebang → Giwangan');
    });

    it('subtitle memuat operator + kode bus + jam', () => {
      const bus = BUS_SCHEDULES[0];
      const h = buildSeatSelectionHeader(bus);
      expect(h.subtitle).toContain(bus.operator);
      expect(h.subtitle).toContain(bus.busCode);
      expect(h.subtitle).toContain(bus.departureTime);
    });

    it('classBadge konsisten dengan resolveBusClassLabel', () => {
      const bus = BUS_SCHEDULES[0];
      expect(buildSeatSelectionHeader(bus).classBadge).toBe(resolveBusClassLabel(bus));
    });

    it('durationLabel memakai durasi jadwal', () => {
      const bus = BUS_SCHEDULES[0];
      expect(buildSeatSelectionHeader(bus).durationLabel).toContain(bus.duration);
    });
  });

  describe('buildTicketFromBooking — data tiket = data jadwal + kursi + struk', () => {
    const receipt = {
      receiptId: 'RC-99', methodId: 'gopay' as const, methodName: 'GoPay',
      amount: 365000, bookingRef: 'BOOK-99', status: 'BERHASIL' as const, paidAtIso: new Date().toISOString(),
    };

    it('operator / jam / kota tiket sama persis dengan jadwal', () => {
      const bus = BUS_SCHEDULES.find((b) => b.id === 'hj-jkt-sby-01')!;
      const t = buildTicketFromBooking({ bus, seatNumbers: ['06'], passengerName: 'Budi Santoso', travelDate: '2026-10-15', paymentReceipt: receipt });
      expect(t.operator).toBe(bus.operator);
      expect(t.departureTime).toBe(bus.departureTime);
      expect(t.arrivalTime).toBe(bus.arrivalTime);
      expect(t.departureCity).toBe(bus.departureCity);
      expect(t.arrivalCity).toBe(bus.arrivalCity);
      expect(t.seatNumber).toContain('06');
      expect(t.passengerName).toBe('Budi Santoso');
      expect(t.status).toBe('SIAP BOARDING');
    });

    it('kursi ganda digabung dengan koma', () => {
      const bus = BUS_SCHEDULES[0];
      const t = buildTicketFromBooking({ bus, seatNumbers: ['01', '02'], passengerName: 'A', travelDate: '2026-10-15', paymentReceipt: receipt });
      expect(t.seatNumber).toBe('01, 02');
    });

    it('throw bila kursi kosong / nama kosong / tanpa struk bayar', () => {
      const bus = BUS_SCHEDULES[0];
      expect(() => buildTicketFromBooking({ bus, seatNumbers: [], passengerName: 'A', travelDate: '2026-10-15', paymentReceipt: receipt })).toThrow(/kursi/i);
      expect(() => buildTicketFromBooking({ bus, seatNumbers: ['01'], passengerName: '  ', travelDate: '2026-10-15', paymentReceipt: receipt })).toThrow(/nama/i);
      // @ts-expect-error sengaja null
      expect(() => buildTicketFromBooking({ bus, seatNumbers: ['01'], passengerName: 'A', travelDate: '2026-10-15', paymentReceipt: null })).toThrow(/bayar|payment|struk/i);
    });
  });

  describe('createTicketStore — database tiket awalnya kosong', () => {
    it('store baru kosong (belum langsung dapat tiket saat proses)', () => {
      const store = createTicketStore();
      expect(store.list()).toEqual([]);
      expect(store.count()).toBe(0);
    });

    it('tiket baru muncul setelah save (habis bayar -> konfirmasi -> tiket terbit)', () => {
      const store = createTicketStore();
      const bus = BUS_SCHEDULES[0];
      const receipt = {
        receiptId: 'RC-7', methodId: 'ovo' as const, methodName: 'OVO',
        amount: 200000, bookingRef: 'BOOK-7', status: 'BERHASIL' as const, paidAtIso: new Date().toISOString(),
      };
      const t = buildTicketFromBooking({ bus, seatNumbers: ['04'], passengerName: 'Siti', travelDate: '2026-10-15', paymentReceipt: receipt });
      store.save(t);
      expect(store.count()).toBe(1);
      expect(store.list()[0].bookingCode).toBe(t.bookingCode);
      expect(store.findByBookingCode(t.bookingCode)?.passengerName).toBe('Siti');
    });

    it('findByBookingCode null bila tidak ada + clear mengosongkan lagi', () => {
      const store = createTicketStore();
      expect(store.findByBookingCode('TIDAK-ADA')).toBeNull();
      const bus = BUS_SCHEDULES[0];
      const receipt = {
        receiptId: 'RC-8', methodId: 'ovo' as const, methodName: 'OVO',
        amount: 200000, bookingRef: 'BOOK-8', status: 'BERHASIL' as const, paidAtIso: new Date().toISOString(),
      };
      store.save(buildTicketFromBooking({ bus, seatNumbers: ['01'], passengerName: 'X', travelDate: '2026-10-15', paymentReceipt: receipt }));
      store.clear();
      expect(store.count()).toBe(0);
    });
  });

  describe('getEmptyTicketMessage', () => {
    it('pesan kosong ramah + ajak pesan (dipakai tab e-tiket sebelum bayar)', () => {
      const msg = getEmptyTicketMessage();
      expect(msg.length).toBeGreaterThan(10);
      expect(msg.toLowerCase()).toMatch(/belum|kosong|pesan|jadwal/);
    });
  });
});
