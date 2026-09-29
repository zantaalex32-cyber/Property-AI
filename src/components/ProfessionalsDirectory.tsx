import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PROFESSIONALS, KENYA_COUNTIES } from '../data/kenyaData';
import { Professional } from '../types';
import {
  Users,
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Award,
  CheckCircle,
  Calendar,
  X,
  Search,
} from 'lucide-react';

export const ProfessionalsDirectory: React.FC = () => {
  const { showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCounty, setSelectedCounty] = useState<string>('All Counties');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProfessional, setActiveProfessional] = useState<Professional | null>(null);

  // Booking consultation modal state
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBookingDone, setIsBookingDone] = useState(false);

  const categories = [
    'All',
    'Real estate agent',
    'Property developer',
    'Contractor',
    'Architect',
    'Property valuer',
    'Interior designer',
    'Property lawyer',
  ];

  const filteredPros = useMemo(() => {
    return PROFESSIONALS.filter(pro => {
      if (selectedCategory !== 'All' && pro.category !== selectedCategory) {
        return false;
      }
      if (selectedCounty !== 'All Counties' && pro.county !== selectedCounty) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          pro.name.toLowerCase().includes(q) ||
          pro.firm.toLowerCase().includes(q) ||
          pro.town.toLowerCase().includes(q) ||
          pro.regBody.toLowerCase().includes(q) ||
          pro.bio.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, selectedCounty, searchQuery]);

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      showToast('Please select a preferred consultation date', 'warning');
      return;
    }
    setIsBookingDone(true);
    setTimeout(() => {
      showToast(`Consultation booked with ${activeProfessional?.name}! Confirmation sent to your email.`, 'success');
      setActiveProfessional(null);
      setIsBookingDone(false);
      setBookingDate('');
      setBookingNotes('');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-500/20 mb-2">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>Verified Professionals Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white font-display">
            Licensed Advocates, Valuers, Architects & Realtors
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl">
            Directly connect with vetted experts certified by BORAQS, EARB, Law Society of Kenya (LSK),
            and Institution of Surveyors of Kenya (ISK).
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search lawyers, valuers, architects..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap capitalize transition ${
                selectedCategory === cat
                  ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat === 'All' ? 'All Professionals' : cat}
            </button>
          ))}
        </div>

        {/* County Select */}
        <div className="shrink-0 text-xs">
          <select
            value={selectedCounty}
            onChange={e => setSelectedCounty(e.target.value)}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
          >
            {KENYA_COUNTIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Professionals Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPros.map(pro => (
          <div
            key={pro.id}
            className="group rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/60 transition-all duration-300 p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              {/* Profile Avatar & Title */}
              <div className="flex items-start gap-4">
                <img
                  src={pro.avatar}
                  alt={pro.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-100 dark:border-stone-800 shadow shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-base text-stone-900 dark:text-white group-hover:text-amber-600 transition-colors">
                      {pro.name}
                    </h3>
                    {pro.verified && (
                      <span title="Statutory Body Verified">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 capitalize">
                    {pro.category}
                  </p>
                  <p className="text-xs text-stone-500">{pro.firm}</p>
                </div>
              </div>

              {/* Regulatory License Badge (Zero-pill text format) */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 space-y-1 text-xs">
                <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                  <span className="font-semibold">{pro.regBody}</span>
                  <span className="text-[11px] text-emerald-600 font-bold">Active Member</span>
                </div>
                <div className="text-[10px] text-stone-400 font-mono">
                  License: {pro.licenseNo} · {pro.experienceYears} Years Practice
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                {pro.bio}
              </p>

              {/* Specializations */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Specializations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {pro.specializations.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{pro.town}, {pro.county}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${pro.phone.replace(/\s+/g, '')}`}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
                  title="Direct Phone"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActiveProfessional(pro)}
                  className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 shadow transition"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consult</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Consultation Booking Modal */}
      {activeProfessional && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 animate-in fade-in duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
                  Book Professional Consultation
                </h3>
                <p className="text-stone-500 text-[11px]">
                  Direct advisory session with {activeProfessional.name}
                </p>
              </div>
              <button
                onClick={() => setActiveProfessional(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center gap-3">
              <img
                src={activeProfessional.avatar}
                alt=""
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="space-y-0.5">
                <h5 className="font-bold text-xs text-stone-900 dark:text-white">
                  {activeProfessional.name}
                </h5>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold capitalize">
                  {activeProfessional.category} · {activeProfessional.firm}
                </p>
                <p className="text-[10px] text-stone-400">
                  {activeProfessional.regBody} ({activeProfessional.licenseNo})
                </p>
              </div>
            </div>

            <form onSubmit={handleBookConsultation} className="space-y-3.5">
              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Preferred Consultation Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setBookingDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Brief Consultation Topic / Due Diligence Needs
                </label>
                <textarea
                  rows={3}
                  value={bookingNotes}
                  onChange={e => setBookingNotes(e.target.value)}
                  placeholder="e.g. Need title search and deed verification for a plot in Kisii; structural architectural plan for 4-storey apartments in Nairobi..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveProfessional(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBookingDone}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 shadow transition"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isBookingDone ? 'Confirming...' : 'Confirm Appointment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
