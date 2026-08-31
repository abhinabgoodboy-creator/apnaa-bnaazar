import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Code2,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Layers,
  Store,
  Gift,
  Download
} from 'lucide-react';

interface BannerProps {
  appStyle?: 'new' | 'old';
  onOpenUpload: () => void;
  onSeedDemo: () => void;
  hasProducts: boolean;
  onOpenSellerHub: () => void;
}

export const PromotionalBanner: React.FC<BannerProps> = ({
  appStyle = 'new',
  onOpenUpload,
  onSeedDemo,
  hasProducts,
  onOpenSellerHub,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isOldStyle = appStyle === 'old';

  const newSlides = [
    {
      id: 1,
      tag: '🎁 100% FREE DIGITAL MARKETPLACE',
      title: 'Free Android APKs, Codebases & UI Kits',
      subtitle: 'Zero cost, open community licenses. Instant binary downloads directly to your device.',
      highlight: 'Sub-50ms Smart AI Customer Care Active',
      gradient: 'from-[#0040FF] via-[#091836] to-[#070b14]',
      badge: '100% Free Access',
      actionText: 'Publish Free Asset',
      actionType: 'upload',
    },
    {
      id: 2,
      tag: '⚡ OPEN CREATOR PLATFORM',
      title: 'Share Your Code, Apps & Design Assets',
      subtitle: 'Publish software packages, developer tools & documentation with zero platform barriers.',
      highlight: '24/7 In-App Support Chatbot & Verified Checksums',
      gradient: 'from-[#0040FF] via-[#111e40] to-[#070b14]',
      badge: 'Creator Hub',
      actionText: 'Open Creator Dashboard',
      actionType: 'seller',
    },
    {
      id: 3,
      tag: '🛡️ APNA ASSURED 2.5 VERIFICATION',
      title: 'Production-Ready Software & Templates',
      subtitle: 'Every APK & archive undergoes 64-engine virus scanning for clean installation.',
      highlight: 'Automated 1-Hour Quality Pipeline',
      gradient: 'from-[#0040FF] via-[#0c1f4d] to-[#070b14]',
      badge: 'Virus-Free Hash',
      actionText: 'Upload Open Asset',
      actionType: 'upload',
    },
  ];

  const oldSlides = [
    {
      id: 1,
      tag: '🏛️ अपना बाज़ार • डिजिटल मंडी',
      title: 'भारत का #1 मुफ़्त डिजिटल बाज़ार',
      subtitle: 'एंड्रॉइड एपीके (APKs), पूर्ण सोर्स कोड, फिग्मा किट्स और तकनीकी ई-बुक्स 100% फ्री!',
      highlight: 'तुरंत 1-क्लिक डाउनलोड और सहायता',
      gradient: 'from-orange-700 via-amber-800 to-slate-900',
      badge: '100% मुफ़्त (Free)',
      actionText: 'नया उत्पाद अपलोड करें',
      actionType: 'upload',
    },
    {
      id: 2,
      tag: '🇮🇳 भारतीय डेवलपर्स का मंच',
      title: 'अपने टूल्स और ऐप्स साझा करें',
      subtitle: 'हजारों रचनाकारों और डेवलपर्स तक अपनी रचना पहुँचाएं, पूरी तरह मुफ़्त।',
      highlight: '24/7 इन-ऐप ग्राहक सहायता चैटबॉट',
      gradient: 'from-amber-700 via-orange-800 to-slate-950',
      badge: 'विश्वसनीय बाज़ार',
      actionText: 'विक्रेता हब खोलें',
      actionType: 'seller',
    },
  ];

  const slides = isOldStyle ? oldSlides : newSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide % slides.length] || slides[0];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 mb-4 sm:mb-6">
      <div
        className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${slide.gradient} p-4 sm:p-7 min-h-[160px] sm:min-h-[185px] flex items-center justify-between transition-all duration-700 shadow-xl ${
          isOldStyle
            ? 'border-2 border-amber-400/70 shadow-[0_0_35px_rgba(245,158,11,0.25)] text-slate-100'
            : 'border border-[#0040FF]/50 shadow-[0_0_35px_rgba(0,64,255,0.2)] text-white'
        }`}
      >
        {/* Background decorative watermark */}
        <div className="absolute right-8 -bottom-10 opacity-10 pointer-events-none hidden md:block">
          <Code2 className={`w-64 h-64 ${isOldStyle ? 'text-amber-300' : 'text-[#00E5FF]'}`} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
                isOldStyle
                  ? 'bg-amber-400 text-black'
                  : 'bg-[#00E5FF] text-black shadow-[0_0_10px_#00E5FF]'
              }`}
            >
              {slide.tag}
            </span>
            <span
              className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm border ${
                isOldStyle
                  ? 'bg-black/50 text-emerald-300 border-emerald-400/40'
                  : 'bg-black/50 text-[#00E5FF] border-[#00E5FF]/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {slide.badge}
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight drop-shadow">
            {slide.title}
          </h2>

          <p className="text-xs sm:text-sm font-medium line-clamp-2 opacity-90">
            {slide.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {slide.actionType === 'seller' ? (
              <button
                onClick={onOpenSellerHub}
                className={`flex items-center gap-1.5 font-extrabold text-xs sm:text-sm px-4 py-2 rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md ${
                  isOldStyle
                    ? 'bg-amber-500 hover:bg-amber-400 text-black'
                    : 'bg-[#00E5FF] hover:bg-[#33ebff] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>{slide.actionText}</span>
              </button>
            ) : (
              <button
                onClick={onOpenUpload}
                className={`flex items-center gap-1.5 text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md border ${
                  isOldStyle
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 border-amber-300'
                    : 'bg-gradient-to-r from-[#0040FF] to-[#1a56ff] border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,64,255,0.5)]'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>{slide.actionText}</span>
              </button>
            )}

            {!hasProducts && (
              <button
                onClick={onSeedDemo}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isOldStyle ? 'डेमो उत्पाद लोड करें' : 'Load Sample Items (Demo)'}</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-xs ml-2 font-mono opacity-90">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{slide.highlight}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
