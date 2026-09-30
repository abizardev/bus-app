import React from 'react';
import { Clock, Armchair, Ticket, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'jadwal' | 'kursi' | 'etiket' | 'akun';
  onSelectTab: (tab: 'jadwal' | 'kursi' | 'etiket' | 'akun') => void;
  activeTicketCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  activeTicketCount = 1,
}) => {
  const tabs = [
    {
      id: 'jadwal' as const,
      label: 'Jadwal',
      icon: Clock,
    },
    {
      id: 'kursi' as const,
      label: 'Kursi',
      icon: Armchair,
    },
    {
      id: 'etiket' as const,
      label: 'E-Tiket',
      icon: Ticket,
      badge: activeTicketCount,
    },
    {
      id: 'akun' as const,
      label: 'Akun',
      icon: User,
    },
  ];

  return (
    <nav aria-label="Navigasi utama" className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 max-w-md mx-auto pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 min-h-[64px] items-center px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.id === 'etiket' && tab.badge ? `${tab.label}, ${tab.badge} tiket aktif` : tab.label}
              className={`relative flex flex-col items-center justify-center min-h-[56px] py-1.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-black rounded-xl ${
                isActive ? 'text-black font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-black fill-current' : 'group-hover:scale-105'
                  }`}
                  aria-hidden="true"
                />
                {tab.badge && tab.badge > 0 && tab.id === 'etiket' && (
                  <span className="absolute -top-1.5 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[12px] mt-0.5 tracking-tight transition-colors ${
                  isActive ? 'font-bold text-black' : 'font-medium text-slate-600'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
