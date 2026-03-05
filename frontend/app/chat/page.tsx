/**
 * SMIT AI Assistant - FAQ Chat Page
 * ==================================
 *
 * This page provides an interactive chat interface for users to ask
 * questions about SMIT. It uses a LOCAL-FIRST approach to save tokens.
 *
 * TOKEN SAVING STRATEGY:
 * - Quick Questions: Always fetched from local JSON (NO API call)
 * - Regular Messages: First check local FAQ, then fallback
 *
 * @author SMIT Development Team
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MessageBubble from "@/components/MessageBubble";
import InputBox from "@/components/InputBox";
import { quickQuestions, getQuickAnswer, QuickQuestion } from "@/lib/chatLogic";

// Message interface for chat history
interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatPage() {
  // State for chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! Welcome to SMIT Assistant! 👋\n\nI can help you with:\n📋 Admissions & Requirements\n📚 Courses & Timings\n📢 Events & Workshops\n🎓 Certificates & Career\n\nAsk me anything or click a Quick Question below!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  // Loading state for API calls
  const [isLoading, setIsLoading] = useState(false);

  // Ref for auto-scrolling to latest message
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to bottom when new messages are added
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handle sending a regular message
   * This calls the API which uses LOCAL-FIRST matching
   *
   * @param text - The message text from user
   */
  const handleSendMessage = async (text: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call API endpoint (which uses local matching first)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      // Add bot response to chat
      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.reply || "Sorry, I couldn't process your request.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Handle API errors gracefully
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, something went wrong. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Quick Question click
   *
   * TOKEN SAVING: This function gets answer from LOCAL JSON data
   * WITHOUT making any API call to Gemini. This saves tokens!
   *
   * @param questionText - The quick question text
   */
  const handleQuickQuestion = (questionText: string) => {
    // Add user's question to chat
    const userMessage: Message = {
      id: Date.now(),
      text: questionText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Get answer from LOCAL data (no API call!)
    const answer = getQuickAnswer(questionText);

    // Add bot response with small delay for UX
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: answer || "I don't have information about that. Please try asking differently.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ========================================
          HEADER - SMIT Gradient Applied
          ======================================== */}
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
            <Link href="/" className="hover:text-white/80 transition font-medium">
              Home
            </Link>
            <Link href="/announcements" className="hover:text-white/80 transition font-medium">
              Announcements
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            FAQ Chat Agent
          </h2>
          <p className="text-gray-600">
            Ask anything about SMIT - admissions, courses, fees, and more
          </p>
        </div>

        {/* ========================================
            CHAT WINDOW
            ======================================== */}
        <div className="flex flex-col h-137.5 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Chat Header with Gradient */}
          <div className="bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white py-4 px-6">
            <div className="flex items-center gap-3">
              <Image
                src="/smit-logo.svg"
                alt="SMIT Logo"
                width={45}
                height={45}
                className="rounded-full bg-white p-1"
              />
              <div>
                <h3 className="font-semibold">SMIT Assistant</h3>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                text={message.text}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#0066cc] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-[#0066cc] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-[#8cc63f] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="text-sm">Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box - Send button has SMIT gradient */}
          <InputBox onSend={handleSendMessage} disabled={isLoading} />
        </div>

        {/* ========================================
            QUICK QUESTIONS
            TOKEN SAVING: These use LOCAL data only!
            ======================================== */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Quick Questions
            <span className="text-xs font-normal text-gray-500 ml-2">(Instant answers - no API call)</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {quickQuestions.map((q: QuickQuestion) => (
              <button
                key={q.id}
                onClick={() => handleQuickQuestion(q.text)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:border-[#0066cc] hover:text-[#0066cc] hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tags */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-3">Browse by category:</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#0066cc]/10 text-[#0066cc] rounded-full text-xs font-medium">
              📋 Admissions
            </span>
            <span className="px-3 py-1 bg-[#8cc63f]/10 text-[#8cc63f] rounded-full text-xs font-medium">
              📚 Courses
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
              📢 Events
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
              🎓 Certificates
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              ℹ️ General
            </span>
          </div>
        </div>
      </main>

      {/* ========================================
          FOOTER - SMIT Gradient Applied
          ======================================== */}
      <footer className="bg-linear-to-r from-[#0066cc] to-[#8cc63f] text-white py-6 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm opacity-90">
            SMIT - Saylani Mass IT Training | Building Future Tech Leaders
          </p>
        </div>
      </footer>
    </div>
  );
}
