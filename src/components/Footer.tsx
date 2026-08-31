import React from 'react';
import {
  FileCode,
  ShieldCheck,
  Zap,
  Download,
  Lock,
  Headphones,
  UploadCloud,
  Layers,
  Heart,
  Scale,
  Store,
  Gift,
  Palette
} from 'lucide-react';
import { ActivePageView } from '../types';

interface FooterProps {
  appStyle?: 'new' | 'old';
  onToggleAppStyle?: () => void;
  onOpenUpload: () => void;
  onOpenSellerHub: () => void;
  onOpenDownloads: () => void;
  onNavigate: (view: ActivePageView) => void;
}

export const Footer: React.FC<FooterProps> = ({
  appStyle = 'new',
  onToggleAppStyle,
  onOpenUpload,
  onOpenSellerHub,
  onOpenDownloads,
  onNavigate,
}) => {
  const isOldStyle = appStyle === 'old';

  return (
    <footer
      className={`text-xs mt-12 border-t shadow-2xl transition-colors duration-300 ${
        isOldStyle
          ? 'bg-slate-950 border-amber-500/40 text-slate-300'
          : 'bg-[#070b14] border-[#0040FF]/40 text-gray-300 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]'
      }`}
    >
      {/* Top Value Propositions */}
      <div
        className={`border-b ${
          isOldStyle ? 'bg-slate-900 border-amber-500/20' : 'bg-[#0b1120] border-[#0040FF]/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-full shrink-0 shadow-md ${
                isOldStyle
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-[#0040FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
              }`}
            >
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Instant Free Delivery</h4>
              <p className="text-gray-400 text-[11px]">Download actual APKs, ZIPs &amp; source code in 1-tap</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 rounded-full shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Free Open Access</h4>
              <p className="text-gray-400 text-[11px]">Zero cost • Free commercial use for developers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-full shrink-0 shadow-md ${
                isOldStyle
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-[#0040FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
              }`}
            >
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Open Creator Platform</h4>
              <p className="text-gray-400 text-[11px]">Publish your APKs &amp; open source kits instantly</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-full shrink-0 shadow-md ${
                isOldStyle
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-[#0040FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Apna Assured Quality</h4>
              <p className="text-gray-400 text-[11px]">64-engine virus scanned &amp; verified archives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Marketplace Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Col 1: About */}
        <div className="space-y-2">
          <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px]">
            ABOUT APNA BAZAAR
          </h4>
          <ul className="space-y-1.5 text-gray-300">
            <li>
              <button
                onClick={() => onNavigate('privacy')}
                className="hover:text-emerald-400 hover:underline text-left cursor-pointer"
              >
                Privacy Policy &amp; Terms
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('terms')}
                className="hover:text-emerald-400 hover:underline text-left cursor-pointer"
              >
                Open Licensing Terms
              </button>
            </li>
            <li>
              <span className="text-gray-400">Developer: Abhinav Dutta</span>
            </li>
            <li>
              <span className="text-gray-400">Platform: Scorp Digital</span>
            </li>
          </ul>
        </div>

        {/* Col 2: Help & Support */}
        <div className="space-y-2">
          <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px]">
            HELP &amp; DOWNLOADS
          </h4>
          <ul className="space-y-1.5 text-gray-300">
            <li>
              <button
                onClick={onOpenDownloads}
                className="hover:text-emerald-400 hover:underline text-left cursor-pointer"
              >
                My Download Locker
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('terms')}
                className="hover:text-emerald-400 hover:underline text-left cursor-pointer"
              >
                File Extraction &amp; Safety Guide
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  const chatBtn = document.getElementById('open-customer-care-chat-btn');
                  if (chatBtn) {
                    chatBtn.click();
                  } else {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }
                }}
                className="hover:text-emerald-400 hover:underline text-left cursor-pointer flex items-center gap-1 text-emerald-400"
              >
                <span>Apna Support Chatbot (24/7 Help)</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Seller Zone */}
        <div className="space-y-2">
          <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px]">
            CREATORS &amp; DEVELOPERS
          </h4>
          <ul className="space-y-1.5 text-gray-300">
            <li>
              <button
                onClick={onOpenUpload}
                className="hover:text-emerald-400 hover:underline text-left cursor-pointer"
              >
                Publish Free APK / Code
              </button>
            </li>
            <li>
              <button
                onClick={onOpenSellerHub}
                className="hover:text-emerald-400 hover:underline text-left cursor-pointer"
              >
                Creator Hub &amp; Stats
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Design Style Switcher */}
        <div className="space-y-2">
          <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px]">
            THEME &amp; STYLE
          </h4>
          <p className="text-[11px] text-gray-400">
            Switch between the default Cyber Dark theme and the classic Indian Mandi theme.
          </p>
          {onToggleAppStyle && (
            <button
              onClick={onToggleAppStyle}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isOldStyle
                  ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-300'
                  : 'bg-[#0040FF] hover:bg-[#1a56ff] text-white border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,64,255,0.4)]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{isOldStyle ? 'Switch to New Cyber Style' : 'Switch to Old Mandi Style'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div
        className={`px-4 py-4 text-center border-t text-[11px] ${
          isOldStyle
            ? 'bg-slate-950 border-amber-500/20 text-slate-400'
            : 'bg-[#04070e] border-[#0040FF]/20 text-gray-500'
        }`}
      >
        <p>
          © {new Date().getFullYear()} Apna Bazaar (Scorp). 100% Free Open Marketplace for Software, Codebases, APKs &amp; UI Kits.
        </p>
      </div>
    </footer>
  );
};
