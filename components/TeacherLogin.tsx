import React, { useState } from 'react';
import { LogIn, AlertCircle, Loader2, BookOpen } from 'lucide-react';
import { teacherLogin } from '../lib/actions';
import { isSupabaseConfigured } from '../lib/supabase';

interface TeacherLoginProps {
  onSuccess: () => void;
}

const TeacherLogin: React.FC<TeacherLoginProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isConnected = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await teacherLogin(username, password);
    
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else if (data && data.user) {
      onSuccess();
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 px-4 py-20">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/10 overflow-hidden border border-blue-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0A0F1E] to-blue-900 p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F3C623]/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
            
            <div className="inline-flex bg-[#F3C623] p-4 rounded-[24px] mb-6 shadow-xl shadow-yellow-500/20 transform -rotate-3 relative z-10">
              <BookOpen className="h-8 w-8 text-[#0A0F1E]" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight relative z-10">Portal <span className="text-[#F3C623]">Guru</span></h2>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Akses Eksklusif Pendidik</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-start space-x-3 text-xs animate-reveal">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-black uppercase text-[10px] mb-1">Error Terdeteksi:</span>
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Username / Email</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#F3C623] focus:bg-white focus:ring-2 focus:ring-[#F3C623]/20 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@sman2t.sch.id"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-gray-600 hover:text-[#F3C623] transition-colors uppercase tracking-widest font-bold"
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#F3C623] focus:bg-white focus:ring-2 focus:ring-[#F3C623]/20 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0A0F1E] to-blue-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-blue-900/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl disabled:hover:shadow-blue-900/10 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Masuk Portal</span>
                </>
              )}
            </button>

            {/* Security Footer */}
            <div className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest border-t border-gray-100 pt-6 mt-6">
              <p>🔒 Sistem Autentikasi Aman</p>
              <p className="mt-1">SMAN 2 Tompaso © 2026</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
