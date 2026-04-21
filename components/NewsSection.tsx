
import React, { useState, useEffect } from 'react';
import { ChevronRight, X, Loader2, Bookmark, Sparkles, Minus, ArrowLeft, Clock } from 'lucide-react';
import { NewsItem } from '../types.js';
import { fetchNewsRealtime } from '../lib/actions';
import { SCHOOL_THEME } from '../constants/theme';
import NewsShareButtons from './NewsShareButtons';

const NewsSection: React.FC<{ isFullPage?: boolean }> = ({ isFullPage = false }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedNews) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedNews]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const modal = document.getElementById('news-reader-modal');
      if (modal) {
        const totalHeight = modal.scrollHeight - modal.clientHeight;
        const progress = (modal.scrollTop / totalHeight) * 100;
        setReadingProgress(progress);
      }
    };

    const modal = document.getElementById('news-reader-modal');
    if (modal) {
      modal.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (modal) modal.removeEventListener('scroll', handleScroll);
    };
  }, [selectedNews]);

  useEffect(() => {
    // Subscribe ke realtime updates
    const unsubscribe = fetchNewsRealtime((data) => {
      setNews(data);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Trigger reveal animations saat data berubah
    if (!loading && news.length > 0) {
      setTimeout(() => {
        const reveals = document.querySelectorAll('.news-reveal');
        reveals.forEach(el => el.classList.add('active'));
      }, 100);
    }
  }, [loading, news]);

  const featuredNews = news[0];
  const sideNews = news.slice(1, 4);

  return (
    <section id="warta" className={`py-20 lg:py-48 bg-gradient-to-br from-[#FDFCFB] via-blue-50/20 to-[#E8D5B7] relative overflow-hidden ${isFullPage ? 'pt-32 lg:pt-64' : ''}`}>
        <div className="glow-orb glow-gold w-[300px] h-[300px] lg:w-[800px] lg:h-[800px] -top-20 -left-20 opacity-[0.08]"></div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[120px] -mr-20"></div>

      
      <div className="max-w-[1700px] mx-auto px-5 lg:px-16 relative z-10">
        
        {/* Editorial Title Block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-32 gap-6 news-reveal reveal">
          <div className="space-y-3 lg:space-y-8">
            <div className="flex items-center space-x-3 lg:space-x-6">
              <div className="h-[1px] w-10 lg:w-20 bg-[#D4AF37]"></div>
              <span className="text-[7px] lg:text-[10px] font-black uppercase tracking-[0.4em] lg:tracking-[0.8em] text-[#D4AF37]">Berita Terbaru</span>
            </div>
            <h2 className="text-[11vw] md:text-7xl lg:text-[140px] font-black text-[#0A0F1E] tracking-tighter leading-[0.9] lg:leading-[0.75]">
              BERITA <br /> 
              <span className="font-serif-prestige italic font-light text-gray-200 lowercase tracking-normal">sekolah</span>
            </h2>
          </div>
          <div className="max-w-sm w-full lg:text-right">
             <p className="text-gray-600 text-base lg:text-xl font-light italic leading-relaxed mb-4 lg:mb-8">
               "Merekam setiap langkah transformasi SMAN 2 Tompaso menuju masa depan."
             </p>
             <div className="flex lg:justify-end">
                <button className="flex items-center space-x-3 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-[#0A0F1E] group border-b border-[#D4AF37]/30 pb-1 hover:text-[#D4AF37] transition-colors active:scale-95">
                  <span>Arsip Berita</span>
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-2 transition-transform" />
                </button>
             </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
             <Loader2 className="animate-spin text-[#D4AF37] h-8 w-8 mb-4" />
             <p className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-400/60">Mensinkronisasi...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
            
            {/* FEATURED STORY */}
            {featuredNews && (
              <div 
                className="lg:col-span-7 group cursor-pointer news-reveal reveal tap-feedback rounded-[40px] p-2"
                onClick={() => setSelectedNews(featuredNews)}
              >
                <div className="relative rounded-[30px] lg:rounded-[60px] overflow-hidden aspect-[4/3] lg:aspect-[16/11] mb-6 lg:mb-12 shadow-xl bg-gradient-to-br from-white to-blue-50/50 border border-blue-100/50 transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(212,175,55,0.15)]">
                  <img 
                    src={featuredNews.image_url} 
                    alt={featuredNews.title} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/70 via-transparent to-transparent opacity-90 lg:opacity-60"></div>
                  
                  <div className="absolute top-5 left-5 lg:top-10 lg:left-10 bg-white/10 backdrop-blur-xl px-3 py-1.5 lg:px-6 lg:py-3 rounded-full border border-white/20 flex items-center space-x-2 lg:space-x-3">
                    <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                    <span className="text-[7px] lg:text-[9px] font-black uppercase tracking-widest text-white">{featuredNews.category}</span>
                  </div>
                </div>
                
                <div className="space-y-3 lg:space-y-6 px-4">
                  <div className="flex items-center space-x-3 lg:space-x-6 text-[8px] lg:text-[10px] font-black text-[#D4AF37] tracking-widest uppercase">
                    <span>{featuredNews.date}</span>
                    <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                    <span>{featuredNews.author_name}</span>
                  </div>
                  <h3 className="text-3xl lg:text-7xl font-black text-[#0A0F1E] tracking-tighter leading-[1] lg:leading-[0.9] group-hover:text-[#D4AF37] transition-colors duration-500">
                    {featuredNews.title}
                  </h3>
                  <p className="text-gray-600 text-base lg:text-2xl font-light leading-relaxed line-clamp-2 italic font-serif-prestige">
                    "{featuredNews.excerpt}"
                  </p>
                </div>
              </div>
            )}

            {/* SIDE ARTICLES */}
            <div className="lg:col-span-5 space-y-10 lg:space-y-16">
               <div className="flex items-center justify-between border-b border-gray-100 pb-4 lg:pb-8 mb-6 lg:mb-12 news-reveal reveal">
                 <h4 className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Pilihan Redaksi</h4>
                 <Bookmark className="h-4 w-4 text-[#D4AF37]" />
               </div>
               
               <div className="space-y-8 lg:space-y-20">
                 {sideNews.map((item, idx) => (
                   <div 
                    key={item.id} 
                    className="group cursor-pointer flex gap-5 lg:gap-10 items-start news-reveal reveal hover-card-gold p-4 rounded-[30px] news-card"
                    onClick={() => setSelectedNews(item)}
                   >
                     <div className="shrink-0 w-20 h-20 lg:w-40 lg:h-40 rounded-[20px] lg:rounded-[35px] overflow-hidden bg-gradient-to-br from-white to-blue-50/50 border border-blue-100/50 group-active:rotate-3 transition-transform">
                        <img src={item.image_url} className="w-full h-full object-cover transition-all duration-700" alt="" />
                     </div>
                     <div className="space-y-1 lg:space-y-4 pt-1">
                        <span className="text-[7px] lg:text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em] lg:tracking-[0.4em]">{item.category}</span>
                        <h5 className="text-lg lg:text-2xl font-black text-[#0A0F1E] leading-tight group-hover:text-[#D4AF37] transition-colors line-clamp-2 tracking-tight">
                          {item.title}
                        </h5>
                        <div className="flex items-center space-x-3 text-[7px] lg:text-[9px] font-bold text-gray-300 uppercase tracking-widest group-hover:text-[#0A0F1E] transition-colors">
                           <span>{item.date}</span>
                           <Minus className="h-2 w-2" />
                           <span className="underline decoration-[#D4AF37]">Detail</span>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>

      {/* READER MODAL — PREMIUM EDITORIAL DESIGN */}
      {selectedNews && (
        <div 
          id="news-reader-modal"
          className="fixed inset-0 z-[2000] bg-white overflow-y-auto scroll-smooth animate-in fade-in duration-500"
        >
          {/* Progress Bar (Sticky) */}
          <div className="fixed top-0 left-0 w-full h-1 z-[2200] bg-gray-100">
            <div 
              className="h-full bg-[#D4AF37] transition-all duration-150 ease-out"
              style={{ width: `${readingProgress}%` }}
            />
          </div>

          {/* Elegant Top Navigation */}
          <div className="sticky top-0 z-[2100] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 lg:px-20 py-4 flex justify-between items-center">
            <button 
              onClick={() => setSelectedNews(null)} 
              className="group flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#0A0F1E] hover:text-[#D4AF37] transition-colors"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-2 transition-transform" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
            </button>
            <div className="flex items-center gap-4">
               <span className="hidden md:block text-[9px] font-black uppercase tracking-widest text-gray-300">
                 Sekarang Membaca: {selectedNews.category}
               </span>
               <button 
                 onClick={() => setSelectedNews(null)} 
                 className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-[#0A0F1E] hover:text-white flex items-center justify-center transition-all shadow-sm"
               >
                 <X className="h-5 w-5" />
               </button>
            </div>
          </div>
          
          <article className="max-w-4xl mx-auto px-5 lg:px-0 pt-16 pb-32">
             {/* Header Section */}
             <div className="text-center mb-16 lg:mb-24 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4AF37]/10 rounded-full">
                  <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em]">{selectedNews.category}</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-premium-display text-[#0A0F1E] leading-[1.1] tracking-tight">
                  {selectedNews.title}
                </h1>
                
                <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-8 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0A0F1E] text-white flex items-center justify-center text-[10px] font-black">
                      {selectedNews.author_name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-900">{selectedNews.author_name}</span>
                  </div>
                  <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">{selectedNews.date}</span>
                  <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-blue-500">
                    <Clock className="h-3 w-3" />
                    <span>{Math.ceil(selectedNews.content.split(' ').length / 200)} Menit Baca</span>
                  </div>
                </div>
             </div>

             {/* Featured Image */}
             <div className="relative mb-16 lg:mb-24 -mx-5 lg:mx-0">
                <div className="aspect-[16/9] overflow-hidden rounded-none lg:rounded-[40px] shadow-2xl">
                  <img src={selectedNews.image_url} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="absolute -bottom-6 right-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden lg:block">
                  <NewsShareButtons newsItem={selectedNews} compact />
                </div>
             </div>

             {/* Article Content */}
             <div className="max-w-2xl mx-auto">
                <p className="text-2xl lg:text-3xl font-serif-prestige italic text-gray-400 leading-relaxed mb-12 border-l-4 border-[#D4AF37] pl-8">
                  "{selectedNews.excerpt}"
                </p>
                
                <div className="prose-custom text-[#0A0F1E] text-lg lg:text-xl leading-[1.8] whitespace-pre-line font-serif-prestige">
                  {/* Styling khusus huruf pertama (Drop Cap) */}
                  <span className="float-left text-7xl font-black text-[#D4AF37] mr-3 mt-2 leading-none">
                    {selectedNews.content.charAt(0)}
                  </span>
                  {selectedNews.content.substring(1)}
                </div>
                
                {/* Footer Sharing */}
                <div className="mt-24 pt-12 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-[40px] p-8 lg:p-12">
                    <NewsShareButtons newsItem={selectedNews} />
                  </div>
                </div>

                {/* Related News Selection */}
                <div className="mt-24 space-y-10">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#0A0F1E]">Baca Berita Lainnya</h3>
                    <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {news.filter(n => n.id !== selectedNews.id).slice(0, 2).map(related => (
                      <div 
                        key={related.id} 
                        onClick={() => {
                          setSelectedNews(related);
                          document.getElementById('news-reader-modal')?.scrollTo(0,0);
                        }}
                        className="group cursor-pointer space-y-4"
                      >
                        <div className="aspect-[16/10] overflow-hidden rounded-[24px] bg-gray-100">
                          <img src={related.image_url} className="w-full h-full object-cover transition-all duration-500 scale-105 group-hover:scale-110" alt="" />
                        </div>
                        <h4 className="font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors leading-tight">{related.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Back Link */}
                <div className="mt-24 text-center">
                  <button 
                    onClick={() => { 
                      window.scrollTo({ top: 0, behavior: 'smooth' }); 
                      setSelectedNews(null); 
                    }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#0A0F1E] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all active:scale-95"
                  >
                    Tutup Artikel
                  </button>
                </div>
             </div>
          </article>
        </div>
      )}
    </section>
  );
};

export default NewsSection;
