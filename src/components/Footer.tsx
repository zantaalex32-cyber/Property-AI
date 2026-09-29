import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles, Building, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 transition-colors">
      {/* Ecosystem Pillars Callout */}
      <div className="border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">01. Find It</span>
              <h4 className="text-white text-sm font-semibold">AI Discovery & Interactive Map</h4>
              <p className="text-xs text-stone-400">Natural language search across Kenya’s 47 counties</p>
            </div>
            <div className="space-y-1">
              <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">02. Finance It</span>
              <h4 className="text-white text-sm font-semibold">Affordability AI & SACCOs</h4>
              <p className="text-xs text-stone-400">Stress-tested mortgage & SACCO eligibility models</p>
            </div>
            <div className="space-y-1">
              <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">03. Build It</span>
              <h4 className="text-white text-sm font-semibold">Materials & Contractors</h4>
              <p className="text-xs text-stone-400">NCA-1 builders, BORAQS architects & certified hardware</p>
            </div>
            <div className="space-y-1">
              <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">04. Live It</span>
              <h4 className="text-white text-sm font-semibold">Verified Properties & Legal</h4>
              <p className="text-xs text-stone-400">ArdhiSasa digital titling cross-checks & tenancy care</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-base">
                Z
              </div>
              <span className="font-extrabold text-lg text-white font-display">Zanta PropertyAI</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              An all-in-one digital property ecosystem engineered by{' '}
              <strong className="text-stone-200">Zanta Technologies</strong>. Connecting discovery,
              financing, architectural design, construction, and property management across East Africa.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Nairobi HQ: The Mirage Tower, Chiromo Road, Westlands</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Western Regional Hub: Nyanchwa Hill Executive Plaza, Kisii</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>contact@zanta.co.ke · support@zantaproperty.ai</span>
              </div>
            </div>
          </div>

          {/* Platform Modules */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('marketplace')}
                  className="text-stone-400 hover:text-white transition"
                >
                  Kenyan Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('map')}
                  className="text-stone-400 hover:text-white transition"
                >
                  Interactive Map Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('assistant')}
                  className="text-stone-400 hover:text-white transition flex items-center gap-1"
                >
                  <span>PropertyAI Assistant</span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('affordability')}
                  className="text-stone-400 hover:text-white transition"
                >
                  Affordability Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('investment')}
                  className="text-stone-400 hover:text-white transition"
                >
                  Investment ROI Valuer
                </button>
              </li>
            </ul>
          </div>

          {/* Build & Services */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Build & Pros</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('build')}
                  className="text-stone-400 hover:text-white transition"
                >
                  Building Materials
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('build')}
                  className="text-stone-400 hover:text-white transition"
                >
                  Kenyan Hardwood Furniture
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('professionals')}
                  className="text-stone-400 hover:text-white transition"
                >
                  NCA Contractors
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('professionals')}
                  className="text-stone-400 hover:text-white transition"
                >
                  BORAQS Architects
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('professionals')}
                  className="text-stone-400 hover:text-white transition"
                >
                  Conveyancing Lawyers (LSK)
                </button>
              </li>
            </ul>
          </div>

          {/* East African Growth & Admin */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Regional Growth</h5>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-stone-300">
                <span>Kenya (All 47 Counties)</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  Live
                </span>
              </li>
              <li className="flex items-center justify-between text-stone-400">
                <span>Uganda (Kampala)</span>
                <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                  Staged
                </span>
              </li>
              <li className="flex items-center justify-between text-stone-400">
                <span>Tanzania (Dar es Salaam)</span>
                <span className="text-[10px] text-stone-400">Planned</span>
              </li>
              <li className="flex items-center justify-between text-stone-400">
                <span>Rwanda (Kigali)</span>
                <span className="text-[10px] text-stone-400">Planned</span>
              </li>
              <li className="pt-2 border-t border-stone-800">
                <button
                  onClick={() => setCurrentView('admin-dashboard')}
                  className="text-amber-500 hover:text-amber-400 text-xs font-semibold flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Command Center</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner Required by Instructions */}
        <div className="mt-10 pt-6 border-t border-stone-800/80">
          <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 text-xs text-stone-400 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Sample Demonstration Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Zanta PropertyAI prototype by Zanta Technologies contains realistic sample listings, simulated property prices,
              financing rates, agent profiles, and verification badges for demonstration and evaluation purposes. Values are indicative
              and do not constitute certified financial or conveyancing advice. Title transfers in Kenya require formal search via
              ArdhiSasa and county registries.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <div>
              © 2026 Zanta Technologies. All rights reserved. “Find it. Finance it. Build it. Live it.”
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Terms of Service</span>
              <span>·</span>
              <span>Privacy Policy</span>
              <span>·</span>
              <span>East African Community Protocols</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
