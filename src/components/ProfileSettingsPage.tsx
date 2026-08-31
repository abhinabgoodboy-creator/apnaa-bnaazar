import React, { useState } from 'react';
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  FileText,
  Lock,
  Save,
  CheckCircle2,
  ArrowLeft,
  Store,
  Download,
  Building,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserProfile, ActivePageView } from '../types';

interface ProfileSettingsPageProps {
  user: UserProfile;
  onUpdateDisplayName: (newName: string) => void;
  onLogout: () => void;
  onNavigate: (view: ActivePageView) => void;
  onOpenDownloads: () => void;
  onOpenSellerHub: () => void;
  downloadsCount: number;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  user,
  onUpdateDisplayName,
  onLogout,
  onNavigate,
  onOpenDownloads,
  onOpenSellerHub,
  downloadsCount,
}) => {
  const [displayNameInput, setDisplayNameInput] = useState(user.displayName);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayNameInput.trim()) return;
    onUpdateDisplayName(displayNameInput.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'AB';
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between bg-white p-3.5 sm:p-4 rounded-sm border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button
            onClick={() => onNavigate('home')}
            className="text-[#2874F0] font-bold hover:underline"
          >
            Apna Bazaar Store
          </button>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Profile &amp; Settings</span>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2874F0] hover:bg-[#1a5bc4] text-white text-xs font-bold rounded-sm shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </button>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: User Identity Card */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="relative">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#2874F0] shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#2874F0] text-white flex items-center justify-center font-bold text-2xl border-2 border-white shadow-sm">
                  {getInitials(user.displayName)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              </div>
            </div>

            <div>
              <h2 className="font-extrabold text-base text-gray-900">{user.displayName}</h2>
              <div className="text-xs text-gray-500 font-mono flex items-center justify-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-gray-400" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Google Verified Account</span>
            </div>

            <div className="w-full pt-3 border-t border-gray-100 text-left text-xs space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">Account ID:</span>
                <span className="font-mono text-gray-800 font-semibold">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Auth Method:</span>
                <span className="font-semibold text-gray-800">Google OAuth</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Downloads:</span>
                <span className="font-bold text-[#2874F0]">{downloadsCount} digital assets</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-sm border border-gray-200 p-4 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Quick Hubs
            </h3>
            <button
              onClick={onOpenDownloads}
              className="w-full flex items-center justify-between p-2.5 bg-blue-50 hover:bg-blue-100 text-[#2874F0] rounded text-xs font-bold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>My Download Locker</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenSellerHub}
              className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded text-xs font-bold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#FB641B]" />
                <span>Creator / Seller Hub</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col: Profile Editing & Legal Navigation Links */}
        <div className="md:col-span-2 space-y-5">
          
          {/* Card 1: Edit Profile Name */}
          <div className="bg-white rounded-sm border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="w-5 h-5 text-[#2874F0]" />
              <div>
                <h3 className="font-bold text-base text-gray-900">Edit Profile Name</h3>
                <p className="text-xs text-gray-500">
                  Update your public display name shown across Apna Bazaar comments, reviews, and purchases.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Custom Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded focus:bg-white focus:outline-none focus:border-[#2874F0] focus:ring-1 focus:ring-[#2874F0] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Linked Google Email (Read-Only)
                </label>
                <div className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded text-gray-600 font-mono flex items-center justify-between">
                  <span>{user.email}</span>
                  <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    Verified Google
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2874F0] hover:bg-[#1a5bc4] text-white font-bold rounded-sm text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                  id="save-profile-changes-btn"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>

                {isSaved && (
                  <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Display name updated successfully!</span>
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Card 2: Seller Hub & Product Uploads (Access Point) */}
          <div className="bg-gradient-to-r from-amber-500/10 via-blue-50 to-white rounded-sm border-2 border-amber-300 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#ffe500] text-blue-950 rounded font-black">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">Seller Hub &amp; Product Deployment</h3>
                  <p className="text-xs text-gray-600">
                    Upload digital products, manage storefront, and view 1-hour automated review status.
                  </p>
                </div>
              </div>
              <span className="bg-[#ffe500] text-blue-950 font-black text-[10px] uppercase px-2 py-0.5 rounded">
                Seller Access
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Apna Bazaar provides an automated 3-step phone OTP onboarding process for creators. Upload your apps, source codes, and Figma kits with live review countdowns.
            </p>

            <button
              onClick={onOpenSellerHub}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#2874F0] hover:bg-[#1a5bc4] text-white font-bold rounded-sm text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
              id="profile-open-seller-hub-btn"
            >
              <Store className="w-4 h-4 text-[#ffe500]" />
              <span>Enter Seller Hub &amp; Upload Products →</span>
            </button>
          </div>

          {/* Card 3: Account Navigation Links (Privacy, Terms, Logout) */}
          <div className="bg-white rounded-sm border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText className="w-5 h-5 text-[#2874F0]" />
              <div>
                <h3 className="font-bold text-base text-gray-900">Account &amp; Legal Navigation</h3>
                <p className="text-xs text-gray-500">
                  Access store policies, developer terms, and session controls.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* 1) Privacy Policy Link */}
              <button
                onClick={() => onNavigate('privacy')}
                className="w-full flex items-center justify-between p-3.5 rounded border border-gray-200 hover:border-[#2874F0] hover:bg-blue-50/50 transition-all text-left group cursor-pointer"
                id="profile-privacy-policy-link"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-[#2874F0] rounded">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#2874F0]">
                      1) Privacy Policy
                    </h4>
                    <p className="text-xs text-gray-500">
                      Learn how Scorp and Apna Bazaar handle your order data and privacy.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#2874F0] transform group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 2) Terms & Conditions Link */}
              <button
                onClick={() => onNavigate('terms')}
                className="w-full flex items-center justify-between p-3.5 rounded border border-gray-200 hover:border-[#2874F0] hover:bg-blue-50/50 transition-all text-left group cursor-pointer"
                id="profile-terms-conditions-link"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-700 rounded">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-purple-700">
                      2) Terms &amp; Conditions
                    </h4>
                    <p className="text-xs text-gray-500">
                      Disclaimers, limitation of liability, payment policies, and developer terms (Abhinav Dutta).
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-700 transform group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 3) Log Out Button */}
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-between p-3.5 rounded border border-red-200 hover:border-red-500 hover:bg-red-50/50 transition-all text-left group cursor-pointer"
                id="profile-logout-btn"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-red-600 group-hover:text-red-700">
                      3) Log Out
                    </h4>
                    <p className="text-xs text-gray-500">
                      Clear user session and return to the Apna Bazaar homepage.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-red-600">Sign Out →</span>
              </button>
            </div>
          </div>

          {/* Legal Attribution Card */}
          <div className="bg-gray-100 p-4 rounded-sm border border-gray-200 text-xs text-gray-600 space-y-1">
            <div className="font-bold text-gray-800">Business &amp; Platform Entity:</div>
            <p>
              Operating under <strong>Scorp</strong> • Platform: <strong>Apna Bazaar for Digital Products</strong> • Developer &amp; Builder: <strong>Abhinav Dutta</strong>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
