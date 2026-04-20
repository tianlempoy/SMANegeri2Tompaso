
import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';
import { getPPDBYear } from '../lib/utils';

const ContactSection: React.FC = () => {
  return (
    <div className="pt-40 pb-20 bg-[#050811]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="w-full lg:w-1/2">
            <span className="text-[#F3C623] font-black tracking-[0.4em] uppercase text-xs mb-6 block">Hubungi Kami</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-10">
              Pusat <br /> <span className="text-white/10">Layanan Sekolah.</span>
            </h1>
            <p className="text-white/40 text-lg font-light leading-relaxed mb-12">
              Tim administrasi kami siap membantu Anda memberikan informasi terkait pendaftaran, administrasi akademik, atau kerjasama institusi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-[#0A0F1E] rounded-[32px] border border-white/5 hover:shadow-2xl transition-all group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#F3C623] mb-6 shadow-sm group-hover:bg-[#F3C623] group-hover:text-[#0A0F1E] transition-all">
                  <Phone className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-widest">Telepon Kantor</h4>
                <p className="text-white/40 text-sm font-medium">+62 813-4062-1225</p>
              </div>
              <div className="p-8 bg-[#0A0F1E] rounded-[32px] border border-white/5 hover:shadow-2xl transition-all group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#F3C623] mb-6 shadow-sm group-hover:bg-[#F3C623] group-hover:text-[#0A0F1E] transition-all">
                  <Mail className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-widest">Email Resmi</h4>
                <p className="text-white/40 text-sm font-medium truncate">smanegeri2tompaso@gmail.com</p>
              </div>
            </div>

            <div className="mt-8 p-8 bg-[#0A0F1E] rounded-[32px] text-white overflow-hidden relative group border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F3C623]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="flex items-start space-x-6 relative z-10">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#F3C623]">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-[#F3C623] mb-2 uppercase text-xs tracking-widest">Jam Operasional Layanan</h4>
                  <p className="text-white/40 text-sm leading-relaxed">Senin - Jumat: 07.15 - 15.00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-[#0A0F1E] p-10 rounded-[48px] border border-white/5 h-full backdrop-blur-xl shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Kirim Pesan Cepat</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-white/5 focus:outline-none focus:border-[#F3C623] focus:bg-white/10 transition-all text-sm text-white" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Subjek</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-white/5 focus:outline-none focus:border-[#F3C623] focus:bg-white/10 transition-all text-sm text-white" placeholder={`PPDB ${getPPDBYear()}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Pesan Anda</label>
                  <textarea rows={5} className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-white/5 focus:outline-none focus:border-[#F3C623] focus:bg-white/10 transition-all text-sm text-white resize-none" placeholder="Tuliskan pertanyaan Anda..."></textarea>
                </div>
                <button className="w-full bg-[#F3C623] text-[#0A0F1E] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center space-x-3 shadow-xl shadow-yellow-500/10">
                  <MessageCircle className="h-5 w-5" />
                  <span>Kirim ke Admin</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Futuristic Map Section */}
        <div className="mt-32 reveal active">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
              <div>
                 <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Lokasi <span className="text-[#F3C623]">Strategis.</span></h2>
                 <p className="text-white/40 text-sm mt-3 font-light tracking-widest uppercase">Jaga IV, Desa Pinabetengan Utara, Kec. Tompaso Barat</p>
              </div>
              <div className="flex items-center space-x-4">
                 <a 
                   href="https://maps.app.goo.gl/F5rvV5EeuyyTcycc9" 
                   target="_blank" 
                   className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#F3C623] hover:text-[#0A0F1E] transition-all flex items-center space-x-3"
                 >
                    <MapPin size={14} />
                    <span>Petunjuk Arah</span>
                 </a>
              </div>
           </div>

           <div className="h-[600px] w-full bg-[#0A0F1E] rounded-[60px] overflow-hidden relative shadow-[0_0_80px_rgba(243,198,35,0.05)] border border-white/5 group">
              {/* Official Interactive Google Map Embed */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.980185932074!2d124.78717767528869!3d1.1744255988143597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x328747a2acab5921%3A0xfbcefa92a829bb2a!2sSMA%20Negeri%202%20Tompaso!5e0!3m2!1sid!2sid!4v1774791366647!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.6) contrast(1.2) grayscale(0.8)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all duration-1000 opacity-40 group-hover:opacity-100 group-hover:invert-0 group-hover:hue-rotate-0 group-hover:brightness-100 group-hover:grayscale-0"
              ></iframe>
              
              {/* Cool Floating Card - Cinematic Design */}
              <div className="absolute top-10 left-10 md:w-[400px] bg-[#0A0F1E]/80 backdrop-blur-2xl p-10 rounded-[40px] border border-white/10 text-white shadow-3xl pointer-events-none transform -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 delay-100 hidden lg:block">
                 <div className="flex items-center space-x-6 mb-8">
                    <div className="w-16 h-16 bg-[#F3C623] rounded-3xl flex items-center justify-center text-[#0A0F1E] shadow-2xl">
                      <Clock size={24} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F3C623]">Waktu Tempuh</p>
                       <p className="text-xl font-black tracking-tighter mt-1">Estimasi Realtime</p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                       <span className="text-xs text-white/40 uppercase font-black tracking-widest">Dari Kawangkoan</span>
                       <span className="text-[#F3C623] font-black text-sm uppercase">± 15 Menit</span>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                       <span className="text-xs text-white/40 uppercase font-black tracking-widest">Dari Tompaso II</span>
                       <span className="text-[#F3C623] font-black text-sm uppercase">± 5 Menit</span>
                    </div>
                 </div>
              </div>

              {/* Bottom Address Badge */}
              <div className="absolute bottom-10 left-10 right-10 bg-[#0A0F1E]/90 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-4xl transform translate-y-20 group-hover:translate-y-0 transition-transform duration-1000">
                 <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#F3C623] to-amber-600 rounded-2xl flex items-center justify-center text-[#0A0F1E] shrink-0 shadow-lg">
                      <MapPin size={28} />
                    </div>
                    <div>
                       <h4 className="font-black text-lg uppercase tracking-tighter text-[#F3C623]">SMA Negeri 2 Tompaso</h4>
                       <p className="text-xs text-white/50 mt-1 font-medium italic tracking-wide">Jaga IV, Pinabetengan Utara, Sulawesi Utara</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-4 w-full md:w-auto">
                    <button className="flex-grow md:flex-none px-10 py-4 bg-[#F3C623] text-[#0A0F1E] rounded-2full font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl">
                       Simpan Lokasi
                    </button>
                    <a 
                      href="https://waze.com/ul?ll=1.1444459,124.8144601&navigate=yes" 
                      target="_blank"
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-blue-500 hover:text-white transition-all"
                    >
                       <MessageCircle size={20} />
                    </a>
                 </div>
              </div>
              
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#F3C623]/10 blur-[80px] -mr-20 -mt-20"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
