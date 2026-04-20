
import React from 'react';

export interface NewsItem {
  id: string | number;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  date: string;
  author_name: string;
  created_at?: string;
}

export interface SchoolSchedule {
  id: string | number;
  title: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  description: string;
  type: 'daily' | 'weekly' | 'event' | 'holiday';
  created_at?: string;
}

export interface Announcement {
  id: string | number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'archived';
  published_date: string;
  created_at?: string;
}

export interface Teacher {
  id: string | number;
  nama: string;
  nip?: string;
  spesialisasi: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  jabatan?: string;
  status: 'aktif' | 'non-aktif';
  created_at?: string;
}

export interface OSISMember {
  id: string | number;
  nama: string;
  jabatan: string;
  kelas: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  masa_jabatan: string;
  departemen?: string;
  status: 'aktif' | 'non-aktif';
  created_at?: string;
}

export enum Page {
  HOME = 'HOME',           // Landing & Profile
  PROFIL = 'PROFIL',       // Full School Profile
  GURU = 'GURU',           // Teachers & Staff
  KEGIATAN = 'KEGIATAN',   // Activities & Ops
  PRESTASI = 'PRESTASI',   // Achievements
  BERITA = 'BERITA',       // Blog/News
  GALERI = 'GALERI',       // Visual Gallery
  PPDB = 'PPDB',           // Admission Hub
  SIAKAD = 'SIAKAD',       // Academic Portal
  LIBRARY = 'LIBRARY',     // Digital Library
  ALUMNI = 'ALUMNI',       // Alumni Network
  AI_HUB = 'AI_HUB',       // Creative AI Lab
  SCHOLAR = 'SCHOLAR',     // AI Tutor Hub
  ADMIN = 'ADMIN',
  GURU_PORTAL = 'GURU_PORTAL', // Teacher Portal
  DEVELOPER = 'DEVELOPER',     // Technical Credits
  PPDB_STATUS = 'PPDB_STATUS'  // Check PPDB Status
}

// PPDB Registration Interface
export interface PPDBRegistration {
  id: string | number;
  nama_lengkap: string;
  nisn: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: string;
  agama?: string;
  alamat_lengkap?: string;
  nomor_wa?: string;
  asal_sekolah?: string;
  npsn_sekolah?: string;
  tahun_lulus?: string;
  nama_ayah?: string;
  nama_ibu?: string;
  nomor_wa_ortu?: string;
  jalur_pendaftaran?: string;
  status_pendaftaran?: string;
  created_at?: string;
}

export interface Activity {
  id: string | number;
  title: string;
  date?: string;
  description?: string;
  image_url?: string;
  location?: string;
  category?: string;
  created_at?: string;
}

export interface Achievement {
  id: string | number;
  title: string;
  year?: string;
  description?: string;
  image_url?: string;
  recipient_name?: string;
  category?: string;
  created_at?: string;
}

export interface GalleryImage {
  id: string | number;
  image_url: string;
  title?: string;
  category?: string;
  created_at?: string;
}

export interface Policy {
  id: string | number;
  title: string;
  content: string;
  updated_at?: string;
}
