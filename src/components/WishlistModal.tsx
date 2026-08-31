import React from 'react';
import { X, Heart, ShoppingCart, Trash2, Zap, Layers } from 'lucide-react';
import { DigitalProduct } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedProducts: DigitalProduct[];
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: DigitalProduct) => void;
  onSelectProduct: (product: DigitalProduct) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistedProducts,
  onRemoveWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#0b1120] border border-[#0040FF]/60 rounded-xl shadow-[0_0_50px_rgba(0,64,255,0.3)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-gray-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#0b1120] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-[#00E5FF]/20">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-current text-red-400" />
            <h2 className="font-extrabold text-base sm:text-lg">
              My Wishlist ({wishlistedProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-3 text-xs sm:text-sm">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Heart className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="font-bold text-white text-sm">Your Wishlist is Empty</h3>
              <p className="text-xs text-gray-400">
                Click the heart icon on any product card to save apps, templates, or source code for later.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {wishlistedProducts.map((product: DigitalProduct) => {
                const displayImg = product.thumbnail || product.thumbnail_1 || product.logo;
                return (
                  <div
                    key={product.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-white/5 p-2 rounded transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                    >
                      {displayImg ? (
                        <img
                          src={displayImg}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded bg-[#070b14] border border-[#0040FF]/50 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-[#070b14] border border-[#0040FF]/50 flex items-center justify-center text-[#00E5FF] font-bold text-xs shrink-0">
                          {product.fileFormat}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white line-clamp-1">{product.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                          <span className="text-[#00E5FF] font-semibold">{product.category}</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-400">
                            100% FREE
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onRemoveWishlist(product.id);
                        }}
                        className="bg-[#0040FF] hover:bg-[#1a56ff] text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors shadow"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-[#00E5FF]" />
                        <span>Move to Cart</span>
                      </button>
                      <button
                        onClick={() => onRemoveWishlist(product.id)}
                        className="text-gray-400 hover:text-red-400 p-1.5 cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#070b14] border-t border-[#0040FF]/20 px-4 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
