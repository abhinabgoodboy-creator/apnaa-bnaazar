import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Store,
  User,
  LogOut,
  UploadCloud,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Package,
  Settings,
  ShieldCheck,
  Bell,
  Palette,
  Gift
} from 'lucide-react';
import { UserProfile, SellerProfile, ProductCategory } from '../types';
import { CATEGORIES } from '../data/categories';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  cartCount: number;
  wishlistCount: number;
  unreadNotificationsCount?: number;
  appStyle?: 'new' | 'old';
  onToggleAppStyle?: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenNotifications: () => void;
  onOpenOrders: () => void;
  onOpenSellerHub: () => void;
  onOpenSellerOnboarding: () => void;
  onOpenUpload: () => void;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  user: UserProfile | null;
  seller: SellerProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  unreadNotificationsCount = 0,
  appStyle = 'new',
  onToggleAppStyle,
  onOpenCart,
  onOpenWishlist,
  onOpenNotifications,
  onOpenOrders,
  onOpenSellerHub,
  onOpenSellerOnboarding,
  onOpenUpload,
  onOpenAuth,
  onOpenSettings,
  user,
  seller,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const isOldStyle = appStyle === 'old';

  const handleSellerClick = () => {
    if (seller) {
      onOpenSellerHub();
    } else {
      onOpenSellerOnboarding();
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isOldStyle
          ? 'bg-slate-900/95 border-amber-500/40 text-slate-100 shadow-[0_4px_25px_rgba(245,158,11,0.15)]'
          : 'bg-[#070b14]/95 border-[#0040FF]/30 text-gray-200 shadow-[0_4px_30px_rgba(0,0,0,0.7)]'
      }`}
    >
      {/* Top Announcement Strip for 100% Free Access & Style Switcher */}
      <div
        className={`px-3 py-1 text-[11px] font-bold flex items-center justify-between border-b ${
          isOldStyle
            ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white border-amber-400/30'
            : 'bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#00E5FF]/40 text-white border-[#00E5FF]/20'
        }`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-black/30 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-mono uppercase">
              <Gift className="w-3 h-3 text-emerald-300" /> 100% Free Open Access
            </span>
            <span className="hidden sm:inline text-xs font-semibold">
              {isOldStyle
                ? 'अपना बाज़ार • भारत का विश्वसनीय फ्री डिजिटल बाज़ार (APKs, Source Code & UI Kits)'
                : 'Free Instant Downloads across all Software, Codebases, APKs & UI Kits'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onToggleAppStyle && (
              <button
                onClick={onToggleAppStyle}
                className="flex items-center gap-1.5 px-2.5 py-0.5 bg-black/40 hover:bg-black/60 text-amber-200 hover:text-white rounded-full text-[10px] font-bold border border-white/20 transition-all cursor-pointer"
                title="Toggle between Old & New Apna Bazaar styles"
                id="style-toggle-quick-btn"
              >
                <Palette className="w-3 h-3 text-amber-300" />
                <span>{isOldStyle ? 'Switch to ⚡ New Cyber Style' : 'Switch to 🏛️ Old Classic Mandi'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Primary Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* LOGO */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => onSelectCategory('All')}
            className="flex items-center gap-2 cursor-pointer group select-none"
            id="brand-logo"
          >
            {isOldStyle ? (
              // Old Classic Indian Mandi Logo
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-sm border-2 border-amber-300 shadow-md">
                  अ
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-amber-200 group-hover:text-amber-100 transition-colors font-sans">
                    अपना बाज़ार
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold tracking-wider uppercase -mt-1">
                    Free Digital Mandi
                  </span>
                </div>
              </div>
            ) : (
              // New Cyber Neon Logo
              <div className="flex items-center gap-2">
                <div className="h-7 w-1.5 bg-gradient-to-b from-[#00E5FF] via-[#0040FF] to-[#00E5FF] rounded-full shadow-[0_0_12px_#00E5FF] group-hover:scale-y-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-[#00E5FF] transition-colors drop-shadow-[0_0_10px_rgba(0,229,255,0.5)] font-sans">
                    Apna Bazaar
                  </span>
                  <span className="text-[9px] text-[#00E5FF] font-mono tracking-widest uppercase -mt-1 font-bold">
                    Free Digital Marketplace
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 100% free digital products, apps, templates..."
              className={`w-full pl-10 pr-4 py-2 rounded-full text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none transition-all ${
                isOldStyle
                  ? 'bg-slate-950 border border-amber-500/40 focus:border-amber-400 focus:shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'bg-[#0d1424] border border-[#0040FF]/40 focus:border-[#00E5FF] focus:shadow-[0_0_20px_rgba(0,229,255,0.25)]'
              }`}
              id="marketplace-search-bar"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-xs text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* RIGHT NAVIGATION ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* HEADER BUTTON: "Become a Seller" or "Seller Hub" */}
          <button
            onClick={handleSellerClick}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-white font-extrabold text-xs sm:text-sm rounded-lg transition-all cursor-pointer select-none shadow-md ${
              isOldStyle
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-600 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-gradient-to-r from-[#0040FF] to-[#1a56ff] hover:from-[#1a56ff] hover:to-[#0040FF] border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,64,255,0.4)]'
            }`}
            id="become_seller_btn"
          >
            <Store className={`w-4 h-4 ${isOldStyle ? 'text-amber-200' : 'text-[#00E5FF]'}`} />
            <span className="hidden sm:inline">
              {seller ? 'Seller Dashboard' : 'Upload Free Asset'}
            </span>
            <span className="sm:hidden">{seller ? 'Hub' : 'Upload'}</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
              isOldStyle
                ? 'bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-red-400 border-amber-500/30'
                : 'bg-[#0d1424] hover:bg-[#111a33] text-gray-300 hover:text-red-400 border-[#0040FF]/30'
            }`}
            title="Wishlist"
            id="navbar-wishlist-btn"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
              isOldStyle
                ? 'bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border-amber-500/30'
                : 'bg-[#0d1424] hover:bg-[#111a33] text-gray-300 hover:text-[#00E5FF] border-[#0040FF]/30'
            }`}
            title="Free Cart Locker"
            id="navbar-cart-btn"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow ${
                  isOldStyle ? 'bg-amber-400 text-black' : 'bg-[#00E5FF] text-black shadow-[0_0_8px_#00E5FF]'
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
              isOldStyle
                ? 'bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border-amber-500/30'
                : 'bg-[#0d1424] hover:bg-[#111a33] text-gray-300 hover:text-[#00E5FF] border-[#0040FF]/30'
            }`}
            title="Notifications"
            id="notification_bell"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow ${
                  isOldStyle ? 'bg-amber-400 text-black' : 'bg-[#00E5FF] text-black shadow-[0_0_8px_#00E5FF]'
                }`}
              >
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isOldStyle
                ? 'bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border-amber-500/30'
                : 'bg-[#0d1424] hover:bg-[#111a33] text-gray-300 hover:text-[#00E5FF] border-[#0040FF]/30'
            }`}
            title="Settings & Themes"
            id="settings_btn"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile / Login Button */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-1.5 p-1.5 border rounded-lg text-xs font-bold text-white transition-colors cursor-pointer ${
                  isOldStyle
                    ? 'bg-slate-950 hover:bg-slate-800 border-amber-500/40'
                    : 'bg-[#0d1424] hover:bg-[#111a33] border-[#0040FF]/40'
                }`}
                id="user-profile-menu-btn"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-xs ${
                    isOldStyle
                      ? 'bg-amber-600 text-white border border-amber-300'
                      : 'bg-[#0040FF] text-[#00E5FF] border border-[#00E5FF]/40'
                  }`}
                >
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className={`px-3 py-1.5 border font-bold text-xs rounded-lg transition-colors cursor-pointer ${
                  isOldStyle
                    ? 'bg-slate-950 hover:bg-slate-800 border-amber-500/40 text-amber-200 hover:text-white'
                    : 'bg-[#0d1424] hover:bg-[#111a33] border-[#0040FF]/40 text-gray-200 hover:text-white'
                }`}
                id="navbar-login-btn"
              >
                Sign In
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && user && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border p-2 space-y-1 z-50 animate-in fade-in duration-100 ${
                  isOldStyle
                    ? 'bg-slate-900 border-amber-500/50 text-slate-100'
                    : 'bg-[#0b1120] border-[#0040FF]/50 text-gray-200'
                }`}
              >
                <div className="px-3 py-2 border-b border-gray-800">
                  <div className="font-bold text-xs text-white truncate">
                    {user.displayName || 'User'}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono truncate">
                    {user.email || user.phoneNumber || 'Authenticated User'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onOpenOrders();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span>My Free Downloads &amp; Keys</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>Theme &amp; Style Settings</span>
                </button>

                {seller ? (
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenSellerHub();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors cursor-pointer"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Seller Dashboard</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenSellerOnboarding();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/10 rounded transition-colors cursor-pointer"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Publish Free Assets</span>
                  </button>
                )}

                <div className="border-t border-gray-800 pt-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div
        className={`px-3 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none flex items-center gap-2 text-xs border-t ${
          isOldStyle
            ? 'bg-slate-950/90 border-amber-500/20'
            : 'bg-[#070b14] border-[#0040FF]/20'
        }`}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.name
                ? isOldStyle
                  ? 'bg-amber-600 text-white border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-[#0040FF] text-[#00E5FF] border border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : isOldStyle
                ? 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-amber-500/20'
                : 'bg-[#0d1424] text-gray-400 hover:text-white hover:bg-[#111a33] border border-[#0040FF]/20'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
