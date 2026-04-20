
import React, { useState } from 'react';
import { Sparkles, GraduationCap, Heart, Users, Star, Camera, PenTool, Lightbulb, User, Layout, Image as ImageIcon, Briefcase, Award, ChevronRight, RefreshCw, Quote, ArrowRight, ScrollText, Binary, Video, Play } from 'lucide-react';
import { SCHOOL_ASSETS } from '../constants/assets';

const DeveloperSection: React.FC = () => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const students = [
    { name: 'Christian Lempoy', role: 'Lead Architect', initial: 'CL' },
    { name: 'Matthew Kasangke', role: 'Technical Specialist', initial: 'MK' },
    { name: 'Gratia Lumintang', role: 'Creative Director', initial: 'GL' },
    { name: 'Reva Sambenaung', role: 'System Developer', initial: 'RS' }
  ];

  const supervisors = [
    { name: 'Rosni Lumentah, M.Pd', role: 'Guru Informatika', initial: 'RL' },
    { name: 'Diane E. Langi, S.Pd', role: 'Guru Fisika', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.FISIKA, initial: 'DL' },
    { name: 'David L. Paembonan, S.Pd. Gr', role: 'Guru Matematika', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.MATEMATIK, initial: 'DP' },
    { name: 'Amelia C. Umboh, S.Pd', role: 'Guru Bahasa Indonesia', initial: 'AU' , photo: SCHOOL_ASSETS.TEACHER_PHOTOS.BAHASA_INDONESIA}
  ];

  const memories = Array.from({ length: 15 }, (_, i) => ({
    title: `Dedikasi #${i + 1}`,
    date: 'Fase Pengembangan',
    desc: [
      'Filosofi digital: Mengintegrasikan nilai tradisi ke dalam kode.',
      'Sinergi Visi: Menyelaraskan teknologi dengan moto sekolah.',
      'Fondasi Sistem: Membangun infrastruktur data yang kokoh.',
      'Perspektif Baru: Visualisasi drone untuk keindahan kampus.',
      'Akurasi Data: Manajemen informasi pendidik yang presisi.',
      'Simbol Kualitas: Implementasi badge Akreditasi B yang elegan.',
      'Interaksi Bermartabat: Fitur profil yang informatif dan dinamis.',
      'Optimasi Aksesibilitas: Memastikan performa terbaik di setiap klik.',
      'Harmonisasi Desain: Penyelarasan palet warna premium sekolah.',
      'Peluncuran Perdana: Evolusi digital SMAN 2 Tompaso resmi dimulai.',
      'Inovasi Berkelanjutan: Integrasi sistem pendukung berbasis AI.',
      'Detail Kesempurnaan: Peninjauan kualitas akhir demi standar tinggi.',
      'Integritas Sistem: Keamanan data pendaftar PPDB yang terjamin.',
      'Evaluasi & Refinansi: Tahap akhir penyempurnaan fitur ekspor.',
      'Apresiasi Abadi: Mahakarya ini dipersembahkan untuk almamater.'
    ][i % 15]
  }));

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % memories.length);
  };

  return (
    <div className="py-20 lg:py-40 bg-[#05070A] relative overflow-hidden min-h-screen font-serif-prestige selection:bg-[#C5A059] selection:text-[#0F172A]">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C5A059]/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>
      
      <div className="max-w-[1600px] mx-auto px-6 lg:px-24 relative z-10">
        
        {/* Editorial Header Section */}
        <div className="mb-40 reveal active">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-white/10 pb-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center space-x-4 mb-10">
                <div className="h-px w-12 bg-[#C5A059]"></div>
                <span className="text-[#C5A059] text-[12px] font-black uppercase tracking-[0.8em]">Surat Dari Pengembang</span>
              </div>
              <h1 className="text-[12vw] lg:text-[140px] font-medium text-white tracking-tighter leading-[0.75] mb-12">
                Terima Kasih <br /> <span className="text-[#C5A059] italic font-light lowercase text-[10vw]">smandutop.</span>
              </h1>
            </div>
            
            <div className="lg:max-w-md text-right">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[30px] backdrop-blur-md">
                 <Binary className="text-[#C5A059] mb-4 ml-auto" size={32} />
                 <p className="text-gray-600 text-sm font-light leading-relaxed uppercase tracking-widest">
                    Dikembangkan dengan dedikasi penuh untuk menghadirkan standar baru dalam representasi digital institusi pendidikan di Sulawesi Utara.
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Heartfelt Legacy Message - Professional Letter Style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-64 reveal active">
          <div className="lg:col-span-4">
             <div className="sticky top-40">
                 <div className="p-10 bg-gradient-to-br from-[#C5A059]/20 to-transparent border-l-2 border-[#C5A059] rounded-r-[40px]">
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-6 uppercase tracking-[0.1em]">Warkah <br/>Penghargaan</h2>
                    <div className="flex items-center space-x-4 text-[#C5A059]">
                       <Heart size={24} className="fill-[#C5A059]/20" />
                       <span className="text-xs font-black uppercase tracking-[0.4em]">Dedikasi Alumni 2026</span>
                    </div>
                 </div>
             </div>
          </div>
          
          <div className="lg:col-span-8">
             <div className="relative p-12 lg:p-20 bg-white shadow-2xl rounded-[60px]">
                <Quote className="absolute top-12 left-12 h-16 w-16 text-slate-100 -z-1" />
                <div className="relative z-10 space-y-8 text-gray-600 text-lg lg:text-xl font-light leading-relaxed italic">
                   <p>
                      <strong>Salam Sejahtera bagi kita semua,</strong>
                   </p>
                   <p>
                      Seiring dengan berjalannya waktu, perjalanan kami sebagai siswa di SMA Negeri 2 Tompaso kini telah sampai pada sebuah garis akhir yang penuh makna. Sebagai bentuk pengabdian terakhir sebelum melangkah ke jenjang pendidikan selanjutnya, kami mempersembahkan karya digital ini bukan hanya sebagai representasi sekolah, melainkan sebagai manifestasi dari apa yang telah kami pelajari selama tiga tahun terakhir.
                   </p>
                   <p>
                      Website ini dirancang dengan visi untuk menjembatani antara tradisi pendidikan yang bermartabat dengan kemajuan teknologi masa depan. Kami percaya bahwa di era digital ini, akses informasi yang cepat, akurat, dan estetis adalah hak bagi seluruh warga sekolah dan masyarakat luas. Melalui aplikasi ini, kami menitipkan semangat inovasi bagi generasi penerus agar terus mengharumkan nama sekolah SMA NEGERI 2 TOMPASO.
                   </p>
                   <p>
                      Terima kasih yang mendalam kami haturkan kepada Kepala Sekolah SMAN 2 Tompaso, Bapak <strong>Junus N. M. Akay, S.Pd, M.Si</strong>, yang telah memberikan kepercayaan luar biasa kepada kami. Terima kasih juga kepada para mentor hebat kami: Bapak <strong>David Paembonan, S.Pd.Gr</strong>, Ibu <strong>Rosni Lumentah, M.Pd</strong>, Ibu <strong>Diane E. Langi, S.Pd</strong>, dan Ibu <strong>Amelia Umboh, S.Pd</strong> yang telah membimbing kami melampaui batas kemampuan yang kami bayangkan.
                   </p>
                   <p>
                      Segala ilmu, nilai kedisiplinan, dan semangat <em>Cerdas, Terampil, Bermartabat</em> yang kami dapatkan di sekolah ini akan senantiasa menjadi suluh dalam perjalanan hidup kami selanjutnya. Kami bangga menjadi bagian dari keluarga besar Smandutop.
                   </p>
                   <p>
                      Besar harapan kami agar mahakarya digital ini dapat terus dikembangkan dan memberikan manfaat abadi bagi kemajuan almamater tercinta, SMA Negeri 2 Tompaso.
                   </p>
                   <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <p className="font-black text-slate-900 uppercase tracking-widest text-sm">Hormat Kami,</p>
                        <p className="text-gray-600 text-xs uppercase tracking-widest">Kelompok 1 - Angkatan 2026</p>
                      </div>
                      <div className="flex space-x-3">
                         {[1, 2, 3].map(i => <Heart key={i} size={16} className="text-red-500 fill-red-500/20" />)}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Development Team Grid - Improved Layout */}
        <div className="mb-64">
           <div className="flex flex-col items-center mb-24 reveal active text-center">
              <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.5em] mb-6">Expertise & Passion</span>
              <h2 className="text-5xl lg:text-7xl font-medium text-white tracking-tighter leading-none mb-12 italic">The <span className="text-[#C5A059] font-light">Faces</span> Behind.</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {students.map((student, i) => (
                <div key={i} className="group relative bg-white/5 border border-white/5 rounded-[60px] p-12 hover:bg-white/[0.08] hover:border-[#C5A059]/40 transition-all duration-700 reveal active shadow-4xl hover:-translate-y-6" style={{ transitionDelay: `${i * 0.1}s` }}>
                   <div className="absolute top-10 right-10 bg-[#C5A059] text-[#0F172A] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                      2026
                   </div>
                   <div className="relative aspect-square mb-12 overflow-hidden rounded-[45px] bg-[#111] border border-white/10 flex items-center justify-center text-7xl font-black text-white/5 group-hover:text-[#C5A059]/30 transition-all duration-1000">
                      <span className="relative z-10">{student.initial}</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-transparent"></div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-[#C5A059]/10 to-transparent"></div>
                   </div>
                   <h3 className="text-white text-3xl font-black tracking-tighter mb-4 leading-none group-hover:text-[#C5A059] transition-colors uppercase italic">{student.name}</h3>
                   <div className="flex items-center space-x-4">
                      <div className="w-8 h-px bg-[#C5A059]/40"></div>
                      <p className="text-gray-600 text-[11px] uppercase font-bold tracking-[0.3em] group-hover:text-white transition-colors">{student.role}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Memory Gallery - Subtle Professional Style */}
        <div className="mb-64">
           <div className="flex flex-col items-center mb-24 reveal active text-center">
              <span className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em] mb-6 inline-block">Linimasa Dedikasi</span>
              <h2 className="text-5xl lg:text-8xl font-medium text-white tracking-tighter leading-none mb-12 italic">Langkah <span className="text-[#C5A059] font-light">Perubahan.</span></h2>
           </div>

           <div className="relative h-[650px] lg:h-[800px] flex items-center justify-center pt-20">
              <div className="relative w-full max-w-[500px] h-full" onClick={handleNextPhoto}>
                 {memories.map((memo, i) => {
                   const offset = (i - activePhotoIndex + memories.length) % memories.length;
                   if (offset > 4 && offset < memories.length - 1) return null;
                   
                   const isTop = offset === 0;
                   const zIndex = memories.length - offset;
                   const opacity = offset === 0 ? 1 : 1 - (offset * 0.25);
                   const scale = 1 - (offset * 0.08);
                   const rotation = isTop ? 0 : (offset % 2 === 0 ? offset * 3 : -offset * 3);
                   const translateY = offset * -20;

                   return (
                     <div 
                       key={i}
                       style={{ 
                         zIndex,
                         opacity,
                         transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
                         transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                       }}
                       className={`absolute inset-0 bg-gradient-to-br from-white to-slate-50 p-6 lg:p-10 shadow-5xl rounded-[50px] cursor-pointer ${isTop ? 'border-2 border-[#C5A059]/20' : 'border border-slate-200'} backdrop-blur-sm`}
                     >
                        <div className="aspect-[4/5] bg-slate-900 mb-8 relative overflow-hidden flex items-center justify-center text-gray-600 rounded-[35px] group">
                           <ImageIcon size={64} strokeWidth={1} />
                           <div className="absolute top-8 left-8 bg-[#C5A059] text-[#0F172A] w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-4 border-white shadow-xl">
                              {i + 1}
                           </div>
                           <div className="absolute inset-0 bg-gradient-to-t from-[#05070A]/80 to-transparent"></div>
                        </div>
                        <div className="space-y-4 px-4">
                           <div className="flex justify-between items-center">
                              <div>
                                 <p className="text-slate-900 font-black text-2xl tracking-tighter mb-1 uppercase italic leading-none">{memo.title}</p>
                                 <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">{memo.date}</p>
                              </div>
                              <div className="text-slate-200">
                                 <RefreshCw size={24} className={isTop ? 'animate-spin-slow' : ''} />
                              </div>
                           </div>
                           <p className="text-gray-600 text-sm lg:text-lg font-light italic leading-relaxed pt-6 border-t border-slate-100">
                              "{memo.desc}"
                           </p>
                        </div>
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>

        {/* Live Discovery - Cinematic Drone Background Section */}
        <div className="mb-64 reveal active">
          <div className="relative rounded-[60px] lg:rounded-[100px] overflow-hidden min-h-[600px] lg:h-[800px] shadow-4xl group border border-white/10">
            {/* Video Background */}
            <div className="absolute inset-0 z-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
              <iframe
                src="https://www.youtube.com/embed/joyPbz8Qbjs?si=94IZnghY31EzmQYT&autoplay=1&mute=1&loop=1&playlist=joyPbz8Qbjs&controls=0&rel=0&modestbranding=1"
                title="SMAN 2 Tompaso Discovery"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78%] h-[177.78%] min-w-full min-h-full opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/40 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-[#05070A]/30 z-10 group-hover:bg-transparent transition-colors"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-8 lg:p-20">
               <div className="inline-flex items-center space-x-6 bg-white/5 backdrop-blur-2xl border border-white/10 px-10 py-4 rounded-full mb-12 transform group-hover:-translate-y-4 transition-transform duration-700 shadow-2xl">
                  <Video className="h-4 w-4 text-[#C5A059] animate-pulse" />
                  <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.8em]">Live Discovery v2.0</span>
               </div>
               
               <h2 className="text-4xl md:text-[80px] font-medium text-white tracking-tighter leading-[1.1] mb-8 italic transform group-hover:-translate-y-2 transition-transform duration-1000">
                 Terima Kasih <br /> 
                 <span className="text-[#C5A059] font-light not-italic text-[30px] md:text-[60px] block mt-4 uppercase tracking-[0.3em]">SMA NEGERI <span className="inline-block [font-variant-numeric:lining-nums]">2</span> TOMPASO</span>
               </h2>
               
               <p className="max-w-4xl text-slate-300 text-lg lg:text-2xl font-light italic leading-relaxed mb-16 transform group-hover:translate-y-4 transition-transform duration-700 transition-delay-150">
                 "Dedikasi tanpa batas untuk almamater tercinta, dipersembahkan melalui simfoni visual mahakarya arsitektur digital."
               </p>

               <div className="flex flex-col sm:flex-row items-center gap-8 transform group-hover:translate-y-2 transition-transform duration-500">
                  <button className="bg-white text-primary px-16 py-8 rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#C5A059] hover:text-white transition-all shadow-3xl flex items-center space-x-6 active:scale-95 group/btn">
                    <span>Lihat Mahakarya</span>
                    <Play className="h-5 w-5 fill-current group-hover/btn:scale-125 transition-transform" />
                  </button>
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Cinematic 4K Stream</span>
                  </div>
               </div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-12 left-12 z-30 opacity-20 pointer-events-none hidden lg:block">
               <div className="w-32 h-32 border-t-2 border-l-2 border-[#C5A059] rounded-tl-[40px]"></div>
            </div>
            <div className="absolute bottom-12 right-12 z-30 opacity-20 pointer-events-none hidden lg:block">
               <div className="w-32 h-32 border-b-2 border-r-2 border-[#C5A059] rounded-br-[40px]"></div>
            </div>
          </div>
        </div>

        {/* Supervisors Section - Clean & Professional */}
        <div className="max-w-[1400px] mx-auto pb-40">
           <div className="flex items-center space-x-12 mb-32 reveal active">
              <h2 className="text-5xl lg:text-7xl font-medium text-white tracking-tighter leading-none shrink-0 italic">Guiding <span className="text-[#C5A059]">Lights.</span></h2>
              <div className="h-px flex-grow bg-white/10 relative">
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#C5A059] rounded-full blur-sm opacity-50"></div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
              {supervisors.map((teacher, i) => (
                <div key={i} className="group reveal active" style={{ transitionDelay: `${i * 0.1}s` }}>
                   <div className="relative mb-10 aspect-[4/5] rounded-[50px] overflow-hidden bg-white/5 border border-white/10 group-hover:border-[#C5A059]/40 transition-all duration-1000 shadow-3xl">
                      {teacher.photo ? (
                        <img src={teacher.photo} alt={teacher.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0d121d] text-white/5 text-6xl font-black">
                          {teacher.initial}
                        </div>
                      )}
                      
                      {/* Professional Info Overlay */}
                      <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-[#05070A] via-[#05070A]/80 to-transparent">
                          <h4 className="text-white font-black text-2xl tracking-tighter mb-2 transform group-hover:-translate-y-2 transition-transform duration-700">{teacher.name}</h4>
                          <p className="text-[#C5A059] text-[9px] uppercase font-bold tracking-[0.4em] transform group-hover:-translate-y-2 transition-transform duration-700 delay-75">{teacher.role}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Final CTA/Sign off */}
        <div className="text-center pb-40 reveal active border-t border-white/5 pt-40">
           <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group inline-flex flex-col items-center space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[1em] text-[#C5A059]">Back to Beginning</span>
              <div className="p-8 rounded-full border border-white/10 group-hover:bg-[#C5A059] group-hover:text-[#0F172A] transition-all transform group-hover:scale-110 shadow-2xl relative">
                 <div className="absolute inset-0 bg-[#C5A059]/10 rounded-full blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <ArrowRight className="-rotate-90 relative z-10" size={32} />
              </div>
           </button>
        </div>

      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 15s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .shadow-5xl {
           box-shadow: 0 70px 150px -30px rgba(0,0,0,0.8);
        }
      `}</style>
    </div>
  );
};

export default DeveloperSection;
