export interface BusSchedule {
  id: string;
  operator: string;
  busCode: string;
  serviceTier: string;
  seatConfig: string;
  departureTime: string;
  departureCity: string;
  departureStation: string;
  arrivalTime: string;
  arrivalCity: string;
  arrivalStation: string;
  duration: string;
  routeHighlight: string;
  availableSeats: number;
  pricePerSeat: number;
  badge?: string;
  urgentWarning?: boolean;
}

export interface SeatItem {
  id: string;
  number: string;
  deck: number;
  level: 'Atas' | 'Bawah';
  row: number;
  col: number; // 0 for left, 1 for right
  status: 'tersedia' | 'terisi' | 'dipilih';
  price: number;
  category: '1st Class Sleeper' | 'Executive Class';
}

export interface ETicket {
  id: string;
  bookingCode: string;
  operator: string;
  fleetCode: string;
  passengerName: string;
  passengerType: string;
  departureTime: string;
  departureDate: string;
  departureCity: string;
  departureTerminal: string;
  departureSub: string;
  arrivalTime: string;
  arrivalCity: string;
  arrivalTerminal: string;
  duration: string;
  routeType: string;
  seatNumber: string;
  seatType: string;
  platform: string;
  platformFloor: string;
  busClass: string;
  classConfig: string;
  terminalGate: string;
  barcodeNumber: string;
  baggageTag: string;
  baggageMaxKg: number;
  status: 'SIAP BOARDING' | 'SELESAI' | 'MENUNGGU';
}

export interface TravelHistoryItem {
  id: string;
  date: string;
  fromCity: string;
  fromPoint: string;
  toCity: string;
  toPoint: string;
  duration: string;
  operator: string;
  seat: string;
  status: 'SELESAI' | 'TERJADWAL';
}

export const INITIAL_USER = {
  name: 'Jasper Collins',
  roleGreeting: 'Halo Penglaju!',
  tierTitle: 'Platinum Traveler',
  isVip: true,
  milesPoints: 1450,
  milesGoal: 2000,
  tierGoalName: 'DIAMOND TIER',
  stats: {
    tripsCompleted: 18,
    activeTickets: 3,
    discountVouchers: 4,
  },
  verifiedNik: '317104******0008',
  phone: '+62 812-9844-8891',
};

export const POPULAR_ROUTES = [
  { from: 'Terminal Pulo Gebang, Jakarta', to: 'Terminal Giwangan, Yogyakarta' },
  { from: 'Terminal Kampung Rambutan, Jakarta', to: 'Terminal Tirtonadi, Solo' },
  { from: 'Terminal Kalideres, Jakarta', to: 'Terminal Bungurasih, Surabaya' },
  { from: 'Pool Dipati Ukur, Bandung', to: 'Terminal Jombor, Yogyakarta' },
  { from: 'Terminal Pulo Gebang, Jakarta', to: 'Terminal Purabaya (Bungurasih), Surabaya' },
  { from: 'Terminal Poris Plawad, Tangerang', to: 'Terminal Rajabasa, Bandar Lampung' },
  { from: 'Terminal Leuwipanjang, Bandung', to: 'Terminal Giwangan, Yogyakarta' },
  { from: 'Terminal Pulo Gebang, Jakarta', to: 'Terminal Mengwi, Badung' },
];

export { TERMINALS } from './terminals';

// Database jadwal real hasil riset Feb-Mar 2026 (Kompas, Bisnis, RedBus, Traveloka,
// terminalpulogebang.com, jadwalbis.com). Harga = tarif normal non-Lebaran.
// Saat Lebaran/Nataru naik ~20-50%. Jam = pola keberangkatan harian aktual.

export const BUS_SCHEDULES: BusSchedule[] = [
  // ===== Jakarta -> Yogyakarta (Giwangan) - koridor utama =====
  {
    id: 'sj-jkt-yog-01',
    operator: 'Sinar Jaya',
    busCode: 'SJ 88',
    serviceTier: 'Executive Plus',
    seatConfig: 'Eksekutif Legrest 2-2',
    departureTime: '07:15',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '14:30',
    arrivalCity: 'Yogyakarta',
    arrivalStation: 'Terminal Giwangan',
    duration: '7j 15m',
    routeHighlight: 'Langsung (Tol Trans-Jawa)',
    availableSeats: 12,
    pricePerSeat: 220000,
    urgentWarning: false,
  },
  {
    id: 'ri-jkt-yog-01',
    operator: 'Rosalia Indah',
    busCode: 'RI 204',
    serviceTier: 'Executive',
    seatConfig: 'Super Top Reclining 2-2',
    departureTime: '08:30',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '16:00',
    arrivalCity: 'Yogyakarta',
    arrivalStation: 'Terminal Giwangan',
    duration: '7j 30m',
    routeHighlight: 'Tol Cipali Cepat',
    availableSeats: 6,
    pricePerSeat: 260000,
    urgentWarning: true,
  },
  {
    id: 'agra-jkt-yog-01',
    operator: 'Agra Mas',
    busCode: 'AM 12',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif 2-2',
    departureTime: '09:45',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '17:30',
    arrivalCity: 'Yogyakarta',
    arrivalStation: 'Terminal Giwangan',
    duration: '7j 45m',
    routeHighlight: 'Rest Stop Service',
    availableSeats: 8,
    pricePerSeat: 230000,
    urgentWarning: false,
  },
  {
    id: 'sa-jkt-yog-01',
    operator: 'Sumber Alam',
    busCode: 'SA 45',
    serviceTier: 'VIP',
    seatConfig: 'VIP 2-2',
    departureTime: '19:30',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Kampung Rambutan',
    arrivalTime: '02:45',
    arrivalCity: 'Yogyakarta',
    arrivalStation: 'Terminal Giwangan',
    duration: '7j 15m',
    routeHighlight: 'Non-Stop Trans-Jawa',
    availableSeats: 10,
    pricePerSeat: 170000,
    urgentWarning: false,
  },
  {
    id: 'sdr-jkt-yog-01',
    operator: 'Safari Dharma Raya',
    busCode: 'SDR 07',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif 2-2',
    departureTime: '20:00',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '03:30',
    arrivalCity: 'Yogyakarta',
    arrivalStation: 'Terminal Giwangan',
    duration: '7j 30m',
    routeHighlight: 'Malam Eksekutif',
    availableSeats: 9,
    pricePerSeat: 205000,
    urgentWarning: false,
  },
  {
    id: 'damri-jkt-yog-01',
    operator: 'DAMRI',
    busCode: 'DMR 31',
    serviceTier: 'Bisnis',
    seatConfig: 'Bisnis 2-2',
    departureTime: '21:00',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '04:30',
    arrivalCity: 'Yogyakarta',
    arrivalStation: 'Terminal Giwangan',
    duration: '7j 30m',
    routeHighlight: 'Bisnis Malam',
    availableSeats: 14,
    pricePerSeat: 225000,
    urgentWarning: false,
  },
  // ===== Jakarta -> Surabaya (Purabaya/Bungurasih) =====
  {
    id: 'sari-jkt-sby-01',
    operator: 'Sari Indah',
    busCode: 'SI 21',
    serviceTier: 'VIP',
    seatConfig: 'VIP 2-2',
    departureTime: '07:00',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '18:00',
    arrivalCity: 'Surabaya',
    arrivalStation: 'Terminal Purabaya (Bungurasih)',
    duration: '11j 0m',
    routeHighlight: 'Tol Trans-Jawa',
    availableSeats: 11,
    pricePerSeat: 209000,
    urgentWarning: false,
  },
  {
    id: 'hdy-jkt-sby-01',
    operator: 'Handoyo',
    busCode: 'HDY 09',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif 2-2',
    departureTime: '08:30',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '19:30',
    arrivalCity: 'Surabaya',
    arrivalStation: 'Terminal Purabaya (Bungurasih)',
    duration: '11j 0m',
    routeHighlight: 'Langsung',
    availableSeats: 7,
    pricePerSeat: 220000,
    urgentWarning: true,
  },
  {
    id: 'hr-jkt-sby-01',
    operator: 'PO Haryanto',
    busCode: 'HR 110',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif 2-2',
    departureTime: '15:40',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '02:40',
    arrivalCity: 'Surabaya',
    arrivalStation: 'Terminal Purabaya (Bungurasih)',
    duration: '11j 0m',
    routeHighlight: 'Tol Trans-Jawa',
    availableSeats: 8,
    pricePerSeat: 310000,
    urgentWarning: false,
  },
  {
    id: 'sj-jkt-sby-01',
    operator: 'Sinar Jaya',
    busCode: 'SJ 46',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif Legrest 2-2',
    departureTime: '16:45',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '03:45',
    arrivalCity: 'Surabaya',
    arrivalStation: 'Terminal Purabaya (Bungurasih)',
    duration: '11j 0m',
    routeHighlight: 'Legrest',
    availableSeats: 10,
    pricePerSeat: 320000,
    urgentWarning: false,
  },
  {
    id: 'gh-jkt-sby-01',
    operator: 'Gunung Harta',
    busCode: 'GH 18',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif 2-2',
    departureTime: '17:30',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '04:30',
    arrivalCity: 'Surabaya',
    arrivalStation: 'Terminal Purabaya (Bungurasih)',
    duration: '11j 0m',
    routeHighlight: 'Solutions',
    availableSeats: 9,
    pricePerSeat: 340000,
    urgentWarning: false,
  },
  {
    id: 'hj-jkt-sby-01',
    operator: 'Harapan Jaya',
    busCode: 'HJ 55',
    serviceTier: 'VIP',
    seatConfig: 'VIP 2-2',
    departureTime: '18:10',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '05:10',
    arrivalCity: 'Surabaya',
    arrivalStation: 'Terminal Purabaya (Bungurasih)',
    duration: '11j 0m',
    routeHighlight: 'VIP Malam',
    availableSeats: 5,
    pricePerSeat: 365000,
    urgentWarning: true,
  },
  {
    id: 'pk-jkt-sby-01',
    operator: 'Pahala Kencana',
    busCode: 'PK 110',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif 2-2',
    departureTime: '19:00',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '06:00',
    arrivalCity: 'Surabaya',
    arrivalStation: 'Terminal Purabaya (Bungurasih)',
    duration: '11j 0m',
    routeHighlight: 'Malam',
    availableSeats: 8,
    pricePerSeat: 380000,
    urgentWarning: false,
  },
  {
    id: 'j99-jkt-sby-01',
    operator: 'Juragan 99 Trans',
    busCode: 'J99 05',
    serviceTier: 'Bisnis',
    seatConfig: 'Sleeper Bisnis 1-2',
    departureTime: '19:30',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '06:30',
    arrivalCity: 'Surabaya',
    arrivalStation: 'Terminal Purabaya (Bungurasih)',
    duration: '11j 0m',
    routeHighlight: 'Sleeper',
    availableSeats: 4,
    pricePerSeat: 550000,
    urgentWarning: true,
  },
  // ===== Jakarta -> Solo / Semarang / Malang / Denpasar / Sumatera =====
  {
    id: 'ri-jkt-solo-01',
    operator: 'Rosalia Indah',
    busCode: 'RI 118',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif 2-2',
    departureTime: '20:30',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '05:30',
    arrivalCity: 'Solo',
    arrivalStation: 'Terminal Tirtonadi',
    duration: '9j 0m',
    routeHighlight: 'Via Tol Solo',
    availableSeats: 9,
    pricePerSeat: 240000,
    urgentWarning: false,
  },
  {
    id: 'hr-jkt-smg-01',
    operator: 'PO Haryanto',
    busCode: 'HR 77',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif 2-2',
    departureTime: '21:00',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Kampung Rambutan',
    arrivalTime: '03:30',
    arrivalCity: 'Semarang',
    arrivalStation: 'Terminal Mangkang',
    duration: '6j 30m',
    routeHighlight: 'Pantura',
    availableSeats: 10,
    pricePerSeat: 240000,
    urgentWarning: false,
  },
  {
    id: 'sj-jkt-mlg-01',
    operator: 'Sinar Jaya',
    busCode: 'SJ 72',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif 2-2',
    departureTime: '17:00',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '05:00',
    arrivalCity: 'Malang',
    arrivalStation: 'Terminal Arjosari',
    duration: '12j 0m',
    routeHighlight: 'Via Surabaya',
    availableSeats: 8,
    pricePerSeat: 340000,
    urgentWarning: false,
  },
  {
    id: 'gh-jkt-dps-01',
    operator: 'Gunung Harta',
    busCode: 'GH 02',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif 2-2',
    departureTime: '16:00',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '06:00',
    arrivalCity: 'Denpasar',
    arrivalStation: 'Terminal Mengwi',
    duration: '14j 0m',
    routeHighlight: 'Via Banyuwangi',
    availableSeats: 7,
    pricePerSeat: 600000,
    urgentWarning: false,
  },
  {
    id: 'sj-jkt-plm-01',
    operator: 'Sinar Jaya',
    busCode: 'SJ 301',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif 2-2',
    departureTime: '10:00',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Kalideres',
    arrivalTime: '20:00',
    arrivalCity: 'Palembang',
    arrivalStation: 'Terminal Alang-Alang Lebar',
    duration: '10j 0m',
    routeHighlight: 'Lintas Timur Sumatera',
    availableSeats: 12,
    pricePerSeat: 280000,
    urgentWarning: false,
  },
  {
    id: 'npm-jkt-pdg-01',
    operator: 'NPM',
    busCode: 'NPM 15',
    serviceTier: 'Bisnis',
    seatConfig: 'Bisnis AC 2-2',
    departureTime: '09:00',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Kalideres',
    arrivalTime: '09:00',
    arrivalCity: 'Padang',
    arrivalStation: 'Terminal Anak Air',
    duration: '24j 0m',
    routeHighlight: 'Lintas Tengah Sumatera',
    availableSeats: 9,
    pricePerSeat: 460000,
    urgentWarning: false,
  },
  {
    id: 'bdm-jkt-tsk-01',
    operator: 'Budiman',
    busCode: 'BDM 60',
    serviceTier: 'Bisnis',
    seatConfig: 'Bisnis AC 2-2',
    departureTime: '08:00',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '13:00',
    arrivalCity: 'Tasikmalaya',
    arrivalStation: 'Terminal Singaparna',
    duration: '5j 0m',
    routeHighlight: 'Via Cipali',
    availableSeats: 15,
    pricePerSeat: 120000,
    urgentWarning: false,
  },
  // ===== Surabaya -> Jakarta (arus balik) =====
  {
    id: 'sj-sby-jkt-01',
    operator: 'Sinar Jaya',
    busCode: 'SJ 47',
    serviceTier: 'Executive',
    seatConfig: 'Eksekutif Legrest 2-2',
    departureTime: '07:30',
    departureCity: 'Surabaya',
    departureStation: 'Terminal Purabaya (Bungurasih)',
    arrivalTime: '18:30',
    arrivalCity: 'Jakarta',
    arrivalStation: 'Terminal Pulo Gebang',
    duration: '11j 0m',
    routeHighlight: 'Tol Trans-Jawa',
    availableSeats: 10,
    pricePerSeat: 320000,
    urgentWarning: false,
  },
  {
    id: 'damri-sby-jkt-01',
    operator: 'DAMRI',
    busCode: 'DMR 52',
    serviceTier: 'Bisnis',
    seatConfig: 'Bisnis 2-2',
    departureTime: '10:00',
    departureCity: 'Surabaya',
    departureStation: 'Terminal Purabaya (Bungurasih)',
    arrivalTime: '21:00',
    arrivalCity: 'Jakarta',
    arrivalStation: 'Terminal Pulo Gebang',
    duration: '11j 0m',
    routeHighlight: 'Bisnis Siang',
    availableSeats: 13,
    pricePerSeat: 308000,
    urgentWarning: false,
  },
  // ===== Surabaya AKDP =====
  {
    id: 'ladju-sby-bwi-01',
    operator: 'Ladju',
    busCode: 'LJ 08',
    serviceTier: 'Patas',
    seatConfig: 'Patas Non-Ekonomi 2-2',
    departureTime: '09:10',
    departureCity: 'Surabaya',
    departureStation: 'Terminal Purabaya (Bungurasih)',
    arrivalTime: '15:10',
    arrivalCity: 'Banyuwangi',
    arrivalStation: 'Terminal Sri Tanjung',
    duration: '6j 0m',
    routeHighlight: 'Via Probolinggo',
    availableSeats: 16,
    pricePerSeat: 150000,
    urgentWarning: false,
  },
  {
    id: 'stj-sby-ngw-01',
    operator: 'Sudiro Tungga Jaya',
    busCode: 'STJ 11',
    serviceTier: 'Patas',
    seatConfig: 'Patas 2-2',
    departureTime: '06:15',
    departureCity: 'Surabaya',
    departureStation: 'Terminal Purabaya (Bungurasih)',
    arrivalTime: '09:15',
    arrivalCity: 'Ngawi',
    arrivalStation: 'Terminal Kertonegoro',
    duration: '3j 0m',
    routeHighlight: 'AKDP',
    availableSeats: 18,
    pricePerSeat: 80000,
    urgentWarning: false,
  },
  // ===== Bandung / Tangerang =====
  {
    id: 'primajasa-bdg-jkt-01',
    operator: 'Primajasa',
    busCode: 'PJ 201',
    serviceTier: 'Ekonomi AC',
    seatConfig: 'Ekonomi AC 2-3',
    departureTime: '06:00',
    departureCity: 'Bandung',
    departureStation: 'Terminal Leuwipanjang',
    arrivalTime: '09:00',
    arrivalCity: 'Jakarta',
    arrivalStation: 'Terminal Kampung Rambutan',
    duration: '3j 0m',
    routeHighlight: 'Via Cipularang',
    availableSeats: 20,
    pricePerSeat: 85000,
    urgentWarning: false,
  },
];

export const INITIAL_SEATS: SeatItem[] = [
  // Top Row (Right side of bus / or Row 1)
  { id: 's01', number: '01', deck: 1, level: 'Atas', row: 1, col: 0, status: 'tersedia', price: 340000, category: '1st Class Sleeper' },
  { id: 's03', number: '03', deck: 1, level: 'Atas', row: 1, col: 1, status: 'terisi', price: 340000, category: '1st Class Sleeper' },
  { id: 's05', number: '05', deck: 1, level: 'Atas', row: 1, col: 2, status: 'tersedia', price: 340000, category: '1st Class Sleeper' },
  { id: 's07', number: '07', deck: 1, level: 'Bawah', row: 1, col: 3, status: 'terisi', price: 340000, category: '1st Class Sleeper' },
  
  // Bottom Row
  { id: 's02', number: '02', deck: 1, level: 'Bawah', row: 2, col: 0, status: 'terisi', price: 340000, category: '1st Class Sleeper' },
  { id: 's04', number: '04', deck: 1, level: 'Atas', row: 2, col: 1, status: 'tersedia', price: 340000, category: '1st Class Sleeper' },
  { id: 's06', number: '06', deck: 1, level: 'Bawah', row: 2, col: 2, status: 'dipilih', price: 340000, category: '1st Class Sleeper' },
  { id: 's08', number: '08', deck: 1, level: 'Bawah', row: 2, col: 3, status: 'terisi', price: 340000, category: '1st Class Sleeper' },

  // Additional cabin seats (for scrolling/deck 2)
  { id: 's09', number: '09', deck: 1, level: 'Atas', row: 1, col: 4, status: 'tersedia', price: 340000, category: '1st Class Sleeper' },
  { id: 's10', number: '10', deck: 1, level: 'Bawah', row: 2, col: 4, status: 'tersedia', price: 340000, category: '1st Class Sleeper' },
  { id: 's11', number: '11', deck: 1, level: 'Atas', row: 1, col: 5, status: 'terisi', price: 340000, category: '1st Class Sleeper' },
  { id: 's12', number: '12', deck: 1, level: 'Bawah', row: 2, col: 5, status: 'tersedia', price: 340000, category: '1st Class Sleeper' },
];

export const INITIAL_TICKET: ETicket = {
  id: 'ticket-01',
  bookingCode: 'BUS-894567',
  operator: 'Sinar Jaya Executive',
  fleetCode: 'Armada SJ-8802',
  passengerName: 'Jasper McAllister',
  passengerType: 'Dewasa',
  departureTime: '07:15',
  departureDate: '22 Agu 2025',
  departureCity: 'Jakarta',
  departureTerminal: 'Pulo Gebang',
  departureSub: 'Jakarta Timur',
  arrivalTime: '14:30',
  arrivalCity: 'Yogyakarta',
  arrivalTerminal: 'Giwangan',
  duration: '7j 45m',
  routeType: 'Langsung',
  seatNumber: '06',
  seatType: 'Window',
  platform: 'Jalur 04',
  platformFloor: 'Lantai 2',
  busClass: 'Executive',
  classConfig: '2+2 Rec.',
  terminalGate: 'Gerbang B3',
  barcodeNumber: '9823 4812 0945 8802',
  baggageTag: 'Tag #06-A',
  baggageMaxKg: 20,
  status: 'SIAP BOARDING',
};

export const TRAVEL_HISTORY: TravelHistoryItem[] = [
  {
    id: 'hist-1',
    date: '15 Agu 2024',
    fromCity: 'Jakarta',
    fromPoint: 'Pool Dipati Ukur',
    toCity: 'Bandung',
    toPoint: 'Pasteur Point',
    duration: '2j 45m',
    operator: 'DayTrans Shuttle',
    seat: '03B',
    status: 'SELESAI',
  },
  {
    id: 'hist-2',
    date: '28 Jul 2024',
    fromCity: 'Yogyakarta',
    fromPoint: 'Terminal Jombor',
    toCity: 'Semarang',
    toPoint: 'Sukun Banyumanik',
    duration: '3j 15m',
    operator: 'Nusantara Exp.',
    seat: '12',
    status: 'SELESAI',
  },
  {
    id: 'hist-3',
    date: '10 Jun 2024',
    fromCity: 'Surabaya',
    fromPoint: 'Terminal Bungurasih',
    toCity: 'Solo',
    toPoint: 'Terminal Tirtonadi',
    duration: '3j 50m',
    operator: 'Eka Cepat Trans',
    seat: '05A',
    status: 'SELESAI',
  },
];
