/**
 * SMAN 2 Tompaso — Frontend Actions (Standalone)
 * Menggunakan Supabase jika dikonfigurasi, atau LocalStorage sebagai fallback.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { NewsItem, Page, Announcement, Teacher, OSISMember, Activity, Achievement, GalleryImage, Policy, PPDBRegistration } from '../types';

// ===================== HELPERS =====================

const STORAGE_KEYS = {
  NEWS: 'sman2t_news',
  SCHEDULES: 'sman2t_schedules',
  ANNOUNCEMENTS: 'sman2t_announcements',
  TEACHERS: 'sman2t_teachers',
  OSIS: 'sman2t_osis',
  USERS: 'sman2t_users',
  AUTH: 'sman2t_auth_user',
  TOKEN: 'sman2t_jwt_token',
  KEGIATAN: 'sman2t_kegiatan',
  PRESTASI: 'sman2t_prestasi',
  GALERI: 'sman2t_galeri',
  KEBIJAKAN: 'sman2t_kebijakan',
  SETTINGS: 'sman2t_settings'
};

const getFromStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const sanitizeUrl = (url: string) => {
  if (!url) return '';
  return url.replace(/^["']|["']$/g, '').trim();
};

export const apiLogActivity = async (user: string, action: string, details: string) => {
  console.log(`📝 [LOG] ${user}: ${action} - ${details}`);
  
  if (isSupabaseConfigured()) {
    try {
      await supabase!.from('activity_logs').insert([{ user_id: user, action, details, created_at: new Date().toISOString() }]);
    } catch (e) {
      console.warn('Failed to log activity to Supabase:', e);
    }
  }

  try {
    const logs = JSON.parse(localStorage.getItem('sman2t_activity_logs') || '[]');
    logs.unshift({
      timestamp: new Date().toISOString(),
      user,
      action,
      details
    });
    localStorage.setItem('sman2t_activity_logs', JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    // Fail silently for localStorage
  }
  
  return { success: true };
};


// ===================== AUTH =====================

/**
 * Mendapatkan user yang sedang login dari session Supabase
 */
export const getSavedUser = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      const { data: { user } } = await supabase!.auth.getUser();
      const currentUser = user || session?.user;

      if (currentUser) {
        return {
          id: currentUser.id,
          username: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || currentUser.email,
          role: 'admin'
        };
      }
    } catch (e) {
      console.error('Error fetching session:', e);
    }
  }
  const data = localStorage.getItem(STORAGE_KEYS.AUTH);
  return data ? JSON.parse(data) : null;
};

export const clearToken = async () => {
  if (isSupabaseConfigured()) {
    await supabase!.auth.signOut();
  }
  localStorage.removeItem(STORAGE_KEYS.AUTH);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

export const getCurrentUser = getSavedUser;

export const getCurrentTeacher = getCurrentUser;

export const login = async (email: string, password: string) => {
  console.log('🔐 Mencoba login untuk:', email);
  
  if (isSupabaseConfigured()) {
    console.log('📡 Menggunakan Supabase Auth...');
    try {
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Supabase Auth Error:', error.message, error);
        if (error.message.includes('Email not confirmed')) {
          return { data: null, error: { message: 'Email belum dikonfirmasi. Pastikan opsi "Confirm email" di Dashboard Supabase sudah dimatikan.' } };
        }
        // Pastikan error message asli diteruskan ke UI
        return { data: null, error: { message: error.message } };
      }

      console.log('✅ Login Supabase Berhasil:', data.user?.email);

      const user = { 
        id: data.user?.id, 
        username: email, 
        full_name: data.user?.user_metadata?.full_name || email, 
        role: 'admin' 
      };
      
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
      return { data: { user }, error: null };
    } catch (err: any) {
      console.error('💥 Critical Error in login action:', err);
      return { data: null, error: { message: err.message || 'Terjadi kesalahan sistem.' } };
    }
  }

  console.warn('⚠️ Supabase tidak terdeteksi. Menggunakan Mode Fallback (LocalStorage).');

  // Fallback demo auth - Update agar menerima format .sch.id
  if ((email === 'admin@sman2t' && password === 'AdmSMAN2T@2026') || 
      (email === 'admin@sman2t.sch.id' && password === 'AdmSMAN2T@2026')) {
    const user = { id: Date.now(), username: email, full_name: 'Administrator (Demo)', role: 'admin' };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    return { data: { user }, error: null };
  }
  return { data: { user: null }, error: { message: 'Akun tidak ditemukan di database lokal. Gunakan admin@sman2t.sch.id / AdmSMAN2T@2026' } };
};

export const teacherLogin = login;

export const logout = async () => {
  if (isSupabaseConfigured()) {
    await supabase!.auth.signOut();
  }
  localStorage.removeItem(STORAGE_KEYS.AUTH);
  return { error: null };
};

export const teacherLogout = logout;

// ===================== BERITA =====================

/**
 * Format timestamp ke string tanggal yang cantik
 */
const formatDate = (isoString?: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const fetchNews = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!
        .from('berita')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Map created_at ke date untuk UI
      const mappedData = (data || []).map(item => ({
        ...item,
        date: item.date || formatDate(item.created_at)
      }));

      return { data: mappedData, error: null };
    } catch (err: any) {
      console.error('❌ Error fetching news:', err);
      return { data: [], error: err };
    }
  }
  return { data: getFromStorage(STORAGE_KEYS.NEWS), error: null };
};

export const insertNews = async (news: any) => {
  const newItem = { ...news };
  if (newItem.image_url) newItem.image_url = sanitizeUrl(newItem.image_url);
  
  // Backup date field and remove from Supabase payload to avoid "column not found" error
  const customDate = newItem.date;
  
  if (!isSupabaseConfigured()) {
    newItem.id = Date.now().toString();
    newItem.created_at = new Date().toISOString();
    newItem.date = customDate || formatDate(newItem.created_at);
    
    const items = getFromStorage(STORAGE_KEYS.NEWS);
    items.unshift(newItem);
    saveToStorage(STORAGE_KEYS.NEWS, items);
    return { data: [newItem], error: null };
  }

  try {
    // If user provided a date, try to set created_at to it (ISO format)
    const supabasePayload = { ...newItem };
    delete supabasePayload.date; // Critical: avoid schema error
    
    if (customDate) {
      try {
        const d = new Date(customDate);
        if (!isNaN(d.getTime())) {
          supabasePayload.created_at = d.toISOString();
        }
      } catch (e) {}
    }

    const { data, error } = await supabase!.from('berita').insert([supabasePayload]).select();
    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.error('❌ Error inserting news:', err);
    return { data: null, error: err };
  }
};

export const updateNews = async (id: string | number, news: any) => {
  const updatedItem = { ...news };
  if (updatedItem.image_url) updatedItem.image_url = sanitizeUrl(updatedItem.image_url);
  
  if (isSupabaseConfigured()) {
    const supabasePayload = { ...updatedItem };
    const customDate = supabasePayload.date;
    delete supabasePayload.date;
    delete supabasePayload.id;
    delete supabasePayload.created_at;

    if (customDate) {
      try {
        const d = new Date(customDate);
        if (!isNaN(d.getTime())) {
          supabasePayload.created_at = d.toISOString();
        }
      } catch (e) {}
    }

    const { data, error } = await supabase!.from('berita').update(supabasePayload).eq('id', id).select();
    return { data, error };
  }

  const items = getFromStorage(STORAGE_KEYS.NEWS);
  const index = items.findIndex((item: any) => item.id === id.toString());
  if (index >= 0) {
    items[index] = { ...items[index], ...updatedItem, updated_at: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.NEWS, items);
    return { data: [items[index]], error: null };
  }
  return { data: [], error: { message: 'Item tidak ditemukan' } };
};

export const deleteNews = async (id: string | number) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase!.from('berita').delete().eq('id', id);
    return { error };
  }

  const items = getFromStorage(STORAGE_KEYS.NEWS);
  const filtered = items.filter((item: any) => item.id !== id.toString());
  saveToStorage(STORAGE_KEYS.NEWS, filtered);
  return { error: null };
};

// ===================== JADWAL =====================

export const fetchSchedules = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!
        .from('jadwal')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Map fields if necessary
      const mappedData = (data || []).map(item => ({
        ...item,
        date: item.date || formatDate(item.created_at)
      }));

      return { data: mappedData, error: null };
    } catch (err: any) {
      console.error('❌ Error fetching schedules:', err);
      return { data: [], error: err };
    }
  }
  return { data: getFromStorage(STORAGE_KEYS.SCHEDULES), error: null };
};

// Helper: normalize jadwal fields to match Supabase schema
const normalizeJadwal = (raw: any) => {
  const clean: any = {};
  // Allowed columns in 'jadwal' table
  const allowed = ['title', 'day', 'type', 'start_time', 'end_time', 'description', 'location'];

  // Map camelCase / legacy fields to snake_case
  if (raw.title)       clean.title       = raw.title;
  if (raw.day)         clean.day         = raw.day;
  if (raw.type)        clean.type        = raw.type        || 'daily';
  if (raw.description) clean.description = raw.description;
  if (raw.location)    clean.location    = raw.location;

  // start_time: accept multiple field names
  const startTime = raw.start_time || raw.startTime || raw.waktu_mulai || raw.jam_mulai;
  if (startTime) clean.start_time = startTime;

  // end_time: accept multiple field names
  const endTime = raw.end_time || raw.endTime || raw.waktu_selesai || raw.jam_selesai;
  if (endTime) clean.end_time = endTime;

  return clean;
};

export const insertSchedule = async (schedule: any) => {
  if (!isSupabaseConfigured()) {
    const newItem = {
      ...schedule,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    const items = getFromStorage(STORAGE_KEYS.SCHEDULES);
    items.push(newItem);
    saveToStorage(STORAGE_KEYS.SCHEDULES, items);
    return { data: [newItem], error: null };
  }

  try {
    const cleanItem = normalizeJadwal(schedule);
    const { data, error } = await supabase!.from('jadwal').insert([cleanItem]).select();
    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.error('❌ Error inserting schedule:', err);
    return { data: null, error: err };
  }
};

export const updateSchedule = async (id: string | number, schedule: any) => {
  if (isSupabaseConfigured()) {
    const cleanItem = normalizeJadwal(schedule);
    return await supabase!.from('jadwal').update(cleanItem).eq('id', id).select();
  }
  const items = getFromStorage(STORAGE_KEYS.SCHEDULES);
  const index = items.findIndex((item: any) => item.id === id.toString());
  if (index >= 0) {
    items[index] = { ...items[index], ...schedule };
    saveToStorage(STORAGE_KEYS.SCHEDULES, items);
    return { data: [items[index]], error: null };
  }
  return { error: { message: 'Not found' } };
};

export const deleteSchedule = async (id: string | number) => {
  if (isSupabaseConfigured()) {
    return await supabase!.from('jadwal').delete().eq('id', id);
  }
  const items = getFromStorage(STORAGE_KEYS.SCHEDULES);
  saveToStorage(STORAGE_KEYS.SCHEDULES, items.filter((i: any) => i.id !== id.toString()));
  return { error: null };
};

// ===================== PENGUMUMAN =====================

export const fetchAnnouncements = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!
        .from('pengumuman')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      const mappedData = (data || []).map(item => ({
        ...item,
        date: item.published_date || formatDate(item.created_at)
      }));

      return { data: mappedData, error: null };
    } catch (err: any) {
      console.error('❌ Error fetching announcements:', err);
      return { data: [], error: err };
    }
  }
  return { data: getFromStorage(STORAGE_KEYS.ANNOUNCEMENTS), error: null };
};

export const insertAnnouncement = async (ann: any) => {
  const newItem = { ...ann };
  const customDate = newItem.date;
  
  if (!isSupabaseConfigured()) {
    newItem.id = Date.now().toString();
    newItem.created_at = new Date().toISOString();
    newItem.date = customDate || formatDate(newItem.created_at);
    const items = getFromStorage(STORAGE_KEYS.ANNOUNCEMENTS);
    items.push(newItem);
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, items);
    return { data: [newItem], error: null };
  }

  try {
    const supabasePayload = { ...newItem };
    delete supabasePayload.date;
    
    if (customDate) {
      try {
        const d = new Date(customDate);
        if (!isNaN(d.getTime())) supabasePayload.created_at = d.toISOString();
      } catch (e) {}
    }

    const { data, error } = await supabase!.from('pengumuman').insert([supabasePayload]).select();
    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.error('❌ Error inserting announcement:', err);
    return { data: null, error: err };
  }
};

export const updateAnnouncement = async (id: any, ann: any) => {
  const updatedItem = { ...ann };
  
  if (isSupabaseConfigured()) {
    const supabasePayload = { ...updatedItem };
    const customDate = supabasePayload.date;
    delete supabasePayload.date;
    delete supabasePayload.id;
    delete supabasePayload.created_at;

    if (customDate) {
      try {
        const d = new Date(customDate);
        if (!isNaN(d.getTime())) supabasePayload.created_at = d.toISOString();
      } catch (e) {}
    }

    return await supabase!.from('pengumuman').update(supabasePayload).eq('id', id).select();
  }
  
  const items = getFromStorage(STORAGE_KEYS.ANNOUNCEMENTS);
  const idx = items.findIndex((i: any) => i.id === id.toString());
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updatedItem };
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, items);
    return { data: [items[idx]], error: null };
  }
  return { error: { message: 'Not found' } };
};

export const deleteAnnouncement = async (id: any) => {
  if (isSupabaseConfigured()) return await supabase!.from('pengumuman').delete().eq('id', id);
  const items = getFromStorage(STORAGE_KEYS.ANNOUNCEMENTS);
  saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, items.filter((i: any) => i.id !== id.toString()));
  return { error: null };
};

// ===================== GURU =====================

export const fetchTeachers = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!.from('teachers').select('*').order('nama');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      console.error('❌ Error fetching teachers:', err);
      return { data: [], error: err };
    }
  }
  return { data: getFromStorage(STORAGE_KEYS.TEACHERS), error: null };
};

export const insertTeacher = async (teacher: any) => {
  const newItem = { ...teacher };
  if (newItem.photo_url) newItem.photo_url = sanitizeUrl(newItem.photo_url);
  
  if (isSupabaseConfigured()) return await supabase!.from('teachers').insert([newItem]).select();
  const items = getFromStorage(STORAGE_KEYS.TEACHERS);
  newItem.id = Date.now().toString();
  items.push(newItem);
  saveToStorage(STORAGE_KEYS.TEACHERS, items);
  return { data: [newItem], error: null };
};

export const updateTeacher = async (id: any, teacher: any) => {
  const updatedItem = { ...teacher };
  if (updatedItem.photo_url) updatedItem.photo_url = sanitizeUrl(updatedItem.photo_url);
  
  if (isSupabaseConfigured()) {
    const supabasePayload = { ...updatedItem };
    delete supabasePayload.id;
    return await supabase!.from('teachers').update(supabasePayload).eq('id', id).select();
  }
  const items = getFromStorage(STORAGE_KEYS.TEACHERS);
  const idx = items.findIndex((i: any) => i.id === id.toString());
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updatedItem };
    saveToStorage(STORAGE_KEYS.TEACHERS, items);
    return { data: [items[idx]], error: null };
  }
  return { error: { message: 'Not found' } };
};

export const deleteTeacher = async (id: any) => {
  if (isSupabaseConfigured()) return await supabase!.from('teachers').delete().eq('id', id);
  const items = getFromStorage(STORAGE_KEYS.TEACHERS);
  saveToStorage(STORAGE_KEYS.TEACHERS, items.filter((i: any) => i.id !== id.toString()));
  return { error: null };
};

// ===================== OSIS =====================

export const fetchOSIS = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!.from('osis_members').select('*').order('nama');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      console.error('❌ Error fetching OSIS:', err);
      return { data: [], error: err };
    }
  }
  return { data: getFromStorage(STORAGE_KEYS.OSIS), error: null };
};

export const insertOSIS = async (member: any) => {
  const newItem = { ...member };
  if (newItem.photo_url) newItem.photo_url = sanitizeUrl(newItem.photo_url);
  
  if (isSupabaseConfigured()) return await supabase!.from('osis_members').insert([newItem]).select();
  const items = getFromStorage(STORAGE_KEYS.OSIS);
  newItem.id = Date.now().toString();
  items.push(newItem);
  saveToStorage(STORAGE_KEYS.OSIS, items);
  return { data: [newItem], error: null };
};

export const updateOSIS = async (id: any, member: any) => {
  const updatedItem = { ...member };
  if (updatedItem.photo_url) updatedItem.photo_url = sanitizeUrl(updatedItem.photo_url);
  
  if (isSupabaseConfigured()) {
    const supabasePayload = { ...updatedItem };
    delete supabasePayload.id;
    return await supabase!.from('osis_members').update(supabasePayload).eq('id', id).select();
  }
  const items = getFromStorage(STORAGE_KEYS.OSIS);
  const idx = items.findIndex((i: any) => i.id === id.toString());
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updatedItem };
    saveToStorage(STORAGE_KEYS.OSIS, items);
    return { data: [items[idx]], error: null };
  }
  return { error: { message: 'Not found' } };
};

export const deleteOSIS = async (id: any) => {
  if (isSupabaseConfigured()) return await supabase!.from('osis_members').delete().eq('id', id);
  const items = getFromStorage(STORAGE_KEYS.OSIS);
  saveToStorage(STORAGE_KEYS.OSIS, items.filter((i: any) => i.id !== id.toString()));
  return { error: null };
};

// ===================== KEGIATAN =====================

export const fetchActivities = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!.from('kegiatan').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      console.error('❌ Error fetching activities:', err);
      return { data: [], error: err };
    }
  }
  return { data: getFromStorage(STORAGE_KEYS.KEGIATAN), error: null };
};

export const insertActivity = async (activity: any) => {
  const newItem = { ...activity };
  if (newItem.image_url) newItem.image_url = sanitizeUrl(newItem.image_url);
  
  if (!isSupabaseConfigured()) {
    newItem.id = Date.now().toString();
    newItem.created_at = new Date().toISOString();
    const items = getFromStorage(STORAGE_KEYS.KEGIATAN);
    items.unshift(newItem);
    saveToStorage(STORAGE_KEYS.KEGIATAN, items);
    return { data: [newItem], error: null };
  }

  try {
    const { data, error } = await supabase!.from('kegiatan').insert([newItem]).select();
    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
};

export const updateActivity = async (id: any, activity: any) => {
  const updatedItem = { ...activity };
  if (updatedItem.image_url) updatedItem.image_url = sanitizeUrl(updatedItem.image_url);
  
  if (isSupabaseConfigured()) {
    const supabasePayload = { ...updatedItem };
    delete supabasePayload.id;
    return await supabase!.from('kegiatan').update(supabasePayload).eq('id', id).select();
  }
  const items = getFromStorage(STORAGE_KEYS.KEGIATAN);
  const idx = items.findIndex((i: any) => i.id === id.toString());
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updatedItem };
    saveToStorage(STORAGE_KEYS.KEGIATAN, items);
    return { data: [items[idx]], error: null };
  }
  return { error: { message: 'Not found' } };
};

export const deleteActivity = async (id: any) => {
  if (isSupabaseConfigured()) return await supabase!.from('kegiatan').delete().eq('id', id);
  const items = getFromStorage(STORAGE_KEYS.KEGIATAN);
  saveToStorage(STORAGE_KEYS.KEGIATAN, items.filter((i: any) => i.id !== id.toString()));
  return { error: null };
};

// ===================== PRESTASI =====================

export const fetchAchievements = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!.from('prestasi').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      console.error('❌ Error fetching achievements:', err);
      return { data: [], error: err };
    }
  }
  return { data: getFromStorage(STORAGE_KEYS.PRESTASI), error: null };
};

export const insertAchievement = async (achievement: any) => {
  const newItem = { ...achievement };
  if (!isSupabaseConfigured()) {
    newItem.id = Date.now().toString();
    newItem.created_at = new Date().toISOString();
    const items = getFromStorage(STORAGE_KEYS.PRESTASI);
    items.unshift(newItem);
    saveToStorage(STORAGE_KEYS.PRESTASI, items);
    return { data: [newItem], error: null };
  }
  try {
    const { data, error } = await supabase!.from('prestasi').insert([newItem]).select();
    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
};

export const updateAchievement = async (id: any, achievement: any) => {
  if (isSupabaseConfigured()) return await supabase!.from('prestasi').update(achievement).eq('id', id).select();
  const items = getFromStorage(STORAGE_KEYS.PRESTASI);
  const idx = items.findIndex((i: any) => i.id === id.toString());
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...achievement };
    saveToStorage(STORAGE_KEYS.PRESTASI, items);
    return { data: [items[idx]], error: null };
  }
  return { error: { message: 'Not found' } };
};

export const deleteAchievement = async (id: any) => {
  if (isSupabaseConfigured()) return await supabase!.from('prestasi').delete().eq('id', id);
  const items = getFromStorage(STORAGE_KEYS.PRESTASI);
  saveToStorage(STORAGE_KEYS.PRESTASI, items.filter((i: any) => i.id !== id.toString()));
  return { error: null };
};

// ===================== GALERI =====================

export const fetchGallery = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!.from('galeri').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      console.error('❌ Error fetching gallery:', err);
      return { data: [], error: err };
    }
  }
  return { data: getFromStorage(STORAGE_KEYS.GALERI), error: null };
};

export const insertGallery = async (gallery: any) => {
  const newItem = { ...gallery };
  if (newItem.image_url) newItem.image_url = sanitizeUrl(newItem.image_url);
  
  if (!isSupabaseConfigured()) {
    newItem.id = Date.now().toString();
    newItem.created_at = new Date().toISOString();
    const items = getFromStorage(STORAGE_KEYS.GALERI);
    items.unshift(newItem);
    saveToStorage(STORAGE_KEYS.GALERI, items);
    return { data: [newItem], error: null };
  }
  try {
    const { data, error } = await supabase!.from('galeri').insert([newItem]).select();
    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
};
export const updateGallery = async (id: any, gallery: any) => {
  const updatedItem = { ...gallery };
  if (updatedItem.image_url) updatedItem.image_url = sanitizeUrl(updatedItem.image_url);
  
  if (isSupabaseConfigured()) {
    const supabasePayload = { ...updatedItem };
    delete supabasePayload.id;
    return await supabase!.from('galeri').update(supabasePayload).eq('id', id).select();
  }
  const items = getFromStorage(STORAGE_KEYS.GALERI);
  const idx = items.findIndex((i: any) => i.id === id.toString());
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updatedItem };
    saveToStorage(STORAGE_KEYS.GALERI, items);
    return { data: [items[idx]], error: null };
  }
  return { error: { message: 'Not found' } };
};


export const deleteGallery = async (id: any) => {
  if (isSupabaseConfigured()) return await supabase!.from('galeri').delete().eq('id', id);
  const items = getFromStorage(STORAGE_KEYS.GALERI);
  saveToStorage(STORAGE_KEYS.GALERI, items.filter((i: any) => i.id !== id.toString()));
  return { error: null };
};

// ===================== KEBIJAKAN =====================

export const fetchPolicies = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!.from('kebijakan').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      console.error('❌ Error fetching policies:', err);
      return { data: [], error: err };
    }
  }
  return { data: getFromStorage(STORAGE_KEYS.KEBIJAKAN), error: null };
};

export const updatePolicy = async (id: any, policy: any) => {
  const updatedPolicy = { ...policy, updated_at: new Date().toISOString() };
  if (isSupabaseConfigured()) return await supabase!.from('kebijakan').update(updatedPolicy).eq('id', id).select();
  const items = getFromStorage(STORAGE_KEYS.KEBIJAKAN);
  const idx = items.findIndex((i: any) => i.id === id.toString());
  if (idx >= 0) {
    items[idx] = updatedPolicy;
    saveToStorage(STORAGE_KEYS.KEBIJAKAN, items);
    return { data: [items[idx]], error: null };
  }
  return { error: { message: 'Not found' } };
};

// ===================== PPDB =====================

export const apiPPDBRegister = async (data: any) => {
  // 1. Server-side Validation Layer (Extra Security)
  if (!data.nisn || !/^[0-9]{10}$/.test(data.nisn)) {
    return { success: false, error: { message: 'NISN tidak valid. Harus 10 digit angka.' } };
  }
  if (!data.nama_lengkap || data.nama_lengkap.length < 3 || !/^[a-zA-Z\s,.'-]+$/.test(data.nama_lengkap)) {
    return { success: false, error: { message: 'Nama lengkap mengandung karakter yang tidak diizinkan atau terlalu pendek.' } };
  }

  if (isSupabaseConfigured()) {
    try {
      // 2. Pre-check for duplicate NISN (UX improvement)
      const { data: existing } = await supabase!.from('ppdb').select('id, nama_lengkap').eq('nisn', data.nisn).maybeSingle();
      if (existing) {
        return { 
          success: false, 
          error: { 
            message: `Siswa dengan NISN ${data.nisn} (${existing.nama_lengkap}) sudah terdaftar di sistem. Jika ini adalah kesalahan, silakan hubungi admin sekolah.` 
          } 
        };
      }

      const regData = { 
        ...data, 
        status_pendaftaran: 'menunggu'
      };
      
      const { error } = await supabase!.from('ppdb').insert([regData]);
      
      if (error) {
        // Postgres code for Unique Violation
        if (error.code === '23505') { 
          return { success: false, error: { message: `Gagal mendaftar: NISN ${data.nisn} sudah terdaftar dalam sistem.` } };
        }
        // Check constraint violations (requires running the ADD_PPDB_CONSTRAINTS.sql)
        if (error.code === '23514') {
          return { success: false, error: { message: 'Data tidak sesuai dengan kriteria keamanan (Format NISN atau Nomor WA salah).' } };
        }
        throw error;
      }
      return { success: true, data: { ...regData, id: 'processing' }, error: null };
    } catch (err: any) {
      console.error('❌ Error PPDB Register:', err);
      const message = err?.message || 'Terjadi kesalahan sistem saat memproses pendaftaran.';
      return { success: false, data: null, error: { message } };
    }
  }
  // LocalStorage fallback check for duplicates
  const items = getFromStorage('sman2t_ppdb');
  if (items.some((i: any) => i.nisn === data.nisn)) {
    return { success: false, error: { message: 'NISN ini sudah terdaftar di database lokal.' } };
  }
  
  const reg = { ...data, id: Date.now().toString(), status_pendaftaran: 'menunggu', nomor_pendaftaran: `REG-${Date.now()}` };
  items.push(reg);
  saveToStorage('sman2t_ppdb', items);
  return { success: true, data: reg, error: null };
};

export const apiPPDBGetStatus = async (nomor: string) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!.from('ppdb').select('*').or(`nisn.eq.${nomor},nomor_pendaftaran.eq.${nomor}`).maybeSingle();
      if (error) throw error;
      return { success: !!data, data };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  const items = getFromStorage('sman2t_ppdb');
  const reg = items.find((i: any) => i.nomor_pendaftaran === nomor || i.nisn === nomor);
  return { success: !!reg, data: reg };
};

export const apiPPDBGetAll = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!.from('ppdb').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      return { data: [], error: err };
    }
  }
  return { data: getFromStorage('sman2t_ppdb') };
};

export const apiPPDBUpdateStatus = async (id: any, status: string) => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!.from('ppdb').update({ status_pendaftaran: status }).eq('id', id).select();
    return { success: !error, data, error };
  }
  const items = getFromStorage('sman2t_ppdb');
  const idx = items.findIndex((i: any) => i.id === id.toString());
  if (idx >= 0) {
    items[idx].status_pendaftaran = status;
    saveToStorage('sman2t_ppdb', items);
    return { success: true, data: [items[idx]], error: null };
  }
  return { success: false, error: { message: 'Not found' } };
};

export const apiPPDBDelete = async (id: any) => {
  if (isSupabaseConfigured()) return await supabase!.from('ppdb').delete().eq('id', id);
  const items = getFromStorage('sman2t_ppdb');
  saveToStorage('sman2t_ppdb', items.filter((i: any) => i.id !== id.toString()));
  return { success: true };
};

export const fetchPPDBSettings = async () => {
  if (isSupabaseConfigured()) {
    const { data } = await supabase!.from('settings').select('*').eq('key', 'is_ppdb_open').maybeSingle();
    return { data: data ? { is_ppdb_open: data.value === 'true' } : { is_ppdb_open: true } };
  }
  const settings = getFromStorage(STORAGE_KEYS.SETTINGS);
  return { data: (settings as any).is_ppdb_open !== undefined ? settings : { is_ppdb_open: true } };
};

export const updatePPDBSettings = async (isOpen: boolean) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase!.from('settings').upsert({ key: 'is_ppdb_open', value: isOpen.toString() }, { onConflict: 'key' }).select();
    return { success: !error };
  }
  const settings = { is_ppdb_open: isOpen };
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  return { success: true };
};

// ===================== OTHERS =====================



/**
 * Generic Realtime Subscription Helper
 */
const subscribeToTable = (table: string, callback: () => void) => {
  if (!isSupabaseConfigured()) return null;
  const channel = supabase!
    .channel(`${table}-changes`)
    .on(
      'postgres_changes', 
      { event: '*', schema: 'public', table }, 
      () => callback()
    )
    .subscribe();
  
  return () => {
    supabase!.removeChannel(channel);
  };
};

export const fetchNewsRealtime = (callback: (news: NewsItem[]) => void) => {
  const load = async () => {
    const { data } = await fetchNews();
    callback(data as any);
  };

  load();

  if (isSupabaseConfigured()) {
    return subscribeToTable('berita', load);
  } else {
    const interval = setInterval(load, 10000); 
    return () => clearInterval(interval);
  }
};

export const fetchSchedulesRealtime = (callback: (data: any[]) => void) => {
  const load = async () => {
    const { data } = await fetchSchedules();
    callback(data || []);
  };
  load();
  if (isSupabaseConfigured()) return subscribeToTable('jadwal', load);
  const interval = setInterval(load, 10000);
  return () => clearInterval(interval);
};

export const fetchAnnouncementsRealtime = (callback: (data: any[]) => void) => {
  const load = async () => {
    const { data } = await fetchAnnouncements();
    callback(data || []);
  };
  load();
  if (isSupabaseConfigured()) return subscribeToTable('pengumuman', load);
  const interval = setInterval(load, 10000);
  return () => clearInterval(interval);
};

export const fetchPPDBRealtime = (callback: (data: any[]) => void) => {
  const load = async () => {
    const { data } = await apiPPDBGetAll();
    callback(data || []);
  };
  load();
  if (isSupabaseConfigured()) return subscribeToTable('ppdb', load);
  const interval = setInterval(load, 10000);
  return () => clearInterval(interval);
};

export const fetchOSISRealtime = (callback: (data: any[]) => void) => {
  const load = async () => {
    const { data } = await fetchOSIS();
    callback(data || []);
  };
  load();
  if (isSupabaseConfigured()) return subscribeToTable('osis_members', load);
  const interval = setInterval(load, 10000);
  return () => clearInterval(interval);
};

export const fetchTeachersRealtime = (callback: (data: any[]) => void) => {
  const load = async () => {
    const { data } = await fetchTeachers();
    callback(data || []);
  };
  load();
  if (isSupabaseConfigured()) return subscribeToTable('teachers', load);
  const interval = setInterval(load, 10000);
  return () => clearInterval(interval);
};

export const fetchActivitiesRealtime = (callback: (data: any[]) => void) => {
  const load = async () => {
    const { data } = await fetchActivities();
    callback(data || []);
  };
  load();
  if (isSupabaseConfigured()) return subscribeToTable('kegiatan', load);
  const interval = setInterval(load, 10000);
  return () => clearInterval(interval);
};

export const fetchAchievementsRealtime = (callback: (data: any[]) => void) => {
  const load = async () => {
    const { data } = await fetchAchievements();
    callback(data || []);
  };
  load();
  if (isSupabaseConfigured()) return subscribeToTable('prestasi', load);
  const interval = setInterval(load, 10000);
  return () => clearInterval(interval);
};

export const fetchGalleryRealtime = (callback: (data: any[]) => void) => {
  const load = async () => {
    const { data } = await fetchGallery();
    callback(data || []);
  };
  load();
  if (isSupabaseConfigured()) return subscribeToTable('galeri', load);
  const interval = setInterval(load, 10000);
  return () => clearInterval(interval);
};

export const apiSyncInitialContent = async () => {
  if (!isSupabaseConfigured()) return { error: 'Supabase tidak terkonfigurasi' };

  try {
    const payload = {
      teachers: [
        { nama: "Junus N. M. Akay, S.Pd, M.Si", jabatan: "Kepala Sekolah", spesialisasi: "Manajemen Pendidikan", photo_url: "/kepsek.jpeg", status: "aktif" },
        { nama: "Nofie Kalengkongan, S.Pd", jabatan: "Guru", spesialisasi: "PJOK", photo_url: "/mner-nofi.jpeg", status: "aktif" },
        { nama: "Eireine E. Mukuan, S.Pd", jabatan: "Guru", spesialisasi: "Bahasa Inggris", photo_url: "/nci-iren.jpeg", status: "aktif" },
        { nama: "Rike Tulenan, S.Pd", jabatan: "Guru", spesialisasi: "Biologi", photo_url: "/nci-rike.jpeg", status: "aktif" },
        { nama: "Diane E. Langi, S.Pd", jabatan: "Guru", spesialisasi: "Fisika", photo_url: "https://i.ibb.co.com/j9PBgXw8/Whats-App-Image-2026-02-12-at-11-36-19.jpg", status: "aktif" },
        { nama: "Amelia C. Umboh, S.Pd", jabatan: "Guru", spesialisasi: "Bahasa Indonesia", photo_url: "/nci-amel.jpeg", status: "aktif" },
        { nama: "Djenly Pajow, S.Pd", jabatan: "Guru", spesialisasi: "Sejarah", photo_url: "", status: "aktif" },
        { nama: "David L. Paembonan, S.Pd. Gr", jabatan: "Guru", spesialisasi: "Matematika", photo_url: "https://i.ibb.co.com/Vp0FjG1g/Whats-App-Image-2026-02-12-at-08-49-57.jpg", status: "aktif" },
        { nama: "Eva I. Sepang, S.Pd", jabatan: "Guru", spesialisasi: "Bahasa Jerman", photo_url: "", status: "aktif" },
        { nama: "Junita Takalamingang, S.Pd", jabatan: "Guru", spesialisasi: "Kimia", photo_url: "/nci-jun.jpeg", status: "aktif" },
        { nama: "Rosni Lumentah, M.Pd", jabatan: "Guru", spesialisasi: "Informatika", photo_url: "", status: "aktif" },
        { nama: "Natalia Mareska Siri, S.Pd.K", jabatan: "Guru", spesialisasi: "Agama", photo_url: "/nci-natal.jpeg", status: "aktif" },
        { nama: "Merina M. Sumerah, S.Pd", jabatan: "Guru", spesialisasi: "Kimia", photo_url: "", status: "aktif" },
        { nama: "Maria Y. Keles, S.Pd", jabatan: "Guru", spesialisasi: "Ekonomi", photo_url: "/nci-yola.jpeg", status: "aktif" },
        { nama: "Elsa Palar, S.Pd", jabatan: "Guru", spesialisasi: "PPKN", photo_url: "/nci-elsa.jpeg", status: "aktif" },
        { nama: "Ruly L. Kaparang, S.Pd", jabatan: "Guru", spesialisasi: "Geografi", photo_url: "", status: "aktif" },
        { nama: "Friskila R. M. Kolibu, S.Pd", jabatan: "Guru", spesialisasi: "Biologi", photo_url: "", status: "aktif" },
        { nama: "Silveria Jessica Umboh, S.Pd", jabatan: "Guru", spesialisasi: "Sosiologi", photo_url: "/nci-jess.jpeg", status: "aktif" },
        { nama: "Victory M. Roring, S.Kom", jabatan: "Staf", spesialisasi: "TU / TIK", photo_url: "", status: "aktif" },
        { nama: "Ocktaviani E. Laloan, S.AB", jabatan: "Staf", spesialisasi: "TU", photo_url: "", status: "aktif" }
      ],
      activities: [
        { title: "Pembukaan Tahun Ajaran 2026", date: "2026-07-15", description: "Upacara pembukaan tahun ajaran baru bersama Kepala Sekolah.", category: "Agenda Sekolah", image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" },
        { title: "Coding Camp Ekstrakurikuler", date: "2026-08-01", description: "Pendaftaran Coding Camp SMAN 2 Tompaso gelombang pertama.", category: "Kegiatan Siswa", image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" }
      ],
      achievements: [
        { title: "Keunggulan Akademik - OSN", year: "2025", category: "Pendidikan", recipient_name: "Tim Akademik", description: "Perwakilan Siswa dalam OSN tingkat provinsi.", image_url: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=2070&auto=format&fit=crop" },
        { title: "Juara Atletik O2SN", year: "2025", category: "Olahraga", recipient_name: "Tim Olahraga", description: "Medali Emas O2SN Tingkat Kabupaten", image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop" }
      ],
      gallery: [
        { title: "Gedung Utama", category: "Fasilitas", image_url: "https://i.ibb.co.com/svqb8DsM/FB-IMG-1767504875049.jpg" },
        { title: "Perpustakaan", category: "Fasilitas", image_url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop" },
        { title: "Lounge IT", category: "Fasilitas", image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop" }
      ],
      policies: [
        { title: "Keunggulan Akademik (Sinergi Intelektual)", content: "Kurikulum SMA yang diperkuat dengan pengayaan teknologi untuk membekali siswa dengan kecakapan digital.", category: "Pilar Sekolah", status: "Terapkan" },
        { title: "Integritas Karakter (Martabat Luhur)", content: "Membentuk karakter siswa yang menjunjung etika Minahasa sebagai kompas moral.", category: "Pilar Sekolah", status: "Terapkan" }
      ],
      osis: [
        { nama: "Preysi Pesik", jabatan: "Ketua OSIS", kelas: "XI", masa_jabatan: "2025/2026", status: "aktif" },
        { nama: "Esterlita Suoth", jabatan: "Wakil Ketua OSIS", kelas: "XI", masa_jabatan: "2025/2026", status: "aktif" },
        { nama: "Chika Korompis", jabatan: "Sekretaris I", kelas: "X", masa_jabatan: "2025/2026", status: "aktif" },
        { nama: "Chakrawala Lempoy", jabatan: "Sekretaris II", kelas: "X", masa_jabatan: "2025/2026", status: "aktif" },
        { nama: "Firen Gahung", jabatan: "Bendahara I", kelas: "X", masa_jabatan: "2025/2026", status: "aktif" },
        { nama: "Enjelika Singal", jabatan: "Bendahara II", kelas: "X", masa_jabatan: "2025/2026", status: "aktif" }
      ],
      berita: [
        { title: "Selamat Datang di Portal Terintegrasi SMAN 2 Tompaso", category: "Pendidikan", excerpt: "Portal modern sekolah resmi diluncurkan.", content: "Hari ini kami meluncurkan portal terintegrasi. Seluruh manajemen akademik kini dapat diakses secara digital.", image_url: "https://i.ibb.co.com/svqb8DsM/FB-IMG-1767504875049.jpg", author_name: "Admin Sekolah" }
      ]
    };
    
    const results: any = {};
    
    if (payload.teachers.length) results.teachers = await supabase!.from('teachers').insert(payload.teachers);
    if (payload.activities.length) results.activities = await supabase!.from('kegiatan').insert(payload.activities);
    if (payload.achievements.length) results.achievements = await supabase!.from('prestasi').insert(payload.achievements);
    if (payload.gallery.length) results.gallery = await supabase!.from('galeri').insert(payload.gallery);
    if (payload.policies.length) results.policies = await supabase!.from('kebijakan').insert(payload.policies);
    if (payload.osis.length) results.osis = await supabase!.from('osis_members').insert(payload.osis);
    if (payload.berita.length) results.berita = await supabase!.from('berita').insert(payload.berita);

    await apiLogActivity('System', 'Melakukan sinkronisasi data awal', 'Migrasi data dari code ke database berhasil dilakukan.');
    return { data: results };
  } catch (error: any) {
    console.error('Migration error:', error);
    return { error: error.message };
  }
};

export const fetchCategories = async () => ({
  data: [
    { id: '1', name: 'Pendidikan' },
    { id: '2', name: 'Prestasi' },
    { id: '3', name: 'Kegiatan Siswa' },
    { id: '4', name: 'Agenda Sekolah' },
    { id: '5', name: 'Pengumuman' }
  ]
});

export const apiGetStats = async () => {
  if (isSupabaseConfigured()) {
    try {
      const getCountSafe = async (table: string): Promise<{ count: number | null }> => {
        try {
          const res = await supabase!.from(table).select('*', { count: 'exact', head: true });
          return res;
        } catch {
          return { count: 0 };
        }
      };

      const [newsCount, teachersCount, ppdbCount, activityCount, achievementCount] = await Promise.all([
        getCountSafe('berita'),
        getCountSafe('teachers'),
        getCountSafe('ppdb'),
        getCountSafe('kegiatan'),
        getCountSafe('prestasi')
      ]);

      return {
        data: {
          totalNews: newsCount.count || 0,
          totalTeachers: teachersCount.count || 0,
          totalPPDB: ppdbCount.count || 0,
          totalActivities: activityCount.count || 0,
          totalAchievements: achievementCount.count || 0
        }
      };
    } catch (err) {
      console.error('Error fetching stats:', err);
      return { data: { totalNews: 0, totalTeachers: 0, totalPPDB: 0, totalActivities: 0, totalAchievements: 0 } };
    }
  }

  return {
    data: {
      totalNews: getFromStorage(STORAGE_KEYS.NEWS).length,
      totalTeachers: getFromStorage(STORAGE_KEYS.TEACHERS).length,
      totalPPDB: getFromStorage('sman2t_ppdb').length,
      totalActivities: getFromStorage(STORAGE_KEYS.KEGIATAN).length,
      totalAchievements: getFromStorage(STORAGE_KEYS.PRESTASI).length
    }
  };
};

export const apiGetActivityLog = async (options?: { limit?: number }) => {
  try {
    const logs = localStorage.getItem('sman2t_activity_logs');
    const data = logs ? JSON.parse(logs).slice(0, options?.limit || 20) : [];
    return { data };
  } catch {
    return { data: [] };
  }
};

export const apiGetUsers = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!.from('users').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      console.error('❌ Error fetching users:', err);
      return { data: [], error: err };
    }
  }
  return { data: getFromStorage(STORAGE_KEYS.USERS) || [], error: null };
};

export const apiCreateUser = async (userData: any) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role || 'user'
          }
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }
  const user = {
    id: Date.now().toString(),
    email: userData.email,
    full_name: userData.full_name,
    role: userData.role || 'user',
    created_at: new Date().toISOString()
  };
  const users = getFromStorage(STORAGE_KEYS.USERS);
  users.push(user);
  saveToStorage(STORAGE_KEYS.USERS, users);
  return { data: user, error: null };
};

export const apiUpdateUser = async (id: string, userData: any) => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase!
        .from('users')
        .update(userData)
        .eq('id', id)
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }
  const users = getFromStorage(STORAGE_KEYS.USERS);
  const idx = users.findIndex((u: any) => u.id === id);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...userData };
    saveToStorage(STORAGE_KEYS.USERS, users);
    return { data: [users[idx]], error: null };
  }
  return { data: null, error: { message: 'User not found' } };
};

export const apiDeleteUser = async (id: string) => {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase!.from('users').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  }
  const users = getFromStorage(STORAGE_KEYS.USERS);
  saveToStorage(STORAGE_KEYS.USERS, users.filter((u: any) => u.id !== id));
  return { error: null };
};

export const apiResetPassword = async (email: string) => {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase!.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  }
  return { success: true, error: null, message: 'Demo mode: Password reset link would be sent to email' };
};

export const apiChangePassword = async (currentPassword: string, newPassword: string) => ({ success: true });
export const getToken = () => 'standalone-token';
