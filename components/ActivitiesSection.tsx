import React from 'react';
import { Code, Flag, Map, Heart, Trophy, Activity, Target, Users } from 'lucide-react';
import { SCHOOL_THEME } from '../constants/theme';
import { fetchActivities, fetchActivitiesRealtime } from '../lib/actions';
import { Activity as ActivityType } from '../types.js';

const ActivitiesSection: React.FC = () => {
  const [activities, setActivities] = React.useState<ActivityType[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fallbackActivities = [
    { title: 'Coding Camp', cat: 'Teknologi', desc: 'Pengembangan kemampuan pemrograman dan literasi digital masa depan.' },
    { title: 'Paskibraka', cat: 'Kepemimpinan', desc: 'Pembentukan karakter, disiplin, dan cinta tanah air melalui baris-berbaris.' },
    { title: 'Pramuka', cat: 'Kepanduan', desc: 'Membangun kemandirian, kerjasama tim, dan ketangkasan di alam terbuka.' },
    { title: 'Kerohanian', cat: 'Spiritual', desc: 'Pendalaman nilai-nilai keagamaan dan penguatan karakter moral siswa.' },
    { title: 'Sepakbola', cat: 'Olahraga', desc: 'Mengasah teknik sepakbola, strategi tim, dan sportivitas tinggi.' },
    { title: 'Voli', cat: 'Olahraga', desc: 'Pengembangan bakat bola voli dan kerjasama dalam tim yang solid.' },
    { title: 'Tenis Meja', cat: 'Olahraga', desc: 'Latihan ketangkasan, reaksi cepat, dan konsentrasi melalui tenis meja.' },
  ];

  React.useEffect(() => {
    const unsub = fetchActivitiesRealtime((data) => {
      setActivities(data.length > 0 ? data : fallbackActivities);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, []);

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('coding')) return <Code />;
    if (t.includes('paskibra')) return <Flag />;
    if (t.includes('pramuka')) return <Map />;
    if (t.includes('kerohanian')) return <Heart />;
    if (t.includes('sepakbola')) return <Trophy />;
    if (t.includes('voli')) return <Activity />;
    return <Target />;
  };

  return (
    <section className="py-24 sm:py-36 md:py-48 bg-gradient-to-br from-[#FDFCFB] via-blue-50/20 to-[#E8D5B7] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-blue-400/10 rounded-full blur-[100px] sm:blur-[120px] md:blur-[150px] -mr-20 sm:-mr-30 md:-mr-40 -mt-20 sm:-mt-30 md:-mt-40"></div>
      <div className="absolute bottom-0 left-0 w-[250px] sm:w-[300px] md:w-[400px] h-[250px] sm:h-[300px] md:h-[400px] bg-[#C5A059]/10 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] -ml-10 sm:-ml-15 md:-ml-20 -mb-10 sm:-mb-15 md:-mb-20"></div>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        <div className="mb-16 sm:mb-24 md:mb-32 flex flex-col lg:flex-row justify-between items-end gap-6 sm:gap-10 md:gap-16">
          <div className="reveal active">
            <span className="text-[#C5A059] font-black tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] uppercase text-[8px] sm:text-[9px] md:text-[10px] mb-4 sm:mb-6 md:mb-8 block">Holistic Ecosystem</span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-[110px] font-medium text-[#0F172A] tracking-tighter leading-none font-serif-prestige">
              Ekstrakurikuler <br /> <span className="text-blue-300/40 italic font-light lowercase text-xl sm:text-2xl md:text-3xl lg:text-4xl">SMA NEGERI 2 TOMPASO</span>
            </h2>
          </div>
          <div className="max-w-sm sm:max-w-md lg:text-right reveal active">
            <p className="text-blue-400/60 text-sm sm:text-base md:text-lg lg:text-2xl font-light italic leading-relaxed font-serif-prestige">
              "Menyediakan ruang eksplorasi tanpa batas di mana minat dan bakat bertransformasi menjadi kompetensi nyata."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {activities.map((act: any, i) => (
            <div key={i} className="group p-6 sm:p-8 md:p-10 lg:p-14 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] reveal active bg-gradient-to-br from-white to-blue-50/50 border border-blue-100/30 hover:shadow-[0_20px_60px_rgba(197,160,89,0.15)] transition-all duration-700" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-[20px] sm:rounded-[25px] md:rounded-[30px] bg-gradient-to-br from-blue-50 to-[#E8D5B7]/30 group-hover:bg-[#0F172A] flex items-center justify-center text-[#C5A059] group-hover:text-white mb-6 sm:mb-8 md:mb-12 shadow-sm transition-all duration-700">
                {act.icon || getIcon(act.title)}
              </div>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#C5A059] tracking-[0.3em] sm:tracking-[0.35em] md:tracking-[0.4em] uppercase mb-2 sm:mb-3 md:mb-4 block">{act.cat || act.category}</span>
              <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] mb-4 sm:mb-6 md:mb-8 transition-colors tracking-tight">{act.title}</h4>
              <p className="text-blue-400/60 text-xs sm:text-sm md:text-base lg:text-lg font-light italic font-serif-prestige leading-relaxed">
                "{act.desc || act.description}"
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ActivitiesSection;

