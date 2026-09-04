import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Heart, 
  MessageSquare, 
  PlusCircle, 
  ShieldCheck, 
  Crown, 
  Sparkles,
  MapPin,
  Scale,
  Menu,
  X
} from 'lucide-react';
import { UserAccount, FilterCriteria } from '../types';
import { CITIES } from '../data/mockData';

interface HeaderProps {
  user: UserAccount;
  filterCriteria: FilterCriteria;
  onFilterChange: (filters: Partial<FilterCriteria>) => void;
  onOpenPostListing: () => void;
  onOpenMembership: () => void;
  onOpenChat: (conversationId?: string) => void;
  onOpenFavorites: () => void;
  onOpenDashboard: () => void;
  onOpenCompare: () => void;
  compareCount: number;
  unreadMessagesCount: number;
  currentView: 'explore' | 'favorites' | 'dashboard';
  setCurrentView: (view: 'explore' | 'favorites' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  filterCriteria,
  onFilterChange,
  onOpenPostListing,
  onOpenMembership,
  onOpenChat,
  onOpenFavorites,
  onOpenDashboard,
  onOpenCompare,
  compareCount,
  unreadMessagesCount,
  currentView,
  setCurrentView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const remainingFreeListings = Math.max(0, user.freeListingsTotal - user.freeListingsUsed);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('explore')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xl tracking-tight text-white">Rent<span className="text-emerald-400">Pay</span></span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Pakistan
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Homes • Rooms • Shops • Portions</p>
              </div>
            </button>
          </div>

          {/* Quick Search & City Selector (Desktop/Tablet) */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-4">
            <div className="flex items-center w-full bg-slate-800/90 border border-slate-700/80 rounded-xl p-1.5 shadow-inner">
              <div className="flex items-center gap-1.5 px-2 border-r border-slate-700 text-slate-300 text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <select
                  value={filterCriteria.city}
                  onChange={(e) => onFilterChange({ city: e.target.value })}
                  className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center flex-1 px-2.5">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by neighborhood, area, keywords..."
                  value={filterCriteria.searchQuery}
                  onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                {filterCriteria.searchQuery && (
                  <button 
                    onClick={() => onFilterChange({ searchQuery: '' })}
                    className="text-slate-400 hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            
            {/* Compare Drawer Trigger */}
            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-amber-300 text-xs font-medium transition-colors"
                title="Compare Selected Properties"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Compare ({compareCount})</span>
              </button>
            )}

            {/* Saved Favorites */}
            <button
              onClick={() => {
                onOpenFavorites();
                setCurrentView('favorites');
              }}
              className={`relative p-2.5 rounded-xl border transition-colors ${
                currentView === 'favorites'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white'
              }`}
              title="Saved Properties"
            >
              <Heart className="w-4 h-4" />
              {user.savedPropertyIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900">
                  {user.savedPropertyIds.length}
                </span>
              )}
            </button>

            {/* Live Chat Inquiries */}
            <button
              onClick={() => onOpenChat()}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
              title="Direct Owner Chat & Inquiries"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-emerald-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Membership / Pricing Button */}
            <button
              onClick={onOpenMembership}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{user.tier === 'pro_host' ? 'Pro Host' : user.tier === 'agency' ? 'Agency VIP' : 'Upgrade Plans'}</span>
            </button>

            {/* Landlord Portal / My Listings */}
            <button
              onClick={() => {
                onOpenDashboard();
                setCurrentView('dashboard');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                currentView === 'dashboard'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              Landlord Hub
            </button>

            {/* Post Property Button (Highlight) */}
            <button
              onClick={onOpenPostListing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Post Listing</span>
              {remainingFreeListings > 0 && user.tier === 'free' && (
                <span className="bg-slate-950/20 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                  {remainingFreeListings} Free
                </span>
              )}
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center pl-2 border-l border-slate-800">
              <div className="relative cursor-pointer" onClick={onOpenDashboard}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-emerald-500/50 object-cover"
                />
                {user.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-0.5 -right-0.5 bg-slate-900 rounded-full" />
                )}
              </div>
            </div>

          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onOpenChat()}
              className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenPostListing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Input Bar */}
        <div className="md:hidden pb-3 pt-1">
          <div className="flex items-center w-full bg-slate-800/90 border border-slate-700/80 rounded-xl p-1.5">
            <div className="flex items-center gap-1 px-1.5 border-r border-slate-700 text-slate-300 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={filterCriteria.city}
                onChange={(e) => onFilterChange({ city: e.target.value })}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c.split(',')[0]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center flex-1 px-2">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <input
                type="text"
                placeholder="Search homes, rooms, shops..."
                value={filterCriteria.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 py-3 space-y-2 bg-slate-900 px-2 rounded-b-2xl">
            <button
              onClick={() => {
                setCurrentView('explore');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Explore Marketplace</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('favorites');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Saved Favorites</span>
              </span>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                {user.savedPropertyIds.length}
              </span>
            </button>
            <button
              onClick={() => {
                setCurrentView('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Landlord Hub & My Listings</span>
            </button>
            <button
              onClick={() => {
                onOpenMembership();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-300 hover:bg-slate-800 flex items-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Membership & Featured Boosts</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
