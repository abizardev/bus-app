import React, { useState } from 'react';
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

interface SeatSelectionScreenProps {
  selectedBus: BusSchedule;
  onBack: () => void;
  onProceedToPayment: (ticketData: Partial<ETicket>, totalPrice: number) => void;
}

export const SeatSelectionScreen: React.FC<SeatSelectionScreenProps> = ({
  selectedBus,
  onBack,
  onProceedToPayment,
}) => {
  const [selectedClass, setSelectedClass] = useState<'sleeper' | 'executive'>('sleeper');
  const [selectedDeck, setSelectedDeck] = useState<number>(1);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string>('06');
  const [extraBaggage, setExtraBaggage] = useState<boolean>(true);
  const [snackBox, setSnackBox] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'gopay' | 'ovo' | 'bca' | 'mandiri'>('gopay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Seat pricing
  const basePrice = selectedClass === 'sleeper' ? 340000 : 280000;
  const baggagePrice = extraBaggage ? 25000 : 0;
  const snackPrice = snackBox ? 35000 : 0;
  const totalPrice = basePrice + baggagePrice + snackPrice;

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Seat click handler
  const handleSeatClick = (seatNum: string, status: string) => {
    if (status === 'terisi') return;
    setSelectedSeatNumber(seatNum);
  };

  // Confirm booking
  const handleConfirmBooking = () => {
    setIsProcessing(true);
    setTimeout(() => {
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
          busClass: selectedClass === 'sleeper' ? 'Executive Sleeper' : 'Executive Plus',
          baggageMaxKg: extraBaggage ? 40 : 20,
        },
        totalPrice
      );
    }, 1200);
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
            Pilih Kursi Bus
          </h1>
          <p className="text-[11px] text-slate-500 truncate">
            {selectedBus.operator} {selectedBus.busCode} • 22 Agu, {selectedBus.departureTime} WIB
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

      {/* 2. Route Summary Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black" />
            <h2 className="font-heading font-bold text-base text-black">
              {selectedBus.departureCity} → {selectedBus.arrivalCity}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Terminal Pulogebang → Giwangan
          </p>
        </div>

        <div className="text-right space-y-0.5">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white border border-slate-300 text-[10px] font-heading font-bold text-black">
            EXECUTIVE SLEEPER
          </span>
          <p className="text-[11px] text-slate-500 font-heading font-medium">
            Est. {selectedBus.duration}
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

      {/* 5. Legend Indicator */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-500 py-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300" />
          <span className="text-[11px]">Tersedia</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-black shadow-xs" />
          <span className="text-[11px] text-black font-semibold">Dipilih</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-hatch-pattern bg-white border border-slate-200" />
          <span className="text-[11px]">Terisi</span>
        </div>
      </div>

      {/* 6. Visual Bus Cabin (Pure White Wireframe Blueprint) */}
      <div className="relative rounded-3xl bg-white border-2 border-slate-200 p-3.5 shadow-xs text-black overflow-hidden">
        {/* Cabin header */}
        <div className="flex items-center justify-between text-[11px] font-heading font-bold uppercase pb-2 px-1 text-black">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-black" />
            <span>P DEPAN</span>
          </div>
          <div className="text-[10px] tracking-wider font-extrabold bg-white border border-slate-300 text-black px-2.5 py-0.5 rounded-full">
            CABIN PODS
          </div>
        </div>

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

          {/* Seat Matrix & Central Corridor (Center) */}
          <div className="col-span-8 flex flex-col justify-between py-1">
            {/* Top Row Seats (01, 03, 05, 07) */}
            <div className="grid grid-cols-4 gap-2">
              {/* Seat 01 */}
              <button
                onClick={() => handleSeatClick('01', 'tersedia')}
                className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  selectedSeatNumber === '01'
                    ? 'bg-white text-black shadow-xs scale-105 border-2 border-black font-extrabold'
                    : 'bg-white text-black hover:border-slate-400 shadow-xs border border-slate-200'
                }`}
              >
                <span className="font-heading font-bold text-xs leading-none">01</span>
                <span className="text-[8px] opacity-75 mt-0.5">Atas</span>
              </button>

              {/* Seat 03 (Occupied) */}
              <div className="h-14 rounded-2xl bg-white bg-hatch-pattern text-slate-400 flex flex-col items-center justify-center cursor-not-allowed border border-slate-200">
                <span className="font-heading font-bold text-xs leading-none">03</span>
                <span className="text-[8px] opacity-75 mt-0.5">Atas</span>
              </div>

              {/* Seat 05 (Tersedia) */}
              <button
                onClick={() => handleSeatClick('05', 'tersedia')}
                className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  selectedSeatNumber === '05'
                    ? 'bg-white text-black shadow-xs scale-105 border-2 border-black font-extrabold'
                    : 'bg-white text-black hover:border-slate-400 shadow-xs border border-slate-200'
                }`}
              >
                <span className="font-heading font-bold text-xs leading-none">05</span>
                <span className="text-[8px] opacity-75 mt-0.5">Atas</span>
              </button>

              {/* Seat 07 (Occupied) */}
              <div className="h-14 rounded-2xl bg-white bg-hatch-pattern text-slate-400 flex flex-col items-center justify-center cursor-not-allowed border border-slate-200">
                <span className="font-heading font-bold text-xs leading-none">07</span>
                <span className="text-[8px] opacity-75 mt-0.5">Bawah</span>
              </div>
            </div>

            {/* Central Corridor Aisle */}
            <div className="my-2 py-1 px-3 rounded-full bg-white border border-slate-200 flex items-center justify-between text-[9px] font-heading font-bold tracking-wider text-slate-600">
              <span>→</span>
              <span>LORONG TENGAH</span>
              <span>→</span>
            </div>

            {/* Bottom Row Seats (02, 04, 06, 08) */}
            <div className="grid grid-cols-4 gap-2">
              {/* Seat 02 (Occupied) */}
              <div className="h-14 rounded-2xl bg-white bg-hatch-pattern text-slate-400 flex flex-col items-center justify-center cursor-not-allowed border border-slate-200">
                <span className="font-heading font-bold text-xs leading-none">02</span>
                <span className="text-[8px] opacity-75 mt-0.5">Bawah</span>
              </div>

              {/* Seat 04 (Tersedia) */}
              <button
                onClick={() => handleSeatClick('04', 'tersedia')}
                className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  selectedSeatNumber === '04'
                    ? 'bg-white text-black shadow-xs scale-105 border-2 border-black font-extrabold'
                    : 'bg-white text-black hover:border-slate-400 shadow-xs border border-slate-200'
                }`}
              >
                <span className="font-heading font-bold text-xs leading-none">04</span>
                <span className="text-[8px] opacity-75 mt-0.5">Bawah</span>
              </button>

              {/* Seat 06 (Selected - White with Crisp 2px Black Border) */}
              <button
                onClick={() => handleSeatClick('06', 'tersedia')}
                className={`relative h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  selectedSeatNumber === '06'
                    ? 'bg-white text-black shadow-md border-2 border-black ring-2 ring-slate-200 scale-105 z-10 font-black'
                    : 'bg-white text-black hover:border-slate-400 shadow-xs border border-slate-200'
                }`}
              >
                {selectedSeatNumber === '06' && (
                  <span className="absolute -top-2 px-1.5 py-0.2 rounded-full bg-white text-black text-[8px] font-heading font-extrabold uppercase tracking-wide border border-black shadow-xs">
                    SAYA
                  </span>
                )}
                <span className="font-heading font-extrabold text-sm leading-none">
                  06
                </span>
                <span className="text-[8px] font-semibold mt-0.5">
                  BAWAH
                </span>
              </button>

              {/* Seat 08 (Occupied) */}
              <div className="h-14 rounded-2xl bg-white bg-hatch-pattern text-slate-400 flex flex-col items-center justify-center cursor-not-allowed border border-slate-200">
                <span className="font-heading font-bold text-xs leading-none">08</span>
                <span className="text-[8px] opacity-75 mt-0.5">Bawah</span>
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

      {/* 8. Fixed Bottom Booking Bar */}
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
            onClick={() => setShowPaymentSheet(true)}
            className="flex-1 py-3 px-4 rounded-full bg-white border-2 border-black hover:bg-slate-50 active:scale-95 text-black text-xs font-heading font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span>Lanjut Pembayaran</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Payment & Passenger Confirmation Modal */}
      {showPaymentSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border-t border-slate-200 rounded-t-3xl p-5 shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-black" />
                <h3 className="font-heading font-bold text-black text-base">
                  Konfirmasi Pembayaran
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentSheet(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

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
                  Penumpang 1
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

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-heading font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'gopay', name: 'GoPay', badge: 'Instan' },
                    { id: 'ovo', name: 'OVO', badge: 'Cashback' },
                    { id: 'bca', name: 'BCA Virtual Account', badge: 'Otomatis' },
                    { id: 'mandiri', name: 'Mandiri Livin', badge: 'Otomatis' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
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
                      <span className="text-[10px] text-slate-500 mt-1 font-medium">{method.badge}</span>
                    </button>
                  ))}
                </div>
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
                disabled={isProcessing}
                onClick={handleConfirmBooking}
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
                <span className="font-bold text-black block">Sinar Jaya Suite Class</span>
                <p className="text-slate-500 text-[11px]">
                  Konfigurasi pod tidur 1-1-1 individu dengan tirai privasi, monitor Android VOD 10 inci, bantal &amp; selimut higienis, serta port charger type-C.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="font-bold text-black block">Fasilitas Onboard</span>
                <p className="text-slate-500 text-[11px]">
                  Toilet ramah penumpang, dispenser air mineral gratis di bar belakang, dan WiFi satelit kecepatan tinggi sepanjang Tol Trans-Jawa.
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
