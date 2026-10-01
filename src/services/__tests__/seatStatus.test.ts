import { describe, it, expect } from 'vitest';
import {
  SEAT_LEGEND,
  getSeatLegend,
  isSeatSelectable,
  resolveSeatVisual,
  getCabinLayoutConfig,
  getCabinScrollProps,
  type RichSeat,
} from '../seatStatus';

// RED: legenda kursi harus bedakan Tersedia/Dipilih/Terisi + P (Prioritas) + laki-laki/perempuan,
// kabin harus bisa digeser ke kanan (horizontal scroll) untuk semua kelas (sleeper & eksekutif).
describe('SeatStatus & Cabin Scroll (TDD RED)', () => {
  describe('SEAT_LEGEND', () => {
    it('menyediakan 6 legenda: tersedia, dipilih, terisi, prioritas (P), laki-laki, perempuan', () => {
      const legend = getSeatLegend();
      expect(legend).toHaveLength(6);
      const keys = legend.map((l) => l.key);
      expect(keys).toContain('tersedia');
      expect(keys).toContain('dipilih');
      expect(keys).toContain('terisi');
      expect(keys).toContain('prioritas');
      expect(keys).toContain('laki-laki');
      expect(keys).toContain('perempuan');
    });

    it('setiap legenda punya label Indonesia dan testId unik', () => {
      const legend = getSeatLegend();
      for (const item of legend) {
        expect(item.label.length).toBeGreaterThan(0);
        expect(item.description.length).toBeGreaterThan(0);
        expect(item.testId).toMatch(/^legend-/);
      }
      const ids = legend.map((l) => l.testId);
      expect(new Set(ids).size).toBe(legend.length);
    });

    it('SEAT_LEGEND export konsisten dengan getSeatLegend()', () => {
      expect(SEAT_LEGEND).toHaveLength(6);
      expect(SEAT_LEGEND.map((l) => l.key).sort()).toEqual(
        getSeatLegend().map((l) => l.key).sort(),
      );
    });
  });

  describe('isSeatSelectable', () => {
    it('kursi tersedia bisa dipilih', () => {
      expect(isSeatSelectable({ id: 's1', number: '01', availability: 'tersedia' })).toBe(true);
    });

    it('kursi prioritas yang tersedia tetap bisa dipilih', () => {
      expect(
        isSeatSelectable({ id: 'sP', number: 'P1', availability: 'tersedia', isPriority: true }),
      ).toBe(true);
    });

    it('kursi terisi tidak bisa dipilih (termasuk ber-gender)', () => {
      const terisi: RichSeat[] = [
        { id: 'a', number: '02', availability: 'terisi' },
        { id: 'b', number: '03', availability: 'terisi', occupantGender: 'laki-laki' },
        { id: 'c', number: '04', availability: 'terisi', occupantGender: 'perempuan' },
      ];
      for (const s of terisi) expect(isSeatSelectable(s)).toBe(false);
    });

    it('kursi yang sudah dipilih tidak bisa dipilih lagi (anti double-booking)', () => {
      expect(isSeatSelectable({ id: 's6', number: '06', availability: 'dipilih' })).toBe(false);
    });
  });

  describe('resolveSeatVisual', () => {
    it('membedakan visual laki-laki vs perempuan pada kursi terisi', () => {
      const pria = resolveSeatVisual({ id: 'x', number: '02', availability: 'terisi', occupantGender: 'laki-laki' });
      const wanita = resolveSeatVisual({ id: 'y', number: '03', availability: 'terisi', occupantGender: 'perempuan' });
      expect(pria.legendKey).toBe('laki-laki');
      expect(wanita.legendKey).toBe('perempuan');
      expect(pria.label).not.toBe(wanita.label);
    });

    it('menandai kursi prioritas dengan kunci P', () => {
      const v = resolveSeatVisual({ id: 'p', number: 'P1', availability: 'tersedia', isPriority: true });
      expect(v.legendKey).toBe('prioritas');
      expect(v.label).toMatch(/P/i);
    });

    it('kursi tersedia dan dipilih punya kunci berbeda', () => {
      expect(resolveSeatVisual({ id: 'a', number: '01', availability: 'tersedia' }).legendKey).toBe('tersedia');
      expect(resolveSeatVisual({ id: 'b', number: '06', availability: 'dipilih' }).legendKey).toBe('dipilih');
    });

    it('kursi terisi tanpa gender memakai kunci terisi umum', () => {
      expect(resolveSeatVisual({ id: 'z', number: '08', availability: 'terisi' }).legendKey).toBe('terisi');
    });
  });

  describe('getCabinLayoutConfig — kabin bisa digeser ke kanan', () => {
    it('sleeper: scrollable dengan hint geser', () => {
      const cfg = getCabinLayoutConfig('1st Class Sleeper');
      expect(cfg.scrollable).toBe(true);
      expect(cfg.needsHorizontalScroll).toBe(true);
      expect(cfg.totalColumns).toBeGreaterThan(cfg.visibleColumns);
      expect(cfg.orientation).toBe('horizontal-scroll');
      expect(cfg.scrollHint.toLowerCase()).toMatch(/geser/);
    });

    it('executive: tetap scrollable agar konsisten dengan sleeper', () => {
      const cfg = getCabinLayoutConfig('Executive Class');
      expect(cfg.scrollable).toBe(true);
      expect(cfg.needsHorizontalScroll).toBe(true);
      expect(cfg.totalColumns).toBeGreaterThan(cfg.visibleColumns);
    });

    it('kelas tidak dikenal fallback ke layout scrollable aman', () => {
      const cfg = getCabinLayoutConfig('Kelas Aneh XYZ');
      expect(cfg.scrollable).toBe(true);
      expect(cfg.needsHorizontalScroll).toBe(true);
    });

    it('input kosong / null-ish tidak crash', () => {
      expect(() => getCabinLayoutConfig('')).not.toThrow();
      expect(() => getCabinLayoutConfig('   ')).not.toThrow();
    });
  });

  describe('getCabinScrollProps', () => {
    it('mengembalikan props overflow-x auto untuk container kabin', () => {
      const props = getCabinScrollProps('Executive Class');
      expect(props.overflowX).toBe('auto');
      expect(props.testId).toMatch(/cabin-scroll/);
      expect(props.ariaLabel.toLowerCase()).toMatch(/geser|scroll/);
    });
  });
});
