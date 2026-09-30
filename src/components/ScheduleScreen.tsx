import React, { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Calendar,
  SlidersHorizontal,
  MapPin,
  Disc,
  Armchair,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Bus as BusIcon,
  X,
  Check,
  Search,
  Zap,
} from 'lucide-react';
import { BusSchedule, BUS_SCHEDULES } from '../data/mockData';
import { TERMINALS, getTerminalById, type Terminal } from '../data/terminals';

interface ScheduleScreenProps {
  onSelectBus: (bus: BusSchedule) => void;
  onNavigateTab: (tab: 'jadwal' | 'kursi' | 'etiket' | 'akun') => void;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  onSelectBus,
  onNavigateTab,
}) => {
  const [tripType, setTripType] = useState<'sekali' | 'pulang_pergi'>('sekali');
  const [originId, setOriginId] = useState('pulo-gebang');
  const [destinationId, setDestinationId] = useState('giwangan');
  const [isSwapping, setIsSwapping] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0); // default hari ini
  const [pickerOpen, setPickerOpen] = useState<null | 'origin' | 'destination'>(null);
  const [pickerQuery, setPickerQuery] = useState('');
  const [filterType, setFilterType] = useState<'tercepat' | 'termurah' | 'semua'>('tercepat');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showGuaranteeModal, setShowGuaranteeModal] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string[]>(['Executive', 'Sleeper', 'Suite']);

  // Swap animation & logic
  const handleSwapStations = () => {
    setIsSwapping(true);
    setTimeout(() => {
      const tmp = originId;
      setOriginId(destinationId);
      setDestinationId(tmp);
      setIsSwapping(false);
    }, 200);
  };

  const originTerminal = getTerminalById(originId) ?? TERMINALS[0];
  const destinationTerminal = getTerminalById(destinationId) ?? TERMINALS[1];
  const sameRoute = originId === destinationId;

  // Tanggal realtime: mulai hari ini + 5 hari, label Indonesia
  const dates = useMemo(() => {
    const out: { key: string; dayName: string; dayNum: string; month: string; full: string }[] = [];
    const now = new Date();
    const dayFmt = new Intl.DateTimeFormat('id-ID', { weekday: 'short' });
    const monthFmt = new Intl.DateTimeFormat('id-ID', { month: 'short' });
    const fullFmt = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      out.push({
        key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
        dayName: dayFmt.format(d).replace('.', '').toUpperCase(),
        dayNum: String(d.getDate()),
        month: monthFmt.format(d).replace('.', ''),
        full: fullFmt.format(d),
      });
    }
    return out;
  }, []);
  const selectedDate = dates[selectedDateIndex] ?? dates[0];
  const monthYearLabel = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + (selectedDateIndex || 0));
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(d);
  }, [selectedDateIndex]);

  // Daftar terminal tersaring untuk sheet pilih terminal (cari nama/kota/provinsi/alamat)
  const filteredTerminals = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    if (!q) return TERMINALS;
    return TERMINALS.filter((t) =>
      [t.nama, t.kota, t.provinsi, t.alamat].join(' ').toLowerCase().includes(q)
    );
  }, [pickerQuery]);

  const openPicker = (which: 'origin' | 'destination') => {
    setPickerQuery('');
    setPickerOpen(which);
  };
  const chooseTerminal = (t: Terminal) => {
    if (pickerOpen === 'origin') setOriginId(t.id);
    if (pickerOpen === 'destination') setDestinationId(t.id);
    setPickerOpen(null);
  };

  const cityMatch = (scheduleCity: string, terminalKota: string) => {
    const s = scheduleCity.toLowerCase();
    // terminal kota bisa "Jakarta Timur" -> cocok dengan "jakarta"
    const parts = terminalKota.toLowerCase().split(' ');
    return parts.some((p) => p.length > 3 && (s.includes(p) || p.includes(s))) || s.includes(terminalKota.toLowerCase()) || terminalKota.toLowerCase().includes(s);
  };

  const filteredByCity = BUS_SCHEDULES.filter(
    (bus) =>
      cityMatch(bus.departureCity, originTerminal.kota) &&
      cityMatch(bus.arrivalCity, destinationTerminal.kota)
  );
  const exactStation = filteredByCity.filter(
    (bus) =>
      bus.departureStation === originTerminal.nama &&
      bus.arrivalStation === destinationTerminal.nama
  );
  // Kalau ada jadwal persis terminal-ke-terminal pakai itu, kalau tidak tampilkan se-kota
  const matchedSchedules = sameRoute ? [] : exactStation.length > 0 ? exactStation : filteredByCity;

  // Filtered schedules
  const sortedSchedules = [...matchedSchedules].sort((a, b) => {
    if (filterType === 'tercepat') {
      return parseInt(a.duration) - parseInt(b.duration);
    }
    if (filterType === 'termurah') {
      return a.pricePerSeat - b.pricePerSeat;
    }
    return 0;
  });

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-4">
      {/* Banner Fast Lane Express */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-300 text-black text-[11px] font-heading font-bold w-fit">
            <Zap className="w-3 h-3 fill-black" aria-hidden="true" />
            <span>FAST LANE EXPRESS</span>
          </div>
          <h2 className="font-heading font-bold text-black text-base leading-tight">
            Pesan Cepat Tol Trans-Jawa
          </h2>
          <p className="text-[11px] text-slate-600">
            Jadwal langsung tanpa transit • Tiket instan
          </p>
        </div>
      </div>

      {/* Jenis perjalanan */}
      <div
        role="radiogroup"
        aria-label="Jenis perjalanan"
        className="flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-sm"
      >
        <button
          role="radio"
          aria-checked={tripType === 'sekali'}
          onClick={() => setTripType('sekali')}
          className={`flex-1 min-h-[44px] rounded-full text-xs font-heading font-bold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
            tripType === 'sekali'
              ? 'bg-white border border-slate-400 text-black shadow-sm'
              : 'text-slate-500 hover:text-black'
          }`}
        >
          Sekali Jalan
        </button>
        <button
          role="radio"
          aria-checked={tripType === 'pulang_pergi'}
          onClick={() => setTripType('pulang_pergi')}
          className={`flex-1 min-h-[44px] rounded-full text-xs font-heading font-bold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
            tripType === 'pulang_pergi'
              ? 'bg-white border border-slate-400 text-black shadow-sm'
              : 'text-slate-500 hover:text-black'
          }`}
        >
          Pulang Pergi
        </button>
      </div>

      {/* Kartu Dari - Ke (ketuk untuk ganti terminal) */}
      <section
        aria-label="Pilih rute perjalanan"
        className="relative rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Dari */}
        <button
          type="button"
          onClick={() => openPicker('origin')}
          aria-label={`Pilih terminal asal, saat ini ${originTerminal.nama}, ${originTerminal.kota}`}
          className="w-full flex items-start gap-3 px-4 pt-4 pb-3 text-left cursor-pointer hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-black"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
            <Disc className="w-4 h-4 text-black" />
          </div>
          <div className="flex-1 min-w-0 pr-10">
            <span className="block text-[10px] font-heading font-bold text-slate-500 tracking-wider">
              DARI (KEBERANGKATAN)
            </span>
            <span className="block font-heading font-bold text-sm text-black truncate mt-0.5">
              {originTerminal.nama}, {originTerminal.kota}
            </span>
          </div>
        </button>

        <div className="relative border-t border-dashed border-slate-200 mx-4">
          {/* Tombol tukar */}
          <button
            onClick={handleSwapStations}
            className={`absolute right-0 -top-[20px] w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center text-black shadow-sm hover:border-black active:scale-95 transition-all z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
              isSwapping ? 'rotate-180 duration-200' : ''
            }`}
            aria-label="Tukar asal dan tujuan"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Ke */}
        <button
          type="button"
          onClick={() => openPicker('destination')}
          aria-label={`Pilih terminal tujuan, saat ini ${destinationTerminal.nama}, ${destinationTerminal.kota}`}
          className="w-full flex items-start gap-3 px-4 pt-3 pb-4 text-left cursor-pointer hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-black"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
            <MapPin className="w-4 h-4 text-black" />
          </div>
          <div className="flex-1 min-w-0 pr-10">
            <span className="block text-[10px] font-heading font-bold text-slate-500 tracking-wider">
              KE (TUJUAN AKHIR)
            </span>
            <span className="block font-heading font-bold text-sm text-black truncate mt-0.5">
              {destinationTerminal.nama}, {destinationTerminal.kota}
            </span>
          </div>
        </button>

        {sameRoute && (
          <p role="alert" className="mx-4 mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">
            Asal dan tujuan tidak boleh sama. Pilih terminal yang berbeda untuk melihat jadwal.
          </p>
        )}
      </section>

      {/* Sheet pilih terminal: daftar + cari, bukan dropdown */}
      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30"
          onClick={() => setPickerOpen(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={pickerOpen === 'origin' ? 'Pilih terminal asal' : 'Pilih terminal tujuan'}
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl pb-[max(1rem,env(safe-area-inset-bottom))] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto mt-3 mb-2" aria-hidden="true" />
            <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-black text-[17px]">
                {pickerOpen === 'origin' ? 'Pilih asal' : 'Pilih tujuan'}
              </h3>
              <button
                onClick={() => setPickerOpen(null)}
                className="min-w-[44px] min-h-[44px] rounded-full text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer flex items-center justify-center"
                aria-label="Tutup pilih terminal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 pt-3">
              <label htmlFor="terminal-search" className="sr-only">Cari terminal, kota, atau provinsi</label>
              <div className="flex items-center gap-2 px-4 min-h-[44px] rounded-2xl bg-slate-100 border border-slate-200 focus-within:border-black">
                <Search className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                <input
                  id="terminal-search"
                  type="search"
                  value={pickerQuery}
                  onChange={(e) => setPickerQuery(e.target.value)}
                  placeholder="Cari terminal, kota, provinsi..."
                  autoFocus
                  className="w-full bg-transparent outline-none text-[15px] text-black placeholder:text-slate-500"
                />
                {pickerQuery && (
                  <button
                    onClick={() => setPickerQuery('')}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-black"
                    aria-label="Hapus pencarian"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[12px] text-slate-600 mt-2" aria-live="polite">
                {filteredTerminals.length} terminal ditemukan
              </p>
            </div>

            <ul className="overflow-y-auto px-3 py-2 space-y-1">
              {filteredTerminals.map((t) => {
                const selected = pickerOpen === 'origin' ? t.id === originId : t.id === destinationId;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => chooseTerminal(t)}
                      aria-current={selected ? 'true' : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 min-h-[60px] rounded-2xl text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
                        selected ? 'bg-black text-white' : 'hover:bg-slate-100 text-black'
                      }`}
                    >
                      <div className={`flex-1 min-w-0 ${selected ? '' : ''}`}>
                        <span className="block font-bold text-[15px] truncate">
                          {t.nama}, {t.kota}
                        </span>
                        <span className={`block text-[12px] truncate ${selected ? 'text-white/80' : 'text-slate-600'}`}>
                          {t.provinsi} • {t.alamat}
                        </span>
                      </div>
                      {selected && <Check className="w-5 h-5 shrink-0" aria-hidden="true" />}
                    </button>
                  </li>
                );
              })}
              {filteredTerminals.length === 0 && (
                <li className="p-5 text-center">
                  <p className="font-bold text-[15px] text-black">Tidak ketemu</p>
                  <p className="text-[13px] text-slate-600 mt-1">Coba kata lain, misal “Surabaya”, “Bandung”, atau “Rajabasa”.</p>
                </li>
              )}
            </ul>

            <div className="px-5 pt-2">
              <button
                onClick={() => setPickerOpen(null)}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 text-[13px] font-bold cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pilih tanggal */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-black font-heading font-bold text-xs">
            <Calendar className="w-3.5 h-3.5 text-black" aria-hidden="true" />
            <span>Pilih Tanggal</span>
          </div>
          <span className="text-[11px] font-heading font-bold text-slate-500">
            {monthYearLabel}
          </span>
        </div>

        <div role="tablist" aria-label="Pilih tanggal berangkat" className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
          {dates.map((item, index) => {
            const isSelected = selectedDateIndex === index;
            return (
              <button
                key={item.key}
                role="tab"
                aria-selected={isSelected}
                aria-label={item.full}
                onClick={() => setSelectedDateIndex(index)}
                className={`flex flex-col items-center justify-center min-w-[58px] min-h-[72px] py-2 rounded-2xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
                  isSelected
                    ? 'bg-white text-black border-2 border-black shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                <span className="text-[10px] font-heading font-bold uppercase">
                  {item.dayName}
                </span>
                <span className="text-base font-heading font-bold leading-tight mt-0.5">
                  {item.dayNum}
                </span>
                <span className="text-[10px] font-medium mt-0.5">
                  {item.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter cepat */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setFilterType('tercepat')}
          aria-pressed={filterType === 'tercepat'}
          className={`flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-full text-xs font-heading font-bold border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
            filterType === 'tercepat'
              ? 'bg-white border-2 border-black text-black'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <Zap className="w-3 h-3 fill-current" aria-hidden="true" />
          <span>Fast Lane (Tercepat)</span>
        </button>

        <button
          onClick={() => setFilterType('termurah')}
          aria-pressed={filterType === 'termurah'}
          className={`min-h-[44px] px-3.5 rounded-full text-xs font-heading font-bold border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
            filterType === 'termurah'
              ? 'bg-white border-2 border-black text-black'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          Termurah
        </button>

        <button
          onClick={() => setShowFilterModal(true)}
          className="ml-auto flex items-center gap-1.5 min-h-[44px] px-3 rounded-full text-xs font-heading font-bold bg-white border border-slate-200 text-black hover:border-black cursor-pointer shadow-sm focus-visible:outline-2 focus-visible:outline-black"
        >
          <SlidersHorizontal className="w-3 h-3 text-black" aria-hidden="true" />
          <span>Filter</span>
        </button>
      </div>

      {/* Daftar jadwal */}
      <div className="space-y-3 pt-1">
        {sortedSchedules.length === 0 && (
          <div className="p-5 rounded-3xl bg-white border border-dashed border-slate-300 text-center">
            <p className="font-bold text-[15px] text-black">
              {sameRoute ? 'Asal dan tujuan sama' : 'Belum ada jadwal untuk rute ini'}
            </p>
            <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">
              {sameRoute
                ? 'Pilih terminal asal dan tujuan yang berbeda.'
                : `Rute ${originTerminal.kota} → ${destinationTerminal.kota} belum ada PO terverifikasi. Coba Pulo Gebang → Giwangan atau Purabaya pada ${selectedDate.full}.`}
            </p>
            <button
              onClick={() => { setOriginId('pulo-gebang'); setDestinationId('giwangan'); }}
              className="mt-3 min-h-[44px] px-4 rounded-full bg-black text-white text-[13px] font-bold cursor-pointer"
            >
              Coba rute populer
            </button>
          </div>
        )}
        {sortedSchedules.map((bus) => (
          <article
            key={bus.id}
            aria-label={`${bus.operator} ${bus.departureTime} ke ${bus.arrivalCity} ${formatRupiah(bus.pricePerSeat)}`}
            className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-slate-400 transition-all shadow-sm"
          >
            {/* Operator Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-[17px] text-black leading-tight">
                    {bus.operator}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-bold text-slate-700">
                    {bus.busCode}
                  </span>
                </div>
                <p className="text-[13px] text-slate-600 mt-0.5">
                  {bus.seatConfig} • {bus.serviceTier}
                </p>
              </div>
            </div>

            {/* Departure -> Duration & Route -> Arrival */}
            <div className="flex items-center justify-between py-3 my-2 border-y border-slate-100">
              {/* Departure */}
              <div>
                <span className="font-bold text-[20px] text-black block tabular-nums">
                  {bus.departureTime}
                </span>
                <span className="text-[12px] text-slate-600">
                  {bus.departureCity}
                </span>
                <span className="block text-[11px] text-slate-600 truncate max-w-[110px]">
                  {bus.departureStation}
                </span>
              </div>

              {/* Transit Timeline Indicator */}
              <div className="flex-1 px-3 flex flex-col items-center text-center">
                <div className="flex items-center gap-1 text-[12px] text-black font-bold">
                  <span className="tabular-nums">{bus.duration}</span>
                  <BusIcon className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                {/* Horizontal line with bus dot */}
                <div className="w-full relative my-1.5 flex items-center justify-center" aria-hidden="true">
                  <div className="w-full h-[2px] bg-slate-200 rounded-full" />
                  <span className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-black" />
                </div>
                <span className="text-[11px] text-slate-600 truncate max-w-[140px]">
                  {bus.routeHighlight} • {selectedDate.dayNum} {selectedDate.month}
                </span>
              </div>

              {/* Arrival */}
              <div className="text-right">
                <span className="font-bold text-[20px] text-black block tabular-nums">
                  {bus.arrivalTime}
                </span>
                <span className="text-[12px] text-slate-600">
                  {bus.arrivalCity}
                </span>
                <span className="block text-[11px] text-slate-600 truncate max-w-[110px] ml-auto">
                  {bus.arrivalStation}
                </span>
              </div>
            </div>

            {/* Bottom Row: Remaining Seats, Price, Button */}
            <div className="flex items-center justify-between gap-2 pt-1">
              {/* Seat Warning - ikon + teks, bukan warna saja */}
              <div className="flex items-center gap-1.5 text-[13px]">
                {bus.urgentWarning ? (
                  <p className="flex items-center gap-1.5 text-black font-bold">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Sisa {bus.availableSeats} kursi</span>
                  </p>
                ) : (
                  <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Armchair className="w-4 h-4" aria-hidden="true" />
                    <span>Sisa {bus.availableSeats} kursi</span>
                  </p>
                )}
              </div>

              {/* Price & Action - tombol primer satu-satunya */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-bold text-[17px] text-black tabular-nums">
                    {formatRupiah(bus.pricePerSeat)}
                  </span>
                  <span className="text-[11px] text-slate-600 block">
                    /kursi
                  </span>
                </div>

                <button
                  onClick={() => onSelectBus(bus)}
                  className="min-h-[44px] px-5 rounded-full bg-black text-white text-[13px] font-bold active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  aria-label={`Pilih kursi ${bus.operator} berangkat ${bus.departureTime}`}
                >
                  Pilih
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Jaminan - tombol teks, bukan seluruh kartu */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-black shrink-0" aria-hidden="true">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-[13px] text-black">
              Jaminan perjalanan aman
            </h2>
            <p className="text-[12px] text-slate-600 mt-0.5">
              Refund 100% bila bus terlambat lebih dari 60 menit.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowGuaranteeModal(true)}
          className="min-h-[44px] px-3 rounded-full text-[13px] font-bold text-black hover:bg-slate-100 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
          aria-label="Lihat detail jaminan perjalanan"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Guarantee Details Modal - satu sheet, ada grabber + Batal */}
      {showGuaranteeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
          onClick={() => setShowGuaranteeModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Garansi tepat waktu"
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto mb-3" aria-hidden="true" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-black" aria-hidden="true" />
                <h3 className="font-bold text-black text-[17px]">
                  Garansi tepat waktu
                </h3>
              </div>
              <button
                onClick={() => setShowGuaranteeModal(false)}
                className="min-w-[44px] min-h-[44px] rounded-full text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer flex items-center justify-center"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 text-[13px] text-slate-700 space-y-2.5">
              <p>
                Komitmen kenyamanan bagi setiap penumpang OmniBus:
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-black font-semibold">
                  <Check className="w-4 h-4 text-black" aria-hidden="true" />
                  <span>Kompensasi keterlambatan lebih dari 60 menit</span>
                </div>
                <p className="text-[12px] text-slate-600">
                  Pengembalian 100% biaya tiket sebagai saldo refund instan.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-black font-semibold">
                  <Check className="w-4 h-4 text-black" aria-hidden="true" />
                  <span>Asuransi Jasa Raharja termasuk</span>
                </div>
                <p className="text-[12px] text-slate-600">
                  Semua penumpang terlindungi selama perjalanan antarkota.
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setShowGuaranteeModal(false)}
                className="flex-1 min-h-[44px] rounded-xl border border-slate-200 text-[13px] font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => setShowGuaranteeModal(false)}
                className="flex-1 min-h-[44px] rounded-xl bg-black text-white text-[13px] font-bold cursor-pointer"
              >
                Saya mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal - satu sheet */}
      {showFilterModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter bus"
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto mb-3" aria-hidden="true" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-black text-[17px]">
                Filter bus
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="min-w-[44px] min-h-[44px] rounded-full text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer flex items-center justify-center"
                aria-label="Tutup filter"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <span className="text-[12px] font-bold text-slate-600 block mb-2">
                  Kelas layanan
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Executive', 'Sleeper', 'Suite', 'Double Decker'].map((cls) => {
                    const active = selectedClassFilter.includes(cls);
                    return (
                      <button
                        key={cls}
                        aria-pressed={active}
                        onClick={() => {
                          if (active) {
                            setSelectedClassFilter(selectedClassFilter.filter((c) => c !== cls));
                          } else {
                            setSelectedClassFilter([...selectedClassFilter, cls]);
                          }
                        }}
                        className={`min-h-[44px] px-4 rounded-full text-[13px] font-bold border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
                          active
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[12px] font-bold text-slate-600 block mb-2">
                  Waktu keberangkatan
                </span>
                <p className="text-[13px] text-slate-700">
                  Pagi 05.00–12.00 • Siang 12.00–18.00 • Malam 18.00–05.00. Filter waktu dipakai di pencarian.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setSelectedClassFilter(['Executive', 'Sleeper', 'Suite']);
                  setShowFilterModal(false);
                }}
                className="flex-1 min-h-[44px] rounded-xl border border-slate-200 text-[13px] font-bold cursor-pointer"
              >
                Atur ulang
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 min-h-[44px] rounded-xl bg-black text-white text-[13px] font-bold cursor-pointer"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
