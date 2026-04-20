
import React, { useState, useRef } from 'react';
import { BookOpen, Upload, Loader2, Sparkles, FileText, BrainCircuit, Lightbulb, GraduationCap } from 'lucide-react';
import { analyzeScholarDocument } from '../services/geminiService';

const AIScholar: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    const base64 = preview.split(',')[1];
    const mime = file?.type || 'image/jpeg';
    const analysis = await analyzeScholarDocument(prompt || "Jelaskan ini.", base64, mime);
    setResult(analysis);
    setLoading(false);
  };

  return (
    <div className="pt-40 pb-32 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="reveal active">
            <div className="inline-flex items-center space-x-4 bg-primary/5 px-6 py-2 rounded-full mb-8">
              <BrainCircuit className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em]">Neural Tutor Hub</span>
            </div>
            <h1 className="text-6xl md:text-[120px] font-black tracking-tighter leading-none">
              AI <br /> <span className="text-gray-200 italic font-serif-prestige font-light lowercase">scholar.</span>
            </h1>
          </div>
          <p className="text-gray-600 text-xl font-light leading-relaxed max-w-sm italic font-serif-prestige reveal active">
            "Analisis dokumen, soal, dan materi belajar menggunakan visi kecerdasan buatan."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Upload Section */}
          <div className="lg:col-span-5 space-y-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-[450px] bg-gray-50 border-4 border-dashed border-gray-100 rounded-[60px] flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37]/30 transition-all overflow-hidden"
            >
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-12">
                  <Upload className="h-16 w-16 text-gray-200 mx-auto mb-6 group-hover:text-[#D4AF37] transition-colors" />
                  <p className="text-gray-600 font-black text-[10px] uppercase tracking-widest">Klik untuk unggah Foto/PDF</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
            </div>

            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ajukan pertanyaan spesifik tentang dokumen ini..."
              className="w-full bg-gray-50 border border-gray-100 p-8 rounded-[40px] text-primary focus:outline-none focus:border-[#D4AF37] transition-all min-h-[150px] font-medium"
            />

            <button 
              onClick={handleAnalyze}
              disabled={loading || !preview}
              className="w-full bg-primary text-white py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center space-x-4 hover:bg-[#D4AF37] hover:text-primary transition-all disabled:opacity-20"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              <span>Mulai Analisis Tutor</span>
            </button>
          </div>

          {/* Analysis Result */}
          <div className="lg:col-span-7">
            <div className="bg-primary p-12 lg:p-20 rounded-[80px] text-white min-h-full shadow-4xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-12">
                  <Lightbulb className="h-8 w-8 text-[#D4AF37]" />
                  <h3 className="text-3xl font-black tracking-tight">Hasil Bedah Materi</h3>
                </div>

                {result ? (
                  <div className="prose prose-invert prose-lg font-serif-prestige leading-relaxed whitespace-pre-wrap">
                    {result}
                  </div>
                ) : (
                  <div className="py-32 text-center opacity-20">
                    <GraduationCap className="h-24 w-24 mx-auto mb-8" />
                    <p className="text-2xl font-serif-prestige italic">"Menunggu transmisi kecerdasan..."</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScholar;
