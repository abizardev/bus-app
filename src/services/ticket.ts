import { ETicket, BusSchedule, SeatItem } from '../data/mockData';

export interface GenerateTicketInput {
  bus: BusSchedule;
  seats: SeatItem[];
  passengerName: string;
  passengerNik: string;
  bookingCode?: string;
  travelDate: string;
}

export interface BoardingValidationResult {
  isValid: boolean;
  status: 'SIAP BOARDING' | 'SELESAI' | 'KEDALUWARSA' | 'TIDAK VALID';
  message: string;
}

function generateRandomCode(length: number = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates official executive e-ticket with barcode & baggage tags.
 */
export function generateETicket(input: GenerateTicketInput): ETicket {
  const { bus, seats, passengerName, travelDate } = input;

  if (!passengerName || passengerName.trim() === '') {
    throw new Error('Nama penumpang tidak boleh kosong');
  }

  if (!seats || seats.length === 0) {
    throw new Error('Minimal satu kursi wajib dipilih');
  }

  const seatNumbers = seats.map((s) => s.number).join(', ');
  const primarySeat = seats[0].number;
  const bookingCode = input.bookingCode || `OMNI-${generateRandomCode(6)}`;
  const barcodeNumber = `9823 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${bus.busCode.replace(/\s+/g, '')}`;

  return {
    id: `ticket-${Date.now()}`,
    bookingCode,
    operator: bus.operator,
    fleetCode: `Armada ${bus.busCode}`,
    passengerName,
    passengerType: 'Dewasa',
    departureTime: bus.departureTime,
    departureDate: travelDate,
    departureCity: bus.departureCity,
    departureTerminal: bus.departureStation,
    departureSub: 'Terminal Transit',
    arrivalTime: bus.arrivalTime,
    arrivalCity: bus.arrivalCity,
    arrivalTerminal: bus.arrivalStation,
    duration: bus.duration,
    routeType: 'Langsung',
    seatNumber: seatNumbers,
    seatType: seats[0].level === 'Atas' ? 'Upper Deck Pod' : 'Lower Cabin Pod',
    platform: 'Jalur 04',
    platformFloor: 'Lantai 2',
    busClass: bus.serviceTier,
    classConfig: bus.seatConfig,
    terminalGate: 'Gerbang B3',
    barcodeNumber,
    baggageTag: `TAG #${primarySeat}-A`,
    baggageMaxKg: 20,
    status: 'SIAP BOARDING',
  };
}

/**
 * Validates e-ticket boarding pass against departure constraints.
 */
export function validateBoardingPass(
  ticket: ETicket,
  currentDateIso: string
): BoardingValidationResult {
  if (!ticket.bookingCode || !ticket.bookingCode.startsWith('OMNI-')) {
    return {
      isValid: false,
      status: 'TIDAK VALID',
      message: 'Kode tiket tidak valid atau tidak dikenali oleh sistem',
    };
  }

  if (ticket.departureDate < currentDateIso) {
    return {
      isValid: false,
      status: 'KEDALUWARSA',
      message: 'Tiket telah kedaluwarsa dan tidak dapat digunakan lagi',
    };
  }

  return {
    isValid: true,
    status: 'SIAP BOARDING',
    message: 'Boarding pass valid untuk verifikasi gerbang keberangkatan',
  };
}
