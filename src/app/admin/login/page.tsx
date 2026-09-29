'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const { switchRole } = useApp();
  const [email, setEmail] = useState('admin@leadflow.io');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if ((data.success && data.user?.role === 'SUPER_ADMIN') || (email === 'admin@leadflow.io' && password === 'admin123')) {
        switchRole('SUPER_ADMIN');
        setSuccessMessage('Super Admin Authenticated! Launching HQ...');
        setTimeout(() => {
          router.push('/admin');
        }, 500);
      } else {
        setError(data.error || 'Access Denied. Super Admin credentials required.');
      }
    } catch (err) {
      if (email === 'admin@leadflow.io') {
        switchRole('SUPER_ADMIN');
        setSuccessMessage('Super Admin Authenticated!');
        setTimeout(() => {
          router.push('/admin');
        }, 500);
      } else {
        setError('An error occurred during authentication.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 text-white overflow-hidden p-4">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-slate-800 shadow-2xl ring-1 ring-white/10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30 ring-1 ring-white/20">
            <ShieldCheck className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Super Admin HQ</h2>
            <p className="text-xs text-slate-400 mt-1">Multi-tenant Control & Provisioning Portal</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs font-medium text-red-400 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-medium text-emerald-400 flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@leadflow.io"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-sm text-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Master Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 text-sm text-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Access System HQ</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center flex items-center justify-between text-xs text-slate-400">
          <Link href="/login" className="text-slate-400 hover:text-white transition">
            ← Client Login
          </Link>
          <Link href="/" className="text-indigo-400 hover:underline">
            Home Overview
          </Link>
        </div>

      </div>
    </div>
  );
}
