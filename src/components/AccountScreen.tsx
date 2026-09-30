import React, { useState } from 'react';
import { 
  Trophy, 
  Bus, 
  Ticket, 
  Tag, 
  ChevronRight, 
  CreditCard, 
  UserCheck, 
  Bell, 
  Headphones, 
  LogOut, 
  Receipt, 
  CheckCircle2, 
  X, 
  ArrowRight,
  Shield,
  MessageSquare,
  Sparkles,
  Percent
} from 'lucide-react';
import { INITIAL_USER, TRAVEL_HISTORY, TravelHistoryItem } from '../data/mockData';
import jasperAvatar from '../assets/images/jasper_avatar_1790661946230.jpg';

interface AccountScreenProps {
  onNavigateTab: (tab: 'jadwal' | 'kursi' | 'etiket' | 'akun') => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ onNavigateTab }) => {
  const [departureAlerts, setDepartureAlerts] = useState<boolean>(true);
  const [selectedReceipt, setSelectedReceipt] = useState<TravelHistoryItem | null>(null);
  const [showVouchersModal, setShowVouchersModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showPassengerModal, setShowPassengerModal] = useState<boolean>(false);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  // Vouchers
  const vouchers = [
    { code: 'TRANSJAWA25', discount: 'Diskon 25%', desc: 'Berlaku rute Jakarta - Surabaya / Solo', validUntil: '30 Sep 2025' },
    { code: 'SLEEPERPASS', discount: 'Potongan Rp 50.000', desc: 'Khusus pemesanan armada 1st Class Sleeper', validUntil: '15 Okt 2025' },
    { code: 'WEEKENDHEMAT', discount: 'Diskon 15%', desc: 'Semua rute antar provinsi hari Sabtu - Minggu', validUntil: '31 Des 2025' },
    { code: 'DAYTRANSVIP', discount: 'Cashback 20%', desc: 'Khusus armada shuttle Jawa Barat', validUntil: '20 Nov 2025' },
  ];

  return (
    <div className="pb-28 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* 1. Profile VIP Card */}
      <div className="p-4 rounded-3xl bg-[#141c15] border border-[#233025] shadow-xl space-y-3">
        <div className="flex items-center gap-3.5">
          {/* Avatar with verified green check badge */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#384c3b] p-0.5 bg-[#172018]">
              <img
                src={jasperAvatar}
                alt="Jasper Collins"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#bef237] rounded-full border-2 border-[#0b100c] flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0b100c]" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg text-white leading-tight truncate">
                {INITIAL_USER.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#202e22] border border-[#314634] text-[10px] font-heading font-bold text-[#bef237]">
                VIP
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#c4c9af] mt-0.5">
              <Trophy className="w-3.5 h-3.5 text-[#bef237]" />
              <span className="font-medium">{INITIAL_USER.tierTitle}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#bef237] font-heading font-semibold mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bef237]" />
              <span>{INITIAL_USER.milesPoints.toLocaleString('id-ID')} Poin Miles</span>
            </div>
          </div>
        </div>

        {/* Tier Goal Progress Bar */}
        <div className="pt-2 border-t border-[#202b21] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-heading font-bold">
            <span className="text-[#8e9b90] tracking-wider">
              MENUJU {INITIAL_USER.tierGoalName}
            </span>
            <span className="text-[#bef237]">
              {INITIAL_USER.milesPoints.toLocaleString('id-ID')} / {INITIAL_USER.milesGoal.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Progress bar track */}
          <div className="w-full h-2 rounded-full bg-[#1e2a20] overflow-hidden">
            <div
              className="h-full bg-[#bef237] rounded-full shadow-[0_0_10px_rgba(190,242,55,0.4)]"
              style={{
                width: `${(INITIAL_USER.milesPoints / INITIAL_USER.milesGoal) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Stats Summary Row (3 Columns) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Stat 1: Trips Completed */}
        <div className="p-3 rounded-2xl bg-[#141c15] border border-[#233025] flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full bg-[#1b251c] border border-[#2d3d2e] flex items-center justify-center text-[#bef237] mb-1">
            <Bus className="w-4 h-4" />
          </div>
          <span className="font-heading font-extrabold text-lg text-white leading-tight">
            {INITIAL_USER.stats.tripsCompleted}
          </span>
          <span className="text-[10px] text-[#8e9b90] mt-0.5">
            Perjalanan Selesai
          </span>
        </div>

        {/* Stat 2: Active Tickets */}
        <div
          onClick={() => onNavigateTab('etiket')}
          className="p-3 rounded-2xl bg-[#172219] border border-[#2e4031] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#bef237]/40 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-[#bef237] flex items-center justify-center text-black mb-1 group-hover:scale-105 transition-transform">
            <Ticket className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-heading font-extrabold text-lg text-[#bef237] leading-tight">
            {INITIAL_USER.stats.activeTickets}
          </span>
          <span className="text-[10px] text-white font-medium mt-0.5">
            Tiket Aktif
          </span>
        </div>

        {/* Stat 3: Discount Vouchers */}
        <div
          onClick={() => setShowVouchersModal(true)}
          className="p-3 rounded-2xl bg-[#141c15] border border-[#233025] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#bef237]/30 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-[#1b251c] border border-[#2d3d2e] flex items-center justify-center text-[#bef237] mb-1 group-hover:scale-105 transition-transform">
            <Tag className="w-4 h-4" />
          </div>
          <span className="font-heading font-extrabold text-lg text-white leading-tight">
            {INITIAL_USER.stats.discountVouchers}
          </span>
          <span className="text-[10px] text-[#8e9b90] mt-0.5">
            Voucher Diskon
          </span>
        </div>
      </div>

      {/* 3. Riwayat Perjalanan (Travel History) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <h3 className="font-heading font-bold text-base text-white">
            Riwayat Perjalanan
          </h3>
          <button
            onClick={() => setSelectedReceipt(TRAVEL_HISTORY[0])}
            className="flex items-center gap-1 text-[#bef237] font-heading font-semibold hover:underline"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* History Cards */}
        <div className="space-y-3">
          {TRAVEL_HISTORY.map((hist) => (
            <div
              key={hist.id}
              className="p-4 rounded-3xl bg-[#141c15] border border-[#233025] shadow-md space-y-2.5"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#8e9b90]">
                  <span className="text-white font-medium">{hist.date}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1f2b20] border border-[#314634] text-[10px] font-heading font-bold text-[#bef237]">
                  {hist.status}
                </span>
              </div>

              {/* Transit Details */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="font-heading font-bold text-base text-white">
                    {hist.fromCity}
                  </h4>
                  <span className="text-[11px] text-[#8e9b90]">
                    {hist.fromPoint}
                  </span>
                </div>

                <div className="flex flex-col items-center px-2">
                  <span className="text-[10px] text-[#bef237] font-heading font-semibold">
                    {hist.duration}
                  </span>
                  <div className="flex items-center gap-1 my-0.5 text-xs text-[#bef237]">
                    <span>→</span>
                  </div>
                  <span className="text-[10px] text-[#8e9b90]">
                    {hist.operator}
                  </span>
                </div>

                <div className="text-right">
                  <h4 className="font-heading font-bold text-base text-white">
                    {hist.toCity}
                  </h4>
                  <span className="text-[11px] text-[#8e9b90]">
                    {hist.toPoint}
                  </span>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="pt-2 border-t border-[#1f2b21] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#bef237]">
                  <Bus className="w-3.5 h-3.5" />
                  <span className="font-heading font-semibold">Kursi {hist.seat}</span>
                </div>

                <button
                  onClick={() => setSelectedReceipt(hist)}
                  className="flex items-center gap-1.5 text-neutral-300 hover:text-[#bef237] transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-heading font-medium">E-Tiket &amp; Struk</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Pengaturan & Preferensi */}
      <div className="space-y-2 pt-2">
        <h3 className="font-heading font-bold text-base text-white">
          Pengaturan &amp; Preferensi
        </h3>

        <div className="space-y-2">
          {/* Setting 1: Payment Methods */}
          <div
            onClick={() => setShowPaymentModal(true)}
            className="p-3.5 rounded-2xl bg-[#141c15] border border-[#233025] flex items-center justify-between cursor-pointer hover:border-[#bef237]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1c271e] border border-[#2e3f30] flex items-center justify-center text-[#bef237]">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-white">
                  Metode Pembayaran
                </h4>
                <p className="text-[11px] text-[#8e9b90] mt-0.5">
                  GoPay, OVO &amp; 2 Virtual Account
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8e9b90]" />
          </div>

          {/* Setting 2: Fast Passenger Data */}
          <div
            onClick={() => setShowPassengerModal(true)}
            className="p-3.5 rounded-2xl bg-[#141c15] border border-[#233025] flex items-center justify-between cursor-pointer hover:border-[#bef237]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1c271e] border border-[#2e3f30] flex items-center justify-center text-[#bef237]">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-white">
                  Data Penumpang Cepat
                </h4>
                <p className="text-[11px] text-[#8e9b90] mt-0.5">
                  1 NIK KTP Terverifikasi
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8e9b90]" />
          </div>

          {/* Setting 3: Departure Reminder Switch */}
          <div className="p-3.5 rounded-2xl bg-[#141c15] border border-[#233025] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1c271e] border border-[#2e3f30] flex items-center justify-center text-[#bef237]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-white">
                  Pengingat Keberangkatan
                </h4>
                <p className="text-[11px] text-[#8e9b90] mt-0.5">
                  Alert H-2 jam dan update gate
                </p>
              </div>
            </div>

            <button
              onClick={() => setDepartureAlerts(!departureAlerts)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                departureAlerts ? 'bg-[#bef237]' : 'bg-[#253327]'
              }`}
              aria-label="Toggle Pengingat"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[#0b100c] transition-transform ${
                  departureAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Setting 4: 24/7 Support Center */}
          <div
            onClick={() => setShowSupportModal(true)}
            className="p-3.5 rounded-2xl bg-[#141c15] border border-[#233025] flex items-center justify-between cursor-pointer hover:border-[#bef237]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1c271e] border border-[#2e3f30] flex items-center justify-center text-[#bef237]">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-white">
                  Pusat Bantuan 24/7
                </h4>
                <p className="text-[11px] text-[#8e9b90] mt-0.5">
                  Live chat &amp; CS Terminal Bus terdekat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-[#bef237] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bef237]" />
                Online
              </span>
              <ChevronRight className="w-4 h-4 text-[#8e9b90]" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Keluar Akun CTA */}
      <div className="pt-2">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-3.5 rounded-2xl bg-[#172018] hover:bg-[#202c21] border border-[#273629] text-white text-xs font-heading font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[#ff7d70]" />
          <span>Keluar Akun</span>
        </button>
      </div>

      {/* Historical Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#131b14] border border-[#273629] rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#212c22]">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#bef237]" />
                <h3 className="font-heading font-bold text-white text-base">
                  Struk Pembelian Bus
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-white text-black space-y-2">
                <div className="text-center font-bold pb-2 border-b border-dashed border-gray-300">
                  BUKTI TRANSAKSI OMNIBUS
                </div>
                <div className="flex justify-between">
                  <span>Operator:</span>
                  <strong>{selectedReceipt.operator}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal:</span>
                  <span>{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rute:</span>
                  <span>{selectedReceipt.fromCity} → {selectedReceipt.toCity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nomor Kursi:</span>
                  <strong>{selectedReceipt.seat}</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-dashed border-gray-300">
                  <span>Status:</span>
                  <strong className="text-green-700">LUNAS &amp; SELESAI</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-[#bef237] text-black text-xs font-heading font-bold"
            >
              Tutup Struk
            </button>
          </div>
        </div>
      )}

      {/* Vouchers Modal */}
      {showVouchersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#131b14] border border-[#273629] rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#212c22]">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#bef237]" />
                <h3 className="font-heading font-bold text-white text-base">
                  Voucher Diskon Tersedia
                </h3>
              </div>
              <button
                onClick={() => setShowVouchersModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2.5 max-h-[340px] overflow-y-auto">
              {vouchers.map((v, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-[#172118] border border-[#29392b] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#bef237] text-black font-heading font-bold text-[10px]">
                      {v.code}
                    </span>
                    <span className="font-heading font-bold text-xs text-[#bef237]">
                      {v.discount}
                    </span>
                  </div>
                  <p className="text-[11px] text-white pt-1">{v.desc}</p>
                  <p className="text-[10px] text-[#8e9b90]">Berlaku s/d {v.validUntil}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowVouchersModal(false)}
              className="w-full mt-2 py-2.5 rounded-xl bg-[#bef237] text-black text-xs font-heading font-bold"
            >
              Gunakan Saat Pemesanan
            </button>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#131b14] border border-[#273629] rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#212c22]">
              <h3 className="font-heading font-bold text-white text-base">
                Metode Pembayaran
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#172118] border border-[#29392b] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">GoPay</span>
                  <span className="text-[10px] text-[#8e9b90]">0812-9844-8891 (Terhubung)</span>
                </div>
                <span className="text-[#bef237] font-semibold text-[11px]">Utama</span>
              </div>
              <div className="p-3 rounded-xl bg-[#172118] border border-[#29392b] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">OVO Cash</span>
                  <span className="text-[10px] text-[#8e9b90]">0812-9844-8891</span>
                </div>
                <span className="text-[#8e9b90] text-[11px]">Terhubung</span>
              </div>
              <div className="p-3 rounded-xl bg-[#172118] border border-[#29392b] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">BCA Virtual Account</span>
                  <span className="text-[10px] text-[#8e9b90]">Auto-Debit Terverifikasi</span>
                </div>
                <span className="text-[#8e9b90] text-[11px]">Aktif</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#bef237] text-black text-xs font-heading font-bold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Passenger Verification Modal */}
      {showPassengerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#131b14] border border-[#273629] rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#212c22]">
              <h3 className="font-heading font-bold text-white text-base">
                Data Penumpang KTP
              </h3>
              <button
                onClick={() => setShowPassengerModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 text-xs space-y-2.5">
              <div className="p-3 rounded-xl bg-[#172118] border border-[#29392b] space-y-1">
                <span className="text-[#8e9b90] text-[10px] uppercase">Nama Lengkap Sesuai KTP</span>
                <p className="font-bold text-white text-sm">Jasper McAllister Collins</p>
              </div>
              <div className="p-3 rounded-xl bg-[#172118] border border-[#29392b] space-y-1">
                <span className="text-[#8e9b90] text-[10px] uppercase">Nomor Induk Kependudukan (NIK)</span>
                <p className="font-mono text-white text-sm">3171048809930008</p>
                <div className="flex items-center gap-1 text-[#bef237] text-[10px] font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kependudukan Dukcapil Terverifikasi</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPassengerModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#bef237] text-black text-xs font-heading font-bold"
            >
              Simpan Data
            </button>
          </div>
        </div>
      )}

      {/* Support Live Chat Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#131b14] border border-[#273629] rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#212c22]">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-[#bef237]" />
                <h3 className="font-heading font-bold text-white text-base">
                  Pusat Bantuan 24/7
                </h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 text-xs space-y-2">
              <div className="p-3 rounded-xl bg-[#172118] border border-[#29392b] space-y-1">
                <span className="font-bold text-white block">Petugas Terminal Pulo Gebang</span>
                <p className="text-[#8e9b90] text-[11px]">
                  Hotline WhatsApp Dispatcher: +62 821-4400-9988
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#172118] border border-[#29392b] space-y-1">
                <span className="font-bold text-white block">Customer Service OmniBus</span>
                <p className="text-[#8e9b90] text-[11px]">
                  Bantuan refund keterlambatan, pergantian jam keberangkatan, atau kendala tiket.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#bef237] text-black text-xs font-heading font-bold"
            >
              Hubungi CS via Live Chat
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs bg-[#131b14] border border-[#273629] rounded-3xl p-5 shadow-2xl text-center space-y-3">
            <LogOut className="w-8 h-8 text-[#ff7d70] mx-auto" />
            <h4 className="font-heading font-bold text-white text-base">
              Keluar dari Akun?
            </h4>
            <p className="text-xs text-[#8e9b90]">
              Anda dapat masuk kembali kapan saja untuk mengakses e-tiket aktif dan poin miles.
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#172118] text-white text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#ff7d70] text-black text-xs font-bold"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
