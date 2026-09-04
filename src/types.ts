export type PropertyType = 'home' | 'room' | 'shop' | 'portion';
export type SuitableFor = 'family' | 'bachelors' | 'females' | 'commercial' | 'any';
export type FurnishingStatus = 'unfurnished' | 'semi-furnished' | 'fully-furnished';
export type PropertyStatus = 'available' | 'reserved' | 'rented';
export type MembershipTier = 'free' | 'pro_host' | 'agency';

export interface LandlordProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  whatsapp: string;
  email: string;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  rating: number;
  reviewCount: number;
  responseRate: string; // e.g. "98%"
  responseTime: string; // e.g. "< 15 mins"
  joinedDate: string;
  tier: MembershipTier;
  activeListingsCount: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number; // monthly rent
  securityDeposit: number;
  isNegotiable?: boolean;
  billsIncluded: boolean;
  includedBills?: string[]; // e.g. ['Water', 'Maintenance', 'Gas']
  
  // Location
  city: string;
  neighborhood: string;
  address: string;
  landmark?: string;
  
  // Specs
  bedrooms: number; // 0 for shop or single open room
  bathrooms: number;
  sizeSqFt: number;
  floorNumber: number;
  totalFloors: number;
  furnishing: FurnishingStatus;
  suitableFor: SuitableFor;
  
  // Features
  amenities: string[];
  images: string[];
  
  // Owner info
  owner: LandlordProfile;
  
  // Status & Monetization
  status: PropertyStatus;
  isFeatured: boolean;
  featuredExpiryDate?: string;
  
  // Stats
  viewsCount: number;
  inquiriesCount: number;
  savedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'tenant' | 'owner';
  text: string;
  timestamp: string;
  isRead: boolean;
  type?: 'text' | 'visit_request' | 'phone_shared';
  visitDate?: string;
  visitTime?: string;
}

export interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyImage: string;
  propertyType: PropertyType;
  propertyLocation: string;
  tenantId: string;
  tenantName: string;
  tenantAvatar: string;
  tenantPhone: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerPhone: string;
  ownerResponseRate: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadByTenant: number;
  unreadByOwner: number;
  messages: Message[];
}

export interface FilterCriteria {
  searchQuery: string;
  type: PropertyType | 'all';
  city: string;
  neighborhood: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'all';
  bathrooms: number | 'all';
  furnishing: FurnishingStatus | 'all';
  suitableFor: SuitableFor | 'all';
  amenities: string[];
  verifiedLandlordOnly: boolean;
  featuredOnly: boolean;
  billsIncludedOnly: boolean;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'tenant' | 'landlord';
  tier: MembershipTier;
  freeListingsUsed: number;
  freeListingsTotal: number;
  membershipExpiresAt?: string;
  isVerified: boolean;
  savedPropertyIds: string[];
}
