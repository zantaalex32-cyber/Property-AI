import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property, PropertyCategory, ListingType } from '../types';
import { KENYA_COUNTIES, KENYA_TOWNS_BY_COUNTY } from '../data/kenyaData';
import {
  Building2,
  PlusCircle,
  Eye,
  Bookmark,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  TrendingUp,
  ShieldCheck,
  Upload,
  ArrowRight,
  X,
} from 'lucide-react';

interface AgentSellerDashboardProps {
  onOpenDetails: (property: Property) => void;
}

export const AgentSellerDashboard: React.FC<AgentSellerDashboardProps> = ({ onOpenDetails }) => {
  const {
    properties,
    addNewProperty,
    deleteProperty,
    currentUser,
    viewingRequests,
    updateViewingStatus,
    showToast,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding Property
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('Apartments');
  const [listingType, setListingType] = useState<ListingType>('rent');
  const [county, setCounty] = useState('Kisii');
  const [town, setTown] = useState('Nyanchwa');
  const [address, setAddress] = useState('');
  const [priceKsh, setPriceKsh] = useState<number>(25000);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [areaSqm, setAreaSqm] = useState<number>(85);
  const [description, setDescription] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('Borehole Water, Solar Water Heating, 24/7 Security & CCTV, High-Speed Fiber Ready');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');

  // Realistic sample image presets for Kenyan properties
  const sampleImages = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  ];

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceKsh) {
      showToast('Please fill in the title and price', 'warning');
      return;
    }

    const newProperty: Property = {
      id: `prop-custom-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      category,
      listingType,
      priceKsh,
      pricePeriod: listingType === 'rent' || listingType === 'lease' ? 'month' : 'total',
      county,
      town,
      address: address || `${town}, ${county} County`,
      neighborhood: `${town} prime residential area`,
      coordinates:
        county === 'Kisii'
          ? { lat: -0.68, lng: 34.77 }
          : county === 'Nairobi'
          ? { lat: -1.29, lng: 36.82 }
          : { lat: -4.04, lng: 39.66 },
      bedrooms,
      bathrooms,
      areaSqm,
      description:
        description ||
        `Newly listed ${category.toLowerCase()} in ${town}, ${county}. Features verified ownership title, modern construction finishes, secure compound, and reliable water supply.`,
      features: [
        'Master bedroom ensuite',
        'Continuous clean water and overhead tanks',
        'Secure perimeter wall with electric razor fencing',
        'Dedicated parking slot',
      ],
      amenities: amenitiesInput.split(',').map(s => s.trim()).filter(Boolean),
      images: [imageUrl, sampleImages[1]],
      seller: {
        id: currentUser.id,
        name: currentUser.name || 'Highland Realtor',
        role: 'Agent',
        company: 'Zanta Licensed Agency',
        phone: currentUser.phone || '+254 722 000 000',
        email: currentUser.email || 'agent@zanta.co.ke',
        avatar: currentUser.avatar || sampleImages[0],
        rating: 4.9,
        reviewsCount: 12,
        isVerified: true,
        licenseNumber: 'EARB/2026/088',
      },
      verified: true,
      titleDeedVerified: true,
      dateListed: new Date().toISOString().split('T')[0],
      viewsCount: 42,
      savesCount: 3,
      isFeatured: false,
    };

    addNewProperty(newProperty);
    setIsAddModalOpen(false);
    setTitle('');
    setAddress('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Agent & Seller Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white font-display">
            Manage Listings, Inquiries & Lead Analytics
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Publish and manage verified properties across Kenya with direct buyer inquiry routing.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property Listing</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 block font-medium">Active Portfolio</span>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-display">
            {properties.length} Listings
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">100% Title Verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 block font-medium">Total Listing Views</span>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-display">
            28,490
          </div>
          <span className="text-[10px] text-amber-600 font-semibold block">+18.4% this month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 block font-medium">Saved by Buyers</span>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-display">
            1,624 Saves
          </div>
          <span className="text-[10px] text-stone-400 block">High purchase intent</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 block font-medium">Viewing Inquiries</span>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-white font-display">
            {viewingRequests.length} Scheduled
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">Avg. response &lt; 2 hrs</span>
        </div>
      </div>

      {/* Viewing Inquiries Management Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
            Incoming Buyer Viewing Requests
          </h3>
          <span className="text-stone-400 text-[11px]">Action required within 4 hours</span>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {viewingRequests.map(req => (
            <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 dark:text-white">{req.userName}</span>
                  <span className="text-stone-400">({req.userPhone})</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      req.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 font-medium">
                  {req.propertyTitle} ({req.propertyLocation})
                </p>
                <p className="text-[11px] text-stone-400">
                  Requested: {req.date} at {req.timeSlot} · {req.type.toUpperCase()} Tour
                </p>
              </div>

              <div className="flex items-center gap-2">
                {req.status !== 'confirmed' && (
                  <button
                    onClick={() => updateViewingStatus(req.id, 'confirmed')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
                  >
                    Confirm Tour
                  </button>
                )}
                {req.status !== 'completed' && (
                  <button
                    onClick={() => updateViewingStatus(req.id, 'completed')}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Listings Manager Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
            Your Property Listings ({properties.length})
          </h3>
          <span className="text-[11px] text-stone-400">Live on Zanta PropertyAI</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 text-[11px] uppercase">
                <th className="pb-3 font-semibold">Property</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Price (KSh)</th>
                <th className="pb-3 font-semibold">Views / Saves</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {properties.map(p => (
                <tr key={p.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt="" className="w-12 h-10 rounded-lg object-cover" />
                      <span className="font-bold text-stone-900 dark:text-white line-clamp-1 max-w-xs">
                        {p.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-stone-600 dark:text-stone-300">
                    {p.town}, {p.county}
                  </td>
                  <td className="py-3 capitalize text-stone-600 dark:text-stone-300">
                    {p.category} ({p.listingType})
                  </td>
                  <td className="py-3 font-bold text-stone-900 dark:text-white font-mono">
                    KSh {p.priceKsh.toLocaleString()}
                  </td>
                  <td className="py-3 text-stone-500">
                    {p.viewsCount} views · {p.savesCount} saves
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => onOpenDetails(p)}
                      className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white"
                      title="Inspect"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProperty(p.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Property Multi-Step Wizard Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 animate-in fade-in duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
                  Publish New Kenyan Property Listing
                </h3>
                <p className="text-stone-500 text-[11px]">
                  Step-by-step listing upload to Zanta PropertyAI marketplace
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              {/* Row 1: Title */}
              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Modern 2-Bedroom Apartment in Nyanchwa, Kisii"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Row 2: Category & Listing Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Property Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as PropertyCategory)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    <option value="Apartments">Apartments</option>
                    <option value="Houses">Houses & Villas</option>
                    <option value="Land">Land & Plots</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Student accommodation">Student accommodation</option>
                    <option value="Vacation">Vacation & Holiday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={listingType}
                    onChange={e => setListingType(e.target.value as ListingType)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    <option value="rent">For Rent (Monthly)</option>
                    <option value="buy">For Sale (Outright)</option>
                    <option value="lease">Long-term Lease</option>
                  </select>
                </div>
              </div>

              {/* Row 3: County & Town */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    County *
                  </label>
                  <select
                    value={county}
                    onChange={e => {
                      setCounty(e.target.value);
                      const towns = KENYA_TOWNS_BY_COUNTY[e.target.value] || [];
                      setTown(towns[1] || 'CBD');
                    }}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  >
                    {KENYA_COUNTIES.slice(1).map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Town / Estate *
                  </label>
                  <input
                    type="text"
                    required
                    value={town}
                    onChange={e => setTown(e.target.value)}
                    placeholder="e.g. Nyanchwa, Kilimani, Bamburi"
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Row 4: Price & Specs */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2">
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Price in KSh *
                  </label>
                  <input
                    type="number"
                    required
                    value={priceKsh}
                    onChange={e => setPriceKsh(parseInt(e.target.value, 10) || 0)}
                    placeholder="e.g. 25000"
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={e => setBedrooms(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Floor Area (sqm)
                  </label>
                  <input
                    type="number"
                    value={areaSqm}
                    onChange={e => setAreaSqm(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Row 5: Amenities */}
              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={amenitiesInput}
                  onChange={e => setAmenitiesInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              {/* Photo Selector */}
              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Primary Property Photograph
                </label>
                <div className="flex items-center gap-2">
                  {sampleImages.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImageUrl(img)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                        imageUrl === img ? 'border-amber-500 scale-95 shadow-md' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe unique architectural features, borehole depth, security, and commute..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-2 shadow transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish to Kenya Marketplace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
