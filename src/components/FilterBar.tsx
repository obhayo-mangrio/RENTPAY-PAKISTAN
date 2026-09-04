import React from 'react';
import { 
  Home, 
  BedDouble, 
  Store, 
  Layers, 
  LayoutGrid, 
  SlidersHorizontal, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  DollarSign,
  CheckCircle2,
  X
} from 'lucide-react';
import { PropertyType, FilterCriteria } from '../types';

interface FilterBarProps {
  filterCriteria: FilterCriteria;
  onFilterChange: (filters: Partial<FilterCriteria>) => void;
  onOpenAdvancedFilters: () => void;
  totalCount: number;
  typeCounts: {
    all: number;
    home: number;
    room: number;
    shop: number;
    portion: number;
  };
  activeFilterCount: number;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterCriteria,
  onFilterChange,
  onOpenAdvancedFilters,
  totalCount,
  typeCounts,
  activeFilterCount,
  onResetFilters
}) => {
  const categories: { id: PropertyType | 'all'; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'All Listings', icon: <LayoutGrid className="w-4 h-4" />, count: typeCounts.all },
    { id: 'home', label: 'Homes & Villas', icon: <Home className="w-4 h-4" />, count: typeCounts.home },
    { id: 'room', label: 'Rooms & Studios', icon: <BedDouble className="w-4 h-4" />, count: typeCounts.room },
    { id: 'shop', label: 'Shops & Commercial', icon: <Store className="w-4 h-4" />, count: typeCounts.shop },
    { id: 'portion', label: 'Portions & Floors', icon: <Layers className="w-4 h-4" />, count: typeCounts.portion },
  ];

  return (
    <div className="bg-slate-900/60 border-b border-slate-800 py-3.5 sticky top-16 sm:top-20 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Category Tabs */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isActive = filterCriteria.type === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange({ type: cat.id })}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span className={isActive ? 'text-slate-950' : 'text-emerald-400'}>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700/80 text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Advanced Filter & Reset Button */}
          <div className="flex items-center gap-2 shrink-0 pl-2">
            <button
              onClick={onOpenAdvancedFilters}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                activeFilterCount > 0
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Advanced Filters</span>
              <span className="sm:hidden">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={onResetFilters}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                title="Reset all filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Chips & Sorting Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            
            {/* Verified Landlord Toggle */}
            <button
              onClick={() => onFilterChange({ verifiedLandlordOnly: !filterCriteria.verifiedLandlordOnly })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                filterCriteria.verifiedLandlordOnly
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-850 hover:bg-slate-800 border-slate-700/60 text-slate-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Hosts</span>
            </button>

            {/* Featured Only Toggle */}
            <button
              onClick={() => onFilterChange({ featuredOnly: !filterCriteria.featuredOnly })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                filterCriteria.featuredOnly
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-850 hover:bg-slate-800 border-slate-700/60 text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Featured Only</span>
            </button>

            {/* Bills Included */}
            <button
              onClick={() => onFilterChange({ billsIncludedOnly: !filterCriteria.billsIncludedOnly })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                filterCriteria.billsIncludedOnly
                  ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                  : 'bg-slate-850 hover:bg-slate-800 border-slate-700/60 text-slate-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-teal-400" />
              <span>Bills Included</span>
            </button>

            {/* Under Rs. 50,000 */}
            <button
              onClick={() => {
                if (filterCriteria.maxPrice === 50000) {
                  onFilterChange({ maxPrice: 500000 });
                } else {
                  onFilterChange({ maxPrice: 50000 });
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                filterCriteria.maxPrice <= 50000
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                  : 'bg-slate-850 hover:bg-slate-800 border-slate-700/60 text-slate-400'
              }`}
            >
              <span>Under Rs. 50k</span>
            </button>

          </div>

          {/* Sort By Dropdown & Total Count */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-slate-400 font-medium">
              <strong className="text-white">{totalCount}</strong> properties found
            </span>

            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-lg px-2 py-1">
              <span className="text-slate-400 text-[11px]">Sort:</span>
              <select
                value={filterCriteria.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer text-xs pr-1"
              >
                <option value="featured" className="bg-slate-900 text-white">Featured First</option>
                <option value="price_asc" className="bg-slate-900 text-white">Price: Low to High</option>
                <option value="price_desc" className="bg-slate-900 text-white">Price: High to Low</option>
                <option value="newest" className="bg-slate-900 text-white">Newest First</option>
                <option value="rating" className="bg-slate-900 text-white">Highest Rated Owner</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
