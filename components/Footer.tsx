
import React from 'react';
import { Shield, Globe, Mail, Phone } from 'lucide-react';
import { SCHOOL_THEME } from '../constants/theme';
import { getCurrentYear, getAcademicYear } from '../lib/utils';

interface FooterProps {
  onAdminClick?: () => void;
  onDeveloperClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, onDeveloperClick }) => {
  return (
    <footer className="bg-white py-12 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-20 border-t border-slate-100">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 md:gap-16 lg:gap-20 mb-12 sm:mb-20 md:mb-24">
          
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-[#0F172A] tracking-tight">SMAN 2 <span className="text-[#C5A059]">TOMPASO</span></span>
              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-gray-600 mt-1 sm:mt-2">Pendidikan Menengah Unggul</span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed uppercase tracking-widest max-w-[300px]">
              Jaga IV, Desa Pinabetengan Utara,<br/>
              Kec. Tompaso Barat, Kab. Minahasa,<br/>
              Sulawesi Utara.<br/>
              Dedikasi untuk Keunggulan.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <h4 className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#C5A059]">Pusat Layanan</h4>
            <ul className="space-y-3 sm:space-y-4 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#0F172A]">
              <li><a href="#" className="hover:text-[#C5A059] transition-colors">HUB PENDAFTARAN</a></li>
              <li><a href="#" className="hover:text-[#C5A059] transition-colors">JEJARING ALUMNI</a></li>
              <li><a href="#" className="hover:text-[#C5A059] transition-colors">PORTAL SIAKAD</a></li>
            </ul>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <h4 className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#C5A059]">Data & Kontak</h4>
            <ul className="space-y-3 sm:space-y-4 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] text-[#0F172A]">
              <li className="flex items-center space-x-2 sm:space-x-3"><Shield size={10} className="text-[#C5A059] flex-shrink-0" /> <span>NPSN: 40100892</span></li>
              <li className="flex items-center space-x-2 sm:space-x-3"><Globe size={10} className="text-[#C5A059] flex-shrink-0" /> <span>Akreditasi: B</span></li>
              <li className="flex items-center space-x-2 sm:space-x-3 lowercase"><Mail size={10} className="text-[#C5A059] flex-shrink-0" /> <span className="uppercase truncate max-w-[160px] sm:max-w-none">smanegeri2tompaso@gmail.com</span></li>
            </ul>
          </div>

          <div className="space-y-6 sm:space-y-8 md:space-y-10">
             <button onClick={onAdminClick} className="group w-full flex items-center justify-center sm:justify-start space-x-3 bg-[#0F172A] text-white px-6 sm:px-8 py-4 sm:py-5 rounded-lg sm:rounded-full hover:bg-[#C5A059] transition-all shadow-xl">
               <Shield size={14} className="flex-shrink-0" />
               <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden sm:inline">Administrator</span>
             </button>
          </div>
        </div>

        <div className="pt-8 sm:pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] text-gray-600 gap-4 sm:gap-0">
           <p>© {getCurrentYear()} SMA Negeri 2 Tompaso</p>
           <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-6 mt-4 sm:mt-0 text-center sm:text-left">
             <span className="flex items-center"><Globe size={10} className="mr-1 sm:mr-2" /> XII F2 {getAcademicYear()}</span>
             <span className="hidden sm:block h-4 w-px bg-slate-200"></span>
             <button onClick={() => onDeveloperClick?.()} className="hover:text-[#C5A059] transition-colors mt-2 sm:mt-0">Dibuat Oleh Kelompok 1 XII F2</button>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
