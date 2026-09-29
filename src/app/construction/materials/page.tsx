'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Fuel
} from 'lucide-react';

interface MaterialItem {
  id: string;
  name: string;
  category: 'CEMENT' | 'STEEL' | 'SAND' | 'BRICKS' | 'EQUIPMENT';
  quantity: number;
  unit: string;
  minThreshold: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'CRITICAL';
}

export default function MaterialsPage() {
  const [materials] = useState<MaterialItem[]>([
    { id: 'mat-1', name: 'UltraTech OPC 53 Grade Cement', category: 'CEMENT', quantity: 450, unit: 'Bags', minThreshold: 200, status: 'IN_STOCK' },
    { id: 'mat-2', name: 'Tata Tiscon 16mm TMT Steel Rods', category: 'STEEL', quantity: 3.5, unit: 'Tons', minThreshold: 5.0, status: 'LOW_STOCK' },
    { id: 'mat-3', name: 'M-Sand River Gravel', category: 'SAND', quantity: 8, unit: 'Truck Loads', minThreshold: 3, status: 'IN_STOCK' },
    { id: 'mat-4', name: 'Red Clay Solid Bricks', category: 'BRICKS', quantity: 12000, unit: 'Pcs', minThreshold: 5000, status: 'IN_STOCK' },
    { id: 'mat-5', name: 'JCB 3DX Excavator Rental', category: 'EQUIPMENT', quantity: 2, unit: 'Units Active', minThreshold: 1, status: 'IN_STOCK' }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              SITE INVENTORY &amp; LOGISTICS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              MATERIAL &amp; MACHINERY LOG
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Material Stocks &amp; Equipment Rental Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor cement bags, TMT steel tonnage, M-Sand loads, JCB rentals, and low-stock reorder triggers.
          </p>
        </div>

        <button
          onClick={() => alert('Log New Inward Stock Receipt!')}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          <Plus size={16} />
          <span>Inward Stock Receipt</span>
        </button>
      </div>

      {/* Materials Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Boxes size={18} className="text-amber-600" />
          Construction Material Inventory Status
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Material / Machinery Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Site Quantity</th>
                <th className="py-3 px-4">Minimum Threshold</th>
                <th className="py-3 px-4 text-right">Inventory Alert Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{m.name}</td>
                  <td className="py-3.5 px-4 font-semibold text-amber-700 dark:text-amber-400">{m.category}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {m.quantity} {m.unit}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{m.minThreshold} {m.unit}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        m.status === 'IN_STOCK'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {m.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
