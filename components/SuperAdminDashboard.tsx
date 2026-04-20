import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, Loader2, LayoutDashboard, LogOut, FileText, 
  BarChart3, Calendar, Bell, Search, Settings, X, Check
} from 'lucide-react';
import { 
  fetchNews, deleteNews, insertNews, updateNews, logout,
  fetchSchedules, deleteSchedule, insertSchedule, updateSchedule,
  fetchAnnouncements, deleteAnnouncement, insertAnnouncement, updateAnnouncement
} from '../lib/actions';
import { NewsItem, SchoolSchedule, Announcement } from '../types.js';

interface SuperAdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'dashboard' | 'berita' | 'jadwal' | 'pengumuman' | 'settings';

interface FormData {
  title: string;
  content: string;
  description?: string;
  category: string;
  image_url: string;
  author_name: string;
  excerpt: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  type?: 'daily' | 'weekly' | 'event' | 'holiday';
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'archived';
}

const defaultFormData: FormData = {
  title: '',
  content: '',
  category: 'Umum',
  image_url: '',
  author_name: 'Admin',
  excerpt: '',
};

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [schedules, setSchedules] = useState<SchoolSchedule[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [formType, setFormType] = useState<'berita' | 'jadwal' | 'pengumuman'>('berita');

  // Load all data
  const loadAllData = async () => {
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
      console.error("Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formType === 'berita') {
        if (editingItem) {
          await updateNews(editingItem.id, formData);
        } else {
          await insertNews(formData as any);
        }
      } else if (formType === 'jadwal') {
        if (editingItem) {
          await updateSchedule(editingItem.id, formData);
        } else {
          await insertSchedule(formData as any);
        }
      } else if (formType === 'pengumuman') {
        if (editingItem) {
          await updateAnnouncement(editingItem.id, formData);
        } else {
          await insertAnnouncement(formData as any);
        }
      }
      
      setIsFormOpen(false);
      setEditingItem(null);
      setFormData(defaultFormData);
      await loadAllData();
    } catch (err) {
      console.error("Submit Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number, type: 'berita' | 'jadwal' | 'pengumuman') => {
    if (confirm('Hapus item ini secara permanen?')) {
      setLoading(true);
      try {
        if (type === 'berita') {
          await deleteNews(id);
        } else if (type === 'jadwal') {
          await deleteSchedule(id);
        } else if (type === 'pengumuman') {
          await deleteAnnouncement(id);
        }
        await loadAllData();
      } catch (err) {
        console.error("Delete Error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (item: any, type: 'berita' | 'jadwal' | 'pengumuman') => {
    setEditingItem(item);
    setFormType(type);
    setFormData({ ...defaultFormData, ...item });
    setIsFormOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const newCount = news.length;
  const scheduleCount = schedules.length;
  const announcementCount = announcements.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#C5A059]/10 to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#C5A059]/80 backdrop-blur-xl border-b border-[#C5A059]/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-[#C5A059] to-[#B39548] p-3 rounded-2xl shadow-lg">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Super Admin</h1>
              <p className="text-xs text-white/80 font-bold uppercase tracking-widest">SMAN 2 Tompaso - Full Control</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold transition-all active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-24 z-30 bg-[#C5A059]/20 border-b border-[#C5A059]/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: BarChart3 },
              { id: 'berita', label: '📰 Berita & Artikel', icon: FileText },
              { id: 'jadwal', label: '📅 Jadwal & Agenda', icon: Calendar },
              { id: 'pengumuman', label: '🔔 Pengumuman', icon: Bell },
              { id: 'settings', label: '⚙️ Pengaturan', icon: Settings },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-[#C5A059] bg-[#E8D5B7]'
                    : 'border-transparent text-black hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Berita', value: newCount, color: 'from-[#C5A059] to-[#B39548]', icon: FileText },
                { label: 'Jadwal', value: scheduleCount, color: 'from-[#D4AF37] to-[#C5A059]', icon: Calendar },
                { label: 'Pengumuman', value: announcementCount, color: 'from-[#E8D5B7] to-[#D4C1A3]', icon: Bell },
                { label: 'Status', value: 'Live', color: 'from-green-500 to-green-600', icon: Check },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} ${stat.label === 'Pengumuman' ? 'text-slate-900' : 'text-white'} p-8 rounded-2xl shadow-lg`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-4xl font-black mb-2">{stat.value}</p>
                        <p className="text-sm font-bold opacity-90">{stat.label}</p>
                      </div>
                      <Icon className="h-8 w-8 opacity-50" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#C5A059]/20 p-8 rounded-2xl shadow-sm border border-[#C5A059]/30">
                <h3 className="text-lg font-black mb-4 text-slate-900">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => { setFormType('berita'); setEditingItem(null); setFormData(defaultFormData); setIsFormOpen(true); }}
                    className="w-full px-6 py-4 bg-[#E8D5B7] hover:bg-[#D4C1A3] text-[#0F172A] font-bold rounded-xl transition-all flex items-center space-x-3"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Tambah Berita</span>
                  </button>
                  <button 
                    onClick={() => { setFormType('jadwal'); setEditingItem(null); setFormData(defaultFormData); setIsFormOpen(true); }}
                    className="w-full px-6 py-4 bg-[#E8D5B7] hover:bg-[#D4C1A3] text-[#0F172A] font-bold rounded-xl transition-all flex items-center space-x-3"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Tambah Jadwal</span>
                  </button>
                  <button 
                    onClick={() => { setFormType('pengumuman'); setEditingItem(null); setFormData(defaultFormData); setIsFormOpen(true); }}
                    className="w-full px-6 py-4 bg-[#E8D5B7] hover:bg-[#D4C1A3] text-[#0F172A] font-bold rounded-xl transition-all flex items-center space-x-3"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Tambah Pengumuman</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#C5A059]/20 p-8 rounded-2xl shadow-sm border border-[#C5A059]/30">
                <h3 className="text-lg font-black mb-4 text-slate-900">Informasi Sistem</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-bold text-green-600">🟢 Operational</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Database</span>
                    <span className="font-bold text-slate-900">LocalStorage</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Sync</span>
                    <span className="font-bold text-slate-900">Real-time</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version</span>
                    <span className="font-bold text-slate-900">CMS v2.1.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Berita Tab */}
        {activeTab === 'berita' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Kelola Berita & Artikel</h2>
              <button 
                onClick={() => { setFormType('berita'); setEditingItem(null); setFormData(defaultFormData); setIsFormOpen(true); }}
                className="px-8 py-4 bg-[#C5A059] hover:bg-[#B39548] text-white font-bold rounded-xl transition-all flex items-center space-x-2 active:scale-95"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah Berita</span>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input 
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl border border-[#C5A059]/30 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {news.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                  <div key={item.id} className="bg-[#C5A059]/20 p-6 rounded-xl border border-[#C5A059]/30 hover:shadow-lg transition-all">
                    <div className="flex gap-6">
                      <img 
                        src={item.image_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=400'} 
                        alt={item.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="inline-block px-3 py-1 bg-blue-100 text-[#0F172A] text-xs font-bold rounded-lg mb-2">
                              {item.category}
                            </span>
                            <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(item, 'berita')}
                              className="p-2 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-all"
                            >
                              <Edit3 className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id, 'berita')}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.excerpt || item.content.substring(0, 100)}</p>
                        <p className="text-xs text-gray-600">Penulis: {item.author_name} • {new Date(item.created_at || '').toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Jadwal Tab */}
        {activeTab === 'jadwal' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Kelola Jadwal & Agenda</h2>
              <button 
                onClick={() => { setFormType('jadwal'); setEditingItem(null); setFormData(defaultFormData); setIsFormOpen(true); }}
                className="px-8 py-4 bg-[#C5A059] hover:bg-[#B39548] text-white font-bold rounded-xl transition-all flex items-center space-x-2 active:scale-95"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah Jadwal</span>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {schedules.map(schedule => (
                  <div key={schedule.id} className="bg-[#C5A059]/20 p-6 rounded-xl border border-[#C5A059]/30 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">{schedule.title}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          {schedule.day && <p>📅 {schedule.day}</p>}
                          {schedule.startTime && <p>⏰ {schedule.startTime} - {schedule.endTime}</p>}
                          {schedule.description && <p>ℹ️ {schedule.description}</p>}
                          <p>Tipe: <span className="font-bold">{schedule.type}</span></p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(schedule, 'jadwal')}
                          className="p-2 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-all"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(schedule.id, 'jadwal')}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pengumuman Tab */}
        {activeTab === 'pengumuman' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Kelola Pengumuman</h2>
              <button 
                onClick={() => { setFormType('pengumuman'); setEditingItem(null); setFormData(defaultFormData); setIsFormOpen(true); }}
                className="px-8 py-4 bg-[#C5A059] hover:bg-[#B39548] text-white font-bold rounded-xl transition-all flex items-center space-x-2 active:scale-95"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah Pengumuman</span>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {announcements.map(announcement => (
                  <div key={announcement.id} className="bg-[#C5A059]/20 p-6 rounded-xl border border-[#C5A059]/30 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-black text-slate-900">{announcement.title}</h3>
                          <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                            announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {announcement.priority.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                            announcement.status === 'active' ? 'bg-blue-100 text-[#0F172A]' : 'bg-gray-100 text-black'
                          }`}>
                            {announcement.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                        <p className="text-xs text-gray-600">{new Date(announcement.published_date).toLocaleDateString('id-ID')}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(announcement, 'pengumuman')}
                          className="p-2 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-all"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(announcement.id, 'pengumuman')}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-[#C5A059]/20 p-8 rounded-2xl border border-[#C5A059]/30">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Pengaturan Sistem</h2>
            <div className="space-y-6">
              <div className="border-b border-[#C5A059]/30 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Informasi Sekolah</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Nama Sekolah</label>
                    <input type="text" defaultValue="SMAN 2 Tompaso" className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Email Admin</label>
                    <input type="email" defaultValue="admin@sman2tompaso.sch.id" className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Telepon</label>
                    <input type="tel" defaultValue="+62-431-" className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Alamat</label>
                    <input type="text" defaultValue="Tompaso, Minahasa Utara" className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]" />
                  </div>
                </div>
              </div>

              <div className="border-b border-[#C5A059]/30 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Keamanan</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Password Baru</label>
                    <input type="password" className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]" placeholder="Kosongkan jika tidak ingin mengubah" />
                  </div>
                  <div className="bg-[#E8D5B7] border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">💡 Gunakan password yang kuat dengan kombinasi huruf besar, kecil, angka, dan simbol.</p>
                  </div>
                </div>
              </div>

              <button className="w-full px-8 py-4 bg-[#C5A059] hover:bg-[#B39548] text-white font-bold rounded-xl transition-all">
                Simpan Pengaturan
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-[#C5A059]/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#C5A059]/20 border-b border-[#C5A059]/30 px-8 py-6 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">
                {editingItem ? 'Edit' : 'Tambah'} {
                  formType === 'berita' ? 'Berita' :
                  formType === 'jadwal' ? 'Jadwal' :
                  'Pengumuman'
                }
              </h2>
              <button onClick={() => { setIsFormOpen(false); setEditingItem(null); }} className="text-black hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Judul *</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              {formType === 'berita' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Kategori</label>
                      <select 
                        value={formData.category || 'Umum'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      >
                        <option>Umum</option>
                        <option>Prestasi</option>
                        <option> Kegiatan</option>
                        <option>Beasiswa</option>
                        <option>Pengumuman</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Penulis</label>
                      <input 
                        type="text"
                        value={formData.author_name || ''}
                        onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                        className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Ringkasan Singkat</label>
                    <textarea 
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">URL Gambar</label>
                    <input 
                      type="url"
                      value={formData.image_url || ''}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              {formType === 'jadwal' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Hari</label>
                      <input 
                        type="text"
                        value={formData.day || ''}
                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                        placeholder="Senin, Selasa, dll"
                        className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Tipe</label>
                      <select 
                        value={formData.type || 'daily'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      >
                        <option value="daily">Harian</option>
                        <option value="weekly">Mingguan</option>
                        <option value="event">Event</option>
                        <option value="holiday">Libur</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Jam Mulai</label>
                      <input 
                        type="time"
                        value={formData.startTime || ''}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Jam Selesai</label>
                      <input 
                        type="time"
                        value={formData.endTime || ''}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Deskripsi</label>
                    <textarea 
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>
                </>
              )}

              {formType === 'pengumuman' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Prioritas</label>
                      <select 
                        value={formData.priority || 'medium'}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      >
                        <option value="low">Rendah</option>
                        <option value="medium">Sedang</option>
                        <option value="high">Tinggi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Status</label>
                      <select 
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                      >
                        <option value="active">Aktif</option>
                        <option value="archived">Arsip</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Isi *</label>
                <textarea 
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-[#C5A059]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="flex-1 px-8 py-4 bg-[#C5A059] hover:bg-[#B39548] disabled:opacity-50 text-white font-bold rounded-xl transition-all">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Simpan'}
                </button>
                <button type="button" onClick={() => { setIsFormOpen(false); setEditingItem(null); }} className="flex-1 px-8 py-4 bg-gray-200 hover:bg-gray-300 text-slate-900 font-bold rounded-xl transition-all">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
