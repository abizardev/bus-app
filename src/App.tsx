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

export default function App() {
  const [currentTab, setCurrentTab] = useState<'jadwal' | 'kursi' | 'etiket' | 'akun'>('jadwal');
  const [selectedBus, setSelectedBus] = useState<BusSchedule>(BUS_SCHEDULES[0]);
  const [activeTicket, setActiveTicket] = useState<ETicket>(INITIAL_TICKET);

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
