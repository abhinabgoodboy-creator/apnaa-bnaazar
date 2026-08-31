import React from 'react';
import {
  X,
  Package,
  Download,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Layers,
  Phone,
  FileArchive,
  KeyRound
} from 'lucide-react';
import { Order, OrderItem, DigitalProduct } from '../types';
import { triggerDigitalDownload } from '../utils/storage';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#0b1120] border border-[#0040FF]/60 rounded-xl shadow-[0_0_50px_rgba(0,64,255,0.3)] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-gray-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#0b1120] text-white px-5 py-4 flex items-center justify-between border-b border-[#00E5FF]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-white">
                My Free Claims &amp; Digital Deliverables
              </h2>
              <p className="text-xs text-blue-200">
                Lifetime instant access to your claimed source code, APKs, assets, and licenses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[75vh] space-y-4">
          {orders.length === 0 ? (
            <div className="bg-[#111a33] border border-[#0040FF]/30 rounded-xl p-8 text-center space-y-3">
              <Package className="w-12 h-12 text-gray-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Claimed Items Yet</h3>
              <p className="text-xs text-gray-400">
                You haven't claimed any free digital products yet. Browse our catalog and grab templates, apps, or source code for 100% free!
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#111a33] border border-[#0040FF]/40 rounded-xl p-4 sm:p-5 space-y-4 shadow-[0_0_15px_rgba(0,64,255,0.1)]"
              >
                {/* Order Top Line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-3 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Order #{order.id}</span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Completed (100% Free)
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Recent')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">
                      FREE
                    </span>
                    <span className="text-[10px] text-gray-400 block font-mono">
                      {order.paymentMethod || '100% Free Open Claim'}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => {
                    const img = item.product.thumbnail || item.product.thumbnail_1 || item.product.logo;
                    return (
                      <div
                        key={idx}
                        className="bg-[#070b14] border border-gray-800 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {img ? (
                            <img
                              src={img}
                              alt={item.product.title}
                              className="w-12 h-12 rounded object-cover border border-[#0040FF]/50 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-[#111a33] border border-[#0040FF]/50 flex items-center justify-center text-[#00E5FF] font-bold shrink-0">
                              {item.product.fileFormat}
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="font-bold text-sm text-white">{item.product.title}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-2 flex-wrap font-mono">
                              <span className="bg-[#0040FF]/30 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                                {item.product.fileFormat}
                              </span>
                              <span>Size: {item.product.fileSize}</span>
                            </div>
                            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                              <KeyRound className="w-3 h-3 text-emerald-400" />
                              <span>Key: <strong>{item.licenseKey}</strong></span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => triggerDigitalDownload(item.product)}
                          className="px-4 py-2 bg-[#00E5FF] hover:bg-[#33ebff] text-black font-extrabold text-xs rounded shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download {item.product.fileFormat}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
