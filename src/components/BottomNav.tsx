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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b100c]/95 backdrop-blur-lg border-t border-[#1b251d] max-w-md mx-auto">
      <div className="grid grid-cols-4 h-16 items-center px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all group ${
                isActive ? 'text-[#bef237]' : 'text-[#8e9b90] hover:text-[#c4c9af]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8] group-hover:scale-105'
                  }`}
                />
                {tab.badge && tab.badge > 0 && tab.id === 'etiket' && !isActive && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#bef237]" />
                )}
              </div>
              <span
                className={`text-[11px] font-heading mt-1 tracking-tight transition-colors ${
                  isActive ? 'font-bold text-[#bef237]' : 'font-medium text-[#8e9b90]'
                }`}
              >
                {tab.label}
              </span>

              {/* Active subtle bottom neon pip */}
              {isActive && (
                <span className="absolute bottom-0 w-8 h-[2px] bg-[#bef237] rounded-full shadow-[0_0_8px_#bef237]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
