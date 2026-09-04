import React, { useState } from 'react';
import { 
  X, 
  Home, 
  BedDouble, 
  Store, 
  Layers, 
  Upload, 
  Sparkles, 
  Check, 
  DollarSign, 
  MapPin, 
  ShieldCheck, 
  Crown, 
  AlertCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property, PropertyType, SuitableFor, FurnishingStatus, UserAccount } from '../types';
import { CITIES, AMENITY_OPTIONS, PRESET_IMAGE_PACKS } from '../data/mockData';
import { compressImageFile, formatFurnishing } from '../utils/helpers';

interface PostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onAddProperty: (property: Property, isFeaturedSelected: boolean, feePaid: number) => void;
  onOpenMembership: () => void;
}

export const PostListingModal: React.FC<PostListingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddProperty,
  onOpenMembership
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [type, setType] = useState<PropertyType>('home');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(45000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(90000);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [billsIncluded, setBillsIncluded] = useState(false);
  const [suitableFor, setSuitableFor] = useState<SuitableFor>('family');

  // Location
  const [city, setCity] = useState(CITIES[1] || 'Karachi');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');

  // Specs & Amenities
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [sizeSqFt, setSizeSqFt] = useState(2250);
  const [floorNumber, setFloorNumber] = useState(1);
  const [totalFloors, setTotalFloors] = useState(2);
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('semi-furnished');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Car Porch / Dedicated Parking',
    'Sui Gas Connection',
    '24/7 Water Supply & Boring'
  ]);

  // Photos
  const [images, setImages] = useState<string[]>(PRESET_IMAGE_PACKS.home);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Monetization & Feature Boost
  const [boostAsFeatured, setBoostAsFeatured] = useState(false);

  if (!isOpen) return null;

  const isFreeListingAvailable = currentUser.tier !== 'free' || currentUser.freeListingsUsed < currentUser.freeListingsTotal;
  const payPerListingFee = isFreeListingAvailable ? 0 : 800;
  const featuredBoostFee = boostAsFeatured ? 500 : 0;
  const totalDue = payPerListingFee + featuredBoostFee;

  const handleTypeSelect = (selectedType: PropertyType) => {
    setType(selectedType);
    setImages(PRESET_IMAGE_PACKS[selectedType] || PRESET_IMAGE_PACKS.home);
    if (selectedType === 'shop') {
      setBedrooms(0);
      setSuitableFor('commercial');
    } else if (selectedType === 'room') {
      setBedrooms(1);
      setSuitableFor('bachelors');
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newCompressedImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressedData = await compressImageFile(files[i], 1200, 0.75);
        newCompressedImages.push(compressedData);
      }
      setImages((prev) => [...prev, ...newCompressedImages]);
    } catch (err) {
      console.error('Error compressing image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCustomUrl = () => {
    if (!customImageUrl.trim()) return;
    setImages((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleApplyPresetPack = () => {
    setImages(PRESET_IMAGE_PACKS[type] || PRESET_IMAGE_PACKS.home);
  };

  const handleSubmit = () => {
    const newProperty: Property = {
      id: `prop_${Date.now()}`,
      title: title || `${formatFurnishing(furnishing)} ${type.toUpperCase()} in ${neighborhood || city}`,
      description: description || `Well-maintained ${type} with high-quality finishes, spacious rooms, and prime connectivity in ${neighborhood || city}.`,
      type,
      price: Number(price),
      securityDeposit: Number(securityDeposit),
      isNegotiable,
      billsIncluded,
      city: city === 'All Cities' ? 'Karachi' : city,
      neighborhood: neighborhood || 'DHA Phase 5',
      address: address || `House ${Math.floor(Math.random() * 90 + 10)}, Street ${Math.floor(Math.random() * 20 + 1)}, ${city}`,
      landmark: landmark || 'Near Main Commercial Market',
      bedrooms: type === 'shop' ? 0 : Number(bedrooms),
      bathrooms: Number(bathrooms),
      sizeSqFt: Number(sizeSqFt),
      floorNumber: Number(floorNumber),
      totalFloors: Number(totalFloors),
      furnishing,
      suitableFor,
      amenities: selectedAmenities,
      images: images.length > 0 ? images : PRESET_IMAGE_PACKS[type],
      owner: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        phone: currentUser.phone,
        whatsapp: currentUser.phone,
        email: currentUser.email,
        isPhoneVerified: true,
        isIdVerified: currentUser.isVerified,
        rating: 5.0,
        reviewCount: 1,
        responseRate: '100%',
        responseTime: '< 5 mins',
        joinedDate: 'Host since 2026',
        tier: currentUser.tier,
        activeListingsCount: 2
      },
      status: 'available',
      isFeatured: boostAsFeatured,
      featuredExpiryDate: boostAsFeatured ? '2026-09-30' : undefined,
      viewsCount: 1,
      inquiriesCount: 0,
      savedCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onAddProperty(newProperty, boostAsFeatured, totalDue);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <div>
            <h2 className="font-bold text-white text-lg">List Your Property</h2>
            <p className="text-xs text-slate-400">Step {step} of 5 — {
              step === 1 ? 'Category & Pricing' :
              step === 2 ? 'Location Details' :
              step === 3 ? 'Specs & Amenities' :
              step === 4 ? 'High-Quality Photos' :
              'Review & Publish'
            }</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-emerald-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 text-sm">
          
          {/* STEP 1: CATEGORY & PRICING */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Category Selector */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-200">What are you listing?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'home', label: 'Home / Villa', icon: <Home className="w-5 h-5" /> },
                    { id: 'room', label: 'Room / Studio', icon: <BedDouble className="w-5 h-5" /> },
                    { id: 'shop', label: 'Shop / Retail', icon: <Store className="w-5 h-5" /> },
                    { id: 'portion', label: 'Portion / Floor', icon: <Layers className="w-5 h-5" /> },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleTypeSelect(cat.id as PropertyType)}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                        type === cat.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-500/10'
                          : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                      }`}
                    >
                      <span className={type === cat.id ? 'text-emerald-400' : 'text-slate-400'}>{cat.icon}</span>
                      <span className="text-xs">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Listing Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Luxurious 3-BHK Independent Portion with Car Porch"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe room layout, ventilation, neighborhood safety, nearby facilities..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Monthly Rent & Security Deposit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Monthly Rent (Rs.)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rs.</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Security Deposit (Rs.)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rs.</span>
                    <input
                      type="number"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Rent is slightly negotiable</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={billsIncluded}
                    onChange={(e) => setBillsIncluded(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Utility bills included in rent</span>
                </label>
              </div>

            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="font-semibold text-slate-200 block mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  {CITIES.filter((c) => c !== 'All Cities').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Neighborhood / Sector / Area</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. South Congress, Barton Hills, Block 4"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House # 42-B, Street 14"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Nearby Landmark / Transit Hub</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. 2 mins from Metro Station & Greenbelt Park"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: SPECS & AMENITIES */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Numeric Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {type !== 'shop' && (
                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-medium">Bedrooms</label>
                    <input
                      type="number"
                      min="1"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Bathrooms</label>
                  <input
                    type="number"
                    min="1"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Area (sq ft)</label>
                  <input
                    type="number"
                    value={sizeSqFt}
                    onChange={(e) => setSizeSqFt(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Floor Level</label>
                  <input
                    type="number"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-bold"
                  />
                </div>
              </div>

              {/* Furnishing & Suitability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Furnishing Condition</label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value as FurnishingStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="fully-furnished">Fully Furnished</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Suitability</label>
                  <select
                    value={suitableFor}
                    onChange={(e) => setSuitableFor(e.target.value as SuitableFor)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="family">Family Only</option>
                    <option value="bachelors">Bachelors / Singles</option>
                    <option value="females">Females Only</option>
                    <option value="commercial">Commercial / Business</option>
                    <option value="any">Open to Anyone</option>
                  </select>
                </div>
              </div>

              {/* Amenities checkboxes */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-200 block">Select Amenities Available</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                  {AMENITY_OPTIONS.map((a) => {
                    const isSelected = selectedAmenities.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAmenity(a)}
                        className={`p-2 rounded-lg border text-xs text-left flex items-center gap-2 transition-colors ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-medium'
                            : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-400'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="truncate">{a}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: HIGH-QUALITY PHOTOS */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-semibold text-white block">Property Photo Gallery</label>
                  <p className="text-xs text-slate-400">Photos auto-compress client-side to save memory & storage.</p>
                </div>
                <button
                  type="button"
                  onClick={handleApplyPresetPack}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
                >
                  Load High-Res Preset Pack
                </button>
              </div>

              {/* File Upload Zone */}
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-4 text-center bg-slate-850/50 transition-colors">
                <input
                  type="file"
                  id="photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white text-xs">Click to upload photos</span>
                    <p className="text-[11px] text-slate-400">JPG, PNG, WebP supported</p>
                  </div>
                </label>
              </div>

              {/* Custom URL add */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Or paste direct image URL (https://...)"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomUrl}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
                >
                  Add URL
                </button>
              </div>

              {/* Image Previews Grid */}
              {images.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group border border-slate-800 bg-slate-950">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-slate-900/80 text-emerald-400 text-[9px] font-bold">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No photos added yet. Upload or load sample high-res photos.
                </div>
              )}
            </div>
          )}

          {/* STEP 5: REVIEW, QUOTA & MONETIZATION */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Landlord Verified Contact Card */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Landlord Contact (Shown to Tenants)</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Profile
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>Name: <strong className="text-white">{currentUser.name}</strong></div>
                  <div>Phone / WhatsApp: <strong className="text-white font-mono">{currentUser.phone}</strong></div>
                  <div>Email: <strong className="text-white">{currentUser.email}</strong></div>
                </div>
              </div>

              {/* Free Quota vs Pay-Per-Listing Check */}
              <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Listing Allowance & Fee</span>
                  {currentUser.tier !== 'free' ? (
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                      {currentUser.tier.toUpperCase()} Member (Unlimited)
                    </span>
                  ) : isFreeListingAvailable ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      {currentUser.freeListingsTotal - currentUser.freeListingsUsed} Free Listing Remaining
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                      Free Quota Exceeded (2/2 Used)
                    </span>
                  )}
                </div>

                {!isFreeListingAvailable && (
                  <div className="text-xs text-amber-300/90 flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      You have used all 2 free listings. Standard fee of <strong>Rs. 800</strong> applies for this listing, or upgrade to Pro Host.
                    </div>
                  </div>
                )}
              </div>

              {/* Featured Listing Spotlight Upsell */}
              <div className={`p-4 rounded-xl border transition-all ${
                boostAsFeatured
                  ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'bg-slate-850/50 border-slate-800'
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={boostAsFeatured}
                    onChange={(e) => setBoostAsFeatured(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs flex items-center gap-1.5">
                         <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
                        Boost as Featured Listing Spotlight
                      </span>
                      <span className="font-bold text-amber-300 text-xs">+Rs. 500</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Get 5x more inquiries, top placement in search results, and a golden Featured badge for 7 days.
                    </p>
                  </div>
                </label>
              </div>

              {/* Total Summary */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Total Platform Fee:</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {totalDue === 0 ? 'FREE (Rs. 0)' : `Rs. ${totalDue.toLocaleString()}`}
                </span>
              </div>

            </div>
          )}

        </div>

        {/* Footer Navigation Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              Continue to Step {step + 1}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Publish Listing Now</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
