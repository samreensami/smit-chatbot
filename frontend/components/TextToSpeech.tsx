/**
 * SMIT AI Assistant - Text-to-Speech Component
 * =============================================
 *
 * Reads out announcements using Web Speech API Synthesis.
 * Supports English and Urdu-style pronunciation.
 *
 * @author SMIT Development Team
 */

"use client";

import { useState, useEffect, useCallback } from "react";

interface TextToSpeechProps {
  text: string;
  className?: string;
}

export default function TextToSpeech({ text, className = "" }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("default");

  // Check for Speech Synthesis support
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  /**
   * Clean text for speech (remove emojis, format for reading)
   */
  const cleanTextForSpeech = (rawText: string): string => {
    return rawText
      // Remove emojis
      .replace(/[\u{1F600}-\u{1F6FF}]/gu, "")
      .replace(/[\u{2600}-\u{26FF}]/gu, "")
      .replace(/[\u{2700}-\u{27BF}]/gu, "")
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "")
      // Remove special characters
      .replace(/[━─│┃▪▫◆◇○●]/g, "")
      .replace(/[*_#]/g, "")
      // Clean up whitespace
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
  };

  /**
   * Start speaking the text
   */
  const speak = useCallback(() => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech(text));

    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // Find best voice (prefer English or Hindi for Roman Urdu)
    if (selectedVoice !== "default" && voices.length > 0) {
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    } else {
      // Auto-select best voice
      const preferredVoice = voices.find(
        (v) => v.lang.includes("en") && v.name.includes("Google")
      ) || voices.find((v) => v.lang.includes("en"));
      if (preferredVoice) utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [text, isSupported, selectedVoice, voices]);

  /**
   * Pause/Resume speech
   */
  const togglePause = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  /**
   * Stop speaking
   */
  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  if (!isSupported) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-400 rounded-xl cursor-not-allowed"
        title="Text-to-speech not supported"
      >
        <span>🔇</span>
        <span>Voice not supported</span>
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!isSpeaking ? (
        /* Play Button */
        <button
          type="button"
          onClick={speak}
          disabled={!text}
          className="flex items-center gap-2 px-4 py-3 bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white rounded-xl font-medium hover:opacity-90 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          title="Read announcement aloud"
        >
          <span className="text-lg">🔊</span>
          <span>Play Voice</span>
        </button>
      ) : (
        /* Controls when speaking */
        <div className="flex items-center gap-2">
          {/* Pause/Resume Button */}
          <button
            type="button"
            onClick={togglePause}
            className="flex items-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition shadow-md"
            title={isPaused ? "Resume" : "Pause"}
          >
            <span className="text-lg">{isPaused ? "▶️" : "⏸️"}</span>
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>

          {/* Stop Button */}
          <button
            type="button"
            onClick={stop}
            className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition shadow-md"
            title="Stop"
          >
            <span className="text-lg">⏹️</span>
            <span>Stop</span>
          </button>

          {/* Speaking indicator */}
          <span className="text-sm text-[#0066cc] font-medium animate-pulse flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-[#8cc63f] rounded-full animate-bounce"></span>
            Speaking...
          </span>
        </div>
      )}

      {/* Voice selector (optional) */}
      {voices.length > 0 && !isSpeaking && (
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="px-2 py-1 text-xs border border-gray-300 rounded-lg bg-white text-gray-700"
          title="Select voice"
        >
          <option value="default">Auto Voice</option>
          {voices
            .filter((v) => v.lang.includes("en") || v.lang.includes("hi") || v.lang.includes("ur"))
            .slice(0, 5)
            .map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name.slice(0, 20)}
              </option>
            ))}
        </select>
      )}
    </div>
  );
}
