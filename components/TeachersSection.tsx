import React, { useState } from 'react';
import { User, Award, GraduationCap, Briefcase, Loader2, FileText, Send, ArrowUpRight, CloudUpload } from 'lucide-react';
import { SCHOOL_ASSETS } from '../constants/assets';
import { SCHOOL_THEME } from '../constants/theme';

interface Teacher {
  name: string;
  role: string;
  type: 'kepala' | 'guru' | 'staf';
  photo?: string;
}

const DEFAULT_TEACHERS: Teacher[] = [
  { name: 'Junus N. M. Akay, S.Pd, M.Si', role: 'Kepala Sekolah', type: 'kepala' },
  { name: 'Nofie Kalengkongan, S.Pd', role: 'Guru PJOK', type: 'guru' , photo: SCHOOL_ASSETS.TEACHER_PHOTOS.PJOK },
  { name: 'Eireine E. Mukuan, S.Pd', role: 'Guru Bahasa Inggris', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.BAHASA_INGGRIS },
  { name: 'Rike Tulenan, S.Pd', role: 'Guru Biologi', type: 'guru' , photo: SCHOOL_ASSETS.TEACHER_PHOTOS.BIOLOGI},  
  { name: 'Diane E. Langi, S.Pd', role: 'Guru Fisika', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.FISIKA },
  { name: 'Amelia C. Umboh, S.Pd', role: 'Guru Bahasa Indonesia', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.BAHASA_INDONESIA },
  { name: 'Djenly Pajow, S.Pd', role: 'Guru Sejarah', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.DJENLY },
  { name: 'David L. Paembonan, S.Pd. Gr', role: 'Guru Matematika', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.MATEMATIK },
  { name: 'Eva I. Sepang, S.Pd', role: 'Guru Bahasa Jerman', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.EVA_SEPANG },
  { name: 'Junita Takalamingang, S.Pd', role: 'Guru Kimia', type: 'guru' , photo: SCHOOL_ASSETS.TEACHER_PHOTOS.KIMIA},  
  { name: 'Rosni Lumentah, M.Pd', role: 'Guru Informatika', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.ROSNI },
  { name: 'Natalia Mareska Siri, S.Pd.K', role: 'Guru Agama', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.AGAMA },
  { name: 'Merina M. Sumerah, S.Pd', role: 'Guru Kimia', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.MERINA },
  { name: 'Maria Y. Keles, S.Pd', role: 'Guru Ekonomi', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.EKONOMI },
  { name: 'Elsa Palar, S.Pd', role: 'Guru PPKN', type: 'guru' , photo: SCHOOL_ASSETS.TEACHER_PHOTOS.PPKN},
  { name: 'Victory M. Roring, S.Kom', role: 'Kepala TU / TIK', type: 'staf', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.VICTORY },
  { name: 'Ruly L. Kaparang, S.Pd', role: 'Guru Geografi', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.RULY },
  { name: 'Friskila R. M. Kolibu, S.Pd', role: 'Guru Biologi', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.RIYANI_SEPANG },
  { name: 'Silveria Jessica Umboh, S.Pd', role: 'Guru Sosiologi', type: 'guru', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.SOSIOLOGI },
  { name: 'Ocktaviani E. Laloan, S.AB', role: 'Staff TU', type: 'staf', photo: SCHOOL_ASSETS.TEACHER_PHOTOS.OKTAVIA },
];

const TeacherCard: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
  const isPrincipal = teacher.type === 'kepala';
  const [imgLoading, setImgLoading] = useState(true);
  
  return (
    <div className={`group relative overflow-hidden transition-all duration-500 ${
      isPrincipal ? 'col-span-full mb-12' : ''
    }`}>
      <div className={`p-8 rounded-[40px] border border-gray-100 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
        isPrincipal ? 'bg-[#0F172A] text-white flex flex-col md:flex-row items-center gap-10' : 'bg-white'
      }`}>
        
        <div className={`relative shrink-0 w-24 h-24 md:w-48 md:h-48 rounded-[32px] overflow-hidden flex items-center justify-center text-3xl font-black shadow-xl transform group-hover:rotate-3 transition-transform ${
          isPrincipal ? 'bg-[#C5A059] text-[#0F172A]' : 'bg-slate-50 text-slate-300 group-hover:bg-[#C5A059]/10 group-hover:text-[#C5A059]'
        }`}>
          {isPrincipal ? (
            <>
              {imgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#C5A059]">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0F172A]" />
                </div>
              )}
              <img 
                src={SCHOOL_ASSETS.PRINCIPAL_PHOTO} 
                alt={teacher.name}
                onLoad={() => setImgLoading(false)}
                className={`w-full h-full object-cover object-top transition-opacity duration-700 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop';
                  setImgLoading(false);
                }}
              />
            </>
          ) : teacher.photo ? (
            <>
              {imgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                </div>
              )}
              <img 
                src={teacher.photo} 
                alt={teacher.name}
                onLoad={() => setImgLoading(false)}
                className={`w-full h-full object-cover object-top transition-opacity duration-700 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  setImgLoading(false);
                }}
              />
              {!imgLoading && <span className={`font-serif-prestige italic ${!teacher.photo ? 'block' : 'hidden'}`}>{teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
            </>
          ) : (
            <span className="font-serif-prestige italic">{teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex items-center space-x-3 mb-3">
             {isPrincipal ? (
               <Award className="h-5 w-5 text-[#C5A059]" />
             ) : teacher.type === 'guru' ? (
               <GraduationCap className="h-4 w-4 text-[#C5A059]" />
             ) : (
               <Briefcase className="h-4 w-4 text-[#C5A059]" />
             )}
             <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isPrincipal ? 'text-[#C5A059]' : 'text-black'}`}>
               {teacher.role}
             </span>
          </div>
          <h3 className={`text-2xl md:text-5xl font-black tracking-tighter ${isPrincipal ? 'text-white' : 'text-[#0F172A]'} font-serif-prestige`}>
            {teacher.name}
          </h3>
          {isPrincipal && (
            <p className="mt-6 text-gray-600 font-light max-w-3xl text-lg md:text-xl leading-relaxed italic font-serif-prestige">
              "Bersama-sama kita mengukir masa depan SMAN 2 Tompaso melalui integritas, teknologi, dan dedikasi tanpa batas untuk mencetak generasi cerdas, terampil, dan bermartabat."
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const TeachersSection: React.FC = () => {
  // Tampilkan DEFAULT_TEACHERS langsung — tidak bergantung Supabase
  // Data ini sudah sesuai Daftar Nominatif resmi SMAN 2 Tompaso
  const [teachers] = useState<Teacher[]>(DEFAULT_TEACHERS);
  const loading = false;

  const kepala = teachers.find(t => t.type === 'kepala');
  const guru = teachers.filter(t => t.type === 'guru');
  const staf = teachers.filter(t => t.type === 'staf');

  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdk_7z2iWeIGTFdZ8JpKZV5pEP57snFDUuCofZWl3IDj67AZQ/viewform";

  return (
    <div className="pt-40 pb-32 bg-[#FDFCFB]">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-20">
        <div className="max-w-4xl mb-24 reveal active">
          <span className="text-[#C5A059] font-black tracking-[0.5em] uppercase text-xs mb-6 block">Our Academic Guard</span>
          <h1 className="text-6xl md:text-[100px] font-medium text-[#0F172A] tracking-tighter leading-[0.85] mb-8 font-serif-prestige">
            Direktori <br /> <span className="text-slate-200 italic font-light">Pendidik & Staf.</span>
          </h1>
          <p className="text-gray-600 text-xl font-light leading-relaxed max-w-2xl font-serif-prestige italic">
            Sinergi antara pendidik berpengalaman dan tenaga kependidikan profesional untuk menghadirkan ekosistem pembelajaran digital terbaik di Minahasa.
          </p>
        </div>

        {/* Principal Highlight */}
        {kepala && <div className="reveal active"><TeacherCard teacher={kepala} /></div>}

        {/* Educators Section */}
        <div className="mb-20 reveal active">
          <div className="flex items-center space-x-6 mb-12">
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight uppercase italic font-serif-prestige">Tenaga Pendidik</h2>
            <div className="h-px flex-grow bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guru.map((t, i) => (
              <TeacherCard key={i} teacher={t} />
            ))}
          </div>
        </div>

        {/* Staf Section */}
        <div className="mb-32 reveal active">
          <div className="flex items-center space-x-6 mb-12">
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight uppercase italic font-serif-prestige">Tenaga Kependidikan</h2>
            <div className="h-px flex-grow bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staf.map((t, i) => (
              <TeacherCard key={i} teacher={t} />
            ))}
          </div>
        </div>

        {/* Contribution Portal */}
      </div>
    </div>
  );
};

export default TeachersSection;
