// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, onSnapshot } from 'firebase/firestore';

// --- ICONS ---
const FilmIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>;
const WandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8l1.4 1.4"/><path d="M17.8 6.2l1.4-1.4"/><path d="M6.2 6.2l1.4 1.4"/><path d="M6.2 17.8l1.4-1.4"/><path d="M2 22l8.5-8.5"/><path d="M10.5 13.5l4-4"/></svg>;
const LoaderIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
const DownloadIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const CopyIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const UploadIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const XIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const SparklesIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const TrashIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const VolumeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
const RefreshIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>;
const SquareIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>;
const ActivityIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const EyeIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const CameraIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
const PdfIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const PlusIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const MapPinIcon = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;

// --- FIREBASE INIT ---
// Mendeteksi otomatis apakah berjalan di Canvas atau Vercel
const getFirebaseConfig = () => {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    return JSON.parse(__firebase_config);
  }
  try {
    if (import.meta && import.meta.env && import.meta.env.VITE_FIREBASE_CONFIG) {
      return JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
    }
  } catch (e) {
    console.error("VITE_FIREBASE_CONFIG salah format", e);
  }
  // Fallback kosong untuk mencegah crash
  return { apiKey: "dummy", projectId: "dummy", appId: "1:111:web:111" };
};

const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'ai-film-studio-vercel';

// --- API LOGIC ---
// Membaca API Key dari Environment Variable Vercel (VITE_GEMINI_API_KEY)
let apiKey = ""; 
try {
  if (import.meta && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  }
} catch (e) {}

// NEW HELPER: Auto-Fallback Text API (Solusi Error 404 Vercel)
const callGeminiText = async (payload) => {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  let response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  
  if (response.status === 404 || response.status === 403) {
    url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  }
  
  if (!response.ok) throw new Error(`API Error ${response.status}`);
  return await response.json();
};

// Kompresor Gambar Pintar Untuk Mencegah Firestore Limit Error (1MB)
const compressImageForStorage = (base64Str, maxWidth = 600, quality = 0.6) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64Str); 
    img.src = base64Str;
  });
};

// Pengatur Gaya Visual Pintar (Dynamic Style Suffix)
const getStyleModifiers = (style, subStyle = 'Detail') => {
  if (!style) return "";
  const s = style.toLowerCase();
  const baseLock = ", strictly consistent art style, unified visual identity, masterpiece";
  if (s.includes('pixar') || s.includes('3d')) return baseLock + ", Pixar 3D animation style, Disney 3D, cute stylized 3D render, smooth volumetric lighting, vibrant colors";
  
  if (s.includes('2d classic') || s.includes('cartoon') || s.includes('comic')) {
    const sub = subStyle ? subStyle.toLowerCase() : 'detail';
    if (sub.includes('minimal')) {
      return baseLock + ", minimalist comic book style, simple clean lines, minimal details, flat simple shading, completely flat 2d vector art, no 3d render";
    } else if (sub.includes('realistis')) {
      return baseLock + ", realistic comic book style, graphic novel realism, detailed facial features, realistic proportions with comic shading, cel shaded realism, completely flat 2d, no 3d render";
    } else if (sub.includes('exaggerated') || sub.includes('lebih')) {
      return baseLock + ", exaggerated comic book style, dynamic dramatic proportions, extreme perspective, caricature style, highly expressive, stylized flat 2d, crisp bold black outlines, no 3d render";
    } else {
      return baseLock + ", highly detailed comic book illustration, intricate ink lines, complex graphic novel shading, vivid colors, crisp bold black outlines, completely flat 2d, no 3d render";
    }
  }

  if (s.includes('ghibli') || s.includes('anime') || s.includes('manga')) return baseLock + ", Studio Ghibli style, anime art style, 2D Japanese animation, beautiful painted background, cel shaded, ethereal, completely flat 2d";
  if (s.includes('claymation') || s.includes('plasticin')) return baseLock + ", claymation style, Aardman animation, plasticine texture, stop motion animation, macro photography, tactile texture, miniature studio lighting";
  if (s.includes('watercolor') || s.includes('painted')) return baseLock + ", watercolor painting, ink and wash, artistic, ethereal, visible brush strokes";
  if (s.includes('vintage')) return baseLock + ", vintage photography, Kodak Portra 400, grainy, cinematic 35mm lens, nostalgic, retro aesthetic";
  if (s.includes('cyberpunk')) return baseLock + ", cyberpunk art style, neon glowing lights, futuristic, highly detailed, octane render, vivid sci-fi colors";
  return ", raw photo, ultra-photorealistic, 8k resolution, cinematic photography, highly detailed natural texture, DSLR, no CGI, unretouched";
};

// Fallback for Clipboard in iframes
const fallbackCopyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Unable to copy', err);
  }
  document.body.removeChild(textArea);
};

// Audio Generation TTS & PCM to WAV Converter
const writeString = (view, offset, string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

const pcmToWav = (pcmData, sampleRate) => {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const pcmView = new Uint8Array(buffer, 44);
  pcmView.set(pcmData);

  return new Blob([view], { type: 'audio/wav' });
};

// NEW: Map user selected style to Gemini Prebuilt Voices
const getVoiceNameFromStyle = (style) => {
  if (!style) return "Kore";
  const s = style.toLowerCase();
  if (s.includes('epik') || s.includes('berat')) return "Fenrir"; 
  if (s.includes('pria - ringan')) return "Puck"; 
  if (s.includes('bapak')) return "Orus"; 
  if (s.includes('wanita - tegas')) return "Kore"; 
  if (s.includes('wanita') || s.includes('ibu')) return "Aoede"; 
  if (s.includes('anak')) return "Callirrhoe"; 
  if (s.includes('penyiar') || s.includes('mc')) return "Zephyr"; 
  return "Kore"; 
};

const generateAudioContent = async (text, voiceStyle) => {
  const voiceName = getVoiceNameFromStyle(voiceStyle);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } } }
    },
    model: "gemini-2.5-flash-preview-tts"
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  let retries = 3;
  let backoff = 1000;

  while (retries > 0) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`API Error ${response.status}`);
      
      const data = await response.json();
      const inlineData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      
      if (inlineData) {
        const rateMatch = inlineData.mimeType.match(/rate=(\d+)/);
        const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
        const binaryStr = atob(inlineData.data);
        const pcmData = new Uint8Array(binaryStr.length);
        for(let i = 0; i < binaryStr.length; i++) {
            pcmData[i] = binaryStr.charCodeAt(i);
        }
        const wavBlob = pcmToWav(pcmData, sampleRate);
        return URL.createObjectURL(wavBlob);
      }
      throw new Error("Format audio tidak valid dari API");
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      await delay(backoff);
      backoff *= 2;
    }
  }
};

// Client-side Image Upscaler for High-Res Downloads
const handleDownloadUpscaled = (imageUrl, filename) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const scale = 3; 
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };
  img.src = imageUrl;
};

// Image Cropper for precise Aspect Ratios
const cropImageToAspectRatio = (imageUrl, ratioStr) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let targetRatio = 16 / 9;
      if (ratioStr.includes("16:9")) targetRatio = 16 / 9;
      else if (ratioStr.includes("2.35:1")) targetRatio = 2.35 / 1;
      else if (ratioStr.includes("9:16")) targetRatio = 9 / 16;
      else if (ratioStr.includes("1:1")) targetRatio = 1 / 1;

      const canvas = document.createElement('canvas');
      let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;
      const imgRatio = img.width / img.height;

      if (Math.abs(imgRatio - targetRatio) < 0.05) {
        resolve(imageUrl); 
        return;
      }

      if (imgRatio > targetRatio) {
        srcW = img.height * targetRatio;
        srcX = (img.width - srcW) / 2;
      } else {
        srcH = img.width / targetRatio;
        srcY = (img.height - srcH) / 2;
      }

      canvas.width = srcW;
      canvas.height = srcH;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
      resolve(canvas.toDataURL('image/jpeg', 0.95)); 
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

// LLM Prompt Enhancer using Gemini Text API
const enhanceImagePrompt = async (basePrompt, mode = 'enhance', style = 'Cinematic Realistic') => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const systemInstruction = `
    You are a Master AI Image Prompt Engineer, equivalent to the engine behind ChatGPT's DALL-E 3 or a Midjourney v6 expert. 
    Your task is to take a simple user idea and rewrite it into a breathtakingly detailed, professional text-to-image prompt in ENGLISH.
    Use this exact formula: [Main Subject & Specific Physical Appearance] + [Action/Pose] + [Detailed Environment/Setting] + [Cinematic Lighting (e.g., volumetric, neon glow, golden hour, chiaroscuro)] + [Camera Angle, Lens & Film Stock (e.g., Extreme wide shot, 35mm lens, Kodak Portra 400)] + [Atmosphere/Mood] + [Render Style: raw photography, ultra-photorealistic, no CGI].
    Make the prompt highly evocative, descriptive, and dense with visual keywords. Ensure it strictly follows the Visual Style: ${style}.
    
    CRITICAL RULES:
    1. Return ONLY the raw enhanced prompt string. Do not include quotes, conversational text, or explanations.
    2. NEVER change, delete, or replace the main subject/character specified by the user.
  `;

  const promptInstruction = mode === 'reprompt' 
    ? `Create a variation of this prompt keeping the style as ${style}. RULE: You MUST keep the EXACT same main subject, character, and core action. ONLY change the camera angle, lighting, time of day, or atmosphere to give a fresh look. Original prompt: ${basePrompt}`
    : `Enhance this visual idea into a highly detailed cinematic prompt keeping the style as ${style}. RULE: Keep the main subject 100% intact. Original idea: ${basePrompt}`;

  const payload = {
    contents: [{ parts: [{ text: promptInstruction }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { temperature: 0.8, maxOutputTokens: 300 }
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  let retries = 3;
  let backoff = 1000;

  while (retries > 0) {
    try {
      const data = await callGeminiText(payload);
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
      throw new Error("Invalid format");
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      await delay(backoff);
      backoff *= 2;
    }
  }
};

// LLM Feature - AI Script Doctor
const rewriteDialogueText = async (baseDialogue, genre, idea) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const promptInstruction = `Anda adalah seorang Penulis Skenario (Script Doctor) pemenang Oscar. 
  Tugas Anda adalah memoles dan memperbaiki dialog atau narasi berikut agar terasa jauh lebih sinematik, emosional, dan kuat, sesuai dengan genre ${genre}. Tema cerita: ${idea}.
  
  Dialog Asli: "${baseDialogue}"
  
  ATURAN MUTLAK: Hanya kembalikan teks dialog/narasi yang sudah diperbaiki. JANGAN menggunakan tanda kutip di awal/akhir, dan JANGAN memberikan penjelasan apapun.`;

  const payload = {
    contents: [{ parts: [{ text: promptInstruction }] }],
    generationConfig: { temperature: 0.8, maxOutputTokens: 200 }
  };

  try {
    const data = await callGeminiText(payload);
    return data.candidates?.[0]?.content?.parts?.[0]?.text.trim() || baseDialogue;
  } catch (e) {
    console.error(e);
    return baseDialogue; 
  }
};

// LLM Feature - AI Casting Director
const generateCastingSuggestions = async (char) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const promptInstruction = `Sebagai Casting Director Hollywood kelas A, berikan 2 saran aktor/aktris (bisa Indonesia atau Internasional) yang paling sempurna untuk memerankan karakter ini:
  Nama: ${char.name}
  Peran: ${char.role}
  Fisik: ${char.appearance}
  Sifat: ${char.personality}
  
  Format: Sebutkan nama aktor dan berikan 1 kalimat tajam mengapa mereka cocok. Gunakan bahasa Indonesia yang profesional. Maksimal 60 kata keseluruhan.`;

  const payload = {
    contents: [{ parts: [{ text: promptInstruction }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 150 }
  };

  try {
    const data = await callGeminiText(payload);
    return data.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "Gagal mendapatkan saran casting.";
  } catch (e) {
    console.error(e);
    return "Terjadi kesalahan saat memanggil AI Casting Director.";
  }
};

// Smart Router for Image Generation (Imagen 4.0 vs Gemini Flash Image Preview)
const generateImageContent = async (promptText, referenceImages = []) => {
  const isImageToImage = Array.isArray(referenceImages) && referenceImages.length > 0;
  
  const callGeminiFlashImage = async () => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;
    const parts = [{ text: promptText }];
    if (isImageToImage) {
      referenceImages.forEach(ref => {
        if (ref.base64Data && ref.mimeType) {
          parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.base64Data } });
        }
      });
    }
    const payload = {
      contents: [{ parts }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
    };
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    const result = await response.json();
    const imagePart = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (imagePart && imagePart.inlineData) {
      return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    }
    throw new Error("Format gambar tidak valid.");
  };

  const callImagen4 = async () => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
    const payload = {
      instances: [{ prompt: promptText }],
      parameters: { sampleCount: 1 }
    };
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`API Error ${response.status}`);
    const result = await response.json();
    if (result.predictions && result.predictions[0] && result.predictions[0].bytesBase64Encoded) {
      return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
    }
    throw new Error("Format gambar tidak valid.");
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  let retries = 3;
  let backoff = 1000;

  while (retries > 0) {
    try {
      if (isImageToImage) {
         return await callGeminiFlashImage();
      } else {
         try {
           return await callImagen4();
         } catch (e) {
           console.warn("Imagen4 failed, falling back to Gemini Flash Image:", e);
           return await callGeminiFlashImage();
         }
      }
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.warn("Google Image API restricted (404/403). Menggunakan Public Fallback Generator.");
        const seed = Math.floor(Math.random() * 1000000);
        let ratioStr = "";
        if (promptText.includes("16:9 aspect ratio")) ratioStr = "&width=1024&height=576";
        else if (promptText.includes("9:16 aspect ratio")) ratioStr = "&width=576&height=1024";
        else if (promptText.includes("2.35:1 aspect ratio")) ratioStr = "&width=1024&height=435";
        else ratioStr = "&width=1024&height=1024"; 
        
        const cleanPrompt = promptText.replace(/\[.*?\]/g, '').trim();
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?seed=${seed}&nologo=true${ratioStr}`;
      }
      await delay(backoff);
      backoff *= 2;
    }
  }
};

const generateFilmPipeline = async (formData, onProgress) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const fullStyle = formData.style === "Cartoon / Comic Book" && formData.subStyle ? `${formData.style} - ${formData.subStyle}` : formData.style;

  const systemInstruction = `
    Anda adalah seorang Sutradara Hollywood Elit, Penulis Skenario Profesional, dan Pakar AI Cinema.
    Tugas Anda adalah membuat dokumen "AI FILM STUDIO Ultimate Production Pipeline" yang sangat komprehensif berdasarkan ide pengguna.
    Bahasa Utama Dokumen: ${formData.language.toUpperCase()}. (KECUALI Prompt Gambar dan Arahan Suara, Anda WAJIB MENGGUNAKAN BAHASA INGGRIS agar mesin AI lain dapat memprosesnya).
    Gaya: Ultra sinematik, sangat visual, profesional, dan mendetail. WAJIB MENGADOPSI GAYA VISUAL: ${fullStyle} dalam setiap pembuatan visual prompt!

    Anda HARUS memformat seluruh respons Anda menggunakan struktur XML-like berikut SECARA URUT. JANGAN output apapun di luar tag <pipeline>.

    <pipeline>
      <section id="1" title="FILM CONCEPT DEVELOPMENT">
        <content>[Isi detail 5 opsi judul, logline, sinopsis, tema, nada emosional, penjelasan nada genre]</content>
      </section>
      <section id="2" title="CHARACTER DESIGN">
        <content>
        Gunakan format berikut berulang-ulang untuk SETIAP karakter utama dan pendukung yang ada di cerita:
        [CHARACTER]
        Name: [Nama Karakter]
        Role: [Peran dalam film, misal: Protagonis / Antagonis]
        Appearance: [Deskripsi fisik detail, usia, pakaian, gaya rambut]
        Personality: [Sifat, motivasi, arc karakter]
        Prompt: [Saran prompt AI berbahasa Inggris untuk men-generate wajah karakter ini. Sesuaikan dengan Gaya Visual: ${fullStyle}. Fokus pada close up, pencahayaan, dan render style. Contoh: "Portrait of a 30yo Asian man, cinematic lighting, ${fullStyle} style"]
        [/CHARACTER]
        </content>
      </section>
      <section id="3" title="VISUAL STYLE REFERENCES">
        <content>[Referensi gaya sinematografi, color grading, atmosfer, inspirasi art direction yang sangat cocok untuk visual style: ${fullStyle}]</content>
      </section>
      <section id="4" title="AI IMAGE GENERATION PROMPTS">
        <content>[Daftar prompt visual bahasa Inggris yang sangat detail untuk environment dan art direction utama bergaya ${fullStyle}]</content>
      </section>
      <section id="5" title="STORY STRUCTURE">
        <content>[Isi detail struktur cerita Act 1, Act 2, Act 3 secara naratif dan dramatis beserta turning points dan climax. Tuliskan dalam bentuk teks saja, JANGAN menggunakan tag prompt gambar di seksi ini.]</content>
      </section>
      <section id="6" title="LOCATIONS & SET DESIGN">
        <content>[Jabarkan setiap lokasi utama secara mendetail berdasarkan Story Structure. Format: Nama Lokasi, Waktu/Pencahayaan, Suasana, Elemen Kunci, dan Palet Warna.]</content>
      </section>
      <section id="7" title="FULL CINEMATIC SCRIPT">
        <content>[Buat skenario profesional yang dirinci PER SCENE sesuai jumlah scene yang diminta. Anda WAJIB menggunakan format standar skenario berikut ini dengan rapi:
        **SCENE [Nomor] - INT/EXT. LOKASI - WAKTU** (Pastikan merujuk pada LOCATIONS & SET DESIGN)
        *Deskripsi aksi, pergerakan karakter, dan lingkungan ditulis dengan huruf miring.*
        **NAMA KARAKTER**
        "Tulis dialog yang diucapkan di sini."
        Pastikan urutan scene jelas dan narasi mengalir dengan dramatis dari Scene 1 hingga selesai.]</content>
      </section>
      <section id="8" title="PROFESSIONAL SHOT LIST">
        <content>[Wajib gunakan Tabel Markdown yang RAPI. 
        Contoh Format Tabel:
        | Shot # | Scene Ref | Tipe Shot | Lensa | Pergerakan Kamera | Pencahayaan | Durasi |
        |---|---|---|---|---|---|---|
        | 1.1 | 1 | Wide Shot | 24mm | Slow Dolly In | Neon High Contrast | 5s |
        Buatlah daftar shot yang komprehensif, terstruktur sempurna dengan garis vertikal ( | ) yang sejajar untuk adegan-adegan penting.]</content>
      </section>
      <section id="9" title="AI VIDEO GENERATION PROMPTS">
        <content>[Daftar prompt untuk Runway/Kling/Sora yang berfokus pada pergerakan kamera, environment motion, dan cinematic pacing]</content>
      </section>
      <section id="10" title="VOICE OVER NARRATION">
        <content>[Teks narasi, emosi penyampaian, pacing untuk scene-scene kunci. SANGAT SESUAIKAN DENGAN KARAKTER VOICE OVER YANG DIPILIH PENGGUNA]</content>
      </section>
      <section id="11" title="AI VOICE GENERATION SETTINGS">
        <content>[Instruksi untuk AI Voice: gender, tone, kecepatan, emosi yang spesifik merefleksikan pilihan Karakter Voice Over pengguna]</content>
      </section>
      <section id="12" title="SOUND DESIGN">
        <content>[Gaya musik latar, ambient, efek suara sinematik]</content>
      </section>
      <section id="13" title="EDITING GUIDE">
        <content>[Saran pacing, transisi, ritme sinematik, kontinuitas]</content>
      </section>
      <section id="14" title="CONTENT CREATOR MODE">
        <content>[Aset media sosial: Judul YouTube, Deskripsi, Caption TikTok/IG, Hashtag SEO]</content>
      </section>
      <section id="15" title="CINEMATIC STORYBOARD & AUDIO CANVAS">
        <content>
        [STORYBOARD_HEADER]
        Cetak tag ini persis seperti ini untuk menampilkan menu Upload Referensi Karakter & Lokasi di aplikasi.
        [/STORYBOARD_HEADER]

        ATURAN MUTLAK: Visual, Audio, dan Info di setiap scene storyboard ini HARUS 100% MERUJUK, SINKRON, dan MENGGAMBARKAN adegan, lokasi, serta dialog yang telah Anda tulis di bagian "7. FULL CINEMATIC SCRIPT" dan "6. LOCATIONS & SET DESIGN". JANGAN mengarang cerita atau lokasi baru! Visualisasikan apa yang terjadi di skenario!

        Ubah format tradisional menjadi CANVAS INTERAKTIF. Untuk SETIAP scene dari Skenario, Anda HARUS menggunakan tag khusus berikut ini:
        
        [SCENE_BOARD]
        Scene: 1
        Visual: [Buat prompt gambar berbahasa Inggris. Formula: Subjek (Deskripsikan ulang ciri fisik di tiap scene!) + Aksi + Lingkungan Detail + Pencahayaan + Sudut Kamera. INGAT: Gunakan deskripsi yang sesuai dengan gaya ${fullStyle}.]
        Motion: [Buat saran prompt (SARAN GERAK) untuk Runway/Sora/Kling dalam bahasa Inggris yang mendeskripsikan BAGAIMANA GAMBAR INI BERGERAK MENJADI VIDEO.]
        Audio: [WAJIB mengadopsi gaya dari VOICE OVER NARRATION. Ambil DIALOG UTAMA atau narasi persis dari FULL CINEMATIC SCRIPT di scene ini. Awali teks dengan instruksi emosi dalam bahasa Inggris, misal: "Say in a deep voice: '[DIALOG]'"]
        Info: [Shot type, pergerakan kamera, dan setting lokasi SESUAI SCRIPT]
        [/SCENE_BOARD]

        Pastikan membuat tag di atas berulang-ulang dari Scene 1 hingga Scene terakhir secara urut dan lengkap mengikuti alur FULL CINEMATIC SCRIPT! Jangan gunakan tabel markdown di seksi ini.
        </content>
      </section>
    </pipeline>
  `;

  const userPrompt = `
    Tolong buatkan Production Pipeline berdasarkan parameter berikut:
    - Story Idea: ${formData.idea}
    - Output Language: ${formData.language}
    - Genre: ${formData.genre}
    - Film Duration: ${formData.duration}
    - Number of Scenes: ${formData.scenes}
    - Setting Location: ${formData.location}
    - Time Period: ${formData.timePeriod}
    - Target Platform: ${formData.platform}
    - Video Aspect Ratio: ${formData.aspectRatio}
    - Gaya Visual / Art Style: ${fullStyle}
    - Karakter Voice Over: ${formData.voiceStyle}
  `;

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    }
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  let retries = 3;
  let backoff = 1000;

  while (retries > 0) {
    try {
      const data = await callGeminiText(payload);
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      await delay(backoff);
      backoff *= 2;
    }
  }
};

// --- COMPONENTS ---

const InputField = ({ label, id, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1 tracking-wide uppercase text-xs">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-900 border border-gray-800 rounded-md py-2 px-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
    />
  </div>
);

const SelectField = ({ label, id, value, onChange, options }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1 tracking-wide uppercase text-xs">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-900 border border-gray-800 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const AspectRatioSelector = ({ id, value, onChange }) => {
  const options = [
    { label: "16:9", subLabel: "Standard", value: "16:9 (Standard)", boxClass: "w-7 h-4" },
    { label: "2.35:1", subLabel: "Cinematic", value: "2.35:1 (Cinematic Widescreen)", boxClass: "w-8 h-3.5" },
    { label: "9:16", subLabel: "Vertical", value: "9:16 (Vertical)", boxClass: "w-4 h-7" },
    { label: "1:1", subLabel: "Square", value: "1:1 (Square)", boxClass: "w-5 h-5" }
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-400 mb-2 tracking-wide uppercase text-xs">
        Aspect Ratio
      </label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ target: { id, value: opt.value } })}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.15)]'
                  : 'border-gray-800 bg-gray-900 text-gray-500 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              <div className={`border-2 mb-2 rounded-sm transition-colors ${isSelected ? 'border-yellow-400' : 'border-gray-500'} ${opt.boxClass}`}></div>
              <span className={`text-xs font-bold ${isSelected ? 'text-yellow-400' : 'text-gray-300'}`}>{opt.label}</span>
              <span className="text-[9px] uppercase tracking-widest opacity-70 mt-0.5">{opt.subLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const renderMarkdown = (text) => {
  if (!text) return { __html: '' };
  
  let processedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (processedText.includes('|')) {
    const lines = processedText.split('\n');
    let newLines = [];
    let tableRows = [];
    
    const processTableBlock = (rows) => {
      const hasSeparator = rows.some(r => r.includes('---'));
      if (!hasSeparator) return rows.join('\n'); 
      
      let tableHtml = '<div className="overflow-x-auto my-6 border border-gray-800 rounded-lg shadow-xl break-inside-avoid"><table className="w-full text-sm text-left"><thead className="text-xs uppercase bg-gray-900 text-blue-400 border-b border-gray-800">';
      let isHead = true;
      
      rows.forEach(row => {
        if (row.includes('---')) {
          isHead = false;
          tableHtml += '</thead><tbody className="divide-y divide-gray-800 bg-gray-900/30">';
          return;
        }
        
        let cleanRow = row.trim();
        if (cleanRow.startsWith('|')) cleanRow = cleanRow.substring(1);
        if (cleanRow.endsWith('|')) cleanRow = cleanRow.substring(0, cleanRow.length - 1);
        
        const cells = cleanRow.split('|');
        if (isHead) {
          tableHtml += '<tr>';
          cells.forEach(cell => tableHtml += `<th className="px-4 py-4 font-bold tracking-wider bg-gray-900 border-r border-gray-800 last:border-r-0">${cell.trim()}</th>`);
          tableHtml += '</tr>';
        } else {
          tableHtml += '<tr className="hover:bg-gray-800/80 transition-colors">';
          cells.forEach(cell => tableHtml += `<td className="px-4 py-3 align-top text-gray-300 min-w-[100px] border-r border-gray-800 last:border-r-0 leading-relaxed">${cell.trim()}</td>`);
          tableHtml += '</tr>';
        }
      });
      
      if (isHead) tableHtml += '</thead><tbody className="divide-y divide-gray-800 bg-gray-900/30">';
      tableHtml += '</tbody></table></div>';
      return tableHtml;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('|')) {
        tableRows.push(line);
      } else {
        if (tableRows.length > 0) {
          newLines.push(processTableBlock(tableRows));
          tableRows = [];
        }
        newLines.push(lines[i]);
      }
    }
    if (tableRows.length > 0) {
      newLines.push(processTableBlock(tableRows));
    }
    processedText = newLines.join('\n');
  }

  let html = processedText
    .replace(/^### (.*$)/gim, '<h3 className="text-xl font-bold mt-6 mb-2 text-blue-300">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 className="text-2xl font-bold mt-8 mb-4 text-blue-400 border-b border-gray-800 pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 className="text-3xl font-bold mt-8 mb-4 text-white">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong className="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em className="text-gray-300 italic">$1</em>')
    .replace(/^\s*-\s(.*)$/gim, '<li className="ml-4 list-disc marker:text-blue-500 mb-1">$1</li>');
    
  const blocks = html.split(/\n\n+/);
  const formattedBlocks = blocks.map(block => {
    if (block.trim().startsWith('<div') || block.trim().startsWith('<h') || block.trim().startsWith('<li') || block.trim().startsWith('<ul')) {
      return block;
    } else if (block.trim() === '') {
      return '';
    } else {
      return `<p className="mb-4 leading-relaxed text-gray-300">${block.trim().replace(/\n/g, '<br />')}</p>`;
    }
  });

  return { __html: formattedBlocks.join('\n') };
};

const CharacterCard = ({ char }) => {
  const [casting, setCasting] = useState(null);
  const [isCasting, setIsCasting] = useState(false);

  const handleCasting = async () => {
    setIsCasting(true);
    const suggestion = await generateCastingSuggestions(char);
    setCasting(suggestion);
    setIsCasting(false);
  };

  const handleCopyPrompt = (promptTxt) => {
    fallbackCopyTextToClipboard(promptTxt);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col break-inside-avoid shadow-lg hover:border-blue-500/50 transition-colors">
      <h4 className="text-xl font-bold text-blue-400">{char.name}</h4>
      {char.role && <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 inline-block bg-gray-800 px-2 py-1 rounded">{char.role}</span>}
      
      <div className="text-sm text-gray-300 mb-3 leading-relaxed">
        <strong className="text-gray-400 block mb-1">Penampilan Fisik:</strong> 
        {char.appearance}
      </div>
      
      <div className="text-sm text-gray-300 mb-5 leading-relaxed">
        <strong className="text-gray-400 block mb-1">Kepribadian & Arc:</strong> 
        {char.personality}
      </div>
      
      {/* AI Casting Director Widget */}
      <div className="mb-5 bg-gradient-to-r from-gray-950 to-indigo-950/30 p-3 rounded-lg border border-indigo-500/30 no-print">
        {!casting && !isCasting ? (
          <button 
            onClick={handleCasting}
            className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/50 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <SparklesIcon className="w-3.5 h-3.5" /> AI Casting Director ✨
          </button>
        ) : isCasting ? (
          <div className="flex items-center justify-center gap-2 text-indigo-400 text-xs font-bold py-2">
            <LoaderIcon className="w-4 h-4" /> Menganalisa Aktor...
          </div>
        ) : (
          <div className="text-xs text-indigo-200">
            <strong className="flex items-center gap-1 text-indigo-400 mb-1"><SparklesIcon className="w-3 h-3"/> Saran Casting:</strong>
            <p className="whitespace-pre-line leading-relaxed">{casting}</p>
          </div>
        )}
      </div>

      <div className="mt-auto bg-black/60 p-3 rounded-lg border border-gray-800 relative group">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider flex items-center gap-1"><SparklesIcon className="w-3 h-3"/> Saran Prompt AI</span>
          <button onClick={() => handleCopyPrompt(char.prompt)} className="text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 p-1.5 rounded transition-colors no-print" title="Copy Prompt">
            <CopyIcon className="w-3 h-3" />
          </button>
        </div>
        <p className="text-xs text-gray-400 italic line-clamp-3 group-hover:line-clamp-none transition-all duration-300">{char.prompt}</p>
      </div>
    </div>
  );
};

const CharacterCardsWidget = ({ text }) => {
  const regex = /\[CHARACTER\]([\s\S]*?)\[\/CHARACTER\]/g;
  const chars = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const block = match[1];
    chars.push({
      name: block.match(/Name:\s*(.+)/i)?.[1]?.trim() || "Karakter",
      role: block.match(/Role:\s*(.+)/i)?.[1]?.trim() || "",
      appearance: block.match(/Appearance:\s*(.+)/i)?.[1]?.trim() || "",
      personality: block.match(/Personality:\s*(.+)/i)?.[1]?.trim() || "",
      prompt: block.match(/Prompt:\s*([\s\S]+)/i)?.[1]?.trim() || "",
    });
  }

  if (chars.length === 0) return <div dangerouslySetInnerHTML={renderMarkdown(text)} />;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-4 print-grid-block">
      {chars.map((char, idx) => (
        <CharacterCard key={idx} char={char} />
      ))}
    </div>
  );
};

const ImageLightbox = ({ isOpen, onClose, imageUrl, onDownload, onDelete, isGenerating }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-md transition-all no-print" onClick={onClose}>
      <div className="relative flex flex-col items-center justify-center max-w-full max-h-full w-full h-full" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          disabled={isGenerating}
          className={`absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-gray-400 hover:text-white bg-gray-900/50 hover:bg-red-500/80 rounded-full transition-all z-10 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Tutup"
        >
          <XIcon className="w-6 h-6"/>
        </button>
        
        <div className="relative max-w-full max-h-[75vh] flex items-center justify-center group">
          <img 
            src={imageUrl} 
            alt="Enlarged Visual" 
            className={`max-w-full max-h-[75vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800 transition-all duration-300 ${isGenerating ? 'opacity-30 blur-sm scale-95' : 'opacity-100 scale-100'}`} 
          />

          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-400">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4 shadow-[0_0_30px_rgba(59,130,246,0.5)]"></div>
              <span className="font-bold tracking-widest uppercase text-sm animate-pulse">Regenerating...</span>
            </div>
          )}
        </div>
        
        <div className={`mt-8 flex items-center gap-6 bg-gray-900/90 backdrop-blur-md border border-gray-700 px-8 py-4 rounded-full shadow-2xl transition-opacity duration-300 ${isGenerating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <button 
            onClick={onDownload} 
            className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-green-400 transition-colors group"
          >
            <DownloadIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Simpan</span>
          </button>
          
          <div className="w-px h-8 bg-gray-700"></div>
          
          <button 
            onClick={() => { onDelete(); onClose(); }} 
            className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors group"
          >
            <TrashIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const StoryboardHeaderWidget = ({ characterBank, setCharacterBank, locationBank, setLocationBank, formData, sections }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  // NEW: State for Character Reference Image
  const [charRefImage, setCharRefImage] = useState(null);

  // New State for Location Bank
  const [locPrompt, setLocPrompt] = useState("");
  const [locRefImage, setLocRefImage] = useState(null);
  const [isGeneratingLoc, setIsGeneratingLoc] = useState(false);
  const [locError, setLocError] = useState(null);

  // --- Extract Location Suggestions from Section 6 ---
  const locSection = sections?.find(s => s.id === '6' || s.title.includes('LOCATION'));
  let locSuggestions = [];
  if (locSection && locSection.content) {
    const lines = locSection.content.split('\n');
    locSuggestions = lines
      .filter(line => /^(?:\*\*)?\d+\./.test(line.trim())) // Menangkap format list 1., 2., dst
      .map(line => line.replace(/^(?:\*\*)?\d+\.\s*(?:\*\*)?/, '').trim());
  }

  // --- Character Functions ---
  const handleCharRefUpload = (e) => {
    const target = e.target; 
    const file = target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran gambar terlalu besar. Maksimal 5MB.");
        target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressed = await compressImageForStorage(reader.result, 512, 0.6);
          setCharRefImage(compressed);
          setError(null);
        } catch (err) {
          console.error(err);
          setError("Gagal memproses gambar referensi karakter.");
        } finally {
          target.value = ''; 
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const fullStyle = formData.style === "Cartoon / Comic Book" && formData.subStyle ? `${formData.style} - ${formData.subStyle}` : formData.style;
      const globalContext = `[Context: ${formData.genre} genre film, Theme: ${formData.idea.substring(0, 100)}, Style: ${fullStyle}] `;
      const styleBooster = getStyleModifiers(formData.style, formData.subStyle);
      const finalPrompt = `[ART STYLE: ${fullStyle}] ` + globalContext + prompt.trim() + ", portrait, close up face" + styleBooster + ", 1:1 aspect ratio, square orientation";
      
      let url;
      if (charRefImage) {
        const base64Data = charRefImage.split(',')[1];
        const mimeType = charRefImage.match(/data:(.*?);/)[1];
        url = await generateImageContent(finalPrompt, [{ base64Data, mimeType }]);
      } else {
        url = await generateImageContent(finalPrompt);
      }

      const compressed = await compressImageForStorage(url, 512, 0.6);
      setCharacterBank(prev => [...prev, compressed]);
      setPrompt("");
      setCharRefImage(null); // Bersihkan referensi setelah generate selesai
    } catch (err) {
      setError(`Gagal membuat karakter: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const removeCharacter = (index) => {
    setCharacterBank(prev => {
      const newBank = [...prev];
      newBank.splice(index, 1);
      return newBank;
    });
  };

  // --- Location Functions ---
  const handleLocRefUpload = (e) => {
    const target = e.target;
    const file = target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setLocError("Ukuran gambar terlalu besar. Maksimal 5MB.");
        target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressed = await compressImageForStorage(reader.result, 512, 0.6);
          setLocRefImage(compressed);
          setLocError(null);
        } catch (err) {
          console.error(err);
          setLocError("Gagal memproses gambar referensi.");
        } finally {
          target.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectLocUpload = (e) => {
    const target = e.target;
    const file = target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setLocError("Ukuran gambar terlalu besar. Maksimal 5MB.");
        target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressed = await compressImageForStorage(reader.result, 800, 0.6);
          setLocationBank(prev => [...prev, compressed]);
          setLocError(null);
        } catch (err) {
          console.error(err);
          setLocError("Gagal memproses gambar lokasi.");
        } finally {
          target.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateLoc = async () => {
    if (!locPrompt.trim()) return;
    setIsGeneratingLoc(true);
    setLocError(null);
    try {
      const fullStyle = formData.style === "Cartoon / Comic Book" && formData.subStyle ? `${formData.style} - ${formData.subStyle}` : formData.style;
      const globalContext = `[Context: ${formData.genre} genre film, Theme: ${formData.idea.substring(0, 100)}, Style: ${fullStyle}] `;
      const styleBooster = getStyleModifiers(formData.style, formData.subStyle);
      const finalPrompt = `[ART STYLE: ${fullStyle}] ` + globalContext + locPrompt.trim() + ", environment concept art, empty environment, no people" + styleBooster + ", 16:9 aspect ratio";
      
      let url;
      if (locRefImage) {
        const base64Data = locRefImage.split(',')[1];
        const mimeType = locRefImage.match(/data:(.*?);/)[1];
        url = await generateImageContent(finalPrompt, [{ base64Data, mimeType }]);
      } else {
        url = await generateImageContent(finalPrompt);
      }
      
      const compressed = await compressImageForStorage(url, 800, 0.6);
      setLocationBank(prev => [...prev, compressed]);
      setLocPrompt("");
      setLocRefImage(null);
    } catch (err) {
      setLocError(`Gagal membuat lokasi: ${err.message}`);
    } finally {
      setIsGeneratingLoc(false);
    }
  };

  const removeLocation = (index) => {
    setLocationBank(prev => {
      const newBank = [...prev];
      newBank.splice(index, 1);
      return newBank;
    });
  };

  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-gray-900 to-gray-950 border border-blue-500/30 rounded-xl shadow-lg relative overflow-hidden break-inside-avoid">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
      
      {/* --- CHARACTER BANK --- */}
      <div className="mb-5">
         <h4 className="text-blue-400 font-bold flex items-center gap-2 text-lg">
           <ImageIcon /> Master Character Bank ({characterBank.length}/6)
         </h4>
         <p className="text-sm text-gray-400 mt-1 leading-relaxed max-w-3xl">
           Tambahkan hingga 6 referensi wajah karakter utama (via teks AI atau upload foto). Anda bisa memilih karakter mana yang ingin dimunculkan di setiap adegan Storyboard di bawah nanti!
         </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
        {characterBank.map((img, index) => (
          <div key={index} className="relative group aspect-square rounded-lg border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)] bg-black overflow-hidden cursor-pointer" onClick={() => setPreviewImage(img)}>
            <img src={img} alt={`Karakter ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm no-print">
              <button onClick={(e) => { e.stopPropagation(); setPreviewImage(img); }} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110" title="Preview Karakter">
                <EyeIcon className="w-4 h-4"/>
              </button>
              <button onClick={(e) => { e.stopPropagation(); removeCharacter(index); }} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110" title="Hapus Karakter">
                <TrashIcon className="w-4 h-4"/>
              </button>
            </div>
            <div className="absolute bottom-1 left-1 bg-black/70 text-xs font-bold text-green-400 px-1.5 rounded pointer-events-none">#{index + 1}</div>
          </div>
        ))}
        
        {Array.from({ length: 6 - characterBank.length }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square border-2 border-dashed border-gray-700/50 rounded-lg flex items-center justify-center bg-gray-900/30">
             <span className="text-xs font-medium text-gray-600 uppercase tracking-widest">Slot {characterBank.length + i + 1}</span>
          </div>
        ))}
      </div>

      {characterBank.length < 6 && (
        <div className="flex flex-col gap-3 bg-gray-900 p-3 rounded-lg border border-gray-800 shadow-inner no-print">
          <div className="flex items-center gap-3">
            {charRefImage && (
              <div className="relative w-12 h-12 rounded overflow-hidden border border-blue-500 shrink-0 shadow-lg">
                <img src={charRefImage} className="w-full h-full object-cover" alt="Ref Karakter" />
                <button onClick={() => setCharRefImage(null)} className="absolute top-0 right-0 bg-red-500/80 hover:bg-red-500 text-white p-0.5 rounded-bl transition-colors" title="Hapus Ref">
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="flex-1 w-full relative flex items-center bg-black border border-gray-700 rounded-md focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Pria Asia 30 tahun, rambut ikal pendek, mata cokelat tajam..."
                className="w-full bg-transparent py-2.5 px-3 pr-10 text-sm text-gray-200 focus:outline-none"
              />
              <label className="absolute right-2 cursor-pointer text-gray-400 hover:text-blue-400 p-1" title="Tambah Gambar Referensi untuk Prompt">
                <PlusIcon className="w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleCharRefUpload} />
              </label>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 border border-purple-500/50 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shrink-0"
            >
              {isGenerating ? <LoaderIcon className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
              Generate AI
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-red-400 text-sm mt-3 font-medium bg-red-900/20 p-2 rounded border border-red-800">{error}</p>}

      {/* --- LOCATION BANK --- */}
      <div className="mb-5 mt-10 pt-8 border-t border-gray-800/80">
         <h4 className="text-emerald-400 font-bold flex items-center gap-2 text-lg">
           <MapPinIcon /> Master Location Bank ({locationBank.length}/4)
         </h4>
         <p className="text-sm text-gray-400 mt-1 leading-relaxed max-w-3xl">
           Tambahkan hingga 4 referensi lokasi. Anda bisa mengetik prompt dan menyertakan foto (*image-to-image*) lalu *Generate*, atau langsung *Upload* latar belakang yang sudah ada.
         </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {locationBank.map((img, index) => (
          <div key={index} className="relative group aspect-video rounded-lg border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-black overflow-hidden cursor-pointer" onClick={() => setPreviewImage(img)}>
            <img src={img} alt={`Lokasi ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm no-print">
              <button onClick={(e) => { e.stopPropagation(); setPreviewImage(img); }} className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110" title="Preview Lokasi">
                <EyeIcon className="w-4 h-4"/>
              </button>
              <button onClick={(e) => { e.stopPropagation(); removeLocation(index); }} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110" title="Hapus Lokasi">
                <TrashIcon className="w-4 h-4"/>
              </button>
            </div>
            <div className="absolute bottom-1 left-1 bg-black/70 text-xs font-bold text-emerald-400 px-1.5 rounded pointer-events-none">L{index + 1}</div>
          </div>
        ))}
        
        {Array.from({ length: 4 - locationBank.length }).map((_, i) => (
          <div key={`empty-loc-${i}`} className="aspect-video border-2 border-dashed border-gray-700/50 rounded-lg flex items-center justify-center bg-gray-900/30">
             <span className="text-xs font-medium text-gray-600 uppercase tracking-widest">Loc {locationBank.length + i + 1}</span>
          </div>
        ))}
      </div>

      {locationBank.length < 4 && (
        <div className="flex flex-col gap-3 bg-gray-900 p-3 rounded-lg border border-gray-800 shadow-inner no-print">
          <div className="flex items-center gap-3">
            {locRefImage && (
              <div className="relative w-12 h-12 rounded overflow-hidden border border-emerald-500 shrink-0 shadow-lg">
                <img src={locRefImage} className="w-full h-full object-cover" alt="Ref" />
                <button onClick={() => setLocRefImage(null)} className="absolute top-0 right-0 bg-red-500/80 hover:bg-red-500 text-white p-0.5 rounded-bl transition-colors" title="Hapus Ref">
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="flex-1 w-full relative flex items-center bg-black border border-gray-700 rounded-md focus-within:border-emerald-500 transition-colors">
              <input
                type="text"
                value={locPrompt}
                onChange={(e) => setLocPrompt(e.target.value)}
                placeholder="Ketik deskripsi lokasi di sini..."
                className="w-full bg-transparent py-2.5 px-3 pr-10 text-sm text-gray-200 focus:outline-none"
              />
              <label className="absolute right-2 cursor-pointer text-gray-400 hover:text-emerald-400 p-1" title="Tambah Gambar Referensi untuk Prompt">
                <PlusIcon className="w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleLocRefUpload} />
              </label>
            </div>
            
            <button
              onClick={handleGenerateLoc}
              disabled={isGeneratingLoc || !locPrompt.trim()}
              className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/50 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shrink-0"
            >
              {isGeneratingLoc ? <LoaderIcon className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
              Generate AI
            </button>
            <span className="text-gray-600 text-xs font-black uppercase tracking-widest hidden xl:block">Atau</span>
            <label className="hidden xl:flex cursor-pointer px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 rounded-md text-sm font-bold text-blue-300 transition-colors items-center justify-center gap-2 shrink-0">
              <UploadIcon className="w-4 h-4" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleDirectLocUpload} />
            </label>
          </div>
          
          {/* Tampilan Mobile untuk Upload Langsung */}
          <div className="xl:hidden flex items-center justify-between border-t border-gray-800 pt-3 mt-2">
             <span className="text-gray-600 text-xs font-black uppercase tracking-widest">Atau</span>
             <label className="cursor-pointer px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 rounded-md text-sm font-bold text-blue-300 transition-colors flex items-center justify-center gap-2 shrink-0 w-1/2">
                <UploadIcon className="w-4 h-4" /> Upload Langsung
                <input type="file" accept="image/*" className="hidden" onChange={handleDirectLocUpload} />
             </label>
          </div>
        </div>
      )}

      {/* NEW: Grid Kartu Saran Lokasi Cerdas dari Section 6 (Lebih Menonjol) */}
      {locSuggestions.length > 0 && (
         <div className="mt-8 pt-6 border-t border-gray-800/80 no-print">
           <h5 className="text-sm text-emerald-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
             <SparklesIcon className="w-4 h-4" /> Referensi Prompt Lokasi (Dari Naskah)
           </h5>
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
             {locSuggestions.map((sug, idx) => {
                // Memisahkan Judul Lokasi dan Deskripsi
                const parts = sug.split(':');
                const title = parts.length > 1 ? parts[0].replace(/\*\*/g, '').trim() : `Lokasi ${idx+1}`;
                const desc = parts.length > 1 ? parts.slice(1).join(':').replace(/\*\*/g, '').trim() : sug.replace(/\*\*/g, '').trim();
                
                return (
                  <div key={`sug-${idx}`} className="bg-black/50 border border-gray-800 rounded-lg p-4 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300 group shadow-lg">
                     <div className="mb-4">
                       <strong className="text-emerald-400 text-[13px] block mb-2 uppercase tracking-wider">{title}</strong>
                       <p className="text-[11px] text-gray-400 line-clamp-4 leading-relaxed" title={desc}>{desc}</p>
                     </div>
                     <button
                        onClick={() => {
                          setLocPrompt(sug);
                        }}
                        className="w-full py-2 bg-gray-800 group-hover:bg-emerald-600/20 text-gray-400 group-hover:text-emerald-400 border border-gray-700 group-hover:border-emerald-500/50 rounded-md text-[10px] font-bold transition-all flex items-center justify-center gap-2"
                     >
                       <PlusIcon className="w-3.5 h-3.5" /> GUNAKAN PROMPT INI
                     </button>
                  </div>
                );
             })}
           </div>
         </div>
      )}

      {locError && <p className="text-red-400 text-sm mt-3 font-medium bg-red-900/20 p-2 rounded border border-red-800">{locError}</p>}
      
      <ImageLightbox 
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage}
        onDownload={() => handleDownloadUpscaled(previewImage, `reference-HD.png`)}
        onDelete={() => {
          let idx = characterBank.indexOf(previewImage);
          if (idx > -1) {
            removeCharacter(idx);
          } else {
            idx = locationBank.indexOf(previewImage);
            if (idx > -1) removeLocation(idx);
          }
          setPreviewImage(null);
        }}
      />
    </div>
  );
};

const SceneStoryboardPanel = ({ content, formData, characterBank, locationBank }) => {
  const sceneNumMatch = content.match(/Scene:\s*(.+)/i);
  const visualMatch = content.match(/Visual:\s*([\s\S]*?)(?=Motion:|Audio:|Info:|$)/i);
  const motionMatch = content.match(/Motion:\s*([\s\S]*?)(?=Audio:|Info:|$)/i);
  const audioMatch = content.match(/Audio:\s*([\s\S]*?)(?=Info:|$)/i);
  const infoMatch = content.match(/Info:\s*([\s\S]*?)$/i);

  const sceneNum = sceneNumMatch ? sceneNumMatch[1].trim() : "X";
  const initialVisual = visualMatch ? visualMatch[1].trim() : "";
  const initialMotion = motionMatch ? motionMatch[1].trim() : "";
  const initialAudio = audioMatch ? audioMatch[1].trim() : "";
  const info = infoMatch ? infoMatch[1].trim() : "";

  const [visualPrompt, setVisualPrompt] = useState(initialVisual);
  const [motionPrompt, setMotionPrompt] = useState(initialMotion);
  const [audioPrompt, setAudioPrompt] = useState(initialAudio);
  
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imgError, setImgError] = useState(null);

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isRewritingAudio, setIsRewritingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [selectedCharIndices, setSelectedCharIndices] = useState([]);
  const [selectedLocIndex, setSelectedLocIndex] = useState(null);
  const charSelectorRef = useRef(null);
  const locSelectorRef = useRef(null);

  let exactRatio = "16 / 9";
  if (formData.aspectRatio?.includes("2.35:1")) exactRatio = "2.35 / 1";
  else if (formData.aspectRatio?.includes("9:16")) exactRatio = "9 / 16";
  else if (formData.aspectRatio?.includes("1:1")) exactRatio = "1 / 1";

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideChar = charSelectorRef.current && !charSelectorRef.current.contains(event.target);
      const isOutsideLoc = locSelectorRef.current && !locSelectorRef.current.contains(event.target);
      
      if (isOutsideChar && isOutsideLoc) {
        const isInputOrButton = event.target.closest('textarea, input, button');
        if (!isInputOrButton) {
          setSelectedCharIndices([]);
          setSelectedLocIndex(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCharSelection = (idx) => {
    setSelectedCharIndices(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleLocSelection = (idx) => {
    setSelectedLocIndex(prev => prev === idx ? null : idx);
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImg(true);
    setImgError(null);
    try {
      const aspectRatio = formData.aspectRatio;
      let ratioInstruction = "";
      if (aspectRatio) {
        if (aspectRatio.includes("16:9")) ratioInstruction = ", 16:9 aspect ratio, widescreen landscape orientation";
        else if (aspectRatio.includes("2.35:1")) ratioInstruction = ", 2.35:1 aspect ratio, ultra-widescreen cinematic orientation";
        else if (aspectRatio.includes("9:16")) ratioInstruction = ", 9:16 aspect ratio, vertical portrait orientation";
        else ratioInstruction = ", 1:1 aspect ratio, square orientation";
      }
      
      const fullStyle = formData.style === "Cartoon / Comic Book" && formData.subStyle ? `${formData.style} - ${formData.subStyle}` : formData.style;
      const globalContext = `[Context: ${formData.genre} genre film, Theme: ${formData.idea.substring(0, 150)}, Style: ${fullStyle}] `;
      const styleBooster = getStyleModifiers(formData.style, formData.subStyle);
      const finalPrompt = `[ART STYLE: ${fullStyle}] ` + globalContext + visualPrompt.trim() + styleBooster + ratioInstruction;
      
      let url;
      const refs = [];
      
      // Ambil Karakter Ref
      selectedCharIndices.forEach(idx => {
        if (characterBank[idx]) {
          const charRefImg = characterBank[idx];
          const base64Data = charRefImg.split(',')[1];
          const mimeType = charRefImg.match(/data:(.*?);/)[1];
          refs.push({ base64Data, mimeType });
        }
      });

      // Ambil Lokasi Ref
      if (selectedLocIndex !== null && locationBank[selectedLocIndex]) {
        const locRefImg = locationBank[selectedLocIndex];
        const base64Data = locRefImg.split(',')[1];
        const mimeType = locRefImg.match(/data:(.*?);/)[1];
        refs.push({ base64Data, mimeType });
      }

      if (refs.length > 0) {
        url = await generateImageContent(finalPrompt, refs);
      } else {
        url = await generateImageContent(finalPrompt);
      }
      
      url = await cropImageToAspectRatio(url, formData.aspectRatio);
      setImageUrl(url);
    } catch (err) {
      setImgError(err.message);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    setAudioError(null);
    try {
      const url = await generateAudioContent(audioPrompt.trim(), formData.voiceStyle);
      setAudioUrl(url);
    } catch (err) {
      if ('speechSynthesis' in window) {
         const utterance = new SpeechSynthesisUtterance(audioPrompt);
         window.speechSynthesis.speak(utterance);
         setAudioError("API AI Voice dibatasi (404). Memainkan suara bawaan browser.");
      } else {
         setAudioError(err.message);
      }
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDeleteAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setAudioUrl(null);
  };

  const handleProcessPrompt = async (mode) => {
    if (!visualPrompt.trim()) return;
    setIsProcessingPrompt(true);
    try {
      const fullStyle = formData.style === "Cartoon / Comic Book" && formData.subStyle ? `${formData.style} - ${formData.subStyle}` : formData.style;
      const newPrompt = await enhanceImagePrompt(visualPrompt, mode, fullStyle);
      setVisualPrompt(newPrompt);
    } catch (err) {
      console.error(err);
      setImgError("Gagal menyempurnakan prompt.");
    } finally {
      setIsProcessingPrompt(false);
    }
  };

  const handleRewriteAudio = async () => {
    if (!audioPrompt.trim()) return;
    setIsRewritingAudio(true);
    setAudioError(null);
    try {
      const newDialogue = await rewriteDialogueText(audioPrompt, formData.genre, formData.idea);
      setAudioPrompt(newDialogue);
    } catch (err) {
      console.error(err);
      setAudioError("Gagal memperbaiki dialog.");
    } finally {
      setIsRewritingAudio(false);
    }
  };

  return (
    <div className="my-8 bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row w-full group relative break-inside-avoid print-flex-col print-card">
      <div className="md:w-5/12 bg-gray-950/40 relative border-b md:border-b-0 md:border-r border-gray-800 flex items-start justify-center p-5">
        <div 
          className="w-full bg-black relative rounded-lg border border-gray-800 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] group"
          style={{ aspectRatio: exactRatio }}
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`Scene ${sceneNum}`} 
              className="w-full h-full object-cover cursor-pointer transition-all duration-500 rounded hover:opacity-80 hover:scale-[1.02]" 
              onClick={() => setIsModalOpen(true)}
              title="Klik untuk memperbesar"
            />
          ) : (
            <div className="text-gray-700 flex flex-col items-center">
               <ImageIcon />
               <span className="text-[10px] mt-2 uppercase tracking-widest font-medium">No Image</span>
            </div>
          )}
          
          <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {selectedCharIndices.length > 0 && (
               <div className="bg-green-500/20 text-green-400 border border-green-500/30 text-[9px] font-bold px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                 Wajah: #{selectedCharIndices.map(i => i + 1).join(', ')}
               </div>
            )}
            {selectedLocIndex !== null && (
               <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                 Lokasi: L{selectedLocIndex + 1}
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:w-7/12 p-5 flex flex-col gap-4 bg-gray-900/50">
        
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="bg-blue-900/50 text-blue-400 font-bold px-3 py-1 rounded text-sm border border-blue-500/20">
              SCENE {sceneNum}
            </span>
            <p className="text-sm text-gray-400 italic line-clamp-2">{info}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 flex-1">
          <div className="flex flex-col gap-2">
            
            {characterBank && characterBank.length > 0 && (
              <div ref={charSelectorRef} className="mb-1 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-700 no-print">
                <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0 mr-2">Wajah:</span>
                {characterBank.map((img, idx) => {
                  const isSelected = selectedCharIndices.includes(idx);
                  return (
                    <img
                      key={idx}
                      src={img}
                      alt={`Char ${idx + 1}`}
                      onClick={() => toggleCharSelection(idx)}
                      className={`w-8 h-8 object-cover rounded-full cursor-pointer border-2 shrink-0 transition-all duration-200 ${
                        isSelected 
                          ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] scale-110' 
                          : 'border-transparent opacity-40 hover:opacity-100 grayscale hover:grayscale-0'
                      }`}
                      title={`Gunakan Wajah Karakter #${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}

            {locationBank && locationBank.length > 0 && (
              <div ref={locSelectorRef} className="mb-1 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 no-print">
                <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0 mr-1.5">Lokasi:</span>
                {locationBank.map((img, idx) => {
                  const isSelected = selectedLocIndex === idx;
                  return (
                    <img
                      key={`loc-${idx}`}
                      src={img}
                      alt={`Loc ${idx + 1}`}
                      onClick={() => toggleLocSelection(idx)}
                      className={`w-12 h-8 object-cover rounded cursor-pointer border-2 shrink-0 transition-all duration-200 ${
                        isSelected 
                          ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] scale-110' 
                          : 'border-transparent opacity-40 hover:opacity-100 grayscale hover:grayscale-0'
                      }`}
                      title={`Gunakan Lokasi L${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}

            <div className="flex justify-between items-center">
              <label className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-2">
                <FilmIcon /> Visual Prompt
              </label>
              <div className="flex gap-3 no-print">
                <button 
                  onClick={() => handleProcessPrompt('reprompt')} 
                  disabled={isProcessingPrompt || !visualPrompt.trim()}
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium disabled:opacity-50 transition-colors"
                >
                  {isProcessingPrompt ? <LoaderIcon className="w-3 h-3" /> : <RefreshIcon className="w-3 h-3" />}
                  Reprompt
                </button>
                <button 
                  onClick={() => handleProcessPrompt('enhance')} 
                  disabled={isProcessingPrompt || !visualPrompt.trim()}
                  className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium disabled:opacity-50 transition-colors"
                >
                  {isProcessingPrompt ? <LoaderIcon className="w-3 h-3" /> : <SparklesIcon className="w-3 h-3" />}
                  Enhance
                </button>
              </div>
            </div>
            <textarea
              value={visualPrompt}
              onChange={(e) => setVisualPrompt(e.target.value)}
              className="w-full bg-black/50 border border-gray-800 rounded text-sm text-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none h-20 transition-all"
            />
            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImg || !visualPrompt.trim()}
              className="w-full py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 hover:text-white border border-blue-500/30 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed no-print"
            >
              {isGeneratingImg ? <><LoaderIcon className="w-4 h-4"/> GENERATING...</> : <><ImageIcon /> GENERATE VISUAL</>}
            </button>
            {imgError && <span className="text-red-400 text-[10px] text-center">{imgError}</span>}
          </div>
          
          <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-gray-800 border-dashed">
             <div className="flex items-center justify-between">
              <label className="text-[10px] text-emerald-500 uppercase font-bold flex items-center gap-2">
                <CameraIcon /> Saran Gerak Video (AI Video Prompt)
              </label>
              <button onClick={() => { fallbackCopyTextToClipboard(motionPrompt); }} className="text-gray-500 hover:text-emerald-400 no-print" title="Copy Motion Prompt"><CopyIcon className="w-3.5 h-3.5" /></button>
            </div>
            <textarea
              value={motionPrompt}
              onChange={(e) => setMotionPrompt(e.target.value)}
              className="w-full bg-emerald-950/10 border border-emerald-900/30 rounded text-xs text-gray-300 p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none h-14 transition-all"
              placeholder="Contoh: Slow pan to right, cinematic lighting..."
            />
          </div>

          <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-gray-800 border-dashed">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-2">
                <VolumeIcon /> Audio / Voice Over
              </label>
              <div className="no-print">
                <button 
                  onClick={handleRewriteAudio} 
                  disabled={isRewritingAudio || !audioPrompt.trim()}
                  className="text-[10px] text-yellow-400 hover:text-yellow-300 flex items-center gap-1 font-medium disabled:opacity-50 transition-colors"
                  title="Perbaiki dialog/narasi agar lebih sinematik dengan AI"
                >
                  {isRewritingAudio ? <LoaderIcon className="w-3 h-3" /> : <SparklesIcon className="w-3 h-3" />}
                  Script Doctor ✨
                </button>
              </div>
            </div>
            <textarea
              value={audioPrompt}
              onChange={(e) => setAudioPrompt(e.target.value)}
              className="w-full bg-black/50 border border-gray-800 rounded text-sm text-gray-300 p-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none h-16 transition-all"
              placeholder="Masukkan teks dialog atau narasi di sini..."
            />
            <button
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio || !audioPrompt.trim()}
              className="w-full py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/40 hover:text-white border border-purple-500/30 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed no-print"
            >
              {isGeneratingAudio ? <><LoaderIcon className="w-4 h-4"/> GENERATING VOICE...</> : <><VolumeIcon /> GENERATE AUDIO</>}
            </button>
            {audioError && <span className="text-red-400 text-[10px] text-center">{audioError}</span>}
            
            {audioUrl && (
              <div className="mt-2 p-2.5 bg-black/60 border border-gray-800 rounded-lg flex items-center justify-between gap-3 shadow-inner no-print">
                <button 
                  onClick={toggleAudio} 
                  className={`flex-shrink-0 p-2 rounded-full transition-colors ${isPlaying ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                  title={isPlaying ? "Stop Audio" : "Play Audio"}
                >
                  {isPlaying ? <SquareIcon className="w-3.5 h-3.5"/> : <PlayIcon className="w-3.5 h-3.5"/>}
                </button>
                
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <ActivityIcon className={`w-4 h-4 flex-shrink-0 transition-colors duration-300 ${isPlaying ? 'text-green-400 animate-pulse' : 'text-gray-600'}`} />
                  <span className="text-[10px] font-mono text-gray-400 truncate">
                    {isPlaying ? 'Memutar audio...' : `scene-${sceneNum}-voiceover.wav`}
                  </span>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button 
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = audioUrl;
                        link.download = `scene-${sceneNum}-voiceover.wav`;
                        link.click();
                    }} 
                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors" 
                    title="Download Audio"
                  >
                    <DownloadIcon className="w-4 h-4"/>
                  </button>
                  <button 
                    onClick={handleDeleteAudio} 
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors" 
                    title="Hapus Audio"
                  >
                    <TrashIcon className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            )}

            {audioUrl && (
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onEnded={() => setIsPlaying(false)} 
                className="hidden" 
              />
            )}
          </div>
        </div>
      </div>

      <ImageLightbox 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={imageUrl}
        onDownload={() => handleDownloadUpscaled(imageUrl, `scene-${sceneNum}-HD.png`)}
        onDelete={() => setImageUrl(null)}
        onRegenerate={handleGenerateImage}
        isGenerating={isGeneratingImg}
      />
    </div>
  );
};

const renderContentWithWidgets = (text, formData, characterBank, setCharacterBank, locationBank, setLocationBank, sections) => {
  if (!text) return null;

  if (text.includes('[CHARACTER]')) {
     return <CharacterCardsWidget text={text} />;
  }
  
  const tagRegex = /\[(STORYBOARD_HEADER|SCENE_BOARD)\]([\s\S]*?)\[\/\1\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = tagRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'markdown', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: match[1], content: match[2].trim() });
    lastIndex = tagRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'markdown', content: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return <div dangerouslySetInnerHTML={renderMarkdown(text)} />;
  }

  return parts.map((part, index) => {
    if (part.type === 'markdown') {
      return <div key={index} dangerouslySetInnerHTML={renderMarkdown(part.content)} />;
    } else if (part.type === 'STORYBOARD_HEADER') {
      return <StoryboardHeaderWidget key={index} characterBank={characterBank} setCharacterBank={setCharacterBank} locationBank={locationBank} setLocationBank={setLocationBank} formData={formData} sections={sections} />;
    } else if (part.type === 'SCENE_BOARD') {
      return <SceneStoryboardPanel key={index} content={part.content} formData={formData} characterBank={characterBank} locationBank={locationBank} />;
    }
    return null;
  });
};

export default function App() {
  const [formData, setFormData] = useState({
    idea: '',
    language: 'Indonesia',
    genre: 'Sci-Fi / Cyberpunk',
    style: 'Cinematic Realistic',
    subStyle: 'Detail',
    duration: 'Short Film (15-20 min)',
    scenes: 20,
    location: '',
    timePeriod: '',
    platform: 'YouTube',
    aspectRatio: '16:9 (Standard)',
    voiceStyle: 'Narator Film Epik (Deep Voice)'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [sections, setSections] = useState([]);
  const outputRef = useRef(null);
  
  const [characterBank, setCharacterBank] = useState([]);
  const [locationBank, setLocationBank] = useState([]);

  // --- CLOUD STORAGE STATE ---
  const [user, setUser] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null); 
  
  // NEW: Initial App Booting Screen State
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Ubah Tab Title agar tidak lagi "React App" atau "CodeSandbox"
    document.title = "AI Film Studio Ultimate";

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Memberikan jeda elegan sebelum splash screen hilang (1.5 detik)
      setTimeout(() => setIsAppReady(true), 1500);
    });
    
    // Load html2pdf dynamically for PDF export
    if (!document.getElementById('html2pdf-script')) {
      const script = document.createElement('script');
      script.id = 'html2pdf-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const projectsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'projects');
    
    const unsubscribe = onSnapshot(projectsRef, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      projects.sort((a, b) => b.createdAt - a.createdAt); 
      setSavedProjects(projects);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProject = async () => {
    if (!user || sections.length === 0) return;
    setIsSaving(true);
    try {
      const projectId = crypto.randomUUID();
      const projectRef = doc(db, 'artifacts', appId, 'users', user.uid, 'projects', projectId);
      await setDoc(projectRef, {
        createdAt: Date.now(),
        title: formData.idea.substring(0, 50) + (formData.idea.length > 50 ? '...' : ''),
        formData,
        sections,
        characterBank, 
        locationBank   
      });
      showToast("Proyek berhasil disimpan ke Cloud!");
    } catch (err) {
      console.error("Save error", err);
      if (err.message && err.message.includes('1048487 bytes')) {
        showToast("Gagal menyimpan: Total ukuran gambar melebihi batas (1MB). Hapus beberapa gambar.", "error");
      } else {
        showToast("Gagal menyimpan proyek.", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadProject = (project) => {
    setFormData(project.formData);
    setSections(project.sections);
    setCharacterBank(project.characterBank || []); 
    setLocationBank(project.locationBank || []); 
    setShowProjectsModal(false);
    showToast("Proyek berhasil dimuat!");
  };

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'projects', projectId));
      showToast("Proyek dihapus.");
    } catch (err) {
      console.error("Delete error", err);
      showToast("Gagal menghapus proyek.", "error");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const parseXMLResponse = (xmlString) => {
    try {
      const sectionRegex = /<section\s+id="([^"]+)"\s+title="([^"]+)">\s*<content>([\s\S]*?)<\/content>\s*<\/section>/gi;
      const parsedSections = [];
      let match;
      
      while ((match = sectionRegex.exec(xmlString)) !== null) {
        parsedSections.push({
          id: match[1],
          title: match[2],
          content: match[3].trim()
        });
      }
      
      if (parsedSections.length === 0) {
          return [{ id: '1', title: 'RAW OUTPUT', content: xmlString }];
      }
      
      return parsedSections;
    } catch (e) {
      return [{ id: 'error', title: 'Parsing Error', content: xmlString }];
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setSections([]);
    setCharacterBank([]); 
    setLocationBank([]);

    try {
      const rawOutput = await generateFilmPipeline(formData);
      const parsed = parseXMLResponse(rawOutput);
      setSections(parsed);
      
      setTimeout(() => {
        if (window.innerWidth < 1024 && outputRef.current) {
          outputRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);

    } catch (err) {
      setError(err.message || "Gagal menghasilkan pipeline. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = sections.map(s => `=== ${s.title} ===\n\n${s.content}\n\n`).join('');
    fallbackCopyTextToClipboard(textToCopy);
    showToast("Berhasil disalin ke clipboard!");
  };

  const handleExportPDF = () => {
    if (typeof window.html2pdf !== 'undefined') {
      showToast("Memproses PDF dalam Tema Terang... Mohon tunggu sebentar.", "success");
      
      document.body.classList.add('pdf-export-mode');
      
      const element = document.getElementById('export-container');
      const fileName = `Film_Studio_Pipeline_${formData.idea.substring(0, 15).replace(/[^a-zA-Z0-9]/g, '_') || 'Project'}.pdf`;

      const opt = {
        margin:       [10, 10, 10, 10],
        filename:     fileName,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, backgroundColor: '#ffffff', useCORS: true, windowWidth: 1024 }, 
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      window.html2pdf().set(opt).from(element).save().then(() => {
        document.body.classList.remove('pdf-export-mode');
        showToast("Berhasil mengunduh dokumen PDF!", "success");
      }).catch(err => {
        console.error("PDF Export Error:", err);
        document.body.classList.remove('pdf-export-mode');
        showToast("Gagal mengunduh PDF, mencoba mode cetak...", "error");
        setTimeout(() => window.print(), 1000);
      });
      
    } else {
      showToast("Pilih 'Save as PDF' (Simpan sebagai PDF) di menu Printer.", "success");
      setTimeout(() => window.print(), 1000);
    }
  };

  // NEW: Cinematic Full Screen Loading Splash
  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white selection:bg-blue-500/30 overflow-hidden relative">
        {/* Latar Belakang Cahaya Sinematik */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        <div className="relative flex flex-col items-center z-10 w-full px-6">
           <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 bg-blue-500/20 blur-[30px] rounded-full"></div>
              <FilmIcon className="w-16 h-16 text-blue-500 relative z-10" />
           </div>
           
           <h1 className="text-3xl md:text-5xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 mb-6 text-center" style={{ animation: 'fadeInUp 1s ease-out forwards' }}>
              AI FILM STUDIO
           </h1>
           
           <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.4em] mb-12 animate-pulse text-center">
              Loading Cinematic Core...
           </p>
           
           <div className="w-64 max-w-full h-1 bg-gray-900 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 w-1/2 absolute top-0 left-0 rounded-full" style={{ animation: 'slideRight 1.5s infinite ease-in-out' }}></div>
           </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideRight {
            0% { left: -50%; }
            100% { left: 100%; }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-blue-500/30">
      {/* HEADER */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <FilmIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">AI FILM STUDIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">ULTIMATE</span></h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Cinematic Production Pipeline Generator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowProjectsModal(true)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-md text-sm font-medium text-gray-300 transition-colors flex items-center gap-2"
            >
              <FolderIcon /> <span className="hidden sm:inline">My Projects</span>
            </button>
            <button 
              onClick={handleSaveProject}
              disabled={sections.length === 0 || isSaving}
              className="px-4 py-2 bg-blue-600 border border-blue-500 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-bold text-white transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(37,99,235,0.2)]"
            >
              {isSaving ? <LoaderIcon className="w-5 h-5"/> : <SaveIcon />}
              <span className="hidden sm:inline">Save to Cloud</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN - INPUT FORM */}
        <div className="lg:w-1/3 xl:w-1/4 shrink-0 no-print">
          <div className="bg-gray-950 border border-gray-800 p-6 rounded-xl shadow-2xl sticky top-28">
            <h2 className="text-lg font-semibold text-white mb-6 border-b border-gray-800 pb-2 flex items-center gap-2">
              <WandIcon /> Setup Proyek
            </h2>
            
            <div className="space-y-1">
              <div className="mb-4">
                <label htmlFor="idea" className="block text-sm font-medium text-gray-400 mb-1 tracking-wide uppercase text-xs">
                  Story Idea / Premise
                </label>
                <textarea
                  id="idea"
                  rows="4"
                  value={formData.idea}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-800 rounded-md py-2 px-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none text-sm"
                  placeholder="Contoh: Seorang detektif swasta di Jakarta masa depan yang menemukan bahwa ingatannya sendiri adalah barang bukti pembunuhan berantai."
                ></textarea>
              </div>

              <SelectField 
                label="Bahasa" 
                id="language" 
                value={formData.language} 
                onChange={handleChange} 
                options={[
                  "Indonesia",
                  "English",
                  "Jepang (Japanese)",
                  "Korea (Korean)",
                  "Mandarin (Chinese)",
                  "Spanyol (Spanish)",
                  "Prancis (French)",
                  "Jerman (German)"
                ]} 
              />

              <SelectField 
                label="Genre" 
                id="genre" 
                value={formData.genre} 
                onChange={handleChange} 
                options={[
                  "Sci-Fi / Cyberpunk",
                  "Action / Adventure",
                  "Horror / Thriller",
                  "Drama / Romance",
                  "Comedy / Satire",
                  "Fantasy / Magic Realism",
                  "Neo-Noir / Mystery",
                  "Historical / Epic",
                  "Psychological Thriller",
                  "Crime / Heist",
                  "Post-Apocalyptic",
                  "Documentary Style"
                ]} 
              />

              {/* NEW: Gaya Visual Selector */}
              <SelectField 
                label="Gaya Visual (Art Style)" 
                id="style" 
                value={formData.style} 
                onChange={handleChange} 
                options={[
                  "Cinematic Realistic",
                  "Pixar / Disney 3D",
                  "Disney 2D Classic",
                  "Studio Ghibli",
                  "Anime / Manga",
                  "Cartoon / Comic Book",
                  "Claymation / Plasticine",
                  "Watercolor / Painted",
                  "Cyberpunk / Neon Synth",
                  "Vintage Photography"
                ]} 
              />
              
              {/* NEW: Sub-Gaya Cartoon */}
              {formData.style === "Cartoon / Comic Book" && (
                <div className="pl-4 border-l-2 border-blue-500/50 mb-4 animate-fade-in">
                  <SelectField 
                    label="Sub-Gaya Cartoon" 
                    id="subStyle" 
                    value={formData.subStyle || 'Detail'} 
                    onChange={handleChange} 
                    options={[
                      "Minimal",
                      "Detail",
                      "Realistis",
                      "Dilebih-lebihkan (Exaggerated)"
                    ]} 
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Durasi" id="duration" value={formData.duration} onChange={handleChange} options={["TikTok/Reels (< 1 min)", "Short Film (1-5 min)", "Short Film (5-20 min)", "Feature Length (90+ min)"]} />
                <InputField label="Estimasi Scene" id="scenes" type="number" value={formData.scenes} onChange={handleChange} placeholder="Contoh: 20" />
              </div>

              <InputField 
                label={<>Lokasi Setting <span className="text-gray-600 normal-case ml-1 font-normal">(Optional)</span></>} 
                id="location" 
                value={formData.location} 
                onChange={handleChange} 
                placeholder="Contoh: Jakarta 2085, Hutan Amazon..."
              />
              <InputField 
                label={<>Periode Waktu <span className="text-gray-600 normal-case ml-1 font-normal">(Optional)</span></>} 
                id="timePeriod" 
                value={formData.timePeriod} 
                onChange={handleChange} 
                placeholder="Contoh: Masa Depan Distopia, Era 90an..."
              />
              
              <SelectField label="Target Platform" id="platform" value={formData.platform} onChange={handleChange} options={["YouTube", "TikTok", "Instagram Reels", "AI Cinema Festival", "Netflix / VOD"]} />
              
              <SelectField 
                label="Karakter Voice Over" 
                id="voiceStyle" 
                value={formData.voiceStyle} 
                onChange={handleChange} 
                options={[
                  "Narator Film Epik (Deep Voice)",
                  "Pria - Suara Berat & Misterius",
                  "Pria - Ringan & Kasual",
                  "Wanita - Lembut & Tenang",
                  "Wanita - Tegas & Berwibawa",
                  "Anak-anak - Polos & Riang",
                  "Anak-anak - Sedih & Penakut",
                  "Bapak-bapak - Bijaksana & Tua",
                  "Ibu-ibu - Hangat & Keibuan",
                  "Penyiar Berita / Reporter - Formal",
                  "MC / Pembawa Acara - Energik",
                  "Suara Sedih / Dramatis",
                  "Suara Riang / Ceria"
                ]} 
              />
              
              <AspectRatioSelector id="aspectRatio" value={formData.aspectRatio} onChange={handleChange} />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`mt-8 w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all flex justify-center items-center gap-2 ${isGenerating ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]'}`}
            >
              {isGenerating ? (
                <><LoaderIcon className="w-5 h-5"/> MENGANALISA & MEMBUAT...</>
              ) : (
                <>GENERATE PIPELINE</>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-800 text-red-300 rounded text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - OUTPUT AREA */}
        <div className="lg:w-2/3 xl:w-3/4 print-expand" ref={outputRef}>
          {sections.length === 0 && !isGenerating && (
            <div className="h-full min-h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-xl bg-gray-950/50 text-gray-500 p-8 text-center no-print">
              <FilmIcon />
              <h3 className="mt-4 text-xl font-medium text-gray-400">Menunggu Input Proyek</h3>
              <p className="mt-2 text-sm max-w-md">Isi form di sebelah kiri dan klik Generate untuk menghasilkan dokumen pipeline produksi film komprehensif berteknologi AI.</p>
            </div>
          )}

          {isGenerating && (
             <div className="h-full min-h-[60vh] flex flex-col items-center justify-center border border-gray-800 rounded-xl bg-gray-950 p-8 text-center no-print">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]"></div>
                <h3 className="text-2xl font-bold text-white animate-pulse">Menghasilkan Mahakarya...</h3>
                <p className="mt-2 text-blue-400 text-sm">AI sedang menulis skenario, mendesain storyboard, dan merancang pengaturan visual. Proses ini memakan waktu sekitar 15-30 detik.</p>
             </div>
          )}

          {sections.length > 0 && !isGenerating && (
            <div id="export-container" className="space-y-6 bg-black sm:bg-transparent rounded-xl">
              
              {/* Output Actions Header */}
              <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Production Document</h2>
                  <p className="text-sm text-gray-400 mt-1">Generated by AI Film Studio</p>
                </div>
                <div className="flex gap-2 no-print">
                  <button onClick={handleExportPDF} className="p-2 bg-emerald-900/30 hover:bg-emerald-800/50 border border-emerald-700/50 rounded text-emerald-300 transition-colors flex items-center gap-2 text-sm font-medium shadow-inner" title="Save / Export as PDF">
                    <PdfIcon /> <span className="hidden sm:inline">Export PDF</span>
                  </button>
                  <button onClick={handleCopy} className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded text-gray-300 transition-colors flex items-center gap-2 text-sm font-medium" title="Copy to Clipboard">
                    <CopyIcon /> <span className="hidden sm:inline">Copy All</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 print-grid-block">
                {sections.map((section, index) => {
                  // Menghapus '6' dan 'LOCATION' dari isWideContent agar bisa berdampingan dengan section 5
                  const isWideContent = ['1', '2', '7', '8', '15'].includes(section.id) || 
                                        section.title.includes('CONCEPT') ||
                                        section.title.includes('SCRIPT') || 
                                        section.title.includes('STORYBOARD') || 
                                        section.title.includes('SHOT LIST') || 
                                        section.title.includes('CHARACTER');

                  return (
                    <div 
                      key={section.id} 
                      className={`bg-gray-950 border border-gray-800 rounded-xl shadow-lg flex flex-col group transition-all duration-300 hover:border-gray-600 hover:shadow-2xl print-card break-inside-avoid ${isWideContent ? '2xl:col-span-2 print-col-span-2' : 'col-span-1'}`}
                    >
                      <div className="bg-gray-900/50 border-b border-gray-800 px-6 py-4 flex items-center gap-3 shrink-0 print-header">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 font-mono text-sm border border-blue-500/20 shadow-inner">
                          {index + 1}
                        </span>
                        <h3 className="text-lg font-bold tracking-wide text-gray-100 uppercase">{section.title}</h3>
                      </div>
                      
                      <div className="p-6 flex-1 overflow-x-auto prose prose-invert max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-blue-300 prose-a:text-blue-400 prose-table:w-full prose-td:border prose-td:border-gray-800 prose-th:border prose-th:border-gray-800 prose-th:bg-gray-900 prose-th:text-gray-400 print-prose">
                        {renderContentWithWidgets(section.content, formData, characterBank, setCharacterBank, locationBank, setLocationBank, sections)}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-8 text-center text-sm text-gray-600 border-t border-gray-800 mt-8 break-before-avoid">
                End of Document. 
              </div>
            </div>
          )}
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 no-print">
          <div className={`px-6 py-3 rounded-lg shadow-2xl border flex items-center gap-3 font-medium text-sm backdrop-blur-md transition-all duration-300
            ${toast.type === 'error' ? 'bg-red-950/80 border-red-800 text-red-200' : 'bg-green-950/80 border-green-800 text-green-200'}
          `}>
            {toast.message}
          </div>
        </div>
      )}

      {showProjectsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
          <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FolderIcon /> Proyek Tersimpan</h2>
              <button onClick={() => setShowProjectsModal(false)} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {!user ? (
                <p className="text-center text-gray-500 my-8">Menghubungkan ke Cloud...</p>
              ) : savedProjects.length === 0 ? (
                <div className="text-center text-gray-500 my-12 flex flex-col items-center">
                  <FolderIcon />
                  <p className="mt-4">Belum ada proyek yang disimpan.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {savedProjects.map((project) => (
                    <div key={project.id} className="group relative bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-lg p-4 transition-all hover:bg-gray-900/80 cursor-pointer flex justify-between items-center" onClick={() => handleLoadProject(project)}>
                      <div>
                        <h4 className="text-gray-200 font-semibold mb-1">"{project.title}"</h4>
                        <div className="flex gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FilmIcon /> {project.formData.genre}</span>
                          <span>•</span>
                          <span>{new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Hapus Proyek"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .prose table { border-collapse: collapse; width: 100%; margin-top: 1em; margin-bottom: 1em; }
        .prose th, .prose td { border: 1px solid #374151; padding: 0.75rem; text-align: left; }
        .prose th { background-color: #111827; color: #9CA3AF; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
        .prose tr:nth-child(even) { background-color: rgba(31, 41, 55, 0.3); }
        .prose p { margin-bottom: 1rem; line-height: 1.6; }
        .prose h3 { margin-top: 1.5rem; margin-bottom: 0.5rem; color: #93C5FD; font-size: 1.25rem; font-weight: 700; }
        .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #D1D5DB; }
        .prose li { margin-bottom: 0.25rem; }

        /* --- PDF EXPORT & PRINT MODE: LIGHT THEME & LINEAR LAYOUT --- */
        .pdf-export-mode .no-print, @media print {
          .no-print { display: none !important; }
        }

        .pdf-export-mode *, @media print * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .pdf-export-mode, @media print {
          body { background-color: #ffffff !important; color: #000000 !important; }
          #export-container { background-color: #ffffff !important; }
          
          /* Memaksa layout kolom menjadi 1 baris vertikal agar tidak ada ruang kosong */
          .print-grid-block { display: block !important; }
          
          /* Memaksa panel storyboard menumpuk vertikal (gambar di atas, teks di bawah) */
          .print-flex-col { flex-direction: column !important; display: flex !important; }
          .print-flex-col > div { width: 100% !important; max-width: 100% !important; border-right: none !important; }
          
          /* Gaya Kartu Putih Bersih */
          .print-card { 
            border: 1px solid #cbd5e1 !important; 
            background-color: #ffffff !important; 
            margin-bottom: 24px !important; 
            page-break-inside: avoid; 
            break-inside: avoid;
            box-shadow: none !important;
            display: block !important;
            width: 100% !important;
          }
          
          /* Mengubah Header menjadi Putih Terang */
          .print-header {
            background-color: #f8fafc !important;
            border-bottom: 1px solid #cbd5e1 !important;
          }
          .print-header h3 { color: #0f172a !important; }
          .print-header span { background-color: #e0e7ff !important; color: #1d4ed8 !important; border-color: #bfdbfe !important; }

          /* Mengubah Warna Teks Menjadi Gelap */
          .text-white, .text-gray-100, .text-gray-200, .text-gray-300, .text-gray-400 { color: #1e293b !important; }
          h1, h2, h3, h4, strong { color: #0f172a !important; }
          
          /* Membatalkan Warna Background Gelap Bawaan */
          .bg-gray-900, .bg-black, .bg-gray-950, .bg-gray-950\\/40, .bg-gray-900\\/50 { background-color: #ffffff !important; background-image: none !important; }
          .border-gray-800, .border-gray-700 { border-color: #e2e8f0 !important; }
          
          /* Mengubah Input/Textarea menjadi Terang */
          textarea, input { 
            background-color: #f8fafc !important; 
            color: #0f172a !important; 
            border: 1px solid #cbd5e1 !important; 
          }

          /* Menyesuaikan Warna Biru/Hijau agar lebih kontras di latar putih */
          .text-blue-400 { color: #2563eb !important; }
          .text-emerald-400 { color: #059669 !important; }
          .text-purple-400 { color: #7c3aed !important; }
          .text-green-400 { color: #16a34a !important; }
          .text-yellow-400 { color: #d97706 !important; }
          .text-red-400 { color: #dc2626 !important; }
          .bg-blue-900\\/50 { background-color: #dbeafe !important; border-color: #bfdbfe !important;}
          
          /* Tabel Terang */
          table { border-color: #cbd5e1 !important; color: #1e293b !important; }
          thead, th { background-color: #f1f5f9 !important; color: #0f172a !important; border-color: #cbd5e1 !important; }
          td, tr { border-color: #cbd5e1 !important; }
          tbody tr:nth-child(even) { background-color: #f8fafc !important; }
          
          /* Memastikan Lebar Kertas Penuh */
          .print-expand { width: 100% !important; max-width: 100% !important; margin: 0 !important; }
          main { display: block !important; padding: 0 !important; }
        }

        @media print {
          ::-webkit-scrollbar { display: none; }
        }
      `}} />
    </div>
  );
}
