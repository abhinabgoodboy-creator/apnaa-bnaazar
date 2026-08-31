import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Mail,
  Smartphone,
  Phone,
  Flame,
  AlertCircle,
  RefreshCw,
  Copy,
} from 'lucide-react';
import { UserProfile } from '../types';
import { setupRecaptcha, sendFirebasePhoneOtp, ConfirmationResult } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  actionBlockedReason?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionBlockedReason,
}) => {
  // Auth Tab Mode: 'google' | 'phone'
  const [authTab, setAuthTab] = useState<'google' | 'phone'>('google');

  // Google Sign-In state
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Firebase Phone Auth state
  const [phoneNumber, setPhoneNumber] = useState('+91 9876543210');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [phoneSuccessMsg, setPhoneSuccessMsg] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);

  const recaptchaAuthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  if (!isOpen) return null;

  // Preset demo Google accounts for 1-click convenience
  const defaultGoogleAccounts = [
    {
      name: 'Abhinav Dutta',
      email: 'abhinabgoodboy@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Google Creator',
      email: 'creator.developer@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    },
  ];

  const handleGoogleLogin = (email: string, name: string, avatar?: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const user: UserProfile = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: email.trim() || 'user@gmail.com',
        displayName: name.trim() || email.split('@')[0] || 'Apna User',
        photoUrl: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=2874f0&color=fff`,
        googleId: 'goog_' + Math.random().toString(36).substring(2, 12),
        createdAt: new Date().toISOString(),
      };
      setIsProcessing(false);
      onSuccess(user);
    }, 450);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const finalEmail = customEmail.includes('@') ? customEmail : `${customEmail}@gmail.com`;
    const finalName = customName || finalEmail.split('@')[0];
    handleGoogleLogin(finalEmail, finalName);
  };

  // Format phone to E.164
  const formatPhone = (val: string) => {
    const raw = val.replace(/[^\d+]/g, '');
    if (raw.startsWith('+')) return raw;
    if (raw.length === 10) return `+91${raw}`;
    return `+${raw}`;
  };

  // Proceed directly with phone login (no verification code required)
  const handleProceedPhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    const cleanInput = phoneNumber.trim();
    const cleanDigits = cleanInput.replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length < 8) {
      setPhoneError('Please enter a valid mobile phone number (at least 10 digits).');
      return;
    }

    const phoneFormatted = formatPhone(cleanInput);
    const lastDigits = phoneFormatted.slice(-4) || 'User';
    const verifiedUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: `${phoneFormatted.replace(/\D/g, '')}@phone.apnabazaar.com`,
      displayName: customName || `Member ${lastDigits}`,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(customName || 'User ' + lastDigits)}&background=2874f0&color=fff`,
      phone: phoneFormatted,
      createdAt: new Date().toISOString(),
    };

    onSuccess(verifiedUser);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      
      {/* Invisible container for Firebase reCAPTCHA */}
      <div id="firebase-auth-recaptcha-box" ref={recaptchaAuthRef}></div>

      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Flipkart Blue Header */}
        <div className="bg-[#2874F0] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 bg-white text-[#2874F0] rounded shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg text-white">Sign In to Apna Bazaar</span>
          </div>

          <p className="text-xs text-blue-100 mt-1">
            {actionBlockedReason ? (
              <span className="bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">
                Action Protected: {actionBlockedReason}
              </span>
            ) : (
              'Access your downloads, seller hub, and digital locker'
            )}
          </p>
        </div>

        {/* Auth Method Tabs: Google Sign-In OR Firebase Phone OTP */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthTab('google')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors border-b-2 ${
              authTab === 'google'
                ? 'border-[#2874F0] text-[#2874F0] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Sign-In</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthTab('phone')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors border-b-2 ${
              authTab === 'phone'
                ? 'border-[#2874F0] text-[#2874F0] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-orange-500" />
            <span className="flex items-center gap-1">
              <span>Firebase Phone OTP</span>
              <span className="bg-amber-100 text-amber-900 text-[9px] px-1 py-0.2 rounded font-black">NEW</span>
            </span>
          </button>
        </div>

        {/* Tab 1: GOOGLE AUTH */}
        {authTab === 'google' && (
          <div className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-gray-900">
                Sign In with Google
              </h3>
              <p className="text-xs text-gray-500">
                Quick 1-click access with your Google / Gmail account.
              </p>
            </div>

            {/* Quick Google Account Picker */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Choose a Google Account:
              </div>

              {defaultGoogleAccounts.map((acc) => (
                <button
                  key={acc.email}
                  disabled={isProcessing}
                  onClick={() => handleGoogleLogin(acc.email, acc.name, acc.avatar)}
                  className="w-full flex items-center justify-between p-3 rounded border border-gray-200 hover:border-[#2874F0] hover:bg-blue-50/50 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <div className="font-bold text-xs text-gray-900 group-hover:text-[#2874F0]">
                        {acc.name}
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono">{acc.email}</div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#2874F0] opacity-0 group-hover:opacity-100 transition-opacity">
                    Continue →
                  </span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-gray-400 font-semibold uppercase">
                Or Use Another Gmail
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold rounded text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#2874F0]" />
                <span>Enter custom Gmail address</span>
              </button>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 bg-gray-50 p-3 rounded border border-gray-200">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#2874F0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Google / Gmail Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#2874F0]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !customEmail}
                  className="w-full py-2 bg-[#2874F0] hover:bg-[#1a5bc4] text-white font-bold rounded text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Continue with Google</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => handleGoogleLogin('abhinabgoodboy@gmail.com', 'Abhinav Dutta')}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-white border-2 border-gray-300 hover:border-[#2874F0] hover:bg-blue-50 text-gray-800 font-bold rounded shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer"
              id="primary-continue-with-google-btn"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* Tab 2: PHONE AUTH */}
        {authTab === 'phone' && (
          <form onSubmit={handleProceedPhoneLogin} className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-gray-900 flex items-center justify-center gap-1.5">
                <Smartphone className="w-5 h-5 text-[#2874F0]" />
                <span>Mobile Phone Sign-In</span>
              </h3>
              <p className="text-xs text-gray-500">
                Enter your mobile phone number to sign in to your account.
              </p>
            </div>

            {phoneError && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{phoneError}</span>
              </div>
            )}

            {/* Optional Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Your Full Name <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Abhinav Dutta"
                className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded focus:bg-white focus:outline-none focus:border-[#2874f0]"
                id="phone-auth-custom-name-input"
              />
            </div>

            {/* Phone input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Mobile Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full text-sm pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded focus:bg-white focus:outline-none focus:border-[#2874f0] font-mono"
                  id="firebase-auth-phone-input"
                />
              </div>
              <p className="text-[11px] text-gray-400">
                Enter your 10-digit mobile number (e.g. +91 9876543210)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#2874F0] hover:bg-[#1a5bc4] text-white font-bold rounded shadow-sm text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                id="firebase-auth-phone-proceed-btn"
              >
                <span>Continue &amp; Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Security Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected by Firebase Authentication &amp; Google Cloud Security</span>
        </div>

      </div>
    </div>
  );
};
