import React from 'react';
import { Heart, ArrowLeft, Building2 } from 'lucide-react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface SavedPropertiesViewProps {
  savedProperties: Property[];
  onBackToExplore: () => void;
  savedPropertyIds: string[];
  comparedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  onToggleCompare: (property: Property) => void;
  onSelectProperty: (property: Property) => void;
  onOpenChat: (property: Property) => void;
  onShare: (property: Property) => void;
}

export const SavedPropertiesView: React.FC<SavedPropertiesViewProps> = ({
  savedProperties,
  onBackToExplore,
  savedPropertyIds,
  comparedPropertyIds,
  onToggleSave,
  onToggleCompare,
  onSelectProperty,
  onOpenChat,
  onShare
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToExplore}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Properties</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold">
          <Heart className="w-4 h-4 fill-current" />
          <span>{savedProperties.length} Saved Properties</span>
        </div>
      </div>

      {savedProperties.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl space-y-3 bg-slate-900/40">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-white">No Saved Properties Yet</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Tap the heart icon on any property card to bookmark your favorite homes, rooms, shops, or portions for quick access later.
          </p>
          <button
            onClick={onBackToExplore}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
          >
            Explore Listings
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {savedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSaved={true}
              isCompared={comparedPropertyIds.includes(property.id)}
              onToggleSave={onToggleSave}
              onToggleCompare={onToggleCompare}
              onSelectProperty={onSelectProperty}
              onOpenChat={onOpenChat}
              onShare={onShare}
            />
          ))}
        </div>
      )}
    </div>
  );
};
