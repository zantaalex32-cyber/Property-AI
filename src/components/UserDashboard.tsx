import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property, ViewingRequest } from '../types';
import {
  Bookmark,
  Calendar,
  CreditCard,
  MessageSquare,
  Bell,
  User,
  ShieldCheck,
  Building,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  ArrowRight,
  FileCheck,
  Upload,
} from 'lucide-react';

interface UserDashboardProps {
  onOpenDetails: (property: Property) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onOpenDetails }) => {
  const {
    currentUser,
    properties,
    savedPropertyIds,
    toggleSaveProperty,
    viewingRequests,
    notifications,
    setCurrentView,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'saved'
    | 'viewings'
    | 'financing'
    | 'notifications'
    | 'profile'
  >('saved');

  // Filter saved properties
  const savedPropertiesList = properties.filter(p => savedPropertyIds.includes(p.id));

  // Simulated financing pre-qualification
  const [financingStatus, setFinancingStatus] = useState<'not_applied' | 'pending' | 'pre_approved'>('pre_approved');
  const [isVerifyingDocs, setIsVerifyingDocs] = useState(false);

  const handleSimulateKrcmApplication = () => {
    setIsVerifyingDocs(true);
    setTimeout(() => {
      setFinancingStatus('pre_approved');
      setIsVerifyingDocs(false);
      showToast('KMRC & SACCO mortgage pre-qualification updated: APPROVED up to KSh 14,500,000!', 'success');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Dashboard Top Profile Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600/10 via-emerald-600/10 to-stone-50 dark:to-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 overflow-hidden shadow-md">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white m-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-stone-900 dark:text-white font-display">
                {currentUser.name}
              </h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {currentUser.email || 'alex@zanta.co.ke'} · {currentUser.phone}
            </p>
            <div className="text-[11px] text-stone-400 mt-1">
              National ID Verified (ArdhiSasa linked) · KRA PIN Cleared
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('assistant')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open PropertyAI Chat</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto scrollbar-none text-xs">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeTab === 'saved'
              ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Properties ({savedPropertiesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('viewings')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeTab === 'viewings'
              ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Viewing Requests ({viewingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('financing')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeTab === 'financing'
              ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Financing Applications</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeTab === 'notifications'
              ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications ({notifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeTab === 'profile'
              ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Verification & Profile</span>
        </button>
      </div>

      {/* Tab 1: Saved Properties */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
              Your Shortlisted Kenyan Properties
            </h3>
            <span className="text-xs text-stone-500">
              {savedPropertiesList.length} properties saved
            </span>
          </div>

          {savedPropertiesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPropertiesList.map(prop => (
                <div
                  key={prop.id}
                  className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleSaveProperty(prop.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/70 text-rose-400 hover:text-white transition"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span>{prop.category}</span>
                        <span>·</span>
                        <span>{prop.county}</span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1">
                        {prop.title}
                      </h4>
                      <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400 font-display">
                        KSh {prop.priceKsh.toLocaleString()}
                        {prop.listingType === 'rent' ? '/mo' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => onOpenDetails(prop)}
                      className="w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-3">
              <Bookmark className="w-10 h-10 text-stone-400 mx-auto" />
              <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                You haven't saved any properties yet
              </h4>
              <p className="text-xs text-stone-500">
                Click the heart icon on any Kenyan property card to shortlist it here.
              </p>
              <button
                onClick={() => setCurrentView('marketplace')}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
              >
                Explore Marketplace
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Viewing Requests */}
      {activeTab === 'viewings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
              Scheduled Physical & Virtual Tours
            </h3>
            <span className="text-xs text-stone-500">
              Track status with assigned licensed agents
            </span>
          </div>

          <div className="space-y-3">
            {viewingRequests.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={req.propertyImage}
                    alt=""
                    className="w-20 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 dark:text-white text-sm">
                        {req.propertyTitle}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          req.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-500/20'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="text-stone-500 flex items-center gap-3">
                      <span>{req.propertyLocation}</span>
                      <span>·</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        KSh {req.propertyPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        Date: {req.date} ({req.timeSlot}) · {req.type.toUpperCase()} Tour
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[11px] text-stone-500 hidden sm:inline">
                    Agent assigned: Highland Crest Realtors
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Financing Applications */}
      {activeTab === 'financing' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
                  Kenya Mortgage & SACCO Pre-Qualification
                </h3>
                <p className="text-stone-500">
                  Pre-approved financing through KMRC partner institutions & Tier-1 SACCOs
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Pre-Approved Status</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 block">Pre-Approved Capital</span>
                <span className="text-xl font-extrabold text-stone-900 dark:text-white font-display">
                  KSh 14,500,000
                </span>
                <span className="text-[10px] text-emerald-600 block">Single-digit 9.5% KMRC tier</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 block">Eligible Monthly Repayment</span>
                <span className="text-xl font-extrabold text-stone-900 dark:text-white font-display">
                  KSh 95,000 / mo
                </span>
                <span className="text-[10px] text-stone-400 block">35% Gross Income Cap</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 block">Partner Banking Desks</span>
                <span className="text-sm font-bold text-stone-900 dark:text-white block pt-1">
                  KCB Bank, NCBA, Stima SACCO
                </span>
                <span className="text-[10px] text-stone-400 block">Direct loan origination</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-stone-500 text-[11px]">
                Want to stress test higher acquisition brackets or adjust your loan period?
              </span>
              <button
                onClick={() => setCurrentView('affordability')}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold flex items-center gap-1 shadow"
              >
                <span>Recalculate with Affordability AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
            Notification Log
          </h3>
          <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            {notifications.map(n => (
              <div key={n.id} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-semibold text-stone-900 dark:text-white">{n.title}</p>
                  <span className="text-[11px] text-stone-400">{n.time}</span>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Profile & Verification */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-6 text-xs max-w-2xl">
          <h3 className="text-base font-bold text-stone-900 dark:text-white font-display">
            National Identification & ArdhiSasa Verification
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  Kenyan National ID Verified
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  ID: 32***89 · Integrated with IPRS Kenya
                </span>
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  KRA PIN Tax Compliance Verified
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  PIN: A00***89P · Qualified for 7.5% MRI Tax
                </span>
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  ArdhiSasa Digital Land Registry Sync
                </span>
                <span className="text-[11px] text-stone-400">
                  Connected to Ministry of Lands digital deed portal
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white">
                Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
