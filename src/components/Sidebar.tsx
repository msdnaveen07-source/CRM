'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Users,
  Inbox,
  Clock,
  Megaphone,
  BarChart3,
  FileSpreadsheet,
  Share2,
  MessageSquare,
  Send,
  UserCog,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Bell,
  Search,
  Sparkles,
  Zap,
  BookOpen,
  GraduationCap,
  FileText,
  Award,
  CalendarCheck,
  Building2,
  MapPin,
  Key,
  Globe,
  HardHat,
  Boxes,
  Activity
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user, theme, setTheme, switchRole, setCommandPaletteOpen } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const isSuperAdmin = user.role === 'SUPER_ADMIN';
  const isTeacher = user.role === 'TEACHER';
  const category = user.businessCategory || 'REAL_ESTATE';

  // Dedicated Teacher Navigation
  const teacherNav = [
    { name: 'Teacher Portal (Attendance & GPS)', href: '/teacher', icon: BookOpen },
    { name: 'Homework & Assignments', href: '/teacher/homework', icon: FileText },
    { name: 'Exam Marks & Grading', href: '/teacher/marks', icon: Award },
    { name: 'Student Leave Requests', href: '/teacher/leave-requests', icon: CalendarCheck },
    { name: 'Parent WhatsApp Hub', href: '/whatsapp-hub', icon: MessageSquare }
  ];

  // Dynamic Navigation per Category
  const getClientNav = () => {
    if (category === 'EDUCATION') {
      return [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Student Admissions', href: '/leads', icon: Inbox },
        { name: 'Teacher Portal', href: '/teacher', icon: BookOpen },
        { name: 'Manage Teachers', href: '/teachers-manage', icon: GraduationCap },
        { name: 'WhatsApp Complete Hub', href: '/whatsapp-hub', icon: MessageSquare },
        { name: 'Follow-ups', href: '/followups', icon: Clock },
        { name: 'Reports', href: '/reports', icon: FileSpreadsheet }
      ];
    }

    if (category === 'CONSTRUCTION') {
      return [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Client Inquiries', href: '/leads', icon: Inbox },
        { name: 'Construction Sites', href: '/construction/projects', icon: HardHat },
        { name: 'Materials & Machinery', href: '/construction/materials', icon: Boxes },
        { name: 'Labour & Subcontractors', href: '/construction/labour', icon: Users },
        { name: 'Stage Bills & Blueprints', href: '/construction/bills', icon: FileSpreadsheet },
        { name: 'WhatsApp Complete Hub', href: '/whatsapp-hub', icon: MessageSquare },
        { name: 'Follow-ups', href: '/followups', icon: Clock },
        { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Reports', href: '/reports', icon: FileSpreadsheet }
      ];
    }

    // Default Real Estate Category Nav
    return [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Property Inquiries', href: '/leads', icon: Inbox },
      { name: 'Property Listings', href: '/properties', icon: Building2 },
      { name: 'Site Visit Scheduler', href: '/site-visits', icon: MapPin },
      { name: 'Bookings & Advances', href: '/bookings', icon: Key },
      { name: 'WhatsApp Complete Hub', href: '/whatsapp-hub', icon: MessageSquare },
      { name: 'Follow-ups', href: '/followups', icon: Clock },
      { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Reports', href: '/reports', icon: FileSpreadsheet }
    ];
  };

  const clientNav = getClientNav();

  const integrationNav = [
    { name: 'Website Lead API', href: '/integrations/website', icon: Globe },
    { name: 'Meta Ads', href: '/integrations/meta', icon: Share2 },
    { name: 'WhatsApp', href: '/integrations/whatsapp', icon: MessageSquare }
  ];

  const adminNav = [
    { name: 'Super Admin HQ', href: '/admin', icon: ShieldAlert },
    { name: 'Client Manager', href: '/admin/clients', icon: Users },
    { name: 'System Health', href: '/admin/health', icon: Activity }
  ];

  const settingsNav = [
    { name: 'Team Members', href: '/team', icon: UserCog },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <Link href={isTeacher ? '/teacher' : isSuperAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            {isTeacher ? 'T' : category === 'CONSTRUCTION' ? 'C' : 'L'}
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                {isTeacher ? 'Teacher Portal' : 'LeadFlow'}
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold tracking-wide uppercase mt-1">
                {isTeacher ? 'Oxford Faculty' : category.replace('_', ' ')}
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Quick Search Ctrl+K Button */}
      {!collapsed && !isTeacher && (
        <div className="px-4 py-3">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <span className="flex items-center gap-2">
              <Search size={16} />
              <span>Search leads...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 text-slate-500 rounded border border-slate-300 dark:border-slate-700">
              Ctrl K
            </kbd>
          </button>
        </div>
      )}

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {/* IF TEACHER: Display only Teacher Nav */}
        {isTeacher ? (
          <div>
            {!collapsed && (
              <p className="px-3 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                Faculty Navigation
              </p>
            )}
            <div className="space-y-1">
              {teacherNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      active
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon size={18} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Super Admin Nav */}
            {isSuperAdmin && (
              <div>
                {!collapsed && (
                  <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Super Admin HQ
                  </p>
                )}
                <div className="space-y-1">
                  {adminNav.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                          active
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <item.icon size={18} />
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Client Core Nav */}
            <div>
              {!collapsed && (
                <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Main Navigation
                </p>
              )}
              <div className="space-y-1">
                {clientNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        active
                          ? 'bg-slate-900 text-white dark:bg-indigo-600'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <item.icon size={18} />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Integrations Nav */}
            {user.role !== 'SALES_USER' && (
              <div>
                {!collapsed && (
                  <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Integrations
                  </p>
                )}
                <div className="space-y-1">
                  {integrationNav.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                          active
                            ? 'bg-slate-900 text-white dark:bg-indigo-600'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <item.icon size={18} />
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Management Nav */}
            <div>
              {!collapsed && (
                <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Management
                </p>
              )}
              <div className="space-y-1">
                {settingsNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        active
                          ? 'bg-slate-900 text-white dark:bg-indigo-600'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <item.icon size={18} />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Profile & Switch Role */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between px-2 py-1">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user.role}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('leadflow-user');
                window.location.href = '/login';
              }}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
