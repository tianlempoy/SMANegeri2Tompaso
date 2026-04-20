import React, { useState, useEffect } from 'react';
import { 
  LogOut, LayoutDashboard, Users, FileText, BarChart3, Calendar, Clock, 
  Bell, Plus, Trash2, Edit3, Loader2, RefreshCw, Save, X, AlertCircle,
  Crown, Shield, Award, TrendingUp, Activity, FileCheck, BookOpen,
  ChevronRight, Sparkles, Lock, Eye, Settings, UserCheck, Menu
} from 'lucide-react';
import { teacherLogout, fetchNews, fetchSchedules, fetchAnnouncements, insertNews, updateNews, deleteNews, insertSchedule, updateSchedule, deleteSchedule, insertAnnouncement, updateAnnouncement, deleteAnnouncement } from '../lib/actions';
import { NewsItem } from '../types.js';
import { SCHOOL_ASSETS } from '../constants/assets';
import PPDBAdmin from './PPDBAdmin';

interface TeacherDashboardProps {
  onLogout: () => void;
  teacherInfo?: any;
}

interface Schedule {
  id: string | number;
  title: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  description: string;
  type: 'daily' | 'weekly' | 'event' | 'holiday';
  created_at?: string;
}

interface Announcement {
  id: string | number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'archived';
  published_date: string;
  created_at?: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout, teacherInfo }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State untuk form editing
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [actionMsg, setActionMsg] = useState<{type: 'success'|'error', text: string}|null>(null);

  const showMsg = (type: 'success'|'error', text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 3500);
  };

  const isAdmin = teacherInfo?.role === 'admin' || teacherInfo?.role === 'kepala_sekolah' || teacherInfo?.role === 'tata_usaha';
  const isKepalaSekolah = teacherInfo?.role === 'kepala_sekolah';
  const isTataUsaha = teacherInfo?.role === 'tata_usaha';
  const isPremiumUser = isKepalaSekolah || isTataUsaha;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [newsRes, scheduleRes, announcementRes] = await Promise.all([
        fetchNews(),
        fetchSchedules(),
        fetchAnnouncements()
      ]);
      if (newsRes.data) setNews(newsRes.data);
      if (scheduleRes.data) setSchedules(scheduleRes.data);
      if (announcementRes.data) setAnnouncements(announcementRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await teacherLogout();
    onLogout();
  };

  const handleNewItem = (type: string) => {
    setEditingItem(null);
    if (type === 'news') {
      setFormData({
        title: '',
        category: 'Pengumuman',
        excerpt: '',
        content: '',
        image_url: '',
        author_name: teacherInfo?.fullName || ''
      });
    } else if (type === 'schedule') {
      setFormData({
        title: '',
        day: '',
        startTime: '',
        endTime: '',
        description: '',
        type: 'daily'
      });
    } else if (type === 'announcement') {
      setFormData({
        title: '',
        content: '',
        priority: 'medium',
        status: 'active'
      });
    }
    setIsFormOpen(true);
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem({ ...item, type });
    setFormData(item);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      let result: any;
      if (activeTab === 'berita') {
        if (editingItem) {
          result = await updateNews(editingItem.id, formData);
        } else {
          result = await insertNews(formData);
        }
      } else if (activeTab === 'jadwal') {
        if (editingItem) {
          result = await updateSchedule(editingItem.id, formData);
        } else {
          result = await insertSchedule(formData);
        }
      } else if (activeTab === 'pengumuman') {
        const annData = { ...formData, published_date: new Date().toLocaleDateString('id-ID') };
        if (editingItem) {
          result = await updateAnnouncement(editingItem.id, annData);
        } else {
          result = await insertAnnouncement(annData);
        }
      }

      if (result?.error) throw new Error(result.error?.message || 'Gagal menyimpan data.');

      await loadData();
      setIsFormOpen(false);
      setFormData({});
      setEditingItem(null);
      showMsg('success', 'Data berhasil disimpan!');
    } catch (err: any) {
      console.error('Submit Error:', err);
      showMsg('error', err?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string | number, type: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
    
    try {
      let result: any;
      if (type === 'news') {
        result = await deleteNews(id);
      } else if (type === 'schedule') {
        result = await deleteSchedule(id);
      } else if (type === 'announcement') {
        result = await deleteAnnouncement(id);
      }
      if (result?.error) throw new Error(result.error?.message || 'Gagal menghapus.');
      await loadData();
      showMsg('success', 'Data berhasil dihapus.');
    } catch (err: any) {
      console.error('Delete Error:', err);
      showMsg('error', err?.message || 'Gagal menghapus data.');
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const getRoleLabel = (role: string) => {
    const roles: { [key: string]: string } = {
      'guru': '👨‍🏫 Guru',
      'kepala_sekolah': '🎓 Kepala Sekolah',
      'tata_usaha': '📋 Tata Usaha',
      'admin': '🛡️ Administrator'
    };
    return roles[role] || role;
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'low': 'bg-green-100 text-green-700',
      'medium': 'bg-blue-100 text-blue-700',
      'high': 'bg-red-100 text-red-700'
    };
    return colors[priority] || 'bg-gray-100 text-black';
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', shortLabel: '📊', icon: BarChart3 },
    ...(isAdmin 
      ? [{ id: 'berita', label: 'Kelola Berita', shortLabel: '📰', icon: FileText }] 
      : [{ id: 'berita', label: 'Berita', shortLabel: '📰', icon: FileText }]
    ),
    ...(isAdmin 
      ? [{ id: 'jadwal', label: 'Kelola Jadwal', shortLabel: '📅', icon: Calendar }] 
      : [{ id: 'jadwal', label: 'Jadwal', shortLabel: '📅', icon: Calendar }]
    ),
    ...(isAdmin ? [{ id: 'pengumuman', label: 'Pengumuman', shortLabel: '🔔', icon: Bell }] : []),
    { id: 'ppdb', label: 'Pendaftar PPDB', shortLabel: '📝', icon: UserCheck }
  ];

  return (
    <div className="bg-[#F8F9FB] min-h-screen pb-16 sm:pb-20">
      {/* Action Messages */}
      {actionMsg && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 z-[200] px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl font-bold flex items-center gap-3 transition-all duration-300 ${
          actionMsg.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        }`}>
          {actionMsg.type === 'success' ? '✅' : '❌'} <span className="text-sm sm:text-base">{actionMsg.text}</span>
        </div>
      )}

      {/* Header - Mobile Responsive */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[60] shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-5">
          <div className="flex justify-between items-center gap-2">
            {/* Logo & Title */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <img 
                src={SCHOOL_ASSETS.LOGO} 
                alt="Logo SMAN 2 Tompaso" 
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/20 object-cover flex-shrink-0" 
              />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-xl font-black text-[#0A0F1E] tracking-tight uppercase truncate">
                  Portal <span className="text-blue-600">Guru</span>
                </h1>
                <p className="text-[8px] sm:text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-0.5 hidden xs:block">
                  SMAN 2 Tompaso
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 sm:space-x-6 flex-shrink-0">
              {/* User Info - Hide name on very small screens */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#0A0F1E] truncate max-w-[140px]">{teacherInfo?.fullName}</p>
                <p className="text-[10px] text-gray-600 font-medium">{getRoleLabel(teacherInfo?.role)}</p>
              </div>
              {/* User avatar for mobile */}
              <div className="sm:hidden flex items-center gap-1">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs flex-shrink-0">
                  {teacherInfo?.fullName?.charAt(0) || 'G'}
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="group text-[9px] sm:text-[10px] font-black text-gray-600 hover:text-red-500 transition-all uppercase tracking-widest flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-red-50"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-10">
        {/* Welcome Section - Mobile Responsive */}
        {isPremiumUser ? (
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white mb-6 sm:mb-10 shadow-2xl">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="bg-amber-500/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-amber-400/30">
                  <span className="text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-1 sm:gap-2">
                    {isKepalaSekolah ? <><Crown className="w-3 h-3 sm:w-4 sm:h-4" /> Pimpinan</> : <><Shield className="w-3 h-3 sm:w-4 sm:h-4" /> Tata Usaha</>}
                  </span>
                </div>
              </div>
              <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-tight">
                Selamat Datang, {teacherInfo?.fullName}! 🎓
              </h2>
              <p className="text-slate-300 text-sm sm:text-lg mb-4 sm:mb-6">
                ✨ Akses premium untuk mengelola konten sekolah.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button onClick={() => handleTabChange('berita')} className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all border border-white/10">
                  📰 Berita
                </button>
                <button onClick={() => handleTabChange('jadwal')} className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all border border-white/10">
                  📅 Jadwal
                </button>
                <button onClick={() => handleTabChange('ppdb')} className="bg-emerald-500/20 hover:bg-emerald-500/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all border border-emerald-400/30 text-emerald-300">
                  📝 PPDB
                </button>
                <button onClick={() => setShowPolicyModal(true)} className="bg-amber-500/20 hover:bg-amber-500/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all border border-amber-400/30 text-amber-300">
                  📋 Kebijakan
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white mb-6 sm:mb-10 shadow-xl shadow-blue-600/20">
            <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-tight">
              Selamat Datang, {teacherInfo?.fullName}! 👋
            </h2>
            <p className="text-blue-100 text-sm sm:text-lg">
              {isAdmin ? '🔐 Akses penuh untuk mengelola konten sekolah.' : 'Lihat informasi dan data terkini dari sekolah.'}
            </p>
          </div>
        )}

        {/* Tab Navigation - Mobile Responsive with horizontal scroll */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile: scrollable tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0 pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-shrink-0 px-3 sm:px-6 py-2.5 sm:py-3 font-bold text-[10px] sm:text-sm uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 hover:text-gray-800 border-transparent'
                }`}
              >
                <span className="sm:hidden">{tab.shortLabel} <span className="text-[9px] normal-case">{tab.label.replace('Kelola ', '')}</span></span>
                <span className="hidden sm:inline">{tab.shortLabel} {tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-[9px] sm:text-sm font-bold uppercase tracking-widest">Total Berita</p>
                    <p className="text-2xl sm:text-4xl font-black text-[#0A0F1E] mt-1 sm:mt-2">{news.length}</p>
                  </div>
                  <div className="bg-blue-100 p-2.5 sm:p-4 rounded-lg sm:rounded-xl">
                    <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-[9px] sm:text-sm font-bold uppercase tracking-widest">Jadwal Aktif</p>
                    <p className="text-2xl sm:text-4xl font-black text-[#0A0F1E] mt-1 sm:mt-2">{schedules.length}</p>
                  </div>
                  <div className="bg-green-100 p-2.5 sm:p-4 rounded-lg sm:rounded-xl">
                    <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-[9px] sm:text-sm font-bold uppercase tracking-widest">Pengumuman</p>
                    <p className="text-2xl sm:text-4xl font-black text-[#0A0F1E] mt-1 sm:mt-2">{announcements.filter(a => a.status === 'active').length}</p>
                  </div>
                  <div className="bg-red-100 p-2.5 sm:p-4 rounded-lg sm:rounded-xl">
                    <Bell className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div 
                onClick={() => handleTabChange('ppdb')}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-[9px] sm:text-sm font-bold uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Pendaftaran PPDB</p>
                    <p className="text-sm sm:text-xl font-black text-[#0A0F1E] mt-1 sm:mt-2">Kelola Data</p>
                  </div>
                  <div className="bg-emerald-100 p-2.5 sm:p-4 rounded-lg sm:rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <UserCheck className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick info for mobile */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
              <h3 className="font-black text-[#0A0F1E] text-sm sm:text-lg mb-3">Info Akun</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Nama</span>
                  <span className="font-bold text-[#0A0F1E] truncate max-w-[200px]">{teacherInfo?.fullName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Role</span>
                  <span className="font-bold text-blue-600">{getRoleLabel(teacherInfo?.role)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Akses</span>
                  <span className={`font-bold ${isAdmin ? 'text-green-600' : 'text-gray-600'}`}>
                    {isAdmin ? 'Penuh (Admin)' : 'Terbatas'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Berita Tab */}
        {activeTab === 'berita' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 className="text-lg sm:text-2xl font-black text-[#0A0F1E]">
                {isAdmin ? 'Kelola Berita' : 'Daftar Berita'}
              </h3>
              {isAdmin && (
                <button
                  onClick={() => handleNewItem('news')}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Berita</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-gray-600">Memuat data...</p>
              </div>
            ) : news.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 text-center border border-gray-200">
                <p className="text-gray-600 font-medium">Belum ada berita</p>
              </div>
            ) : (
              news.map(item => (
                <div key={item.id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:space-x-6 gap-3 sm:gap-0">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full sm:w-24 h-40 sm:h-24 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] sm:text-[10px] font-bold rounded-full mr-2 mb-1">
                            {item.category}
                          </span>
                          <h4 className="text-sm sm:text-lg font-bold text-[#0A0F1E] mt-1 line-clamp-2">{item.title}</h4>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(item, 'news')}
                              className="p-1.5 sm:p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                            >
                              <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, 'news')}
                              className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mt-2 line-clamp-2">{item.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[9px] sm:text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-3">
                        <span>📝 {item.author_name}</span>
                        <span>📅 {item.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Jadwal Tab */}
        {activeTab === 'jadwal' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 className="text-lg sm:text-2xl font-black text-[#0A0F1E]">
                {isAdmin ? 'Kelola Jadwal Sekolah' : 'Jadwal Sekolah'}
              </h3>
              {isAdmin && (
                <button
                  onClick={() => handleNewItem('schedule')}
                  className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Jadwal</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-2" />
                <p className="text-gray-600">Memuat data...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 text-center border border-gray-200">
                <p className="text-gray-600 font-medium">Belum ada jadwal</p>
              </div>
            ) : (
              schedules.map(item => (
                <div key={item.id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="text-sm sm:text-lg font-bold text-[#0A0F1E]">{item.title}</h4>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] sm:text-[10px] font-bold rounded-full">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">{item.description}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                        {item.day && <span>📅 {item.day}</span>}
                        {item.startTime && item.endTime && <span>🕐 {item.startTime} - {item.endTime}</span>}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(item, 'schedule')}
                          className="p-1.5 sm:p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, 'schedule')}
                          className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pengumuman Tab */}
        {activeTab === 'pengumuman' && isAdmin && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 className="text-lg sm:text-2xl font-black text-[#0A0F1E]">Kelola Pengumuman</h3>
              <button
                onClick={() => handleNewItem('announcement')}
                className="w-full sm:w-auto bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Pengumuman</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-2" />
                <p className="text-gray-600">Memuat data...</p>
              </div>
            ) : announcements.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 text-center border border-gray-200">
                <p className="text-gray-600 font-medium">Belum ada pengumuman</p>
              </div>
            ) : (
              announcements.map(item => (
                <div key={item.id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="text-sm sm:text-lg font-bold text-[#0A0F1E] w-full sm:w-auto">{item.title}</h4>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${getPriorityColor(item.priority)}`}>
                          {item.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-black'}`}>
                          {item.status === 'active' ? 'AKTIF' : 'ARSIP'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-3">{item.content}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2">📅 {item.published_date}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(item, 'announcement')}
                        className="p-1.5 sm:p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, 'announcement')}
                        className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PPDB Admin Tab */}
        {activeTab === 'ppdb' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-h-[600px]">
            <PPDBAdmin isEmbedded={true} />
          </div>
        )}
      </div>

      {/* Policy Modal for Premium Users */}
      {showPolicyModal && isPremiumUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-white">Ketentuan & Kebijakan</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Portal Guru SMAN 2 Tompaso</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPolicyModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6">
              <div className="bg-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    {isKepalaSekolah ? <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" /> : <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm sm:text-lg">
                      {isKepalaSekolah ? 'Akses Pimpinan Utama' : 'Akses Staff Tata Usaha'}
                    </h4>
                    <p className="text-amber-700 text-xs sm:text-sm mt-1">
                      {isKepalaSekolah 
                        ? 'Anda memiliki akses premium sebagai Kepala Sekolah.'
                        : 'Anda memiliki akses premium sebagai Staff Tata Usaha.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-bold text-slate-900 text-sm sm:text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  Kebijakan Penggunaan
                </h4>
                
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { icon: Eye, color: 'green', title: 'Akses Informasi', desc: 'Dapat melihat semua berita, jadwal, dan pengumuman sekolah.' },
                    { icon: Edit3, color: 'blue', title: 'Kelola Konten', desc: 'Dapat menambah, edit, dan hapus berita, jadwal, dan pengumuman.' },
                    { icon: Lock, color: 'amber', title: 'Kerahasiaan Data', desc: 'Tidak diperkenankan membagikan akses kepada pihak lain.' },
                    { icon: AlertCircle, color: 'red', title: 'Tanggung Jawab', desc: 'Setiap perubahan konten menjadi tanggung jawab pengguna.' },
                  ].map((policy, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 sm:p-4 bg-slate-50 rounded-xl">
                      <div className={`w-6 h-6 rounded-full bg-${policy.color}-100 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <policy.icon className={`w-3 h-3 text-${policy.color}-600`} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-700 text-sm">{policy.title}</p>
                        <p className="text-gray-600 text-xs sm:text-sm">{policy.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-200">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-900 text-sm sm:text-base">Perhatian!</h4>
                    <p className="text-red-700 text-xs sm:text-sm mt-1">
                      Penyalahgunaan akses dapat menyebabkan pencabutan hak akses permanen.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowPolicyModal(false)}
                className="w-full px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-gray-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm sm:text-base"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal - Mobile Responsive */}
      {isFormOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Form Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center rounded-t-3xl sm:rounded-t-2xl">
              <h3 className="text-lg sm:text-2xl font-black text-[#0A0F1E]">
                {editingItem ? 'Edit Item' : 'Tambah Item Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingItem(null);
                  setFormData({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              {/* News Form */}
              {activeTab === 'berita' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Judul Berita *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      placeholder="Masukkan judul berita"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Kategori *</label>
                      <select
                        value={formData.category || 'Pengumuman'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      >
                        <option>Pendidikan</option>
                        <option>Prestasi</option>
                        <option>Kegiatan Siswa</option>
                        <option>Agenda Sekolah</option>
                        <option>Pengumuman</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Penulis</label>
                      <input
                        type="text"
                        value={formData.author_name || ''}
                        onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                        placeholder="Nama penulis"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Ringkasan *</label>
                    <textarea
                      required
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      placeholder="Ringkasan singkat berita"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Isi Berita *</label>
                    <textarea
                      required
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      placeholder="Isi lengkap berita"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">URL Gambar</label>
                    <input
                      type="url"
                      value={formData.image_url || ''}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </>
              )}

              {/* Schedule Form */}
              {activeTab === 'jadwal' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Nama Jadwal *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      placeholder="Contoh: Jam Operasional"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Hari</label>
                      <input
                        type="text"
                        value={formData.day || ''}
                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                        placeholder="Senin - Jumat"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Tipe</label>
                      <select
                        value={formData.type || 'daily'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      >
                        <option value="daily">Harian</option>
                        <option value="weekly">Mingguan</option>
                        <option value="event">Acara</option>
                        <option value="holiday">Libur</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Jam Mulai</label>
                      <input
                        type="time"
                        value={formData.startTime || ''}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Jam Selesai</label>
                      <input
                        type="time"
                        value={formData.endTime || ''}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Deskripsi *</label>
                    <textarea
                      required
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      placeholder="Deskripsi jadwal"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Announcement Form */}
              {activeTab === 'pengumuman' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Judul Pengumuman *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      placeholder="Masukkan judul pengumuman"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Prioritas</label>
                      <select
                        value={formData.priority || 'medium'}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      >
                        <option value="low">Rendah</option>
                        <option value="medium">Sedang</option>
                        <option value="high">Tinggi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Status</label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      >
                        <option value="active">Aktif</option>
                        <option value="archived">Arsip</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-600 mb-1.5 sm:mb-2">Isi Pengumuman *</label>
                    <textarea
                      required
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                      placeholder="Isi lengkap pengumuman"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingItem(null);
                    setFormData({});
                  }}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Simpan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
