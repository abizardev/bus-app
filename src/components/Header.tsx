import React, { useState } from 'react';
import { Bell, Bus, CheckCircle2, ChevronRight, X } from 'lucide-react';
import jasperAvatar from '../assets/images/jasper_avatar_1790661946230.jpg';

interface HeaderProps {
  currentTab: 'jadwal' | 'kursi' | 'etiket' | 'akun';
  onNavigateTab: (tab: 'jadwal' | 'kursi' | 'etiket' | 'akun') => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigateTab, unreadCount = 2 }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getSubLabel = () => {
    switch (currentTab) {
      case 'jadwal':
        return 'JADWAL';
      case 'kursi':
        return 'KURSI';
      case 'etiket':
        return 'E TIKET';
      case 'akun':
        return 'AKUN';
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'Gate Terminal Dibuka',
      desc: 'Sinar Jaya SJ-8802 telah parkir di Jalur 04 Lantai 2 Terminal Pulo Gebang.',
      time: '15 mnt lalu',
      unread: true,
    },
    {
      id: 2,
      title: 'Diskon Spesial 25%',
      desc: 'Voucher rute Jakarta - Yogyakarta siap digunakan untuk perjalanan berikutnya.',
      time: '2 jam lalu',
      unread: true,
    },
    {
      id: 3,
      title: 'Perjalanan Berhasil Selesai',
      desc: 'Terima kasih telah bepergian dengan DayTrans Shuttle Bandung.',
      time: '15 Agu',
      unread: false,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0b100c]/90 backdrop-blur-md px-5 py-3 flex items-center justify-between border-b border-[#1b251d]">
        {/* Left: Brand Icon + Title */}
        <div 
          onClick={() => onNavigateTab('jadwal')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#141d16] border border-[#2b392d] flex items-center justify-center text-[#bef237] group-hover:border-[#bef237]/50 transition-colors">
            <div className="relative">
              <Bus className="w-5 h-5 text-[#bef237]" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#bef237] rounded-full animate-ping" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg text-white leading-tight tracking-tight flex items-center gap-1.5">
              OmniBus
            </span>
            <span className="font-heading text-[10px] tracking-wider text-[#8e9b90] font-semibold">
              {getSubLabel()}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative w-9 h-9 rounded-full bg-[#162018] border border-[#273529] flex items-center justify-center text-[#c4c9af] hover:text-[#bef237] hover:border-[#bef237]/40 transition-colors"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#bef237] ring-2 ring-[#0b100c]" />
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => onNavigateTab('akun')}
            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-[#bef237] transition-all"
            aria-label="Profil Akun"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#38493a] p-0.5 bg-[#172018]">
              <img
                src={jasperAvatar}
                alt="Jasper Collins"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#bef237] rounded-full border-2 border-[#0b100c] flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-black rounded-full" />
            </span>
          </button>
        </div>
      </header>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#131b14] border border-[#273529] rounded-2xl p-5 shadow-2xl mt-12 animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#212c22]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#bef237]" />
                <h3 className="font-heading font-bold text-white text-base">Notifikasi Perjalanan</h3>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a251b]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {notifications.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    item.unread 
                      ? 'bg-[#1a251c] border-[#bef237]/20 text-white' 
                      : 'bg-[#151c16] border-[#222e23] text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#bef237]">{item.title}</span>
                    <span className="text-[11px] text-[#8e9b90]">{item.time}</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#212c22] flex justify-between items-center">
              <button
                onClick={() => setShowNotifications(false)}
                className="text-xs text-[#8e9b90] hover:text-white"
              >
                Tandai semua dibaca
              </button>
              <button
                onClick={() => setShowNotifications(false)}
                className="px-3 py-1.5 rounded-lg bg-[#bef237] text-[#0b100c] text-xs font-bold font-heading hover:bg-[#bef237]/90"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
