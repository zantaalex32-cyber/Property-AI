import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Users,
  Building,
  Sparkles,
  TrendingUp,
  Globe2,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Check,
  X,
  Server,
  Activity,
  Layers,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    properties,
    totalAiQueriesCount,
    switchRole,
    currentUser,
    regionalMarkets,
    toggleRegionalMarket,
    showToast,
  } = useApp();

  // Verification queue state
  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 'ver-01',
      entityName: 'Highland Crest Realtors Ltd',
      type: 'Estate Agency License',
      regBody: 'Estate Agents Registration Board (EARB)',
      docNumber: 'EARB/2026/KS099',
      county: 'Kisii',
      submittedDate: '2026-03-26',
      status: 'pending',
    },
    {
      id: 'ver-02',
      entityName: 'Tatu City Plot #419 Kijani Ridge',
      type: 'Freehold Title Deed Registry Search',
      regBody: 'Ministry of Lands ArdhiSasa',
      docNumber: 'IR 23901/4',
      county: 'Kiambu',
      submittedDate: '2026-03-27',
      status: 'pending',
    },
    {
      id: 'ver-03',
      entityName: 'Apex Structural Civil Engineering',
      type: 'NCA-1 Main Contractor License',
      regBody: 'National Construction Authority (NCA)',
      docNumber: 'NCA1/BLD/2026/89',
      county: 'Nairobi',
      submittedDate: '2026-03-28',
      status: 'pending',
    },
  ]);

  const handleApprove = (id: string, name: string) => {
    setPendingVerifications(prev =>
      prev.map(v => (v.id === id ? { ...v, status: 'approved' } : v))
    );
    showToast(`Verification APPROVED for ${name}. Badge granted.`, 'success');
  };

  const handleReject = (id: string, name: string) => {
    setPendingVerifications(prev =>
      prev.map(v => (v.id === id ? { ...v, status: 'rejected' } : v))
    );
    showToast(`Verification flagged for additional documentation from ${name}`, 'warning');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Zanta Technologies Platform Administration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white font-display">
            Admin Command Center & East Africa Operations
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Real-time telemetry, verification queues, Gemini AI usage, and cross-border expansion controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-medium">Logged as Admin:</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            Full Governance Mode
          </span>
        </div>
      </div>

      {/* High-Level Platform KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 block font-medium">Gross Marketplace GMV</span>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-display">
            KSh 428.5M
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">+24.8% growth MoM</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 block font-medium">Total Listings Managed</span>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-display">
            {properties.length} Active
          </div>
          <span className="text-[10px] text-stone-400 block">Across 7 Kenyan Counties</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 block font-medium">Gemini 3.8 Flash AI Queries</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-display">
            {totalAiQueriesCount} Calls
          </div>
          <span className="text-[10px] text-amber-600 font-semibold block">99.4% Sub-second latency</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 block font-medium">Registered Ecosystem Users</span>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-display">
            3,410
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">Buyers, Tenants & Agents</span>
        </div>
      </div>

      {/* East African Regional Expansion Switchboard */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              East African Community (EAC) Territorial Expansion
            </h3>
          </div>
          <span className="text-[11px] text-stone-400">Scale architecture ready</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(regionalMarkets).map(([country, isActive]) => (
            <div
              key={country}
              className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                isActive
                  ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-stone-900 dark:text-white font-display">
                    {country}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isActive
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {isActive ? 'ACTIVE MARKET' : 'STAGED'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  {country === 'Kenya'
                    ? 'All 47 Counties live (Nairobi & Kisii primary hubs)'
                    : country === 'Uganda'
                    ? 'Kampala, Entebbe, Jinja corridor integration'
                    : country === 'Tanzania'
                    ? 'Dar es Salaam, Arusha, Dodoma digital registry'
                    : 'Kigali Master Plan sectional titling compliance'}
                </p>
              </div>

              {country !== 'Kenya' && (
                <button
                  onClick={() => toggleRegionalMarket(country)}
                  className={`w-full py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  {isActive ? 'Disable Pilot' : 'Activate Market Pilot'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Verification & Due Diligence Queue
            </h3>
          </div>
          <span className="text-[11px] text-stone-400">
            {pendingVerifications.filter(v => v.status === 'pending').length} pending review
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 text-[11px] uppercase">
                <th className="pb-3 font-semibold">Entity / Asset</th>
                <th className="pb-3 font-semibold">Verification Request</th>
                <th className="pb-3 font-semibold">Regulatory Body</th>
                <th className="pb-3 font-semibold">Reference</th>
                <th className="pb-3 font-semibold">Submitted</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {pendingVerifications.map(item => (
                <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition">
                  <td className="py-3 font-bold text-stone-900 dark:text-white">
                    {item.entityName}
                  </td>
                  <td className="py-3 text-stone-600 dark:text-stone-300">
                    {item.type}
                  </td>
                  <td className="py-3 text-stone-500">
                    {item.regBody}
                  </td>
                  <td className="py-3 font-mono text-stone-600 dark:text-stone-400">
                    {item.docNumber}
                  </td>
                  <td className="py-3 text-stone-400">
                    {item.submittedDate}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        item.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : item.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    {item.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(item.id, item.entityName)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item.id, item.entityName)}
                          className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 hover:bg-stone-100"
                        >
                          Flag
                        </button>
                      </>
                    ) : (
                      <span className="text-stone-400 italic">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Switcher Sandbox for Evaluators */}
      <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
          <Users className="w-4 h-4" />
          <span>Role Switcher Sandbox for Evaluation</span>
        </div>
        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
          Switch the active role below to inspect how Zanta PropertyAI adapts views for each participant in the ecosystem:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {(
            [
              'buyer',
              'tenant',
              'seller',
              'agent',
              'developer',
              'professional',
              'admin',
            ] as UserRole[]
          ).map(r => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition ${
                currentUser.role === r
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500'
              }`}
            >
              {r} View
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
