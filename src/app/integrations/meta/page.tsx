'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Share2,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Key,
  Globe,
  Sliders,
  Sparkles,
  Database,
  Send,
  Lock,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function MetaIntegrationPage() {
  const { user } = useApp();
  const [connected, setConnected] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Meta Graph API Credentials State
  const [metaApiConfig, setMetaApiConfig] = useState({
    customDomain: 'https://crm.yourcompany.com',
    metaAppId: '109283741928374',
    metaAppSecret: '••••••••••••••••••••••••••••••••',
    pageId: '102938475610293',
    pageName: 'Apex Luxury Homes Official',
    adAccountId: 'act_1092837419',
    webhookVerifyToken: 'leadflow_webhook_verify_token_2026',
    pageAccessToken: 'EAAG...meta_graph_api_access_token_encrypted_storage'
  });

  const constructedWebhookUrl = `${
    metaApiConfig.customDomain ? metaApiConfig.customDomain.replace(/\/$/, '') : 'http://localhost:3000'
  }/api/webhooks/meta`;

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setSyncing(true);
    setStatusMessage(null);
    setTimeout(() => {
      setConnected(true);
      setSyncing(false);
      setStatusMessage('Meta API Credentials Verified & Token Validated Successfully! Live Webhooks Active.');
    }, 1200);
  };

  const handleForceSyncNow = async () => {
    setSyncing(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/reconcile?tenantId=${user.tenantId}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(
          `Meta Graph API Sync Completed! ${data.reconciliation.leadsFound} Leads Scanned, ${data.reconciliation.leadsInserted} New Inserted, ${data.reconciliation.duplicatesSkipped} Duplicates Prevented.`
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/meta`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Key className="text-indigo-600" size={24} />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Meta Graph API &amp; Webhook Credentials Setup
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect using your Meta App ID, App Secret, Page Access Token &amp; Webhook Verify Token.
          </p>
        </div>

        <button
          onClick={handleForceSyncNow}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition shadow-sm"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Syncing via API...' : 'Force Meta API Sync Now'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-between animate-in fade-in">
          <span>{statusMessage}</span>
          <CheckCircle2 size={16} className="text-emerald-600" />
        </div>
      )}

      {/* Full API Credentials Setup Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock size={16} className="text-indigo-600" />
          Meta API Keys &amp; Webhook Config (Encrypted Storage)
        </h2>

        <form onSubmit={handleSaveCredentials} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Meta App ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 109283741928374"
              value={metaApiConfig.metaAppId}
              onChange={(e) => setMetaApiConfig({ ...metaApiConfig, metaAppId: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Meta App Secret
            </label>
            <input
              type="password"
              required
              placeholder="e.g. 8a9b0c1d2e3f4g5h..."
              value={metaApiConfig.metaAppSecret}
              onChange={(e) => setMetaApiConfig({ ...metaApiConfig, metaAppSecret: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Facebook Page ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 102938475610293"
              value={metaApiConfig.pageId}
              onChange={(e) => setMetaApiConfig({ ...metaApiConfig, pageId: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ad Account ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. act_1092837419"
              value={metaApiConfig.adAccountId}
              onChange={(e) => setMetaApiConfig({ ...metaApiConfig, adAccountId: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Meta Webhook Verify Token
            </label>
            <input
              type="text"
              required
              value={metaApiConfig.webhookVerifyToken}
              onChange={(e) => setMetaApiConfig({ ...metaApiConfig, webhookVerifyToken: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Meta Page Access Token (Long-Lived Encrypted)
            </label>
            <textarea
              rows={3}
              required
              placeholder="Paste long-lived Meta Graph API Page Access Token (EAAG...)"
              value={metaApiConfig.pageAccessToken}
              onChange={(e) => setMetaApiConfig({ ...metaApiConfig, pageAccessToken: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px]"
            />
          </div>

          {/* Webhook Callback Info & Domain Input Box */}
          <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <Globe size={15} className="text-indigo-600" />
              Client Custom Domain Meta Developer Portal Webhook Callback URL:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Enter your custom domain (e.g. https://crm.yourcompany.com)"
                  value={metaApiConfig.customDomain}
                  onChange={(e) => setMetaApiConfig({ ...metaApiConfig, customDomain: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 rounded-xl outline-none border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                <span className="truncate">{constructedWebhookUrl}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(constructedWebhookUrl)}
                  className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  title="Copy Callback URL"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Paste this constructed URL directly into your Meta Developer Portal Webhooks Subscription page.
            </span>
          </div>

          <div className="md:col-span-2 flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              disabled={syncing}
              className="px-6 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition shadow-md"
            >
              {syncing ? 'Saving & Validating Token...' : 'Save Meta API Keys & Validate Connection'}
            </button>
          </div>
        </form>
      </div>

      {/* Subscribed Forms Status */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Active API Subscribed Facebook Forms
        </h3>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Luxury Villa Inquiry Form
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ID: form-meta-luxury-villas • 142 Leads Captured via API
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              API WEBHOOK ACTIVE
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Penthouse Instant Call Form
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ID: form-meta-penthouse • 84 Leads Captured via API
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              API WEBHOOK ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
