'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Building2,
  Inbox,
  AlertTriangle,
  Activity,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  UserCheck,
  Edit2
} from 'lucide-react';
import { Tenant } from '@/types';

import { useRouter } from 'next/navigation';

export default function SuperAdminPage() {
  const router = useRouter();
  const { user, switchRole, isLoaded } = useApp();
  const [clients, setClients] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  // New Client Form state
  const [newClient, setNewClient] = useState({
    businessName: '',
    clientName: '',
    email: '',
    phone: '',
    businessCategory: 'REAL_ESTATE',
    plan: 'PRO' as Tenant['plan'],
    leadLimit: 5000,
    whatsAppNumber: '',
    timezone: 'Asia/Kolkata',
    password: ''
  });

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/admin/clients', {
        headers: { 'x-user-role': user.role, 'x-tenant-id': user.tenantId }
      });
      const data = await res.json();
      if (data.success) setClients(data.clients);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    
    if (user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
      return;
    }
    fetchClients();
  }, [user.role, router, isLoaded]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/admin/clients';
      const method = isEditing ? 'PUT' : 'POST';
      const payload = isEditing ? { ...newClient, id: editingClientId } : newClient;

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-user-role': user.role,
          'x-tenant-id': user.tenantId
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setIsEditing(false);
        setEditingClientId(null);
        fetchClients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingClientId(null);
    setNewClient({
      businessName: '',
      clientName: '',
      email: '',
      phone: '',
      businessCategory: 'REAL_ESTATE',
      plan: 'PRO',
      leadLimit: 5000,
      whatsAppNumber: '',
      timezone: 'Asia/Kolkata',
      password: ''
    });
    setShowCreateModal(true);
  };

  const openEditModal = (client: Tenant) => {
    setIsEditing(true);
    setEditingClientId(client.id);
    setNewClient({
      businessName: client.name,
      clientName: '', // Hard to get from Tenant if User isn't joined, let's leave empty or fetch
      email: client.email,
      phone: client.phone,
      businessCategory: client.businessCategory as any,
      plan: client.plan as any,
      leadLimit: client.leadLimit || 5000,
      whatsAppNumber: client.whatsAppNumber || client.phone,
      timezone: client.timezone || 'Asia/Kolkata',
      password: '' // Keep empty to not update password
    });
    setShowCreateModal(true);
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === 'ACTIVE').length;
  const totalLeadsToday = clients.reduce((acc, c) => acc + (c.leadCountToday || 0), 0);
  const totalLeadsMonth = clients.reduce((acc, c) => acc + (c.leadCountMonth || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Good morning, Admin
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              SaaS Owner HQ
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor your multi-tenant clients, Meta webhooks, system health and lead flow.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition shadow-sm"
        >
          <Plus size={16} />
          <span>Create New Client</span>
        </button>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Clients
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalClients}</p>
          <span className="text-[11px] text-slate-400">All registered tenants</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Clients
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {activeClients}
          </p>
          <span className="text-[11px] text-emerald-600/80 font-medium">100% active status</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Leads Today
          </p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            {totalLeadsToday}
          </p>
          <span className="text-[11px] text-slate-400">Across all clients</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Leads This Month
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalLeadsMonth}</p>
          <span className="text-[11px] text-slate-400">Total volume captured</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Missed Leads SLA
          </p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">1</p>
          <span className="text-[11px] text-amber-600 font-medium">Flagged &gt;10m</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            System Health
          </p>
          <p className="text-2xl font-bold text-emerald-500 mt-2">99.9%</p>
          <span className="text-[11px] text-emerald-500 font-medium">All services online</span>
        </div>
      </div>

      {/* System Health Status Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity size={16} className="text-indigo-600" />
          Infrastructure & System Health
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-1">Meta API</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={13} /> CONNECTED
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-1">WhatsApp API</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={13} /> CONNECTED
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-1">Webhook Ingestion</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={13} /> HEALTHY (0ms latency)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-1">10-Min Reconciliation</span>
            <span className="font-bold text-indigo-600 flex items-center gap-1">
              <Activity size={13} /> RUNNING (Last 2m ago)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-1">PostgreSQL Database</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={13} /> HEALTHY
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-1">Background Workers</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={13} /> ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Client Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Client Tenants Management
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage client accounts, inspect Meta/WhatsApp status and execute secure audited impersonations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none border border-transparent focus:border-indigo-500 w-48 md:w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Client / Business</th>
                <th className="py-3.5 px-5">Plan</th>
                <th className="py-3.5 px-5">Leads Today</th>
                <th className="py-3.5 px-5">Leads Month</th>
                <th className="py-3.5 px-5">Meta Integration</th>
                <th className="py-3.5 px-5">WhatsApp</th>
                <th className="py-3.5 px-5">Last Sync</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                >
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">
                      {client.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {client.email} | {client.phone}
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {client.plan}
                    </span>
                  </td>

                  <td className="py-4 px-5 font-semibold text-slate-900 dark:text-white">
                    {client.leadCountToday || 0}
                  </td>

                  <td className="py-4 px-5 font-semibold text-slate-900 dark:text-white">
                    {client.leadCountMonth || 0}
                  </td>

                  <td className="py-4 px-5">
                    {client.metaConnected ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 size={13} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                        <XCircle size={13} /> Pending setup
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-5">
                    {client.whatsAppConnected ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 size={13} /> Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                        <XCircle size={13} /> Not connected
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-5 text-slate-500 dark:text-slate-400">
                    {client.lastSyncAt ? new Date(client.lastSyncAt).toLocaleTimeString() : 'N/A'}
                  </td>

                  <td className="py-4 px-5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {client.status}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(client)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs transition inline-flex items-center gap-1"
                      title="Edit Client"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Client Account' : 'Create New Client Tenant Account'}
            </h3>
            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Properties Ltd"
                  value={newClient.businessName}
                  onChange={(e) => setNewClient({ ...newClient, businessName: e.target.value })}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Client Admin Name {isEditing && '(Optional)'}
                  </label>
                  <input
                    type="text"
                    required={!isEditing}
                    placeholder="e.g. Sarah Connor"
                    value={newClient.clientName}
                    onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@acme.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value, whatsAppNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Login Password {isEditing && '(Leave empty to keep current)'}
                  </label>
                  <input
                    type="text"
                    required={!isEditing}
                    placeholder="Enter password for client"
                    value={newClient.password}
                    onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Business Category
                  </label>
                  <select
                    value={newClient.businessCategory}
                    onChange={(e) => setNewClient({ ...newClient, businessCategory: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="REAL_ESTATE">REAL ESTATE</option>
                    <option value="EDUCATION">EDUCATION (Schools &amp; Academies)</option>
                    <option value="SOLAR_ENERGY">SOLAR &amp; RENEWABLE</option>
                    <option value="FITNESS">FITNESS &amp; HEALTH</option>
                    <option value="GENERAL_CRM">GENERAL CRM</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-slate-500 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-500"
                >
                  {isEditing ? 'Save Changes' : 'Generate Client Login & Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
