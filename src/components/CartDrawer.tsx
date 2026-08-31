import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShieldCheck,
  Zap,
  Download,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  KeyRound,
  FileCode,
  Lock,
  Layers,
  Gift,
  Copy,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, UserProfile } from '../types';
import { triggerDigitalDownload } from '../utils/storage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appStyle?: 'new' | 'old';
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
  user?: UserProfile | null;
  onRequireAuth?: (reason: string, callback: () => void) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  appStyle = 'new',
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  user,
  onRequireAuth,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'customer' | 'success'>('cart');
  const [customerName, setCustomerName] = useState(user?.displayName || 'Abhinav Dutta');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'abhinabgoodboy@gmail.com');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isOldStyle = appStyle === 'old';

  // Sync user info when user changes
  React.useEffect(() => {
    if (user) {
      if (user.displayName) setCustomerName(user.displayName);
      if (user.email) setCustomerEmail(user.email);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleClaimFreeItems = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => {
        const licenseKey = `APNA-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        return {
          product: item.product,
          license: item.selectedLicense,
          licenseKey,
          downloadUrl:
            item.product.fileName ||
            `${item.product.title.toLowerCase().replace(/\s+/g, '-')}.${item.product.fileFormat.toLowerCase()}`,
          price: 0,
        };
      });

      const newOrder: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        createdAt: new Date().toISOString(),
        customerEmail: customerEmail.trim() || user?.email || 'customer@apnabazaar.in',
        customerName: customerName.trim() || user?.displayName || 'Apna Customer',
        paymentMethod: '100% Free Open Claim',
        transactionId: `TXN-FREE-${Date.now()}`,
        items: orderItems,
        totalAmount: 0,
        totalSavings: 0,
      };

      setLastPlacedOrder(newOrder);
      onOrderPlaced(newOrder);
      onClearCart();
      setIsProcessing(false);
      setCheckoutStep('success');

      // Trigger automatic download of first product
      if (cart[0]?.product) {
        triggerDigitalDownload(cart[0].product);
      }

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.log('Confetti effect', e);
      }
    }, 600);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-sm flex justify-end">
      <div
        className={`w-full max-w-2xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 border-l ${
          isOldStyle
            ? 'bg-slate-950 border-amber-500/50 text-slate-100'
            : 'bg-[#0b1120] border-[#0040FF]/50 text-gray-200 shadow-[0_0_50px_rgba(0,64,255,0.4)]'
        }`}
      >
        {/* Top Header */}
        <div
          className={`px-4 sm:px-6 py-3.5 flex items-center justify-between border-b ${
            isOldStyle
              ? 'bg-gradient-to-r from-orange-600 via-amber-700 to-slate-900 text-white border-amber-400/40'
              : 'bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#0b1120] text-white border-[#00E5FF]/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded ${
                isOldStyle
                  ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
                  : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-base sm:text-lg">
              {checkoutStep === 'success'
                ? isOldStyle
                  ? 'डाउनलोड तैयार (Free Downloads Ready)'
                  : 'Downloads & License Keys Ready'
                : checkoutStep === 'customer'
                ? 'Delivery Email Confirmation'
                : isOldStyle
                ? `फ्री डाउनलोड कार्ट (${cart.length} उत्पाद)`
                : `Free Downloads Cart (${cart.length} ${cart.length === 1 ? 'item' : 'items'})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {/* STEP 1: CART ITEMS VIEW */}
          {checkoutStep === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div
                  className={`rounded-2xl border p-8 text-center space-y-3 ${
                    isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                      isOldStyle
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                        : 'bg-[#0040FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.3)]'
                    }`}
                  >
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white">Your Free Cart is Empty</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Browse Apna Bazaar to find free Android APKs, source codebases, and Figma kits.
                  </p>
                  <button
                    onClick={onClose}
                    className={`mt-2 font-extrabold px-6 py-2 rounded-lg text-xs transition-transform active:scale-95 cursor-pointer shadow-md ${
                      isOldStyle
                        ? 'bg-amber-500 hover:bg-amber-400 text-black'
                        : 'bg-[#00E5FF] hover:bg-[#33ebff] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    }`}
                  >
                    Browse Free Assets
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Cart Items List */}
                  <div
                    className={`rounded-2xl border divide-y ${
                      isOldStyle
                        ? 'bg-slate-900 border-amber-500/30 divide-slate-800'
                        : 'bg-[#111a33] border-[#0040FF]/40 divide-gray-800'
                    }`}
                  >
                    {cart.map((item) => {
                      const displayImg =
                        item.product.thumbnail || item.product.thumbnail_1 || item.product.logo;
                      return (
                        <div key={item.product.id} className="p-3 sm:p-4 flex gap-3 sm:gap-4">
                          {/* Thumbnail */}
                          <div className="w-20 h-16 sm:w-24 sm:h-20 bg-black/40 rounded-lg shrink-0 overflow-hidden relative border border-gray-700">
                            {displayImg ? (
                              <img
                                src={displayImg}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-emerald-400 font-bold text-xs">
                                {item.product.fileFormat}
                              </div>
                            )}
                            <span className="absolute bottom-0 right-0 bg-black/80 text-emerald-300 font-black text-[9px] px-1.5 py-0.5 rounded-tl uppercase">
                              {item.product.fileFormat}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white line-clamp-1 text-xs sm:text-sm">
                                {item.product.title}
                              </h4>
                              <button
                                onClick={() => onRemoveItem(item.product.id)}
                                className="text-gray-400 hover:text-red-400 p-1 cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                              <span className="bg-black/40 text-emerald-300 font-semibold px-1.5 py-0.2 rounded text-[10px] border border-emerald-500/20">
                                {item.product.fileFormat}
                              </span>
                              <span>•</span>
                              <span>{item.product.fileSize || 'Instant Asset'}</span>
                              <span>•</span>
                              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                                <Zap className="w-3 h-3 text-emerald-400" /> Free Download
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-2 pt-1">
                              <span className="font-extrabold text-sm sm:text-base text-emerald-400 font-mono flex items-center gap-1">
                                <Gift className="w-3.5 h-3.5" /> 100% FREE
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Box */}
                  <div
                    className={`rounded-2xl border p-4 space-y-3 ${
                      isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/40'
                    }`}
                  >
                    <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800 pb-2 flex items-center justify-between">
                      <span>Access Summary</span>
                      <span className="text-emerald-400 font-bold">100% Free Open Platform</span>
                    </h3>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-gray-300">
                        <span>Items Selected</span>
                        <span>{cart.length} Packages</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Commercial License Fee</span>
                        <span className="text-emerald-400 font-bold">₹0 (FREE)</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>High-Speed Direct CDN</span>
                        <span className="text-emerald-400 font-bold">FREE</span>
                      </div>
                      <div className="border-t border-gray-800 pt-2 flex justify-between font-black text-sm sm:text-base text-white">
                        <span>Total Payable Amount</span>
                        <span className="text-emerald-400 font-bold">₹0.00 (100% FREE)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CUSTOMER INFO */}
          {checkoutStep === 'customer' && (
            <div
              className={`rounded-2xl border p-4 sm:p-6 space-y-4 ${
                isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/40'
              }`}
            >
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Where should we deliver your digital files &amp; keys?</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Instant download links and license keys are delivered immediately and permanently saved to your Apna Bazaar locker.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Delivery Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & DOWNLOADS */}
          {checkoutStep === 'success' && lastPlacedOrder && (
            <div className="space-y-4 animate-in fade-in">
              <div
                className={`p-6 rounded-2xl border text-center space-y-3 ${
                  isOldStyle
                    ? 'bg-slate-900 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                    : 'bg-emerald-950/40 border-emerald-500/50'
                }`}
              >
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-white">100% Free Claim Confirmed!</h3>
                <p className="text-xs text-emerald-300 font-medium">
                  Order ID: <strong className="font-mono">{lastPlacedOrder.id}</strong> • Download files packaged successfully.
                </p>
              </div>

              {/* Items & License Keys */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-gray-300 uppercase tracking-wider">
                  Your Digital Files &amp; License Keys
                </h4>
                {lastPlacedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-black/50 border border-gray-800 rounded-xl p-3.5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-xs sm:text-sm">{item.product.title}</div>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.product.fileFormat}
                      </span>
                    </div>

                    {/* License Key Box */}
                    <div className="bg-slate-900/80 rounded-lg p-2.5 flex items-center justify-between border border-gray-700">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-white font-bold">{item.licenseKey}</span>
                      </div>
                      <button
                        onClick={() => handleCopyKey(item.licenseKey)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedKey === item.licenseKey ? 'Copied!' : 'Copy Key'}</span>
                      </button>
                    </div>

                    {/* Direct Download Button */}
                    <button
                      onClick={() => {
                        triggerDigitalDownload(item.product);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download {item.product.fileFormat} Package</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between gap-3 ${
            isOldStyle ? 'bg-slate-950 border-amber-500/30' : 'bg-[#070b14] border-[#0040FF]/30'
          }`}
        >
          {checkoutStep === 'cart' && cart.length > 0 && (
            <>
              <div className="text-xs">
                <span className="text-gray-400 block">Total Payable:</span>
                <span className="text-emerald-400 font-black text-base font-mono">100% FREE (₹0)</span>
              </div>

              <button
                onClick={() => setCheckoutStep('customer')}
                className={`px-6 py-2.5 text-white font-extrabold text-xs sm:text-sm rounded-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-md ${
                  isOldStyle
                    ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 border border-amber-300'
                    : 'bg-gradient-to-r from-[#0040FF] via-[#1a56ff] to-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                }`}
              >
                <span>Proceed to Claim</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {checkoutStep === 'customer' && (
            <>
              <button
                onClick={() => setCheckoutStep('cart')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-lg cursor-pointer"
              >
                Back to Cart
              </button>

              <button
                onClick={handleClaimFreeItems}
                disabled={isProcessing}
                className={`px-6 py-2.5 text-white font-extrabold text-xs sm:text-sm rounded-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-md ${
                  isOldStyle
                    ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 border border-amber-300'
                    : 'bg-gradient-to-r from-[#0040FF] via-[#1a56ff] to-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isProcessing ? 'Issuing Free Licenses...' : '1-Tap Claim All (100% Free)'}</span>
              </button>
            </>
          )}

          {checkoutStep === 'success' && (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-lg cursor-pointer"
            >
              Done &amp; Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
