
import React from 'react';
import { GraduationCap, MapPin, Award, ArrowUpRight } from 'lucide-react';

const AlumniSuccess: React.FC = () => {
  const universities = [
    { name: 'Universitas Indonesia', loc: 'Depok', logo: 'UI' },
    { name: 'Institut Teknologi Bandung', loc: 'Bandung', logo: 'ITB' },
    { name: 'Universitas Gadjah Mada', loc: 'Yogyakarta', logo: 'UGM' },
    { name: 'Universitas Sam Ratulangi', loc: 'Manado', logo: 'UNSRAT' },
    { name: 'IPB University', loc: 'Bogor', logo: 'IPB' },
    { name: 'Monash University', loc: 'Melbourne', logo: 'MONASH' }
  ];

  return (
    <section className="py-40 lg:py-64 bg-[#FDFCFB] relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-20 relative z-10">
        <div className="text-center mb-32 space-y-8 reveal">
          <div className="inline-flex items-center space-x-6">
            <div className="h-[1px] w-12 bg-[#C5A059]"></div>
            <span className="text-[#C5A059] font-black tracking-[0.8em] uppercase text-[10px]">Jejak Keberhasilan</span>
            <div className="h-[1px] w-12 bg-[#C5A059]"></div>
          </div>
          <h2 className="text-6xl md:text-[110px] font-black text-[#0F172A] tracking-tighter leading-none">
            GERBANG <br /> <span className="text-slate-200 italic font-serif-prestige font-light lowercase text-[9vw]">masa depan.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-32">
          {universities.map((uni, i) => (
            <div key={i} className="group p-10 bg-white rounded-[40px] border border-slate-100 hover:border-[#C5A059]/40 hover:shadow-2xl transition-all duration-700 text-center flex flex-col items-center justify-center reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0F172A] font-black text-xs mb-6 group-hover:bg-[#C5A059] group-hover:text-white transition-all shadow-sm">
                {uni.logo}
              </div>
              <h4 className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest leading-tight mb-2">{uni.name}</h4>
              <div className="flex items-center space-x-2 text-slate-300 group-hover:text-[#C5A059] transition-colors">
                <MapPin size={10} />
                <span className="text-[8px] font-bold uppercase tracking-widest">{uni.loc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="bg-[#0F172A] rounded-[60px] lg:rounded-[80px] p-12 lg:p-24 text-white relative overflow-hidden group reveal">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10">
              <GraduationCap className="h-12 w-12 text-[#C5A059] mb-12" />
              <h3 className="text-4xl lg:text-6xl font-black tracking-tighter mb-8">95% Lulusan <br/><span className="text-[#C5A059]">Terserap.</span></h3>
              <p className="text-gray-600 text-xl lg:text-3xl font-light italic leading-relaxed font-serif-prestige mb-12">
                "Alumni kami melanjutkan pendidikan ke berbagai universitas negeri dan swasta terbaik dengan persentase kelulusan seleksi nasional yang tinggi."
              </p>
              <button className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059] hover:text-white transition-colors group/btn">
                <span>Database Alumni</span>
                <ArrowUpRight className="h-4 w-4 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[60px] lg:rounded-[80px] p-12 lg:p-24 border border-slate-100 shadow-3xl relative overflow-hidden reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <Award className="h-12 w-12 text-[#C5A059] mb-12" />
                <h3 className="text-4xl lg:text-6xl font-black text-[#0F172A] tracking-tighter mb-8 italic font-serif-prestige">Testimoni <br/> <span className="text-slate-200">Alumni.</span></h3>
                <p className="text-gray-600 text-xl lg:text-3xl font-light italic leading-relaxed font-serif-prestige">
                  "SMAN 2 Tompaso bukan hanya tempat belajar, tapi tempat membentuk visi hidup yang bermartabat."
                </p>
              </div>
              <div className="mt-12 pt-12 border-t border-slate-50 flex items-center space-x-6">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-[#C5A059] font-black text-xl">D</div>
                <div>
                  <h4 className="font-black text-[#0F172A] text-lg uppercase tracking-tight">Dr. Michael Sumendap</h4>
                  <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mt-1">Alumni • Angkatan 2012</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlumniSuccess;
