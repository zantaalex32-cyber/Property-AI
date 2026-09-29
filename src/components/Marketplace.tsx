import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Property, PropertyCategory, ListingType } from '../types';
import { PropertyCard } from './PropertyCard';
import { KENYA_COUNTIES, KENYA_TOWNS_BY_COUNTY } from '../data/kenyaData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Building,
  ShieldCheck,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

interface MarketplaceProps {
  onOpenDetails: (property: Property) => void;
  onAnalyzeInvestment: (property: Property) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  onOpenDetails,
  onAnalyzeInvestment,
}) => {
  const {
    properties,
    selectedCounty,
    setSelectedCounty,
    selectedTown,
    setSelectedTown,
    selectedCategory,
    setSelectedCategory,
    selectedListingType,
    setSelectedListingType,
    searchKeyword,
    setSearchKeyword,
    bedroomsFilter,
    setBedroomsFilter,
    verifiedOnly,
    setVerifiedOnly,
    resetFilters,
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'yield' | 'newest'>('featured');
  const [selectedAmenity, setSelectedAmenity] = useState<string>('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(100000000);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Available towns for chosen county
  const availableTowns = useMemo(() => {
    if (selectedCounty === 'All Counties') {
      return ['All Towns'];
    }
    return KENYA_TOWNS_BY_COUNTY[selectedCounty] || ['All Towns'];
  }, [selectedCounty]);

  const amenitiesList = [
    'all',
    'Borehole Water',
    'Solar Water Heating',
    '24/7 Security & CCTV',
    'Swimming Pool',
    'Backup Generator',
    'High-Speed Fiber Ready',
    'Freehold Title',
  ];

  // Filtering Logic
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // County match
      if (selectedCounty !== 'All Counties' && p.county !== selectedCounty) {
        return false;
      }
      // Town match
      if (selectedTown !== 'All Towns' && p.town !== selectedTown) {
        return false;
      }
      // Category match
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Listing type match
      if (selectedListingType !== 'all' && p.listingType !== selectedListingType) {
        return false;
      }
      // Bedrooms match
      if (bedroomsFilter !== 'any' && p.bedrooms < bedroomsFilter) {
        return false;
      }
      // Verified only
      if (verifiedOnly && !p.verified) {
        return false;
      }
      // Price ceiling
      if (p.priceKsh > maxPriceFilter) {
        return false;
      }
      // Amenity
      if (selectedAmenity !== 'all') {
        const hasAmenity = p.amenities.some(a =>
          a.toLowerCase().includes(selectedAmenity.toLowerCase())
        );
        if (!hasAmenity) return false;
      }
      // Keyword search (matches title, address, description, town)
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.town.toLowerCase().includes(query) ||
          p.county.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [
    properties,
    selectedCounty,
    selectedTown,
    selectedCategory,
    selectedListingType,
    bedroomsFilter,
    verifiedOnly,
    maxPriceFilter,
    selectedAmenity,
    searchKeyword,
  ]);

  // Sort logic
  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.priceKsh - b.priceKsh);
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.priceKsh - a.priceKsh);
    }
    if (sortBy === 'yield') {
      return list.sort((a, b) => {
        const yieldA = a.estMonthlyRentKsh ? (a.estMonthlyRentKsh * 12) / a.priceKsh : 0;
        const yieldB = b.estMonthlyRentKsh ? (b.estMonthlyRentKsh * 12) / b.priceKsh : 0;
        return yieldB - yieldA;
      });
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.dateListed).getTime() - new Date(a.dateListed).getTime());
    }
    // Default featured
    return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [filteredProperties, sortBy]);

  const categories: (PropertyCategory | 'All')[] = [
    'All',
    'Apartments',
    'Houses',
    'Land',
    'Commercial',
    'Student accommodation',
    'Vacation',
  ];

  return (
    <div id="marketplace-listings" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Marketplace Navigation & Search Controls */}
      <div className="space-y-4">
        {/* Row 1: Section Title & Segmented Buy/Rent Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white font-display">
              Property Marketplace
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Browse houses, apartments, land, commercial spaces and student accommodation across Kenya
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Segmented Buy/Rent Filter Controls (Buttons allowed by frontend design rules) */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
              {(['all', 'buy', 'rent', 'lease'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedListingType(type)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition ${
                    selectedListingType === type
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All Transactions' : type}
                </button>
              ))}
            </div>

            {/* Toggle Advanced Filters Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                showAdvancedFilters
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-400'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-stone-900 dark:bg-amber-600 text-white font-semibold shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvancedFilters && (
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/80 space-y-4 animate-in fade-in duration-200 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* County Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
                  County
                </label>
                <select
                  value={selectedCounty}
                  onChange={e => {
                    setSelectedCounty(e.target.value);
                    setSelectedTown('All Towns');
                  }}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  {KENYA_COUNTIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Town Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
                  Town / Estate
                </label>
                <select
                  value={selectedTown}
                  onChange={e => setSelectedTown(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  {availableTowns.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
                  Min Bedrooms
                </label>
                <select
                  value={bedroomsFilter}
                  onChange={e =>
                    setBedroomsFilter(e.target.value === 'any' ? 'any' : parseInt(e.target.value, 10))
                  }
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  <option value="any">Any Bedrooms</option>
                  <option value="1">1+ Bedrooms</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>

              {/* Amenity Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
                  Key Amenity
                </label>
                <select
                  value={selectedAmenity}
                  onChange={e => setSelectedAmenity(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  <option value="all">Any Amenities</option>
                  {amenitiesList.slice(1).map(a => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Ceiling & Verified Toggle */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-sm">
                <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                  <span>Maximum Price Ceiling</span>
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {maxPriceFilter >= 100000000
                      ? 'No Limit (KSh 100M+)'
                      : `Under KSh ${maxPriceFilter.toLocaleString()}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="100000000"
                  step="50000"
                  value={maxPriceFilter}
                  onChange={e => setMaxPriceFilter(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={e => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 dark:bg-stone-800"
                  />
                  <span className="font-medium text-stone-700 dark:text-stone-300">
                    Verified Title Deeds Only
                  </span>
                </label>

                <button
                  onClick={() => {
                    resetFilters();
                    setMaxPriceFilter(100000000);
                    setSelectedAmenity('all');
                  }}
                  className="flex items-center gap-1 text-stone-500 hover:text-stone-900 dark:hover:text-white transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Bar & Sort Selector */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
            <span className="font-bold text-stone-900 dark:text-white">
              {sortedProperties.length} Properties Found
            </span>
            <span>·</span>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
              Sample Demo Inventory
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="py-1 px-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-xs focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="yield">Highest Estimated Yield</option>
              <option value="newest">Newest Listed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      {sortedProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onOpenDetails={onOpenDetails}
              onAnalyzeInvestment={onAnalyzeInvestment}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 space-y-3">
          <Building className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-bold text-base text-stone-800 dark:text-stone-200">
            No properties found matching current criteria
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try resetting your filters or selecting "All Counties" to browse available sample listings in Kisii, Nairobi, Mombasa, Kisumu, Nakuru, and Kiambu.
          </p>
          <button
            onClick={() => {
              resetFilters();
              setMaxPriceFilter(100000000);
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
