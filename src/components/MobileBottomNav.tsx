import React from 'react';
import { Building2, Heart, MessageSquare, PlusCircle, ShieldCheck } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: 'explore' | 'favorites' | 'dashboard';
  setCurrentView: (view: 'explore' | 'favorites' | 'dashboard') => void;
  onOpenPostListing: () => void;
  onOpenChat: () => void;
  savedCount: number;
  unreadChatCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  setCurrentView,
  onOpenPostListing,
  onOpenChat,
  savedCount,
  unreadChatCount
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 text-[11px] shadow-2xl">
      <div className="flex items-center justify-around">
        
        {/* Explore */}
        <button
          onClick={() => setCurrentView('explore')}
          className={`flex flex-col items-center gap-1 font-medium transition-colors ${
            currentView === 'explore' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span>Explore</span>
        </button>

        {/* Saved */}
        <button
          onClick={() => setCurrentView('favorites')}
          className={`relative flex flex-col items-center gap-1 font-medium transition-colors ${
            currentView === 'favorites' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>Saved</span>
          {savedCount > 0 && (
            <span className="absolute -top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

        {/* Post Plus Center Button */}
        <button
          onClick={onOpenPostListing}
          className="flex flex-col items-center gap-0.5 text-slate-950 font-bold -mt-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-4 ring-slate-900">
            <PlusCircle className="w-6 h-6 text-slate-950" />
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Post +</span>
        </button>

        {/* Live Chat */}
        <button
          onClick={onOpenChat}
          className="relative flex flex-col items-center gap-1 font-medium text-slate-400 hover:text-slate-200"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Inquiries</span>
          {unreadChatCount > 0 && (
            <span className="absolute -top-1 right-2 min-w-3.5 h-3.5 px-0.5 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-bold flex items-center justify-center">
              {unreadChatCount}
            </span>
          )}
        </button>

        {/* Landlord Hub */}
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 font-medium transition-colors ${
            currentView === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Landlord</span>
        </button>

      </div>
    </div>
  );
};
