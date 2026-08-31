import React, { useState } from 'react';
import {
  X,
  Download,
  KeyRound,
  FileArchive,
  CheckCircle2,
  Calendar,
  Layers,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  Sparkles,
  Truck
} from 'lucide-react';
import { Order } from '../types';
import { triggerDigitalDownload } from '../utils/storage';

interface MyDownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onOpenStore: () => void;
  appStyle?: 'new' | 'old';
}

export const MyDownloadsModal: React.FC<MyDownloadsModalProps> = ({
  isOpen,
  onClose,
  orders,
  onOpenStore,
  appStyle = 'new',
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const isOldStyle = appStyle === 'old';

  const handleCopyKey = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className={`w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
          isOldStyle
            ? 'bg-slate-900 border border-amber-500/40 text-slate-100'
            : 'bg-[#0b1120] border border-[#0040FF]/50 text-white'
        }`}
      >
        {/* Header */}
        <div
          className={`px-4 sm:px-6 py-4 flex items-center justify-between border-b ${
            isOldStyle
              ? 'bg-slate-950 border-amber-500/30'
              : 'bg-[#070b14] border-[#0040FF]/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg flex items-center justify-center ${
                isOldStyle
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-[#0040FF] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
              }`}
            >
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                <span>My Downloads &amp; Digital Locker</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  {orders.reduce((acc, o) => acc + (o.items?.length || 0), 0)} Delivered
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Permanent access to your claimed software, applications, license keys &amp; source code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders / Downloads Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          {orders.length === 0 ? (
            <div
              className={`text-center py-12 space-y-3 rounded-xl border p-6 ${
                isOldStyle
                  ? 'bg-slate-950/50 border-slate-800'
                  : 'bg-[#070b14]/50 border-gray-800'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                  isOldStyle
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-[#0040FF]/20 text-[#00E5FF] border border-[#00E5FF]/30'
                }`}
              >
                <FileArchive className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-white">No Digital Downloads Yet</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                When you claim or download any digital product or app from the marketplace, your instant delivery records, download files, and license keys will appear here.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenStore();
                }}
                className={`mt-2 font-bold px-6 py-2 rounded text-xs shadow-lg cursor-pointer transition-all ${
                  isOldStyle
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                    : 'bg-[#00E5FF] hover:bg-[#33ebff] text-black shadow-[#00E5FF]/20'
                }`}
              >
                Explore Marketplace Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`border rounded-xl p-4 space-y-3 shadow-lg ${
                    isOldStyle
                      ? 'bg-slate-950 border-slate-800'
                      : 'bg-[#070b14] border-[#0040FF]/30'
                  }`}
                >
                  <div className="flex flex-wrap justify-between items-center border-b border-gray-800 pb-2 text-xs text-gray-400 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">Order #{order.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {order.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% Free Claim Completed • Delivered
                      </span>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="space-y-2.5">
                    {order.items.map((item, idx) => {
                      const img = item.product.thumbnail || item.product.thumbnail_1 || item.product.logo;
                      return (
                        <div
                          key={idx}
                          className={`border rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                            isOldStyle
                              ? 'bg-slate-900 border-slate-800'
                              : 'bg-[#111a33] border-[#0040FF]/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 max-w-full sm:max-w-[70%]">
                            {img ? (
                              <img
                                src={img}
                                alt={item.product.title}
                                className="w-12 h-12 rounded object-cover border border-[#0040FF]/50 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded bg-[#070b14] border border-[#0040FF]/50 flex items-center justify-center text-[#00E5FF] font-bold shrink-0">
                                {item.product.fileFormat}
                              </div>
                            )}

                            <div className="space-y-1 truncate">
                              <h4 className="font-bold text-white text-sm truncate">{item.product.title}</h4>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-mono">
                                <span className="bg-[#0040FF]/30 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                                  {item.product.fileFormat}
                                </span>
                                <span>Size: {item.product.fileSize || 'Standard Asset'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 pt-0.5 font-mono text-[11px]">
                                <KeyRound className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="text-gray-400">License Key:</span>
                                <span className="bg-[#070b14] text-white px-2 py-0.5 rounded select-all font-bold border border-gray-700">
                                  {item.licenseKey}
                                </span>
                                <button
                                  onClick={() => handleCopyKey(item.licenseKey)}
                                  className="text-gray-400 hover:text-white p-1 cursor-pointer"
                                  title="Copy License Key"
                                >
                                  {copiedKey === item.licenseKey ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => triggerDigitalDownload(item.product, item.licenseKey)}
                            className={`flex items-center gap-1.5 font-extrabold text-xs px-4 py-2.5 rounded shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0 w-full sm:w-auto justify-center ${
                              isOldStyle
                                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                                : 'bg-[#00E5FF] hover:bg-[#33ebff] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                            }`}
                          >
                            <Download className="w-4 h-4" />
                            <span>Download {item.product.fileFormat || 'Asset'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`border-t px-4 sm:px-6 py-3 flex items-center justify-between text-xs ${
            isOldStyle
              ? 'bg-slate-950 border-slate-800 text-slate-400'
              : 'bg-[#070b14] border-[#0040FF]/30 text-gray-400'
          }`}
        >
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Lifetime re-download access &amp; authentic verification guaranteed</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
