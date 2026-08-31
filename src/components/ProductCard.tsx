import React from 'react';
import {
  Star,
  Heart,
  ShoppingCart,
  Download,
  Zap,
  CheckCircle2,
  ExternalLink,
  FileArchive,
  Layers,
  Sparkles,
  Phone,
  Gift
} from 'lucide-react';
import { DigitalProduct } from '../types';

interface ProductCardProps {
  product: DigitalProduct;
  isWishlisted: boolean;
  appStyle?: 'new' | 'old';
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: DigitalProduct) => void;
  onQuickBuy: (product: DigitalProduct) => void;
  onSelectProduct: (product: DigitalProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  appStyle = 'new',
  onToggleWishlist,
  onAddToCart,
  onQuickBuy,
  onSelectProduct,
}) => {
  const isOldStyle = appStyle === 'old';

  // Use the seller's actual uploaded banner and logo
  const bannerImage =
    product.thumbnail || product.thumbnail_1 || product.screenshots?.[0] || product.logo;
  const logoImage = product.logo || product.thumbnail || product.thumbnail_1;

  return (
    <div
      className={`group relative rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
        isOldStyle
          ? 'bg-slate-900 border-2 border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] text-slate-100'
          : 'bg-[#0d1424] border border-[#0040FF]/30 hover:border-[#00E5FF]/70 hover:shadow-[0_0_25px_rgba(0,229,255,0.2)] text-gray-200'
      }`}
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
    >
      {/* Top Image Section */}
      <div
        className={`relative aspect-4/3 sm:aspect-16/10 overflow-hidden flex items-center justify-center p-2 border-b ${
          isOldStyle
            ? 'bg-slate-950 border-amber-500/20'
            : 'bg-[#070b14] border-[#0040FF]/20'
        }`}
      >
        {bannerImage ? (
          <img
            src={bannerImage}
            alt={product.title}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center text-white p-4 text-center rounded-xl ${
              isOldStyle
                ? 'bg-gradient-to-br from-amber-950/60 to-slate-900'
                : 'bg-gradient-to-br from-[#0040FF]/20 via-[#0b1120] to-[#070b14]'
            }`}
          >
            <FileArchive
              className={`w-10 h-10 mb-2 ${
                isOldStyle ? 'text-amber-400' : 'text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
              }`}
            />
            <span
              className={`text-xs font-black uppercase tracking-wider ${
                isOldStyle ? 'text-amber-300' : 'text-[#00E5FF]'
              }`}
            >
              {product.fileFormat} File Package
            </span>
            <span className="text-[11px] text-blue-200 line-clamp-1">{product.category}</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
            isWishlisted
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-black/60 text-gray-300 hover:text-red-400 hover:bg-black/80 border border-white/10'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Format & Free Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className={`backdrop-blur-md font-black text-[10px] px-2 py-0.5 rounded-md shadow tracking-wider uppercase flex items-center gap-1 border ${
              isOldStyle
                ? 'bg-black/80 border-amber-400/50 text-amber-300'
                : 'bg-black/70 border-[#00E5FF]/40 text-[#00E5FF]'
            }`}
          >
            <Layers className="w-3 h-3" />
            {product.fileFormat}
          </span>
          <span className="bg-emerald-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-0.5 shadow">
            <Gift className="w-2.5 h-2.5" /> FREE
          </span>
        </div>

        {/* Bottom Version / Size Bar */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-gray-300 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow">
          <span className="font-semibold text-white">{product.version || 'v1.0.0'}</span>
          <span className={`font-mono font-bold ${isOldStyle ? 'text-amber-300' : 'text-[#00E5FF]'}`}>
            {product.fileSize || 'Instant Asset'}
          </span>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Category & Delivery Note */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400 font-medium truncate max-w-[60%]">
              {product.category}
            </span>
            <span className="text-emerald-400 font-semibold text-[10px] flex items-center gap-0.5">
              <Zap className="w-3 h-3 text-emerald-400" /> Instant Free Download
            </span>
          </div>

          {/* Title and App Logo Identity Row */}
          <div className="flex items-start gap-3">
            {logoImage && (
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl shrink-0 overflow-hidden p-1 flex items-center justify-center border shadow-md ${
                  isOldStyle
                    ? 'bg-slate-950 border-amber-500/40'
                    : 'bg-[#070b14] border-[#0040FF]/60 group-hover:border-[#00E5FF] transition-colors'
                }`}
              >
                <img
                  src={logoImage}
                  alt={`${product.title} Logo`}
                  className="w-full h-full object-contain rounded-lg"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3
                className={`font-extrabold text-sm sm:text-base line-clamp-2 leading-snug transition-colors ${
                  isOldStyle
                    ? 'text-white group-hover:text-amber-300'
                    : 'text-white group-hover:text-[#00E5FF]'
                }`}
              >
                {product.title}
              </h3>
              <span className="text-[11px] text-gray-400 truncate block mt-0.5">
                By {product.creatorOrCompanyName || product.sellerName || 'Verified Developer'}
              </span>
            </div>
          </div>

          {/* Rating & Assured Badge */}
          <div className="flex items-center gap-2 pt-0.5">
            <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded">
              <span>{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
              <Star className="w-3 h-3 fill-current text-emerald-400" />
            </div>
            <span className="text-xs text-gray-400 font-medium">
              ({product.ratingCount || 18})
            </span>

            {product.isAssured && (
              <div
                className={`ml-auto inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                  isOldStyle
                    ? 'bg-amber-950/60 border-amber-400/50 text-amber-300'
                    : 'bg-[#0040FF]/20 border-[#00E5FF]/40 text-[#00E5FF]'
                }`}
              >
                <span>{isOldStyle ? 'प्रमाणित' : 'Apna'}</span>
                <span>✔</span>
                <span>Verified</span>
              </div>
            )}
          </div>

          {/* Seller Contact Note */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-800">
            <span className="truncate">
              By <strong className="text-gray-200">{product.creatorOrCompanyName || product.sellerName}</strong>
            </span>
            {product.sellerPhone && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Phone className="w-2.5 h-2.5" /> Direct
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Free Claim CTA Section */}
        <div className="pt-2 border-t border-gray-800/80 mt-1 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-emerald-400 font-mono flex items-center gap-1">
                <Gift className="w-4 h-4 text-emerald-400" /> 100% FREE
              </span>
              <span className="text-[10px] text-gray-400 font-medium">(₹0 Open Access)</span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">Unlimited</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className={`w-full flex items-center justify-center gap-1.5 py-2 px-2 border font-bold text-xs rounded-lg transition-all cursor-pointer ${
                isOldStyle
                  ? 'bg-slate-800 hover:bg-slate-700 border-amber-500/30 text-amber-200'
                  : 'bg-[#0040FF]/30 hover:bg-[#0040FF] border-[#0040FF]/60 text-white'
              }`}
              title="Add to Free Downloads Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Cart</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickBuy(product);
              }}
              className={`w-full flex items-center justify-center gap-1.5 py-2 px-2 text-white font-extrabold text-xs rounded-lg transition-all cursor-pointer shadow-md ${
                isOldStyle
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 hover:opacity-90 border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-gradient-to-r from-[#0040FF] via-[#1a56ff] to-[#00E5FF] hover:opacity-95 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
              }`}
            >
              <Download className="w-3.5 h-3.5 fill-current" />
              <span>Get Free</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
