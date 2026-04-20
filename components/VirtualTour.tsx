
import React from 'react';
import { Compass, Play, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { SCHOOL_ASSETS } from '../constants/assets';

const VirtualTour: React.FC = () => {
  return (
    <section className="py-40 lg:py-64 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          
          <div className="lg:col-span-5 space-y-12 reveal">
            <div className="inline-flex items-center space-x-4 bg-slate-50 border border-slate-100 px-6 py-2 rounded-full">
              <Compass className="h-4 w-4 text-[#C5A059] animate-spin-slow" />
              <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em]">Explorasi Sekolah</span>
            </div>
            
            <h2 className="text-6xl md:text-[100px] font-medium text-[#0F172A] tracking-tighter leading-[0.85] font-serif-prestige">
              Jelajahi <br /> <span className="text-slate-300 italic font-light lowercase text-[8vw]">lingkungan sekolah.</span>
            </h2>
            
            <p className="text-gray-600 text-xl lg:text-2xl font-light leading-relaxed font-serif-prestige italic">
              "Mari saksikan keindahan kampus SMAN 2 Tompaso yang asri dan modern melalui perspektif udara."
            </p>
            
            <div className="space-y-8 pt-6">
              <div className="flex items-start space-x-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#C5A059] shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-black text-[#0F172A] uppercase text-[10px] tracking-widest mb-1">Fasilitas Unggulan</h4>
                  <p className="text-gray-600 text-sm italic">Ruang belajar yang nyaman dan asri untuk mendukung fokus siswa.</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#C5A059] shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="font-black text-[#0F172A] uppercase text-[10px] tracking-widest mb-1">Ekosistem Digital</h4>
                  <p className="text-gray-600 text-sm italic">Fasilitas belajar yang mendukung kemajuan teknologi masa depan.</p>
                </div>
              </div>
            </div>

            <button className="bg-[#0F172A] text-white px-12 py-7 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#C5A059] transition-all shadow-2xl flex items-center space-x-6 group active:scale-95">
              <span>Mulai Tur 360°</span>
              <Play className="h-4 w-4 fill-current group-hover:scale-125 transition-transform" />
            </button>
          </div>

          <div className="lg:col-span-7 relative reveal" style={{ transitionDelay: '0.4s' }}>
             <div className="relative rounded-[60px] lg:rounded-[100px] overflow-hidden aspect-[16/10] shadow-4xl group cursor-pointer border border-slate-100 bg-black">
                <video 
                  src="/videos/menu.MP4" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#0F172A]/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-700">
                      <div className="w-14 h-14 rounded-full bg-[#C5A059] flex items-center justify-center shadow-2xl">
                         <Play size={20} className="fill-current ml-1" />
                      </div>
                   </div>
                </div>
                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end text-white">
                   <div className="glass-nav-card !bg-white/5 !backdrop-blur-xl px-10 py-6 rounded-[30px] border border-white/10">
                      <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#C5A059] mb-2">Aerial Discovery</p>
                      <h4 className="text-3xl font-black tracking-tighter">Main Building Hall</h4>
                   </div>
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default VirtualTour;
