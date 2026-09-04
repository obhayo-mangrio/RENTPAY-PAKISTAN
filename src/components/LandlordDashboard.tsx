import React from 'react';
import { 
  Building2, 
  PlusCircle, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Trash2, 
  CheckCircle, 
  ExternalLink,
  Zap,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property, UserAccount } from '../types';
import { formatPrice, formatTypeLabel } from '../utils/helpers';

interface LandlordDashboardProps {
  currentUser: UserAccount;
  myProperties: Property[];
  onOpenPostListing: () => void;
  onOpenMembership: () => void;
  onSelectProperty: (property: Property) => void;
  onToggleFeatured: (propertyId: string) => void;
  onToggleStatus: (propertyId: string) => void;
  onDeleteProperty: (propertyId: string) => void;
  onOpenChat: () => void;
}

export const LandlordDashboard: React.FC<LandlordDashboardProps> = ({
  currentUser,
  myProperties,
  onOpenPostListing,
  onOpenMembership,
  onSelectProperty,
  onToggleFeatured,
  onToggleStatus,
  onDeleteProperty,
  onOpenChat
}) => {
  const totalViews = myProperties.reduce((acc, p) => acc + p.viewsCount, 0);
  const totalInquiries = myProperties.reduce((acc, p) => acc + p.inquiriesCount, 0);
  const activeCount = myProperties.filter((p) => p.status === 'available').length;

  const remainingFreeListings = Math.max(0, currentUser.freeListingsTotal - currentUser.freeListingsUsed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner: Profile, Tier & Post Action */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/60 shadow-lg"
            />
            {currentUser.isVerified && (
              <div className="absolute -bottom-1 -right-1 p-1 bg-slate-900 rounded-full text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
              <span className="text-[11px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Landlord
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser.phone} • {currentUser.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                {currentUser.tier === 'pro_host' ? 'Pro Host Plan' : currentUser.tier === 'agency' ? 'Agency VIP' : 'Free Starter Tier'}
              </span>
              {currentUser.tier === 'free' && (
                <span className="text-xs text-slate-400">
                  ({remainingFreeListings} free posts remaining)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenMembership}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Manage Plan</span>
          </button>

          <button
            onClick={onOpenPostListing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Post New Listing</span>
          </button>
        </div>

      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Listings</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeCount}</div>
          <div className="text-[11px] text-emerald-400">Live on Aggregator</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Tenant Views</span>
            <Eye className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalViews.toLocaleString()}</div>
          <div className="text-[11px] text-teal-400">+18% this week</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Direct Inquiries</span>
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalInquiries}</div>
          <div className="text-[11px] text-indigo-400">Via Chat & Calls</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Listing Quota Status</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {currentUser.tier === 'free' ? `${currentUser.freeListingsUsed} / ${currentUser.freeListingsTotal}` : 'Unlimited'}
          </div>
          <div className="text-[11px] text-amber-300">
            {currentUser.tier === 'free' ? `${remainingFreeListings} Free Left` : 'Pro Active'}
          </div>
        </div>

      </div>

      {/* My Listings Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">My Properties ({myProperties.length})</h2>
            <p className="text-xs text-slate-400">Manage listing availability, featured spotlight status, and tenant leads</p>
          </div>

          <button
            onClick={onOpenPostListing}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Another</span>
          </button>
        </div>

        {myProperties.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl space-y-3">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No properties listed yet</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              List your homes, rooms, shops, or portions to start receiving verified tenant inquiries directly on your phone and chat.
            </p>
            <button
              onClick={onOpenPostListing}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              Post Your First Listing Free
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-slate-850/60 hover:bg-slate-850 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
              >
                {/* Media & Info */}
                <div 
                  onClick={() => onSelectProperty(prop)}
                  className="flex items-center gap-3.5 flex-1 cursor-pointer min-w-0"
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                        {formatTypeLabel(prop.type)}
                      </span>
                      {prop.isFeatured && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                          <Sparkles className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        prop.status === 'available'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {prop.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm sm:text-base truncate mt-1 hover:text-emerald-400">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {prop.address}, {prop.neighborhood}, {prop.city} • <strong className="text-emerald-400">{formatPrice(prop.price)}/mo</strong>
                    </p>
                  </div>
                </div>

                {/* Listing Stats */}
                <div className="flex items-center gap-4 text-xs text-slate-300 shrink-0">
                  <div className="text-center">
                    <div className="font-bold text-white">{prop.viewsCount}</div>
                    <div className="text-[10px] text-slate-400">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-emerald-400">{prop.inquiriesCount}</div>
                    <div className="text-[10px] text-slate-400">Inquiries</div>
                  </div>
                </div>

                {/* Management Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  
                  {/* Featured Boost Toggle */}
                  <button
                    onClick={() => {
                      onToggleFeatured(prop.id);
                      if (!prop.isFeatured) {
                        confetti({ particleCount: 50, spread: 60 });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                      prop.isFeatured
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-amber-300'
                    }`}
                    title={prop.isFeatured ? 'Active Spotlight' : 'Boost with Featured Spotlight (Rs. 500)'}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{prop.isFeatured ? 'Spotlight Active' : 'Boost'}</span>
                  </button>

                  {/* Mark as Rented / Available */}
                  <button
                    onClick={() => onToggleStatus(prop.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    {prop.status === 'available' ? 'Mark Rented' : 'Mark Available'}
                  </button>

                  {/* Open Chat Inbox */}
                  <button
                    onClick={onOpenChat}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-400"
                    title="View inquiries chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteProperty(prop.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
