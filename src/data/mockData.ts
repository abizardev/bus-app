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
];

export const BUS_SCHEDULES: BusSchedule[] = [
  {
    id: 'sj-88',
    operator: 'Sinar Jaya',
    busCode: 'SJ 88',
    serviceTier: 'Executive Plus',
    seatConfig: 'Suite Class • Single Seat (1-1-1)',
    departureTime: '07:15',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '14:30',
    arrivalCity: 'Yogyakarta',
    arrivalStation: 'Terminal Giwangan',
    duration: '7j 45m',
    routeHighlight: 'Langsung (Tol Trans-Jawa)',
    availableSeats: 12,
    pricePerSeat: 280000,
    urgentWarning: false,
  },
  {
    id: 'ri-204',
    operator: 'Rosalia Indah',
    busCode: 'RI 204',
    serviceTier: 'Sleeper Seat',
    seatConfig: 'Super Top • Reclining Cabin (1-2)',
    departureTime: '08:30',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '16:00',
    arrivalCity: 'Yogyakarta',
    arrivalStation: 'Terminal Giwangan',
    duration: '7j 30m',
    routeHighlight: 'Tol Cipali Cepat',
    availableSeats: 6,
    pricePerSeat: 340000,
    urgentWarning: true,
  },
  {
    id: 'pk-110',
    operator: 'Pahala Kencana',
    busCode: 'PK 110',
    serviceTier: 'First Class',
    seatConfig: 'Double Decker • Panoramic Deck',
    departureTime: '09:45',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '17:30',
    arrivalCity: 'Yogyakarta',
    arrivalStation: 'Terminal Giwangan',
    duration: '7j 45m',
    routeHighlight: 'Rest Stop Service',
    availableSeats: 8,
    pricePerSeat: 310000,
    urgentWarning: false,
  },
  {
    id: 'j99-05',
    operator: 'Juragan 99 Trans',
    busCode: 'J99 05',
    serviceTier: 'Dream Class',
    seatConfig: 'Private Pod • Full Audio Pod',
    departureTime: '19:30',
    departureCity: 'Jakarta',
    departureStation: 'Terminal Pulo Gebang',
    arrivalTime: '02:45',
    arrivalCity: 'Yogyakarta',
    arrivalStation: 'Terminal Giwangan',
    duration: '7j 15m',
    routeHighlight: 'Non-Stop Trans-Jawa',
    availableSeats: 4,
    pricePerSeat: 390000,
    urgentWarning: true,
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
