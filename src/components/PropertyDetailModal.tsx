import React, { useState } from 'react';
import { 
  X, 
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
  Check, 
  Calendar, 
  Clock, 
  Scale, 
  Zap, 
  Info,
  Navigation,
  CheckCircle2,
  Building,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Property } from '../types';
import { formatPrice, formatTypeLabel, formatFurnishing, formatSuitableFor, getCleanPhoneNumber } from '../utils/helpers';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (id: string) => void;
  onToggleCompare: (property: Property) => void;
  onOpenChat: (property: Property, initialPrompt?: string) => void;
  onShare: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onOpenChat,
  onShare
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !property) return null;

  const handleCall = () => {
    const cleanNum = getCleanPhoneNumber(property.owner.phone);
    window.location.href = `tel:${cleanNum}`;
  };

  const handleWhatsApp = () => {
    const cleanNum = getCleanPhoneNumber(property.owner.whatsapp || property.owner.phone);
    const message = encodeURIComponent(`Hi ${property.owner.name}, I found your listing "${property.title}" on RentPay. I would like to know if it's available.`);
    window.open(`https://wa.me/${cleanNum}?text=${message}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const quickQuestions = [
    "Is this property still available for rent?",
    "Can I schedule a visit tomorrow?",
    "Is the monthly rent negotiable?",
    "What are the security deposit terms?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase">
              {formatTypeLabel(property.type)}
            </span>
            {property.isFeatured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Sparkles className="w-3 h-3" />
                Spotlight Listing
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(property)}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isCompared
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700 hover:text-rose-400'
              }`}
              title="Save property"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Share listing link"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto custom-scrollbar flex-1 p-4 sm:p-6 space-y-6">
          
          {/* Main Gallery */}
          <div className="space-y-2">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={property.images[selectedImageIndex] || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-slate-700"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-slate-700"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-xs text-white border border-slate-700">
                Photo {selectedImageIndex + 1} of {property.images.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      idx === selectedImageIndex ? 'border-emerald-400 scale-95' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Pricing & Location Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1.5 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{property.address}, {property.neighborhood}, {property.city}</span>
              </div>
              {property.landmark && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs pl-5">
                  <Navigation className="w-3 h-3 text-teal-400" />
                  <span>Landmark: {property.landmark}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-850 border border-slate-800 p-3.5 rounded-2xl shrink-0 space-y-1 min-w-[200px]">
              <div className="text-xs text-slate-400">Monthly Rent</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-white">{formatPrice(property.price)}</span>
                <span className="text-slate-400 text-xs font-semibold">/ month</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                <span>Security Deposit:</span>
                <span className="font-semibold text-slate-200">{formatPrice(property.securityDeposit)}</span>
              </div>
              {property.isNegotiable && (
                <span className="inline-block text-[10px] text-emerald-400 font-bold">
                  ✓ Rent is slightly negotiable
                </span>
              )}
            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-850/70 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Bedrooms</div>
                <div className="font-bold text-white text-sm">
                  {property.type === 'shop' ? 'Commercial' : `${property.bedrooms} Bed`}
                </div>
              </div>
            </div>

            <div className="bg-slate-850/70 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Bathrooms</div>
                <div className="font-bold text-white text-sm">{property.bathrooms} Bath</div>
              </div>
            </div>

            <div className="bg-slate-850/70 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Total Area</div>
                <div className="font-bold text-white text-sm">{property.sizeSqFt} sq. ft</div>
              </div>
            </div>

            <div className="bg-slate-850/70 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Floor Level</div>
                <div className="font-bold text-white text-sm">
                  {property.floorNumber === 0 ? 'Ground Floor' : `Floor ${property.floorNumber} of ${property.totalFloors}`}
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Section: Details & Verified Owner Contact Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Description, Amenities, Conditions */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-bold text-white text-base">About this Property</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Conditions / Preferences */}
              <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rental Terms & Suitability</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Suitability:</span>
                    <p className="font-semibold text-emerald-300">{formatSuitableFor(property.suitableFor)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Furnishing:</span>
                    <p className="font-semibold text-slate-200">{formatFurnishing(property.furnishing)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Bills Included:</span>
                    <p className="font-semibold text-slate-200">
                      {property.billsIncluded ? `Yes (${property.includedBills?.join(', ') || 'All Included'})` : 'Paid by Tenant'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Availability:</span>
                    <p className="font-semibold text-emerald-400">Immediate Move-in</p>
                  </div>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-3">
                <h3 className="font-bold text-white text-base">Amenities & Facilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-850/40 border border-slate-800/80 text-xs text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Commute & Neighborhood Highlights */}
              <div className="space-y-3">
                <h3 className="font-bold text-white text-base">Nearby Commute & Landmarks</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-850/50 border border-slate-800 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    <span>Metro / Bus: <strong>4 mins</strong></span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-850/50 border border-slate-800 flex items-center gap-2">
                    <Building className="w-4 h-4 text-teal-400" />
                    <span>Supermarket: <strong>2 mins</strong></span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-850/50 border border-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Hospital: <strong>6 mins</strong></span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Verified Owner Card & Instant Inquiry Launcher */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Landlord Profile Box */}
              <div className="bg-slate-850 border border-slate-750 p-5 rounded-2xl space-y-4 shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img
                      src={property.owner.avatar}
                      alt={property.owner.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/50"
                    />
                    {property.owner.isPhoneVerified && (
                      <div className="absolute -bottom-1 -right-1 p-0.5 bg-slate-900 rounded-full" title="Verified Landlord">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-white text-base">{property.owner.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400">{property.owner.joinedDate}</p>
                    
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300">
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        ★ {property.owner.rating} <span className="text-slate-400 font-normal">({property.owner.reviewCount})</span>
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">Response: <strong className="text-emerald-400">{property.owner.responseRate}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Direct Landlord Contact Phone / WA */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Direct Owner Contact:</span>
                    <span className="text-emerald-400 font-mono font-bold">{property.owner.phone}</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleCall}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-400" />
                      <span>Direct Call</span>
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Instant Real-Time Chat Trigger */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => onOpenChat(property)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Start Real-Time Chat with Owner</span>
                  </button>

                  {/* One-Click Quick Inquiry Buttons */}
                  <div className="space-y-1.5 pt-2">
                    <div className="text-[11px] font-semibold text-slate-400">Quick Inquiry Prompts:</div>
                    <div className="space-y-1">
                      {quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => onOpenChat(property, q)}
                          className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-xs transition-colors truncate"
                        >
                          💬 "{q}"
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
