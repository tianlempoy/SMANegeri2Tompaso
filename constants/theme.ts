/**
 * SCHOOL THEME - SMAN 2 TOMPASO
 * Tema warna dan konten yang diterapkan di setiap halaman
 */

export const SCHOOL_THEME = {
  // Warna Utama
  COLORS: {
    PRIMARY: '#0F172A', // Navy
    SECONDARY: '#C5A059', // Gold
    ACCENT: '#D4AF37', // Accent Gold
    BACKGROUND: '#FDFCFB', // Ivory
    TEXT: '#0F172A', // Navy
    TEXT_LIGHT: '#64748B', // Slate
    BLUE_ACCENT: '#3B82F6', // Blue
  },

  // Konten Utama
  CONTENT: {
    MOTTO: 'Cerdas, Terampil, Bermartabat',
    MOTTO_DESCRIPTION: 'Membina komunitas intelektual yang cerdas, terampil, dan bermartabat melalui inovasi pendidikan tanpa batas.',
    VISION: 'Terwujudnya Peserta Didik yang Cerdas, Terampil, dan Bermartabat berlandaskan Iman dan Taqwa.',
    MISSION: [
      'Meningkatkan kualitas pembelajaran yang aktif, inovatif, kreatif, dan menyenangkan.',
      'Mengembangkan bakat dan minat siswa melalui berbagai kegiatan ekstrakurikuler.',
      'Menanamkan nilai-nilai karakter luhur, budi pekerti, dan kearifan budaya lokal.',
      'Memperkuat kolaborasi dengan orang tua, masyarakat, dan instansi terkait demi kemajuan pendidikan.'
    ],
    PHILOSOPHY: {
      CERDAS: {
        title: 'Cerdas',
        desc: 'Mengutamakan perkembangan intelektual, daya pikir kritis, dan literasi yang luas untuk menghadapi masa depan.',
        icon: 'Brain',
        color: 'text-blue-600 bg-blue-50'
      },
      TERAMPIL: {
        title: 'Terampil',
        desc: 'Membekali siswa dengan keahlian praktis dan kreativitas yang siap bersaing di dunia profesional.',
        icon: 'Zap',
        color: 'text-amber-600 bg-amber-50'
      },
      BERMARTABAT: {
        title: 'Bermartabat',
        desc: 'Menjunjung tinggi etika  dan moralitas dalam setiap langkah kehidupan.',
        icon: 'Heart',
        color: 'text-red-600 bg-red-50'
      }
    },
    LEADERSHIP: [
      { name: 'Preysi Pesik', role: 'Ketua OSIS', icon: 'Crown', photo: '/osis/preysipesik.jpeg' },
      { name: 'Esterlita Suoth', role: 'Wakil Ketua OSIS', icon: 'UserCheck', photo: '/osis/ester.jpeg' },
      { name: 'Chika Korompis', role: 'Sekretaris I', icon: 'Book', photo: '/osis/cika.jpeg' },
      { name: 'Chakrawala Lempoy', role: 'Sekretaris II', icon: 'Book' },
      { name: 'Firen Gahung', role: 'Bendahara I', icon: 'ShieldCheck' },
      { name: 'Enjelika Singal', role: 'Bendahara II', icon: 'ShieldCheck', photo: '/osis/enjel.jpeg' }
    ]

  },

  // Styling Konsisten
  STYLES: {
    BACKGROUND_GRADIENT: 'bg-gradient-to-br from-[#FDFCFB] to-blue-50/30',
    CARD_BACKGROUND: 'bg-gradient-to-br from-white to-blue-50',
    TEXT_GRADIENT: 'bg-gradient-to-r from-[#C5A059] to-blue-500 bg-clip-text text-transparent',
    BORDER_COLOR: 'border-blue-400',
    HOVER_EFFECT: 'hover:bg-blue-600 hover:text-white'
  }
};
