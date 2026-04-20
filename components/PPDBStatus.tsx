import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, FileText, ChevronRight, Download, LogOut, Loader2 } from 'lucide-react';
import { SCHOOL_ASSETS } from '../constants/assets';
import { apiPPDBGetStatus } from '../lib/actions';

interface PPDBStatusProps {
  onCheckStatus?: (registrationNumber: string) => void;
}

const PPDBStatus: React.FC<PPDBStatusProps> = ({ onCheckStatus }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    
    try {
      const res = await apiPPDBGetStatus(searchInput.trim());
      
      if (res.success && res.data) {
        setResultData(res.data);
        setShowResult(true);
        if (onCheckStatus) onCheckStatus(searchInput);
      } else {
        setSearchError('Nomor Pendaftaran atau NISN tidak ditemukan. Pastikan data yang dimasukkan benar.');
      }
    } catch (err) {
      setSearchError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setShowResult(false);
    setResultData(null);
    setSearchInput('');
  };

  // ── SNBP STYLE DESIGN BLOCKS ──────────────────────────────────────────────

  if (showResult && resultData) {
    const status = resultData.status_pendaftaran;
    const isDiterima = status === 'diterima';
    const isDitolak = status === 'ditolak';
    const isMenunggu = status === 'menunggu';

    const handleDownloadPDF = () => {
      const nomad = resultData.nomor_pendaftaran || '-';
      const name = resultData.nama_lengkap || '-';
      const nisn = resultData.nisn || '-';
      const school = resultData.asal_sekolah || '-';
      const jalur = resultData.jalur_pendaftaran || 'Reguler';
      const ttl = `${resultData.tempat_lahir}, ${resultData.tanggal_lahir}`;
      const tglCetak = new Date().toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'long', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      });

      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) return;

      const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Surat Keterangan Lulus – ${name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', serif; background: white; color: black; padding: 0; line-height: 1.5; }
    @page { size: A4; margin: 2cm; }
    .page { max-width: 210mm; margin: auto; padding: 1cm; }

    /* Kop Surat */
    .kop { display: flex; align-items: center; border-bottom: 4px double black; padding-bottom: 15px; margin-bottom: 30px; }
    .kop-logo { width: 85px; height: 85px; margin-right: 20px; }
    .kop-text { text-align: center; flex: 1; }
    .kop-text h2 { font-size: 18px; font-weight: bold; text-transform: uppercase; margin: 0; }
    .kop-text h1 { font-size: 22px; font-weight: bold; text-transform: uppercase; margin: 2px 0; }
    .kop-text p { font-size: 11px; margin: 0; font-style: italic; }

    /* Dokumen Title */
    .doc-title { text-align: center; margin-bottom: 30px; }
    .doc-title h3 { font-size: 16px; text-decoration: underline; text-transform: uppercase; margin-bottom: 5px; }
    .doc-title p { font-size: 12px; font-weight: bold; }

    /* Isi Surat */
    .content { font-size: 13px; text-align: justify; margin-bottom: 20px; }
    .indent { text-indent: 45px; }
    
    .data-table { width: 90%; margin: 15px auto; font-size: 13px; border-collapse: collapse; }
    .data-table td { padding: 5px 0; vertical-align: top; }
    .label { width: 180px; }
    .colon { width: 20px; text-align: center; }

    .result-box { border: 3px solid black; padding: 15px; text-align: center; margin: 25px auto; width: 65%; font-weight: bold; font-size: 20px; text-transform: uppercase; }

    .footer { margin-top: 50px; display: flex; justify-content: flex-end; }
    .sign-box { text-align: center; width: 280px; font-size: 13px; }
    .space { height: 90px; }

    @media print {
      .no-print { display: none; }
    }
  </style>
</head>
<body>
<div class="page">
  <div class="kop">
    <img src="${SCHOOL_ASSETS.LOGO}" class="kop-logo" />
    <div class="kop-text">
      <h2>PEMERINTAH PROVINSI SULAWESI UTARA</h2>
      <h2>DINAS PENDIDIKAN DAERAH</h2>
      <h1>SMA NEGERI 2 TOMPASO</h1>
      <p>Jaga IV, Desa Pinabetengan Utara, Kec. Tompaso Barat, Kab. Minahasa</p>
      <p>Email: smanegeri2tompaso@gmail.com • NPSN: 40100892 • Akreditasi B</p>
    </div>
  </div>

  <div class="doc-title">
    <h3>SURAT KETERANGAN LULUS SELEKSI</h3>
    <p>Nomor: 421.3/PPDB-${nomad.split('-').pop()}/2025</p>
  </div>

  <p class="content indent">Kepala Sekolah Menengah Atas (SMA) Negeri 2 Tompaso, berdasarkan hasil verifikasi berkas dan seleksi Penerimaan Peserta Didik Baru (PPDB) Tahun Pelajaran 2025/2026 yang dilaksanakan secara daring melalui sistem portal sekolah, dengan ini menerangkan bahwa:</p>

  <table class="data-table">
    <tr><td class="label">Nama Lengkap</td><td class="colon">:</td><td style="font-weight:bold; text-transform:uppercase;">${name}</td></tr>
    <tr><td class="label">NISN</td><td class="colon">:</td><td style="font-family:monospace; letter-spacing:1px;">${nisn}</td></tr>
    <tr><td class="label">Nomor Pendaftaran</td><td class="colon">:</td><td>${nomad}</td></tr>
    <tr><td class="label">Tempat, Tanggal Lahir</td><td class="colon">:</td><td>${ttl}</td></tr>
    <tr><td class="label">Asal Sekolah</td><td class="colon">:</td><td>${school}</td></tr>
    <tr><td class="label">Jalur Pendaftaran</td><td class="colon">:</td><td>${jalur}</td></tr>
  </table>

  <p class="content">Sesuai dengan kriteria yang ditetapkan, peserta didik tersebut di atas dinyatakan:</p>
  
  <div class="result-box">
    LULUS SELEKSI
  </div>

  <p class="content indent">Demikian surat keterangan ini diberikan sebagai bukti kelulusan sementara untuk keperluan administrasi daftar ulang. Harap segera melakukan pendaftaran kembali di loket fisik sekolah sesuai dengan jadwal yang ditentukan dengan membawa berkas asli.</p>

  <div class="footer">
    <div class="sign-box">
      <p>Tompaso, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <p>Kepala Sekolah,</p>
      <div class="space"></div>
      <p style="font-weight:bold; text-decoration:underline;">Junus N.M. Akay, S.Pd, M.Si</p>
      <p>NIP. 19740520 200501 1 008</p>
    </div>
  </div>
</div>

<div class="no-print" style="text-align:center; padding: 20px;">
  <button onclick="window.print()" style="padding:12px 25px; background:black; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">CETAK SEKARANG</button>
  <button onclick="window.close()" style="padding:12px 25px; background:#ddd; color:black; border:none; border-radius:8px; font-weight:bold; cursor:pointer; margin-left:10px;">TUTUP</button>
</div>
</body>
</html>`;

      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    };

    return (
      <div className="min-h-screen bg-[#0A0F1E] flex flex-col pt-12 pb-24 px-4 relative overflow-hidden font-sans">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20 ${isDiterima ? 'bg-emerald-500' : isDitolak ? 'bg-rose-500' : 'bg-amber-500'}`} />
        </div>

        <div className="max-w-3xl w-full mx-auto relative z-10 flex-grow flex flex-col justify-center">
          
          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center gap-4">
            <img src={SCHOOL_ASSETS.LOGO} alt="SMAN 2 Tompaso" className="w-20 h-20" />
            <div>
              <h1 className="text-white text-xl font-bold uppercase tracking-widest">Pengumuman Seleksi PPDB</h1>
              <p className="text-gray-400 text-sm">SMA Negeri 2 Tompaso • Tahun 2025</p>
            </div>
          </div>

          {/* MAIN RESULT CARD ──────────────────────────── */}
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
            
            {/* Status Banner */}
            <div className={`px-8 py-10 text-center ${
              isDiterima ? 'bg-gradient-to-br from-emerald-600 to-green-500' : 
              isDitolak ? 'bg-gradient-to-br from-rose-600 to-red-500' : 
              'bg-gradient-to-br from-amber-500 to-orange-400'
            }`}>
              <div className="mb-4 flex justify-center">
                {isDiterima && <CheckCircle className="w-16 h-16 text-white" />}
                {isDitolak && <XCircle className="w-16 h-16 text-white/90" />}
                {isMenunggu && <Clock className="w-16 h-16 text-white" />}
              </div>
              
              {isDiterima && (
                <>
                  <p className="text-green-100 font-bold tracking-[0.2em] mb-2 uppercase text-xs md:text-sm">Selamat! Anda Dinyatakan</p>
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">LULUS SELEKSI</h2>
                </>
              )}

              {isDitolak && (
                <>
                  <p className="text-rose-100 font-bold tracking-[0.2em] mb-2 uppercase text-xs">Mohon Maaf, Anda</p>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-3">TIDAK LULUS SELEKSI</h2>
                  <p className="text-rose-100 text-sm">Tetap semangat dan jangan menyerah!</p>
                </>
              )}

              {isMenunggu && (
                <>
                  <p className="text-amber-100 font-bold tracking-[0.2em] mb-2 uppercase text-xs">Status Pendaftaran</p>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-3">Masih Diproses</h2>
                  <p className="text-amber-100 text-sm">Data Anda sedang dalam tahap verifikasi oleh panitia.</p>
                </>
              )}
            </div>

            {/* Biodata Section */}
            <div className="p-8 md:p-10 space-y-8 bg-[#FDFDFD]">
              
              <div className="border-l-4 border-slate-900 pl-5">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Nomor Pendaftaran</p>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-2xl md:text-3xl font-black text-slate-900 tracking-wider">
                    {resultData.nomor_pendaftaran || '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nama Lengkap</p>
                  <p className="text-lg font-bold text-slate-800">{resultData.nama_lengkap}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">NISN</p>
                  <p className="text-lg font-bold text-slate-800 font-mono tracking-wider">{resultData.nisn}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Asal Sekolah</p>
                  <p className="text-lg font-bold text-slate-800">{resultData.asal_sekolah || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Jalur Pendaftaran</p>
                  <p className="text-lg font-bold text-slate-800">{resultData.jalur_pendaftaran || 'Reguler'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tempat, Tanggal Lahir</p>
                  <p className="text-base font-bold text-slate-700">{resultData.tempat_lahir}, {resultData.tanggal_lahir}</p>
                </div>
              </div>

              {/* Teks Instruksi Tambahan (Conditional) */}
              {isDiterima && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mt-6 animate-in fade-in zoom-in duration-500 delay-300">
                  <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Instruksi Daftar Ulang
                  </h4>
                  <ul className="text-sm text-emerald-700 space-y-2">
                    <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Segera lakukan daftar ulang di loket pendaftaran SMA Negeri 2 Tompaso.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Bawa berkas fisik (Ijazah/SKHUN Asli, KK Asli, Akta Kelahiran, dan pas foto 3x4).</li>
                    <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 shrink-0 mt-0.5" /> Keterlambatan daftar ulang akan dianggap mengundurkan diri.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Card */}
            <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button onClick={handleReset} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm w-full sm:w-auto justify-center">
                <LogOut className="w-4 h-4" /> Cek Nomor Lain
              </button>
              {isDiterima && (
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 rounded-lg font-bold transition-all w-full sm:w-auto"
                >
                  <Download className="w-4 h-4" /> Unduh Bukti Lulus
                </button>
              )}
            </div>

          </div>

          <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-widest">
            Dicetak pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WITA
          </p>

        </div>
      </div>
    );
  }

  // ── FORM PENCARIAN ────────────────────────────────────────────────────────

  return (
    <div className="min-h-[85vh] bg-[#0A0F1E] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-xl w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-2xl backdrop-blur-sm">
            <Search className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Cek Hasil Seleksi</h1>
          <p className="text-gray-400">Masukkan Nomor Pendaftaran atau NISN untuk melihat hasil seleksi PPDB Anda.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nomor Registrasi / NISN</label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Contoh: SMAN2T-25-12345 atau NISN"
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-2xl px-6 py-4 text-white text-lg font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600 placeholder:font-sans"
              />
              {searchError && (
                <p className="text-red-400 text-sm mt-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> {searchError}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSearching || !searchInput.trim()}
              className="w-full px-6 py-4 rounded-2xl font-black text-[#0A0F1E] bg-blue-500 hover:bg-blue-400 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mencari Data...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Lihat Hasil</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
             <p className="text-gray-500 text-xs">
               Keamanan dan kerahasiaan data dijamin sepenuhnya oleh sistem panitia PPDB SMA Negeri 2 Tompaso.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PPDBStatus;
