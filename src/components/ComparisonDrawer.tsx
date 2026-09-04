import React from 'react';
import { X, Scale, Check, Trash2, MessageSquare, Phone } from 'lucide-react';
import { Property } from '../types';
import { formatPrice, formatTypeLabel, formatFurnishing, formatSuitableFor, getCleanPhoneNumber } from '../utils/helpers';

interface ComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProperties: Property[];
  onRemoveFromCompare: (propertyId: string) => void;
  onClearCompare: () => void;
  onSelectProperty: (property: Property) => void;
  onOpenChat: (property: Property) => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  isOpen,
  onClose,
  comparedProperties,
  onRemoveFromCompare,
  onClearCompare,
  onSelectProperty,
  onOpenChat
}) => {
  if (!isOpen || comparedProperties.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-white text-base sm:text-lg">
              Compare Properties ({comparedProperties.length})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearCompare}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto custom-scrollbar p-6 flex-1 text-xs">
          <div className="grid grid-flow-col auto-cols-[260px] sm:auto-cols-[300px] gap-4">
            {comparedProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-slate-850/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4"
              >
                {/* Image & Remove */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                  <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => onRemoveFromCompare(prop.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-rose-400"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-emerald-400 text-[10px] font-bold">
                    {formatTypeLabel(prop.type)}
                  </span>
                </div>

                {/* Title & Price */}
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-1 hover:text-emerald-400 cursor-pointer" onClick={() => onSelectProperty(prop)}>
                    {prop.title}
                  </h3>
                  <div className="text-emerald-400 font-extrabold text-base mt-1">
                    {formatPrice(prop.price)} <span className="text-slate-400 font-normal text-xs">/ mo</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Deposit: {formatPrice(prop.securityDeposit)}
                  </div>
                </div>

                {/* Specs Comparison List */}
                <div className="space-y-2 py-2 border-t border-b border-slate-800 text-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-semibold text-right truncate max-w-[150px]">{prop.neighborhood}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bedrooms:</span>
                    <span className="font-semibold">{prop.bedrooms} Beds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bathrooms:</span>
                    <span className="font-semibold">{prop.bathrooms} Baths</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="font-semibold">{prop.sizeSqFt} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Furnishing:</span>
                    <span className="font-semibold">{formatFurnishing(prop.furnishing)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bills Included:</span>
                    <span className="font-semibold text-emerald-400">{prop.billsIncluded ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Suitability:</span>
                    <span className="font-semibold">{formatSuitableFor(prop.suitableFor)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Landlord:</span>
                    <span className="font-semibold">{prop.owner.name} ({prop.owner.rating}★)</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onOpenChat(prop)}
                    className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={() => {
                      const clean = getCleanPhoneNumber(prop.owner.phone);
                      window.location.href = `tel:${clean}`;
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200"
                    title={`Call ${prop.owner.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
