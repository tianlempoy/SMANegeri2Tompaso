import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, Newspaper, Calendar, Megaphone, Trophy, Camera, ShieldCheck, 
  Settings, LogOut, Plus, Edit2, Trash2, Search, X, Check, AlertCircle, Loader2, RefreshCw, 
  Eye, FileText, ChevronRight, UserPlus, MapPin, Phone, Mail, Award, ClipboardList, FileLock2, GraduationCap,
  Bell, BookOpen, Image as ImageIcon, Shield, TrendingUp, Activity, Download, Menu
} from 'lucide-react';
import {
  fetchNews, deleteNews, insertNews, updateNews, logout,
  fetchSchedules, deleteSchedule, insertSchedule, updateSchedule,
  fetchAnnouncements, deleteAnnouncement, insertAnnouncement, updateAnnouncement,
  fetchTeachers, insertTeacher, updateTeacher, deleteTeacher,
  fetchOSIS, insertOSIS, updateOSIS, deleteOSIS,
  fetchActivities, insertActivity, updateActivity, deleteActivity,
  fetchAchievements, insertAchievement, updateAchievement, deleteAchievement,
  fetchGallery, insertGallery, deleteGallery,
  fetchPolicies, updatePolicy,
  apiGetStats, apiGetActivityLog, apiGetUsers, apiCreateUser, apiDeleteUser, apiResetPassword, apiUpdateUser,
  apiPPDBGetAll, apiPPDBUpdateStatus, apiPPDBDelete, fetchPPDBRealtime, apiSyncInitialContent,
  fetchNewsRealtime, fetchSchedulesRealtime, fetchAnnouncementsRealtime, fetchTeachersRealtime,
  fetchOSISRealtime, fetchActivitiesRealtime, fetchAchievementsRealtime, fetchGalleryRealtime
} from '../lib/actions';
import { NewsItem, SchoolSchedule, Announcement, Teacher, OSISMember, Activity as ActivityType, Achievement, GalleryImage, Policy, PPDBRegistration } from '../types.js';
import PPDBAdmin from './PPDBAdmin';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'dashboard' | 'berita' | 'jadwal' | 'pengumuman' | 'teachers' | 'osis' | 'activities' | 'achievements' | 'gallery' | 'policies' | 'ppdb' | 'users' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for all entities
  const [news, setNews] = useState<NewsItem[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [osis, setOsis] = useState<OSISMember[]>([]);
  // State untuk edit nama OSIS (rename-only)
  const DEFAULT_OSIS_JABATAN = [
    { jabatan: 'Ketua OSIS' },
    { jabatan: 'Wakil Ketua OSIS' },
    { jabatan: 'Sekretaris I' },
    { jabatan: 'Sekretaris II' },
    { jabatan: 'Bendahara I' },
    { jabatan: 'Bendahara II' },
  ] as const;
  const [osisEditNames, setOsisEditNames] = useState<{[jabatan: string]: string}>({});
  const [osisSaving, setOsisSaving] = useState<{[jabatan: string]: boolean}>({});
  const [osisSaved, setOsisSaved] = useState<{[jabatan: string]: boolean}>({});
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [ppdb, setPpdb] = useState<PPDBRegistration[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  
  // Custom states for PPDB
  const [viewingApplicant, setViewingApplicant] = useState<PPDBRegistration | null>(null);

  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [formType, setFormType] = useState<TabType>('berita');
  const [actionMsg, setActionMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        fetchNews(), fetchSchedules(), fetchAnnouncements(),
        fetchTeachers(), fetchOSIS(), fetchActivities(),
        fetchAchievements(), fetchGallery(), fetchPolicies(),
        apiPPDBGetAll(), apiGetUsers(), apiGetStats(), apiGetActivityLog({ limit: 20 })
      ]);

      const dataMap = [
        setNews, setSchedules, setAnnouncements,
        setTeachers, setOsis, setActivities,
        setAchievements, setGallery, setPolicies,
        setPpdb, setUsers, setStats, setActivityLog
      ];

      results.forEach((res, i) => {
        if (res.status === 'fulfilled' && (res.value as any).data) {
          dataMap[i]((res.value as any).data);
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadAll(); 
    
    // Setup Realtime Subscriptions
    const unsubNews = fetchNewsRealtime(setNews);
    const unsubSch = fetchSchedulesRealtime(setSchedules);
    const unsubAnn = fetchAnnouncementsRealtime(setAnnouncements);
    const unsubTea = fetchTeachersRealtime(setTeachers);
    const unsubPPI = fetchPPDBRealtime(setPpdb);
    const unsubAct = fetchActivitiesRealtime(setActivities);
    const unsubAch = fetchAchievementsRealtime(setAchievements);
    const unsubGal = fetchGalleryRealtime(setGallery);
    const unsubOsi = fetchOSISRealtime(setOsis);
    
    return () => { 
      unsubNews && unsubNews();
      unsubSch && unsubSch();
      unsubAnn && unsubAnn();
      unsubTea && unsubTea();
      unsubPPI && unsubPPI();
      unsubAct && unsubAct();
      unsubAch && unsubAch();
      unsubGal && unsubGal();
      unsubOsi && unsubOsi();
    };
  }, []);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 3500);
  };

  const openForm = (type: TabType, item?: any) => {
    setFormType(type);
    setEditingItem(item || null);
    setFormData(item ? { ...item } : getDefaultForm(type));
    setIsFormOpen(true);
  };

  const getDefaultForm = (type: TabType) => {
    const defaults: any = {
      berita: { title: '', category: 'Pendidikan', excerpt: '', content: '', image_url: '', author_name: 'Admin' },
      jadwal: { title: '', day: '', start_time: '', end_time: '', description: '', type: 'daily' },
      pengumuman: { title: '', content: '', priority: 'medium', status: 'active' },
      teachers: { nama: '', nip: '', spesialisasi: '', email: '', phone: '', photo_url: '', jabatan: 'Guru', status: 'aktif' },
      osis: { nama: '', jabatan: 'Anggota', kelas: '', email: '', phone: '', photo_url: '', masa_jabatan: '2025/2026', status: 'aktif' },
      activities: { title: '', date: '', description: '', image_url: '', location: '', category: 'Ekskul' },
      achievements: { title: '', year: '', description: '', image_url: '', recipient_name: '', category: 'Akademik' },
      gallery: { title: '', image_url: '', category: 'Umum' },
      user: { username: '', full_name: '', password: '', role: 'guru', email: '', phone: '' },
    };
    return defaults[type] || {};
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result;
      switch (formType) {
        case 'berita': 
          result = editingItem ? await updateNews(editingItem.id, formData) : await insertNews(formData); break;
        case 'jadwal':
          result = editingItem ? await updateSchedule(editingItem.id, formData) : await insertSchedule(formData); break;
        case 'pengumuman':
          result = editingItem ? await updateAnnouncement(editingItem.id, formData) : await insertAnnouncement(formData); break;
        case 'teachers':
          result = editingItem ? await updateTeacher(editingItem.id, formData) : await insertTeacher(formData); break;
        case 'osis':
          result = editingItem ? await updateOSIS(editingItem.id, formData) : await insertOSIS(formData); break;
        case 'activities':
          result = editingItem ? await updateActivity(editingItem.id, formData) : await insertActivity(formData); break;
        case 'achievements':
          result = editingItem ? await updateAchievement(editingItem.id, formData) : await insertAchievement(formData); break;
        case 'gallery':
          result = await insertGallery(formData); break;
        case 'policies':
          result = await updatePolicy(editingItem.id, formData); break;
        case 'users':
          result = editingItem ? await apiUpdateUser(editingItem.id, formData) : await apiCreateUser(formData); break;
      }
      
      if (result && (result as any).error) throw (result as any).error;

      setIsFormOpen(false);
      setEditingItem(null);
      await loadAll();
      showMsg('success', editingItem ? 'Data berhasil diperbarui.' : 'Data berhasil ditambahkan.');
    } catch (err: any) {
      showMsg('error', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any, type: TabType, name: string) => {
    if (!confirm(`Hapus "${name}" secara permanen?`)) return;
    try {
      let res: any;
      switch (type) {
        case 'berita': res = await deleteNews(id); break;
        case 'jadwal': res = await deleteSchedule(id); break;
        case 'pengumuman': res = await deleteAnnouncement(id); break;
        case 'teachers': res = await deleteTeacher(id); break;
        case 'osis': res = await deleteOSIS(id); break;
        case 'activities': res = await deleteActivity(id); break;
        case 'achievements': res = await deleteAchievement(id); break;
        case 'gallery': res = await deleteGallery(id); break;
        case 'ppdb': res = await apiPPDBDelete(id); break;
        case 'users': res = await apiDeleteUser(id); break;
      }
      if (res?.error) throw res.error;
      await loadAll();
      showMsg('success', 'Data berhasil dihapus.');
    } catch (err: any) {
      showMsg('error', err.message);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'berita', label: 'Berita & Artikel', icon: FileText },
    { id: 'jadwal', label: 'Jadwal Sekolah', icon: Calendar },
    { id: 'pengumuman', label: 'Pengumuman', icon: Bell },
    { id: 'teachers', label: 'Daftar Guru', icon: BookOpen },
    { id: 'osis', label: 'Pengurus OSIS', icon: Users },
    { id: 'activities', label: 'Kegiatan Sekolah', icon: ClipboardList },
    { id: 'achievements', label: 'Prestasi Siswa', icon: Award },
    { id: 'gallery', label: 'Galeri Foto', icon: ImageIcon },
    { id: 'ppdb', label: 'Pendaftar PPDB', icon: GraduationCap },
    { id: 'policies', label: 'Kebijakan', icon: FileLock2 },
    { id: 'users', label: 'Akses User', icon: Shield },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // close sidebar on mobile after tab select
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-[80] lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Action Messages */}
      {actionMsg && (
        <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-right-10 duration-300 ${actionMsg.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
          {actionMsg.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {actionMsg.text}
        </div>
      )}

      {/* Sidebar - hidden on mobile, shown on lg+ OR when isSidebarOpen */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[90] lg:z-auto
        w-72 bg-slate-900 lg:bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 
        flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 lg:p-8 border-b border-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl lg:rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-black text-white tracking-tight uppercase">Admin</h1>
                <span className="text-[9px] lg:text-[10px] font-black text-amber-500 tracking-[0.2em] uppercase">Portal SMAN 2</span>
              </div>
            </div>
            {/* Close button on mobile */}
            <button 
              className="lg:hidden p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 lg:px-4 py-6 lg:py-8 space-y-1 custom-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 lg:py-3.5 rounded-xl lg:rounded-2xl text-sm font-bold transition-all group ${activeTab === item.id ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              <item.icon className={`h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 ${activeTab === item.id ? 'text-slate-950' : 'text-slate-500 group-hover:text-amber-500'}`} />
              <span className="truncate">{item.label}</span>
              {activeTab === item.id && <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0" />}
            </button>
          ))}
        </nav>

        <div className="p-4 lg:p-6 border-t border-slate-800/50">
          <button 
            onClick={async () => { await logout(); onLogout(); }}
            className="w-full flex items-center justify-center gap-3 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 font-black text-sm transition-all border border-slate-700 hover:border-rose-500/30"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        {/* Mobile-responsive header */}
        <header className="px-4 lg:px-10 py-4 lg:py-8 flex justify-between items-center bg-slate-950/50 backdrop-blur-md sticky top-0 z-40 border-b border-slate-800/30 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile hamburger */}
            <button 
              className="lg:hidden p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-amber-500 transition-all flex-shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg lg:text-3xl font-black text-white tracking-tight truncate">
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-slate-500 text-[10px] lg:text-sm font-medium mt-0.5 uppercase tracking-widest hidden sm:flex items-center gap-2">
                <Activity className="h-3 w-3 text-amber-500" />
                Kelola data sekolah secara real-time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-6 flex-shrink-0">
            {/* Search - hidden on mobile, visible on md+ */}
            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
              <input 
                placeholder="Cari data..." 
                className="bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all w-48 lg:w-72"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={loadAll} className="p-3 lg:p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl lg:rounded-2xl text-slate-400 hover:text-amber-500 transition-all">
              <RefreshCw className={`h-4 w-4 lg:h-5 lg:w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 lg:px-10 py-6 lg:py-10 custom-scrollbar">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Berita', val: stats?.totalNews || news.length, trend: '+3', icon: FileText, color: 'emerald', id: 'berita' },
                  { label: 'Daftar Guru', val: stats?.totalTeachers || teachers.length, trend: '+1', icon: BookOpen, color: 'sky', id: 'teachers' },
                  { label: 'PPDB Masuk', val: stats?.totalPPDB || 0, trend: '+12', icon: GraduationCap, color: 'amber', id: 'ppdb' },
                  { label: 'Jadwal Hari Ini', val: schedules.length, icon: Calendar, color: 'indigo', id: 'jadwal' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden group hover:border-amber-500/50 transition-all cursor-pointer" onClick={() => s.id && setActiveTab(s.id as any)}>
                    <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-${s.color}-500/10 blur-[60px] group-hover:bg-amber-500/20 transition-all`} />
                    <div className="flex justify-between items-start relative z-10">
                      <div className={`p-4 bg-${s.color}-500/10 rounded-2xl text-${s.color}-500 shadow-xl`}>
                        <s.icon className="h-6 w-6" />
                      </div>
                      {s.trend && <span className="text-[10px] font-black text-emerald-400 py-1 px-2.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">+{s.trend}%</span>}
                    </div>
                    <div className="mt-8 relative z-10">
                      <h4 className="text-4xl font-black text-white">{s.val}</h4>
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-slate-900/40 rounded-[3rem] border border-slate-800 p-10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                      <Activity className="h-6 w-6 text-amber-500" />
                      Aktivitas Terbaru
                    </h3>
                    <button 
                      onClick={async () => {
                        setLoading(true);
                        try {
                          await apiSyncInitialContent();
                          await loadAll();
                          showMsg('success', 'Sinkronisasi data awal berhasil.');
                        } catch (e: any) {
                          showMsg('error', e.message || 'Gagal sinkronisasi data');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl text-sm font-bold border border-indigo-500/20 transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Sync Data Awal
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {loading && activityLog.length === 0 ? (
                      <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-600 font-bold italic">Mensinkronisasi data log...</p>
                      </div>
                    ) : activityLog.length === 0 ? (
                      <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                        <p className="text-slate-600 font-bold italic">Belum ada aktivitas tercatat.</p>
                      </div>
                    ) : activityLog.map((log: any) => (
                      <div key={log.id} className="flex gap-6 items-start p-6 bg-slate-950/40 rounded-3xl border border-slate-800/50 hover:border-amber-500/30 transition-all group">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 font-black shadow-lg">
                          {log.user_name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h5 className="font-black text-slate-200">{log.user_name} <span className="text-amber-500 ml-2">— {log.action}</span></h5>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{new Date(log.created_at).toLocaleString('id-ID')}</span>
                          </div>
                          <p className="text-slate-500 text-sm mt-1">{log.details || 'Melakukan pembaruan sistem'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/40 rounded-[3rem] border border-slate-800 p-10">
                  <h3 className="text-xl font-black text-white mb-8">Informasi Server</h3>
                  <div className="space-y-4">
                    {[
                      { l: 'Status Database', v: 'Connected', c: 'emerald' },
                      { l: 'Uptime', v: '99.99%', c: 'sky' },
                      { l: 'Region', v: 'Jakarta (ap-southeast-3)', c: 'amber' },
                      { l: 'Version', v: 'v3.2.0-stable', c: 'slate' }
                    ].map((i, idx) => (
                      <div key={idx} className="flex justify-between items-center p-5 bg-slate-950/40 rounded-2xl border border-slate-800/50">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{i.l}</span>
                        <span className={`text-${i.c}-400 font-black text-xs uppercase`}>{i.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GENERIC LIST VIEWS (Berita, Jadwal, Teachers, etc.) */}
          {(['berita', 'jadwal', 'pengumuman', 'teachers', 'activities', 'achievements', 'gallery', 'users'].includes(activeTab)) && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-black text-white">Kelola {navItems.find(i => i.id === activeTab)?.label}</h3>
                  <p className="text-slate-500 text-sm mt-1">Total: {
                    activeTab === 'berita' ? news.length : 
                    activeTab === 'jadwal' ? schedules.length :
                    activeTab === 'pengumuman' ? announcements.length :
                    activeTab === 'teachers' ? teachers.length :
                    activeTab === 'osis' ? osis.length :
                    activeTab === 'activities' ? activities.length :
                    activeTab === 'achievements' ? achievements.length :
                    activeTab === 'gallery' ? gallery.length : users.length
                  } item ditemukan</p>
                </div>
                <button 
                  onClick={() => openForm(activeTab as TabType)}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <Plus className="h-5 w-5" />
                  Tambah {activeTab === 'users' ? 'User' : 'Baru'}
                </button>
              </div>

              {loading ? (
                <div className="py-40 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {(activeTab === 'berita' ? news : 
                    activeTab === 'jadwal' ? schedules :
                    activeTab === 'pengumuman' ? announcements :
                    activeTab === 'teachers' ? teachers :
                    activeTab === 'osis' ? osis :
                    activeTab === 'activities' ? activities :
                    activeTab === 'achievements' ? achievements :
                    activeTab === 'gallery' ? gallery : users
                  ).filter(item => {
                    const str = JSON.stringify(item).toLowerCase();
                    return str.includes(searchTerm.toLowerCase());
                  }).map((item: any) => (
                    <div key={item.id} className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all flex items-center gap-6 group">
                      {(item.image_url || item.photo_url) && (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
                          <img src={item.image_url || item.photo_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                      )}
                      
                      {!(item.image_url || item.photo_url) && (activeTab === 'teachers' || activeTab === 'osis' || activeTab === 'users') && (
                        <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500 font-black text-2xl uppercase">
                          {(item.nama || item.full_name || 'U').charAt(0)}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-black text-white truncate">{item.title || item.nama || item.full_name}</h4>
                          {item.category && <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20">{item.category}</span>}
                        </div>
                        <p className="text-slate-500 text-sm truncate font-medium">
                          {activeTab === 'berita' ? item.excerpt : 
                           activeTab === 'teachers' ? `${item.jabatan || 'Guru'} — ${item.spesialisasi || 'Mapel'}` :
                           activeTab === 'osis' ? `${item.jabatan} — Kelas ${item.kelas}` :
                           item.content || item.description || item.email || item.username || 'No description'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0">
                        <button onClick={() => openForm(activeTab as TabType, item)} className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all">
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(item.id, activeTab as TabType, item.title || item.nama || item.full_name)} className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* OSIS RENAME-ONLY TAB */}
          {activeTab === 'osis' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-black text-white">Pengurus OSIS 2025/2026</h3>
                  <p className="text-slate-500 text-sm mt-1">Edit nama anggota OSIS per jabatan. Jabatan tidak dapat diubah dari sini.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DEFAULT_OSIS_JABATAN.map(({ jabatan }) => {
                  // Ambil data dari DB atau fallback
                  const member = osis.find(o => o.jabatan === jabatan);
                  const currentName = osisEditNames[jabatan] ?? (member?.nama || '');
                  const isSaving = osisSaving[jabatan];
                  const isSaved = osisSaved[jabatan];

                  return (
                    <div key={jabatan} className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 hover:border-amber-500/30 transition-all">
                      <label className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3">{jabatan}</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={currentName}
                          onChange={e => setOsisEditNames(prev => ({ ...prev, [jabatan]: e.target.value }))}
                          placeholder={`Nama ${jabatan}...`}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-700"
                        />
                        <button
                          disabled={isSaving || !currentName.trim()}
                          onClick={async () => {
                            const name = currentName.trim();
                            if (!name) return;
                            setOsisSaving(prev => ({ ...prev, [jabatan]: true }));
                            try {
                              if (member?.id) {
                                await updateOSIS(member.id, { nama: name, jabatan, masa_jabatan: '2025/2026', status: 'aktif' });
                              } else {
                                await insertOSIS({ nama: name, jabatan, kelas: '', masa_jabatan: '2025/2026', status: 'aktif' });
                              }
                              await loadAll();
                              setOsisSaved(prev => ({ ...prev, [jabatan]: true }));
                              setTimeout(() => setOsisSaved(prev => ({ ...prev, [jabatan]: false })), 2500);
                              showMsg('success', `${jabatan} berhasil diperbarui.`);
                            } catch (e: any) {
                              showMsg('error', e.message || 'Gagal menyimpan.');
                            } finally {
                              setOsisSaving(prev => ({ ...prev, [jabatan]: false }));
                            }
                          }}
                          className="px-5 py-3.5 rounded-2xl font-black text-sm transition-all disabled:opacity-40 flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95"
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : isSaved ? <Check className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          {isSaving ? 'Simpan...' : isSaved ? 'Tersimpan!' : 'Simpan'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PPDB TAB */}
          {activeTab === 'ppdb' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-black text-white">Data Pendaftar PPDB</h3>
                  <p className="text-slate-500 text-sm mt-1">Total: {ppdb.length} calon siswa terdaftar</p>
                </div>
              </div>

              {/* PPDB System Configuration */}
              <div className="max-w-4xl">
                <PPDBAdmin isEmbedded={true} />
              </div>

              {loading ? (
                <div className="py-40 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {ppdb.filter(i => {
                    const str = `${i.nama_lengkap} ${i.nisn} ${i.asal_sekolah} ${i.jalur_pendaftaran}`.toLowerCase();
                    return str.includes(searchTerm.toLowerCase());
                  }).map((item) => (
                    <div key={item.id} className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all flex items-center gap-6 group">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-xl">
                        {item.nama_lengkap.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-black text-white truncate">{item.nama_lengkap}</h4>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm ${
                            item.status_pendaftaran === 'diterima' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            item.status_pendaftaran === 'ditolak' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {item.status_pendaftaran}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm truncate font-medium">
                          NISN: {item.nisn} • Asal: {item.asal_sekolah || '-'} • Jalur: {item.jalur_pendaftaran || 'Reguler'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button onClick={() => setViewingApplicant(item)} className="p-3 bg-slate-800 hover:bg-amber-500 text-slate-400 hover:text-slate-950 border border-slate-700 rounded-2xl transition-all">
                          <Eye className="h-5 w-5" />
                        </button>
                        <div className="flex gap-1">
                          <button onClick={async () => { await apiPPDBUpdateStatus(item.id, 'diterima'); loadAll(); showMsg('success', 'Pendaftar diterima!'); }} className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all">
                            <Check className="h-5 w-5" />
                          </button>
                          <button onClick={async () => { await apiPPDBUpdateStatus(item.id, 'ditolak'); loadAll(); showMsg('error', 'Pendaftar ditolak.'); }} className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <button onClick={() => handleDelete(item.id, 'ppdb', item.nama_lengkap)} className="p-3 bg-slate-800 text-slate-500 hover:text-rose-400 border border-slate-700 rounded-2xl hover:border-rose-500/30 transition-all ml-4">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* POLICIES TAB */}
          {activeTab === 'policies' && (
            <div className="max-w-4xl mx-auto space-y-12">
              {policies.map(p => (
                <div key={p.id} className="bg-slate-900/60 rounded-[3rem] border border-slate-800 p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <FileLock2 className="h-32 w-32" />
                  </div>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h3 className="text-3xl font-black text-white">{p.title}</h3>
                      <p className="text-amber-500 text-xs font-black uppercase tracking-widest mt-2">Pembaruan Terakhir: {new Date(p.updated_at || '').toLocaleDateString('id-ID')}</p>
                    </div>
                    <button 
                      onClick={() => openForm('policies', p)}
                      className="px-6 py-3 bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 border border-slate-700 hover:border-amber-500 font-black rounded-2xl transition-all flex items-center gap-2"
                    >
                      <Edit2 className="h-4 w-4" /> Edit Kebijakan
                    </button>
                  </div>
                  <div className="prose prose-invert prose-amber max-w-none">
                    <div className="bg-slate-950/60 p-10 rounded-[2.5rem] border border-slate-800/50 leading-relaxed text-slate-400 font-medium">
                      {p.content.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-slate-900/40 rounded-[3rem] border border-slate-800 p-12 space-y-10">
              <h3 className="text-2xl font-black text-white">Konfigurasi Sekolah</h3>
              <div className="space-y-6">
                {[
                  { l: 'Nama Sekolah', v: 'SMA Negeri 2 Tompaso' },
                  { l: 'Domain Website', v: 'sman2tompaso.sch.id' },
                  { l: 'Email Official', v: 'info@sman2tompaso.sch.id' },
                  { l: 'Telepon', v: '0431-1337-xxxx' }
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 ml-4">{f.l}</label>
                    <input defaultValue={f.v} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500 transition-all font-bold" />
                  </div>
                ))}
                <button className="w-full py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-[2rem] hover:opacity-90 transition-all shadow-2xl shadow-amber-500/20 mt-8">
                  Pembaruan Pengaturan
                </button>
              </div>

              <div className="pt-10 border-t border-slate-800 space-y-6">
                <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[2rem]">
                  <h4 className="text-amber-500 font-black text-lg mb-3 flex items-center gap-3">
                    <RefreshCw className="h-5 w-5" /> Inisialisasi Database
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    Gunakan fitur ini untuk menyinkronkan data yang saat ini ada di kode website (Guru, Kegiatan, Prestasi, Galeri) ke dalam database Supabase. Tindakan ini disarankan dilakukan sekali saat setup awal.
                  </p>
                  <button 
                    onClick={async () => {
                      setLoading(true);
                      const res = await apiSyncInitialContent();
                      setLoading(false);
                      if(res.error) showMsg('error', res.error);
                      else {
                        showMsg('success', 'Data website berhasil disinkronkan ke Database!');
                        loadAll();
                      }
                    }}
                    disabled={loading}
                    className="w-full py-4 bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 border border-slate-700 hover:border-amber-500 font-black rounded-2xl transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><RefreshCw className="h-4 w-4" /> Mulai Sinkronisasi Awal</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* APPLICANT DETAIL MODAL */}
      {viewingApplicant && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <header className="px-10 py-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900 font-black">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{viewingApplicant.nama_lengkap}</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">NISN: {viewingApplicant.nisn} | Jalur: {viewingApplicant.jalur_pendaftaran}</p>
                </div>
              </div>
              <button onClick={() => setViewingApplicant(null)} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-600 hover:text-white transition-all shadow-xl">
                <X className="h-6 w-6" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest border-l-4 border-amber-500 pl-4">Info Pribadi</h4>
                  <p className="text-sm"><b>Lahir:</b> {viewingApplicant.tempat_lahir}, {viewingApplicant.tanggal_lahir}</p>
                  <p className="text-sm"><b>Gender:</b> {viewingApplicant.jenis_kelamin}</p>
                  <p className="text-sm"><b>Agama:</b> {viewingApplicant.agama}</p>
                  <p className="text-sm"><b>WA:</b> {viewingApplicant.nomor_wa}</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest border-l-4 border-indigo-500 pl-4">Asal Sekolah & Ortu</h4>
                  <p className="text-sm"><b>SMP:</b> {viewingApplicant.asal_sekolah} (Lulus {viewingApplicant.tahun_lulus})</p>
                  <p className="text-sm"><b>Ayah/Ibu:</b> {viewingApplicant.nama_ayah} / {viewingApplicant.nama_ibu}</p>
                  <p className="text-sm"><b>WA Ortu:</b> {viewingApplicant.nomor_wa_ortu}</p>
                  <p className="text-sm"><b>Alamat:</b> {viewingApplicant.alamat_lengkap}</p>
                </div>
              </div>
            </div>
            <footer className="px-10 py-8 border-t border-slate-800 bg-slate-900/80 flex gap-4 shrink-0">
              <button onClick={async () => { await apiPPDBUpdateStatus(viewingApplicant.id, 'diterima'); loadAll(); setViewingApplicant(null); showMsg('success', 'Pendaftar diterima!'); }} className="flex-1 py-4 bg-emerald-500 text-slate-950 font-black rounded-3xl transition-all">Terima</button>
              <button onClick={async () => { await apiPPDBUpdateStatus(viewingApplicant.id, 'ditolak'); loadAll(); setViewingApplicant(null); showMsg('error', 'Pendaftar ditolak.'); }} className="flex-1 py-4 bg-rose-500/20 text-rose-400 font-black rounded-3xl border border-rose-500/40 transition-all">Tolak</button>
            </footer>
          </div>
        </div>
      )}

      {/* MODAL FORM SYSTEM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-[3rem] border border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <header className="px-10 py-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl shrink-0">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">{editingItem ? 'Perbarui' : 'Tambah'} {formType}</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Formulir Manajemen Database</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-3 hover:bg-slate-800 rounded-2xl text-slate-600 hover:text-white transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
              {/* NEWS FORM */}
              {formType === 'berita' && (<>
                <div><label className="form-label">Judul Berita *</label><input required className="form-input" value={formData.title||''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Kategori</label>
                    <select className="form-input" value={formData.category||'Pendidikan'} onChange={e => setFormData({...formData, category: e.target.value})}>
                      {['Pendidikan','Prestasi','Kegiatan Siswa','Agenda Sekolah','Pengumuman'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="form-label">Penulis</label><input className="form-input" value={formData.author_name||''} onChange={e => setFormData({...formData, author_name: e.target.value})} /></div>
                </div>
                <div><label className="form-label">Ringkasan Singkat</label><textarea className="form-input" rows={3} value={formData.excerpt||''} onChange={e => setFormData({...formData, excerpt: e.target.value})} /></div>
                <div><label className="form-label">Isi Lengkap *</label><textarea required className="form-input" rows={8} value={formData.content||''} onChange={e => setFormData({...formData, content: e.target.value})} /></div>
                <div><label className="form-label">URL Gambar Sampul</label><input className="form-input" placeholder="https://..." value={formData.image_url||''} onChange={e => setFormData({...formData, image_url: e.target.value})} /></div>
              </>)}

              {/* TEACHERS FORM */}
              {formType === 'teachers' && (<>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Nama Lengkap *</label><input required className="form-input" value={formData.nama||''} onChange={e => setFormData({...formData, nama: e.target.value})} /></div>
                  <div><label className="form-label">NIP</label><input className="form-input" value={formData.nip||''} onChange={e => setFormData({...formData, nip: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Jabatan/Tugas</label><input className="form-input" placeholder="Waka Kurikulum / Guru Madya" value={formData.jabatan||''} onChange={e => setFormData({...formData, jabatan: e.target.value})} /></div>
                  <div><label className="form-label">Spesialisasi/Mapel</label><input className="form-input" value={formData.spesialisasi||''} onChange={e => setFormData({...formData, spesialisasi: e.target.value})} /></div>
                </div>
                <div><label className="form-label">URL Foto Guru</label><input className="form-input" placeholder="https://..." value={formData.photo_url||''} onChange={e => setFormData({...formData, photo_url: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Email</label><input className="form-input" type="email" value={formData.email||''} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                  <div><label className="form-label">WhatsApp</label><input className="form-input" value={formData.phone||''} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                </div>
              </>)}

              {/* OSIS FORM */}
              {formType === 'osis' && (<>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Nama Siswa *</label><input required className="form-input" value={formData.nama||''} onChange={e => setFormData({...formData, nama: e.target.value})} /></div>
                  <div><label className="form-label">Jabatan OSIS *</label><input required className="form-input" placeholder="Ketua / Wakil / Sekertaris" value={formData.jabatan||''} onChange={e => setFormData({...formData, jabatan: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Kelas</label><input className="form-input" value={formData.kelas||''} onChange={e => setFormData({...formData, kelas: e.target.value})} /></div>
                  <div><label className="form-label">Masa Jabatan</label><input className="form-input" value={formData.masa_jabatan||'2025/2026'} onChange={e => setFormData({...formData, masa_jabatan: e.target.value})} /></div>
                </div>
                <div><label className="form-label">URL Foto</label><input className="form-input" placeholder="https://..." value={formData.photo_url||''} onChange={e => setFormData({...formData, photo_url: e.target.value})} /></div>
              </>)}

              {/* ACTIVITIES FORM */}
              {formType === 'activities' && (<>
                <div><label className="form-label">Nama Kegiatan *</label><input required className="form-input" value={formData.title||''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Kategori</label><input className="form-input" value={formData.category||''} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
                  <div><label className="form-label">Waktu/Status</label><input className="form-input" placeholder="Setiap Sabtu / Terjadwal" value={formData.date||''} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                </div>
                <div><label className="form-label">URL Foto Utama</label><input className="form-input" placeholder="https://..." value={formData.image_url||''} onChange={e => setFormData({...formData, image_url: e.target.value})} /></div>
                <div><label className="form-label">Deskripsi Kegiatan</label><textarea className="form-input" rows={4} value={formData.description||''} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              </>)}

              {/* ACHIEVEMENTS FORM */}
              {formType === 'achievements' && (<>
                <div><label className="form-label">Judul Prestasi *</label><input required className="form-input" placeholder="Juara 1 Lomba Siswa Berprestasi" value={formData.title||''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Nama Peraih *</label><input required className="form-input" value={formData.recipient_name||''} onChange={e => setFormData({...formData, recipient_name: e.target.value})} /></div>
                  <div><label className="form-label">Tahun</label><input className="form-input" value={formData.year||''} onChange={e => setFormData({...formData, year: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Tingkat / Kategori</label><input className="form-input" placeholder="Kabupaten / Provinsi / Nasional" value={formData.category||''} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
                  <div><label className="form-label">URL Foto / Medali</label><input className="form-input" value={formData.image_url||''} onChange={e => setFormData({...formData, image_url: e.target.value})} /></div>
                </div>
                <div><label className="form-label">Detail Prestasi</label><textarea className="form-input" rows={4} value={formData.description||''} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              </>)}

              {/* GALLERY FORM */}
              {formType === 'gallery' && (<>
                <div><label className="form-label">URL Foto Galeri (Direct Link) *</label><input required className="form-input" placeholder="https://images.unsplash.com/..." value={formData.image_url||''} onChange={e => setFormData({...formData, image_url: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Keterangan Foto</label><input className="form-input" placeholder="Foto saat upacara" value={formData.title||''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                  <div><label className="form-label">Kategori Album</label><input className="form-input" placeholder="Sarana / Siswa / Prestasi" value={formData.category||'Umum'} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
                </div>
              </>)}

              {/* POLICY FORM */}
              {formType === 'policies' && (<>
                <div><label className="form-label">Judul Kebijakan *</label><input required className="form-input" value={formData.title||''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                <div><label className="form-label">Isi Kebijakan (Gunakan format baris baru) *</label><textarea required className="form-input" rows={15} value={formData.content||''} onChange={e => setFormData({...formData, content: e.target.value})} /></div>
              </>)}

              {/* JADWAL FORM (Already exists, but refined) */}
              {formType === 'jadwal' && (<>
                <div><label className="form-label">Nama Agenda / Jadwal *</label><input required className="form-input" value={formData.title||''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Hari / Tanggal</label><input className="form-input" value={formData.day||''} onChange={e => setFormData({...formData, day: e.target.value})} /></div>
                  <div><label className="form-label">Jenis</label>
                    <select className="form-input" value={formData.type||'daily'} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="daily">Harian</option><option value="weekly">Mingguan</option><option value="event">Event</option><option value="holiday">Libur</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="form-label">Waktu Mulai</label><input className="form-input" type="time" value={formData.startTime||formData.start_time||''} onChange={e => setFormData({...formData, start_time: e.target.value, startTime: e.target.value})} /></div>
                  <div><label className="form-label">Waktu Selesai</label><input className="form-input" type="time" value={formData.endTime||formData.end_time||''} onChange={e => setFormData({...formData, end_time: e.target.value, endTime: e.target.value})} /></div>
                </div>
              </>)}
            </form>

            <footer className="px-10 py-8 border-t border-slate-800 bg-slate-900/80 backdrop-blur-xl flex gap-4 shrink-0">
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-3xl transition-all shadow-xl shadow-amber-500/20 active:scale-95"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'Simpan Perubahan'}
              </button>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-3xl transition-all border border-slate-700"
              >
                Batal
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Styles for the forms and custom scrollbar */}
      <style>{`
        .form-label { display: block; font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; margin-left: 0.5rem; }
        .form-input { width: 100%; background-color: #020617; border: 1px solid #1e293b; border-radius: 1.5rem; padding: 1rem 1.5rem; color: #ffffff; outline: none; transition: all 0.3s; font-weight: 700; color-scheme: dark; }
        .form-input::placeholder { color: #334155; }
        .form-input:focus { border-color: #f59e0b; outline: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
