import React, { useState } from 'react';
import {
  X,
  Settings,
  ShieldCheck,
  User,
  Mail,
  Smartphone,
  HardDrive,
  Download,
  KeyRound,
  Bell,
  CreditCard,
  FileText,
  Trash2,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  Save,
  Sparkles,
  Layers,
  AlertTriangle,
  RefreshCw,
  Palette,
  Gift,
  Sun,
  Moon,
  LayoutGrid
} from 'lucide-react';
import { MarketplaceSettings, UserProfile, Order } from '../types';
import { saveStoredSettings, clearAllProducts, getStoredOrders } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  settings: MarketplaceSettings;
  onUpdateSettings: (newSettings: MarketplaceSettings) => void;
  onUpdateDisplayName: (name: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  orders: Order[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  onUpdateSettings,
  onUpdateDisplayName,
  onOpenPrivacy,
  onOpenTerms,
  orders,
}) => {
  const [activeTab, setActiveTab] = useState<
    'appearance' | 'account' | 'delivery' | 'notifications' | 'free_access' | 'legal'
  >('appearance');

  // Account State
  const [displayName, setDisplayName] = useState(user?.displayName || 'Digital Creator');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Local settings state
  const [localSettings, setLocalSettings] = useState<MarketplaceSettings>(settings);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setSavedSuccessMsg(msg);
    setTimeout(() => setSavedSuccessMsg(null), 2500);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      onUpdateDisplayName(displayName.trim());
      showFeedback('Display name updated successfully');
    }
  };

  const handleStyleChange = (style: 'new' | 'old') => {
    const updated: MarketplaceSettings = {
      ...localSettings,
      appStyle: style,
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    saveStoredSettings(updated);
    showFeedback(
      style === 'new'
        ? 'Activated New Apna Bazaar (Modern Cyber Theme) ✨'
        : 'Activated Old Apna Bazaar (Classic Indian Mandi Theme) 🏛️'
    );
  };

  const handleThemeColorChange = (color: 'cyan' | 'saffron' | 'emerald' | 'indigo') => {
    const updated: MarketplaceSettings = {
      ...localSettings,
      themeColor: color,
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    saveStoredSettings(updated);
    showFeedback(`Theme accent updated to ${color.toUpperCase()}`);
  };

  const handleToggleSetting = (key: keyof MarketplaceSettings) => {
    const updated = {
      ...localSettings,
      [key]: !localSettings[key],
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    saveStoredSettings(updated);
    showFeedback('Settings updated');
  };

  const handleDownloadLocationChange = (loc: 'Browser Default' | 'Cloud Locker' | 'Custom Directory') => {
    const updated = {
      ...localSettings,
      defaultDownloadLocation: loc,
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
    saveStoredSettings(updated);
    showFeedback(`Download preference updated to ${loc}`);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportData = () => {
    const exportPayload = {
      user: user,
      settings: localSettings,
      orders: orders,
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apna-bazaar-user-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showFeedback('Data archive exported successfully');
  };

  // Collect all purchased keys
  const purchasedKeys: { title: string; key: string; format: string; date: string }[] = [];
  orders.forEach((ord) => {
    ord.items.forEach((it) => {
      purchasedKeys.push({
        title: it.product.title,
        key: it.licenseKey,
        format: it.product.fileFormat,
        date: ord.date,
      });
    });
  });

  const isOldStyle = localSettings.appStyle === 'old';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
          isOldStyle
            ? 'bg-[#1e293b] border-2 border-amber-500/80 text-slate-100 shadow-[0_0_50px_rgba(245,158,11,0.3)]'
            : 'bg-[#0b1120] border border-[#0040FF]/50 text-gray-200 shadow-[0_0_40px_rgba(0,64,255,0.25)]'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            isOldStyle
              ? 'bg-gradient-to-r from-orange-600 via-amber-700 to-slate-900 border-amber-400/40 text-white'
              : 'bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#0b1120] border-[#00E5FF]/20 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isOldStyle
                  ? 'bg-amber-500/30 border border-amber-300 text-amber-200'
                  : 'bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
              }`}
            >
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                  {isOldStyle ? 'बाज़ार सेटिंग्स (Marketplace Settings)' : 'Marketplace Settings & Themes'}
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1">
                  <Gift className="w-2.5 h-2.5 text-emerald-300" /> 100% Free
                </span>
              </div>
              <p className="text-xs text-amber-100/80">
                Switch Old/New bazaar designs, theme accents, download security, &amp; licenses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Feedback Alert Bar */}
        {savedSuccessMsg && (
          <div className="bg-emerald-600/30 border-b border-emerald-400/50 px-4 py-2 text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        {/* Modal Body: Sidebar Tabs + Content Panel */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Tabs (4 cols) */}
          <div
            className={`md:col-span-4 p-3 sm:p-4 border-r space-y-1.5 overflow-y-auto ${
              isOldStyle ? 'bg-slate-900/90 border-amber-500/30' : 'bg-[#070b14] border-[#0040FF]/20'
            }`}
          >
            {/* 1. Appearance & Style Mode Tab */}
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'appearance'
                  ? isOldStyle
                    ? 'bg-amber-600 text-white shadow-md border border-amber-300'
                    : 'bg-gradient-to-r from-[#0040FF] to-[#0040FF]/60 text-white shadow-[0_0_15px_rgba(0,64,255,0.5)] border border-[#00E5FF]/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <div className="truncate">
                <div className="font-bold flex items-center gap-1.5">
                  <span>1. Theme &amp; Style Mode</span>
                  <span className="text-[9px] bg-amber-400/30 text-amber-300 px-1 py-0.2 rounded uppercase">
                    New!
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-normal">Old vs New Apna Bazaar</div>
              </div>
            </button>

            {/* 2. Free Open Access Tab */}
            <button
              onClick={() => setActiveTab('free_access')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'free_access'
                  ? isOldStyle
                    ? 'bg-amber-600 text-white shadow-md border border-amber-300'
                    : 'bg-gradient-to-r from-[#0040FF] to-[#0040FF]/60 text-white shadow-[0_0_15px_rgba(0,64,255,0.5)] border border-[#00E5FF]/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Gift className="w-4 h-4 text-emerald-400" />
              <div className="truncate">
                <div className="font-bold">2. 100% Free Open Access</div>
                <div className="text-[10px] text-gray-400 font-normal">Zero cost &amp; Free licenses</div>
              </div>
            </button>

            {/* 3. Account & Security Tab */}
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'account'
                  ? isOldStyle
                    ? 'bg-amber-600 text-white shadow-md border border-amber-300'
                    : 'bg-gradient-to-r from-[#0040FF] to-[#0040FF]/60 text-white shadow-[0_0_15px_rgba(0,64,255,0.5)] border border-[#00E5FF]/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 text-[#00E5FF]" />
              <div className="truncate">
                <div className="font-bold">3. Account &amp; Security</div>
                <div className="text-[10px] text-gray-400 font-normal">Google OAuth &amp; 2FA</div>
              </div>
            </button>

            {/* 4. Digital Delivery & Storage Tab */}
            <button
              onClick={() => setActiveTab('delivery')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'delivery'
                  ? isOldStyle
                    ? 'bg-amber-600 text-white shadow-md border border-amber-300'
                    : 'bg-gradient-to-r from-[#0040FF] to-[#0040FF]/60 text-white shadow-[0_0_15px_rgba(0,64,255,0.5)] border border-[#00E5FF]/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HardDrive className="w-4 h-4 text-[#00E5FF]" />
              <div className="truncate">
                <div className="font-bold">4. Digital Delivery &amp; Vault</div>
                <div className="text-[10px] text-gray-400 font-normal">Auto-download &amp; Keys</div>
              </div>
            </button>

            {/* 5. Notifications & Alerts Tab */}
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? isOldStyle
                    ? 'bg-amber-600 text-white shadow-md border border-amber-300'
                    : 'bg-gradient-to-r from-[#0040FF] to-[#0040FF]/60 text-white shadow-[0_0_15px_rgba(0,64,255,0.5)] border border-[#00E5FF]/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bell className="w-4 h-4 text-[#00E5FF]" />
              <div className="truncate">
                <div className="font-bold">5. Notifications &amp; Alerts</div>
                <div className="text-[10px] text-gray-400 font-normal">Update alerts &amp; Receipts</div>
              </div>
            </button>

            {/* 6. Legal & Compliance Tab */}
            <button
              onClick={() => setActiveTab('legal')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'legal'
                  ? isOldStyle
                    ? 'bg-amber-600 text-white shadow-md border border-amber-300'
                    : 'bg-gradient-to-r from-[#0040FF] to-[#0040FF]/60 text-white shadow-[0_0_15px_rgba(0,64,255,0.5)] border border-[#00E5FF]/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 text-[#00E5FF]" />
              <div className="truncate">
                <div className="font-bold">6. Legal &amp; Compliance</div>
                <div className="text-[10px] text-gray-400 font-normal">Terms, Policy &amp; Export</div>
              </div>
            </button>
          </div>

          {/* Right Content Panel (8 cols) */}
          <div
            className={`md:col-span-8 p-4 sm:p-6 overflow-y-auto max-h-[70vh] space-y-6 ${
              isOldStyle ? 'bg-slate-950/90 text-slate-100' : 'bg-[#0c1222] text-gray-200'
            }`}
          >
            {/* SECTION 1: THEME & STYLE MODE */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>Theme &amp; Style Switcher</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Choose between the futuristic <strong>New Cyber Apna Bazaar</strong> or the nostalgic{' '}
                    <strong>Old Classic Indian Mandi</strong> design.
                  </p>
                </div>

                {/* Old vs New Style Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New Cyber Style (Default) */}
                  <div
                    onClick={() => handleStyleChange('new')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      localSettings.appStyle === 'new' || !localSettings.appStyle
                        ? 'bg-[#0d1424] border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.3)]'
                        : 'bg-[#070b14] border-gray-800 hover:border-gray-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {localSettings.appStyle === 'new' && (
                      <div className="absolute top-2 right-2 bg-[#00E5FF] text-black text-[9px] font-black px-2 py-0.5 rounded uppercase">
                        Active (Default)
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-[#0040FF]/30 border border-[#00E5FF]/40 text-[#00E5FF]">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-white">New Apna Bazaar</h4>
                          <span className="text-[10px] text-[#00E5FF] font-mono">Modern Cyber Dark</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Futuristic cyber-tech aesthetic with neon cyan glow, deep blue accents, and modern high-contrast cards.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-[11px]">
                      <span className="text-[#00E5FF] font-bold">⚡ Default Look</span>
                      <button
                        type="button"
                        className="px-3 py-1 bg-[#0040FF] hover:bg-[#1a56ff] text-white text-xs font-bold rounded"
                      >
                        {localSettings.appStyle === 'new' ? 'Selected' : 'Select New Style'}
                      </button>
                    </div>
                  </div>

                  {/* Old Classic Bazaar Style */}
                  <div
                    onClick={() => handleStyleChange('old')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      localSettings.appStyle === 'old'
                        ? 'bg-gradient-to-br from-amber-950/70 to-slate-900 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                        : 'bg-[#070b14] border-gray-800 hover:border-gray-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {localSettings.appStyle === 'old' && (
                      <div className="absolute top-2 right-2 bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase">
                        Active Style
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-orange-500/20 border border-amber-400/40 text-amber-300">
                          <LayoutGrid className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-amber-100">Old Apna Bazaar</h4>
                          <span className="text-[10px] text-amber-400 font-medium">Classic Indian Mandi</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Nostalgic traditional Indian marketplace look with authentic saffron borders, heritage banners, and classic mandi styling.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-bold">🏛️ Heritage Mandi</span>
                      <button
                        type="button"
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded"
                      >
                        {localSettings.appStyle === 'old' ? 'Selected' : 'Select Old Style'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accent Color Customization */}
                <div
                  className={`p-4 rounded-xl border space-y-3 ${
                    isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                  }`}
                >
                  <label className="block text-xs font-bold text-gray-200">
                    Theme Color Accent Preference
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'cyan', label: 'Cyber Cyan', color: '#00E5FF' },
                      { id: 'saffron', label: 'Saffron Mandi', color: '#FF6B00' },
                      { id: 'emerald', label: 'Emerald Mint', color: '#10B981' },
                      { id: 'indigo', label: 'Royal Indigo', color: '#6366F1' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleThemeColorChange(c.id as any)}
                        className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          localSettings.themeColor === c.id
                            ? 'bg-white/10 border-white text-white shadow-md'
                            : 'bg-black/30 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="truncate">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: 100% FREE OPEN ACCESS */}
            {activeTab === 'free_access' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Gift className="w-4 h-4 text-emerald-400" />
                    <span>100% Free Open Access Model</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Every digital product on Apna Bazaar is 100% free with unlimited downloads.
                  </p>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/40">
                      <Gift className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-emerald-300">
                        Zero Pricing • 100% Free for Everyone
                      </h4>
                      <p className="text-xs text-emerald-100/80">
                        No credit cards, hidden subscriptions, or paywalls. One-tap instant access to APKs, full code repositories, and Figma kits.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                    <div className="p-2.5 bg-black/40 rounded-lg border border-emerald-500/20">
                      <strong className="text-emerald-400 block mb-0.5">Free Personal Use</strong>
                      <span className="text-gray-300 text-[11px]">Learn, experiment, and run personal instances.</span>
                    </div>
                    <div className="p-2.5 bg-black/40 rounded-lg border border-emerald-500/20">
                      <strong className="text-emerald-400 block mb-0.5">Free Commercial License</strong>
                      <span className="text-gray-300 text-[11px]">Deploy in production and client deliverables.</span>
                    </div>
                    <div className="p-2.5 bg-black/40 rounded-lg border border-emerald-500/20">
                      <strong className="text-emerald-400 block mb-0.5">Unlimited Re-downloads</strong>
                      <span className="text-gray-300 text-[11px]">Available forever in your Downloads Locker.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: ACCOUNT & SECURITY */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00E5FF]" />
                    <span>Account &amp; Security</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Manage connected identity, creator display name, and download security.
                  </p>
                </div>

                {/* Connected Google Account */}
                <div
                  className={`p-4 rounded-xl border space-y-3 ${
                    isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {user?.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={user.displayName}
                          className="w-11 h-11 rounded-full border-2 border-emerald-400"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-orange-600 text-white font-bold text-base flex items-center justify-center border border-amber-300">
                          {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'AB'}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{user?.displayName || 'Abhinav Dutta'}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {user?.email || 'abhinabgoodboy@gmail.com'}
                        </div>
                      </div>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                      Google OAuth Verified
                    </span>
                  </div>
                </div>

                {/* Edit Display Name Form */}
                <form
                  onSubmit={handleSaveAccount}
                  className={`p-4 rounded-xl border space-y-3 ${
                    isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                  }`}
                >
                  <label className="block text-xs font-bold text-gray-300">
                    Change Display Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter new display name"
                      className="flex-1 bg-[#070b14] border border-gray-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Name</span>
                    </button>
                  </div>
                </form>

                {/* Two-Factor Authentication for Digital Downloads */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                    isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Two-Factor Authentication (2FA) for Downloads</span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Require security confirmation before revealing sensitive source code archives and API keys.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('twoFactorAuth')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      localSettings.twoFactorAuth ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        localSettings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 4: DIGITAL DELIVERY & VAULT */}
            {activeTab === 'delivery' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-amber-400" />
                    <span>Digital Delivery &amp; Storage Vault</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Tailored settings for digital goods, instant asset packaging, and license vault.
                  </p>
                </div>

                {/* Auto-Download on Claim */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                    isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Auto-Download on 1-Tap Claim</span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Instantly trigger direct file download (ZIP, APK, PDF) immediately upon checkout completion.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('autoDownloadOnPurchase')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      localSettings.autoDownloadOnPurchase ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        localSettings.autoDownloadOnPurchase ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Default Download Location Preference */}
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                  }`}
                >
                  <label className="block text-xs font-bold text-gray-300">
                    Default Download Location Preference
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(['Browser Default', 'Cloud Locker', 'Custom Directory'] as const).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleDownloadLocationChange(loc)}
                        className={`p-2.5 rounded border text-xs font-bold text-center transition-all cursor-pointer ${
                          localSettings.defaultDownloadLocation === loc
                            ? 'bg-amber-600/40 border-amber-400 text-amber-200'
                            : 'bg-black/40 border-gray-800 text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: NOTIFICATIONS & ALERTS */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Notifications &amp; Alerts</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Customize version release alerts, patch updates, and security logs.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                    isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs sm:text-sm text-white">
                      Product Update &amp; Patch Notifications
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Receive alerts when creators publish bugfixes, security patches, or major v2 releases for your owned digital items.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('productUpdateNotifications')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      localSettings.productUpdateNotifications ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        localSettings.productUpdateNotifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 6: LEGAL & COMPLIANCE */}
            {activeTab === 'legal' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Legal &amp; Compliance</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Official policies, open licenses, and data export tools.
                  </p>
                </div>

                {/* Privacy Policy Link */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-white">Privacy Policy</div>
                    <p className="text-[11px] text-gray-400">
                      Learn how your personal information and download logs are protected.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPrivacy();
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Policy</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Terms of Service */}
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-white">
                        Terms of Service &amp; Open Digital Asset License
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Governing free instant downloads, redistribution terms, and creator safety.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenTerms();
                      }}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Read Terms</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Data Export & Account Reset */}
                <div
                  className={`p-4 rounded-xl border space-y-3 ${
                    isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-white">
                    Data Portability &amp; Account Archive
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Export your full activity archive, orders history, license keys, and profile records in standard JSON format.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded flex items-center gap-2 transition-colors shadow-md cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export My Data (JSON)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-5 py-3 flex items-center justify-between text-xs border-t ${
            isOldStyle
              ? 'bg-slate-950 border-amber-500/30 text-amber-200/80'
              : 'bg-[#070b14] border-[#0040FF]/30 text-gray-400'
          }`}
        >
          <span className="font-mono text-[11px] text-emerald-400">
            Apna Bazaar • 100% Free Open Marketplace Architecture
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
