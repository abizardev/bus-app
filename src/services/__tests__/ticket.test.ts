import { describe, it, expect } from 'vitest';
import {
  generateETicket,
  validateBoardingPass,
  GenerateTicketInput,
} from '../ticket';
import { BUS_SCHEDULES, INITIAL_SEATS } from '../../data/mockData';

describe('E-Ticket & Boarding Pass Service (TDD)', () => {
  const sampleBus = BUS_SCHEDULES[0];
  const sampleSeat = INITIAL_SEATS[0];

  describe('generateETicket', () => {
    it('generates a complete valid executive e-ticket with required fields', () => {
      const input: GenerateTicketInput = {
        bus: sampleBus,
        seats: [sampleSeat],
        passengerName: 'Jasper McAllister',
        passengerNik: '3171040000000008',
        travelDate: '2026-10-15',
      };

      const ticket = generateETicket(input);

      expect(ticket.id).toBeDefined();
      expect(ticket.bookingCode).toMatch(/^OMNI-[A-Z0-9]{6}$/);
      expect(ticket.passengerName).toBe('Jasper McAllister');
      expect(ticket.operator).toBe(sampleBus.operator);
      expect(ticket.departureCity).toBe(sampleBus.departureCity);
      expect(ticket.arrivalCity).toBe(sampleBus.arrivalCity);
      expect(ticket.seatNumber).toBe('01');
      expect(ticket.status).toBe('SIAP BOARDING');
      expect(ticket.baggageTag).toBe('TAG #01-A');
      expect(ticket.barcodeNumber).toBeDefined();
      expect(ticket.baggageMaxKg).toBe(20);
    });

    it('handles multiple seats joining seat numbers correctly', () => {
      const input: GenerateTicketInput = {
        bus: sampleBus,
        seats: [INITIAL_SEATS[0], INITIAL_SEATS[4]], // 01 and 02
        passengerName: 'Jasper McAllister',
        passengerNik: '3171040000000008',
        travelDate: '2026-10-15',
      };

      const ticket = generateETicket(input);
      expect(ticket.seatNumber).toBe('01, 02');
    });

    it('accepts custom booking code and sets seatType for Lower Cabin', () => {
      const lowerSeat = INITIAL_SEATS.find((s) => s.level === 'Bawah')!;
      const input: GenerateTicketInput = {
        bus: sampleBus,
        seats: [lowerSeat], // Level Bawah
        passengerName: 'Jasper McAllister',
        passengerNik: '3171040000000008',
        bookingCode: 'OMNI-CUSTOM99',
        travelDate: '2026-10-15',
      };

      const ticket = generateETicket(input);
      expect(ticket.bookingCode).toBe('OMNI-CUSTOM99');
      expect(ticket.seatType).toBe('Lower Cabin Pod');
    });

    it('throws error when passenger name is empty', () => {
      expect(() =>
        generateETicket({
          bus: sampleBus,
          seats: [sampleSeat],
          passengerName: '',
          passengerNik: '123456',
          travelDate: '2026-10-15',
        })
      ).toThrow('Nama penumpang tidak boleh kosong');
    });

    it('throws error when no seats provided', () => {
      expect(() =>
        generateETicket({
          bus: sampleBus,
          seats: [],
          passengerName: 'Jasper',
          passengerNik: '123456',
          travelDate: '2026-10-15',
        })
      ).toThrow('Minimal satu kursi wajib dipilih');
    });
  });

  describe('validateBoardingPass', () => {
    it('returns valid when travel date is today or future and status is SIAP BOARDING', () => {
      const ticket = generateETicket({
        bus: sampleBus,
        seats: [sampleSeat],
        passengerName: 'Jasper',
        passengerNik: '123',
        travelDate: '2026-10-15',
      });

      const validation = validateBoardingPass(ticket, '2026-10-15');
      expect(validation.isValid).toBe(true);
      expect(validation.status).toBe('SIAP BOARDING');
      expect(validation.message).toContain('Boarding pass valid');
    });

    it('returns KEDALUWARSA when travel date is past', () => {
      const ticket = generateETicket({
        bus: sampleBus,
        seats: [sampleSeat],
        passengerName: 'Jasper',
        passengerNik: '123',
        travelDate: '2026-10-10',
      });

      const validation = validateBoardingPass(ticket, '2026-10-15');
      expect(validation.isValid).toBe(false);
      expect(validation.status).toBe('KEDALUWARSA');
    });

    it('returns TIDAK VALID when ticket booking code is corrupted', () => {
      const ticket = generateETicket({
        bus: sampleBus,
        seats: [sampleSeat],
        passengerName: 'Jasper',
        passengerNik: '123',
        travelDate: '2026-10-15',
      });

      ticket.bookingCode = 'INVALID';
      const validation = validateBoardingPass(ticket, '2026-10-15');
      expect(validation.isValid).toBe(false);
      expect(validation.status).toBe('TIDAK VALID');
    });
  });
});
