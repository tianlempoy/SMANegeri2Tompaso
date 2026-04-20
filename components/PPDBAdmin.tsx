import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, XCircle, Clock, Search, Download, Eye, Trash2, Edit3, Loader2, RefreshCw, User, Phone, MapPin, BookOpen, Filter, FileSpreadsheet, FileJson } from 'lucide-react';
import { PPDBRegistration } from '../types.js';
import { apiPPDBGetAll, apiPPDBUpdateStatus, fetchPPDBSettings, updatePPDBSettings } from '../lib/actions';
import { getPPDBYear, getTargetAcademicYear } from '../lib/utils';

interface PPDBAdminProps {
  onLogout?: () => void;
  isEmbedded?: boolean;
}

const PPDBAdmin: React.FC<PPDBAdminProps> = ({ onLogout, isEmbedded }) => {
  const [registrations, setRegistrations] = useState<PPDBRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'menunggu' | 'diterima' | 'ditolak'>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<PPDBRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPPDBOpen, setIsPPDBOpen] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    loadData();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const res = await fetchPPDBSettings();
    if (res.data) {
      setIsPPDBOpen(res.data.is_ppdb_open);
    }
  };

  const handleTogglePPDB = async () => {
    setSettingsLoading(true);
    const newStatus = !isPPDBOpen;
    const res = await updatePPDBSettings(newStatus);
    if (res.success) {
      setIsPPDBOpen(newStatus);
    }
    setSettingsLoading(false);
  };

  const loadData = async () => {
    setLoading(true);
    const res = await apiPPDBGetAll();
    if (res.data) setRegistrations(res.data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string | number, newStatus: string) => {
    setIsUpdating(true);
    const res = await apiPPDBUpdateStatus(id, newStatus);
    if (res.success) {
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === id ? { ...reg, status_pendaftaran: newStatus } : reg
        )
      );
    }
    setIsUpdating(false);
    setSelectedRegistration(null);
  };

  const exportToCSV = () => {
    // Get headers
    const headers = ['No', 'Nama Lengkap', 'NISN', 'Sekolah Asal', 'NPSN', 'Status', 'Tanggal Daftar'];
    
    // Sort data: Diterima -> Menunggu -> Ditolak
    const sortedData = [...filteredRegistrations].sort((a, b) => {
      const order = { diterima: 0, menunggu: 1, ditolak: 2 };
      return (order[a.status_pendaftaran as keyof typeof order] || 3) - 
             (order[b.status_pendaftaran as keyof typeof order] || 3);
    });

    // Map rows
    const rows = sortedData.map((reg, index) => [
      index + 1,
      reg.nama_lengkap,
      reg.nisn,
      reg.asal_sekolah,
      reg.npsn_sekolah,
      reg.status_pendaftaran?.toUpperCase(),
      new Date(reg.created_at || '').toLocaleDateString('id-ID')
    ]);

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `DATA_PPDB_SMAN2T_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const sortedData = [...filteredRegistrations].sort((a, b) => {
      const order = { diterima: 0, menunggu: 1, ditolak: 2 };
      return (order[a.status_pendaftaran as keyof typeof order] || 3) - 
             (order[b.status_pendaftaran as keyof typeof order] || 3);
    });

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Laporan PPDB SMAN 2 Tompaso</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .header h2 { margin: 0; font-size: 24px; }
            .header h3 { margin: 5px 0; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: left; font-size: 11px; }
            th { background-color: #f9f9f9; font-weight: bold; text-transform: uppercase; }
            .status { font-weight: bold; }
            .diterima { color: #059669; }
            .menunggu { color: #d97706; }
            .ditolak { color: #dc2626; }
            .footer { margin-top: 50px; text-align: right; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>REKAPITULASI PENDAFTARAN PPDB</h2>
            <h3>SMA NEGERI 2 TOMPASO</h3>
            <p>Tahun Pelajaran 2025/2026</p>
          </div>
          <p>Total Data: <strong>${sortedData.length} Calon Siswa</strong></p>
          <table>
            <thead>
              <tr>
                <th style="width: 30px">No</th>
                <th>Nama Lengkap</th>
                <th>NISN</th>
                <th>Asal Sekolah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${sortedData.map((reg, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${reg.nama_lengkap}</td>
                  <td>${reg.nisn}</td>
                  <td>${reg.asal_sekolah}</td>
                  <td class="status ${reg.status_pendaftaran}">${reg.status_pendaftaran?.toUpperCase()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style="margin-top: 60px;">Panitia PPDB SMAN 2 Tompaso</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    // Wait for content to load
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.nisn?.includes(searchTerm) ||
                         (reg.asal_sekolah || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || reg.status_pendaftaran === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'diterima':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Diterima</span>;
      case 'ditolak':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Ditolak</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Menunggu</span>;
    }
  };

  const stats = {
    total: registrations.length,
    menunggu: registrations.filter(r => r.status_pendaftaran === 'menunggu').length,
    diterima: registrations.filter(r => r.status_pendaftaran === 'diterima').length,
    ditolak: registrations.filter(r => r.status_pendaftaran === 'ditolak').length,
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen ${isEmbedded ? 'bg-transparent' : 'bg-gray-50'}`}>
      {/* Header */}
      {!isEmbedded && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-black text-[#0A0F1E]">PPDB Admin Panel</h1>
              <span className="text-gray-600">|</span>
              <span className="text-sm text-gray-600">SMAN 2 Tompaso</span>
            </div>
            <button
              onClick={onLogout}
              className="text-sm text-gray-600 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </header>
      )}

      <div className={`${isEmbedded ? 'max-w-full px-0 py-0' : 'max-w-7xl mx-auto px-6 py-8'}`}>
        {/* System Configuration */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${isPPDBOpen ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-700'}`}>
                <RefreshCw className={`w-6 h-6 sm:w-8 sm:h-8 text-white ${settingsLoading ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-black tracking-tight">Konfigurasi Sistem PPDB</h3>
                <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1">
                  Pendaftaran {getPPDBYear()} — Tahun Ajaran {getTargetAcademicYear()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status Pendaftaran</p>
                <p className={`text-sm font-bold ${isPPDBOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPPDBOpen ? 'SEDANG DIBUKA' : 'SEDANG DITUTUP'}
                </p>
              </div>
              <button 
                onClick={handleTogglePPDB}
                disabled={settingsLoading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isPPDBOpen ? 'bg-emerald-500' : 'bg-slate-600'}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isPPDBOpen ? 'translate-x-7' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-bold uppercase tracking-widest">Total</p>
                <p className="text-3xl font-black text-[#0A0F1E]">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-bold uppercase tracking-widest">Menunggu</p>
                <p className="text-3xl font-black text-yellow-600">{stats.menunggu}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-bold uppercase tracking-widest">Diterima</p>
                <p className="text-3xl font-black text-green-600">{stats.diterima}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-bold uppercase tracking-widest">Ditolak</p>
                <p className="text-3xl font-black text-red-600">{stats.ditolak}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-xl">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NISN, atau sekolah asal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
              >
                <option value="all">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="diterima">Diterima</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
            <button
              onClick={loadData}
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              <button 
                onClick={exportToCSV}
                className="px-4 py-2 hover:bg-white hover:shadow-sm rounded-lg text-green-700 text-sm font-bold transition-all flex items-center space-x-2"
                title="Ekspor ke Excel (CSV)"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel</span>
              </button>
              <button 
                onClick={exportToPDF}
                className="px-4 py-2 hover:bg-white hover:shadow-sm rounded-lg text-red-700 text-sm font-bold transition-all flex items-center space-x-2"
                title="Cetak Laporan PDF"
              >
                <FileText className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Memuat data...</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">Tidak ada data ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">No</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">Nama</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">NISN</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">Sekolah Asal</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">Tanggal Daftar</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRegistrations.map((reg, index) => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-[#0A0F1E]">{reg.nama_lengkap}</p>
                          <p className="text-xs text-gray-600">{reg.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reg.nisn}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reg.asal_sekolah || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(reg.created_at)}</td>
                      <td className="px-6 py-4">{getStatusBadge(reg.status_pendaftaran)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedRegistration(reg)}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                            title="Terima"
                            onClick={() => handleUpdateStatus(reg.id, 'diterima')}
                            disabled={isUpdating}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                            title="Tolak"
                            onClick={() => handleUpdateStatus(reg.id, 'ditolak')}
                            disabled={isUpdating}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-black text-[#0A0F1E]">Detail Pendaftaran</h3>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                {getStatusBadge(selectedRegistration.status_pendaftaran)}
              </div>

              {/* Data Siswa */}
              <div>
                <h4 className="font-bold text-[#0A0F1E] mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" /> Data Siswa
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nama Lengkap:</span>
                    <p className="font-medium">{selectedRegistration.nama_lengkap}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">NISN:</span>
                    <p className="font-medium">{selectedRegistration.nisn}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tempat/Tgl Lahir:</span>
                    <p className="font-medium">{selectedRegistration.tempat_lahir || '-'}, {selectedRegistration.tanggal_lahir || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Jenis Kelamin:</span>
                    <p className="font-medium">{selectedRegistration.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Agama:</span>
                    <p className="font-medium">{selectedRegistration.agama || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Alamat:</span>
                    <p className="font-medium">{selectedRegistration.alamat_lengkap || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Data Orang Tua */}
              <div>
                <h4 className="font-bold text-[#0A0F1E] mb-3 flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> Data Orang Tua
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nama Ayah:</span>
                    <p className="font-medium">{selectedRegistration.nama_ayah || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nama Ibu:</span>
                    <p className="font-medium">{selectedRegistration.nama_ibu || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">No. Telp WhatsApp:</span>
                    <p className="font-medium">{selectedRegistration.nomor_wa_ortu || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Sekolah Asal */}
              <div>
                <h4 className="font-bold text-[#0A0F1E] mb-3 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" /> Sekolah Asal
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Nama Sekolah:</span>
                    <p className="font-medium">{selectedRegistration.asal_sekolah || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">NPSN:</span>
                    <p className="font-medium">{selectedRegistration.npsn_sekolah || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                {selectedRegistration.status_pendaftaran !== 'diterima' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedRegistration.id, 'diterima')}
                    disabled={isUpdating}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Terima</span>
                  </button>
                )}
                {selectedRegistration.status_pendaftaran !== 'ditolak' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedRegistration.id, 'ditolak')}
                    disabled={isUpdating}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tolak</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PPDBAdmin;
