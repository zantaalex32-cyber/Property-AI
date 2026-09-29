import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KENYA_COUNTIES } from '../data/kenyaData';
import { PropertyCategory, ListingType } from '../types';
import {
  Sparkles,
  Search,
  MapPin,
  Building2,
  Calculator,
  Hammer,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Compass,
} from 'lucide-react';

interface HeroProps {
  onSearchSubmit?: () => void;
  onAssistantPrompt?: (prompt: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onAssistantPrompt }) => {
  const {
    setCurrentView,
    selectedCounty,
    setSelectedCounty,
    selectedCategory,
    setSelectedCategory,
    selectedListingType,
    setSelectedListingType,
    searchKeyword,
    setSearchKeyword,
  } = useApp();

  const [aiPromptInput, setAiPromptInput] = useState('');

  const quickPrompts = [
    'Find me a 2-bedroom apartment in Kisii under KSh 25,000 per month',
    'High-yield 2-bedroom in Kilimani Nairobi for Airbnb',
    'Serviced 1/4 acre residential plot in Tatu City Kiambu',
    'Ocean beachfront vacation villa in Nyali Mombasa',
  ];

  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = aiPromptInput.trim() || 'Find me a 2-bedroom apartment in Kisii under KSh 25,000 per month';
    if (onAssistantPrompt) {
      onAssistantPrompt(query);
    }
    setCurrentView('assistant');
  };

  const handleQuickPromptClick = (prompt: string) => {
    setAiPromptInput(prompt);
    if (onAssistantPrompt) {
      onAssistantPrompt(prompt);
    }
    setCurrentView('assistant');
  };

  const handleTraditionalSearch = () => {
    setCurrentView('marketplace');
    const elem = document.getElementById('marketplace-listings');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/5 via-stone-50 to-white dark:from-stone-900/40 dark:via-stone-900 dark:to-stone-950 pt-8 pb-16 px-4 sm:px-6 transition-colors border-b border-stone-200 dark:border-stone-800">
      {/* Subtle architectural background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Zanta Technologies · Kenya & East Africa</span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>ArdhiSasa & Title Deed Cross-Checked</span>
          </div>
        </div>

        {/* Core Headline Required by User */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-stone-900 dark:text-white leading-[1.15]">
            <span className="text-amber-600 dark:text-amber-400">Find it.</span>{' '}
            <span className="text-emerald-700 dark:text-emerald-400">Finance it.</span>{' '}
            <span className="text-stone-800 dark:text-stone-200">Build it.</span>{' '}
            <span className="text-amber-700 dark:text-amber-300">Live it.</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal max-w-2xl mx-auto">
            The all-in-one AI real estate ecosystem for Kenya. Discover verified properties,
            calculate SACCO & bank affordability, consult Gemini PropertyAI, and connect with
            licensed builders and conveyancing attorneys.
          </p>
        </div>

        {/* AI Natural Language Prompt Bar */}
        <div className="mt-8 max-w-3xl mx-auto">
          <form
            onSubmit={handleAiSearch}
            className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-stone-800/90 shadow-xl border border-stone-200 dark:border-stone-700/80 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2.5 pl-3 w-full sm:w-auto flex-1">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <input
                type="text"
                value={aiPromptInput}
                onChange={e => setAiPromptInput(e.target.value)}
                placeholder="Ask PropertyAI: 'Find me a 2-bedroom apartment in Kisii under KSh 25,000 per month'..."
                className="w-full text-xs sm:text-sm bg-transparent border-none text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none py-1.5"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>Ask Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Prompt Suggestion Chips */}
          <div className="mt-3 flex items-center flex-wrap gap-1.5 justify-center sm:justify-start">
            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mr-1">
              Try prompt:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPromptClick(prompt)}
                className="text-[11px] text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:underline bg-stone-100 dark:bg-stone-800/60 px-2.5 py-1 rounded-md transition border border-stone-200/60 dark:border-stone-700/60 text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Traditional Structured Search Filter Card */}
        <div className="mt-8 max-w-4xl mx-auto rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur p-4 sm:p-5 shadow-lg border border-stone-200/80 dark:border-stone-800 space-y-4">
          {/* Segmented Buy / Rent / Lease Controls */}
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
              {(['all', 'buy', 'rent', 'lease'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedListingType(type)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                    selectedListingType === type
                      ? 'bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-300 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All Listings' : type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('map')}
                className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-amber-500 transition"
              >
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                <span>Open Map View</span>
              </button>
            </div>
          </div>

          {/* Quick Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* County Selector */}
            <div>
              <label className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-1">
                County
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <select
                  value={selectedCounty}
                  onChange={e => setSelectedCounty(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {KENYA_COUNTIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Property Category */}
            <div>
              <label className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-1">
                Property Type
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value as PropertyCategory | 'All')}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Apartments">Apartments</option>
                  <option value="Houses">Houses & Villas</option>
                  <option value="Land">Land & Plots</option>
                  <option value="Commercial">Commercial Offices</option>
                  <option value="Student accommodation">Student Accommodation</option>
                  <option value="Vacation">Vacation & Holiday</option>
                </select>
              </div>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-1">
                Town / Neighborhood
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  placeholder="e.g. Nyanchwa, Kilimani..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                onClick={handleTraditionalSearch}
                className="w-full py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Properties</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Core Pillar Shortcut Modules */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setCurrentView('assistant')}
            className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-500 text-left transition group shadow-sm hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-stone-900 dark:text-white mb-1">
              AI Property Assistant
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
              Conversational Gemini concierge for queries, budget matches & market insights
            </p>
          </button>

          <button
            onClick={() => setCurrentView('affordability')}
            className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-500 text-left transition group shadow-sm hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-stone-900 dark:text-white mb-1">
              Affordability AI
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
              Calculate maximum purchase power with SACCO & bank mortgage stress tests
            </p>
          </button>

          <button
            onClick={() => setCurrentView('investment')}
            className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-500 text-left transition group shadow-sm hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-stone-900 dark:text-white mb-1">
              Investment Valuer
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
              Simulate gross & net rental yields, 5-year capital ROI and break-even timelines
            </p>
          </button>

          <button
            onClick={() => setCurrentView('build')}
            className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-500 text-left transition group shadow-sm hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Hammer className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-stone-900 dark:text-white mb-1">
              Build & Furnish
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
              Kenyan cement, roofing, artisan hardwood furniture, and NCA contractors
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};
