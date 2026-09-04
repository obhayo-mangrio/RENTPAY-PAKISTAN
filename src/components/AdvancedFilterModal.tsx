import React from 'react';
import { X, SlidersHorizontal, Check, RefreshCw, Sparkles } from 'lucide-react';
import { FilterCriteria, PropertyType, SuitableFor, FurnishingStatus } from '../types';
import { AMENITY_OPTIONS } from '../data/mockData';

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterCriteria;
  onFilterChange: (filters: Partial<FilterCriteria>) => void;
  onReset: () => void;
  totalFilteredCount: number;
}

export const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  totalFilteredCount
}) => {
  if (!isOpen) return null;

  const toggleAmenity = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    if (exists) {
      onFilterChange({ amenities: filters.amenities.filter((a) => a !== amenity) });
    } else {
      onFilterChange({ amenities: [...filters.amenities, amenity] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Advanced Search Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 text-sm">
          
          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200">Monthly Rent Budget (PKR)</label>
              <span className="text-emerald-400 font-bold">
                Rs. {filters.minPrice.toLocaleString()} - {filters.maxPrice >= 500000 ? 'Rs. 500,000+' : `Rs. ${filters.maxPrice.toLocaleString()}`} / mo
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="500000"
                step="5000"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Rs. 0</span>
              <span>Rs. 100k</span>
              <span>Rs. 250k</span>
              <span>Rs. 350k</span>
              <span>Rs. 500k+</span>
            </div>
          </div>

          {/* Suitable For */}
          <div className="space-y-2.5">
            <label className="font-semibold text-slate-200">Suitable For / Tenant Preference</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['all', 'family', 'bachelors', 'females', 'commercial', 'any'] as (SuitableFor | 'all')[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onFilterChange({ suitableFor: st })}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-colors text-left flex items-center justify-between ${
                    filters.suitableFor === st
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                  }`}
                >
                  <span>{st === 'all' ? 'Any Preference' : st}</span>
                  {filters.suitableFor === st && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Furnishing Status */}
          <div className="space-y-2.5">
            <label className="font-semibold text-slate-200">Furnishing Condition</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['all', 'fully-furnished', 'semi-furnished', 'unfurnished'] as (FurnishingStatus | 'all')[]).map((f) => (
                <button
                  key={f}
                  onClick={() => onFilterChange({ furnishing: f })}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-colors text-center ${
                    filters.furnishing === f
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                  }`}
                >
                  {f === 'all' ? 'Any' : f.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-semibold text-slate-200">Bedrooms</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {(['all', 1, 2, 3, 4] as (number | 'all')[]).map((b) => (
                  <button
                    key={b}
                    onClick={() => onFilterChange({ bedrooms: b })}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-colors text-center ${
                      filters.bedrooms === b
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {b === 'all' ? 'Any' : `${b}+ Beds`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-slate-200">Bathrooms</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {(['all', 1, 2, 3] as (number | 'all')[]).map((bath) => (
                  <button
                    key={bath}
                    onClick={() => onFilterChange({ bathrooms: bath })}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-colors text-center ${
                      filters.bathrooms === bath
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {bath === 'all' ? 'Any' : `${bath}+ Bath`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities Multi-Select */}
          <div className="space-y-2.5">
            <label className="font-semibold text-slate-200">Key Amenities & Facilities</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const isSelected = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 font-medium'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Show {totalFilteredCount} Properties
          </button>
        </div>

      </div>
    </div>
  );
};
