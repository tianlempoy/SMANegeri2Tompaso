
import React, { useState, useEffect } from 'react';
import { Landmark, Sparkles, Cpu, ArrowUpRight } from 'lucide-react';

const DigitalHeritage: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const sliderImages = [
    '/galeri/galeri-3.jpeg',
    '/galeri/galeri-9.jpeg',
    '/galeri/galeri-17.jpeg',
    '/galeri/galeri-19.jpeg',
    '/galeri/galeri-21.jpeg',
    '/galeri/galeri-26.jpeg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  return (
    <section className="py-24 lg:py-64 bg-[#0A0F1E] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="glow-orb glow-gold w-[600px] h-[600px] -top-64 -left-64 opacity-20 animate-pulse-slow"></div>
      <div className="glow-orb glow-navy w-[400px] h-[400px] bottom-0 right-0 opacity-10"></div>
      
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-center">
          
          <div className="lg:col-span-5 space-y-8 lg:space-y-16 reveal">
            <div className="inline-flex items-center space-x-4 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
              <Landmark className="h-4 w-4 text-[#C5A059]" />
              <span className="text-[#C5A059] text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em]">Warisan & Inovasi</span>
            </div>
            

            <h2 className="text-[10vw] lg:text-[90px] font-black text-white tracking-tighter leading-[0.9] lg:leading-[0.8]">
               Melahirkan Generasi Cerdas
               <br /> 
              <span className="text-[#D4AF37] italic font-serif-prestige font-light lowercase text-[8vw]">Mandiri</span>
            </h2>
            
            <p className="text-white/40 text-lg lg:text-2xl font-light leading-relaxed font-serif-prestige italic max-w-xl">
              "Kami mengutamakan kedisiplinan dan kreativitas untuk membekali masa depan setiap siswa."
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 group hover:border-[#D4AF37]/50 hover:bg-white/[0.02] transition-all duration-500 cursor-default active:scale-95">
                <div className="w-14 h-14 rounded-2xl bg-[#0A0F1E] flex items-center justify-center text-[#D4AF37] mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <Cpu className="h-8 w-8" />
                </div>
                <h4 className="text-white font-black text-xl mb-3">Kurikulum Unggul</h4>
                <p className="text-white/30 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                  Fokus pada pengembangan bakat alami dan kesiapan menghadapi dunia nyata.
                </p>
              </div>
              <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 group hover:border-[#D4AF37]/50 hover:bg-white/[0.02] transition-all duration-500 cursor-default active:scale-95">
                <div className="w-14 h-14 rounded-2xl bg-[#0A0F1E] flex items-center justify-center text-[#D4AF37] mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h4 className="text-white font-black text-xl mb-3">Pilar Karakter</h4>
                <p className="text-white/30 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                  Membangun integritas dan semangat kerja keras sebagai dasar keberhasilan.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative h-[600px] lg:h-[800px] reveal" style={{ transitionDelay: '0.4s' }}>
            {/* The Stacked Card Grid */}
            <div className="relative w-full h-full flex items-center justify-center">
              {sliderImages.map((src, idx) => {
                // Calculate position relative to current index
                const relativeIdx = (idx - currentIdx + sliderImages.length) % sliderImages.length;
                const isCurrent = relativeIdx === 0;
                const isNext = relativeIdx === 1;
                const isPrev = relativeIdx === sliderImages.length - 1;

                return (
                  <div 
                    key={src}
                    className={`absolute transition-all duration-[1500ms] cubic-bezier(0.4, 0, 0.2, 1) cursor-pointer select-none
                      ${isCurrent ? 'z-30 opacity-100 scale-100 translate-x-0 rotate-0' : 
                        isNext ? 'z-20 opacity-40 scale-90 translate-x-[15%] rotate-3 blur-[2px]' : 
                        isPrev ? 'z-10 opacity-0 scale-75 -translate-x-[20%] -rotate-6' : 
                        'z-0 opacity-0 scale-50'}`}
                    style={{
                      width: '85%',
                      height: '80%',
                      pointerEvents: isCurrent ? 'auto' : 'none'
                    }}
                  >
                    <div className={`relative w-full h-full rounded-[60px] lg:rounded-[100px] overflow-hidden shadow-2xl border border-white/10 group bg-gray-900 ${isCurrent ? 'animate-float' : ''}`}>
                      <img 
                        src={src} 
                        className={`w-full h-full object-cover transition-transform duration-[6s] ease-in-out ${isCurrent ? 'scale-110' : 'scale-100'}`} 
                        alt={`Photo ${idx + 1}`} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-transparent to-transparent opacity-60"></div>
                      
                      {/* Interactive Glass Detail (Only visible on current) */}
                      {isCurrent && (
                        <div className="absolute bottom-10 left-10 right-10 p-6 lg:p-10 glass-nav-card !bg-white/5 !backdrop-blur-3xl rounded-[40px] border border-white/10 group-hover:border-[#D4AF37]/30 transition-all transform hover:scale-[1.02] max-w-lg mx-auto">
                          <p className="text-white font-serif-prestige italic text-lg lg:text-2xl mb-6 leading-relaxed">
                            "Membimbing potensi terbaik setiap siswa."
                          </p>
                          <div className="flex items-center justify-between">
                            <button className="flex items-center space-x-3 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] group tap-feedback !bg-transparent !p-0">
                              <span>Profil</span>
                              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </button>
                            <div className="flex space-x-2">
                              {sliderImages.map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`h-1 rounded-full transition-all duration-500 ${
                                    i === currentIdx ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-white/20'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Background Accent Patterns */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-[#D4AF37]/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default DigitalHeritage;
