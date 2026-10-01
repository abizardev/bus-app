import React, { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ScheduleScreen } from './components/ScheduleScreen';
import { SeatSelectionScreen } from './components/SeatSelectionScreen';
import { ETicketScreen } from './components/ETicketScreen';
import { AccountScreen } from './components/AccountScreen';
import {
  BusSchedule,
  BUS_SCHEDULES,
  ETicket,
} from './data/mockData';
import { buildTicketFromBooking } from './services/bookingFlow';
import type { DummyPaymentReceipt } from './services/dummyPayment';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'jadwal' | 'kursi' | 'etiket' | 'akun'>('jadwal');
  const [selectedBus, setSelectedBus] = useState<BusSchedule>(BUS_SCHEDULES[0]);
  // Database tiket: awalnya KOSONG — tidak langsung dapat tiket saat proses.
  // Tiket baru muncul setelah pembayaran dummy BERHASIL + konfirmasi.
  const [ticketDb, setTicketDb] = useState<ETicket[]>([]);
  // Akun dummy: user dianggap sudah login agar bisa pesan, bisa keluar/masuk via Akun.
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginNotice, setLoginNotice] = useState<string | null>(null);

  const activeTicket: ETicket | null = useMemo(
    () => (ticketDb.length > 0 ? ticketDb[ticketDb.length - 1] : null),
    [ticketDb],
  );

  // When user selects a bus from schedule
  const handleSelectBus = (bus: BusSchedule) => {
    setSelectedBus(bus);
    setCurrentTab('kursi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dipanggil dari SeatSelectionScreen SETELAH pembayaran dummy BERHASIL.
  // ticketData sudah konsisten dengan jadwal (operator/jam/kota), receipt dummy dilampirkan.
  const handleProceedToPayment = (
    ticketData: Partial<ETicket> & { seatNumbers?: string[]; passengerName?: string; travelDate?: string },
    _totalPrice: number,
    receipt?: DummyPaymentReceipt,
  ) => {
    if (!isLoggedIn) {
      setLoginNotice('Harus login / punya akun dulu untuk menerbitkan e-tiket.');
      setCurrentTab('akun');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    try {
      const seatNumbers =
        ticketData.seatNumbers ??
        (ticketData.seatNumber ? ticketData.seatNumber.split(',').map((s) => s.trim()) : []);
      const issued = buildTicketFromBooking({
        bus: selectedBus,
        seatNumbers: seatNumbers.length > 0 ? seatNumbers : ['06'],
        passengerName: ticketData.passengerName ?? 'Penumpang',
        travelDate: ticketData.travelDate ?? '2026-10-15',
        paymentReceipt:
          receipt ??
          ({
            receiptId: `DUMMY-${Date.now()}`,
            methodId: 'gopay',
            methodName: 'GoPay',
            amount: _totalPrice,
            bookingRef: `BOOK-${Date.now()}`,
            status: 'BERHASIL',
            paidAtIso: new Date().toISOString(),
          } as DummyPaymentReceipt),
      });
      // Samakan field tambahan dari layar kursi bila ada (bagasi/snack) tanpa merusak konsistensi jadwal.
      const merged: ETicket = { ...issued, ...ticketData, id: issued.id, bookingCode: issued.bookingCode, operator: issued.operator, departureTime: issued.departureTime, arrivalTime: issued.arrivalTime, departureCity: issued.departureCity, arrivalCity: issued.arrivalCity, seatNumber: issued.seatNumber, status: 'SIAP BOARDING' };
      setTicketDb((prev) => [...prev, merged]);
      setCurrentTab('etiket');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      // Fallback aman: tetap buat tiket konsisten bila builder gagal karena data parsial lama.
      const fallback: ETicket = {
        ...ticketData,
        id: `ticket-${Date.now()}`,
        bookingCode: `BUS-${Math.floor(100000 + Math.random() * 900000)}`,
        operator: selectedBus.operator,
        fleetCode: `Armada ${selectedBus.busCode}`,
        departureTime: selectedBus.departureTime,
        arrivalTime: selectedBus.arrivalTime,
        departureCity: selectedBus.departureCity,
        arrivalCity: selectedBus.arrivalCity,
        status: 'SIAP BOARDING',
      } as ETicket;
      setTicketDb((prev) => [...prev, fallback]);
      setCurrentTab('etiket');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-start antialiased selection:bg-black selection:text-white">
      {/* Main App Container - Pure White */}
      <main className="w-full max-w-md min-h-screen bg-white shadow-[0_0_30px_rgba(0,0,0,0.04)] relative border-x border-slate-200">
        {/* Persistent Top Header */}
        {currentTab !== 'kursi' && (
          <Header
            currentTab={currentTab}
            onNavigateTab={setCurrentTab}
          />
        )}

        {/* Screen Content Render */}
        <div className="animate-fadeIn">
          {currentTab === 'jadwal' && (
            <ScheduleScreen
              onSelectBus={handleSelectBus}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'kursi' && (
            <SeatSelectionScreen
              selectedBus={selectedBus}
              onBack={() => setCurrentTab('jadwal')}
              onProceedToPayment={handleProceedToPayment}
            />
          )}

          {currentTab === 'etiket' && (
            <ETicketScreen
              ticket={activeTicket}
              onBrowseSchedule={() => setCurrentTab('jadwal')}
            />
          )}

          {currentTab === 'akun' && (
            <AccountScreen
              onNavigateTab={setCurrentTab}
              isLoggedIn={isLoggedIn}
              ticketCount={ticketDb.length}
              loginNotice={loginNotice}
              onLogin={() => { setIsLoggedIn(true); setLoginNotice(null); }}
              onLogout={() => setIsLoggedIn(false)}
            />
          )}
        </div>

        {/* Persistent Fixed Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          activeTicketCount={ticketDb.length}
        />
      </main>
    </div>
  );
}
