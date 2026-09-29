export type ListingType = 'buy' | 'rent' | 'lease';

export type PropertyCategory =
  | 'Apartments'
  | 'Houses'
  | 'Land'
  | 'Commercial'
  | 'Student accommodation'
  | 'Vacation';

export type UserRole =
  | 'buyer'
  | 'tenant'
  | 'seller'
  | 'agent'
  | 'developer'
  | 'professional'
  | 'admin';

export interface SellerProfile {
  id: string;
  name: string;
  role: 'Agent' | 'Owner' | 'Developer';
  company?: string;
  phone: string;
  email: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  licenseNumber?: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  category: PropertyCategory;
  listingType: ListingType;
  priceKsh: number;
  pricePeriod?: 'month' | 'year' | 'total';
  county: string;
  town: string;
  address: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  description: string;
  features: string[];
  amenities: string[];
  images: string[];
  seller: SellerProfile;
  verified: boolean;
  titleDeedVerified: boolean;
  dateListed: string;
  viewsCount: number;
  savesCount: number;
  virtualTourAvailable?: boolean;
  estMonthlyRentKsh?: number;
  annualServiceChargeKsh?: number;
  isFeatured?: boolean;
}

export interface BuildItem {
  id: string;
  name: string;
  category:
    | 'Building Materials'
    | 'Furniture'
    | 'Interior Designers'
    | 'Contractors'
    | 'Architects'
    | 'Plumbers'
    | 'Electricians'
    | 'Painters'
    | 'Landscaping';
  provider: string;
  location: string;
  county: string;
  priceGuideKsh: string;
  unit?: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  badge?: string;
  image: string;
  description: string;
  leadTime: string;
}

export interface Professional {
  id: string;
  name: string;
  category:
    | 'Real estate agent'
    | 'Property developer'
    | 'Contractor'
    | 'Architect'
    | 'Property valuer'
    | 'Interior designer'
    | 'Property lawyer';
  firm: string;
  regBody: string; // e.g. BORAQS, EARB, NCA, LSK
  licenseNo: string;
  county: string;
  town: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  activeListingsCount?: number;
  verified: boolean;
  avatar: string;
  bio: string;
  specializations: string[];
  phone: string;
  email: string;
}

export interface ViewingRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyPrice: number;
  propertyLocation: string;
  date: string;
  timeSlot: string;
  type: 'in-person' | 'virtual';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  userName: string;
  userPhone: string;
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  matchedPropertyIds?: string[];
  followUpQuestions?: string[];
  isFallback?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  isVerified: boolean;
  nationalIdVerified?: boolean;
  kraPinVerified?: boolean;
}

export interface InvestmentMetrics {
  purchasePriceKsh: number;
  monthlyRentKsh: number;
  annualRentKsh: number;
  grossYieldPercent: number;
  netYieldPercent: number;
  annualOperatingExpensesKsh: number;
  netOperatingIncomeKsh: number;
  breakEvenYears: number;
  fiveYearEstimatedValuationKsh: number;
  fiveYearRoiPercent: number;
  monthlyRentalIncomeTaxKsh: number;
}
