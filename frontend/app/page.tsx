'use client'; // Hydration aur hooks ke liye zaroori hai

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Hydration Error Fix: Sirf client par render hone dein
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header with SMIT Gradient */}
      <header className="bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white py-4 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <Image
              src="/smit-logo.svg" 
              alt="SMIT Logo"
              width={45}
              height={45}
              className="rounded-full bg-white p-1"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight">SMIT Chatbot</h1>
              <p className="text-xs opacity-90">Saylani Mass IT Training</p>
            </div>
          </Link>
          <nav className="flex gap-6">
            <Link href="/announcements" className="hover:text-white/80 transition font-medium text-white">
              Announcements
            </Link>
            <Link href="/chat" className="hover:text-white/80 transition font-medium text-white">
              FAQ Chat
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="mb-8">
            <Image
              src="/smit-logo.svg"
              alt="SMIT Logo"
              width={140}
              height={140}
              className="mx-auto drop-shadow-lg"
            />
          </div>

          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to{" "}
            <span className="bg-linear-to-r from-[#0066cc] to-[#8cc63f] bg-clip-text text-transparent">
              SMIT Assistant
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your AI-powered helper for Saylani Mass IT Training.
          </p>
        </div>

        {/* Feature Cards - Uniform Height Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Announcement Agent Card */}
          <Link href="/announcements" className="group h-full">
            <div className="relative bg-white rounded-2xl p-8 shadow-md border-2 border-transparent hover:border-[#0066cc] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full min-h-87.5 flex flex-col">
              <div className="w-16 h-16 bg-linear-to-br from-[#0066cc] to-[#0066cc]/70 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📢</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0066cc]">
                Announcement Agent
              </h3>
              <p className="text-gray-700 leading-relaxed flex-1">
                Create branded announcements. Agent automatically generates text from your key points.
              </p>
            </div>
          </Link>

          {/* FAQ Chat Agent Card */}
          <Link href="/chat" className="group h-full">
            <div className="relative bg-white rounded-2xl p-8 shadow-md border-2 border-transparent hover:border-[#8cc63f] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full min-h-87.5 flex flex-col">
              <div className="w-16 h-16 bg-linear-to-br from-[#8cc63f] to-[#8cc63f]/70 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#8cc63f]">
                FAQ Chat Agent
              </h3>
              <p className="text-gray-700 leading-relaxed flex-1">
                Get answers about fees and courses instantly using local FAQ matching (Zero tokens!).
              </p>
            </div>
          </Link>

          {/* Voice Input Card */}
          <Link href="/announcements" className="group h-full">
            <div className="relative bg-white rounded-2xl p-8 shadow-md border-2 border-transparent hover:border-[#0066cc] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full min-h-87.5 flex flex-col">
              <div className="w-16 h-16 bg-linear-to-br from-[#0066cc] to-[#8cc63f] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎤</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Voice Input
              </h3>
              <p className="text-gray-700 leading-relaxed flex-1">
                Use voice commands in Roman Urdu/English to create announcements quickly.
              </p>
              <span className="inline-block mt-3 text-sm bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white px-3 py-1 rounded-full font-medium w-fit">
                Available Now
              </span>
            </div>
          </Link>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-bold">SMIT - Saylani Mass IT Training</p>
          <p className="text-sm opacity-90 mt-1">Building Future Tech Leaders | Powered by Saylani Welfare Trust</p>
        </div>
      </footer>
    </div>
  );
}