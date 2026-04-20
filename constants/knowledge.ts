/**
 * SCHOOL KNOWLEDGE BASE - SMAN 2 TOMPASO
 * Dokumen ini berisi seluruh informasi sekolah untuk referensi fitur AI dan sistem informasi.
 */

export const SCHOOL_KNOWLEDGE = {
  name: "SMA Negeri 2 Tompaso",
  shortName: "SMAN 2 Tompaso",
  location: {
    address: "Jaga IV, Desa Pinabetengan Utara, Kec. Tompaso Barat, Kabupaten Minahasa, Sulawesi Utara",
    googleMaps: "https://maps.app.goo.gl/F5rvV5EeuyyTcycc9",
    coords: "1.1744255988143597, 124.78717767528869"
  },
  contact: {
    email: "smanegeri2tompaso@gmail.com",
    phone: "+62 8XX XXXX XXXX (Layanan Hubungi Kami)",
    operatingHours: "Senin - Jumat: 07.15 - 15.00, Sabtu: Kegiatan Ekstrakurikuler"
  },
  philosophy: {
    motto: "Cerdas, Terampil, Bermartabat",
    vision: "Terwujudnya Peserta Didik yang Cerdas, Terampil, dan Bermartabat berlandaskan Iman dan Taqwa.",
    mission: [
      "Meningkatkan kualitas pembelajaran yang aktif, inovatif, kreatif, dan menyenangkan.",
      "Mengembangkan bakat dan minat siswa melalui berbagai kegiatan ekstrakurikuler.",
      "Menanamkan nilai-nilai karakter luhur, budi pekerti, dan kearifan budaya lokal.",
      "Memperkuat kolaborasi dengan orang tua, masyarakat, dan instansi terkait demi kemajuan pendidikan."
    ],
    mottoDescription: {
      cerdas: "Mengutamakan perkembangan intelektual, daya pikir kritis, dan literasi yang luas untuk menghadapi masa depan.",
      terampil: "Membekali siswa dengan keahlian praktis dan kreativitas yang siap bersaing di dunia profesional.",
      bermartabat: "Menjunjung tinggi etika dan moralitas dalam setiap langkah kehidupan."
    }
  },
  history: {
    established: "2003",
    milestones: [
      { year: "2003", event: "Pendirian Sekolah SMA Negeri 2 Tompaso dan Izin Operasional." },
      { year: "2023/2024", event: "Implementasi Kurikulum Merdeka." },
      { year: "2024", event: "Penetapan sebagai Sekolah Penggerak." },
      { year: "2026", event: "Transformasi Digital dan Peluncuran Ekosistem Digital Terintegrasi." }
    ],
    context: "Sekolah ini hadir sebagai dedikasi pemerintah untuk pendidikan berkualitas di Tompaso Barat dengan semangat Mapalus (gotong royong)."
  },
  staff: {
    principal: {
      name: "Junus N. M. Akay, S.Pd, M.Si",
      role: "Kepala Sekolah",
      quote: "Bersama-sama kita mengukir masa depan SMAN 2 Tompaso melalui integritas, teknologi, dan dedikasi tanpa batas."
    },
    teachers: [
      { name: "Nofie Kalengkongan, S.Pd", role: "Guru PJOK" },
      { name: "Eireine E. Mukuan, S.Pd", role: "Guru Bahasa Inggris" },
      { name: "Rike Tulenan, S.Pd", role: "Guru Biologi" },
      { name: "Diane E. Langi, S.Pd", role: "Guru Fisika" },
      { name: "Amelia C. Umboh, S.Pd", role: "Guru Bahasa Indonesia" },
      { name: "Djenly Pajow, S.Pd", role: "Guru Sejarah" },
      { name: "David L. Paembonan, S.Pd. Gr", role: "Guru Matematika" },
      { name: "Eva I. Sepang, S.Pd", role: "Guru Bahasa Jerman" },
      { name: "Junita Takalamingang, S.Pd", role: "Guru Kimia" },
      { name: "Rosni Lumentah, M.Pd", role: "Guru Informatika" },
      { name: "Natalia Mareska Siri, S.Pd.K", role: "Guru Agama" },
      { name: "Merina M. Sumerah, S.Pd", role: "Guru Kimia" },
      { name: "Maria Y. Keles, S.Pd", role: "Guru Ekonomi" },
      { name: "Elsa Palar, S.Pd", role: "Guru PPKN" },
      { name: "Ruly L. Kaparang, S.Pd", role: "Guru Geografi" },
      { name: "Friskila R. M. Kolibu, S.Pd", role: "Guru Biologi" },
      { name: "Silveria Jessica Umboh, S.Pd", role: "Guru Sosiologi" }
    ],
    technicalStaff: [
      { name: "Victory M. Roring, S.Kom", role: "Staf TU / TIK" },
      { name: "Ocktaviani E. Laloan, S.AB", role: "Staff TU" }
    ]
  },
  leadership: {
    osis: [
      { name: "Preysi Pesik", role: "Ketua OSIS" },
      { name: "Esterlita Suoth", role: "Wakil Ketua OSIS" },
      { name: "Chika Korompis", role: "Sekretaris I" },
      { name: "Chakrawala Lempoy", role: "Sekretaris II" },
      { name: "Firen Gahung", role: "Bendahara I" },
      { name: "Enjelika Singal", role: "Bendahara II" }
    ]
  },
  achievements: {
    categories: [
      { title: "Keunggulan Akademik", fields: "OSN (Olimpiade Sains), Debat, Lomba Karya Ilmiah Remaja (KIR)" },
      { title: "Olahraga", fields: "O2SN, Atletik, Turnamen Provinsi" },
      { title: "Seni & Budaya", fields: "FLS2N, Paduan Suara, Budaya Minahasa" },
      { title: "Inovasi & Teknologi", fields: "Robotik, Coding, Kreativitas Digital" }
    ],
    status: "Sedang dalam proses digitalisasi arsip (Wall of Fame Digital)."
  },
  extracurriculars: [
    { name: "Coding Camp", category: "Teknologi" },
    { name: "Paskibraka", category: "Kepemimpinan" },
    { name: "Pramuka", category: "Kepanduan" },
    { name: "Kerohanian", category: "Spiritual" },
    { name: "Sepakbola", category: "Olahraga" },
    { name: "Voli", category: "Olahraga" },
    { name: "Tenis Meja", category: "Olahraga" }
  ]
};
