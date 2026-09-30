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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="grid grid-cols-4 h-16 items-center px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all group cursor-pointer ${
                isActive ? 'text-black font-bold' : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5] text-black' : 'stroke-[1.8] group-hover:scale-105'
                  }`}
                />
                {tab.badge && tab.badge > 0 && tab.id === 'etiket' && !isActive && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-black" />
                )}
              </div>
              <span
                className={`text-[11px] font-heading mt-1 tracking-tight transition-colors ${
                  isActive ? 'font-bold text-black' : 'font-medium text-slate-500'
                }`}
              >
                {tab.label}
              </span>

              {/* Active solid black indicator pip */}
              {isActive && (
                <span className="absolute bottom-0 w-8 h-[2.5px] bg-black rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
