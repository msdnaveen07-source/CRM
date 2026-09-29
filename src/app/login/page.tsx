'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  Building2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  UserCheck, 
  School, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { UserRole, BusinessCategory } from '@/types';

interface DemoAccount {
  label: string;
  role: UserRole;
  email: string;
  pass: string;
  tenantId: string;
  tenantName: string;
  category: BusinessCategory;
  badge: string;
  icon: any;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Real Estate Admin',
    role: 'CLIENT_ADMIN',
    email: 'vikram@apexrealestate.com',
    pass: 'admin123',
    tenantId: 'tenant-101',
    tenantName: 'Apex Real Estate',
    category: 'REAL_ESTATE',
    badge: 'Real Estate',
    icon: Building2
  },
  {
    label: 'Sales Executive',
    role: 'SALES_USER',
    email: 'rohan@apexrealestate.com',
    pass: 'sales123',
    tenantId: 'tenant-101',
    tenantName: 'Apex Real Estate',
    category: 'REAL_ESTATE',
    badge: 'Sales Rep',
    icon: Briefcase
  },
  {
    label: 'Education Portal',
    role: 'TEACHER',
    email: 'anitha@oxfordedu.in',
    pass: 'teacher123',
    tenantId: 'tenant-104',
    tenantName: 'Oxford International',
    category: 'EDUCATION',
    badge: 'Education',
    icon: School
  },
  {
    label: 'Super Admin HQ',
    role: 'SUPER_ADMIN',
    email: 'admin@leadflow.io',
    pass: 'admin123',
    tenantId: 'system',
    tenantName: 'System HQ',
    category: 'GENERAL_CRM',
    badge: 'System Admin',
    icon: ShieldCheck
  }
];

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<'CLIENT' | 'ADMIN'>('CLIENT');
  const [successMessage, setSuccessMessage] = useState('');

  const executeLogin = (userRole: UserRole, tenantId: string, tenantName: string, category: BusinessCategory, targetPath: string) => {
    switchRole(userRole, tenantId, tenantName, category);
    setSuccessMessage('Authentication Successful! Redirecting...');
    setTimeout(() => {
      router.push(targetPath);
    }, 600);
  };

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

      if (data.success && data.user) {
        const target = data.user.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard';
        executeLogin(data.user.role, data.user.tenantId, data.user.tenantName || 'My Business', data.user.businessCategory, target);
      } else {
        // Fallback for user ease if testing with demo input directly
        const matchedDemo = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
        if (matchedDemo) {
          const target = matchedDemo.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard';
          executeLogin(matchedDemo.role, matchedDemo.tenantId, matchedDemo.tenantName, matchedDemo.category, target);
        } else {
          setError(data.error || 'Invalid email or password');
        }
      }
    } catch (err) {
      // Offline / fallback handler
      const matchedDemo = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (matchedDemo) {
        const target = matchedDemo.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard';
        executeLogin(matchedDemo.role, matchedDemo.tenantId, matchedDemo.tenantName, matchedDemo.category, target);
      } else {
        setError('Connection error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    if (acc.role === 'SUPER_ADMIN') {
      setSelectedPortal('ADMIN');
    } else {
      setSelectedPortal('CLIENT');
    }
    setError('');
  };

  const handleQuickDemoClick = (acc: DemoAccount) => {
    fillDemoAccount(acc);
    setIsLoading(true);
    setTimeout(() => {
      const target = acc.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard';
      executeLogin(acc.role, acc.tenantId, acc.tenantName, acc.category, target);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 text-white overflow-hidden selection:bg-indigo-500 selection:text-white p-4 sm:p-6 lg:p-8">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Brand Showcase & Interactive Presets */}
        <div className="lg:col-span-6 space-y-8 pr-0 lg:pr-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-500 flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-500/30 ring-1 ring-white/20">
              L
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white">LeadFlow</span>
              <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                PRO 2.0
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Real-Time Lead Engine <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                Automated & Connected.
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
              Capture leads instantly from Meta Ads, route directly to sales executives via WhatsApp, and prevent missed follow-ups with automated SLA tracking.
            </p>
          </div>

          {/* Feature Highlight Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Meta Webhooks</p>
                <p className="text-[11px] text-emerald-400 font-mono">● Real-time Sync Active</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">10-Min SLA Engine</p>
                <p className="text-[11px] text-indigo-400 font-mono">● Auto-escalation</p>
              </div>
            </div>
          </div>

          {/* One-Click Quick Demo Login Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>⚡ ONE-CLICK DEMO LOGIN PRESETS</span>
              <span className="text-indigo-400 text-[11px]">Select persona to instant log in</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {DEMO_ACCOUNTS.map((acc, idx) => {
                const IconComponent = acc.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickDemoClick(acc)}
                    className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition duration-200 text-left group flex items-start gap-2.5 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 text-slate-400 flex items-center justify-center shrink-0 transition">
                      <IconComponent size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {acc.label}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {acc.tenantName}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Attractive Glassmorphism Login Card */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl ring-1 ring-white/10 space-y-6 relative overflow-hidden">
            
            {/* Ambient top highlight beam */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

            {/* Header / Portal Selector Tabs */}
            <div>
              <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPortal('CLIENT');
                    setEmail('vikram@apexrealestate.com');
                    setPassword('admin123');
                    setError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    selectedPortal === 'CLIENT'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 size={14} />
                  <span>Client / Team Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPortal('ADMIN');
                    setEmail('admin@leadflow.io');
                    setPassword('admin123');
                    setError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    selectedPortal === 'ADMIN'
                      ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck size={14} />
                  <span>Super Admin HQ</span>
                </button>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight">
                {selectedPortal === 'CLIENT' ? 'Welcome Back' : 'Super Admin Sign In'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your workspace credentials to access dashboard.
              </p>
            </div>

            {/* Error & Success Messages */}
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

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3.5 text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedPortal === 'CLIENT' ? 'vikram@apexrealestate.com' : 'admin@leadflow.io'}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-600 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-3.5 text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-600 transition"
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

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-slate-400">Keep me logged in</span>
                </label>
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
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account yet?{' '}
                <Link href="/" className="text-indigo-400 font-semibold hover:underline">
                  Back to Overview
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
