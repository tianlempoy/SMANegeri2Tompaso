import React, { useState, useRef } from 'react';
import {
  User, Phone, BookOpen, CheckCircle, AlertCircle, Loader2, Send,
  ChevronRight, Copy, Check, Download, Printer, Eye, FileText,
  MapPin, Calendar, Users, GraduationCap, Shield, Lock
} from 'lucide-react';
import { SCHOOL_ASSETS } from '../constants/assets';
import { apiPPDBRegister, fetchPPDBSettings } from '../lib/actions';
import { getTargetAcademicYear, getCurrentYear } from '../lib/utils';

interface PPDBRegistrationProps {
  onSuccess?: (data: any) => void;
}

const generateNomorPendaftaran = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `SMAN2T-${year}-${rand}`;
};

// ════════════════════════════════════════════════════════
// KOMPONEN BUKTI PDF (dicetak tersembunyi di background)
// ════════════════════════════════════════════════════════
const BuktiPrint = React.forwardRef<HTMLDivElement, {
  formData: any;
  nomorPendaftaran: string;
  tanggalDaftar: string;
}>(({ formData, nomorPendaftaran, tanggalDaftar }, ref) => (
  <div ref={ref} style={{ display: 'none' }}>
    <div id="ppdb-print-area">
      {/* Konten print dikendalikan via CSS @media print */}
    </div>
  </div>
));

// ════════════════════════════════════════════════════════
// KOMPONEN UTAMA
// ════════════════════════════════════════════════════════
const PPDBRegistration: React.FC<PPDBRegistrationProps> = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPPDBOpen, setIsPPDBOpen] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'error';
    message?: string;
    nomorPendaftaran?: string;
    tanggalDaftar?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nisn: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    agama: '',
    alamat: '',
    nama_ayah: '',
    nama_ibu: '',
    pekerjaan_ayah: '',
    pekerjaan_ibu: '',
    no_telp_ortu: '',
    nama_sekolah_asal: '',
    npsn_sekolah_asal: '',
    jalur_pendaftaran: 'Reguler',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [securityChallenge, setSecurityChallenge] = useState({ a: 0, b: 0, answer: '' });
  const [isAgreed, setIsAgreed] = useState(false);

  // Generate new security challenge
  const generateChallenge = () => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setSecurityChallenge({ a, b, answer: '' });
  };

  React.useEffect(() => {
    const init = async () => {
      setLoadingSettings(true);
      const res = await fetchPPDBSettings();
      if (res.data) {
        setIsPPDBOpen(res.data.is_ppdb_open);
      }
      generateChallenge();
      setLoadingSettings(false);
    };
    init();
  }, []);

  if (loadingSettings) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#C5A059] mx-auto mb-4" />
          <p className="text-[#0F172A] font-bold animate-pulse uppercase tracking-widest text-sm">Menyiapkan Sistem Pendaftaran...</p>
        </div>
      </div>
    );
  }

  if (!isPPDBOpen) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white rounded-[48px] p-8 sm:p-20 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-10 shadow-lg shadow-rose-100 animate-bounce-slow">
              <Lock className="w-12 h-12" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tighter mb-6 leading-tight">
              Pendaftaran <br /> Sedang <span className="text-rose-500 italic font-serif-prestige font-light">Ditutup.</span>
            </h1>
            
            <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12">
              Mohon maaf, saat ini sistem pendaftaran online SMA Negeri 2 Tompaso sedang dinonaktifkan atau periode pendaftaran telah berakhir.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-left group hover:bg-white hover:shadow-xl transition-all">
                <Shield className="w-8 h-8 text-[#C5A059] mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-black text-[#0F172A] text-sm uppercase tracking-widest mb-2">Informasi Lanjut</h4>
                <p className="text-slate-500 text-sm">Silakan hubungi panitia PPDB atau datang langsung ke sekolah di Tompaso.</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-left group hover:bg-white hover:shadow-xl transition-all">
                <Calendar className="w-8 h-8 text-[#C5A059] mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-black text-[#0F172A] text-sm uppercase tracking-widest mb-2">Jadwal PPDB</h4>
                <p className="text-slate-500 text-sm">Pantau terus website resmi dan media sosial kami untuk pembaruan jadwal pendaftaran.</p>
              </div>
            </div>
            
            <div className="mt-16 pt-10 border-t border-slate-100">
              <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">SMAN 2 Tompaso — Unggul dalam Pendidikan</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Data Siswa', icon: User },
    { number: 2, title: 'Data Orang Tua', icon: Phone },
    { number: 3, title: 'Sekolah Asal', icon: BookOpen },
    { number: 4, title: 'Pratinjau', icon: Eye },
  ];

  const validateField = (name: string, value: string) => {
    let error = '';
    
    if (name === 'nisn') {
      if (!/^\d{10}$/.test(value)) error = 'NISN harus tepat 10 digit angka';
    } else if (name === 'nama_lengkap') {
      if (value.length < 3) error = 'Nama harus minimal 3 karakter';
      if (!/^[a-zA-Z\s,.'-]+$/.test(value)) error = 'Nama hanya boleh berisi huruf dan tanda baca umum';
    } else if (name === 'no_telp_ortu') {
      if (!/^(08|\+628)\d{8,12}$/.test(value)) error = 'Format nomor WhatsApp tidak valid (Gunakan 08xx atau +628xx)';
    } else if (name === 'npsn_sekolah_asal' && value) {
      if (!/^\d{8}$/.test(value)) error = 'NPSN harus 8 digit angka';
    } else if (name === 'tanggal_lahir') {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      
      if (age < 14) error = 'Usia minimal pendaftar adalah 14 tahun';
      if (age > 20) error = 'Usia maksimal pendaftar adalah 20 tahun';
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isStepValid = () => {
    const hasEmptyFields = (fields: string[]) => fields.some(f => !formData[f as keyof typeof formData]);
    const hasErrors = (fields: string[]) => fields.some(f => errors[f]);

    switch (currentStep) {
      case 1: 
        const s1 = ['nama_lengkap', 'nisn', 'tempat_lahir', 'tanggal_lahir', 'agama', 'alamat'];
        return !hasEmptyFields(s1) && !hasErrors(s1);
      case 2: 
        const s2 = ['nama_ayah', 'nama_ibu', 'no_telp_ortu'];
        return !hasEmptyFields(s2) && !hasErrors(s2);
      case 3: 
        const s3 = ['nama_sekolah_asal'];
        return !hasEmptyFields(s3) && !hasErrors(s3);
      case 4:
        return isAgreed && parseInt(securityChallenge.answer) === (securityChallenge.a + securityChallenge.b);
      default: return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const nomorPendaftaran = generateNomorPendaftaran();
    const tanggalDaftar = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    try {
      const registrationData = {
        nomor_pendaftaran: nomorPendaftaran,
        nama_lengkap: formData.nama_lengkap,
        nisn: formData.nisn,
        tempat_lahir: formData.tempat_lahir,
        tanggal_lahir: formData.tanggal_lahir,
        jenis_kelamin: formData.jenis_kelamin,
        agama: formData.agama,
        alamat_lengkap: formData.alamat,
        nomor_wa: formData.no_telp_ortu,
        asal_sekolah: formData.nama_sekolah_asal,
        npsn_sekolah: formData.npsn_sekolah_asal || '-',
        tahun_lulus: getCurrentYear().toString(),
        nama_ayah: formData.nama_ayah,
        nama_ibu: formData.nama_ibu,
        nomor_wa_ortu: formData.no_telp_ortu,
        jalur_pendaftaran: formData.jalur_pendaftaran,
        status_pendaftaran: 'menunggu',
      };

      const result = await apiPPDBRegister(registrationData);

      if (!result.success || result.error) {
        setSubmitResult({ type: 'error', message: result.error?.message || 'Terjadi kesalahan. Coba lagi.' });
        return;
      }

      setSubmitResult({ type: 'success', nomorPendaftaran, tanggalDaftar });
      if (onSuccess) onSuccess({ ...registrationData, id: result.data?.id });
    } catch (error: any) {
      setSubmitResult({ type: 'error', message: error?.message || 'Terjadi kesalahan sistem.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyNomor = () => {
    if (submitResult?.nomorPendaftaran) {
      navigator.clipboard.writeText(submitResult.nomorPendaftaran);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Download PDF via browser print ──────────────────
  const handleDownloadPDF = () => {
    const nomor = submitResult?.nomorPendaftaran || '';
    const tgl = submitResult?.tanggalDaftar || '';

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Bukti Pendaftaran – ${nomor}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', serif; background: white; color: black; padding: 0; line-height: 1.4; }
    @page { size: A4; margin: 1.5cm; }
    .page { max-width: 210mm; margin: auto; padding: 10px; }

    /* Kop Surat Resmi */
    .kop { display: flex; align-items: center; border-bottom: 4px double black; padding-bottom: 12px; margin-bottom: 25px; }
    .kop-logo { width: 80px; height: 80px; margin-right: 20px; }
    .kop-text { text-align: center; flex: 1; }
    .kop-text h2 { font-size: 17px; font-weight: bold; text-transform: uppercase; margin: 0; }
    .kop-text h1 { font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 2px 0; }
    .kop-text p { font-size: 10px; margin: 0; font-style: italic; }

    /* Judul Dokumen */
    .doc-header { text-align: center; margin-bottom: 20px; }
    .doc-header h3 { font-size: 16px; text-decoration: underline; text-transform: uppercase; margin-bottom: 5px; }
    .doc-header p { font-size: 12px; font-weight: bold; }

    /* Info Nomor Pendaftaran */
    .reg-box { border: 2px solid black; padding: 10px 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; }
    .reg-label { font-size: 11px; font-weight: bold; text-transform: uppercase; }
    .reg-number { font-size: 18px; font-weight: bold; font-family: monospace; letter-spacing: 2px; }

    /* Section Data */
    .section { margin-bottom: 15px; }
    .section-title { font-size: 11px; font-weight: bold; border-bottom: 1px solid black; padding-bottom: 3px; margin-bottom: 8px; text-transform: uppercase; }
    
    .data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .data-table td { padding: 4px 0; vertical-align: top; }
    .label { width: 180px; color: #444; }
    .colon { width: 20px; text-align: center; }
    .value { font-weight: bold; color: black; }

    /* Tanda Tangan */
    .ttd-container { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .ttd-box { text-align: center; font-size: 12px; }
    .ttd-space { height: 70px; }

    /* Footer */
    .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; text-align: center; font-size: 9px; color: #666; font-style: italic; }

    @media print {
      .no-print { display: none; }
      body { -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Kop Surat Resmi -->
  <div class="kop">
    <img src="${SCHOOL_ASSETS.LOGO}" class="kop-logo" alt="Logo SMAN 2 Tompaso" />
    <div class="kop-text">
      <h2>PEMERINTAH PROVINSI SULAWESI UTARA</h2>
      <h2>DINAS PENDIDIKAN DAERAH</h2>
      <h1>SMA NEGERI 2 TOMPASO</h1>
      <p>Jaga IV, Desa Pinabetengan Utara, Kec. Tompaso Barat, Kab. Minahasa, Sulawesi Utara</p>
      <p>Email: smanegeri2tompaso@gmail.com • NPSN: 40100892 • Akreditasi B</p>
    </div>
  </div>

  <!-- Judul Dokumen -->
  <div class="doc-header">
    <h3>KARTU BUKTI PENDAFTARAN PPDB ONLINE</h3>
    <p>TAHUN PELAJARAN ${getTargetAcademicYear()}</p>
  </div>

  <!-- Nomor Registrasi -->
  <div class="reg-box">
    <span class="reg-label">Nomor Pendaftaran :</span>
    <span class="reg-number">${nomor}</span>
  </div>

  <!-- Identitas Siswa -->
  <div class="section">
    <div class="section-title">I. IDENTITAS CALON PESERTA DIDIK</div>
    <table class="data-table">
      <tr><td class="label">Nama Lengkap</td><td class="colon">:</td><td class="value">${formData.nama_lengkap.toUpperCase()}</td></tr>
      <tr><td class="label">NISN</td><td class="colon">:</td><td class="value">${formData.nisn}</td></tr>
      <tr><td class="label">Tempat, Tanggal Lahir</td><td class="colon">:</td><td class="value">${formData.tempat_lahir}, ${new Date(formData.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
      <tr><td class="label">Jenis Kelamin</td><td class="colon">:</td><td class="value">${formData.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td></tr>
      <tr><td class="label">Agama</td><td class="colon">:</td><td class="value">${formData.agama}</td></tr>
      <tr><td class="label">Alamat Lengkap</td><td class="colon">:</td><td class="value">${formData.alamat}</td></tr>
    </table>
  </div>

  <!-- Data Orang Tua -->
  <div class="section">
    <div class="section-title">II. DATA ORANG TUA / WALI</div>
    <table class="data-table">
      <tr><td class="label">Nama Ayah Kandung</td><td class="colon">:</td><td class="value">${formData.nama_ayah}</td></tr>
      <tr><td class="label">Pekerjaan Ayah</td><td class="colon">:</td><td class="value">${formData.pekerjaan_ayah || '-'}</td></tr>
      <tr><td class="label">Nama Ibu Kandung</td><td class="colon">:</td><td class="value">${formData.nama_ibu}</td></tr>
      <tr><td class="label">Pekerjaan Ibu</td><td class="colon">:</td><td class="value">${formData.pekerjaan_ibu || '-'}</td></tr>
      <tr><td class="label">Nomor HP/WhatsApp</td><td class="colon">:</td><td class="value">${formData.no_telp_ortu}</td></tr>
    </table>
  </div>

  <!-- Informasi Sekolah Asal -->
  <div class="section">
    <div class="section-title">III. INFORMASI SEKOLAH ASAL & JALUR</div>
    <table class="data-table">
      <tr><td class="label">Nama Sekolah Asal</td><td class="colon">:</td><td class="value">${formData.nama_sekolah_asal}</td></tr>
      <tr><td class="label">NPSN Sekolah Asal</td><td class="colon">:</td><td class="value">${formData.npsn_sekolah_asal || '-'}</td></tr>
      <tr><td class="label">Jalur Pendaftaran</td><td class="colon">:</td><td class="value">${formData.jalur_pendaftaran}</td></tr>
      <tr><td class="label">Waktu Pendaftaran</td><td class="colon">:</td><td class="value">${tgl} WITA</td></tr>
    </table>
  </div>

  <p style="font-size: 10px; margin-top: 10px; font-style: italic;"> * Kartu ini adalah bukti sah bahwa Anda telah melakukan pendaftaran online. Harap dibawa saat verifikasi berkas fisik di sekolah.</p>

  <!-- Tanda Tangan -->
  <div class="ttd-container">
    <div class="ttd-box">
      <p>Peserta Didik,</p>
      <div class="ttd-space"></div>
      <p style="font-weight:bold; text-decoration:underline;">${formData.nama_lengkap.toUpperCase()}</p>
    </div>
    <div class="ttd-box">
      <p>Mengetahui,</p>
      <p>Kepala SMAN 2 Tompaso,</p>
      <div class="ttd-space"></div>
      <p style="font-weight:bold; text-decoration:underline;">Junus N.M. Akay, S.Pd, M.Si</p>
      <p style="font-size:10px;">NIP. 19740520 200501 1 008</p>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Dicetak secara otomatis oleh Sistem PPDB Online SMAN 2 Tompaso • ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WITA</p>
    <p>Simpan nomor pendaftaran Anda untuk pengecekan status seleksi berkala.</p>
  </div>

</div>

<!-- Tombol Print (Sembunyi saat Cetak) -->
<div class="no-print" style="text-align:center; margin-top: 30px;">
  <button onclick="window.print()" style="background:black; color:white; padding:12px 30px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
    🖨️ CETAK KARTU SEKARANG
  </button>
  <button onclick="window.close()" style="margin-left:10px; background:#eee; color:black; padding:12px 30px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
    Tutup
  </button>
</div>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  // ─────────────────────────────────────────────────────
  //  SUCCESS SCREEN
  // ─────────────────────────────────────────────────────
  if (submitResult?.type === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0D1529] to-[#0A0F1E] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-2xl w-full relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">

            {/* Header strip */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute rounded-full border border-white" style={{ width: `${(i + 1) * 80}px`, height: `${(i + 1) * 80}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                ))}
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-green-100 text-xs font-black uppercase tracking-[0.3em] mb-2">Pendaftaran Berhasil</p>
                <h2 className="text-xl sm:text-2xl font-black text-white">Data Anda Telah Diterima!</h2>
              </div>
            </div>

            <div className="p-5 sm:p-8 space-y-5">
              {/* Branding */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <img src={SCHOOL_ASSETS.LOGO} alt="Logo" className="w-10 h-10" />
                <div>
                  <p className="text-white font-black text-sm">SMA Negeri 2 Tompaso</p>
                  <p className="text-gray-400 text-xs">Penerimaan Peserta Didik Baru {getTargetAcademicYear()}</p>
                </div>
              </div>

              {/* Nomor pendaftaran */}
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 text-center">
                <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Nomor Pendaftaran Anda</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-3xl font-black text-white tracking-widest font-mono break-all">
                    {submitResult.nomorPendaftaran}
                  </span>
                  <button onClick={copyNomor} title="Salin nomor" className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex-shrink-0">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-3">Simpan nomor ini untuk mengecek status</p>
              </div>

              {/* Ringkasan data */}
              <div className="bg-white/5 rounded-2xl p-4 sm:p-5 space-y-3">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Ringkasan Pendaftaran</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Nama Lengkap', value: formData.nama_lengkap },
                    { label: 'NISN', value: formData.nisn },
                    { label: 'L/P', value: formData.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' },
                    { label: 'Agama', value: formData.agama },
                    { label: 'Asal Sekolah', value: formData.nama_sekolah_asal },
                    { label: 'Jalur', value: formData.jalur_pendaftaran },
                  ].map((f, i) => (
                    <div key={i}>
                      <p className="text-gray-500 text-[10px]">{f.label}</p>
                      <p className="text-white font-bold text-xs">{f.value || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Langkah selanjutnya */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 sm:p-5 space-y-2">
                <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Langkah Selanjutnya</p>
                {[
                  'Pantau status di menu "Cek Status PPDB" dengan nomor pendaftaran di atas',
                  'Hasil seleksi diumumkan melalui portal resmi sekolah',
                  'Siapkan dokumen asli untuk verifikasi saat diterima',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-blue-200 text-xs">{item}</p>
                  </div>
                ))}
              </div>

              {/* Tombol aksi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center gap-2 py-4 bg-[#D4AF37] hover:bg-amber-400 text-[#0A0F1E] font-black rounded-2xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  Unduh Bukti PDF
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center gap-2 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition-all border border-white/10 active:scale-95"
                >
                  <Printer className="w-5 h-5" />
                  Cetak Bukti
                </button>
              </div>

              <p className="text-center text-gray-600 text-xs">
                {submitResult.tanggalDaftar}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────
  //  ERROR SCREEN
  // ─────────────────────────────────────────────────────
  if (submitResult?.type === 'error') {
    return (
      <div className="min-h-screen relative py-12 px-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${SCHOOL_ASSETS.PPDB_BG})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25)' }} />
        <div className="max-w-lg mx-auto relative z-10 w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Gagal Mengirim</h2>
            <p className="text-gray-500 mb-5 text-sm">Pesan error dari server:</p>
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-mono py-3 px-5 rounded-xl mb-6 text-left break-all">
              {submitResult.message}
            </div>
            <p className="text-gray-400 text-xs mb-6">Jika error berlanjut, pastikan administrator sudah menjalankan <strong>FIX_PPDB_SCHEMA.sql</strong> di Supabase.</p>
            <button onClick={() => setSubmitResult(null)} className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────
  //  FORM UTAMA
  // ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative py-16 sm:py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${SCHOOL_ASSETS.PPDB_BG})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.35) saturate(1.1)' }} />
      <div className="absolute inset-0 bg-[#0A0F1E]/50 backdrop-blur-sm z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Judul */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
              <img src={SCHOOL_ASSETS.LOGO} alt="Logo SMAN 2 Tompaso" className="w-14 h-14 sm:w-16 sm:h-16" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">PPDB ONLINE</h1>
              <p className="text-[#D4AF37] font-black tracking-[0.3em] text-xs uppercase">SMA Negeri 2 Tompaso</p>
            </div>
          </div>
          <span className="inline-block px-5 py-1.5 bg-[#D4AF37] text-[#0A0F1E] rounded-full font-black text-[10px] tracking-widest uppercase">
            Tahun Ajaran {getTargetAcademicYear()}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-all font-black ${
                      isActive ? 'bg-[#0A0F1E] text-[#D4AF37] shadow-lg' :
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-center leading-tight ${isActive ? 'text-[#0A0F1E]' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-[40px] shadow-2xl p-5 sm:p-10">

          {/* Step 1: Data Siswa */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black text-[#0A0F1E] mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-[#D4AF37]" /> Data Diri Siswa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} required
                    className={`w-full px-4 py-3.5 border ${errors.nama_lengkap ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-bold`}
                    placeholder="Masukkan nama lengkap sesuai akta" />
                  {errors.nama_lengkap && <p className="text-[10px] text-red-600 font-bold mt-1 uppercase tracking-wider flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.nama_lengkap}</p>}
                <div>
                  <input type="text" name="nisn" value={formData.nisn} onChange={handleInputChange} required maxLength={10}
                    className={`w-full px-4 py-3.5 border ${errors.nisn ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-mono font-bold`}
                    placeholder="0000000000" />
                  {errors.nisn && <p className="text-[10px] text-red-600 font-bold mt-1 uppercase tracking-wider flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.nisn}</p>}
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Tempat Lahir *</label>
                  <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleInputChange} required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-medium"
                    placeholder="Kota/Kabupaten lahir" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Tanggal Lahir *</label>
                  <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleInputChange} required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Jenis Kelamin *</label>
                  <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleInputChange} required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-medium">
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Agama *</label>
                  <select name="agama" value={formData.agama} onChange={handleInputChange} required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-medium">
                    <option value="">Pilih Agama</option>
                    {['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Jalur Pendaftaran *</label>
                  <select name="jalur_pendaftaran" value={formData.jalur_pendaftaran} onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-medium">
                    <option value="Reguler">Reguler / Umum</option>
                    <option value="Zonasi">Zonasi</option>
                    <option value="Afirmasi">Afirmasi</option>
                    <option value="Prestasi">Prestasi</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Alamat Lengkap *</label>
                  <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} required rows={3}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-medium resize-none"
                    placeholder="Jalan, Nomor Rumah, Desa/Kelurahan, Kecamatan, Kabupaten, Provinsi" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Data Orang Tua */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black text-[#0A0F1E] mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-[#D4AF37]" /> Data Orang Tua / Wali
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nama Ayah *</label>
                  <input type="text" name="nama_ayah" value={formData.nama_ayah} onChange={handleInputChange} required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-medium" placeholder="Nama ayah kandung" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Pekerjaan Ayah</label>
                  <input type="text" name="pekerjaan_ayah" value={formData.pekerjaan_ayah} onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-medium" placeholder="Pekerjaan ayah" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nama Ibu *</label>
                  <input type="text" name="nama_ibu" value={formData.nama_ibu} onChange={handleInputChange} required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-medium" placeholder="Nama ibu kandung" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Pekerjaan Ibu</label>
                  <input type="text" name="pekerjaan_ibu" value={formData.pekerjaan_ibu} onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-medium" placeholder="Pekerjaan ibu" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nomor WhatsApp Orang Tua *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" name="no_telp_ortu" value={formData.no_telp_ortu} onChange={handleInputChange} required
                      className={`w-full pl-11 pr-4 py-3.5 border ${errors.no_telp_ortu ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-bold`}
                      placeholder="Contoh: 081234567890" />
                  </div>
                  {errors.no_telp_ortu && <p className="text-[10px] text-red-600 font-bold mt-1 uppercase tracking-wider flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.no_telp_ortu}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Sekolah Asal */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-black text-[#0A0F1E] mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-[#D4AF37]" /> Data Sekolah Asal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nama Sekolah Asal *</label>
                  <input type="text" name="nama_sekolah_asal" value={formData.nama_sekolah_asal} onChange={handleInputChange} required
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-medium" placeholder="SMP/MTs asal" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">NPSN Sekolah Asal</label>
                  <input type="text" name="npsn_sekolah_asal" value={formData.npsn_sekolah_asal} onChange={handleInputChange} maxLength={8}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0A0F1E] focus:ring-2 focus:ring-[#0A0F1E]/10 font-mono font-medium" placeholder="NPSN (opsional)" />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <p className="text-sm font-bold text-blue-800 mb-2">📋 Dokumen yang Dibutuhkan Saat Daftar Ulang</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  {['Kartu Keluarga (KK)', 'Akta Kelahiran', 'Ijazah / SKHUN (asli + fotokopi 2 lembar)', 'Foto 3x4 sebanyak 4 lembar (latar merah)', 'Surat keterangan bebas narkoba (bila diminta)'].map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════
              Step 4: PRATINJAU LENGKAP sebelum kirim
          ════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-[#0A0F1E] flex items-center gap-3">
                <Eye className="w-6 h-6 text-[#D4AF37]" /> Pratinjau Data
              </h2>

              {/* Peringatan */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 font-medium">
                  Periksa kembali semua data di bawah. Setelah dikirim, data <strong>tidak bisa diubah secara mandiri</strong>.
                </p>
              </div>

              {/* ── Bagian 1: Data Diri ── */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-[#0A0F1E] px-5 py-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-white font-black text-xs uppercase tracking-widest">Data Diri Siswa</span>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Nama Lengkap', value: formData.nama_lengkap },
                    { label: 'NISN', value: formData.nisn, mono: true },
                    { label: 'Tempat, Tanggal Lahir', value: `${formData.tempat_lahir}, ${formData.tanggal_lahir ? new Date(formData.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}` },
                    { label: 'Jenis Kelamin', value: formData.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' },
                    { label: 'Agama', value: formData.agama },
                    { label: 'Jalur Pendaftaran', value: formData.jalur_pendaftaran },
                    { label: 'Alamat Lengkap', value: formData.alamat, full: true },
                  ].map((f, i) => (
                    <div key={i} className={f.full ? 'sm:col-span-2' : ''}>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{f.label}</p>
                      <p className={`font-bold text-[#0A0F1E] text-sm ${f.mono ? 'font-mono tracking-wider' : ''}`}>{f.value || <span className="text-red-400">Kosong!</span>}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Bagian 2: Orang Tua ── */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-[#0A0F1E] px-5 py-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-white font-black text-xs uppercase tracking-widest">Data Orang Tua / Wali</span>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Nama Ayah', value: formData.nama_ayah },
                    { label: 'Pekerjaan Ayah', value: formData.pekerjaan_ayah || '-' },
                    { label: 'Nama Ibu', value: formData.nama_ibu },
                    { label: 'Pekerjaan Ibu', value: formData.pekerjaan_ibu || '-' },
                    { label: 'No. WhatsApp', value: formData.no_telp_ortu },
                  ].map((f, i) => (
                    <div key={i}>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{f.label}</p>
                      <p className="font-bold text-[#0A0F1E] text-sm">{f.value || <span className="text-red-400">Kosong!</span>}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Bagian 4: Validasi & Keamanan ── */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-4 p-5 bg-amber-50 border border-amber-200 rounded-3xl">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">Pemeriksaan Sistem</h3>
                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight">Status: Menunggu Verifikasi Manusia</p>
                  </div>
                </div>

                {/* Integrity Statement */}
                <div className={`p-6 rounded-3xl border transition-all duration-500 ${isAgreed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <label className="flex gap-4 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={isAgreed} 
                        onChange={(e) => setIsAgreed(e.target.checked)}
                        className="w-6 h-6 rounded-lg accent-[#0A0F1E] cursor-pointer" 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-[#0A0F1E] uppercase tracking-wider">Pernyataan Integritas Data</span>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Saya menyatakan bahwa seluruh data yang saya masukkan adalah **benar dan akurat**. Saya mengerti bahwa pengisian data **asal-asalan** atau palsu akan berakibat pada **pembatalan otomatis** pendaftaran saya.</p>
                    </div>
                  </label>
                </div>

                {/* Bot Check Challenge */}
                <div className={`p-6 rounded-3xl text-white shadow-xl transition-all duration-500 ${parseInt(securityChallenge.answer) === (securityChallenge.a + securityChallenge.b) ? 'bg-green-600 shadow-green-600/20' : 'bg-[#0A0F1E] shadow-[#0A0F1E]/20'}`}>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-center sm:text-left">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400 mb-1">Human Verification</h4>
                      <p className="text-lg font-black tracking-tight">Selesaikan tantangan matematika:</p>
                      <p className="text-white/60 text-[11px] font-bold">Berapakah hasil dari <span className="text-white text-base"> {securityChallenge.a} + {securityChallenge.b} </span> ?</p>
                    </div>
                    <div className="w-full sm:w-32">
                      <input 
                        type="number" 
                        value={securityChallenge.answer}
                        onChange={(e) => setSecurityChallenge(prev => ({ ...prev, answer: e.target.value }))}
                        placeholder="?"
                        className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-center text-2xl font-black focus:outline-none focus:border-white focus:bg-white/20 transition-all placeholder:text-white/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 gap-3">
            {currentStep > 1 ? (
              <button type="button" onClick={() => setCurrentStep(s => s - 1)}
                className="px-5 sm:px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
                ← Kembali
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button type="button" onClick={() => setCurrentStep(s => s + 1)} disabled={!isStepValid()}
                className="px-6 sm:px-8 py-3 rounded-xl font-black text-white bg-[#0A0F1E] hover:bg-slate-800 transition-colors disabled:opacity-40 flex items-center gap-2">
                Lanjutkan <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting || !isStepValid()}
                className={`px-6 sm:px-8 py-3 rounded-xl font-black text-white transition-all flex items-center gap-2 shadow-lg ${
                  isStepValid() ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-gray-400 cursor-not-allowed opacity-50'
                }`}>
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Mengirim...</span></>
                  : <><Send className="w-4 h-4" /><span>Kirim Pendaftaran</span></>
                }
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PPDBRegistration;
