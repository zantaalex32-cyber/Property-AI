import React, { useState } from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  TrendingUp,
  Calculator,
  Compass,
  Building,
  ChevronLeft,
  ChevronRight,
  Eye,
  Star,
  Sparkles,
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onRequestViewing: (property: Property) => void;
  onAnalyzeInvestment: (property: Property) => void;
  onCheckAffordability: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onRequestViewing,
  onAnalyzeInvestment,
  onCheckAffordability,
}) => {
  const { isPropertySaved, toggleSaveProperty, showToast } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

  const saved = isPropertySaved(property.id);

  const formattedPriceKsh = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(property.priceKsh).replace('KES', 'KSh');

  // Approximate USD conversion (1 USD ~ 130 KSh)
  const approxUsd = Math.round(property.priceKsh / 130);
  const formattedUsd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(approxUsd);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Property link copied to clipboard', 'info');
    }
  };

  const handlePrevImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Sticky Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-white/95 dark:bg-stone-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-2 overflow-hidden mr-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {property.category}
            </span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-xs text-stone-500 truncate">{property.county} County</span>
            {property.verified && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                Verified Title Deed
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              title="Share Listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveProperty(property.id)}
              className={`p-2 rounded-lg transition ${
                saved
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={saved ? 'Remove from Saved' : 'Save Property'}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition ml-2"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Gallery Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
              <img
                src={property.images[activeImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {property.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur transition"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 px-3 py-1 rounded bg-stone-900/80 backdrop-blur text-white text-xs font-semibold">
                {activeImageIndex + 1} / {property.images.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            {property.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-amber-500 scale-95 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Key Summary Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white font-display">
                {property.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{property.address}, {property.town}, {property.county} County</span>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="flex items-baseline sm:justify-end gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-display">
                  {formattedPriceKsh}
                </span>
                {property.listingType === 'rent' && (
                  <span className="text-xs text-stone-500">/ month</span>
                )}
                {property.listingType === 'lease' && (
                  <span className="text-xs text-stone-500">/ month</span>
                )}
              </div>
              <div className="text-[11px] text-stone-400">
                Approx. {formattedUsd} · Title Cleared
              </div>
            </div>
          </div>

          {/* Core Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 text-xs">
            <div className="space-y-0.5">
              <span className="text-stone-400 text-[11px] block">Bedrooms</span>
              <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-white">
                <Bed className="w-4 h-4 text-amber-500" />
                <span>{property.bedrooms > 0 ? `${property.bedrooms} Bedrooms` : 'Commercial / Land'}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-stone-400 text-[11px] block">Bathrooms</span>
              <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-white">
                <Bath className="w-4 h-4 text-amber-500" />
                <span>{property.bathrooms > 0 ? `${property.bathrooms} Baths` : 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-stone-400 text-[11px] block">Total Floor Area</span>
              <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-white">
                <Maximize2 className="w-4 h-4 text-amber-500" />
                <span>{property.areaSqm} sqm ({Math.round(property.areaSqm * 10.764)} sqft)</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-stone-400 text-[11px] block">Listing Type</span>
              <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-white capitalize">
                <Building className="w-4 h-4 text-amber-500" />
                <span>For {property.listingType}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Property Overview
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Architectural & Structural Features */}
          {property.features && property.features.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                Key Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities Grid */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Amenities & Utilities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {property.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 flex items-center gap-2 text-stone-800 dark:text-stone-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Neighborhood Guide */}
          <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-1 text-xs">
            <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Neighborhood & Access</span>
            </h4>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              {property.neighborhood}
            </p>
          </div>

          {/* Seller / Agent Profile Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={property.seller.avatar}
                alt={property.seller.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-stone-700 shadow"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    {property.seller.name}
                  </h4>
                  {property.seller.isVerified && (
                    <span title="Licensed Real Estate Professional">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500">
                  {property.seller.company || `${property.seller.role} · Zanta Verified`}
                </p>
                {property.seller.licenseNumber && (
                  <p className="text-[10px] text-stone-400 font-mono">
                    Lic: {property.seller.licenseNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onRequestViewing(property)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Request Viewing</span>
              </button>
              <a
                href={`tel:${property.seller.phone.replace(/\s+/g, '')}`}
                className="px-3 py-2.5 rounded-xl bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Call</span>
              </a>
            </div>
          </div>

          {/* Integrated AI Tool Actions */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onAnalyzeInvestment(property)}
              className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700/80 border border-stone-200 dark:border-stone-700 text-left flex items-center justify-between transition group"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  AI Investment Analysis
                </span>
                <span className="text-xs font-semibold text-stone-900 dark:text-white">
                  Calculate Rental Yield & 5-Yr ROI
                </span>
              </div>
              <TrendingUp className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onCheckAffordability(property)}
              className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700/80 border border-stone-200 dark:border-stone-700 text-left flex items-center justify-between transition group"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Mortgage & SACCO Check
                </span>
                <span className="text-xs font-semibold text-stone-900 dark:text-white">
                  Check Monthly Financing Payment
                </span>
              </div>
              <Calculator className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Sample Demonstration Warning */}
          <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-800/40 text-[11px] text-stone-500 text-center">
            Sample demonstration property listed for Zanta PropertyAI testing. Actual sales require physical survey and ArdhiSasa verification.
          </div>
        </div>
      </div>
    </div>
  );
};
