import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, MembershipTier } from '../types';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUpgradeTier: (newTier: MembershipTier) => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradeTier
}) => {
  const [selectedPlan, setSelectedPlan] = useState<MembershipTier>(
    currentUser.tier === 'free' ? 'pro_host' : currentUser.tier
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessReceipt, setShowSuccessReceipt] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUpgradeTier(selectedPlan);
      setShowSuccessReceipt(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-white text-lg">Landlord Membership & Listing Plans</h2>
              <p className="text-xs text-slate-400">Scale your rental business with verified leads and top search rankings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 text-sm">
          
          {showSuccessReceipt ? (
            <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Membership Activated!</h3>
              <p className="text-slate-300 text-xs max-w-md mx-auto">
                Your account is now upgraded to <strong className="text-emerald-400 uppercase">{selectedPlan.replace('_', ' ')}</strong>. You now have unlimited listings and priority badge verification.
              </p>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 max-w-sm mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Transaction ID:</span>
                  <span className="font-mono text-white">RP-TX-{Math.floor(Math.random() * 89999 + 10000)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Plan:</span>
                  <span className="text-white capitalize">{selectedPlan.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold">Active & Verified</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSuccessReceipt(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Billing Cycle Switcher */}
              <div className="flex justify-center">
                <div className="p-1 rounded-xl bg-slate-800 border border-slate-700 inline-flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      billingCycle === 'monthly' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                      billingCycle === 'yearly' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Yearly Billing</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-extrabold">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Starter Free */}
                <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                  selectedPlan === 'free'
                    ? 'bg-slate-850 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-850/50 border-slate-800'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Free Starter</span>
                      {currentUser.tier === 'free' && (
                        <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-2xl font-black text-white">Rs. 0</span>
                      <span className="text-xs text-slate-400"> / forever</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>2 Free</strong> Active Listings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Direct Tenant Chat</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Standard Search Visibility</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    disabled={currentUser.tier === 'free'}
                    onClick={() => setSelectedPlan('free')}
                    className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold disabled:opacity-50"
                  >
                    {currentUser.tier === 'free' ? 'Your Current Plan' : 'Downgrade to Free'}
                  </button>
                </div>

                {/* 2. Pro Host (Popular) */}
                <div className={`p-4 rounded-2xl border flex flex-col justify-between relative transition-all ${
                  selectedPlan === 'pro_host'
                    ? 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-900/20'
                    : 'bg-slate-850 border-slate-750 hover:border-slate-600'
                }`}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[10px] font-extrabold rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300 text-sm flex items-center gap-1">
                        <Crown className="w-4 h-4 text-amber-400" />
                        Pro Host
                      </span>
                      {currentUser.tier === 'pro_host' && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-2xl font-black text-white">
                        {billingCycle === 'monthly' ? 'Rs. 2,999' : 'Rs. 2,399'}
                      </span>
                      <span className="text-xs text-slate-400"> / month</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>Up to 10</strong> Active Listings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>1 Free Spotlight</strong> / Month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Verified Host Golden Badge</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Direct WhatsApp & Call Click</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setSelectedPlan('pro_host')}
                    className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                      selectedPlan === 'pro_host'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-200'
                    }`}
                  >
                    {selectedPlan === 'pro_host' ? 'Selected' : 'Choose Pro Host'}
                  </button>
                </div>

                {/* 3. Agency VIP */}
                <div className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                  selectedPlan === 'agency'
                    ? 'bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/50'
                    : 'bg-slate-850/50 border-slate-800 hover:border-slate-700'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300 text-sm flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        Agency / Broker
                      </span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-white">
                        {billingCycle === 'monthly' ? 'Rs. 6,999' : 'Rs. 5,499'}
                      </span>
                      <span className="text-xs text-slate-400"> / month</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span><strong>Unlimited</strong> Active Listings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span><strong>5 Free Spotlights</strong> / Month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>Top Search Rank Aggregation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>Dedicated Account Manager</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setSelectedPlan('agency')}
                    className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                      selectedPlan === 'agency'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-200'
                    }`}
                  >
                    {selectedPlan === 'agency' ? 'Selected' : 'Choose Agency'}
                  </button>
                </div>

              </div>

              {/* Pay-as-you-go Addon Section */}
              <div className="p-4 rounded-xl bg-slate-850/60 border border-slate-800">
                <h4 className="font-bold text-white text-xs mb-2">Flexible Pay-As-You-Go Add-ons</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">Single Extra Listing</p>
                      <p className="text-[11px] text-slate-400">Pay once per post beyond free quota</p>
                    </div>
                    <span className="font-bold text-emerald-400 text-sm">Rs. 800</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-amber-300">7-Day Featured Spotlight</p>
                      <p className="text-[11px] text-slate-400">Top placement & gold badge</p>
                    </div>
                    <span className="font-bold text-amber-400 text-sm">Rs. 500</span>
                  </div>
                </div>
              </div>

              {/* Secure Checkout Simulated Trigger */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Secure 256-Bit Encrypted Platform Checkout</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || selectedPlan === currentUser.tier}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Activate {selectedPlan.replace('_', ' ').toUpperCase()} Plan</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
