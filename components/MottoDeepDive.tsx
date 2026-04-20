import React from 'react';
import { Brain, Zap, Heart, Sparkles } from 'lucide-react';
import { SCHOOL_ASSETS } from '../constants/assets';
import { SCHOOL_THEME } from '../constants/theme';

const MottoDeepDive: React.FC = () => {
  const pillars = [
    {
      title: SCHOOL_THEME.CONTENT.PHILOSOPHY.CERDAS.title.toUpperCase(),
      desc: SCHOOL_THEME.CONTENT.PHILOSOPHY.CERDAS.desc,
      icon: <Brain className="h-8 w-8" />,
      tag: 'INTELLECT',
      color: 'glow-gold'
    },
    {
      title: SCHOOL_THEME.CONTENT.PHILOSOPHY.TERAMPIL.title.toUpperCase(),
      desc: SCHOOL_THEME.CONTENT.PHILOSOPHY.TERAMPIL.desc,
      icon: <Zap className="h-8 w-8" />,
      tag: 'MASTERY',
      color: 'glow-navy'
    },
    {
      title: SCHOOL_THEME.CONTENT.PHILOSOPHY.BERMARTABAT.title.toUpperCase(),
      desc: SCHOOL_THEME.CONTENT.PHILOSOPHY.BERMARTABAT.desc,
      icon: <Heart className="h-8 w-8" />,
      tag: 'ETHICS',
      color: 'glow-gold'
    }
  ];

  return (
    <section className="py-24 lg:py-40 bg-gradient-to-br from-[#FDFCFB] via-blue-50/20 to-[#E8D5B7] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[150px] -ml-40 -mt-40"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#C5A059]/10 rounded-full blur-[120px] -mr-20 -mb-20"></div>
      <div className="max-w-[1800px] mx-auto px-6 lg:px-24 relative z-10">
        
        {/* Header Section dengan Layout yang Seimbang */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center mb-16 lg:mb-24 gap-12 lg:gap-16">
          
          {/* Text Content - Kiri dengan font premium tanpa italic */}
          <div className="reveal lg:flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-4 lg:space-x-6 mb-8 lg:mb-12">
              <div className="h-[1px] w-16 lg:w-28 bg-gradient-to-r from-[#C5A059] via-[#C5A059]/50 to-transparent"></div>
              <span className="font-premium text-[10px] lg:text-[11px] font-semibold tracking-[0.4em] lg:tracking-[0.6em] uppercase text-[#C5A059]/80">Visi Pembangunan</span>
            </div>
            
            {/* Teks utama dengan font premium - tanpa italic/sambung */}
            <div className="space-y-2 lg:space-y-3">
              {/* Menuju Sulut Maju - dengan font premium yang kuat dan clean */}
              <h2 className="font-premium text-[7vw] md:text-[40px] lg:text-[52px] xl:text-[60px] font-bold text-[#0F172A] tracking-tight leading-[1.1]">
                Menuju Sulut
              </h2>
              <h2 className="font-premium text-[7vw] md:text-[40px] lg:text-[52px] xl:text-[60px] font-bold text-[#0F172A] tracking-tight leading-[1.1]">
                Maju,
              </h2>
              
              {/* Sejahtera & Berkelanjutan - dengan font premium display tanpa italic */}
              <div className="pt-3 lg:pt-5">
                <p className="font-premium-display text-[6vw] md:text-[32px] lg:text-[42px] xl:text-[50px] font-semibold text-[#C5A059] tracking-tight leading-[1.15]">
                  Sejahtera <span className="text-gray-600 font-light mx-3">&</span> Berkelanjutan
                </p>
              </div>
            </div>
            
            {/* Garis dekoratif */}
            <div className="mt-10 lg:mt-14 flex items-center justify-center lg:justify-start space-x-4">
              <div className="h-[2px] w-20 lg:w-40 bg-gradient-to-r from-[#C5A059] via-[#C5A059]/60 to-transparent"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></div>
            </div>
          </div>
          
          {/* Sovereign Model Image - Kanan, tanpa kotak, ukuran lebih kecil */}
          <div className="reveal lg:flex-1 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Container tanpa background/border */}
              <div className="relative w-[240px] md:w-[340px] lg:w-[400px] xl:w-[450px]">
                
                {/* Image dengan object-contain */}
                <img 
                  src={SCHOOL_ASSETS.SOVEREIGN_MODEL} 
                  alt="Sovereign Identity" 
                  fetchPriority="high"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-700 group-hover:scale-105 group-hover:drop-shadow-[0_30px_50px_rgba(0,0,0,0.18)]"
                />
                
                {/* Decorative elements - subtle */}
                <div className="absolute -top-6 -right-6 w-24 h-24 border border-[#C5A059]/20 rounded-full hidden lg:block"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-200/20 rounded-full blur-2xl hidden lg:block"></div>
                
                {/* Floating accent dots */}
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#C5A059] rounded-full shadow-lg animate-pulse"></div>
                <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-md"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quote dengan font premium */}
        <div className="flex justify-center lg:justify-start mb-16 lg:mb-24">
          <div className="relative max-w-2xl reveal">
            <div className="absolute -top-6 -left-6 text-7xl text-[#C5A059]/20 font-premium-display">"</div>
            <p className="font-premium text-gray-600/90 text-lg lg:text-xl font-medium leading-relaxed pl-10 border-l-[3px] border-[#C5A059]/40 tracking-normal">
              Membangun harmoni antara kecanggihan akal dan kemurnian hati untuk mewujudkan generasi unggul yang berwawasan lingkungan.
            </p>
            <div className="absolute -bottom-4 right-0 text-5xl text-[#C5A059]/20 font-premium-display">"</div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 reveal">
          {pillars.map((p, i) => (
            <div key={i} className="group relative p-8 lg:p-12 rounded-[30px] lg:rounded-[50px] bg-gradient-to-br from-white to-blue-50/50 border border-blue-100/30 hover:shadow-[0_25px_80px_rgba(197,160,89,0.2)] transition-all duration-700 overflow-hidden">
              
              {/* Background accent on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C5A059]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="mb-6 lg:mb-10 flex items-center justify-between relative z-10">
                <div className="w-14 h-14 lg:w-18 lg:h-18 rounded-2xl lg:rounded-3xl bg-[#0A0F1E] flex items-center justify-center text-[#D4AF37] shadow-xl group-hover:scale-110 transition-transform duration-500">
                  {p.icon}
                </div>
                <div className="flex items-center space-x-2 text-[9px] lg:text-[11px] font-black text-[#C5A059] tracking-[0.3em] lg:tracking-[0.4em]">
                   <Sparkles className="h-3 w-3" />
                   <span>{p.tag}</span>
                </div>
              </div>
              
              <h3 className="font-premium text-2xl lg:text-4xl font-bold text-[#0F172A] mb-4 lg:mb-6 tracking-tight relative z-10">{p.title}</h3>
              <p className="font-premium text-blue-400/70 text-sm lg:text-base font-medium leading-relaxed mb-6 lg:mb-10 relative z-10">
                "{p.desc}"
              </p>
              
              <div className="h-0.5 lg:h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#C5A059] to-transparent transition-all duration-1000"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MottoDeepDive;
