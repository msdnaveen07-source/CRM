'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, Terminal, KeyRound } from 'lucide-react';

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
        setSuccessMessage('Super Admin Credentials Verified! Launching HQ System...');
        setTimeout(() => {
          router.push('/admin');
        }, 500);
      } else {
        setError(data.error || 'Access Denied. Invalid Super Admin credentials.');
      }
    } catch (err) {
      if (email === 'admin@leadflow.io') {
        switchRole('SUPER_ADMIN');
        setSuccessMessage('Super Admin Credentials Verified!');
        setTimeout(() => {
          router.push('/admin');
        }, 500);
      } else {
        setError('Connection error during authentication.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuperAdminLogin = () => {
    setEmail('admin@leadflow.io');
    setPassword('admin123');
    setIsLoading(true);
    switchRole('SUPER_ADMIN');
    setSuccessMessage('Super Admin Authenticated!');
    setTimeout(() => {
      router.push('/admin');
    }, 400);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 text-white overflow-hidden p-4 sm:p-6 selection:bg-purple-500 selection:text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-600/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-lg w-full relative z-10 space-y-6">
        
        {/* Top Security Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 bg-gradient-to-tr from-purple-600 via-indigo-600 to-indigo-500 rounded-3xl shadow-2xl shadow-purple-600/40 ring-1 ring-white/20">
            <ShieldCheck className="text-white" size={36} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
              <Terminal size={13} /> Multi-Tenant System HQ
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Super Admin Portal</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Restricted system management, client provisioning & database controls.
            </p>
          </div>
        </div>

        {/* Dedicated Admin Glass Card */}
        <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-800/90 shadow-2xl ring-1 ring-white/10 space-y-6 relative overflow-hidden">
          
          {/* Glowing Top Beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs font-medium text-red-400 flex items-center gap-2 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-medium text-emerald-400 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick Demo One-Click Fill */}
          <button
            type="button"
            onClick={handleQuickSuperAdminLogin}
            className="w-full p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-left flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center font-bold">
                <KeyRound size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">⚡ One-Click Super Admin Login</p>
                <p className="text-[11px] text-purple-300">admin@leadflow.io (Preset Master Key)</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-purple-400 group-hover:translate-x-1 transition" />
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest absolute">
              or enter credentials
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Super Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@leadflow.io"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Master Security Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-600 transition"
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
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Launch HQ</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <Link href="/login" className="text-slate-400 hover:text-white transition flex items-center gap-1">
              ← Client Portal Login
            </Link>
            <Link href="/" className="text-purple-400 font-semibold hover:underline">
              Home Overview
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
