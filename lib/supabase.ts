import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi sederhana untuk memastikan URL valid sebelum inisialisasi
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.warn('⚠️ Supabase credentials not configured or invalid URL. Using localStorage fallback.');
} else {
  console.log('🚀 Supabase initialized successfully for SMAN 2 Tompaso');
}

export const supabase = (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper untuk mendeteksi apakah Supabase tersedia
export const isSupabaseConfigured = () => !!supabase;

