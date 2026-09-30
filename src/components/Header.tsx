import React, { useState } from 'react';
import { Bell, Bus, X } from 'lucide-react';

interface HeaderProps {
  currentTab: 'jadwal' | 'kursi' | 'etiket' | 'akun';
  onNavigateTab: (tab: 'jadwal' | 'kursi' | 'etiket' | 'akun') => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigateTab, unreadCount = 2 }) => {
  const [showNotifications, setShowNotifications] = useState(false);

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
      <header className="sticky top-0 z-40 bg-white px-5 py-3.5 flex items-center justify-between border-b border-slate-200">
        {/* Left: Brand Icon + Title */}
        <div 
          onClick={() => onNavigateTab('jadwal')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black shadow-xs group-hover:border-black transition-colors">
            <Bus className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg text-black leading-tight tracking-tight">
              OmniBus
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Tiket Bus Antarkota
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Notification Button */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:border-black hover:text-black transition-all cursor-pointer shadow-xs"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black" />
            )}
          </button>
        </div>
      </header>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl mt-12 animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-black" />
                <h3 className="font-heading font-bold text-black text-base">Notifikasi Perjalanan</h3>
              </div>
              <button 
                onClick={() => setShowNotifications(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-black hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {notifications.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-colors ${
                    item.unread 
                      ? 'bg-slate-50/80 border-slate-300 text-black' 
                      : 'bg-white border-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-black">{item.title}</span>
                    <span className="text-[11px] text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => setShowNotifications(false)}
                className="text-xs text-slate-500 hover:text-black cursor-pointer font-medium"
              >
                Tandai semua dibaca
              </button>
              <button
                onClick={() => setShowNotifications(false)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-black text-black text-xs font-bold font-heading shadow-xs cursor-pointer transition-all"
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
