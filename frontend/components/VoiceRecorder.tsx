/**
 * SMIT AI Assistant - Voice Recorder Component
 * =============================================
 *
 * Speech Recognition using Web Speech API.
 * Supports English and Roman Urdu (via Hindi/Urdu language).
 *
 * Features:
 * - Prominent SMIT gradient button
 * - Language toggle (EN/UR/HI)
 * - Real-time listening indicator
 *
 * @author SMIT Development Team
 */

"use client";

import { useState, useEffect, useCallback } from "react";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  targetField?: string;
  language?: "en-US" | "ur-PK" | "hi-IN";
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
}

export default function VoiceRecorder({
  onTranscript,
  targetField = "all",
  language = "en-US",
  size = "medium",
  showLabel = false,
}: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLanguage;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        onTranscript(text);
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);

      if (event.error === "no-speech") {
        alert("No speech detected. Please try again.");
      } else if (event.error === "not-allowed") {
        alert("Microphone access denied. Please allow microphone access.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [currentLanguage, onTranscript]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const toggleLanguage = () => {
    const languages: Array<"en-US" | "ur-PK" | "hi-IN"> = ["en-US", "hi-IN", "ur-PK"];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };

  const getLanguageLabel = () => {
    switch (currentLanguage) {
      case "en-US":
        return "EN";
      case "ur-PK":
        return "اردو";
      case "hi-IN":
        return "HI";
      default:
        return "EN";
    }
  };

  const getLanguageFullName = () => {
    switch (currentLanguage) {
      case "en-US":
        return "English";
      case "ur-PK":
        return "Urdu";
      case "hi-IN":
        return "Hindi/Roman Urdu";
      default:
        return "English";
    }
  };

  // Size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          button: "p-2.5",
          icon: "text-sm",
          label: "text-xs",
        };
      case "large":
        return {
          button: "p-5",
          icon: "text-3xl",
          label: "text-base",
        };
      default:
        return {
          button: "p-3.5",
          icon: "text-xl",
          label: "text-sm",
        };
    }
  };

  const sizeStyles = getSizeStyles();

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Voice not supported</span>
        <button
          disabled
          className="p-2 bg-gray-200 text-gray-400 rounded-full cursor-not-allowed"
          title="Speech recognition not supported"
        >
          🎤
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition border border-gray-200"
          title={`Current: ${getLanguageFullName()}. Click to change.`}
        >
          🌐 {getLanguageLabel()}
        </button>

        {/* Main Record Button - Prominent SMIT Gradient */}
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`relative ${sizeStyles.button} rounded-full transition-all duration-300 shadow-lg ${
            isListening
              ? "bg-red-500 text-white scale-110"
              : "bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white hover:scale-105 hover:shadow-xl"
          }`}
          title={isListening ? "Click to stop" : "Click to speak"}
        >
          {isListening && (
            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-50"></span>
          )}
          <span className={`relative ${sizeStyles.icon}`}>
            {isListening ? "🔴" : "🎤"}
          </span>
        </button>

        {/* Status/Label */}
        {isListening ? (
          <span className="text-sm text-red-500 font-semibold animate-pulse">
            Listening...
          </span>
        ) : showLabel ? (
          <span className={`${sizeStyles.label} text-gray-600 font-medium`}>
            Tap to Speak
          </span>
        ) : null}
      </div>

      {/* Live Transcript Preview */}
      {isListening && transcript && (
        <div className="mt-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 italic max-w-xs text-center animate-pulse">
          &quot;{transcript}&quot;
        </div>
      )}
    </div>
  );
}
