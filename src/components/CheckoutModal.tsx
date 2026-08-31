import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  Lock,
  Download,
  CheckCircle2,
  Gift,
  Smartphone,
  User,
  Phone,
  Mail,
  Copy,
  Check,
  FileArchive,
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { CartItem, DigitalProduct, Order, OrderItem, UserProfile } from '../types';
import { triggerDigitalDownload, addOrderToStorage } from '../utils/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user: UserProfile | null;
  appStyle?: 'new' | 'old';
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  user,
  appStyle = 'new',
  onOrderSuccess,
}) => {
  const [buyerName, setBuyerName] = useState(user?.displayName || 'Abhinav Dutta');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || 'abhinabgoodboy@gmail.com');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isOldStyle = appStyle === 'old';

  if (!isOpen || items.length === 0) return null;

  const handleClaimFreeItems = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date().toISOString();
      const orderId = 'ORD-' + Date.now().toString().slice(-6);

      const orderItems: OrderItem[] = items.map((i) => ({
        product: i.product,
        license: i.selectedLicense,
        price: 0,
        licenseKey:
          'APNA-' +
          Math.random().toString(36).substring(2, 6).toUpperCase() +
          '-' +
          Math.random().toString(36).substring(2, 6).toUpperCase(),
        downloadUrl: i.product.fileName || `${i.product.title.toLowerCase().replace(/\s+/g, '-')}.${i.product.fileFormat.toLowerCase()}`,
      }));

      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        createdAt: now,
        customerEmail: buyerEmail.trim(),
        customerName: buyerName.trim(),
        paymentMethod: '100% Free Open Claim',
        transactionId: `TXN-FREE-${Date.now()}`,
        items: orderItems,
        totalAmount: 0,
        totalSavings: 0,
      };

      addOrderToStorage(newOrder);
      setCompletedOrder(newOrder);
      setIsProcessing(false);
      onOrderSuccess(newOrder);

      // Trigger instant digital file download for the first item
      if (items[0]?.product) {
        triggerDigitalDownload(items[0].product);
      }
    }, 600);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className={`w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
          isOldStyle
            ? 'bg-slate-900 border-2 border-amber-500/70 text-slate-100 shadow-[0_0_50px_rgba(245,158,11,0.3)]'
            : 'bg-[#0b1120] border border-[#0040FF]/60 text-gray-200 shadow-[0_0_50px_rgba(0,64,255,0.3)]'
        }`}
      >
        {/* SUCCESS COMPLETED SCREEN */}
        {completedOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(52,211,153,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">100% Free Claim Confirmed!</h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Order ID: <strong className="font-mono text-emerald-400">{completedOrder.id}</strong> • Digital Assets Ready
              </p>
            </div>

            {/* Purchased Items & Instant Download List */}
            <div
              className={`border rounded-xl p-4 space-y-3 text-left ${
                isOldStyle ? 'bg-slate-950 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/40'
              }`}
            >
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Your Free Digital Deliverables &amp; Licenses:
              </span>

              {completedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-black/50 border border-gray-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-xs sm:text-sm">{item.product.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <span className="bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded text-[10px]">
                        {item.product.fileFormat}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-white font-semibold flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-emerald-400" />
                        {item.licenseKey}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyKey(item.licenseKey)}
                      className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 rounded transition-colors cursor-pointer"
                    >
                      {copiedKey === item.licenseKey ? 'Copied!' : 'Copy Key'}
                    </button>

                    <button
                      onClick={() => {
                        triggerDigitalDownload(item.product);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-extrabold text-sm rounded-lg transition-colors cursor-pointer"
            >
              Done &amp; Close
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div
              className={`px-4 sm:px-6 py-4 flex items-center justify-between border-b ${
                isOldStyle
                  ? 'bg-gradient-to-r from-orange-600 via-amber-700 to-slate-900 text-white border-amber-400/40'
                  : 'bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#0b1120] text-white border-[#00E5FF]/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base sm:text-lg">
                  {isOldStyle ? '1-क्लिक मुफ़्त डाउनलोड (1-Tap Free Claim)' : '1-Tap Instant Free Claim'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Claim Form */}
            <form onSubmit={handleClaimFreeItems} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              {/* Product Summary */}
              <div
                className={`p-3.5 rounded-xl border space-y-2 ${
                  isOldStyle ? 'bg-slate-950 border-amber-500/30' : 'bg-[#111a33] border-[#0040FF]/30'
                }`}
              >
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Items to Claim ({items.length})
                </span>
                {items.map((it) => (
                  <div key={it.product.id} className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white line-clamp-1">{it.product.title}</span>
                    <span className="text-emerald-400 font-bold font-mono">100% FREE</span>
                  </div>
                ))}
              </div>

              {/* Delivery Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Delivery Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Free Open Access Guarantee */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span>Zero Cost • Free Open Community License</span>
                </div>
                <p className="text-[11px] text-gray-300">
                  Instant binary delivery directly to your browser with permanent access in your Apna Bazaar locker.
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 text-white font-extrabold text-sm rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-md ${
                  isOldStyle
                    ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 border border-amber-300'
                    : 'bg-gradient-to-r from-[#0040FF] via-[#1a56ff] to-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>
                  {isProcessing ? 'Claiming & Packaging Assets...' : 'Confirm 1-Tap Free Claim'}
                </span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
