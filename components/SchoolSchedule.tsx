
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Activity, Database, RefreshCw } from 'lucide-react';
import { fetchSchedules } from '../lib/actions';

// ═══════════════════════════════════════════════════════
// TIPE DATA
// ═══════════════════════════════════════════════════════

interface DailyAgenda {
  id: string;
  title: string;
  day: string;
  start_time: string;
  end_time: string;
  type: 'daily' | 'weekly' | 'event' | 'holiday';
  description?: string;
  location?: string;
}

// ═══════════════════════════════════════════════════════
// AGENDA FALLBACK (saat DB kosong)
// ═══════════════════════════════════════════════════════

const AGENDA_FALLBACK: DailyAgenda[] = [
  { id: 'ag-1', title: 'Apel & Senam Pagi', day: 'Senin', start_time: '07:00', end_time: '07:15', type: 'weekly', location: 'Lapangan Upacara' },
  { id: 'ag-2', title: 'Kegiatan Belajar Mengajar', day: 'daily', start_time: '07:15', end_time: '14:00', type: 'daily', location: 'Kelas Masing-masing', description: 'Proses belajar mengajar sesuai jadwal mata pelajaran.' },
  { id: 'ag-3', title: 'Istirahat Pertama', day: 'daily', start_time: '09:30', end_time: '09:45', type: 'daily', location: 'Kantin / Kelas' },
  { id: 'ag-4', title: 'Istirahat & Ibadah Siang', day: 'daily', start_time: '12:00', end_time: '12:45', type: 'daily', location: 'Musholla / Kantin' },
  { id: 'ag-5', title: 'Upacara Bendera', day: 'Senin', start_time: '07:00', end_time: '07:45', type: 'weekly', location: 'Lapangan Upacara', description: 'Upacara bendera setiap hari Senin.' },
  { id: 'ag-6', title: 'Ekstrakurikuler', day: 'Selasa', start_time: '15:30', end_time: '17:00', type: 'weekly', location: 'Lapangan / Lab / Aula', description: 'Berbagai kegiatan ekstrakurikuler sesuai pilihan siswa.' },
  { id: 'ag-7', title: 'Eksul Pramuka', day: 'Jumat', start_time: '14:00', end_time: '16:00', type: 'weekly', location: 'Lapangan', description: 'Latihan Pramuka rutin setiap Jumat.' },
];

const TYPE_CONFIG = {
  daily:   { label: 'Harian',    color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-400' },
  weekly:  { label: 'Mingguan',  color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  event:   { label: 'Event',     color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400' },
  holiday: { label: 'Libur',     color: 'bg-red-100 text-red-700',       dot: 'bg-red-400' },
};

const HARI_NAMES: Record<number, string> = { 0: 'Minggu', 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu' };

// ═══════════════════════════════════════════════════════
// KOMPONEN
// ═══════════════════════════════════════════════════════

const SchoolSchedule: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [agendaItems, setAgendaItems] = useState<DailyAgenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'daily' | 'weekly' | 'event' | 'holiday'>('all');

  // ── Clock ticker ──────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Load dari DB ──────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchSchedules();
        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
            id: item.id,
            title: item.title || item.nama || 'Agenda',
            day: item.day || item.hari || 'daily',
            start_time: item.start_time || item.startTime || item.waktu_mulai || '',
            end_time: item.end_time || item.endTime || item.waktu_selesai || '',
            type: item.type || 'daily',
            description: item.description || '',
            location: item.location || item.tempat || '',
          }));
          setAgendaItems(mapped);
        } else {
          setAgendaItems(AGENDA_FALLBACK);
        }
      } catch {
        setAgendaItems(AGENDA_FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Helpers ───────────────────────────────────────────
  const hariIni = HARI_NAMES[currentTime.getDay()];
  const tanggal = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const isRunningNow = (item: DailyAgenda): boolean => {
    if (!item.start_time || !item.end_time) return false;
    const [sh, sm] = item.start_time.split(':').map(Number);
    const [eh, em] = item.end_time.split(':').map(Number);
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const itemIsToday = item.day === 'daily' || item.type === 'daily' || item.day === hariIni;
    return itemIsToday && now >= sh * 60 + sm && now < eh * 60 + em;
  };

  // Filter + sort by start_time
  const filtered = agendaItems
    .filter(item => filterType === 'all' || item.type === filterType)
    .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));

  // Items yang sedang berjalan hari ini
  const running = agendaItems.filter(isRunningNow);

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#F0F2F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-16">

        {/* ── Header ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-[#D4AF37]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                Agenda Sekolah
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-[#0F172A] tracking-tighter leading-tight">
              AGENDA &<br />
              <span className="text-[#D4AF37]">KEGIATAN</span>
            </h2>
          </div>

          {/* Live Clock */}
          <div className="bg-[#0F172A] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white min-w-[200px] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-2xl -mr-6 -mt-6" />
            <p className="text-3xl sm:text-5xl font-black tracking-tighter font-mono">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] mt-2 pt-2 border-t border-white/10">
              {hariIni}, {currentTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* ── Sedang Berlangsung ──────────────────────── */}
        {running.length > 0 && (
          <div className="mb-6 space-y-3">
            {running.map(item => (
              <div key={item.id} className="bg-[#0F172A] rounded-2xl p-4 sm:p-6 border-2 border-[#D4AF37] flex items-center gap-4 shadow-xl shadow-[#D4AF37]/10">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                  <Activity className="h-5 w-5 text-[#0F172A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-ping flex-shrink-0" />
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Sedang Berlangsung</span>
                  </div>
                  <p className="text-white font-black text-base sm:text-lg truncate">{item.title}</p>
                  <p className="text-white/50 text-xs font-mono">{item.start_time} – {item.end_time}</p>
                </div>
                {item.location && (
                  <p className="flex-shrink-0 hidden sm:block text-[10px] text-white/40 font-bold uppercase tracking-wider">
                    📍 {item.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Filter Pills ─────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          {([
            { key: 'all',     label: 'Semua' },
            { key: 'daily',   label: '🔁 Harian' },
            { key: 'weekly',  label: '📅 Mingguan' },
            { key: 'event',   label: '🎉 Event' },
            { key: 'holiday', label: '🏖️ Libur' },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-black text-xs transition-all ${
                filterType === f.key
                  ? 'bg-[#0F172A] text-white shadow-lg'
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
          {loading && <RefreshCw className="h-4 w-4 text-gray-400 animate-spin ml-2 mt-2 flex-shrink-0" />}
        </div>

        {/* ── Agenda List ──────────────────────────────── */}
        {loading ? (
          <div className="bg-white rounded-3xl py-24 text-center shadow-sm">
            <RefreshCw className="h-8 w-8 text-gray-200 animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-light italic">Memuat agenda dari database...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {filtered.map((item, i) => {
              const live = isRunningNow(item);
              const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.daily;

              return (
                <div
                  key={item.id}
                  className={`group bg-white rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
                    live
                      ? 'border-[#D4AF37] shadow-lg shadow-amber-100'
                      : 'border-transparent hover:border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    {/* Waktu */}
                    <div className={`flex-shrink-0 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center min-w-[72px] sm:min-w-[88px] ${
                      live ? 'bg-[#0F172A] text-white' : 'bg-gray-50 text-[#0F172A]'
                    }`}>
                      <p className="text-lg sm:text-2xl font-black font-mono leading-none">
                        {item.start_time || '--:--'}
                      </p>
                      {item.end_time && (
                        <p className={`text-[9px] font-bold mt-1 ${live ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                          s/d {item.end_time}
                        </p>
                      )}
                    </div>

                    {/* Konten */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className={`font-black text-sm sm:text-lg tracking-tight leading-tight ${live ? 'text-[#0F172A]' : 'text-gray-900'}`}>
                          {item.title}
                        </h4>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        {item.day && item.day !== 'daily' && (
                          <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {item.day}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-gray-500 text-xs sm:text-sm font-light italic leading-relaxed mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {item.location && (
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-2">
                          📍 {item.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl py-24 text-center border-2 border-dashed border-gray-200 shadow-sm">
            <Activity className="h-10 w-10 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-xl italic font-light mb-2">Tidak ada agenda untuk filter ini</p>
            <p className="text-gray-300 text-sm">Admin dapat menambahkan agenda melalui Portal Admin → Jadwal</p>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
          <Database className="h-3 w-3" />
          <p className="text-[10px] font-medium">
            {agendaItems.length} agenda tersimpan • Diperbarui real-time via Admin Portal
          </p>
        </div>

      </div>
    </section>
  );
};

export default SchoolSchedule;
