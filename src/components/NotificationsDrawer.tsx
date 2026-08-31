import React from 'react';
import {
  X,
  Bell,
  ShieldCheck,
  Package,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { MarketplaceNotification } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: MarketplaceNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: MarketplaceNotification) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: MarketplaceNotification['type']) => {
    switch (type) {
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />;
      case 'order':
        return <Package className="w-4 h-4 text-emerald-400" />;
      case 'payout':
        return <TrendingUp className="w-4 h-4 text-[#00E5FF]" />;
      case 'deployment':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-[#00E5FF]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0b1120] border-l border-[#0040FF]/50 shadow-[0_0_50px_rgba(0,64,255,0.3)] h-full flex flex-col justify-between text-gray-200 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#0b1120] border-b border-[#00E5FF]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base text-white">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-[#00E5FF] text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-[0_0_8px_#00E5FF]">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-200">
                Security audits, deployment updates &amp; payout receipts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="px-4 py-2 bg-[#070b14] border-b border-[#0040FF]/20 flex items-center justify-between text-xs">
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className={`font-semibold transition-colors ${
              unreadCount > 0
                ? 'text-[#00E5FF] hover:underline cursor-pointer'
                : 'text-gray-500 cursor-not-allowed'
            }`}
          >
            Mark all as read
          </button>

          <button
            onClick={onClearAll}
            disabled={notifications.length === 0}
            className={`flex items-center gap-1 font-semibold transition-colors ${
              notifications.length > 0
                ? 'text-red-400 hover:text-red-300 cursor-pointer'
                : 'text-gray-500 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear list</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-gray-400">
              <div className="w-14 h-14 rounded-full bg-[#111a33] border border-[#0040FF]/40 flex items-center justify-center text-gray-500">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-200">No New Notifications</h3>
                <p className="text-xs text-gray-400 max-w-xs mt-1">
                  You're completely up to date! Real-time alerts for sales, virus scans, and downloads will appear here.
                </p>
              </div>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onNotificationClick && onNotificationClick(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-[#0d1424] border-gray-800 text-gray-300 hover:border-[#0040FF]/40'
                    : 'bg-[#111a33] border-[#0040FF]/60 shadow-[0_0_15px_rgba(0,64,255,0.15)] text-white hover:border-[#00E5FF]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#070b14] rounded-lg border border-white/10 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs text-white truncate">
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#00E5FF]" />
                        {item.timestamp}
                      </span>
                      <span className="uppercase text-[9px] font-bold text-[#00E5FF]">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-[#070b14] border-t border-[#0040FF]/30 text-center text-[11px] text-gray-400 font-mono">
          <span>Apna Bazaar • Live Real-Time Security Feed</span>
        </div>

      </div>
    </div>
  );
};
