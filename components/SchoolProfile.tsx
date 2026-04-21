import React, { useState, useEffect } from 'react';
import { Target, Compass, Book, Brain, Zap, Heart, ShieldCheck, Crown, UserCheck, ChevronRight } from 'lucide-react';
import { SCHOOL_ASSETS } from '../constants/assets';
import { SCHOOL_THEME } from '../constants/theme';
import { fetchOSISRealtime } from '../lib/actions';

const SchoolProfile: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [osisMembers, setOsisMembers] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Subscribe to OSIS members
    const unsubscribe = fetchOSISRealtime((data) => {
      if (data && data.length > 0) {
        setOsisMembers(data);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const mottoValues = [
    {
      title: SCHOOL_THEME.CONTENT.PHILOSOPHY.CERDAS.title,
      desc: SCHOOL_THEME.CONTENT.PHILOSOPHY.CERDAS.desc,
      icon: <Brain className="h-8 w-8" />,
      color: SCHOOL_THEME.CONTENT.PHILOSOPHY.CERDAS.color
    },
    {
      title: SCHOOL_THEME.CONTENT.PHILOSOPHY.TERAMPIL.title,
      desc: SCHOOL_THEME.CONTENT.PHILOSOPHY.TERAMPIL.desc,
      icon: <Zap className="h-8 w-8" />,
      color: SCHOOL_THEME.CONTENT.PHILOSOPHY.TERAMPIL.color
    },
    {
      title: SCHOOL_THEME.CONTENT.PHILOSOPHY.BERMARTABAT.title,
      desc: SCHOOL_THEME.CONTENT.PHILOSOPHY.BERMARTABAT.desc,
      icon: <Heart className="h-8 w-8" />,
      color: SCHOOL_THEME.CONTENT.PHILOSOPHY.BERMARTABAT.color
    }
  ];

  // Map from DB if available, otherwise use static theme data
  const osisLeadership = osisMembers.length > 0 
    ? osisMembers.map(member => ({
        name: member.nama,
        role: member.jabatan,
        photo: member.photo_url,
        icon: member.jabatan.toLowerCase().includes('ketua') ? <Crown /> : <UserCheck />
      }))
    : SCHOOL_THEME.CONTENT.LEADERSHIP.map(leader => ({
        name: leader.name,
        role: leader.role,
        photo: leader.photo,
        icon: leader.icon === 'Crown' ? <Crown /> : leader.icon === 'UserCheck' ? <UserCheck /> : leader.icon === 'Book' ? <Book /> : <ShieldCheck />
      }));

  return (
    <div className="bg-[#FDFCFB]">
      {/* Profile Section Header - With Principal Photo */}
      <section className="relative pt-32 pb-32 overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0 opacity-60">
          <img src={SCHOOL_ASSETS.HERO_BUILDING} className="w-full h-full object-cover grayscale-[10%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/60 to-[#0F172A]/30"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Principal Photo */}
            <div className="reveal flex justify-center lg:justify-start">
              <div className="relative w-72 h-96 lg:w-80 lg:h-[450px] group">
                <div className="absolute inset-0 border-2 border-[#C5A059]/20 rounded-[40px] -m-4"></div>
                <div className="relative h-full w-full bg-white p-4 rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="w-full h-full overflow-hidden rounded-[30px] bg-slate-50 relative">
                    <img 
                      src={SCHOOL_ASSETS.PRINCIPAL_PHOTO} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-1000" 
                      alt="Kepala Sekolah" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Principal Welcome Text */}
            <div className="reveal text-center lg:text-left">
              <span className="bg-gradient-to-r from-[#C5A059] to-blue-500 bg-clip-text text-transparent font-black tracking-[0.6em] uppercase text-[10px] mb-6 block">Sambutan Kepala Sekolah</span>
              <h1 className="text-5xl md:text-7xl font-medium text-white mb-8 tracking-tighter leading-tight font-serif-prestige">
                Selamat <br /> <span className="text-blue-400 italic font-light lowercase">Datang.</span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed font-serif-prestige italic">
                Platform digital ini kami persembahkan sebagai jembatan komunikasi yang membawa Anda lebih dekat dengan SMA Negeri 2 Tompaso. Mari bersama-sama membangun masa depan yang {SCHOOL_THEME.CONTENT.MOTTO.toLowerCase()}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Gold when scrolled */}
      <section className={`py-40 transition-colors duration-700 ${isScrolled ? 'bg-gradient-to-br from-[#E8D5B7] to-blue-50' : 'bg-gradient-to-br from-white to-blue-50/30'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="reveal">
              <h2 className={`text-5xl font-black ${isScrolled ? 'text-[#0F172A]' : 'text-[#0F172A]'} tracking-tighter mb-12 uppercase italic`}>VISI <span className={isScrolled ? 'bg-gradient-to-r from-[#B39548] to-blue-500 bg-clip-text text-transparent' : 'text-blue-600'}>KAMI.</span></h2>
              <p className={`text-4xl font-serif-prestige italic ${isScrolled ? 'text-[#0F172A]' : 'text-black'} leading-tight border-l-4 ${isScrolled ? 'border-blue-500' : 'border-blue-400'} pl-10 py-2`}>
                "{SCHOOL_THEME.CONTENT.VISION}"
              </p>
            </div>
            <div className="reveal" style={{ transitionDelay: '0.2s' }}>
              <h2 className={`text-5xl font-black ${isScrolled ? 'text-[#0F172A]' : 'text-[#0F172A]'} tracking-tighter mb-12 uppercase italic`}>MISI <span className={isScrolled ? 'bg-gradient-to-r from-[#B39548] to-blue-500 bg-clip-text text-transparent' : 'text-blue-600'}>UTAMA.</span></h2>
              <ul className="space-y-10">
                {SCHOOL_THEME.CONTENT.MISSION.map((misi, i) => (
                  <li key={i} className="flex items-start space-x-6 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${isScrolled ? 'bg-blue-100 text-blue-600' : 'bg-blue-100 text-blue-600'} group-hover:bg-blue-600 group-hover:text-white`}>
                      <ChevronRight size={18} />
                    </div>
                    <p className={`text-xl font-light leading-snug transition-colors ${isScrolled ? 'text-[#0F172A]' : 'text-black group-hover:text-[#0F172A]'}`}>{misi}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy - Gold Accents or Enhanced Gold on Scroll */}
      <section className={`py-40 transition-colors duration-700 ${isScrolled ? SCHOOL_THEME.STYLES.BACKGROUND_GRADIENT.replace('from-[#FDFCFB]', 'from-[#E8D5B7]').replace('to-blue-50/30', 'via-blue-100 to-[#D4C1A3]') : 'bg-gradient-to-b from-[#FDFCFB] via-white to-blue-50/20'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32 reveal">
            <span className="text-[#C5A059] font-black tracking-[0.5em] uppercase text-[10px] mb-4 block">KEPALA SEKOLAH</span>
            <h2 className={`text-5xl md:text-7xl font-black ${isScrolled ? 'text-[#0F172A]' : 'text-[#0F172A]'} tracking-tighter leading-none`}>Filosofi <br/><span className={isScrolled ? 'bg-gradient-to-r from-[#0F172A] to-blue-600 bg-clip-text text-transparent underline decoration-[#0F172A]/20' : 'text-blue-600 underline decoration-blue-400/40'}>Pendidikan.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {mottoValues.map((motto, idx) => (
              <div key={idx} className={`ivory-card p-16 rounded-[60px] group reveal transition-all duration-700 ${isScrolled ? 'bg-white/30 border border-blue-200/50 backdrop-blur-sm' : 'bg-gradient-to-br from-white to-blue-50'}`}>
                <div className={`mb-12 w-20 h-20 rounded-[30px] flex items-center justify-center shadow-sm transform group-hover:rotate-12 transition-all duration-700 ${
                  isScrolled ? 'bg-blue-100 text-blue-600' : motto.color
                }`}>
                  {motto.icon}
                </div>
                <h4 className={`text-3xl font-black mb-6 tracking-tight transition-colors ${isScrolled ? 'text-[#0F172A]' : 'text-[#0F172A]'}`}>{motto.title}</h4>
                <p className={`leading-relaxed font-light italic font-serif-prestige text-lg transition-colors ${isScrolled ? 'text-[#0F172A]' : 'text-black'}`}>
                  "{motto.desc}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School History Section */}
      <section className={`py-40 transition-colors duration-700 ${isScrolled ? 'bg-gradient-to-r from-[#E8D5B7] via-blue-50 to-blue-100' : 'bg-gradient-to-r from-white via-blue-50/20 to-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-32 reveal">
            <span className="text-[#C5A059] font-black tracking-[0.5em] uppercase text-[10px] mb-4 block">Jejak Sejarah</span>
            <h2 className={`text-5xl md:text-7xl font-black ${isScrolled ? 'text-[#0F172A]' : 'text-[#0F172A]'} tracking-tighter leading-none`}>Perjalanan <br/><span className={isScrolled ? 'bg-gradient-to-r from-[#0F172A] to-blue-600 bg-clip-text text-transparent underline decoration-blue-400/40' : 'text-blue-600 underline decoration-blue-300/50'}>Kami.</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal space-y-8">
              <div className={`p-10 rounded-[40px] border-l-4 transition-all ${isScrolled ? 'bg-white/30 border-blue-500' : 'bg-gradient-to-r from-white to-blue-50 border-blue-400'}`}>
                <h3 className={`text-2xl font-black mb-4 ${isScrolled ? 'text-[#0F172A]' : 'text-[#0F172A]'}`}>Didirikan dengan Visi</h3>
                <p className={`text-lg leading-relaxed font-light ${isScrolled ? 'text-[#0F172A]' : 'text-black'}`}>
                  SMA Negeri 2 Tompaso hadir sebagai bentuk dedikasi pemerintah untuk menghadirkan pendidikan berkualitas di wilayah Tompaso Barat. Kami berkomitmen membentuk lulusan yang tidak hanya unggul secara akademik, tetapi juga memiliki integritas dan budi pekerti luhur.

                </p>
              </div>

              <div className={`p-10 rounded-[40px] border-l-4 transition-all ${isScrolled ? 'bg-white/30 border-blue-500' : 'bg-gradient-to-r from-white to-blue-50 border-blue-400'}`}>
                <h3 className={`text-2xl font-black mb-4 ${isScrolled ? 'text-[#0F172A]' : 'text-[#0F172A]'}`}>Warisan Prestasi</h3>
                <p className={`text-lg leading-relaxed font-light ${isScrolled ? 'text-[#0F172A]' : 'text-black'}`}>
                 Selama bertahun-tahun, sekolah kami telah menjadi tempat bertumbuhnya generasi muda yang berprestasi. Banyak alumni kami yang kini telah berkontribusi nyata di berbagai sektor, mulai dari pemerintahan, pendidikan, hingga dunia profesional di Sulawesi Utara dan sekitarnya.
                </p>
              </div>

              <div className={`p-10 rounded-[40px] border-l-4 transition-all ${isScrolled ? 'bg-white/30 border-blue-500' : 'bg-gradient-to-r from-white to-blue-50 border-blue-400'}`}>
                <h3 className={`text-2xl font-black mb-4 ${isScrolled ? 'text-[#0F172A]' : 'text-[#0F172A]'}`}>Tradisi Minahasa</h3>
                <p className={`text-lg leading-relaxed font-light ${isScrolled ? 'text-[#0F172A]' : 'text-black'}`}>
                  Kami menanamkan semangat Mapalus (gotong royong) sebagai fondasi utama interaksi di sekolah. Melalui kolaborasi antara guru, siswa, dan orang tua, kami menciptakan lingkungan belajar yang suportif dan kekeluargaan.
                </p>
              </div>
            </div>

            <div className={`reveal p-12 rounded-[40px] transition-all ${isScrolled ? 'bg-gradient-to-br from-white/40 to-blue-100/40 border border-blue-200/60' : 'bg-gradient-to-br from-white to-blue-50 border border-blue-200'}`}>
              <h3 className={`text-3xl font-black mb-8 bg-gradient-to-r from-[#0F172A] to-blue-600 bg-clip-text text-transparent`}>Milestone Penting</h3>
              <ul className="space-y-6">
                {[
                  { year: '2003', event: 'Pendirian Sekolah SMA Negeri 2 Tompaso' },
                  { year: '2003', event: 'Izin Operasional' },
                  { year: '2023/2024', event: 'Implementasi Kurikulum Merdeka' },
                  { year: '2024', event: 'Penetapan Sekolah Penggerak' },
                  { year: '2026', event: 'Transformasi Digital' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-6 group">
                    <span className={`text-2xl font-black min-w-fit bg-gradient-to-r from-[#C5A059] to-blue-500 bg-clip-text text-transparent`}>{item.year}</span>
                    <div className={`border-l-2 pl-6 transition-colors ${isScrolled ? 'border-blue-400/40' : 'border-blue-400/50'}`}>
                      <p className={`text-lg font-light leading-relaxed ${isScrolled ? 'text-[#0F172A]' : 'text-black'}`}>{item.event}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section - Gold on Scroll */}
      <section className={`py-40 transition-colors duration-700 ${isScrolled ? 'bg-gradient-to-l from-[#D4C1A3] via-blue-100/40 to-[#D4C1A3]' : 'bg-gradient-to-b from-white to-blue-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24 reveal">
            <span className="text-[#C5A059] font-black tracking-[0.6em] uppercase text-[10px] mb-6 block">Student Leadership</span>
            <h2 className={`text-5xl md:text-7xl font-black ${isScrolled ? 'text-[#0F172A]' : 'text-[#0F172A]'} tracking-tighter leading-none`}>Suara <br /><span className={`${isScrolled ? 'bg-gradient-to-r from-[#B39548] to-blue-600 bg-clip-text text-transparent italic' : 'text-blue-600 italic'}`}>Siswa.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {osisLeadership.map((leader, i) => (
              <div key={i} className={`group p-8 rounded-[48px] hover:-translate-y-4 transition-all duration-700 reveal ${isScrolled ? 'bg-white/30 hover:bg-blue-600' : 'bg-gradient-to-br from-white to-blue-50 hover:bg-blue-600'}`}>
                {/* Photo Placeholder */}
                <div className="relative w-full aspect-[4/5] mb-6 rounded-[32px] overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-dashed border-blue-300/50 flex flex-col items-center justify-center group-hover:border-white/30 transition-colors">
                  {/* Placeholder Icon */}
                  {leader.photo ? (
                    <img 
                      src={leader.photo} 
                      alt={leader.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors ${isScrolled ? 'bg-blue-200/50 text-blue-500' : 'bg-blue-100 text-blue-400'}`}>
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors shadow-sm ${isScrolled ? 'bg-gradient-to-br from-[#C5A059] to-blue-500 text-white group-hover:bg-blue-700' : 'bg-gradient-to-br from-blue-400 to-[#C5A059] text-white group-hover:bg-blue-700 group-hover:text-white'}`}>
                  {leader.icon}
                </div>
                <span className="text-[9px] font-black bg-gradient-to-r from-[#C5A059] to-blue-600 bg-clip-text text-transparent tracking-[0.3em] uppercase mb-2 block">{leader.role}</span>
                <h4 className={`text-xl font-black transition-colors ${isScrolled ? 'text-[#0F172A] group-hover:text-white' : 'text-[#0F172A] group-hover:text-white'}`}>{leader.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolProfile;

