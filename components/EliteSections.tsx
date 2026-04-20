
import React, { useState } from 'react';
import { Cpu, Globe2, Zap, ArrowRight, Target, BookOpen, GraduationCap, Microscope } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Status Sekolah', value: 'B', sub: 'Akreditasi BAN-S/M' },
    { label: 'Penyelesaian Studi', value: '100%', sub: 'Target Kelulusan' },
    { label: 'Deep Learning', value: '99%', sub: 'Pembelajaran Mendalam' },
    { label: 'Pengembangan Diri', value: '15+', sub: 'Ekstrakurikuler Aktif' },
  ];

  return (
    <div className="py-32 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-32">
          {stats.map((s, i) => (
            <div key={i} className="group cursor-default reveal active">
              <p className="text-5xl md:text-[100px] lg:text-[130px] font-black text-[#0F172A] tracking-tighter leading-none transition-all duration-1000 group-hover:text-[#C5A059]">
                {s.value}
              </p>
              <div className="h-1 w-12 lg:w-20 bg-[#C5A059] my-6 lg:my-10 transition-all duration-1000 group-hover:w-full"></div>
              <p className="text-[#0F172A] font-black text-[10px] lg:text-[12px] uppercase tracking-[0.5em] mb-2">{s.label}</p>
              <p className="text-gray-600 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest italic">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CareerPathExplorer: React.FC = () => {
  const [selected, setSelected] = useState<string | null>('misi-1');

  const visi = "Terwujudnya peserta didik yang beriman, bernalar kritis, mandiri, kreatif, dan peduli lingkungan.";

  const misiList = [
    {
      id: 'misi-1',
      number: '1',
      title: 'Keimanan & Akhlak',
      desc: 'Menanamkan nilai-nilai keimanan dan akhlak mulia melalui kegiatan pembelajaran, pembiasaan, dan budaya religius di sekolah.'
    },
    {
      id: 'misi-2',
      number: '2',
      title: 'Berpikir Kritis',
      desc: 'Menyelenggarakan pembelajaran yang mendorong kemampuan berpikir kritis, analitis, dan logis sesuai tuntutan perkembangan ilmu pengetahuan dan teknologi.'
    },
    {
      id: 'misi-3',
      number: '3',
      title: 'Kemandirian',
      desc: 'Mengembangkan kemandirian peserta didik dalam belajar, berorganisasi, dan mengambil keputusan yang bertanggung jawab.'
    },
    {
      id: 'misi-4',
      number: '4',
      title: 'Kreativitas & Inovasi',
      desc: 'Mendorong terciptanya kreativitas dan inovasi peserta didik dalam bidang akademik maupun non-akademik melalui pembelajaran, proyek, serta kegiatan ekstrakurikuler.'
    },
    {
      id: 'misi-5',
      number: '5',
      title: 'Kepedulian Lingkungan',
      desc: 'Menumbuhkan kepedulian terhadap lingkungan sosial dan alam sekitar melalui pembiasaan program lingkungan hidup serta kegiatan sosial kemasyarakatan.'
    },
    {
      id: 'misi-6',
      number: '6',
      title: 'Budaya Inklusif',
      desc: 'Membangun budaya sekolah yang inklusif, kolaboratif, dan berorientasi pada pengembangan potensi peserta didik secara optimal.'
    }
  ];

  return (
    <div className="py-40 bg-[#0F172A] relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="reveal active">
            <div className="inline-flex items-center space-x-6 bg-white/5 px-8 py-3 rounded-full mb-12 border border-white/10">
              <Target className="h-4 w-4 text-[#C5A059]" />
              <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.5em]">Fondasi Institusi</span>
            </div>
            <h2 className="text-[10vw] lg:text-[110px] font-medium text-white tracking-tighter leading-[0.8] mb-16 font-serif-prestige">
              Visi <br /> <span className="text-gray-600 italic font-light lowercase text-[8vw]">Misi Sekolah.</span>
            </h2>
            <div className="space-y-4">
              {misiList.map(m => (
                <button 
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`w-full p-6 rounded-[30px] border transition-all duration-700 flex items-center justify-between group ${
                    selected === m.id ? 'bg-[#C5A059] border-[#C5A059] text-[#0F172A]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-6">
                    <div className={`w-12 h-12 rounded-full font-black text-sm flex items-center justify-center transition-all duration-700 ${
                      selected === m.id ? 'bg-[#0F172A]/30 text-[#0F172A]' : 'bg-white/10 text-white/60'
                    }`}>
                      {m.number}
                    </div>
                    <div className="text-left">
                      <p className="font-black text-xs lg:text-sm uppercase tracking-widest">{m.title}</p>
                    </div>
                  </div>
                  <ArrowRight className={`h-5 w-5 transition-all duration-700 ${selected === m.id ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className={`relative min-h-[500px] flex items-center justify-center transition-all duration-1000`}>
            <div className="bg-white/5 backdrop-blur-3xl w-full rounded-[60px] p-16 lg:p-24 relative z-10 border border-white/10 shadow-3xl">
              <div className="space-y-12">
                <div>
                  <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Visi</span>
                  <h3 className="text-3xl lg:text-5xl font-medium text-white mb-8 leading-[1.2] font-serif-prestige">
                    <span className="text-[#C5A059] italic font-light">"{visi}"</span>
                  </h3>
                </div>
                
                {selected && (
                  <div className="space-y-8 pt-8 border-t border-white/10">
                    <div>
                      <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Misi Nomor {misiList.find(m => m.id === selected)?.number}</p>
                      <p className="text-white text-xl lg:text-2xl font-black uppercase tracking-wider mb-6">{misiList.find(m => m.id === selected)?.title}</p>
                    </div>
                    <p className="text-slate-300 text-base lg:text-lg font-light leading-relaxed font-serif-prestige">
                      "{misiList.find(m => m.id === selected)?.desc}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
