import React, { useState } from 'react';
import { 
  Heart, 
  Share2, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Scale,
  Zap,
  Star,
  ExternalLink
} from 'lucide-react';
import { Property } from '../types';
import { formatPrice, formatTypeLabel, getCleanPhoneNumber } from '../utils/helpers';

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (id: string) => void;
  onToggleCompare: (property: Property) => void;
  onSelectProperty: (property: Property) => void;
  onOpenChat: (property: Property) => void;
  onShare: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onSelectProperty,
  onOpenChat,
  onShare
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNum = getCleanPhoneNumber(property.owner.phone);
    window.location.href = `tel:${cleanNum}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNum = getCleanPhoneNumber(property.owner.whatsapp || property.owner.phone);
    const message = encodeURIComponent(`Hi ${property.owner.name}, I am interested in your listing "${property.title}" (${formatPrice(property.price)}/mo) on RentPay. Is it available?`);
    window.open(`https://wa.me/${cleanNum}?text=${message}`, '_blank');
  };

  return (
    <div 
      onClick={() => onSelectProperty(property)}
      className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Media / Image Carousel Container */}
      <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Gradient Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Category Badge */}
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[11px] font-bold tracking-wide uppercase border border-slate-700/60 shadow">
              {formatTypeLabel(property.type)}
            </span>

            {/* Featured Spotlight Badge */}
            {property.isFeatured && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[11px] font-extrabold shadow-md shadow-amber-500/20">
                <Sparkles className="w-3 h-3 text-slate-950 fill-current" />
                Featured
              </span>
            )}
          </div>

          {/* Top Actions: Compare & Save & Share */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(property);
              }}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                isCompared
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900/80 hover:bg-slate-900 text-slate-300 border-slate-700/80 hover:text-white'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Add to compare'}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(property.id);
              }}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                isSaved
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-900 text-slate-300 border-slate-700/80 hover:text-rose-400'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save property'}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/60 backdrop-blur-sm">
              {property.images.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'w-4 bg-emerald-400' : 'w-1.5 bg-slate-400/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Price & Deposit Strip */}
        <div className="absolute bottom-3 left-3 flex items-baseline gap-2">
          <div className="px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 shadow">
            <span className="text-lg font-black text-white">{formatPrice(property.price)}</span>
            <span className="text-[11px] text-slate-400 font-medium"> /mo</span>
          </div>

          {property.billsIncluded && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-500/20 backdrop-blur-md border border-teal-500/40 text-teal-300 text-[10px] font-bold">
              <Zap className="w-3 h-3 text-teal-400" />
              Bills Included
            </span>
          )}
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Title & Location */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-emerald-400 transition-colors">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{property.neighborhood}, {property.city}</span>
          </div>
        </div>

        {/* Key Property Specs */}
        <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xl bg-slate-850/60 border border-slate-800/80 text-xs text-slate-300">
          {property.type !== 'shop' ? (
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-200">{property.bedrooms}</span>
              <span className="text-slate-400 text-[11px]">Beds</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-200">Shop</span>
              <span className="text-slate-400 text-[11px]">Space</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-200">{property.bathrooms}</span>
            <span className="text-slate-400 text-[11px]">Baths</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-200">{property.sizeSqFt}</span>
            <span className="text-slate-400 text-[11px]">sqft</span>
          </div>
        </div>

        {/* Landlord Trust Badge & Verification Row */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/70 text-xs">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={property.owner.avatar}
                alt={property.owner.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
              />
              {property.owner.isPhoneVerified && (
                <ShieldCheck className="w-3 h-3 text-emerald-400 absolute -bottom-0.5 -right-0.5 bg-slate-900 rounded-full" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-200 text-xs truncate max-w-[110px]">
                  {property.owner.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
                <span className="font-medium text-slate-300">{property.owner.rating}</span>
                <span>• Responds {property.owner.responseTime}</span>
              </div>
            </div>
          </div>

          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            {property.suitableFor === 'family' ? 'Family' : property.suitableFor === 'bachelors' ? 'Bachelor' : property.suitableFor}
          </span>
        </div>

        {/* Action Buttons: Instant Chat, Call, WhatsApp */}
        <div className="grid grid-cols-12 gap-1.5 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenChat(property);
            }}
            className="col-span-6 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Landlord</span>
          </button>

          <button
            onClick={handleCall}
            className="col-span-3 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-medium text-xs transition-colors"
            title={`Call ${property.owner.phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-teal-400" />
            <span>Call</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="col-span-3 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 font-medium text-xs transition-colors"
            title="Chat on WhatsApp"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>WA</span>
          </button>
        </div>

      </div>
    </div>
  );
};
