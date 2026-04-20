import React from 'react';
import { Eye, Heart, Play, Sparkles, Loader2 } from 'lucide-react';
import { fetchGallery, fetchGalleryRealtime } from '../lib/actions';
import { GalleryImage } from '../types.js';

const StudentGallery: React.FC = () => {
  const [dbImages, setDbImages] = React.useState<GalleryImage[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsub = fetchGalleryRealtime((data) => {
      setDbImages(data);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, []);

  // Generate items for images 1-46 and video
  const imageItems = Array.from({ length: 46 }, (_, i) => ({
    title: `Dokumentasi Sekolah ${i + 1}`,
    author: '',
    src: `/galeri/galeri-${i + 1}.jpeg`,
    likes: Math.floor(Math.random() * 150 + 50).toString(),
    type: 'image'
  }));

  const kepsekPhotos = [
    'WhatsApp Image 2026-04-18 at 08.36.58 (1).jpeg',
    'WhatsApp Image 2026-04-18 at 08.36.58.jpeg',
    'WhatsApp Image 2026-04-18 at 08.36.59 (1).jpeg',
    'WhatsApp Image 2026-04-18 at 08.36.59.jpeg',
    'WhatsApp Image 2026-04-18 at 08.37.00 (1).jpeg',
    'WhatsApp Image 2026-04-18 at 08.37.00 (2).jpeg',
    'WhatsApp Image 2026-04-18 at 08.37.00.jpeg',
    'WhatsApp Image 2026-04-18 at 08.37.01 (1).jpeg',
    'WhatsApp Image 2026-04-18 at 08.37.01 (2).jpeg',
    'WhatsApp Image 2026-04-18 at 08.37.01.jpeg',
    'WhatsApp Image 2026-04-18 at 08.37.02.jpeg'
  ];

  const kepsekItems = kepsekPhotos.map((file, i) => ({
    title: `Dokumentasi Sekolah ${i + 47}`,
    src: `/kepsek/${file}`,
    likes: Math.floor(Math.random() * 150 + 50).toString(),
    type: 'image'
  }));

  const mappedDbItems = dbImages.map(img => ({
    title: img.title || 'Galeri Sekolah',
    src: img.image_url,
    likes: '128',
    type: 'image'
  }));

  const allItems = [...mappedDbItems, { title: 'Highlight Video', src: '/galeri/galeri-video-1.mp4', likes: '342', type: 'video' }, ...imageItems, ...kepsekItems];

  return (
    <div className="pt-40 pb-32 bg-[#F8FAFC]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="mb-32 text-center">
          <div className="inline-flex items-center space-x-2 bg-yellow-400/10 px-4 py-2 rounded-full mb-8 border border-yellow-400/20">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-yellow-600 font-bold uppercase tracking-[0.2em] text-[10px]">Documentation Hub</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-[#0A0F1E] tracking-tighter leading-[0.85] mb-12">
            Visual <br /> <span className="text-gray-300">Archives.</span>
          </h1>
          <p className="text-gray-600 text-2xl font-light max-w-3xl mx-auto leading-relaxed">
            Eksplorasi jejak langkah, prestasi, dan momen transformasi di SMAN 2 Tompaso melalui lensa dokumentasi kami.
          </p>
        </div>

        {/* Professional Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
          {allItems.map((item, i) => (
            <div 
              key={i} 
              className="break-inside-avoid group relative rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 bg-white border border-gray-100"
              style={{ animationDelay: `${i * 50}ms` }}
            >
               {item.type === 'video' ? (
                 <div className="relative aspect-video">
                   <video 
                     src={item.src} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                     muted
                     loop
                     onMouseOver={e => (e.target as HTMLVideoElement).play()}
                     onMouseOut={e => (e.target as HTMLVideoElement).pause()}
                   />
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white">
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                   </div>
                 </div>
               ) : (
                 <div className="relative overflow-hidden">
                   <img 
                     src={item.src} 
                     alt={item.title} 
                     className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
                     loading="lazy"
                   />
                 </div>
               )}
               
               {/* Overlay Info - Modern Glassmorphism */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-end">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                        <div className="h-1 w-8 bg-yellow-400 rounded-full"></div>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-white border border-white/20">
                         <Heart className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                         <span className="text-[10px] font-bold">{item.likes}</span>
                      </div>
                    </div>
                  </div>
               </div>
               
               {/* Quick View Button */}
               <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                  <div className="w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center text-[#0A0F1E] shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
                    <Eye className="h-5 w-5" />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentGallery;
