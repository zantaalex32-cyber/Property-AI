import React from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  TrendingUp,
  Share2,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onOpenDetails: (property: Property) => void;
  onAnalyzeInvestment?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onOpenDetails,
  onAnalyzeInvestment,
}) => {
  const { isPropertySaved, toggleSaveProperty, showToast } = useApp();
  const saved = isPropertySaved(property.id);

  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(property.priceKsh);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Property link copied to clipboard', 'info');
    }
  };

  return (
    <article
      onClick={() => onOpenDetails(property)}
      className="group rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 overflow-hidden hover:shadow-xl hover:border-amber-500/60 dark:hover:border-amber-500/60 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Listing Type Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded bg-stone-900/80 backdrop-blur text-white shadow-sm">
            {property.listingType === 'buy'
              ? 'For Sale'
              : property.listingType === 'rent'
              ? 'For Rent'
              : 'For Lease'}
          </span>
          {property.verified && (
            <span className="text-[11px] font-semibold flex items-center gap-1 px-2 py-1 rounded bg-emerald-900/80 backdrop-blur text-emerald-200 border border-emerald-500/30 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified Title</span>
            </span>
          )}
        </div>

        {/* Save & Share Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white backdrop-blur transition"
            title="Share Property"
            aria-label="Share property link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              toggleSaveProperty(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur transition ${
              saved
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-stone-900/60 hover:bg-stone-900/90 text-white'
            }`}
            title={saved ? 'Remove from Saved' : 'Save Property'}
            aria-label="Save property"
          >
            <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Price Bar Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent">
          <div className="flex items-baseline gap-1.5 text-white">
            <span className="text-lg font-extrabold tracking-tight font-display">
              {formattedPrice.replace('KES', 'KSh')}
            </span>
            {property.listingType === 'rent' && (
              <span className="text-xs text-stone-300 font-medium">/ month</span>
            )}
            {property.listingType === 'lease' && (
              <span className="text-xs text-stone-300 font-medium">/ month</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Unboxed Metadata (Zero-Pill discipline compliant) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span>{property.category}</span>
            <span aria-hidden="true">·</span>
            <span>{property.county} County</span>
            {property.town && (
              <>
                <span aria-hidden="true">·</span>
                <span>{property.town}</span>
              </>
            )}
          </div>

          <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {property.title}
          </h3>

          <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{property.address}</span>
          </p>
        </div>

        {/* Property Specs (Unboxed clean row with subtle hairline) */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
          <div className="flex items-center gap-4">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1" title={`${property.bedrooms} Bedrooms`}>
                <Bed className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold">{property.bedrooms}</span>
                <span className="text-stone-400 text-[11px]">Beds</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1" title={`${property.bathrooms} Bathrooms`}>
                <Bath className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold">{property.bathrooms}</span>
                <span className="text-stone-400 text-[11px]">Baths</span>
              </div>
            )}
            {property.areaSqm > 0 && (
              <div className="flex items-center gap-1" title={`${property.areaSqm} sqm`}>
                <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold">{property.areaSqm}</span>
                <span className="text-stone-400 text-[11px]">sqm</span>
              </div>
            )}
          </div>

          {/* Quick ROI Action */}
          {onAnalyzeInvestment && property.listingType === 'buy' && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onAnalyzeInvestment(property);
              }}
              className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              title="Calculate ROI with AI"
            >
              <TrendingUp className="w-3 h-3" />
              <span>ROI Valuer</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
