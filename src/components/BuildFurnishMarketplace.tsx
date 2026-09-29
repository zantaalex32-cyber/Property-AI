import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BUILD_ITEMS } from '../data/kenyaData';
import { BuildItem } from '../types';
import {
  Hammer,
  Truck,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Send,
  X,
  CheckCircle,
  FileText,
  Search,
} from 'lucide-react';

export const BuildFurnishMarketplace: React.FC = () => {
  const { showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quoteTargetItem, setQuoteTargetItem] = useState<BuildItem | null>(null);

  // Quote form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isQuoteSent, setIsQuoteSent] = useState(false);

  const categories = [
    'All',
    'Building Materials',
    'Furniture',
    'Contractors',
    'Architects',
    'Electricians',
    'Interior Designers',
    'Plumbers',
    'Painters',
    'Landscaping',
  ];

  const filteredItems = useMemo(() => {
    return BUILD_ITEMS.filter(item => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.provider.toLowerCase().includes(q) ||
          item.county.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      showToast('Please enter your name and phone number', 'warning');
      return;
    }
    setIsQuoteSent(true);
    setTimeout(() => {
      showToast(`Quote request sent to ${quoteTargetItem?.provider}! They will contact you shortly.`, 'success');
      setQuoteTargetItem(null);
      setIsQuoteSent(false);
      setClientName('');
      setClientPhone('');
      setDeliveryLocation('');
      setProjectDescription('');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-semibold border border-rose-500/20 mb-2">
            <Hammer className="w-3.5 h-3.5 text-rose-500" />
            <span>Build & Furnish Marketplace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white font-display">
            Direct Materials, Handcrafted Furniture & Construction Services
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl">
            Sourced from verified Kenyan manufacturers, quarry distributors, artisan woodworkers,
            and NCA-certified building contractors.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search cement, roofing, sofas..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="group rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Product / Service Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-stone-900/80 backdrop-blur text-white">
                    {item.category}
                  </span>
                </div>
                {item.badge && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-900/80 backdrop-blur text-emerald-200 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{item.badge}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="p-4 space-y-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-medium text-stone-700 dark:text-stone-300">{item.provider}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      {item.county}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {item.name}
                  </h3>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Delivery Time & Price */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Price Indicator:</span>
                    <span className="font-extrabold text-sm text-stone-900 dark:text-white font-display">
                      KSh {item.priceGuideKsh}
                    </span>
                    {item.unit && (
                      <span className="text-[10px] text-stone-500 block truncate max-w-[170px]">
                        {item.unit}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>Lead Time:</span>
                    </span>
                    <span className="text-[11px] font-medium text-stone-700 dark:text-stone-300">
                      {item.leadTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 pt-0">
              <button
                onClick={() => setQuoteTargetItem(item)}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Request Quotation / Order</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Request Modal */}
      {quoteTargetItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 animate-in fade-in duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
                  Request Supplier Quotation
                </h3>
                <p className="text-stone-500 text-[11px]">
                  Direct quote from {quoteTargetItem.provider}
                </p>
              </div>
              <button
                onClick={() => setQuoteTargetItem(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 flex gap-3 items-center">
              <img
                src={quoteTargetItem.image}
                alt=""
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div>
                <h5 className="font-bold text-xs text-stone-900 dark:text-white">
                  {quoteTargetItem.name}
                </h5>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold font-display">
                  Price Guide: KSh {quoteTargetItem.priceGuideKsh}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitQuote} className="space-y-3.5">
              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Full Name / Company
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="e.g. Samuel Mogaka"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  M-Pesa / Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="+254 7..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Site Delivery County & Town
                </label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={e => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Nyanchwa, Kisii or Ruiru, Kiambu"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Estimated Quantity or Scope Notes
                </label>
                <textarea
                  rows={2}
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                  placeholder="e.g. Need 400 bags of cement for ground slab; need site crane delivery..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setQuoteTargetItem(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isQuoteSent}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 shadow transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isQuoteSent ? 'Transmitting...' : 'Send Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
