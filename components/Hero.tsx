import React, { useState, useEffect } from 'react';
import { ArrowRight as ArrowRightIcon, Sparkles as SparklesIcon, Play as PlayIcon, ShieldCheck as ShieldCheckIcon, Lock } from 'lucide-react';
import { SCHOOL_ASSETS } from '../constants/assets';
import { SCHOOL_THEME } from '../constants/theme';
import { fetchPPDBSettings } from '../lib/actions';

interface HeroProps {
  onAdmissionClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onAdmissionClick }) => {
  const [isPPDBOpen, setIsPPDBOpen] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const res = await fetchPPDBSettings();
      if (res.data) {
        setIsPPDBOpen(res.data.is_ppdb_open);
      }
    };
    loadSettings();
  }, []);
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#0F172A] via-[#0A0F1E] to-blue-900 pt-16 sm:pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        <div className="absolute inset-0 transform scale-105">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-90"
            poster={SCHOOL_ASSETS.HERO_BUILDING}
          >
            <source src="/videos/menu.MP4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-[#0A0F1E]/15 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1E] via-[#0A0F1E]/80 to-blue-900/30 z-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-transparent to-transparent z-20"></div>
        <div className="absolute inset-0 md:inset-auto md:top-0 md:left-1/4 md:w-[50%] md:h-[30%] bg-white/5 blur-[120px] rounded-full z-15 pointer-events-none"></div>
      </div>
      
      <div className="absolute top-20 right-4 sm:top-24 sm:right-6 md:top-24 lg:top-28 lg:right-12 xl:right-20 z-40 reveal active hero-accreditation-delay">
        <div className="flex items-center space-x-2 sm:space-x-4 bg-white/5 backdrop-blur-xl border border-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-2xl shadow-2xl hover:bg-white/10 transition-all group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] border border-[#C5A059]/20 group-hover:scale-110 transition-transform relative z-10">
            <ShieldCheckIcon size={16} />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white leading-none mb-0.5">Akreditasi B</span>
            <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.1em] text-[#C5A059]/70 leading-tight">Nasional BAN-S/M</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 w-full relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 lg:gap-20 items-center">
          
          <div className="lg:col-span-10 space-y-6 sm:space-y-8 reveal active">
            {/* Premium Header */}
            <div className="flex items-center space-x-4">
              <div className="h-[1px] w-10 sm:w-12 bg-[#C5A059]"></div>
              <span className="text-[8px] sm:text-[10px] font-medium uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/70">
                SMA Negeri 2 Tompaso
              </span>
            </div>

            {/* Premium Bold Motto */}
            <div className="space-y-0">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white uppercase tracking-tighter leading-[0.9]">
                Cerdas
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white uppercase tracking-tighter leading-[0.9]">
                Terampil
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#C5A059] uppercase tracking-tighter leading-[0.9]">
                Bermartabat
              </h1>
            </div>

            {/* Premium Description */}
            <div className="max-w-2xl pt-4 sm:pt-6">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-relaxed text-white/80">
                {SCHOOL_THEME.CONTENT.MOTTO_DESCRIPTION}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-4 sm:pt-6">
              <button 
                onClick={isPPDBOpen ? onAdmissionClick : undefined}
                disabled={!isPPDBOpen}
                className={`px-6 sm:px-10 lg:px-12 py-4 sm:py-6 lg:py-7 rounded-full text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] transition-all shadow-2xl flex items-center justify-center space-x-3 sm:space-x-6 group active:scale-95 ${
                  isPPDBOpen 
                  ? 'bg-gradient-to-r from-[#C5A059] to-blue-600 text-white hover:from-blue-600 hover:to-[#C5A059]' 
                  : 'bg-gray-200/20 text-white/40 cursor-not-allowed border border-white/10'
                }`}
              >
                {!isPPDBOpen && <Lock className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span className="whitespace-nowrap">{isPPDBOpen ? 'Daftar Sekarang (PPDB)' : 'PPDB Ditutup'}</span>
                {isPPDBOpen && <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform flex-shrink-0" />}
              </button>
              
              <a 
                href="https://www.youtube.com/watch?v=ky3IooXZYH4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-4 px-6 sm:px-8 lg:px-10 py-4 sm:py-6 lg:py-7 group border border-white/20 rounded-full hover:border-[#C5A059] transition-all active:scale-95 bg-white/5 backdrop-blur-md shadow-xl"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all shadow-sm flex-shrink-0">
                  <PlayIcon size={12} className="fill-current ml-1" />
                </div>
                <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] lg:tracking-[0.4em] text-white drop-shadow-md whitespace-nowrap">Video Profil</span>
              </a>
            </div>
          </div>


        </div>
      </div>

    </section>
  );
};

export default Hero;
