import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, UserRole, UserProfile, ViewingRequest, PropertyCategory, ListingType } from '../types';
import { INITIAL_PROPERTIES } from '../data/kenyaData';

export type AppView =
  | 'marketplace'
  | 'map'
  | 'assistant'
  | 'affordability'
  | 'investment'
  | 'build'
  | 'professionals'
  | 'user-dashboard'
  | 'agent-dashboard'
  | 'admin-dashboard';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Auth & Roles
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginAs: (email: string, name: string, role: UserRole) => void;
  logout: () => void;

  // Properties State
  properties: Property[];
  addNewProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (propertyId: string) => void;

  // Selection & Modals
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  isViewingModalOpen: boolean;
  setIsViewingModalOpen: (open: boolean) => void;
  investmentTargetProperty: Property | null;
  setInvestmentTargetProperty: (property: Property | null) => void;

  // Saved Properties
  savedPropertyIds: string[];
  toggleSaveProperty: (propertyId: string) => void;
  isPropertySaved: (propertyId: string) => boolean;

  // Viewing Requests
  viewingRequests: ViewingRequest[];
  addViewingRequest: (request: Omit<ViewingRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateViewingStatus: (requestId: string, status: ViewingRequest['status']) => void;

  // Filters State
  selectedCounty: string;
  setSelectedCounty: (county: string) => void;
  selectedTown: string;
  setSelectedTown: (town: string) => void;
  selectedCategory: PropertyCategory | 'All';
  setSelectedCategory: (category: PropertyCategory | 'All') => void;
  selectedListingType: ListingType | 'all';
  setSelectedListingType: (listingType: ListingType | 'all') => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  bedroomsFilter: number | 'any';
  setBedroomsFilter: (beds: number | 'any') => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (verified: boolean) => void;
  resetFilters: () => void;

  // Notifications & Toasts
  notifications: Array<{ id: string; title: string; time: string; read: boolean }>;
  markNotificationsAsRead: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Admin stats
  totalAiQueriesCount: number;
  incrementAiQueries: () => void;
  regionalMarkets: { [key: string]: boolean };
  toggleRegionalMarket: (country: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('marketplace');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark class to <html> tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user-default',
    name: 'Alex Zanta',
    email: 'alex@zanta.co.ke',
    role: 'buyer',
    phone: '+254 712 345 678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    isVerified: true,
    nationalIdVerified: true,
    kraPinVerified: true,
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const switchRole = (newRole: UserRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role: newRole,
    }));
    showToast(`Switched active workspace role to ${newRole.toUpperCase()}`, 'info');
    if (newRole === 'agent' || newRole === 'seller') {
      setCurrentView('agent-dashboard');
    } else if (newRole === 'admin') {
      setCurrentView('admin-dashboard');
    }
  };

  const loginAs = (email: string, name: string, role: UserRole) => {
    setCurrentUser({
      id: `usr-${Date.now()}`,
      name: name || 'Zanta User',
      email,
      role,
      phone: '+254 700 000 000',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      isVerified: true,
    });
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${name || email}!`, 'success');
  };

  const logout = () => {
    setCurrentUser({
      id: 'guest',
      name: 'Guest User',
      email: '',
      role: 'buyer',
      phone: '',
      avatar: '',
      isVerified: false,
    });
    showToast('Signed out of Zanta PropertyAI', 'info');
  };

  // Properties
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [investmentTargetProperty, setInvestmentTargetProperty] = useState<Property | null>(null);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);

  // Saved Properties
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(['prop-kisii-01', 'prop-nrb-01']);

  const toggleSaveProperty = (propertyId: string) => {
    setSavedPropertyIds(prev => {
      const exists = prev.includes(propertyId);
      if (exists) {
        showToast('Removed from your saved properties', 'info');
        return prev.filter(id => id !== propertyId);
      } else {
        showToast('Property saved to your dashboard portfolio', 'success');
        return [...prev, propertyId];
      }
    });
  };

  const isPropertySaved = (propertyId: string) => savedPropertyIds.includes(propertyId);

  // Viewing Requests
  const [viewingRequests, setViewingRequests] = useState<ViewingRequest[]>([
    {
      id: 'view-1',
      propertyId: 'prop-kisii-01',
      propertyTitle: 'Emerald Heights 2-Bedroom Modern Apartment',
      propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      propertyPrice: 22000,
      propertyLocation: 'Nyanchwa, Kisii County',
      date: '2026-04-02',
      timeSlot: '10:30 AM - 11:30 AM',
      type: 'in-person',
      status: 'confirmed',
      userName: 'Alex Zanta',
      userPhone: '+254 712 345 678',
      notes: 'Interested in borehole water pressure and fiber connectivity test.',
      createdAt: '2026-03-27',
    },
    {
      id: 'view-2',
      propertyId: 'prop-nrb-01',
      propertyTitle: 'Kilimani Sky Suites 2-Bedroom Investment Apartment',
      propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      propertyPrice: 13500000,
      propertyLocation: 'Kilimani, Nairobi',
      date: '2026-04-05',
      timeSlot: '02:00 PM - 03:00 PM',
      type: 'virtual',
      status: 'pending',
      userName: 'Alex Zanta',
      userPhone: '+254 712 345 678',
      notes: 'Would like to review the Airbnb occupancy track record with the developer.',
      createdAt: '2026-03-28',
    },
  ]);

  const addViewingRequest = (request: Omit<ViewingRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: ViewingRequest = {
      ...request,
      id: `view-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setViewingRequests(prev => [newReq, ...prev]);
    showToast('Viewing request submitted successfully! Agent will confirm within 2 hours.', 'success');
  };

  const updateViewingStatus = (requestId: string, status: ViewingRequest['status']) => {
    setViewingRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status } : r))
    );
    showToast(`Viewing request #${requestId} updated to ${status.toUpperCase()}`, 'info');
  };

  // Property CRUD
  const addNewProperty = (property: Property) => {
    setProperties(prev => [property, ...prev]);
    showToast('New property listing published to Zanta PropertyAI!', 'success');
  };

  const updateProperty = (updated: Property) => {
    setProperties(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    showToast('Property details updated successfully', 'success');
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    showToast('Property listing removed', 'info');
  };

  // Marketplace Filters
  const [selectedCounty, setSelectedCounty] = useState<string>('All Counties');
  const [selectedTown, setSelectedTown] = useState<string>('All Towns');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'All'>('All');
  const [selectedListingType, setSelectedListingType] = useState<ListingType | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [bedroomsFilter, setBedroomsFilter] = useState<number | 'any'>('any');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  const resetFilters = () => {
    setSelectedCounty('All Counties');
    setSelectedTown('All Towns');
    setSelectedCategory('All');
    setSelectedListingType('all');
    setSearchKeyword('');
    setPriceRange([0, 100000000]);
    setBedroomsFilter('any');
    setVerifiedOnly(false);
  };

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Viewing confirmed for Emerald Heights (Nyanchwa, Kisii)',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Gemini Investment AI updated Kilimani yield metrics (+0.4%)',
      time: 'Yesterday',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'New verified 1/4 acre plot listed in Tatu City Kijani Ridge',
      time: '2 days ago',
      read: true,
    },
  ]);

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Admin Telemetry
  const [totalAiQueriesCount, setTotalAiQueriesCount] = useState(148);
  const incrementAiQueries = () => setTotalAiQueriesCount(prev => prev + 1);

  // Regional Expansion
  const [regionalMarkets, setRegionalMarkets] = useState<{ [key: string]: boolean }>({
    Kenya: true,
    Uganda: false,
    Tanzania: false,
    Rwanda: false,
  });

  const toggleRegionalMarket = (country: string) => {
    setRegionalMarkets(prev => {
      const next = !prev[country];
      showToast(`${country} market expansion status: ${next ? 'ACTIVATED' : 'STAGED FOR PILOT'}`, 'info');
      return { ...prev, [country]: next };
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        isDarkMode,
        toggleTheme,
        currentUser,
        switchRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginAs,
        logout,
        properties,
        addNewProperty,
        updateProperty,
        deleteProperty,
        selectedProperty,
        setSelectedProperty,
        isViewingModalOpen,
        setIsViewingModalOpen,
        investmentTargetProperty,
        setInvestmentTargetProperty,
        savedPropertyIds,
        toggleSaveProperty,
        isPropertySaved,
        viewingRequests,
        addViewingRequest,
        updateViewingStatus,
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
        priceRange,
        setPriceRange,
        bedroomsFilter,
        setBedroomsFilter,
        verifiedOnly,
        setVerifiedOnly,
        resetFilters,
        notifications,
        markNotificationsAsRead,
        toasts,
        showToast,
        totalAiQueriesCount,
        incrementAiQueries,
        regionalMarkets,
        toggleRegionalMarket,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
