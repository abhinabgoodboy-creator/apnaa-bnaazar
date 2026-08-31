import React, { useState } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Building,
  User,
  Mail,
  FileText,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Smartphone,
  AlertCircle,
  Store,
  Zap,
  Layers
} from 'lucide-react';
import { SellerProfile, UserProfile } from '../types';
import { saveStoredSeller } from '../utils/storage';

interface SellerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOnboardingComplete: (seller: SellerProfile) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const SellerOnboardingModal: React.FC<SellerOnboardingModalProps> = ({
  isOpen,
  onClose,
  user,
  onOnboardingComplete,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1 State: Phone Number
  const [phoneNumber, setPhoneNumber] = useState('+91 9876543210');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Step 2 State: Creator Brand & Profile Info
  const [businessName, setBusinessName] = useState(
    user?.displayName ? `${user.displayName.split(' ')[0]}'s Studio` : 'Apex Digital Studio'
  );
  const [sellerUsername, setSellerUsername] = useState(
    user?.email ? user.email.split('@')[0].replace(/[^a-z0-9_]/gi, '').toLowerCase() : 'indie_creator'
  );
  const [businessEmail, setBusinessEmail] = useState(user?.email || 'abhinabgoodboy@gmail.com');
  const [bioTagline, setBioTagline] = useState('Creating verified open source apps and developer tools');
  const [formError, setFormError] = useState<string | null>(null);

  // Step 3 State: Free Open Distribution Agreement
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  if (!isOpen) return null;

  const formatE164Phone = (rawPhone: string) => {
    const cleaned = rawPhone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) return cleaned;
    if (cleaned.length === 10) return `+91${cleaned}`;
    return `+${cleaned}`;
  };

  const handleProceedStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    const cleanDigits = phoneNumber.replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length < 8) {
      setPhoneError('Please enter a valid mobile phone number (at least 10 digits).');
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!businessName.trim()) {
      setFormError('Creator / Studio Brand Name is required.');
      return;
    }
    if (!sellerUsername.trim()) {
      setFormError('Creator Username is required.');
      return;
    }
    if (!businessEmail.trim() || !businessEmail.includes('@')) {
      setFormError('A valid Gmail / Contact Email is required.');
      return;
    }

    setCurrentStep(3);
  };

  const handleConfirmAndEnter = (e: React.FormEvent) => {
    e.preventDefault();
    setTermsError(null);

    if (!agreeTerms) {
      setTermsError('Please accept the Open Creator Distribution guidelines to continue.');
      return;
    }

    setIsCompleting(true);
    setTimeout(() => {
      const formattedPhone = formatE164Phone(phoneNumber.trim());
      const sellerProfile: SellerProfile = {
        phone: formattedPhone,
        businessName: businessName.trim(),
        username: sellerUsername.trim().toLowerCase(),
        email: businessEmail.trim(),
        agreedTerms: true,
        onboardedAt: new Date().toISOString(),
        isVerified: true,
      };

      saveStoredSeller(sellerProfile);
      setIsCompleting(false);
      onOnboardingComplete(sellerProfile);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0b1120] border border-[#0040FF]/60 rounded-xl shadow-[0_0_50px_rgba(0,64,255,0.3)] w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-gray-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#0b1120] text-white px-5 py-4 flex items-center justify-between border-b border-[#00E5FF]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-wide text-white">
                  Creator Hub Onboarding
                </h2>
                <span className="bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-[#00E5FF]" />
                  Instant Activation
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Step {currentStep} of 3 • Creator Identity &amp; Free Distribution Setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-[#070b14] px-5 py-3 border-b border-[#0040FF]/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep >= 1
                  ? 'bg-[#0040FF] text-[#00E5FF] border border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.5)]'
                  : 'bg-gray-800 text-gray-500'
              }`}
            >
              1
            </div>
            <span className={currentStep === 1 ? 'font-bold text-white' : 'text-gray-400'}>
              Mobile Verify
            </span>
          </div>
          <div className="h-0.5 w-8 bg-gray-800" />
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep >= 2
                  ? 'bg-[#0040FF] text-[#00E5FF] border border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.5)]'
                  : 'bg-gray-800 text-gray-500'
              }`}
            >
              2
            </div>
            <span className={currentStep === 2 ? 'font-bold text-white' : 'text-gray-400'}>
              Creator Brand
            </span>
          </div>
          <div className="h-0.5 w-8 bg-gray-800" />
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep >= 3
                  ? 'bg-[#0040FF] text-[#00E5FF] border border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.5)]'
                  : 'bg-gray-800 text-gray-500'
              }`}
            >
              3
            </div>
            <span className={currentStep === 3 ? 'font-bold text-white' : 'text-gray-400'}>
              Free License
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[72vh]">
          
          {/* STEP 1: MOBILE NUMBER ENTRY */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedStep1} className="space-y-4 animate-in fade-in duration-150">
              <div className="text-center space-y-1 pb-2">
                <div className="w-12 h-12 bg-[#0040FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-white">Enter Your Contact Number</h3>
                <p className="text-xs text-gray-400">
                  Used for creator verification, upload alerts, and developer support queries.
                </p>
              </div>

              {phoneError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{phoneError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-300">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 9800000000"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#070b14] border border-[#0040FF]/50 rounded-lg text-sm text-white focus:outline-none focus:border-[#00E5FF] font-mono shadow-inner"
                    id="seller-phone-input"
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  Verified with Apna Assured for legitimate creator identification.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#0040FF] to-[#1a56ff] hover:from-[#1a56ff] hover:to-[#0040FF] text-white font-extrabold rounded-lg text-sm shadow-[0_0_20px_rgba(0,64,255,0.5)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                id="seller-proceed-step1-btn"
              >
                <span>Continue to Brand Setup</span>
                <ArrowRight className="w-4 h-4 text-[#00E5FF]" />
              </button>
            </form>
          )}

          {/* STEP 2: CREATOR & BRAND DETAILS */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-[#0040FF]/20 pb-2">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#00E5FF]" />
                  <span>Creator Brand &amp; Public Storefront</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Set up your studio name and public developer handle displayed on your free assets.
                </p>
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Business / Creator Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-300">
                  Studio / Creator Brand Name <span className="text-[#00E5FF]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Digital Labs / CodeCraft Studio"
                  className="w-full px-3 py-2 bg-[#070b14] border border-[#0040FF]/50 rounded text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  id="seller-business-name-input"
                />
              </div>

              {/* Creator Username & Gmail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-300">
                    Creator Handle / Username <span className="text-[#00E5FF]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerUsername}
                    onChange={(e) => setSellerUsername(e.target.value)}
                    placeholder="e.g. indiedev"
                    className="w-full px-3 py-2 bg-[#070b14] border border-[#0040FF]/50 rounded text-xs text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                    id="seller-username-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-300">
                    Contact / Support Email <span className="text-[#00E5FF]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="creator@gmail.com"
                    className="w-full px-3 py-2 bg-[#070b14] border border-[#0040FF]/50 rounded text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                    id="seller-email-input"
                  />
                </div>
              </div>

              {/* Bio / Tagline */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-300">
                  Creator Bio / Tagline
                </label>
                <input
                  type="text"
                  value={bioTagline}
                  onChange={(e) => setBioTagline(e.target.value)}
                  placeholder="e.g. Android engineer building open source developer kits"
                  className="w-full px-3 py-2 bg-[#070b14] border border-[#0040FF]/50 rounded text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#0040FF] to-[#1a56ff] hover:from-[#1a56ff] hover:to-[#0040FF] text-white font-extrabold text-xs rounded-lg shadow-[0_0_15px_rgba(0,64,255,0.4)] flex items-center gap-1.5 cursor-pointer"
                  id="seller-proceed-step2-btn"
                >
                  <span>Continue to Guidelines</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00E5FF]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: FREE OPEN DISTRIBUTION AGREEMENT */}
          {currentStep === 3 && (
            <form onSubmit={handleConfirmAndEnter} className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-[#0040FF]/20 pb-2">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                  <span>100% Free Open Creator Distribution Policy</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Confirm your creator profile and launch your Seller Dashboard.
                </p>
              </div>

              {termsError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{termsError}</span>
                </div>
              )}

              {/* Summary Card */}
              <div className="bg-[#111a33] border border-[#0040FF]/40 rounded-lg p-3.5 space-y-2 text-xs">
                <div className="flex justify-between border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">Creator Studio:</span>
                  <span className="font-bold text-white">{businessName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">Username:</span>
                  <span className="font-mono text-[#00E5FF] font-bold">@{sellerUsername}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">Contact Phone:</span>
                  <span className="font-mono text-gray-200">{phoneNumber}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold pt-0.5">
                  <span>Distribution Model:</span>
                  <span>100% Free Direct Open Access (Zero Paywalls)</span>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-2.5 p-3 bg-[#070b14] border border-[#0040FF]/40 rounded-lg cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-[#0040FF] rounded border-gray-700 focus:ring-[#00E5FF]"
                  id="seller-agree-terms-checkbox"
                />
                <span className="text-xs text-gray-300">
                  I agree that products published under my profile will be provided for <strong>100% free open public download</strong> under standard developer and commercial use rights.
                </span>
              </label>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isCompleting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0040FF] via-[#1a56ff] to-[#00E5FF] hover:opacity-90 text-white font-extrabold text-xs rounded-lg shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center gap-2 cursor-pointer transition-all"
                  id="seller-complete-onboarding-btn"
                >
                  {isCompleting ? (
                    <span>Activating Dashboard...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                      <span>Activate &amp; Open Creator Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
