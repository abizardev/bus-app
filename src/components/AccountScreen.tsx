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
  User
} from 'lucide-react';
import { INITIAL_USER, TRAVEL_HISTORY, TravelHistoryItem } from '../data/mockData';

interface AccountScreenProps {
  onNavigateTab: (tab: 'jadwal' | 'kursi' | 'etiket' | 'akun') => void;
  isLoggedIn?: boolean;
  ticketCount?: number;
  loginNotice?: string | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  onNavigateTab,
  isLoggedIn = true,
  ticketCount = 0,
  loginNotice = null,
  onLogin,
  onLogout,
}) => {
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
    <div className="pb-28 pt-3 px-4 max-w-md mx-auto space-y-4">
      {loginNotice && (
        <p role="alert" data-testid="login-notice" className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[12px] text-amber-800">
          {loginNotice} Silakan masuk / daftar akun dulu.
        </p>
      )}
      {!isLoggedIn && (
        <div data-testid="logged-out-state" className="p-4 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-2">
          <p className="font-heading font-bold text-base text-black">Kamu belum login</p>
          <p className="text-xs text-slate-500">E-tiket butuh akun. Masuk untuk menerbitkan & melihat tiket.</p>
          <button
            data-testid="login-button"
            onClick={() => onLogin?.()}
            className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-heading font-bold cursor-pointer"
          >
            Masuk / Daftar (Dummy)
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 text-xs" data-testid="account-ticket-count">
        <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-300 font-bold text-black">
          {isLoggedIn ? `Login • ${ticketCount} e-tiket di database` : 'Logged out • 0 e-tiket terlihat'}
        </span>
      </div>
      {/* 1. Profile VIP Card (Pure White with Crisp Black Border) */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-3.5">
          {/* Avatar Icon */}
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-300 flex items-center justify-center text-black shadow-xs">
            <User className="w-7 h-7 text-black" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg text-black leading-tight truncate">
                {INITIAL_USER.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-white border border-slate-300 text-[10px] font-heading font-bold text-black">
                VIP
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <Trophy className="w-3.5 h-3.5 text-black" />
              <span className="font-medium text-slate-700">{INITIAL_USER.tierTitle}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-black font-heading font-bold mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span>{INITIAL_USER.milesPoints.toLocaleString('id-ID')} Poin Miles</span>
            </div>
          </div>
        </div>

        {/* Tier Goal Progress Bar */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-heading font-bold">
            <span className="text-slate-400 tracking-wider">
              MENUJU {INITIAL_USER.tierGoalName}
            </span>
            <span className="text-black">
              {INITIAL_USER.milesPoints.toLocaleString('id-ID')} / {INITIAL_USER.milesGoal.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Progress bar track */}
          <div className="w-full h-2 rounded-full bg-white border border-slate-200 overflow-hidden">
            <div
              className="h-full bg-black rounded-full"
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
        <div className="p-3 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center text-black mb-1">
            <Bus className="w-4 h-4" />
          </div>
          <span className="font-heading font-extrabold text-lg text-black leading-tight">
            {INITIAL_USER.stats.tripsCompleted}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            Perjalanan Selesai
          </span>
        </div>

        {/* Stat 2: Active Tickets */}
        <div
          onClick={() => onNavigateTab('etiket')}
          className="p-3 rounded-2xl bg-white border-2 border-black flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors group shadow-xs"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-black flex items-center justify-center text-black mb-1 group-hover:scale-105 transition-transform">
            <Ticket className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-heading font-extrabold text-lg text-black leading-tight">
            {INITIAL_USER.stats.activeTickets}
          </span>
          <span className="text-[10px] text-black font-semibold mt-0.5">
            Tiket Aktif
          </span>
        </div>

        {/* Stat 3: Discount Vouchers */}
        <div
          onClick={() => setShowVouchersModal(true)}
          className="p-3 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black transition-colors group shadow-xs"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center text-black mb-1 group-hover:scale-105 transition-transform">
            <Tag className="w-4 h-4" />
          </div>
          <span className="font-heading font-extrabold text-lg text-black leading-tight">
            {INITIAL_USER.stats.discountVouchers}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            Voucher Diskon
          </span>
        </div>
      </div>

      {/* 3. Riwayat Perjalanan (Travel History) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <h3 className="font-heading font-bold text-base text-black">
            Riwayat Perjalanan
          </h3>
          <button
            onClick={() => setSelectedReceipt(TRAVEL_HISTORY[0])}
            className="flex items-center gap-1 text-black font-heading font-semibold hover:underline cursor-pointer"
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
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-black font-medium">{hist.date}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-300 text-[10px] font-heading font-bold text-black">
                  {hist.status}
                </span>
              </div>

              {/* Transit Details */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="font-heading font-bold text-base text-black">
                    {hist.fromCity}
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {hist.fromPoint}
                  </span>
                </div>

                <div className="flex flex-col items-center px-2">
                  <span className="text-[10px] text-black font-heading font-semibold">
                    {hist.duration}
                  </span>
                  <div className="flex items-center gap-1 my-0.5 text-xs text-black">
                    <span>→</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {hist.operator}
                  </span>
                </div>

                <div className="text-right">
                  <h4 className="font-heading font-bold text-base text-black">
                    {hist.toCity}
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {hist.toPoint}
                  </span>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-black">
                  <Bus className="w-3.5 h-3.5" />
                  <span className="font-heading font-semibold">Kursi {hist.seat}</span>
                </div>

                <button
                  onClick={() => setSelectedReceipt(hist)}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-black transition-colors cursor-pointer"
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
        <h3 className="font-heading font-bold text-base text-black">
          Pengaturan &amp; Preferensi
        </h3>

        <div className="space-y-2">
          {/* Setting 1: Payment Methods */}
          <div
            onClick={() => setShowPaymentModal(true)}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between cursor-pointer hover:border-black transition-colors shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-black">
                  Metode Pembayaran
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  GoPay, OVO &amp; 2 Virtual Account
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Setting 2: Fast Passenger Data */}
          <div
            onClick={() => setShowPassengerModal(true)}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between cursor-pointer hover:border-black transition-colors shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-black">
                  Data Penumpang Cepat
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  1 NIK KTP Terverifikasi
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Setting 3: Departure Reminder Switch */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-black">
                  Pengingat Keberangkatan
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Alert H-2 jam dan update gate
                </p>
              </div>
            </div>

            <button
              onClick={() => setDepartureAlerts(!departureAlerts)}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer border ${
                departureAlerts ? 'bg-white border-black' : 'bg-white border-slate-300'
              }`}
              aria-label="Toggle Pengingat"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full border transition-transform ${
                  departureAlerts ? 'translate-x-6 bg-black border-black' : 'translate-x-0 bg-slate-300 border-slate-300'
                }`}
              />
            </button>
          </div>

          {/* Setting 4: 24/7 Support Center */}
          <div
            onClick={() => setShowSupportModal(true)}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between cursor-pointer hover:border-black transition-colors shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-black">
                  Pusat Bantuan 24/7
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Live chat &amp; CS Terminal Bus terdekat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-black font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                Online
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Keluar Akun CTA */}
      <div className="pt-2">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-3.5 rounded-2xl bg-white hover:border-black border border-slate-200 text-black text-xs font-heading font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <LogOut className="w-4 h-4 text-black" />
          <span>Keluar Akun</span>
        </button>
      </div>

      {/* Historical Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-black" />
                <h3 className="font-heading font-bold text-black text-base">
                  Struk Pembelian Bus
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-white text-black space-y-2 border border-slate-200 shadow-xs">
                <div className="text-center font-bold pb-2 border-b border-dashed border-slate-300">
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
                <div className="flex justify-between pt-2 border-t border-dashed border-slate-300">
                  <span>Status:</span>
                  <strong className="text-black">LUNAS &amp; SELESAI</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:border-black text-black text-xs font-heading font-bold shadow-xs cursor-pointer"
            >
              Tutup Struk
            </button>
          </div>
        </div>
      )}

      {/* Vouchers Modal */}
      {showVouchersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-black" />
                <h3 className="font-heading font-bold text-black text-base">
                  Voucher Diskon Tersedia
                </h3>
              </div>
              <button
                onClick={() => setShowVouchersModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2.5 max-h-[340px] overflow-y-auto">
              {vouchers.map((v, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-white border border-black text-black font-heading font-bold text-[10px]">
                      {v.code}
                    </span>
                    <span className="font-heading font-bold text-xs text-black">
                      {v.discount}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 pt-1">{v.desc}</p>
                  <p className="text-[10px] text-slate-400">Berlaku s/d {v.validUntil}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowVouchersModal(false)}
              className="w-full mt-2 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-black text-black text-xs font-heading font-bold shadow-xs cursor-pointer"
            >
              Gunakan Saat Pemesanan
            </button>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-black text-base">
                Metode Pembayaran
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="font-bold text-black block">GoPay</span>
                  <span className="text-[10px] text-slate-500">0812-9844-8891 (Terhubung)</span>
                </div>
                <span className="text-black font-semibold text-[11px]">Utama</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="font-bold text-black block">OVO Cash</span>
                  <span className="text-[10px] text-slate-500">0812-9844-8891</span>
                </div>
                <span className="text-slate-400 text-[11px]">Terhubung</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="font-bold text-black block">BCA Virtual Account</span>
                  <span className="text-[10px] text-slate-500">Auto-Debit Terverifikasi</span>
                </div>
                <span className="text-slate-400 text-[11px]">Aktif</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:border-black text-black text-xs font-heading font-bold shadow-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Passenger Verification Modal */}
      {showPassengerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-black text-base">
                Data Penumpang KTP
              </h3>
              <button
                onClick={() => setShowPassengerModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 text-xs space-y-2.5">
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <span className="text-slate-400 text-[10px] uppercase">Nama Lengkap Sesuai KTP</span>
                <p className="font-bold text-black text-sm">Penumpang 1</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <span className="text-slate-400 text-[10px] uppercase">Nomor Induk Kependudukan (NIK)</span>
                <p className="font-mono text-black text-sm">3171048809930008</p>
                <div className="flex items-center gap-1 text-black text-[10px] font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kependudukan Dukcapil Terverifikasi</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPassengerModal(false)}
              className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:border-black text-black text-xs font-heading font-bold shadow-xs cursor-pointer"
            >
              Simpan Data
            </button>
          </div>
        </div>
      )}

      {/* Support Live Chat Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-black" />
                <h3 className="font-heading font-bold text-black text-base">
                  Pusat Bantuan 24/7
                </h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 text-xs space-y-2">
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <span className="font-bold text-black block">Petugas Terminal Pulo Gebang</span>
                <p className="text-slate-500 text-[11px]">
                  Hotline WhatsApp Dispatcher: +62 821-4400-9988
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                <span className="font-bold text-black block">Customer Service OmniBus</span>
                <p className="text-slate-500 text-[11px]">
                  Bantuan refund keterlambatan, pergantian jam keberangkatan, atau kendala tiket.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:border-black text-black text-xs font-heading font-bold shadow-xs cursor-pointer"
            >
              Hubungi CS via Live Chat
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xs bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl text-center space-y-3">
            <LogOut className="w-8 h-8 text-black mx-auto" />
            <h4 className="font-heading font-bold text-black text-base">
              Keluar dari Akun?
            </h4>
            <p className="text-xs text-slate-500">
              Anda dapat masuk kembali kapan saja untuk mengakses e-tiket aktif dan poin miles.
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-black text-xs font-bold cursor-pointer hover:border-slate-400"
              >
                Batal
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); onLogout?.(); }}
                className="flex-1 py-2.5 rounded-xl bg-white border border-black text-black text-xs font-bold shadow-xs cursor-pointer hover:bg-slate-50"
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
