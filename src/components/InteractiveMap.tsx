import React, { useState, useMemo } from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Search,
  Bed,
  Bath,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface InteractiveMapProps {
  onOpenDetails: (property: Property) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onOpenDetails }) => {
  const {
    properties,
    selectedCounty,
    setSelectedCounty,
    setSelectedTown,
    setCurrentView,
    showToast,
  } = useApp();

  const [activePinProperty, setActivePinProperty] = useState<Property | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapStyle, setMapStyle] = useState<'blueprint' | 'satellite' | 'terrain'>('blueprint');

  // Map viewport boundary coordinates for Kenya (approx Lat: -4.8 to 4.5, Lng: 33.9 to 41.9)
  // Let's project lat/lng onto a 1000 x 800 SVG canvas:
  // Lng range: 34.0 to 41.5 (span = 7.5) -> X: 50 to 950
  // Lat range: 4.0 to -4.5 (span = 8.5) -> Y: 50 to 750 (Lat goes down as Y increases)
  const projectCoords = (lat: number, lng: number) => {
    const minLng = 33.8;
    const maxLng = 41.8;
    const minLat = -4.6;
    const maxLat = 4.2;

    const x = ((lng - minLng) / (maxLng - minLng)) * 840 + 60;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 680 + 50;

    return { x, y };
  };

  const countyHubs = [
    { name: 'Kisii', lat: -0.68, lng: 34.77, count: 5 },
    { name: 'Nairobi', lat: -1.29, lng: 36.82, count: 4 },
    { name: 'Mombasa', lat: -4.03, lng: 39.69, count: 1 },
    { name: 'Kisumu', lat: -0.06, lng: 34.75, count: 1 },
    { name: 'Nakuru', lat: -0.28, lng: 36.07, count: 1 },
    { name: 'Kiambu', lat: -1.15, lng: 36.91, count: 1 },
    { name: 'Uasin Gishu', lat: 0.50, lng: 35.28, count: 1 },
  ];

  const handleSearchAround = (county: string, town?: string) => {
    setSelectedCounty(county);
    if (town) setSelectedTown(town);
    setCurrentView('marketplace');
    showToast(`Filtering marketplace within 15km radius of ${town || county}`, 'info');
  };

  const formatPriceShort = (price: number, type: string) => {
    if (price >= 1000000) {
      return `KSh ${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `KSh ${(price / 1000).toFixed(0)}K${type === 'rent' ? '/mo' : ''}`;
    }
    return `KSh ${price}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Top Map Header & County Jump Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white font-display">
            Interactive Property Map
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Geographic exploration of listings across Kenya · Click pins to preview details or filter surrounding radius
          </p>
        </div>

        {/* Quick County Focus Shortcuts */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-stone-400">Jump to County:</span>
          {countyHubs.map(hub => (
            <button
              key={hub.name}
              onClick={() => {
                setSelectedCounty(hub.name);
                showToast(`Focused on ${hub.name} County Hub`, 'info');
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition ${
                selectedCounty === hub.name
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-500'
              }`}
            >
              <span>{hub.name}</span>
              <span className="ml-1 opacity-70 text-[10px]">({hub.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 shadow-inner">
        {/* Style & Zoom Controls Floating Top Right */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {/* Map Style Switcher */}
          <div className="flex items-center gap-1 p-1 bg-white/90 dark:bg-stone-900/90 backdrop-blur rounded-xl border border-stone-200 dark:border-stone-800 shadow-md text-xs">
            <button
              onClick={() => setMapStyle('blueprint')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                mapStyle === 'blueprint'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Terrain
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                mapStyle === 'satellite'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Zoom In / Out */}
          <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur rounded-xl border border-stone-200 dark:border-stone-800 shadow-md p-1 flex flex-col gap-1">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
              className="p-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
              className="p-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend Floating Bottom Left */}
        <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur border border-stone-200 dark:border-stone-800 shadow-lg text-[11px] text-stone-600 dark:text-stone-400 space-y-1.5 hidden sm:block">
          <div className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[10px]">
            Kenya Territory Map
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-300" />
            <span>Rental Properties</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-300" />
            <span>Sale Properties & Land</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 ring-2 ring-sky-300" />
            <span>Commercial & Offices</span>
          </div>
        </div>

        {/* SVG Kenya Vector Surface */}
        <div
          className="w-full h-full transition-transform duration-300 flex items-center justify-center overflow-hidden"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 1000 800"
            className="w-full h-full max-w-full max-h-full select-none"
          >
            {/* Kenya stylized border silhouette */}
            <path
              d="M 280 120 L 480 80 L 640 100 L 780 200 L 820 380 L 710 590 L 590 690 L 520 740 L 480 710 L 360 620 L 260 540 L 210 460 L 190 320 L 220 220 Z"
              fill={mapStyle === 'satellite' ? '#1c241c' : '#f5f5f4'}
              className="dark:fill-stone-900 transition-colors"
              stroke="#d6d3d1"
              strokeWidth="2"
            />

            {/* Lake Victoria Stylized representation */}
            <path
              d="M 120 440 C 150 420, 200 440, 210 510 C 220 580, 180 620, 130 600 Z"
              fill="#38bdf820"
              stroke="#38bdf880"
              strokeWidth="1.5"
            />
            <text x="140" y="520" fill="#0284c7" fontSize="12" fontWeight="600" opacity="0.6">
              Lake Victoria
            </text>

            {/* Indian Ocean */}
            <path
              d="M 680 620 C 720 660, 780 710, 850 780 L 1000 800 L 1000 500 L 820 380 Z"
              fill="#0ea5e915"
              stroke="#0ea5e940"
              strokeWidth="1.5"
            />
            <text x="820" y="660" fill="#0284c7" fontSize="14" fontWeight="600" opacity="0.6">
              Indian Ocean
            </text>

            {/* County Region Nodes */}
            {countyHubs.map(hub => {
              const { x, y } = projectCoords(hub.lat, hub.lng);
              const isSelected = selectedCounty === hub.name;
              return (
                <g key={hub.name} className="cursor-pointer" onClick={() => setSelectedCounty(hub.name)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 32 : 24}
                    fill={isSelected ? '#f59e0b25' : '#78716c15'}
                    stroke={isSelected ? '#f59e0b' : '#a8a29e'}
                    strokeWidth={isSelected ? '2' : '1'}
                    strokeDasharray={isSelected ? 'none' : '4 2'}
                  />
                  <text
                    x={x}
                    y={y + 36}
                    textAnchor="middle"
                    fill={isSelected ? '#d97706' : '#78716c'}
                    fontSize="11"
                    fontWeight={isSelected ? '700' : '600'}
                  >
                    {hub.name}
                  </text>
                </g>
              );
            })}

            {/* Property Marker Pins */}
            {properties.map(property => {
              const { x, y } = projectCoords(property.coordinates.lat, property.coordinates.lng);
              const isRent = property.listingType === 'rent';
              const isCommercial = property.category === 'Commercial';
              const isSelected = activePinProperty?.id === property.id;

              const pinColor = isRent ? '#f59e0b' : isCommercial ? '#0284c7' : '#10b981';

              return (
                <g
                  key={property.id}
                  className="cursor-pointer group"
                  onClick={() => setActivePinProperty(property)}
                >
                  {/* Pin Pulse when selected */}
                  {isSelected && (
                    <circle cx={x} cy={y - 8} r="18" fill={pinColor} opacity="0.3" className="animate-ping" />
                  )}

                  {/* Pin Body */}
                  <g transform={`translate(${x - 14}, ${y - 32})`}>
                    <path
                      d="M 14 0 C 6.3 0 0 6.3 0 14 C 0 24.5 14 36 14 36 C 14 36 28 24.5 28 14 C 28 6.3 21.7 0 14 0 Z"
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="filter drop-shadow-md group-hover:scale-110 transition-transform"
                    />
                    <circle cx="14" cy="14" r="5" fill="#ffffff" />
                  </g>

                  {/* Price Tag Label above pin */}
                  <rect
                    x={x - 36}
                    y={y - 48}
                    width="72"
                    height="18"
                    rx="4"
                    fill="#1c1917"
                    stroke={pinColor}
                    strokeWidth="1"
                    className="opacity-95"
                  />
                  <text
                    x={x}
                    y={y - 35}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="700"
                  >
                    {formatPriceShort(property.priceKsh, property.listingType)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Property Floating Preview Card */}
        {activePinProperty && (
          <div className="absolute bottom-4 right-4 z-30 w-80 sm:w-96 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden p-3.5 space-y-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-amber-600">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activePinProperty.town}, {activePinProperty.county}</span>
              </div>
              <button
                onClick={() => setActivePinProperty(null)}
                className="text-stone-400 hover:text-stone-700 text-xs px-1"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-3">
              <img
                src={activePinProperty.images[0]}
                alt={activePinProperty.title}
                className="w-24 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white line-clamp-1">
                  {activePinProperty.title}
                </h4>
                <div className="text-amber-600 dark:text-amber-400 font-extrabold text-sm font-display">
                  {formatPriceShort(activePinProperty.priceKsh, activePinProperty.listingType)}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  {activePinProperty.bedrooms > 0 && (
                    <span>{activePinProperty.bedrooms} Beds</span>
                  )}
                  {activePinProperty.bathrooms > 0 && (
                    <span>· {activePinProperty.bathrooms} Baths</span>
                  )}
                  <span>· {activePinProperty.areaSqm} sqm</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onOpenDetails(activePinProperty)}
                className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <span>Inspect Property</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleSearchAround(activePinProperty.county, activePinProperty.town)}
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Radius</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
