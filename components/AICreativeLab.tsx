
import React, { useState } from 'react';
import { Sparkles, Wand2, Loader2, Download, Zap, Play, Video, Image as ImageIcon } from 'lucide-react';
import { generateFuturisticVision, generateVeoVideo } from '../services/geminiService';

const AICreativeLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      if (mode === 'IMAGE') {
        const img = await generateFuturisticVision(prompt);
        setResult(img);
      } else {
        const video = await generateVeoVideo(prompt);
        setResult(video);
      }
    } catch (e) {
      alert(e.message);
    }
    setIsGenerating(false);
  };

  return (
    <div className="pt-40 pb-32 bg-[#05070B] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="reveal active">
            <div className="inline-flex items-center space-x-4 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-8">
              <Zap className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em]">Visionary Neural Engine v2.0</span>
            </div>
            <h1 className="text-6xl md:text-[120px] font-black tracking-tighter leading-none">
              CREATIVE <br /> <span className="text-[#D4AF37] italic font-serif-prestige font-light lowercase">lab.</span>
            </h1>
          </div>
          <div className="flex bg-white/5 p-2 rounded-full border border-white/10">
             <button onClick={() => setMode('IMAGE')} className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-3 ${mode === 'IMAGE' ? 'bg-[#D4AF37] text-primary' : 'text-white/40'}`}>
                <ImageIcon className="h-4 w-4" />
                <span>Image</span>
             </button>
             <button onClick={() => setMode('VIDEO')} className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-3 ${mode === 'VIDEO' ? 'bg-[#D4AF37] text-primary' : 'text-white/40'}`}>
                <Video className="h-4 w-4" />
                <span>Video (Veo)</span>
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-5 space-y-12">
            <div className="bg-white/5 border border-white/10 p-14 rounded-[60px]">
              <h3 className="text-2xl font-black mb-8 tracking-tight">Sintesis Visi {mode}</h3>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'IMAGE' ? "Deskripsikan arsitektur masa depan..." : "Deskripsikan gerakan kamera dan aksi masa depan..."}
                className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white focus:outline-none focus:border-[#D4AF37] h-40 font-light resize-none mb-8"
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-[#D4AF37] text-primary py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center space-x-4 hover:bg-white transition-all disabled:opacity-20 shadow-2xl"
              >
                {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                <span>{isGenerating ? 'Synthesizing...' : `Render ${mode}`}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-[60px] lg:rounded-[100px] overflow-hidden bg-white/5 aspect-video border border-white/10 flex items-center justify-center shadow-4xl group">
              {result ? (
                mode === 'IMAGE' ? (
                  <img src={result} className="w-full h-full object-cover" />
                ) : (
                  <video src={result} controls className="w-full h-full object-cover" autoPlay loop />
                )
              ) : (
                <div className="text-center p-20 opacity-20">
                  <Play className="h-20 w-20 mx-auto mb-10" />
                  <p className="text-2xl font-serif-prestige italic">"Menunggu transmisi imajinasi {mode}..."</p>
                </div>
              )}
              
              {isGenerating && (
                <div className="absolute inset-0 bg-primary/90 backdrop-blur-3xl flex flex-col items-center justify-center space-y-8">
                   <div className="w-24 h-24 border-t-4 border-[#D4AF37] rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">
                     {mode === 'VIDEO' ? 'Veo 3.1 Generating 1080p Video...' : 'Neural Image Synthesis...'}
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICreativeLab;
