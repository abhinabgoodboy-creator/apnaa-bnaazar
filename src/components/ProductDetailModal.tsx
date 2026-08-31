import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Zap,
  Download,
  Share2,
  Heart,
  ShoppingCart,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Phone,
  FileArchive,
  Info,
  Calendar,
  User,
  Sparkles,
  Gift,
  KeyRound
} from 'lucide-react';
import { DigitalProduct } from '../types';
import { triggerDigitalDownload } from '../utils/storage';

interface ProductDetailModalProps {
  product: DigitalProduct | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  appStyle?: 'new' | 'old';
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: DigitalProduct) => void;
  onBuyNow: (product: DigitalProduct) => void;
  onDirectDownload?: (product: DigitalProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  appStyle = 'new',
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onDirectDownload,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !product) return null;

  const isOldStyle = appStyle === 'old';

  // Build list of valid display images
  const allImages = [
    product.thumbnail,
    product.thumbnail_1,
    product.thumbnail_2,
    product.logo,
    ...(product.screenshots || []),
  ].filter((img): img is string => Boolean(img && img.trim().length > 0));

  const displayImages = Array.from(new Set(allImages));
  const activeImage = displayImages[selectedImageIndex] || displayImages[0] || '';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleDirectDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      triggerDigitalDownload(product);
      if (onDirectDownload) {
        onDirectDownload(product);
      }
      setDownloading(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
          isOldStyle
            ? 'bg-slate-900 border-2 border-amber-500/70 text-slate-100 shadow-[0_0_50px_rgba(245,158,11,0.3)]'
            : 'bg-[#0b1120] border border-[#0040FF]/60 text-gray-200 shadow-[0_0_50px_rgba(0,64,255,0.3)]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-4 sm:px-6 py-3.5 flex items-center justify-between border-b ${
            isOldStyle
              ? 'bg-gradient-to-r from-orange-600 via-amber-700 to-slate-900 text-white border-amber-400/40'
              : 'bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#0b1120] text-white border-[#00E5FF]/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1 border ${
                isOldStyle
                  ? 'bg-amber-400/20 text-amber-200 border-amber-300/40'
                  : 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/40'
              }`}
            >
              <Layers className="w-3 h-3" />
              {product.fileFormat} Asset Package
            </span>
            <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-emerald-400/40 flex items-center gap-1">
              <Gift className="w-2.5 h-2.5" /> 100% Free Download
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition-colors cursor-pointer"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                isWishlisted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {copiedLink && (
          <div className="bg-emerald-500 text-white text-xs font-bold py-1 px-4 text-center">
            Product link copied to clipboard!
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[78vh]">
          {/* Left Column: Visual Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`aspect-4/3 rounded-xl overflow-hidden border flex items-center justify-center p-2 relative shadow-inner ${
                isOldStyle ? 'bg-slate-950 border-amber-500/30' : 'bg-[#070b14] border-[#0040FF]/40'
              }`}
            >
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 text-gray-400">
                  <FileArchive
                    className={`w-16 h-16 mb-2 ${isOldStyle ? 'text-amber-400' : 'text-[#00E5FF]'}`}
                  />
                  <span className="text-sm font-bold text-white uppercase">{product.fileFormat} Archive</span>
                  <span className="text-xs text-gray-400">{product.category}</span>
                </div>
              )}

              <div className="absolute top-3 left-3">
                <span className="bg-black/80 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/40 uppercase">
                  ✔ 100% Free
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {displayImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? isOldStyle
                          ? 'border-amber-400 shadow-md scale-105'
                          : 'border-[#00E5FF] shadow-[0_0_10px_#00E5FF] scale-105'
                        : 'border-gray-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Seller Contact & Verification Card */}
            <div
              className={`p-3.5 rounded-xl border space-y-2.5 text-xs ${
                isOldStyle ? 'bg-slate-950 border-amber-500/30' : 'bg-[#0d1424] border-[#0040FF]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-semibold">Published By:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {product.creatorOrCompanyName || product.sellerName}
                </span>
              </div>

              {product.sellerPhone && (
                <div className="flex items-center justify-between pt-1 border-t border-gray-800">
                  <span className="text-gray-400">Direct Creator Contact:</span>
                  <a
                    href={`tel:${product.sellerPhone}`}
                    className="text-emerald-400 font-mono font-bold hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{product.sellerPhone}</span>
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-gray-800 text-[11px]">
                <span className="text-gray-400">License:</span>
                <span className="text-emerald-400 font-bold">Open Commercial (Free)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specs, Free Claim & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Title, App Logo & Ratings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`border text-[11px] font-bold px-2 py-0.5 rounded ${
                    isOldStyle
                      ? 'bg-amber-950/60 border-amber-400/40 text-amber-300'
                      : 'bg-[#0040FF]/20 border-[#00E5FF]/30 text-[#00E5FF]'
                  }`}
                >
                  {product.category}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  Version {product.version || 'v1.0.0'}
                </span>
                {product.isUserUploaded && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Live Creator Asset
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                {(product.logo || product.thumbnail) && (
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shrink-0 overflow-hidden p-1.5 flex items-center justify-center border shadow-lg ${
                      isOldStyle
                        ? 'bg-slate-950 border-amber-500/50 shadow-amber-500/10'
                        : 'bg-[#070b14] border-[#00E5FF]/60 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                    }`}
                  >
                    <img
                      src={product.logo || product.thumbnail}
                      alt={`${product.title} Icon`}
                      className="w-full h-full object-contain rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {product.title}
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Developed by{' '}
                    <strong className="text-white">
                      {product.creatorOrCompanyName || product.sellerName || 'Verified Developer'}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded">
                  <span>{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
                  <Star className="w-3.5 h-3.5 fill-current text-emerald-400" />
                </div>
                <span className="text-xs text-gray-400">
                  {product.ratingCount || 24} Verified Ratings
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Instant Free Download
                </span>
              </div>
            </div>

            {/* Free Pricing Box */}
            <div
              className={`rounded-xl p-4 flex items-center justify-between border ${
                isOldStyle ? 'bg-slate-950 border-amber-500/40' : 'bg-[#111a33] border-[#0040FF]/40'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono flex items-center gap-1">
                    <Gift className="w-6 h-6 text-emerald-400" /> 100% FREE
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold">
                    (Zero Cost • No Card Needed)
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 block">
                  Includes full commercial license, lifetime updates &amp; permanent download access
                </span>
              </div>

              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-1 rounded-md">
                  Direct {product.fileFormat} File
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => onAddToCart(product)}
                className={`w-full py-3 px-4 border font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isOldStyle
                    ? 'bg-slate-800 hover:bg-slate-700 border-amber-500/30 text-amber-200'
                    : 'bg-[#0040FF]/30 hover:bg-[#0040FF] border-[#0040FF]/60 text-white'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Free Cart</span>
              </button>

              <button
                onClick={() => onBuyNow(product)}
                className={`w-full py-3 px-4 text-white font-extrabold text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isOldStyle
                    ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 hover:opacity-90 border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-gradient-to-r from-[#0040FF] via-[#1a56ff] to-[#00E5FF] hover:opacity-95 shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>1-Tap Free Claim</span>
              </button>
            </div>

            {/* Direct Digital Download & Official Source Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleDirectDownload}
                disabled={downloading}
                className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer border border-dashed font-bold text-xs ${
                  isOldStyle
                    ? 'bg-slate-950 hover:bg-slate-800 border-amber-400/50 text-amber-300'
                    : 'bg-[#070b14] hover:bg-white/5 border-[#00E5FF]/40 text-[#00E5FF]'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloading
                    ? `Packaging ${product.fileFormat}...`
                    : `Direct Download (${product.fileName || `${product.title}.${product.fileFormat.toLowerCase()}`})`}
                </span>
              </button>

              {(product.externalDownloadUrl || product.previewUrl) && (
                <a
                  href={product.externalDownloadUrl || product.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 font-bold text-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Official Site / Source</span>
                </a>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2 border-t border-gray-800">
              <h3 className="font-extrabold text-sm text-white">Product Overview</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <h3 className="font-extrabold text-sm text-white">Included Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Specs */}
            <div
              className={`rounded-lg p-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs border ${
                isOldStyle ? 'bg-slate-950 border-amber-500/30' : 'bg-[#070b14] border-[#0040FF]/30'
              }`}
            >
              <div>
                <span className="text-gray-500 text-[10px] block">File Package:</span>
                <span className="font-mono font-bold text-white">{product.fileFormat}</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Download Size:</span>
                <span className="font-mono font-bold text-white">{product.fileSize || 'Instant'}</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Cost:</span>
                <span className="font-bold text-emerald-400">100% Free (₹0)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
