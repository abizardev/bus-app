import React, { useState } from 'react';
import { 
  Bus, 
  Download, 
  Share2, 
  Navigation, 
  Luggage, 
  CheckCircle2, 
  X, 
  Copy, 
  ExternalLink,
  Clock,
  Printer
} from 'lucide-react';
import { ETicket } from '../data/mockData';

interface ETicketScreenProps {
  ticket: ETicket;
}

export const ETicketScreen: React.FC<ETicketScreenProps> = ({ ticket }) => {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      setShowPdfModal(false);
    }, 1800);
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* 1. Status Indicator & Main Title */}
      <div className="flex items-start justify-between pt-1">
        <div>
          {/* Boarding status badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-300 text-xs font-heading font-bold text-black tracking-wider mb-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-black" />
            <span>SIAP BOARDING</span>
          </div>

          <h1 className="font-heading font-bold text-2xl text-black tracking-tight">
            E-Tiket Bus Aktif
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {ticket.departureCity} ke {ticket.arrivalCity} • {ticket.departureDate}, {ticket.departureTime} WIB
          </p>
        </div>

        {/* Bus Icon Top Right Circle */}
        <div className="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center text-black shadow-xs">
          <Bus className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Boarding Pass (Pure White Card with Crisp Black Outlines) */}
      <div className="relative bg-white text-black rounded-3xl p-5 shadow-xs border border-slate-300 overflow-hidden">
        {/* Top Header of Ticket */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center text-black shadow-xs">
              <Bus className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-sm text-black leading-tight">
                {ticket.operator}
              </h2>
              <p className="text-[11px] font-medium text-slate-500">
                {ticket.fleetCode}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-[9px] font-heading font-bold uppercase tracking-wider text-slate-400">
              KODE BOOKING
            </span>
            <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-white text-black font-heading font-extrabold text-xs border border-slate-300">
              {ticket.bookingCode}
            </span>
          </div>
        </div>

        {/* Passenger Field */}
        <div className="py-2.5 px-3 my-2 rounded-xl bg-white flex items-center justify-between border border-slate-200">
          <div>
            <span className="block text-[9px] font-heading font-bold uppercase tracking-wider text-slate-400">
              PENUMPANG
            </span>
            <p className="font-heading font-bold text-sm text-black">
              {ticket.passengerName}
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-300 text-black text-[10px] font-heading font-bold uppercase">
            {ticket.passengerType}
          </span>
        </div>

        {/* Departure & Arrival Details */}
        <div className="grid grid-cols-3 items-center py-2 text-center">
          {/* Origin */}
          <div className="text-left">
            <span className="font-heading font-extrabold text-xl text-black block">
              {ticket.departureTime}
            </span>
            <span className="font-heading font-bold text-xs text-slate-800 block">
              {ticket.departureTerminal}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {ticket.departureSub}
            </span>
          </div>

          {/* Middle Duration & Line */}
          <div className="flex flex-col items-center px-1">
            <span className="text-[10px] font-heading font-semibold text-black">
              {ticket.duration}
            </span>
            <div className="w-full relative my-1 flex items-center justify-center">
              <div className="w-full h-[1.5px] bg-slate-200" />
              <div className="w-5 h-5 rounded-full bg-white border border-slate-400 text-black flex items-center justify-center shadow-xs">
                <Bus className="w-3 h-3" />
              </div>
            </div>
            <span className="text-[10px] font-heading font-medium text-slate-500">
              {ticket.routeType}
            </span>
          </div>

          {/* Destination */}
          <div className="text-right">
            <span className="font-heading font-extrabold text-xl text-black block">
              {ticket.arrivalTime}
            </span>
            <span className="font-heading font-bold text-xs text-slate-800 block">
              {ticket.arrivalTerminal}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {ticket.arrivalCity}
            </span>
          </div>
        </div>

        {/* Info Grid (KURSI, PINTU/PERON, KELAS) */}
        <div className="grid grid-cols-3 gap-2 my-2 p-2.5 rounded-xl bg-white text-center border border-slate-200">
          <div>
            <span className="block text-[9px] font-heading font-bold uppercase tracking-wider text-slate-400">
              KURSI
            </span>
            <p className="font-heading font-extrabold text-base text-black leading-tight mt-0.5">
              {ticket.seatNumber}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">
              {ticket.seatType}
            </span>
          </div>

          <div>
            <span className="block text-[9px] font-heading font-bold uppercase tracking-wider text-slate-400">
              PINTU / PERON
            </span>
            <p className="font-heading font-extrabold text-sm text-black leading-tight mt-0.5">
              {ticket.platform}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">
              {ticket.platformFloor}
            </span>
          </div>

          <div>
            <span className="block text-[9px] font-heading font-bold uppercase tracking-wider text-slate-400">
              KELAS
            </span>
            <p className="font-heading font-extrabold text-sm text-black leading-tight mt-0.5 truncate">
              {ticket.busClass}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">
              {ticket.classConfig}
            </span>
          </div>
        </div>

        {/* Perforated Dashed Line with Notches on Left and Right */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Scalloped cutouts */}
          <div className="ticket-scallop-left" />
          <div className="ticket-scallop-right" />
          <div className="w-full border-t-2 border-dashed border-slate-200" />
        </div>

        {/* Terminal Gate Scan Header */}
        <div className="flex items-center justify-between pt-1 mb-3">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400">
            PINDAI GERBANG TERMINAL
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-300 text-black text-[10px] font-heading font-extrabold uppercase">
            {ticket.terminalGate}
          </span>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center py-1">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <svg
              className="w-40 h-40"
              viewBox="0 0 100 100"
              fill="black"
              shapeRendering="crispEdges"
            >
              {/* Outer Top Left Target */}
              <rect x="0" y="0" width="30" height="30" fill="black" rx="4" />
              <rect x="4" y="4" width="22" height="22" fill="white" rx="2" />
              <rect x="8" y="8" width="14" height="14" fill="black" rx="2" />

              {/* Outer Top Right Target */}
              <rect x="70" y="0" width="30" height="30" fill="black" rx="4" />
              <rect x="74" y="4" width="22" height="22" fill="white" rx="2" />
              <rect x="78" y="8" width="14" height="14" fill="black" rx="2" />

              {/* Outer Bottom Left Target */}
              <rect x="0" y="70" width="30" height="30" fill="black" rx="4" />
              <rect x="4" y="74" width="22" height="22" fill="white" rx="2" />
              <rect x="8" y="78" width="14" height="14" fill="black" rx="2" />

              {/* Data Matrix Dots */}
              <rect x="36" y="8" width="6" height="6" />
              <rect x="48" y="8" width="12" height="6" />
              <rect x="36" y="20" width="8" height="6" />
              <rect x="52" y="20" width="8" height="6" />

              <rect x="8" y="36" width="6" height="6" />
              <rect x="20" y="36" width="10" height="6" />
              <rect x="38" y="36" width="8" height="8" />
              <rect x="52" y="36" width="12" height="6" />
              <rect x="72" y="36" width="6" height="8" />
              <rect x="84" y="36" width="8" height="6" />

              <rect x="8" y="48" width="10" height="6" />
              <rect x="24" y="48" width="6" height="8" />
              <rect x="42" y="46" width="16" height="10" />
              <rect x="68" y="48" width="10" height="6" />
              <rect x="84" y="48" width="6" height="8" />

              <rect x="36" y="60" width="12" height="6" />
              <rect x="56" y="60" width="8" height="8" />
              <rect x="72" y="60" width="16" height="6" />

              <rect x="36" y="74" width="6" height="8" />
              <rect x="48" y="74" width="10" height="6" />
              <rect x="66" y="74" width="8" height="8" />
              <rect x="80" y="74" width="12" height="6" />

              <rect x="36" y="86" width="14" height="6" />
              <rect x="56" y="86" width="8" height="6" />
              <rect x="72" y="86" width="16" height="8" />
            </svg>
          </div>

          {/* Barcode Graphic */}
          <div className="w-full flex flex-col items-center mt-3 pt-2">
            <div className="flex items-center justify-center gap-[2.5px] h-9 w-4/5 max-w-[260px]">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4].map(
                (w, i) => (
                  <span
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${w * 1.5}px` }}
                  />
                )
              )}
            </div>
            <span className="font-mono text-[10px] font-semibold tracking-[0.25em] text-slate-700 mt-1">
              {ticket.barcodeNumber}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bagasi Tercatat Card */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-black">
            <Luggage className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-xs text-black">
              Bagasi Tercatat
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Maksimal {ticket.baggageMaxKg}kg • {ticket.baggageTag}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-300 text-[10px] font-heading font-bold text-black">
          TERDAFTAR
        </span>
      </div>

      {/* 4. Action Buttons */}
      <div className="space-y-2 pt-1">
        {/* Primary CTA: Unduh PDF Tiket */}
        <button
          onClick={() => setShowPdfModal(true)}
          className="w-full py-3.5 rounded-full bg-white border-2 border-black hover:bg-slate-50 active:scale-95 text-black text-sm font-heading font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Unduh PDF Tiket</span>
        </button>

        {/* Secondary Row: Kirim Tiket & Arah Terminal */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-black text-xs font-heading font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-black" />
            <span>Kirim Tiket</span>
          </button>

          <button
            onClick={() => setShowTerminalModal(true)}
            className="py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-black text-xs font-heading font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5 text-black" />
            <span>Arah Terminal</span>
          </button>
        </div>
      </div>

      {/* Download PDF Thermal Print Preview Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-black" />
                <h3 className="font-heading font-bold text-black text-base">
                  Cetak PDF E-Tiket
                </h3>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 text-center space-y-3">
              <div className="p-4 rounded-2xl bg-white text-black text-left font-mono text-xs space-y-1 shadow-xs border border-slate-200">
                <div className="text-center font-bold pb-1 border-b border-dashed border-slate-300 text-black">
                  OMNIBUS BOARDING PASS
                </div>
                <div className="flex justify-between pt-1">
                  <span>BOOKING:</span>
                  <strong className="text-black">{ticket.bookingCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span>PENUMPANG:</span>
                  <strong>{ticket.passengerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>KURSI / GATE:</span>
                  <strong>{ticket.seatNumber} / {ticket.terminalGate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>WAKTU:</span>
                  <strong>{ticket.departureDate} {ticket.departureTime}</strong>
                </div>
                <div className="text-[10px] text-slate-500 pt-2 text-center border-t border-dashed border-slate-300">
                  Resmi Terverifikasi Dinas Perhubungan
                </div>
              </div>

              {downloadSuccess ? (
                <div className="flex items-center justify-center gap-2 text-black text-xs font-bold py-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>File PDF Berhasil Diunduh!</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  File PDF berformat A4/Thermal siap dicetak atau disimpan di ponsel.
                </p>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setShowPdfModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-black text-xs font-heading font-bold cursor-pointer hover:border-slate-400"
              >
                Tutup
              </button>
              <button
                onClick={handleDownloadPdf}
                className="flex-1 py-2.5 rounded-xl bg-white border-2 border-black hover:bg-slate-50 text-black text-xs font-heading font-bold shadow-xs cursor-pointer"
              >
                Simpan PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Ticket Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-black" />
                <h3 className="font-heading font-bold text-black text-base">
                  Kirim &amp; Bagikan Tiket
                </h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-500">
                Bagikan detail tiket ke keluarga atau rekan perjalanan Anda:
              </p>

              <button
                onClick={handleCopyLink}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs text-black hover:border-black transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-black" />
                  <span>{copiedLink ? 'Link Tersalin ke Clipboard!' : 'Salin Tautan E-Tiket'}</span>
                </div>
                {copiedLink && <CheckCircle2 className="w-4 h-4 text-black" />}
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Halo, ini detail tiket bus ${ticket.operator} saya (${ticket.bookingCode}): ${ticket.departureCity} ke ${ticket.arrivalCity} tanggal ${ticket.departureDate} jam ${ticket.departureTime} WIB. Kursi: ${ticket.seatNumber}, Gate: ${ticket.terminalGate}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs text-black hover:border-black transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">💬</span>
                  <span>Kirim via WhatsApp</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:border-black text-black text-xs font-heading font-bold cursor-pointer"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* Terminal Guide & Navigation Modal */}
      {showTerminalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-black" />
                <h3 className="font-heading font-bold text-black text-base">
                  Panduan Menuju Gate
                </h3>
              </div>
              <button
                onClick={() => setShowTerminalModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 text-xs text-slate-600 space-y-2.5">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-black">
                    {ticket.departureTerminal} ({ticket.departureSub})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-black text-black text-[10px] font-bold">
                    {ticket.terminalGate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Naik eskalator utama ke <strong>{ticket.platformFloor}</strong>, belok kiri menuju <strong>{ticket.platform}</strong>. Pintu dibuka 30 menit sebelum keberangkatan.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2 text-slate-500 text-[11px]">
                <Clock className="w-4 h-4 text-black shrink-0" />
                <span>Harap tiba di peron selambatnya 06:45 WIB.</span>
              </div>
            </div>

            <button
              onClick={() => setShowTerminalModal(false)}
              className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:border-black text-black text-xs font-heading font-bold cursor-pointer"
            >
              Mengerti &amp; Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
