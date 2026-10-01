import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Info,
  Bed,
  Armchair,
  Layers,
  Disc,
  Usb,
  Wifi,
  Tv,
  Sun,
  Luggage,
  UtensilsCrossed,
  ArrowRight,
  Check,
  X,
  CreditCard,
  ShieldCheck,
  Coffee,
} from 'lucide-react';
import { BusSchedule, ETicket } from '../data/mockData';
import { buildSeatSelectionHeader } from '../services/bookingFlow';
import {
  getSeatLegend,
  isSeatSelectable,
  resolveSeatVisual,
  getCabinLayoutConfig,
  getCabinScrollProps,
  type RichSeat,
} from '../services/seatStatus';
import {
  listDummyPaymentMethods,
  validateDummyPaymentRequest,
  processDummyPayment,
  getDummyPaymentInstructions,
  type DummyPaymentReceipt,
} from '../services/dummyPayment';

interface SeatSelectionScreenProps {
  selectedBus: BusSchedule;
  onBack: () => void;
  onProceedToPayment: (
    ticketData: Partial<ETicket> & { seatNumbers?: string[]; passengerName?: string; travelDate?: string },
    totalPrice: number,
    receipt?: DummyPaymentReceipt,
  ) => void;
}

// Demo kabin: campuran tersedia / terisi laki-laki / terisi perempuan / prioritas (P).
// Di produksi ini datang dari API ketersediaan kursi per jadwal.
const DEMO_SEATS: RichSeat[] = [
  { id: 's01', number: '01', availability: 'tersedia' },
  { id: 's03', number: '03', availability: 'terisi', occupantGender: 'laki-laki' },
  { id: 's05', number: '05', availability: 'tersedia', isPriority: true },
  { id: 's07', number: '07', availability: 'terisi', occupantGender: 'perempuan' },
  { id: 's09', number: '09', availability: 'tersedia' },
  { id: 's11', number: '11', availability: 'terisi', occupantGender: 'laki-laki' },
  { id: 's13', number: '13', availability: 'tersedia' },
  { id: 's15', number: '15', availability: 'tersedia', isPriority: true },
];
const DEMO_SEATS_BOTTOM: RichSeat[] = [
  { id: 's02', number: '02', availability: 'terisi', occupantGender: 'perempuan' },
  { id: 's04', number: '04', availability: 'tersedia' },
  { id: 's06', number: '06', availability: 'tersedia' },
  { id: 's08', number: '08', availability: 'terisi', occupantGender: 'laki-laki' },
  { id: 's10', number: '10', availability: 'tersedia' },
  { id: 's12', number: '12', availability: 'tersedia' },
  { id: 's14', number: '14', availability: 'terisi', occupantGender: 'perempuan' },
  { id: 's16', number: '16', availability: 'tersedia' },
];

export const SeatSelectionScreen: React.FC<SeatSelectionScreenProps> = ({
  selectedBus,
  onBack,
  onProceedToPayment,
}) => {
  const [selectedClass, setSelectedClass] = useState<'sleeper' | 'executive'>('sleeper');
  const [selectedDeck, setSelectedDeck] = useState<number>(1);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string>('06');
  const [passengerName, setPassengerName] = useState<string>('Budi Santoso');
  const [extraBaggage, setExtraBaggage] = useState<boolean>(true);
  const [snackBox, setSnackBox] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('gopay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Header konsisten dengan jadwal (tidak hardcode Pulogebang→Giwangan / EXECUTIVE SLEEPER)
  const header = useMemo(() => buildSeatSelectionHeader(selectedBus), [selectedBus]);
  const legend = useMemo(() => getSeatLegend(), []);
  const cabinCfg = useMemo(
    () => getCabinLayoutConfig(selectedClass === 'sleeper' ? '1st Class Sleeper' : 'Executive Class'),
    [selectedClass],
  );
  const cabinScroll = useMemo(
    () => getCabinScrollProps(selectedClass === 'sleeper' ? '1st Class Sleeper' : 'Executive Class'),
    [selectedClass],
  );
  const paymentMethods = useMemo(() => listDummyPaymentMethods(), []);

  // Seat pricing
  const basePrice = selectedClass === 'sleeper' ? 340000 : 280000;
  const baggagePrice = extraBaggage ? 25000 : 0;
  const snackPrice = snackBox ? 35000 : 0;
  const totalPrice = basePrice + baggagePrice + snackPrice;

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const bookingRef = useMemo(
    () => `BOOK-${selectedBus.busCode.replace(/\s+/g, '')}-${selectedSeatNumber}-${Date.now().toString().slice(-6)}`,
    [selectedBus.busCode, selectedSeatNumber],
  );

  const paymentValidation = validateDummyPaymentRequest({
    methodId: paymentMethod,
    amount: totalPrice,
    bookingRef,
    passengerName,
  });

  // Seat click handler
  const handleSeatClick = (seat: RichSeat) => {
    if (!isSeatSelectable({ ...seat, availability: seat.number === selectedSeatNumber ? 'tersedia' : seat.availability })) {
      // Izinkan pindah dari kursi terpilih ke kursi tersedia lain
      if (seat.availability !== 'tersedia') return;
    }
    if (seat.availability !== 'tersedia') return;
    setSelectedSeatNumber(seat.number);
  };

  // Lanjutkan Pembayaran -> proses dummy gateway -> konfirmasi terbit tiket
  const handleConfirmBooking = async () => {
    setPayError(null);
    if (!paymentValidation.valid) {
      setPayError(paymentValidation.reason ?? 'Lengkapi data pembayaran.');
      return;
    }
    setIsProcessing(true);
    try {
      const receipt = await processDummyPayment({
        methodId: paymentMethod,
        amount: totalPrice,
        bookingRef,
        passengerName,
      });
      setIsProcessing(false);
      setShowPaymentSheet(false);
      onProceedToPayment(
        {
          operator: selectedBus.operator,
          fleetCode: `Armada ${selectedBus.busCode}-02`,
          departureTime: selectedBus.departureTime,
          departureCity: selectedBus.departureCity,
          departureTerminal: selectedBus.departureStation.replace('Terminal ', ''),
          arrivalTime: selectedBus.arrivalTime,
          arrivalCity: selectedBus.arrivalCity,
          arrivalTerminal: selectedBus.arrivalStation.replace('Terminal ', ''),
          duration: selectedBus.duration,
          seatNumber: selectedSeatNumber,
          seatNumbers: [selectedSeatNumber],
          passengerName: passengerName.trim(),
          travelDate: '2026-10-15',
          busClass: selectedClass === 'sleeper' ? 'Executive Sleeper' : 'Executive Plus',
          baggageMaxKg: extraBaggage ? 40 : 20,
        },
        totalPrice,
        receipt,
      );
    } catch (e) {
      setIsProcessing(false);
      setPayError(e instanceof Error ? e.message : 'Pembayaran dummy gagal. Coba lagi.');
    }
  };

  const renderSeatButton = (seat: RichSeat) => {
    const isSelected = selectedSeatNumber === seat.number;
    const visual = resolveSeatVisual(
      isSelected ? { ...seat, availability: 'dipilih', occupantGender: null, isPriority: false } : seat,
    );
    if (seat.availability !== 'tersedia') {
      const genderStyle =
        seat.occupantGender === 'laki-laki'
          ? 'bg-blue-50 text-blue-700 border-blue-200'
          : seat.occupantGender === 'perempuan'
            ? 'bg-pink-50 text-pink-700 border-pink-200'
            : 'bg-white text-slate-400 border-slate-200';
      return (
        <div
          key={seat.id}
          data-testid={`seat-${seat.number}-terisi`}
          title={visual.label}
          className={`h-14 min-w-[56px] rounded-2xl ${genderStyle} bg-hatch-pattern flex flex-col items-center justify-center cursor-not-allowed border`}
        >
          <span className="font-heading font-bold text-xs leading-none">{seat.number}</span>
          <span className="text-[8px] opacity-75 mt-0.5">
            {seat.occupantGender === 'laki-laki' ? 'Laki-laki' : seat.occupantGender === 'perempuan' ? 'Perempuan' : 'Terisi'}
          </span>
        </div>
      );
    }
    const priorityBadge = seat.isPriority ? 'P' : null;
    return (
      <button
        key={seat.id}
        onClick={() => handleSeatClick(seat)}
        data-testid={`seat-${seat.number}`}
        title={visual.label}
        className={`h-14 min-w-[56px] rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${
          isSelected
            ? 'bg-white text-black shadow-md border-2 border-black ring-2 ring-slate-200 scale-105 z-10 font-black'
            : 'bg-white text-black hover:border-slate-400 shadow-xs border border-slate-200'
        }`}
      >
        {isSelected && (
          <span className="absolute -top-2 px-1.5 py-0.2 rounded-full bg-white text-black text-[8px] font-heading font-extrabold uppercase tracking-wide border border-black shadow-xs">
            SAYA
          </span>
        )}
        <span className="font-heading font-extrabold text-sm leading-none">
          {priorityBadge ? `P${seat.number}` : seat.number}
        </span>
        <span className="text-[8px] font-semibold mt-0.5">
          {seat.isPriority ? 'Prioritas' : 'Tersedia'}
        </span>
      </button>
    );
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* 1. Top Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:border-black hover:text-black shadow-xs transition-all cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center flex-1 px-2">
          <h1 className="font-heading font-bold text-base text-black">
            {header.title}
          </h1>
          <p className="text-[11px] text-slate-500 truncate" data-testid="seat-header-subtitle">
            {header.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowInfoModal(true)}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:border-black hover:text-black shadow-xs transition-all cursor-pointer"
          aria-label="Info Bus"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Route Summary Card — konsisten dengan jadwal */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black" />
            <h2 className="font-heading font-bold text-base text-black" data-testid="seat-route-label">
              {header.routeLabel}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {selectedBus.departureStation} → {selectedBus.arrivalStation}
          </p>
        </div>

        <div className="text-right space-y-0.5">
          <span
            data-testid="seat-class-badge"
            className="inline-block px-2.5 py-0.5 rounded-full bg-white border border-slate-300 text-[10px] font-heading font-bold text-black"
          >
            {header.classBadge}
          </span>
          <p className="text-[11px] text-slate-500 font-heading font-medium">
            {header.durationLabel}
          </p>
        </div>
      </div>

      {/* 3. Class Selector Cards (1st Class Sleeper vs Executive Class) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Sleeper Tab */}
        <div
          onClick={() => setSelectedClass('sleeper')}
          className={`relative p-3.5 rounded-2xl cursor-pointer transition-all ${
            selectedClass === 'sleeper'
              ? 'bg-white border-2 border-black shadow-xs'
              : 'bg-white border border-slate-200 hover:border-slate-300'
          }`}
        >
          {selectedClass === 'sleeper' && (
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-white border border-black text-black text-[9px] font-heading font-bold uppercase tracking-wider">
              Terpilih
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs font-heading font-semibold text-black">
            <Bed className="w-3.5 h-3.5 text-black" />
            <span>1st Class Sleeper</span>
          </div>
          <p className="font-heading font-bold text-base text-black mt-1.5">
            Rp 340.000
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Sisa 12 Kursi Kabin
          </p>
        </div>

        {/* Executive Tab */}
        <div
          onClick={() => setSelectedClass('executive')}
          className={`relative p-3.5 rounded-2xl cursor-pointer transition-all ${
            selectedClass === 'executive'
              ? 'bg-white border-2 border-black shadow-xs'
              : 'bg-white border border-slate-200 hover:border-slate-300'
          }`}
        >
          {selectedClass === 'executive' && (
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-white border border-black text-black text-[9px] font-heading font-bold uppercase tracking-wider">
              Terpilih
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs font-heading font-semibold text-black">
            <Armchair className="w-3.5 h-3.5 text-slate-500" />
            <span>Executive Class</span>
          </div>
          <p className="font-heading font-bold text-base text-black mt-1.5">
            Rp 280.000
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Sisa 24 Kursi
          </p>
        </div>
      </div>

      {/* 4. Deck Selector */}
      <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-black" />
          <div>
            <h4 className="font-heading font-bold text-xs text-black">
              Deck {selectedDeck} - {selectedDeck === 1 ? 'Depan' : selectedDeck === 2 ? 'Tengah' : 'Atas'}
            </h4>
            <p className="text-[11px] text-slate-500">
              Tersedia 12/20 kursi kabin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((deck) => (
            <button
              key={deck}
              onClick={() => setSelectedDeck(deck)}
              className={`w-7 h-7 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
                selectedDeck === deck
                  ? 'bg-white border-2 border-black text-black shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {deck}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Legend Indicator — 6 status: tersedia, dipilih, terisi, P prioritas, laki-laki, perempuan */}
      <div className="py-1 space-y-1.5">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500 flex-wrap">
          {legend.map((item) => (
            <div key={item.key} className="flex items-center gap-1.5" data-testid={item.testId} title={item.description}>
              <span
                className={`w-3.5 h-3.5 rounded-full border ${
                  item.key === 'dipilih'
                    ? 'bg-white border-2 border-black'
                    : item.key === 'terisi'
                      ? 'bg-white bg-hatch-pattern border-slate-200'
                      : item.key === 'prioritas'
                        ? 'bg-amber-100 border-amber-400 text-amber-700 flex items-center justify-center text-[9px] font-bold'
                        : item.key === 'laki-laki'
                          ? 'bg-blue-100 border-blue-300'
                          : item.key === 'perempuan'
                            ? 'bg-pink-100 border-pink-300'
                            : 'bg-white border-slate-300'
                }`}
              >
                {item.key === 'prioritas' ? 'P' : null}
              </span>
              <span className="text-[11px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Visual Bus Cabin — BISA DIGESER KE KANAN (overflow-x-auto) */}
      <div className="relative rounded-3xl bg-white border-2 border-slate-200 p-3.5 shadow-xs text-black overflow-hidden">
        {/* Cabin header */}
        <div className="flex items-center justify-between text-[11px] font-heading font-bold uppercase pb-2 px-1 text-black">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-black" />
            <span>P DEPAN — PINTU DEPAN</span>
          </div>
          <div className="text-[10px] tracking-wider font-extrabold bg-white border border-slate-300 text-black px-2.5 py-0.5 rounded-full">
            CABIN PODS
          </div>
        </div>
        <p className="text-[11px] text-slate-500 px-1 pb-2" data-testid="cabin-scroll-hint">
          {cabinCfg.scrollHint} ({cabinCfg.totalColumns} kolom, tampil {cabinCfg.visibleColumns})
        </p>

        {/* Bus Interior Compartment */}
        <div className="grid grid-cols-12 gap-2 items-stretch py-1">
          {/* Driver Cockpit & Entrance (Left side of cabin) */}
          <div className="col-span-2 flex flex-col justify-between items-center py-2 px-1 bg-white border border-slate-200 rounded-2xl text-black shadow-xs">
            <div className="flex items-center flex-col gap-1 py-1">
              <div className="w-7 h-7 rounded-full bg-white border border-slate-300 flex items-center justify-center text-black">
                <Disc className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-[9px] font-heading font-semibold text-slate-600">
                Sopir
              </span>
            </div>

            <div className="flex flex-col items-center gap-0.5 pt-2 border-t border-slate-100 w-full text-center">
              <span className="text-[9px] font-heading font-semibold text-slate-600">
                🚪 Pintu
              </span>
            </div>
          </div>

          {/* Seat Matrix — SCROLLABLE KE KANAN */}
          <div className="col-span-8 flex flex-col justify-between py-1 min-w-0">
            <div
              data-testid={cabinScroll.testId}
              aria-label={cabinScroll.ariaLabel}
              style={{ overflowX: cabinScroll.overflowX }}
              className="overflow-x-auto pb-1 -mx-1 px-1"
            >
              <div className="flex flex-col gap-2 min-w-max">
                {/* Top Row Seats */}
                <div className="flex gap-2">
                  {DEMO_SEATS.map(renderSeatButton)}
                </div>

                {/* Central Corridor Aisle */}
                <div className="my-1 py-1 px-3 rounded-full bg-white border border-slate-200 flex items-center justify-between text-[9px] font-heading font-bold tracking-wider text-slate-600 min-w-max">
                  <span>→</span>
                  <span>LORONG TENGAH — GESER →</span>
                  <span>→</span>
                </div>

                {/* Bottom Row Seats */}
                <div className="flex gap-2">
                  {DEMO_SEATS_BOTTOM.map(renderSeatButton)}
                </div>
              </div>
            </div>
          </div>

          {/* Rear Amenities: WC & BAR (Right side of cabin) */}
          <div className="col-span-2 flex flex-col justify-between items-center py-2 px-1 bg-white border border-slate-200 rounded-2xl text-black shadow-xs">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-base">🚻</span>
              <span className="text-[9px] font-heading font-bold text-slate-600">
                WC
              </span>
            </div>

            <div className="flex flex-col items-center gap-0.5 pt-2 border-t border-slate-100 w-full text-center">
              <Coffee className="w-4 h-4 text-black" />
              <span className="text-[9px] font-heading font-bold text-slate-600">
                BAR
              </span>
            </div>
          </div>
        </div>

        {/* Amenities Footer Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between px-1 text-[10px] font-heading font-bold text-slate-700">
          <div className="flex items-center gap-1">
            <Usb className="w-3.5 h-3.5 text-black" />
            <span>USB Port</span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-black" />
            <span>WiFi Kabin</span>
          </div>
          <div className="flex items-center gap-1">
            <Tv className="w-3.5 h-3.5 text-black" />
            <span>Monitor VOD</span>
          </div>
          <div className="flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-black" />
            <span>Lampu Baca</span>
          </div>
        </div>
      </div>

      {/* 6b. Data penumpang (nama wajib sebelum Lanjutkan Pembayaran) */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
        <label htmlFor="passenger-name" className="text-xs font-heading font-bold text-slate-500 uppercase tracking-wider block">
          Data Tiket — Nama Penumpang
        </label>
        <input
          id="passenger-name"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
          placeholder="Nama sesuai KTP, cth: Budi Santoso"
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-black outline-none focus:border-black"
        />
        {passengerName.trim() === '' && (
          <p className="text-[11px] text-red-600">Nama wajib diisi sebelum lanjut pembayaran.</p>
        )}
      </div>

      {/* 7. LAYANAN TAMBAHAN (ADD-ONS) */}
      <div className="space-y-2.5 pt-1">
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
          LAYANAN TAMBAHAN (ADD-ONS)
        </h3>

        {/* Add-on 1: Extra Baggage */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black">
              <Luggage className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-black">
                Bagasi Ekstra (+1 Koper 20kg)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                +Rp 25.000 / bagasi kargo
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setExtraBaggage(!extraBaggage)}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer border ${
              extraBaggage ? 'bg-white border-black' : 'bg-white border-slate-300'
            }`}
            aria-label="Toggle Bagasi Ekstra"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full border transition-transform ${
                extraBaggage ? 'translate-x-6 bg-black border-black' : 'translate-x-0 bg-slate-300 border-slate-300'
              }`}
            />
          </button>
        </div>

        {/* Add-on 2: Snack Box Premium */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-black">
                Snack Box Premium &amp; Minuman
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                +Rp 35.000 (Roti Artisan &amp; Cold Brew)
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setSnackBox(!snackBox)}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer border ${
              snackBox ? 'bg-white border-black' : 'bg-white border-slate-300'
            }`}
            aria-label="Toggle Snack Box"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full border transition-transform ${
                snackBox ? 'translate-x-6 bg-black border-black' : 'translate-x-0 bg-slate-300 border-slate-300'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 8. Fixed Bottom Booking Bar — TOMBOL LANJUTKAN PEMBAYARAN */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3 max-w-md mx-auto shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-500 block truncate">
              1 Kursi (No. {selectedSeatNumber}) {extraBaggage ? '+ Bagasi' : ''} {snackBox ? '+ Snack' : ''}
            </span>
            <span className="font-heading font-bold text-xl text-black">
              {formatRupiah(totalPrice)}
            </span>
          </div>

          <button
            data-testid="lanjutkan-pembayaran"
            onClick={() => setShowPaymentSheet(true)}
            disabled={passengerName.trim() === ''}
            className="flex-1 py-3 px-4 rounded-full bg-white border-2 border-black hover:bg-slate-50 active:scale-95 text-black text-xs font-heading font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-40"
          >
            <span>Lanjutkan Pembayaran</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Payment & Passenger Confirmation Modal — DUMMY GATEWAY */}
      {showPaymentSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border-t border-slate-200 rounded-t-3xl p-5 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-black" />
                <h3 className="font-heading font-bold text-black text-base">
                  Konfirmasi Pembayaran (Dummy)
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentSheet(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200">
              Mode dummy — tidak ada uang asli. Pilih metode, tekan Bayar Sekarang, tiket langsung terbit di E-Tiket.
            </p>

            {/* Passenger Info Card */}
            <div className="py-3 space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Data Penumpang</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-black font-semibold text-[10px]">
                    Dewasa (KTP Terverifikasi)
                  </span>
                </div>
                <p className="font-heading font-bold text-sm text-black">
                  {passengerName.trim() || '— isi nama dulu —'}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <div>
                    <span>Kursi: </span>
                    <strong className="text-black">No. {selectedSeatNumber}</strong>
                  </div>
                  <div>
                    <span>Bagasi: </span>
                    <strong className="text-black">{extraBaggage ? '40kg (Ekstra)' : '20kg (Standar)'}</strong>
                  </div>
                </div>
              </div>

              {/* Payment Methods — dari dummy gateway (8 metode) */}
              <div>
                <label className="text-xs font-heading font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Metode Pembayaran (Dummy) — pilih satu
                </label>
                <div className="grid grid-cols-2 gap-2" data-testid="payment-methods">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      data-testid={`pay-${method.id}`}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        paymentMethod === method.id
                          ? 'bg-white border-2 border-black text-black shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-heading font-bold">{method.name}</span>
                        {paymentMethod === method.id && (
                          <Check className="w-3.5 h-3.5 text-black" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 font-medium">{method.badge} • {method.category}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200" data-testid="pay-instructions">
                  {getDummyPaymentInstructions(paymentMethod)}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Tiket {selectedBus.operator} ({selectedClass === 'sleeper' ? 'Sleeper' : 'Executive'})</span>
                  <span className="text-black font-semibold">{formatRupiah(basePrice)}</span>
                </div>
                {extraBaggage && (
                  <div className="flex justify-between text-slate-500">
                    <span>Bagasi Ekstra 20kg</span>
                    <span className="text-black font-semibold">Rp 25.000</span>
                  </div>
                )}
                {snackBox && (
                  <div className="flex justify-between text-slate-500">
                    <span>Snack Box Artisan &amp; Minuman</span>
                    <span className="text-black font-semibold">Rp 35.000</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-100 font-heading font-bold text-sm">
                  <span className="text-black">Total Tagihan</span>
                  <span className="text-black font-extrabold">{formatRupiah(totalPrice)}</span>
                </div>
              </div>

              {payError && (
                <p role="alert" className="text-[12px] text-red-700 p-2 rounded-xl bg-red-50 border border-red-200">
                  {payError}
                </p>
              )}
              {!paymentValidation.valid && (
                <p className="text-[12px] text-amber-700 p-2 rounded-xl bg-amber-50 border border-amber-200">
                  {paymentValidation.reason}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setShowPaymentSheet(false)}
                className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-black text-xs font-heading font-bold hover:border-slate-400 cursor-pointer"
              >
                Batal
              </button>
              <button
                disabled={isProcessing || !paymentValidation.valid}
                onClick={handleConfirmBooking}
                data-testid="bayar-sekarang"
                className="flex-1 py-3 rounded-xl bg-white border-2 border-black hover:bg-slate-50 text-black text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Memproses Tiket...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Bayar Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Bus Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-black text-base">
                Spesifikasi Armada Bus
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 text-xs text-slate-600 space-y-2">
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="font-bold text-black block">{selectedBus.operator} {selectedBus.busCode} — {selectedBus.serviceTier}</span>
                <p className="text-slate-500 text-[11px]">
                  {selectedBus.seatConfig}. Konfigurasi pod tidur individu dengan tirai privasi, monitor VOD, bantal &amp; selimut higienis, serta port charger type-C.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="font-bold text-black block">Fasilitas Onboard</span>
                <p className="text-slate-500 text-[11px]">
                  Toilet ramah penumpang, dispenser air mineral gratis di bar belakang, dan WiFi kabin sepanjang {selectedBus.routeHighlight}.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:border-black text-black text-xs font-heading font-bold shadow-xs cursor-pointer transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
