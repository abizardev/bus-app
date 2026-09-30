import React, { useState } from 'react';
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
  INITIAL_TICKET 
} from './data/mockData';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'jadwal' | 'kursi' | 'etiket' | 'akun'>('jadwal');
  const [selectedBus, setSelectedBus] = useState<BusSchedule>(BUS_SCHEDULES[0]);
  const [activeTicket, setActiveTicket] = useState<ETicket>(INITIAL_TICKET);
  const [isFramedMode, setIsFramedMode] = useState<boolean>(true);

  // When user selects a bus from schedule
  const handleSelectBus = (bus: BusSchedule) => {
    setSelectedBus(bus);
    setCurrentTab('kursi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When payment is processed from seat selection
  const handleProceedToPayment = (ticketData: Partial<ETicket>, totalPrice: number) => {
    const updatedTicket: ETicket = {
      ...INITIAL_TICKET,
      ...ticketData,
      id: `ticket-${Date.now()}`,
      bookingCode: `BUS-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'SIAP BOARDING',
    };
    setActiveTicket(updatedTicket);
    setCurrentTab('etiket');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070b08] text-[#dee4db] flex flex-col items-center justify-start antialiased selection:bg-[#bef237] selection:text-black">
      {/* Top Quick Screen Switcher Toolbar for fast demoing */}
      <aside aria-label="Demo Navigation" className="w-full bg-[#101711] border-b border-[#1c271e] py-2 px-4 flex items-center justify-between z-50 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-heading font-bold text-[#8e9b90] uppercase tracking-wider hidden sm:inline mr-1">
            Layar:
          </span>
          <button
            onClick={() => setCurrentTab('jadwal')}
            className={`px-3 py-1 rounded-full text-xs font-heading font-bold transition-all ${
              currentTab === 'jadwal'
                ? 'bg-[#bef237] text-black shadow-[0_0_10px_rgba(190,242,55,0.3)]'
                : 'bg-[#18231a] text-[#8e9b90] hover:text-white'
            }`}
          >
            1. Jadwal (Home)
          </button>
          <button
            onClick={() => setCurrentTab('kursi')}
            className={`px-3 py-1 rounded-full text-xs font-heading font-bold transition-all ${
              currentTab === 'kursi'
                ? 'bg-[#bef237] text-black shadow-[0_0_10px_rgba(190,242,55,0.3)]'
                : 'bg-[#18231a] text-[#8e9b90] hover:text-white'
            }`}
          >
            2. Pilih Kursi
          </button>
          <button
            onClick={() => setCurrentTab('etiket')}
            className={`px-3 py-1 rounded-full text-xs font-heading font-bold transition-all ${
              currentTab === 'etiket'
                ? 'bg-[#bef237] text-black shadow-[0_0_10px_rgba(190,242,55,0.3)]'
                : 'bg-[#18231a] text-[#8e9b90] hover:text-white'
            }`}
          >
            3. E-Tiket Aktif
          </button>
          <button
            onClick={() => setCurrentTab('akun')}
            className={`px-3 py-1 rounded-full text-xs font-heading font-bold transition-all ${
              currentTab === 'akun'
                ? 'bg-[#bef237] text-black shadow-[0_0_10px_rgba(190,242,55,0.3)]'
                : 'bg-[#18231a] text-[#8e9b90] hover:text-white'
            }`}
          >
            4. Akun Jasper
          </button>
        </div>

        {/* Viewport Frame Toggle */}
        <button
          onClick={() => setIsFramedMode(!isFramedMode)}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#18231a] border border-[#273729] text-[#8e9b90] hover:text-[#bef237] transition-colors ml-2 shrink-0"
          title="Ganti Mode Tampilan"
        >
          {isFramedMode ? (
            <>
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[11px] font-heading">Layar Penuh</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px] font-heading">Mobile Frame</span>
            </>
          )}
        </button>
      </aside>

      {/* Main App Container */}
      <main className={`w-full transition-all duration-300 ${
        isFramedMode 
          ? 'max-w-md min-h-screen bg-[#0b100c] shadow-[0_0_60px_rgba(0,0,0,0.9)] relative border-x border-[#1a251c]' 
          : 'max-w-xl min-h-screen bg-[#0b100c] relative'
      }`}>
        {/* Persistent Top Header (only hidden in specific custom sub-headers if needed, or shown consistently) */}
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
            />
          )}

          {currentTab === 'akun' && (
            <AccountScreen
              onNavigateTab={setCurrentTab}
            />
          )}
        </div>

        {/* Persistent Fixed Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          activeTicketCount={1}
        />
      </main>
    </div>
  );
}
