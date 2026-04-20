
import React from 'react';
import { Trophy, Award, Medal, Star, ArrowRight } from 'lucide-react';

const AchievementsShowcase: React.FC = () => {
  const accomplishments = [
    { title: 'JUARA 1 TKT PROVINSI', category: 'OLAHRAGA', year: '2024', desc: 'Meraih juara 1 tkt provinsi' },
    { title: 'PASKIBRAKA MINAHASA', category: 'KEPEMIMPINAN', year: '2025', desc: 'Paskibraka Kabupaten Minahasa Tahun 2025' },
    { title: 'JUARA 1 LOMBA RENANG', category: 'OLAHRAGA', year: '2024', desc: 'Meraih juara 1 lomba renang' },
  ];

  return (
    <section className="py-24 sm:py-36 md:py-48 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 sm:mb-24 md:mb-32 gap-6 sm:gap-8 lg:gap-10">
          <div>
            <span className="text-[#F3C623] font-black tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] uppercase text-[8px] sm:text-[9px] md:text-[10px] mb-4 sm:mb-6 block">Hall of Excellence</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-black text-[#0A0F1E] tracking-tighter leading-none">
              Etalase <br /> <span className="text-gray-200 text-2xl sm:text-3xl md:text-4xl lg:text-6xl">Kebanggaan.</span>
            </h2>
          </div>
          <p className="max-w-xs sm:max-w-sm text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg font-light leading-relaxed">
            Dedikasi tanpa henti dalam mengejar standar tertinggi prestasi akademik maupun karakter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {accomplishments.map((acc, i) => (
            <div key={i} className="group relative bg-[#F8F9FB] p-8 sm:p-10 md:p-12 lg:p-16 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] lg:rounded-[64px] border border-gray-100 hover:bg-[#0A0F1E] transition-all duration-700 hover:-translate-y-4">
               <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center text-[#F3C623] mb-6 sm:mb-8 md:mb-12 shadow-sm group-hover:rotate-12 transition-transform flex-shrink-0">
                 <Trophy className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10" />
               </div>
               <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#F3C623] uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-2 sm:mb-3 md:mb-4 block">{acc.category}</span>
               <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-[#0A0F1E] group-hover:text-white mb-4 sm:mb-5 md:mb-6 transition-colors">{acc.title}</h4>
               <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm font-light leading-relaxed mb-6 sm:mb-8 md:mb-10 group-hover:text-white/40 transition-colors">"{acc.desc}"</p>
               <div className="flex items-center justify-between pt-6 sm:pt-7 md:pt-8 border-t border-gray-100 group-hover:border-white/10">
                  <span className="text-lg sm:text-xl md:text-2xl font-black text-gray-200 group-hover:text-[#F3C623]">{acc.year}</span>
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-gray-200 group-hover:text-[#F3C623]" />
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsShowcase;
