'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { downloadAsImage } from '@/lib/downloadImage';

export default function AnnouncementAgent() {
  const [mounted, setMounted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [language, setLanguage] = useState<'en-US' | 'hi-IN' | 'ur-PK'>('en-US');
  const [formData, setFormData] = useState({
    event: '',
    date: '',
    topic: '',
    result: ''
  });
  const [status, setStatus] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  // Hydration fix
  useEffect(() => { setMounted(true); }, []);

  const getLangLabel = () => {
    switch(language) {
      case 'en-US': return '🇬🇧 EN';
      case 'hi-IN': return '🇮🇳 HI';
      case 'ur-PK': return '🇵🇰 UR';
    }
  };

  const cycleLang = () => {
    const langs: Array<'en-US' | 'hi-IN' | 'ur-PK'> = ['en-US', 'hi-IN', 'ur-PK'];
    const idx = langs.indexOf(language);
    setLanguage(langs[(idx + 1) % 3]);
  };

  // 1. Voice-to-Text
  const startListening = (field: 'event' | 'topic') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser doesn't support Voice. Use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, [field]: transcript }));
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  // 2. AI Generation
  const generateAnnouncement = async () => {
    if (!formData.event) {
      setStatus('Please enter an event name');
      return;
    }
    setIsGenerating(true);
    setStatus('');

    try {
      const response = await fetch('/api/generate-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: formData.event,
          dateTime: formData.date,
          topic: formData.topic,
        }),
      });

      const data = await response.json();
      if (data.success && data.announcement) {
        setFormData(prev => ({ ...prev, result: data.announcement }));
        setStatus('Announcement generated!');
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      // Professional Template Fallback
      const fallback = `📢 *SMIT ANNOUNCEMENT* 📢\n\n🎯 *${formData.event.toUpperCase()}*\n\n📅 *Date:* ${formData.date || 'To be announced'}\n\n📝 *Details:* \n${formData.topic || 'Important session for all students.'}\n\n_________________________\n\n✅ Don't miss this opportunity!\n📍 Visit your nearest SMIT campus\n\n🏛️ *Saylani Mass IT Training*\n🌐 saylaniwelfare.com/smit\n📞 Helpline: 0800-786-786\n\n#SMIT #SaylaniWelfare #ITTraining`;
      setFormData(prev => ({ ...prev, result: fallback }));
      setStatus('Generated with SMIT Template');
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. VOICE LOGIC: SIRF MAIN PART BOLEGA
  const speakAnnouncement = () => {
    if (!formData.result) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Yahan humne footer aur links ko filter kar diya hai
    const mainMessage = `Attention SMIT Students. Regarding ${formData.event}. ${formData.topic || ''}. Please check the announcement for timings and venue. Thank you.`;

    const utterance = new SpeechSynthesisUtterance(mainMessage);
    utterance.rate = 0.9;
    utterance.lang = language;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      await downloadAsImage(cardRef.current, `smit-announcement-${Date.now()}.png`);
      setStatus('Image downloaded!');
    }
  };

  const shareWhatsApp = () => {
    if (!formData.result) return;
    const encoded = encodeURIComponent(formData.result);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const copyText = async () => {
    if (!formData.result) return;
    await navigator.clipboard.writeText(formData.result);
    setStatus('Copied to clipboard!');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white py-4 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-full"><Image src="/smit-logo.svg" alt="SMIT" width={40} height={40} /></div>
            <h1 className="text-xl font-bold">SMIT Assistant</h1>
          </Link>
          <nav className="flex gap-4"><Link href="/">Home</Link><Link href="/chat">FAQ Chat</Link></nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT: INPUT */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">✏️ Announcement Details</h3>
              <button onClick={cycleLang} className="text-xs bg-gray-100 p-2 rounded-lg">{getLangLabel()} ↻</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1">Event Name</label>
                <div className="flex gap-2">
                  <input className="flex-1 p-3 border rounded-xl text-gray-900 bg-white" value={formData.event} onChange={(e)=>setFormData({...formData, event: e.target.value})} placeholder="e.g. Python Final Exam" />
                  <button onClick={()=>startListening('event')} className={`p-3 rounded-xl ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-[#0066cc]'} text-white`}>🎤</button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1">Date/Time</label>
                <input className="w-full p-3 border rounded-xl text-gray-900 bg-white" value={formData.date} onChange={(e)=>setFormData({...formData, date: e.target.value})} placeholder="e.g. 15th March, 10 AM" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1">Details</label>
                <div className="flex gap-2">
                  <textarea className="flex-1 p-3 border rounded-xl text-gray-900 bg-white" rows={3} value={formData.topic} onChange={(e)=>setFormData({...formData, topic: e.target.value})} placeholder="Describe the event..." />
                  <button onClick={()=>startListening('topic')} className={`p-3 rounded-xl self-start ${isRecording ? 'bg-red-500' : 'bg-[#0066cc]'} text-white`}>🎤</button>
                </div>
              </div>

              <button onClick={generateAnnouncement} disabled={isGenerating} className="w-full bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white p-4 rounded-xl font-bold shadow-lg">
                {isGenerating ? '⌛ Generating...' : '✨ Generate Post'}
              </button>
              {status && <p className="text-center text-xs text-[#0066cc] font-bold">{status}</p>}
            </div>
          </div>

          {/* RIGHT: PREVIEW & VOICE */}
          <div className="space-y-6">
            <div ref={cardRef} className="bg-white rounded-2xl shadow-xl border-t-8 border-[#8cc63f] overflow-hidden">
              <div className="p-6">
                {formData.result ? (
                  <pre className="whitespace-pre-wrap text-gray-900 font-sans text-sm leading-relaxed">{formData.result}</pre>
                ) : (
                  <div className="text-center py-20 text-gray-400">Preview will appear here...</div>
                )}
              </div>
            </div>

            {formData.result && (
              <div className="grid gap-3">
                <button onClick={speakAnnouncement} className={`p-4 rounded-xl font-bold flex items-center justify-center gap-2 ${isSpeaking ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'}`}>
                  {isSpeaking ? '⏹️ Stop Voice' : '🔊 Listen Main Announcement'}
                </button>
                <div className="flex gap-2">
                  <button onClick={handleDownload} className="flex-1 p-3 bg-[#0066cc] text-white rounded-xl font-bold">📥 Image</button>
                  <button onClick={shareWhatsApp} className="flex-1 p-3 bg-[#25D366] text-white rounded-xl font-bold">📱 WhatsApp</button>
                  <button onClick={copyText} className="p-3 border rounded-xl bg-white">📋</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}