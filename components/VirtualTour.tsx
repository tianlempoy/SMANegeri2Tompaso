
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

           <div className="lg:col-span-7 relative">
             <div className="relative rounded-[60px] lg:rounded-[100px] overflow-hidden aspect-[16/10] shadow-2xl group border border-slate-100 bg-black">
               {/* YouTube iframe cover */}
               <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
                 <iframe
                   width="560"
                   height="315"
                   src="https://www.youtube.com/embed/joyPbz8Qbjs?si=BFfFG2TpSyDjESV4&autoplay=1&mute=1&loop=1&playlist=joyPbz8Qbjs&controls=0&rel=0&modestbranding=1"
                   title="Virtual Tour SMAN 2 Tompaso"
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                   referrerPolicy="strict-origin-when-cross-origin"
                   allowFullScreen
                   style={{
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                     width: '177.78%',
                     height: '177.78%',
                     minWidth: '100%',
                     minHeight: '100%',
                     transform: 'translate(-50%, -50%)',
                     border: 'none',
                   }}
                 />
               </div>

               {/* Overlay */}
               <div className="absolute inset-0 bg-[#0F172A]/10 group-hover:bg-transparent transition-colors pointer-events-none" />

               {/* Label bawah */}
               <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end text-white pointer-events-none">
                 <div className="glass-nav-card !bg-white/5 !backdrop-blur-xl px-10 py-5 rounded-[28px] border border-white/10">
                   <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#C5A059] mb-1">Aerial Discovery</p>
                   <h4 className="text-2xl font-black tracking-tighter">Main Building Hall</h4>
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
