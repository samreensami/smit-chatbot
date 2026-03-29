'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaMicrophone, FaVolumeUp } from 'react-icons/fa';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

// Define types
type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type FeatureTab = 'chat' | 'announcements' | 'social' | 'emails' | 'support';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<FeatureTab>('chat');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the voice recognition hook
  const { transcript, isListening, error, startListening, stopListening } = useVoiceRecognition();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle voice recognition results
  useEffect(() => {
    if (transcript) {
      setInputValue(prev => prev + ' ' + transcript);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Determine the API endpoint based on active tab
      let apiUrl = '';
      let requestBody: any = {};

      switch (activeTab) {
        case 'chat':
          apiUrl = 'http://localhost:8000/chat';
          requestBody = { message: inputValue, language: selectedLanguage };
          break;
        case 'announcements':
          apiUrl = 'http://localhost:8000/generate-announcement';
          requestBody = { topic: inputValue, language: selectedLanguage };
          break;
        case 'social':
          apiUrl = 'http://localhost:8000/generate-social-media-post';
          requestBody = { topic: inputValue, platform: 'facebook', language: selectedLanguage }; // Default to Facebook
          break;
        case 'emails':
          apiUrl = 'http://localhost:8000/generate-email';
          requestBody = {
            subject: 'New Email',
            recipient: 'students',
            content: inputValue,
            language: selectedLanguage
          };
          break;
        case 'support':
          apiUrl = 'http://localhost:8000/faq';
          requestBody = { message: inputValue, context: 'FAQ and Support', language: selectedLanguage };
          break;
        default:
          apiUrl = 'http://localhost:8000/chat';
          requestBody = { message: inputValue, language: selectedLanguage };
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Extract the response based on the endpoint
      let botResponse = '';
      if (data.content) {
        botResponse = data.content;
      } else if (data.response) {
        botResponse = data.response;
      } else if (data.announcement) {
        botResponse = data.announcement;
      } else if (data.post) {
        botResponse = data.post;
      } else if (data.email) {
        botResponse = data.email;
      } else {
        botResponse = data.message || 'Sorry, I could not process your request.';
      }

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      // If already listening, we can't start again without stopping first
      alert('Already listening. Please wait for the current recognition to complete.');
    } else {
      // The actual voice recognition is handled by the hook
      // We just need to trigger the startListening function
    }
  };

  const handleTextToSpeech = (text: string) => {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'ur' ? 'ur-PK' :
                      selectedLanguage === 'roman-ur' ? 'ur-PK' : 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    } else {
      alert(`Text-to-speech would read: "${text.substring(0, 50)}..."`);
    }
  };

  const tabs = [
    { id: 'chat', label: 'Chat' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'social', label: 'Social Media' },
    { id: 'emails', label: 'Emails' },
    { id: 'support', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-smit-blue to-smit-accent-blue text-white">
      {/* Header */}
      <header className="bg-smit-accent-blue py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-smit-blue font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center">
              SMIT
            </div>
            <h1 className="text-2xl font-bold">SMIT AI Communication Assistant</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-white text-smit-blue px-3 py-1 rounded-md"
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="roman-ur">Roman Urdu</option>
            </select>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl p-4">
        {/* Feature Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-smit-accent-blue/20 p-2 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FeatureTab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-smit-blue font-semibold'
                  : 'bg-smit-blue/80 hover:bg-smit-blue'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col h-[70vh]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="text-center mb-6">
                  <div className="bg-smit-blue text-white font-bold text-3xl w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    SMIT
                  </div>
                  <h2 className="text-2xl font-bold text-smit-blue">SMIT AI Assistant</h2>
                  <p className="mt-2">How can I help you today?</p>
                </div>

                {/* Quick Actions based on active tab */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
                  {activeTab === 'chat' && (
                    <>
                      <button
                        onClick={() => setInputValue('Tell me about SMIT courses')}
                        className="bg-smit-blue text-white p-3 rounded-lg hover:bg-smit-accent-blue transition-colors text-left"
                      >
                        About SMIT Courses
                      </button>
                      <button
                        onClick={() => setInputValue('What are the class timings?')}
                        className="bg-smit-green text-white p-3 rounded-lg hover:bg-smit-accent-green transition-colors text-left"
                      >
                        Class Timings
                      </button>
                      <button
                        onClick={() => setInputValue('How to register for a course?')}
                        className="bg-smit-accent-blue text-white p-3 rounded-lg hover:bg-blue-700 transition-colors text-left"
                      >
                        Registration Process
                      </button>
                    </>
                  )}

                  {activeTab === 'announcements' && (
                    <>
                      <button
                        onClick={() => setInputValue('New batch starting next week')}
                        className="bg-smit-blue text-white p-3 rounded-lg hover:bg-smit-accent-blue transition-colors text-left"
                      >
                        New Batch Announcement
                      </button>
                      <button
                        onClick={() => setInputValue('Holiday notice for Eid')}
                        className="bg-smit-green text-white p-3 rounded-lg hover:bg-smit-accent-green transition-colors text-left"
                      >
                        Holiday Notice
                      </button>
                      <button
                        onClick={() => setInputValue('Exam schedule update')}
                        className="bg-smit-accent-blue text-white p-3 rounded-lg hover:bg-blue-700 transition-colors text-left"
                      >
                        Exam Schedule
                      </button>
                    </>
                  )}

                  {activeTab === 'social' && (
                    <>
                      <button
                        onClick={() => setInputValue('Promote upcoming web development workshop')}
                        className="bg-smit-blue text-white p-3 rounded-lg hover:bg-smit-accent-blue transition-colors text-left"
                      >
                        Workshop Promotion
                      </button>
                      <button
                        onClick={() => setInputValue('Success story of recent graduate')}
                        className="bg-smit-green text-white p-3 rounded-lg hover:bg-smit-accent-green transition-colors text-left"
                      >
                        Success Story
                      </button>
                      <button
                        onClick={() => setInputValue('New course launch')}
                        className="bg-smit-accent-blue text-white p-3 rounded-lg hover:bg-blue-700 transition-colors text-left"
                      >
                        Course Launch
                      </button>
                    </>
                  )}

                  {activeTab === 'emails' && (
                    <>
                      <button
                        onClick={() => setInputValue('Remind students about assignment submission')}
                        className="bg-smit-blue text-white p-3 rounded-lg hover:bg-smit-accent-blue transition-colors text-left"
                      >
                        Assignment Reminder
                      </button>
                      <button
                        onClick={() => setInputValue('Welcome email for new students')}
                        className="bg-smit-green text-white p-3 rounded-lg hover:bg-smit-accent-green transition-colors text-left"
                      >
                        Welcome Email
                      </button>
                      <button
                        onClick={() => setInputValue('Update on class cancellation')}
                        className="bg-smit-accent-blue text-white p-3 rounded-lg hover:bg-blue-700 transition-colors text-left"
                      >
                        Class Cancellation
                      </button>
                    </>
                  )}

                  {activeTab === 'support' && (
                    <>
                      <button
                        onClick={() => setInputValue('What are the admission requirements?')}
                        className="bg-smit-blue text-white p-3 rounded-lg hover:bg-smit-accent-blue transition-colors text-left"
                      >
                        Admission Requirements
                      </button>
                      <button
                        onClick={() => setInputValue('How to pay fees online?')}
                        className="bg-smit-green text-white p-3 rounded-lg hover:bg-smit-accent-green transition-colors text-left"
                      >
                        Fee Payment
                      </button>
                      <button
                        onClick={() => setInputValue('What certifications do you offer?')}
                        className="bg-smit-accent-blue text-white p-3 rounded-lg hover:bg-blue-700 transition-colors text-left"
                      >
                        Certifications
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-smit-blue text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.sender === 'bot' && (
                          <button
                            onClick={() => handleTextToSpeech(message.content)}
                            className="mt-1 text-gray-500 hover:text-gray-700"
                            aria-label="Listen to message"
                          >
                            <FaVolumeUp size={14} />
                          </button>
                        )}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    activeTab === 'chat' ? 'Message SMIT Assistant...' :
                    activeTab === 'announcements' ? 'Describe the announcement topic...' :
                    activeTab === 'social' ? 'Describe the social media post topic...' :
                    activeTab === 'emails' ? 'Describe the email content...' :
                    'Ask a question about SMIT...'
                  }
                  className="w-full px-4 py-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-smit-blue focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (isListening) {
                      // Stop listening if currently listening
                      stopListening();
                    } else {
                      // Start listening
                      startListening();
                    }
                  }}
                  className={`absolute right-10 top-1/2 transform -translate-y-1/2 ${
                    isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-smit-blue'
                  }`}
                  aria-label={isListening ? "Currently listening" : "Voice input"}
                >
                  <FaMicrophone />
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={`p-3 rounded-full ${
                  isLoading || !inputValue.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-smit-blue text-white hover:bg-smit-accent-blue'
                }`}
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </form>

            <div className="mt-3 text-center text-sm text-gray-500">
              {activeTab === 'chat' && 'Chat with SMIT Assistant about courses, schedules, and policies'}
              {activeTab === 'announcements' && 'Generate professional announcements for classes, events, and notices'}
              {activeTab === 'social' && 'Create engaging social media content for Facebook, Instagram, and LinkedIn'}
              {activeTab === 'emails' && 'Draft formal emails for students, staff, and stakeholders'}
              {activeTab === 'support' && 'Get instant answers to frequently asked questions'}

              {isListening && (
                <div className="mt-2 text-red-500 animate-pulse">
                  Listening... Speak now
                </div>
              )}

              {error && (
                <div className="mt-2 text-red-500">
                  Error: {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-white/80 bg-smit-accent-blue/50">
        <p>© {new Date().getFullYear()} Saylani Mass IT Training (SMIT). All rights reserved.</p>
      </footer>
    </div>
  );
}