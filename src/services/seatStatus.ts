export type SeatAvailability = 'tersedia' | 'dipilih' | 'terisi';
export type SeatOccupantGender = 'laki-laki' | 'perempuan' | null;

export interface RichSeat {
  id: string;
  number: string;
  availability: SeatAvailability;
  occupantGender?: SeatOccupantGender;
  isPriority?: boolean;
}

export interface SeatLegendItem {
  key: string;
  label: string;
  description: string;
  testId: string;
}

export interface CabinLayoutConfig {
  busClassKey: string;
  totalColumns: number;
  visibleColumns: number;
  scrollable: boolean;
  needsHorizontalScroll: boolean;
  scrollHint: string;
  orientation: 'horizontal-scroll';
}

const LEGEND: SeatLegendItem[] = [
  {
    key: 'tersedia',
    label: 'Tersedia',
    description: 'Kursi kosong, bisa dipilih. Ketuk untuk memilih.',
    testId: 'legend-tersedia',
  },
  {
    key: 'dipilih',
    label: 'Dipilih (Kursi Saya)',
    description: 'Kursi yang sedang kamu pilih pada pemesanan ini.',
    testId: 'legend-dipilih',
  },
  {
    key: 'terisi',
    label: 'Terisi',
    description: 'Kursi sudah dibeli penumpang lain, tidak bisa dipilih.',
    testId: 'legend-terisi',
  },
  {
    key: 'prioritas',
    label: 'P — Prioritas',
    description: 'Kursi prioritas (P): lansia, difabel, ibu hamil. Tetap bisa dipilih bila tersedia.',
    testId: 'legend-prioritas',
  },
  {
    key: 'laki-laki',
    label: 'Terisi Laki-laki',
    description: 'Kursi terisi penumpang laki-laki (biru). Tidak bisa dipilih.',
    testId: 'legend-laki-laki',
  },
  {
    key: 'perempuan',
    label: 'Terisi Perempuan',
    description: 'Kursi terisi penumpang perempuan (pink). Tidak bisa dipilih.',
    testId: 'legend-perempuan',
  },
];

export const SEAT_LEGEND: SeatLegendItem[] = LEGEND;

export function getSeatLegend(): SeatLegendItem[] {
  return [...LEGEND];
}

export function isSeatSelectable(seat: RichSeat): boolean {
  if (!seat) return false;
  return seat.availability === 'tersedia';
}

export function resolveSeatVisual(seat: RichSeat): { legendKey: string; label: string } {
  if (!seat) return { legendKey: 'tersedia', label: 'Tersedia' };
  // Prioritas yang masih tersedia ditandai P
  if (seat.isPriority && seat.availability === 'tersedia') {
    return { legendKey: 'prioritas', label: `P-${seat.number} Prioritas` };
  }
  if (seat.availability === 'tersedia') return { legendKey: 'tersedia', label: `Tersedia ${seat.number}` };
  if (seat.availability === 'dipilih') return { legendKey: 'dipilih', label: `Dipilih ${seat.number} (Saya)` };
  // terisi: bedakan gender
  if (seat.occupantGender === 'laki-laki') {
    return { legendKey: 'laki-laki', label: `Terisi Laki-laki ${seat.number}` };
  }
  if (seat.occupantGender === 'perempuan') {
    return { legendKey: 'perempuan', label: `Terisi Perempuan ${seat.number}` };
  }
  return { legendKey: 'terisi', label: `Terisi ${seat.number}` };
}

function normalizeClass(label: string): string {
  return (label ?? '').trim().toLowerCase();
}

export function getCabinLayoutConfig(busClassLabel: string): CabinLayoutConfig {
  const key = normalizeClass(busClassLabel);
  // Semua kabin WAJIB bisa digeser ke kanan (horizontal scroll) agar konsisten
  // antara Sleeper (pod 1-1-1, kolom banyak) dan Executive (2-2).
  const isSleeper = key.includes('sleeper') || key.includes('slep') || key.includes('suite') || key.includes('1-1');
  const isExecutive =
    key.includes('eksekutif') || key.includes('executive') || key.includes('vip') || key.includes('bisnis');

  if (isSleeper) {
    return {
      busClassKey: 'sleeper',
      totalColumns: 12,
      visibleColumns: 4,
      scrollable: true,
      needsHorizontalScroll: true,
      scrollHint: 'Geser ke kanan untuk melihat semua kabin sleeper →',
      orientation: 'horizontal-scroll',
    };
  }
  if (isExecutive) {
    return {
      busClassKey: 'executive',
      totalColumns: 10,
      visibleColumns: 4,
      scrollable: true,
      needsHorizontalScroll: true,
      scrollHint: 'Geser ke kanan untuk melihat semua kursi eksekutif →',
      orientation: 'horizontal-scroll',
    };
  }
  // Fallback aman: tetap scrollable
  return {
    busClassKey: key || 'default',
    totalColumns: 10,
    visibleColumns: 4,
    scrollable: true,
    needsHorizontalScroll: true,
    scrollHint: 'Geser ke kanan untuk melihat semua kursi →',
    orientation: 'horizontal-scroll',
  };
}

export function getCabinScrollProps(busClassLabel: string): {
  overflowX: 'auto';
  testId: string;
  ariaLabel: string;
} {
  const cfg = getCabinLayoutConfig(busClassLabel);
  return {
    overflowX: 'auto',
    testId: `cabin-scroll-${cfg.busClassKey}`,
    ariaLabel: `Kabin bus ${cfg.busClassKey}, ${cfg.scrollHint}`,
  };
}
