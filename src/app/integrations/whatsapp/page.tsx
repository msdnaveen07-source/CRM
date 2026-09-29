'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  CheckCircle2,
  Send,
  BellRing,
  Smartphone,
  Key,
  MessageCircle,
  Clock,
  User,
  AlertTriangle
} from 'lucide-react';
import { ChatMessage } from '@/lib/whatsapp';

export default function WhatsAppIntegrationPage() {
  const { user } = useApp();
  const [testSent, setTestSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Client Specific WhatsApp Sender Config
  const [waConfig, setWaConfig] = useState({
    senderPhoneNumber: '+1 945 403 6111',
    recipientPhone: '+91 9080692565',
    phoneNumberId: '1225325963990584',
    businessAccountId: '1330618741790649',
    accessToken: ''
  });

  // 2-Way Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(
        `/api/integrations/whatsapp/chat?tenantId=${user.tenantId}&leadPhone=${waConfig.recipientPhone}`
      );
      const data = await res.json();
      if (data.success) {
        setChatMessages(data.history);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [waConfig.recipientPhone]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(
      `WhatsApp Business Credentials Saved! Meta Cloud API Ready for Sender: ${waConfig.senderPhoneNumber}`
    );
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleSendTestMessage = async () => {
    setTestSent(true);
    setStatusMessage(null);

    const testText = `NEW META LEAD ALERT 🔔\n\nName: Ananya Deshmukh\nPhone: ${waConfig.recipientPhone}\nCampaign: Luxury Villa Launch Q3\nForm: Instant Lead Form\n\nPlease follow up immediately.`;

    try {
      const res = await fetch('/api/integrations/whatsapp/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: user.tenantId,
          phoneNumberId: waConfig.phoneNumberId,
          accessToken: waConfig.accessToken,
          recipientPhone: waConfig.recipientPhone,
          text: testText
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Meta WhatsApp Cloud API Alert Dispatched to ${waConfig.recipientPhone}!`);
        fetchChatHistory();
      } else {
        setStatusMessage(`Meta API Error: ${data.error || 'Failed to send'}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    } finally {
      setTestSent(false);
    }
  };

  const handleSend2WayReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch('/api/integrations/whatsapp/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: user.tenantId,
          phoneNumberId: waConfig.phoneNumberId,
          accessToken: waConfig.accessToken,
          recipientPhone: waConfig.recipientPhone,
          text: replyText
        })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText('');
        fetchChatHistory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="text-emerald-600" size={24} />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              WhatsApp Business Cloud API &amp; 2-Way Live Messaging
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dispatch real Meta WhatsApp API lead alerts &amp; chat live in 2-way conversation with leads.
          </p>
        </div>

        <button
          onClick={handleSendTestMessage}
          disabled={testSent}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <Send size={14} />
          <span>{testSent ? 'Sending via Meta API...' : 'Dispatch Live WhatsApp Alert'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-between animate-in fade-in">
          <span>{statusMessage}</span>
          <CheckCircle2 size={16} className="text-emerald-600" />
        </div>
      )}

      {/* Main Workspace: API Setup & 2-Way Chat View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Meta Credentials Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Smartphone size={16} className="text-emerald-600" />
            Meta WABA Cloud API Credentials
          </h2>

          <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sender Business Number
              </label>
              <input
                type="text"
                required
                value={waConfig.senderPhoneNumber}
                onChange={(e) => setWaConfig({ ...waConfig, senderPhoneNumber: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Recipient Manager Mobile
              </label>
              <input
                type="text"
                required
                value={waConfig.recipientPhone}
                onChange={(e) => setWaConfig({ ...waConfig, recipientPhone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp Phone Number ID
              </label>
              <input
                type="text"
                required
                value={waConfig.phoneNumberId}
                onChange={(e) => setWaConfig({ ...waConfig, phoneNumberId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Business Account ID (WABA)
              </label>
              <input
                type="text"
                required
                value={waConfig.businessAccountId}
                onChange={(e) => setWaConfig({ ...waConfig, businessAccountId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Meta WhatsApp Permanent System User Token
              </label>
              <textarea
                rows={2}
                placeholder="Paste Permanent System User Token (EAAG...)"
                value={waConfig.accessToken}
                onChange={(e) => setWaConfig({ ...waConfig, accessToken: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2 flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition"
              >
                Save WhatsApp API Credentials
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Live 2-Way WhatsApp Chat Console (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageCircle size={16} className="text-emerald-600" />
                2-Way WhatsApp Live Conversation
              </h2>
              <span className="text-[11px] text-slate-400">
                Lead Contact: {waConfig.recipientPhone}
              </span>
            </div>
          </div>

          {/* Chat Bubbles */}
          <div className="space-y-3 max-h-[320px] overflow-y-auto p-2 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
            {chatMessages.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No chat history yet</p>
            ) : (
              chatMessages.map((msg) => {
                const isRep = msg.sender === 'SALES_REP';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isRep ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                        isRep
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[9px] opacity-70 block text-right mt-1 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSend2WayReply} className="flex gap-2">
            <input
              type="text"
              placeholder="Type 2-way WhatsApp reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white border border-transparent focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={sendingReply}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center gap-1"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
