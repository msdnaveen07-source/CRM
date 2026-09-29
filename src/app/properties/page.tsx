'use client';

import React, { useState } from 'react';
import {
  Building2,
  Home,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  Key,
  MapPin,
  Sparkles,
  Share2
} from 'lucide-react';

interface PropertyUnit {
  id: string;
  projectName: string;
  unitNo: string;
  type: 'VILLA' | '2BHK' | '3BHK' | 'PENTHOUSE';
  sqft: number;
  priceLakhs: number;
  status: 'AVAILABLE' | 'BLOCKED' | 'SOLD' | 'TOKEN_RECEIVED';
  floor: string;
  facing: string;
}

export default function PropertiesPage() {
  const [selectedProject, setSelectedProject] = useState('Apex Luxury Palms');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [units, setUnits] = useState<PropertyUnit[]>([
    { id: 'u-101', projectName: 'Apex Luxury Palms', unitNo: 'Villa 12-A', type: 'VILLA', sqft: 3400, priceLakhs: 185, status: 'AVAILABLE', floor: 'G+2', facing: 'East' },
    { id: 'u-102', projectName: 'Apex Luxury Palms', unitNo: 'Villa 14-B', type: 'VILLA', sqft: 3800, priceLakhs: 210, status: 'BLOCKED', floor: 'G+2', facing: 'North-East' },
    { id: 'u-103', projectName: 'Apex Luxury Palms', unitNo: 'Villa 15-A', type: 'VILLA', sqft: 4200, priceLakhs: 245, status: 'SOLD', floor: 'G+2', facing: 'East' },
    { id: 'u-104', projectName: 'Apex Luxury Palms', unitNo: 'Apt 402', type: '3BHK', sqft: 1850, priceLakhs: 98, status: 'TOKEN_RECEIVED', floor: '4th Floor', facing: 'South-East' },
    { id: 'u-105', projectName: 'Apex Luxury Palms', unitNo: 'Apt 501', type: '2BHK', sqft: 1420, priceLakhs: 74, status: 'AVAILABLE', floor: '5th Floor', facing: 'North' },
    { id: 'u-106', projectName: 'Greenwood Estates', unitNo: 'Plot 45', type: 'VILLA', sqft: 2400, priceLakhs: 120, status: 'AVAILABLE', floor: 'Land Plot', facing: 'East' }
  ]);

  const filteredUnits = units.filter(u => {
    const matchesProj = selectedProject === 'ALL' || u.projectName === selectedProject;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesSearch = u.unitNo.toLowerCase().includes(searchQuery.toLowerCase()) || u.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProj && matchesStatus && matchesSearch;
  });

  const availableCount = units.filter(u => u.status === 'AVAILABLE').length;
  const blockedCount = units.filter(u => u.status === 'BLOCKED' || u.status === 'TOKEN_RECEIVED').length;
  const soldCount = units.filter(u => u.status === 'SOLD').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              REAL ESTATE CRM MODULE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              PROPERTY INVENTORY CATALOG
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Property Listings &amp; Inventory Status
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track available villas, apartment units, pricing, floor plans, and live unit booking statuses.
          </p>
        </div>

        <button
          onClick={() => alert('Add Property Unit modal triggered!')}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          <Plus size={16} />
          <span>Add Property Unit</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Inventory</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{units.length} Units</p>
          <span className="text-[10px] text-indigo-600 font-semibold">Across All Projects</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Available for Sale</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{availableCount} Units</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Ready for Site Visit</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Blocked / Token</span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{blockedCount} Units</p>
          <span className="text-[10px] text-amber-600 font-semibold">Token Advance Received</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase">Sold Out</span>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{soldCount} Units</p>
          <span className="text-[10px] text-rose-600 font-semibold">Registration Completed</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white py-2 px-3 rounded-xl outline-none"
            >
              <option value="Apex Luxury Palms">Apex Luxury Palms</option>
              <option value="Greenwood Estates">Greenwood Estates</option>
              <option value="ALL">All Projects</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white py-2 px-3 rounded-xl outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">Available Only</option>
              <option value="BLOCKED">Blocked</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search villa or unit number..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {filteredUnits.map((unit) => (
            <div key={unit.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm hover:border-indigo-500 transition">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded">
                    {unit.type} • {unit.facing} Facing
                  </span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-1">
                    {unit.unitNo}
                  </h3>
                  <p className="text-xs text-slate-500">{unit.projectName}</p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    unit.status === 'AVAILABLE'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : unit.status === 'BLOCKED' || unit.status === 'TOKEN_RECEIVED'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {unit.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Built-up Area</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{unit.sqft} Sq.Ft</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Listing Price</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">₹{unit.priceLakhs} Lakhs</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => alert(`Property brochure & floor plan sent to buyer on WhatsApp for ${unit.unitNo}!`)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
                >
                  <Share2 size={14} className="text-emerald-500" />
                  <span>Share Floor Plan via WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
