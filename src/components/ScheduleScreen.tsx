import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Calendar, 
  SlidersHorizontal, 
  Zap, 
  MapPin, 
  Disc, 
  Armchair, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  Bus as BusIcon,
  X,
  Check
} from 'lucide-react';
import { BusSchedule, BUS_SCHEDULES } from '../data/mockData';
import jasperAvatar from '../assets/images/jasper_avatar_1790661946230.jpg';

interface ScheduleScreenProps {
  onSelectBus: (bus: BusSchedule) => void;
  onNavigateTab: (tab: 'jadwal' | 'kursi' | 'etiket' | 'akun') => void;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  onSelectBus,
  onNavigateTab,
}) => {
  const [tripType, setTripType] = useState<'sekali' | 'pulang_pergi' | 'riwayat'>('sekali');
  const [origin, setOrigin] = useState('Terminal Pulo Gebang, Jakarta');
  const [destination, setDestination] = useState('Terminal Giwangan, Yogyakarta');
  const [isSwapping, setIsSwapping] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(2); // default JUM 22 Agu
  const [filterType, setFilterType] = useState<'tercepat' | 'termurah' | 'semua'>('tercepat');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showGuaranteeModal, setShowGuaranteeModal] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string[]>(['Executive', 'Sleeper', 'Suite']);

  // Swap animation & logic
  const handleSwapStations = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setOrigin(destination);
      setDestination(origin);
      setIsSwapping(false);
    }, 200);
  };

  const dates = [
    { dayName: 'RAB', dayNum: '20', month: 'Agu' },
    { dayName: 'KAM', dayNum: '21', month: 'Agu' },
    { dayName: 'JUM', dayNum: '22', month: 'Agu' },
    { dayName: 'SAB', dayNum: '23', month: 'Agu' },
    { dayName: 'MIN', dayNum: '24', month: 'Agu' },
    { dayName: 'SEN', dayNum: '25', month: 'Agu' },
    { dayName: 'SEL', dayNum: '26', month: 'Agu' },
  ];

  // Filtered schedules
  const sortedSchedules = [...BUS_SCHEDULES].sort((a, b) => {
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
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* 1. Header Greeting & Fast Lane */}
      <div className="flex items-center justify-between pt-1">
        <div 
          onClick={() => onNavigateTab('akun')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#3b4b3d] p-0.5 bg-[#172018]">
              <img
                src={jasperAvatar}
                alt="Jasper Collins"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#bef237] rounded-full border-2 border-[#0b100c]" />
          </div>
          <div>
            <p className="text-xs text-[#8e9b90] font-medium">Halo Penglaju!</p>
            <h2 className="font-heading font-bold text-white text-base leading-tight group-hover:text-[#bef237] transition-colors">
              Jasper Collins
            </h2>
          </div>
        </div>

        {/* FAST LANE Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b261d] border border-[#2e4031] text-[#bef237] text-xs font-heading font-bold shadow-[0_0_12px_rgba(190,242,55,0.15)]">
          <Zap className="w-3.5 h-3.5 fill-[#bef237]" />
          <span>FAST LANE</span>
        </div>
      </div>

      {/* 2. Main Title & Antarkota Badge */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="font-heading font-bold text-2xl tracking-tight text-white">
          Pesan Tiket Bus
        </h1>
        <span className="px-2.5 py-1 rounded-full bg-[#182119] border border-[#2b3a2d] text-[10px] font-heading font-bold tracking-wider text-[#a0ad9f]">
          ANTARKOTA
        </span>
      </div>

      {/* 3. Trip Type Selector Segmented Pill */}
      <div className="flex items-center p-1 rounded-full bg-[#141b15] border border-[#222e23]">
        <button
          onClick={() => setTripType('sekali')}
          className={`flex-1 py-2 rounded-full text-xs font-heading font-bold transition-all ${
            tripType === 'sekali'
              ? 'bg-[#bef237] text-[#0b100c] shadow-[0_2px_12px_rgba(190,242,55,0.25)]'
              : 'text-[#8e9b90] hover:text-white'
          }`}
        >
          Sekali Jalan
        </button>
        <button
          onClick={() => setTripType('pulang_pergi')}
          className={`flex-1 py-2 rounded-full text-xs font-heading font-bold transition-all ${
            tripType === 'pulang_pergi'
              ? 'bg-[#bef237] text-[#0b100c] shadow-[0_2px_12px_rgba(190,242,55,0.25)]'
              : 'text-[#8e9b90] hover:text-white'
          }`}
        >
          Pulang Pergi
        </button>
        <button
          onClick={() => {
            setTripType('riwayat');
            onNavigateTab('akun');
          }}
          className={`flex-1 py-2 rounded-full text-xs font-heading font-bold transition-all ${
            tripType === 'riwayat'
              ? 'bg-[#bef237] text-[#0b100c] shadow-[0_2px_12px_rgba(190,242,55,0.25)]'
              : 'text-[#8e9b90] hover:text-white'
          }`}
        >
          Riwayat
        </button>
      </div>

      {/* 4. Origin & Destination Card */}
      <div className="relative p-4 rounded-3xl bg-[#141c15] border border-[#253327] shadow-xl">
        {/* Origin Row */}
        <div className="flex items-start gap-3 pb-3 border-b border-[#212c22]">
          <div className="w-8 h-8 rounded-full bg-[#1d271e] border border-[#304132] flex items-center justify-center shrink-0 mt-0.5">
            <Disc className="w-4 h-4 text-[#bef237] stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <span className="block text-[10px] font-heading font-bold text-[#8e9b90] tracking-wider">
              DARI (KEBERANGKATAN)
            </span>
            <p className="font-heading font-bold text-sm text-white truncate mt-0.5">
              {origin}
            </p>
          </div>
        </div>

        {/* Swap Button Floating on Right */}
        <button
          onClick={handleSwapStations}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#202c21] border border-[#384c3b] flex items-center justify-center text-[#bef237] hover:scale-105 active:scale-95 transition-all shadow-lg z-10 ${
            isSwapping ? 'rotate-180 duration-200' : ''
          }`}
          aria-label="Tukar rute perjalanan"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>

        {/* Destination Row */}
        <div className="flex items-start gap-3 pt-3">
          <div className="w-8 h-8 rounded-full bg-[#1d271e] border border-[#304132] flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-[#bef237]" />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <span className="block text-[10px] font-heading font-bold text-[#8e9b90] tracking-wider">
              KE (TUJUAN AKHIR)
            </span>
            <p className="font-heading font-bold text-sm text-white truncate mt-0.5">
              {destination}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Date Selection Carousel */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-white font-heading font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#bef237]" />
            <span>Pilih Tanggal</span>
          </div>
          <span className="text-[11px] font-heading font-bold text-[#8e9b90]">
            Agustus 2025
          </span>
        </div>

        {/* Horizontal Date Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {dates.map((item, index) => {
            const isSelected = selectedDateIndex === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedDateIndex(index)}
                className={`flex flex-col items-center justify-center min-w-[58px] py-3 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-[#bef237] text-[#0b100c] border-[#bef237] shadow-[0_4px_16px_rgba(190,242,55,0.3)] scale-[1.03]'
                    : 'bg-[#151c16] text-[#8e9b90] border-[#222e23] hover:border-[#38493a] hover:text-white'
                }`}
              >
                <span className={`text-[10px] font-heading font-bold uppercase ${
                  isSelected ? 'text-[#1b2b15]' : 'text-[#8e9b90]'
                }`}>
                  {item.dayName}
                </span>
                <span className={`text-base font-heading font-bold leading-tight mt-0.5 ${
                  isSelected ? 'text-[#0b100c]' : 'text-white'
                }`}>
                  {item.dayNum}
                </span>
                <span className={`text-[10px] font-medium mt-0.5 ${
                  isSelected ? 'text-[#2b3a24]' : 'text-[#8e9b90]'
                }`}>
                  {item.month}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0b100c] mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Filter Chips */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setFilterType('tercepat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold border transition-colors ${
            filterType === 'tercepat'
              ? 'bg-[#1a251b] border-[#bef237] text-[#bef237]'
              : 'bg-[#141b15] border-[#222e23] text-[#8e9b90]'
          }`}
        >
          <Zap className="w-3 h-3 fill-current" />
          <span>Bus Tercepat</span>
        </button>

        <button
          onClick={() => setFilterType('termurah')}
          className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold border transition-colors ${
            filterType === 'termurah'
              ? 'bg-[#1a251b] border-[#bef237] text-[#bef237]'
              : 'bg-[#141b15] border-[#222e23] text-[#8e9b90]'
          }`}
        >
          Termurah
        </button>

        <button
          onClick={() => setShowFilterModal(true)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold bg-[#141b15] border border-[#222e23] text-[#c4c9af] hover:border-[#bef237]/40"
        >
          <SlidersHorizontal className="w-3 h-3 text-[#bef237]" />
          <span>Filter</span>
        </button>
      </div>

      {/* 7. Bus Schedule Cards List */}
      <div className="space-y-3 pt-1">
        {sortedSchedules.map((bus) => (
          <div
            key={bus.id}
            className="p-4 rounded-3xl bg-[#141c15] border border-[#233025] hover:border-[#bef237]/30 transition-all shadow-lg group"
          >
            {/* Operator Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-base text-white">
                    {bus.operator}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-[#1e2a20] border border-[#314333] text-[10px] font-heading font-bold text-[#bef237]">
                    {bus.busCode}
                  </span>
                </div>
                <p className="text-xs text-[#8e9b90] mt-0.5">
                  {bus.seatConfig}
                </p>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[#1b241c] border border-[#2c3a2e] text-[10px] font-heading font-medium text-[#c4c9af]">
                {bus.serviceTier}
              </span>
            </div>

            {/* Departure -> Duration & Route -> Arrival */}
            <div className="flex items-center justify-between py-3 my-2 border-y border-[#1d271e]">
              {/* Departure */}
              <div>
                <span className="font-heading font-bold text-lg text-white block">
                  {bus.departureTime}
                </span>
                <span className="text-[11px] text-[#8e9b90]">
                  {bus.departureCity}
                </span>
              </div>

              {/* Transit Timeline Indicator */}
              <div className="flex-1 px-3 flex flex-col items-center text-center">
                <div className="flex items-center gap-1 text-[11px] text-[#bef237] font-heading font-semibold">
                  <span>{bus.duration}</span>
                  <BusIcon className="w-3.5 h-3.5" />
                </div>
                {/* Horizontal dotted line with bus dot */}
                <div className="w-full relative my-1 flex items-center justify-center">
                  <div className="w-full h-[1.5px] bg-[#273428]" />
                  <span className="absolute w-2 h-2 rounded-full bg-[#bef237] border border-[#0b100c]" />
                </div>
                <span className="text-[10px] text-[#8e9b90] truncate max-w-[140px]">
                  {bus.routeHighlight}
                </span>
              </div>

              {/* Arrival */}
              <div className="text-right">
                <span className="font-heading font-bold text-lg text-white block">
                  {bus.arrivalTime}
                </span>
                <span className="text-[11px] text-[#8e9b90]">
                  {bus.arrivalCity}
                </span>
              </div>
            </div>

            {/* Bottom Row: Remaining Seats, Price, Button */}
            <div className="flex items-center justify-between pt-1">
              {/* Seat Warning */}
              <div className="flex items-center gap-1.5 text-xs">
                {bus.urgentWarning ? (
                  <div className="flex items-center gap-1 text-[#ff7d70] font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{bus.availableSeats} Kursi Tersisa</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[#bef237] font-medium">
                    <Armchair className="w-3.5 h-3.5" />
                    <span>{bus.availableSeats} Kursi Tersisa</span>
                  </div>
                )}
              </div>

              {/* Price & Action */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-heading font-bold text-base text-[#bef237]">
                    {formatRupiah(bus.pricePerSeat)}
                  </span>
                  <span className="text-[10px] text-[#8e9b90] block -mt-0.5">
                    /kursi
                  </span>
                </div>

                <button
                  onClick={() => onSelectBus(bus)}
                  className="px-4 py-1.5 rounded-full bg-[#bef237] hover:bg-[#bef237]/90 active:scale-95 text-[#0b100c] text-xs font-heading font-bold shadow-[0_2px_12px_rgba(190,242,55,0.25)] transition-all cursor-pointer"
                >
                  Pilih
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 8. Jaminan Perjalanan Aman Card */}
      <div 
        onClick={() => setShowGuaranteeModal(true)}
        className="p-3.5 rounded-2xl bg-[#141c15] border border-[#233025] flex items-center justify-between cursor-pointer hover:border-[#bef237]/30 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1c271e] border border-[#2e3f30] flex items-center justify-center text-[#bef237]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-xs text-white">
              Jaminan Perjalanan Aman
            </h4>
            <p className="text-[11px] text-[#8e9b90] mt-0.5">
              100% refund bila bus terlambat &gt; 60m
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#8e9b90] group-hover:text-[#bef237] transition-colors" />
      </div>

      {/* Guarantee Details Modal */}
      {showGuaranteeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#131b14] border border-[#263528] rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#212c22]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#bef237]" />
                <h3 className="font-heading font-bold text-white text-base">
                  Garansi Tepat Waktu
                </h3>
              </div>
              <button 
                onClick={() => setShowGuaranteeModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="py-3 text-xs text-neutral-300 space-y-2.5">
              <p>
                Komitmen kenyamanan maksimal bagi setiap penumpang OmniBus:
              </p>
              <div className="p-3 rounded-xl bg-[#182219] border border-[#29382b] space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Check className="w-4 h-4 text-[#bef237]" />
                  <span>Kompensasi Keterlambatan &gt; 60 Menit</span>
                </div>
                <p className="text-[11px] text-[#8e9b90]">
                  Pengembalian 100% biaya tiket dalam bentuk saldo refund instan ke e-wallet.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#182219] border border-[#29382b] space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Check className="w-4 h-4 text-[#bef237]" />
                  <span>Asuransi Jasa Raharja Termasuk</span>
                </div>
                <p className="text-[11px] text-[#8e9b90]">
                  Semua penumpang terlindungi penuh selama perjalanan antarkota berlangsung.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGuaranteeModal(false)}
              className="w-full mt-2 py-2.5 rounded-xl bg-[#bef237] text-[#0b100c] text-xs font-bold font-heading hover:bg-[#bef237]/90"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#131b14] border border-[#263528] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#212c22]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#bef237]" />
                <h3 className="font-heading font-bold text-white text-base">
                  Filter Bus
                </h3>
              </div>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="text-xs font-heading font-bold text-[#8e9b90] uppercase tracking-wider block mb-2">
                  Kelas Layanan
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Executive', 'Sleeper', 'Suite', 'Double Decker'].map((cls) => {
                    const active = selectedClassFilter.includes(cls);
                    return (
                      <button
                        key={cls}
                        onClick={() => {
                          if (active) {
                            setSelectedClassFilter(selectedClassFilter.filter((c) => c !== cls));
                          } else {
                            setSelectedClassFilter([...selectedClassFilter, cls]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium border transition-colors ${
                          active
                            ? 'bg-[#bef237] text-black border-[#bef237] font-bold'
                            : 'bg-[#182219] text-[#8e9b90] border-[#29382b]'
                        }`}
                      >
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[#8e9b90] uppercase tracking-wider block mb-2">
                  Waktu Keberangkatan
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#182219] border border-[#29382b] flex items-center justify-between">
                    <span>Pagi (06:00 - 12:00)</span>
                    <span className="w-2 h-2 rounded-full bg-[#bef237]" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#182219] border border-[#29382b] flex items-center justify-between">
                    <span>Malam (18:00 - 24:00)</span>
                    <span className="w-2 h-2 rounded-full bg-[#bef237]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#212c22] flex gap-2">
              <button
                onClick={() => {
                  setSelectedClassFilter(['Executive', 'Sleeper', 'Suite']);
                  setShowFilterModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#1b251d] text-white text-xs font-heading font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#bef237] text-black text-xs font-heading font-bold shadow-[0_2px_10px_rgba(190,242,55,0.3)]"
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
