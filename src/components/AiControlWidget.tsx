'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  X,
  Send,
  Zap,
  Mic,
  MicOff,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Play,
  Pause,
  Maximize2,
  Bot,
  User
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface MetricItem {
  label: string;
  value: string | number;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionType?: string;
  actionData?: any;
  suggestions?: string[];
  metrics?: MetricItem[];
}

export function AiControlWidget() {
  const router = useRouter();
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isAutonomous, setIsAutonomous] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello ${user.name?.split(' ')[0] || 'Admin'}! I am Ani, your autonomous CRM AI assistant.\n\nAutonomous Lead Nurturing & WhatsApp Automation is ACTIVE 24/7.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Analyze lead pipeline',
        'Auto-assign pending leads',
        'Check WhatsApp status',
        'Go to Leads page'
      ],
      metrics: [
        { label: 'Total Active Leads', value: '142' },
        { label: 'Hot Leads (85%+)', value: '28' }
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend || inputMessage;
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          tenantId: user.tenantId,
          userRole: user.role
        })
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.success) {
        const cleanedReply = (data.reply || '')
          .replace(/\*\*/g, '')
          .replace(/###/g, '')
          .trim();

        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: cleanedReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: data.actionType,
          actionData: data.actionData,
          suggestions: data.suggestions,
          metrics: data.actionData?.total
            ? [
                { label: 'Total Leads', value: data.actionData.total },
                { label: 'Hot Leads', value: data.actionData.hotLeads }
              ]
            : undefined
        };

        setMessages((prev) => [...prev, aiMsg]);

        if (data.actionType === 'NAVIGATE' && data.actionData?.targetUrl) {
          setTimeout(() => router.push(data.actionData.targetUrl), 800);
        } else if (data.actionType === 'AUTONOMOUS_MODE_TOGGLE') {
          setIsAutonomous(true);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            text: 'An error occurred while processing your request. Please try again.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (e) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Network connection issue. Please check your network.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported on this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSendMessage(transcript);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
            const content = trimmed.replace(/^[•\-]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                <span>{content}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-slate-800 leading-relaxed font-medium">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 font-sans">
        {isAutonomous && !isOpen && (
          <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce border border-blue-400">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            Ani AI Active
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center border-2 border-white"
          aria-label="Toggle Ani AI Controller"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-white" />
              <span className="hidden md:inline font-bold tracking-wide text-sm">Ani AI Agent</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
          )}
        </button>
      </div>

      {/* Clean Enterprise White & Blue Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[94vw] sm:w-[440px] h-[620px] max-h-[82vh] bg-white border border-blue-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden text-slate-900 animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header Banner */}
          <div className="p-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base tracking-wide text-white">
                    Ani AI Assistant
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                    Online
                  </span>
                </div>
                <p className="text-xs text-blue-100 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Autonomous Sales Copilot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => router.push('/ai-agent')}
                title="Full Dashboard"
                className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Clean Enterprise Status Bar */}
          <div className="px-4 py-2.5 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-slate-600 font-medium">Automation Status:</span>
              <span className={`font-bold ${isAutonomous ? 'text-blue-700' : 'text-slate-500'}`}>
                {isAutonomous ? 'Active' : 'Paused'}
              </span>
            </div>

            <button
              onClick={() => setIsAutonomous(!isAutonomous)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 border shadow-sm ${
                isAutonomous
                  ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border-slate-300'
              }`}
            >
              {isAutonomous ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isAutonomous ? 'Pause AI' : 'Resume AI'}
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-slate-100'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="leading-relaxed">{msg.text}</p>
                  ) : (
                    renderFormattedText(msg.text)
                  )}

                  {msg.metrics && msg.metrics.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                      {msg.metrics.map((m, idx) => (
                        <div key={idx} className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                          <div className="text-[11px] text-slate-500 font-medium">{m.label}</div>
                          <div className="text-sm font-bold text-blue-700 mt-0.5">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.actionType && msg.actionType === 'NAVIGATE' && (
                    <button
                      onClick={() => router.push(msg.actionData?.targetUrl)}
                      className="mt-3 w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 flex items-center justify-between text-xs transition font-semibold"
                    >
                      <span>Open {msg.actionData?.targetUrl}</span>
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                    </button>
                  )}

                  <span className={`block text-[10px] mt-2 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full transition flex items-center gap-1.5 shadow-sm active:scale-95 font-medium"
                      >
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-blue-600 text-xs bg-white p-3 rounded-2xl w-fit border border-blue-100 shadow-sm">
                <Bot className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="font-medium">Ani AI is responding...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3.5 bg-white border-t border-slate-200 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl border transition ${
                  isListening
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title={isListening ? 'Listening...' : 'Voice Input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Ani AI to manage leads or reply WhatsApp..."
                className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-400 px-1 font-medium">
              <span>Press Enter to send</span>
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <Zap className="w-3 h-3 text-blue-600" /> Ani AI Copilot v4.0
              </span>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
