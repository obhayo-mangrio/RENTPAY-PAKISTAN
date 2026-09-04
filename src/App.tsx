import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  SlidersHorizontal, 
  PlusCircle, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  Info,
  CheckCircle2,
  X,
  PhoneCall,
  Scale
} from 'lucide-react';
import { 
  Property, 
  Conversation, 
  UserAccount, 
  FilterCriteria, 
  MembershipTier, 
  PropertyType 
} from './types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_CONVERSATIONS, 
  INITIAL_USER, 
  CITIES 
} from './data/mockData';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { AdvancedFilterModal } from './components/AdvancedFilterModal';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ChatModal } from './components/ChatModal';
import { PostListingModal } from './components/PostListingModal';
import { MembershipModal } from './components/MembershipModal';
import { LandlordDashboard } from './components/LandlordDashboard';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { SavedPropertiesView } from './components/SavedPropertiesView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { formatPrice } from './utils/helpers';

const STORAGE_KEYS = {
  PROPERTIES: 'rentnest_properties_v2',
  CONVERSATIONS: 'rentnest_conversations_v2',
  USER: 'rentnest_user_v2',
  SAVED: 'rentnest_saved_v2'
};

const DEFAULT_FILTERS: FilterCriteria = {
  searchQuery: '',
  type: 'all',
  city: 'All Cities',
  neighborhood: '',
  minPrice: 0,
  maxPrice: 10000,
  bedrooms: 'all',
  bathrooms: 'all',
  furnishing: 'all',
  suitableFor: 'all',
  amenities: [],
  verifiedLandlordOnly: false,
  featuredOnly: false,
  billsIncludedOnly: false,
  sortBy: 'featured'
};

export default function App() {
  // State Initialization with local storage fallback
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // UI Views & Modals
  const [currentView, setCurrentView] = useState<'explore' | 'favorites' | 'dashboard'>('explore');
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(DEFAULT_FILTERS);
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [properties]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Updates
  const handleFilterChange = (updated: Partial<FilterCriteria>) => {
    setFilterCriteria((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilterCriteria(DEFAULT_FILTERS);
    showToast('Filters reset to default');
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterCriteria.type !== 'all') count++;
    if (filterCriteria.city !== 'All Cities') count++;
    if (filterCriteria.maxPrice < 10000) count++;
    if (filterCriteria.minPrice > 0) count++;
    if (filterCriteria.bedrooms !== 'all') count++;
    if (filterCriteria.bathrooms !== 'all') count++;
    if (filterCriteria.furnishing !== 'all') count++;
    if (filterCriteria.suitableFor !== 'all') count++;
    if (filterCriteria.amenities.length > 0) count += filterCriteria.amenities.length;
    if (filterCriteria.verifiedLandlordOnly) count++;
    if (filterCriteria.featuredOnly) count++;
    if (filterCriteria.billsIncludedOnly) count++;
    return count;
  }, [filterCriteria]);

  // Filtering & Sorting
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Type
      if (filterCriteria.type !== 'all' && item.type !== filterCriteria.type) {
        return false;
      }

      // City
      if (filterCriteria.city !== 'All Cities' && item.city !== filterCriteria.city) {
        return false;
      }

      // Search Query
      if (filterCriteria.searchQuery.trim()) {
        const query = filterCriteria.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesArea = item.neighborhood.toLowerCase().includes(query);
        const matchesAddress = item.address.toLowerCase().includes(query);
        const matchesCity = item.city.toLowerCase().includes(query);
        const matchesOwner = item.owner.name.toLowerCase().includes(query);
        const matchesAmenity = item.amenities.some((a) => a.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesArea && !matchesAddress && !matchesCity && !matchesOwner && !matchesAmenity) {
          return false;
        }
      }

      // Price Range
      if (item.price < filterCriteria.minPrice || item.price > filterCriteria.maxPrice) {
        return false;
      }

      // Bedrooms
      if (filterCriteria.bedrooms !== 'all' && item.bedrooms < Number(filterCriteria.bedrooms)) {
        return false;
      }

      // Bathrooms
      if (filterCriteria.bathrooms !== 'all' && item.bathrooms < Number(filterCriteria.bathrooms)) {
        return false;
      }

      // Furnishing
      if (filterCriteria.furnishing !== 'all' && item.furnishing !== filterCriteria.furnishing) {
        return false;
      }

      // Suitable For
      if (filterCriteria.suitableFor !== 'all' && item.suitableFor !== filterCriteria.suitableFor && item.suitableFor !== 'any') {
        return false;
      }

      // Amenities (must have all selected)
      if (filterCriteria.amenities.length > 0) {
        const hasAll = filterCriteria.amenities.every((amenity) => item.amenities.includes(amenity));
        if (!hasAll) return false;
      }

      // Verified Landlord Only
      if (filterCriteria.verifiedLandlordOnly && !item.owner.isPhoneVerified) {
        return false;
      }

      // Featured Only
      if (filterCriteria.featuredOnly && !item.isFeatured) {
        return false;
      }

      // Bills Included Only
      if (filterCriteria.billsIncludedOnly && !item.billsIncluded) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      if (filterCriteria.sortBy === 'featured') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filterCriteria.sortBy === 'price_asc') {
        return a.price - b.price;
      }
      if (filterCriteria.sortBy === 'price_desc') {
        return b.price - a.price;
      }
      if (filterCriteria.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filterCriteria.sortBy === 'rating') {
        return b.owner.rating - a.owner.rating;
      }
      return 0;
    });
  }, [properties, filterCriteria]);

  // Category counts for quick tabs
  const typeCounts = useMemo(() => {
    return {
      all: properties.length,
      home: properties.filter((p) => p.type === 'home').length,
      room: properties.filter((p) => p.type === 'room').length,
      shop: properties.filter((p) => p.type === 'shop').length,
      portion: properties.filter((p) => p.type === 'portion').length,
    };
  }, [properties]);

  // Saved Properties List
  const savedPropertiesList = useMemo(() => {
    return properties.filter((p) => currentUser.savedPropertyIds.includes(p.id));
  }, [properties, currentUser.savedPropertyIds]);

  // Landlord My Properties
  const myPropertiesList = useMemo(() => {
    return properties.filter((p) => p.owner.id === currentUser.id);
  }, [properties, currentUser.id]);

  // Unread messages count
  const unreadMessagesCount = useMemo(() => {
    return conversations.reduce((sum, c) => sum + (c.unreadByTenant || 0), 0);
  }, [conversations]);

  // Save / Bookmark Toggle
  const handleToggleSave = (id: string) => {
    const isSaved = currentUser.savedPropertyIds.includes(id);
    let updated: string[];
    if (isSaved) {
      updated = currentUser.savedPropertyIds.filter((item) => item !== id);
      showToast('Removed from saved favorites');
    } else {
      updated = [...currentUser.savedPropertyIds, id];
      showToast('Saved to your favorites ❤️');
    }
    setCurrentUser((prev) => ({ ...prev, savedPropertyIds: updated }));
  };

  // Compare Toggle
  const handleToggleCompare = (property: Property) => {
    const exists = comparedProperties.some((p) => p.id === property.id);
    if (exists) {
      setComparedProperties((prev) => prev.filter((p) => p.id !== property.id));
      showToast('Removed from comparison');
    } else {
      if (comparedProperties.length >= 3) {
        showToast('You can compare up to 3 properties at once');
        return;
      }
      setComparedProperties((prev) => [...prev, property]);
      showToast(`Added "${property.title.slice(0, 20)}..." to compare`);
    }
  };

  // Open Chat for a Property
  const handleOpenChat = (property?: Property, initialPrompt?: string) => {
    if (!property) {
      setIsChatOpen(true);
      if (!activeConversationId && conversations.length > 0) {
        setActiveConversationId(conversations[0].id);
      }
      return;
    }

    // Find or create conversation for this property
    let existing = conversations.find((c) => c.propertyId === property.id);
    if (!existing) {
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyPrice: property.price,
        propertyImage: property.images[0],
        propertyType: property.type,
        propertyLocation: `${property.neighborhood}, ${property.city}`,
        tenantId: currentUser.id,
        tenantName: currentUser.name,
        tenantAvatar: currentUser.avatar,
        tenantPhone: currentUser.phone,
        ownerId: property.owner.id,
        ownerName: property.owner.name,
        ownerAvatar: property.owner.avatar,
        ownerPhone: property.owner.phone,
        ownerResponseRate: property.owner.responseRate,
        lastMessage: initialPrompt || `Hello ${property.owner.name}, is this listing available?`,
        lastMessageTimestamp: 'Just now',
        unreadByTenant: 0,
        unreadByOwner: 1,
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderRole: 'tenant',
            text: initialPrompt || `Hello ${property.owner.name}! I am interested in renting "${property.title}". Is it still available?`,
            timestamp: 'Just now',
            isRead: true
          }
        ]
      };

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    } else {
      setActiveConversationId(existing.id);
      if (initialPrompt) {
        handleSendMessage(existing.id, initialPrompt, 'text');
      }
    }

    setIsChatOpen(true);
  };

  // Send Message in Chat
  const handleSendMessage = (
    conversationId: string, 
    text: string, 
    type: 'text' | 'visit_request' | 'phone_shared' = 'text', 
    visitDetails?: { date: string; time: string }
  ) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'tenant' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      type,
      visitDate: visitDetails?.date,
      visitTime: visitDetails?.time
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTimestamp: newMessage.timestamp,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );
  };

  // Add new property listing (from wizard)
  const handleAddProperty = (newProperty: Property, isFeaturedSelected: boolean, feePaid: number) => {
    setProperties((prev) => [newProperty, ...prev]);
    
    // Update user quota
    setCurrentUser((prev) => ({
      ...prev,
      freeListingsUsed: prev.freeListingsUsed + 1
    }));

    showToast(
      isFeaturedSelected
        ? '🎉 Property published with 7-Day Featured Spotlight!'
        : '🎉 Property listed successfully on marketplace!'
    );
  };

  // Upgrade Membership
  const handleUpgradeTier = (newTier: MembershipTier) => {
    setCurrentUser((prev) => ({
      ...prev,
      tier: newTier,
      isVerified: true
    }));
    showToast(`👑 Plan upgraded to ${newTier.replace('_', ' ').toUpperCase()}!`);
  };

  // Landlord Actions
  const handleToggleFeatured = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          const newStatus = !p.isFeatured;
          showToast(newStatus ? '✨ Featured Spotlight Activated!' : 'Featured Spotlight paused');
          return { ...p, isFeatured: newStatus };
        }
        return p;
      })
    );
  };

  const handleToggleStatus = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          const newStatus = p.status === 'available' ? 'rented' : 'available';
          showToast(`Listing marked as ${newStatus.toUpperCase()}`);
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    showToast('Listing removed');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans pb-16 lg:pb-0">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 border border-emerald-500/50 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Header */}
      <Header
        user={currentUser}
        filterCriteria={filterCriteria}
        onFilterChange={handleFilterChange}
        onOpenPostListing={() => setIsPostModalOpen(true)}
        onOpenMembership={() => setIsMembershipModalOpen(true)}
        onOpenChat={() => handleOpenChat()}
        onOpenFavorites={() => setCurrentView('favorites')}
        onOpenDashboard={() => setCurrentView('dashboard')}
        onOpenCompare={() => setIsCompareDrawerOpen(true)}
        compareCount={comparedProperties.length}
        unreadMessagesCount={unreadMessagesCount}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: EXPLORE MARKETPLACE */}
        {currentView === 'explore' && (
          <div>
            {/* Filter Bar with Category Tabs & Quick Chips */}
            <FilterBar
              filterCriteria={filterCriteria}
              onFilterChange={handleFilterChange}
              onOpenAdvancedFilters={() => setIsAdvancedFilterOpen(true)}
              totalCount={filteredProperties.length}
              typeCounts={typeCounts}
              activeFilterCount={activeFilterCount}
              onResetFilters={handleResetFilters}
            />

            {/* Aggregator Hero Banner (Clean & High-Contrast) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
              <div className="bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-slate-800/80 rounded-3xl p-5 sm:p-7 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Direct Tenant-Owner Aggregator</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    Rent Homes, Rooms, Shops & Portions Without Middlemen
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Verified landlord profiles, real-time messaging, transparent rental rates, and physical visit scheduling.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4 text-slate-950" />
                    <span>List Your Space Free</span>
                  </button>

                  <button
                    onClick={() => setIsMembershipModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Boost Featured</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {filteredProperties.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl p-8 bg-slate-900/40 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">No Properties Matched Your Criteria</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try adjusting your budget slider, changing the category, or clearing specific amenities to see more listings.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      isSaved={currentUser.savedPropertyIds.includes(property.id)}
                      isCompared={comparedProperties.some((p) => p.id === property.id)}
                      onToggleSave={handleToggleSave}
                      onToggleCompare={handleToggleCompare}
                      onSelectProperty={(prop) => {
                        setSelectedProperty(prop);
                        setIsDetailOpen(true);
                      }}
                      onOpenChat={(prop) => handleOpenChat(prop)}
                      onShare={(prop) => showToast('Link copied to clipboard!')}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: SAVED FAVORITES */}
        {currentView === 'favorites' && (
          <SavedPropertiesView
            savedProperties={savedPropertiesList}
            onBackToExplore={() => setCurrentView('explore')}
            savedPropertyIds={currentUser.savedPropertyIds}
            comparedPropertyIds={comparedProperties.map((p) => p.id)}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onSelectProperty={(prop) => {
              setSelectedProperty(prop);
              setIsDetailOpen(true);
            }}
            onOpenChat={(prop) => handleOpenChat(prop)}
            onShare={(prop) => showToast('Link copied to clipboard!')}
          />
        )}

        {/* VIEW 3: LANDLORD HUB & MY LISTINGS */}
        {currentView === 'dashboard' && (
          <LandlordDashboard
            currentUser={currentUser}
            myProperties={myPropertiesList}
            onOpenPostListing={() => setIsPostModalOpen(true)}
            onOpenMembership={() => setIsMembershipModalOpen(true)}
            onSelectProperty={(prop) => {
              setSelectedProperty(prop);
              setIsDetailOpen(true);
            }}
            onToggleFeatured={handleToggleFeatured}
            onToggleStatus={handleToggleStatus}
            onDeleteProperty={handleDeleteProperty}
            onOpenChat={() => handleOpenChat()}
          />
        )}

      </main>

      {/* Property Detail Fullscreen Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProperty(null);
        }}
        isSaved={selectedProperty ? currentUser.savedPropertyIds.includes(selectedProperty.id) : false}
        isCompared={selectedProperty ? comparedProperties.some((p) => p.id === selectedProperty.id) : false}
        onToggleSave={handleToggleSave}
        onToggleCompare={handleToggleCompare}
        onOpenChat={(prop, prompt) => {
          setIsDetailOpen(false);
          handleOpenChat(prop, prompt);
        }}
        onShare={(prop) => showToast('Listing link copied to clipboard!')}
      />

      {/* Real-time Interactive Chat Messenger Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        setActiveConversationId={setActiveConversationId}
        onSendMessage={handleSendMessage}
        currentUser={currentUser}
      />

      {/* Multi-step Listing Post Wizard */}
      <PostListingModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        currentUser={currentUser}
        onAddProperty={handleAddProperty}
        onOpenMembership={() => {
          setIsPostModalOpen(false);
          setIsMembershipModalOpen(true);
        }}
      />

      {/* Pricing & Membership Monetization Modal */}
      <MembershipModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
        currentUser={currentUser}
        onUpgradeTier={handleUpgradeTier}
      />

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        isOpen={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
        filters={filterCriteria}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalFilteredCount={filteredProperties.length}
      />

      {/* Comparison Drawer */}
      <ComparisonDrawer
        isOpen={isCompareDrawerOpen}
        onClose={() => setIsCompareDrawerOpen(false)}
        comparedProperties={comparedProperties}
        onRemoveFromCompare={(id) => setComparedProperties((prev) => prev.filter((p) => p.id !== id))}
        onClearCompare={() => setComparedProperties([])}
        onSelectProperty={(prop) => {
          setIsCompareDrawerOpen(false);
          setSelectedProperty(prop);
          setIsDetailOpen(true);
        }}
        onOpenChat={(prop) => {
          setIsCompareDrawerOpen(false);
          handleOpenChat(prop);
        }}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenPostListing={() => setIsPostModalOpen(true)}
        onOpenChat={() => handleOpenChat()}
        savedCount={currentUser.savedPropertyIds.length}
        unreadChatCount={unreadMessagesCount}
      />

    </div>
  );
}
