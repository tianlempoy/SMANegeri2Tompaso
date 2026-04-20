import { GoogleGenAI, Type, Modality } from "@google/genai";
import { SCHOOL_KNOWLEDGE } from "../constants/knowledge";

// Lazy initialize GoogleGenAI only when needed
let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    const apiKey = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
                   (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_KEY) ||
                   (typeof process !== 'undefined' && process.env?.API_KEY) || 
                   '';
    if (!apiKey || apiKey.includes('your_gemini_api_key_here')) {
      console.warn('Warning: API_KEY not configured or still using placeholder. AI features may not work.');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const analyzeScholarDocument = async (prompt: string, base64Data: string, mimeType: string): Promise<string> => {
  try {
    const aiClient = getAIClient();
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { inlineData: { data: base64Data, mimeType } },
        { text: `Sebagai AI Scholar SMAN 2 Tompaso, jelaskan dokumen/gambar ini untuk membantu siswa belajar: ${prompt}` }
      ]
    });
    return response.text || "Tidak dapat menganalisis gambar.";
  } catch (error) {
    return "Gagal menganalisis dokumen: " + (error instanceof Error ? error.message : String(error));
  }
};

export const generateFuturisticVision = async (prompt: string) => {
  try {
    const aiClient = getAIClient();
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `Cinematic high-tech school in Tompaso, North Sulawesi. ${prompt}`,
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    const part = response.candidates[0].content.parts.find(p => p.inlineData);
    return part ? `data:image/png;base64,${part.inlineData.data}` : null;
  } catch (error) {
    console.error('Error generating futuristic vision:', error);
    return null;
  }
};

export const generateVeoVideo = async (prompt: string) => {
  try {
    // Catatan: Pemanggilan Veo membutuhkan Key Selection di window.aistudio
    if (!(await (window as any).aistudio.hasSelectedApiKey())) {
      await (window as any).aistudio.openSelectKey();
    }
    
    const apiKey = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_KEY) || '';
    const freshAi = new GoogleGenAI({ apiKey });
    let operation = await freshAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Futuristic education at SMAN 2 Tompaso, high tech, cinematic 4k: ${prompt}`,
      config: { resolution: '720p', aspectRatio: '16:9' }
    });

    while (!operation.done) {
      await new Promise(r => setTimeout(r, 10000));
      operation = await freshAi.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return `${downloadLink}&key=${apiKey}`;
  } catch (error) {
    console.error('Error generating Veo video:', error);
    return null;
  }
};

/**
 * GENERATE NEWS CONTENT
 * Membantu menulis berita lengkap berdasarkan topik singkat.
 */
export const generateNewsContent = async (topic: string) => {
  try {
    const aiClient = getAIClient();
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { text: `Hanya kembalikan JSON murni tanpa markdown.
        Tugas: Tulis berita profesional untuk ${SCHOOL_KNOWLEDGE.name} tentang: "${topic}".
        Gunakan konteks ini jika perlu: Motto kami adalah ${SCHOOL_KNOWLEDGE.philosophy.motto}.
        Format JSON:
        {
          "title": "Judul Berita",
          "category": "Pendidikan|Prestasi|Kegiatan Siswa|Agenda Sekolah|Pengumuman",
          "excerpt": "Ringkasan pendek",
          "content": "Isi lengkap minimal 3 paragraf, bahasa Indonesia formal & edukatif."
        }` }
      ]
    });
    
    const text = response.text || "{}";
    // Bersihkan jika AI memberikan wrapper markdown
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error generating news:', error);
    throw new Error("Gagal menghubungkan ke Asisten AI. Periksa API Key Anda.");
  }
};
