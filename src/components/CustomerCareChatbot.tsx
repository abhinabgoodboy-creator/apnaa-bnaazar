import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Zap,
  HelpCircle,
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileCode2,
  RefreshCw,
  Gift,
  Palette,
  AlertCircle
} from 'lucide-react';
import { UserProfile, SellerProfile, Order, CartItem, MarketplaceSettings } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionType?: 'seller_hub' | 'downloads' | 'upload' | 'settings' | 'style_toggle';
  actionLabel?: string;
  quickFollowUps?: string[];
}

interface SmartReplyItem {
  id: string;
  label: string;
  query: string;
  icon?: string;
  badge?: string;
  priority?: number;
}

interface CustomerCareChatbotProps {
  user?: UserProfile | null;
  orders?: Order[];
  cart?: CartItem[];
  seller?: SellerProfile | null;
  settings?: MarketplaceSettings;
  onUpdateSettings?: (settings: MarketplaceSettings) => void;
  appStyle?: 'new' | 'old';
  onToggleAppStyle?: () => void;
  onOpenSellerHub?: () => void;
  onOpenSellerOnboarding?: () => void;
  onOpenDownloads?: () => void;
  onOpenUpload?: () => void;
  onOpenSettings?: () => void;
}

// Pre-compiled fast responses for direct standard 1-tap smart inquiries
const INSTANT_KB: Array<{
  exactQueries: string[];
  reply: string;
  actionType?: 'seller_hub' | 'downloads' | 'upload' | 'settings' | 'style_toggle';
  actionLabel?: string;
  quickFollowUps: string[];
}> = [
  {
    exactQueries: ['where is my order?', 'where is my order', 'where is my download', 'track order', 'find my order'],
    reply: "📦 **Where is My Order & Downloads?**:\nAll acquired items and verified license keys are immediately accessible in your **'My Orders & Downloads'** digital vault.\n\n• Instant 1-click binary re-downloads (APK, ZIP, PDF, FIG)\n• Cryptographic license keys permanently saved\n• Works even offline once downloaded!",
    actionType: 'downloads',
    actionLabel: 'Open My Orders & Downloads Locker',
    quickFollowUps: ['Download issues', 'How to verify license?', 'Is everything 100% Free?'],
  },
  {
    exactQueries: ['refund policy?', 'refund policy', 'refund', 'money back', 'cancel order', 'return item'],
    reply: "📄 **100% Free Open Access & Guarantee**:\n• **Zero Cost**: All digital downloads on Apna Bazaar are **100% Free** with no credit card required!\n• If any asset or APK package fails to open or is corrupt, you can re-download it anytime from your Locker or troubleshoot right here in this chat.",
    actionType: 'downloads',
    actionLabel: 'Open Download Locker',
    quickFollowUps: ['Download issues', 'Apna Assured safety', 'Where is my order?'],
  },
  {
    exactQueries: ['download issues', 'download issues?', 'cannot download', 'download failed', 'error downloading', 'corrupt file', 'cant open apk', 'apk install issue'],
    reply: "🛠️ **Troubleshooting Download Issues**:\n1. **Format Check**: Ensure you open the matching format (e.g. Install APKs on Android with 'Unknown Sources' allowed, extract ZIPs with WinRAR/7-Zip).\n2. **Browser Permissions**: Disable aggressive popup blockers that may block immediate file triggers.\n3. **My Downloads Locker**: Re-download the asset directly from your Account Downloads anytime.",
    actionType: 'downloads',
    actionLabel: 'Re-download from My Downloads',
    quickFollowUps: ['Where is my order?', 'Apna Assured details', 'How to install APK?'],
  },
  {
    exactQueries: ['is everything 100% free?', 'why is everything 100% free on apna bazaar?', 'free', 'why free', 'pricing', 'cost', 'charge', 'hidden fee', 'zero rupee'],
    reply: "🎁 **100% Free Digital Marketplace**:\nApna Bazaar is dedicated to open digital empowerment! Every single product—whether an Android APK, React Native codebase, Figma UI kit, or Technical E-Book—can be acquired and downloaded for **₹0 (Free)**.\n\nEnjoy unlimited downloads and perpetual community & commercial licenses!",
    actionType: 'downloads',
    actionLabel: 'Explore 100% Free Catalog',
    quickFollowUps: ['Where is my order?', 'How to become a seller?', 'Apna Assured safety'],
  },
  {
    exactQueries: ['how do i use the old classic style?', 'how do i use the new cyber style?', 'old style', 'new style', 'theme', 'switch style', 'classic bazaar', 'cyber style', 'change look', 'design'],
    reply: "🎨 **Classic vs Cyber Style Modes**:\nApna Bazaar features two unique design experiences:\n• **New Apna Bazaar (Default)**: Sleek Cyber-Tech Dark UI with glowing cyan accents.\n• **Old Apna Bazaar**: Traditional Indian Digital Mandi layout with warm saffron, tricolor accents, and classic card aesthetic.\n\nYou can switch styles anytime in **Settings** or using the top bar toggle!",
    actionType: 'settings',
    actionLabel: 'Customize Theme & Style in Settings',
    quickFollowUps: ['Switch Theme Now', 'Where is my order?', 'Download issues'],
  },
  {
    exactQueries: ['how to become a seller?', 'how to become a seller', 'seller', 'start selling', 'become seller', 'upload for free', 'sell app'],
    reply: "🚀 **How to Publish & Sell on Apna Bazaar**:\n1. Click **'Become a Seller'** in the top navbar.\n2. Complete your creator profile verification.\n3. Upload your APK, ZIP bundle, PDF guide, or Figma kit for free.\n\nShare your creations with the entire Apna Bazaar developer community!",
    actionType: 'seller_hub',
    actionLabel: 'Open Seller Hub',
    quickFollowUps: ['What file formats are supported?', 'Review time for new upload', 'Apna Assured safety'],
  },
  {
    exactQueries: ['apna assured details', 'apna assured safety', 'assured', 'virus', 'safe', 'security', 'malware', 'clean', 'scanned', 'trojan'],
    reply: "🛡️ **Apna Assured Security Guarantee**:\nEvery package uploaded to Apna Bazaar is run through an automated 64-engine virus inspection, SHA-256 hash checksum verification, and manual sandboxing to ensure zero trojans or malicious code.",
    quickFollowUps: ['Download issues', 'Where is my order?', 'Is everything 100% Free?'],
  },
  {
    exactQueries: ['license options', 'license', 'single', 'multi', 'commercial', 'extended'],
    reply: "📜 **License Options on Apna Bazaar**:\n• **Personal License**: For individual learning and 1 personal project.\n• **Commercial License**: Free for client builds and production releases.\n• **Extended Commercial**: Full uncompiled source code rights for unlimited redistribution.",
    actionType: 'downloads',
    actionLabel: 'View License in Downloads Locker',
    quickFollowUps: ['Where is my order?', 'Download issues', 'Is everything 100% Free?'],
  }
];

// Instant 0ms Client-Side Semantic Resolver
function resolveClientSideInstant(
  lowerQuery: string,
  context: {
    orders: Order[];
    cart: CartItem[];
    seller: SellerProfile | null | undefined;
    user: UserProfile | null | undefined;
    isOldStyle: boolean;
  }
): {
  reply: string;
  actionType?: 'seller_hub' | 'downloads' | 'upload' | 'settings' | 'style_toggle';
  actionLabel?: string;
  quickFollowUps: string[];
} | null {
  // Exact match from instant KB
  const matchedKb = INSTANT_KB.find((item) =>
    item.exactQueries.some((eq) => lowerQuery === eq || lowerQuery === eq + '?' || lowerQuery.trim() === eq)
  );

  if (matchedKb) {
    let reply = matchedKb.reply;
    if ((lowerQuery.includes('where is my order') || lowerQuery.includes('my order') || lowerQuery.includes('find my order')) && context.orders.length > 0) {
      const latest = context.orders[0];
      const titles = latest.items.map((i) => `• ${i.product.title} (${i.product.fileFormat})`).join('\n');
      reply = `📦 **You have ${context.orders.length} order(s) in your account**:\n\n**Latest Order (${latest.id})**:\n${titles}\n\nAll files & cryptographic license keys are stored in your **'My Orders & Downloads'** locker!`;
    }
    return {
      reply,
      actionType: matchedKb.actionType,
      actionLabel: matchedKb.actionLabel,
      quickFollowUps: matchedKb.quickFollowUps,
    };
  }

  // Natural Language Fast Patterns (<1ms)
  // 1. Greetings
  if (lowerQuery === 'hi' || lowerQuery === 'hello' || lowerQuery === 'hey' || lowerQuery.startsWith('namaste') || lowerQuery === 'yo') {
    return {
      reply: `Namaste${context.user ? ' ' + context.user.displayName : ''}! Welcome to Apna Bazaar 24/7 In-App Support. How can I help you with your free software downloads or creator uploads today?`,
      actionType: 'downloads',
      actionLabel: 'Explore Free Catalog & Downloads',
      quickFollowUps: ['Where is my order?', 'How to install APK?', 'Is everything 100% Free?', 'Become a Seller'],
    };
  }

  // 2. Order / Downloads / Locker
  if (lowerQuery.includes('order') || lowerQuery.includes('download') || lowerQuery.includes('locker') || lowerQuery.includes('purchased') || lowerQuery.includes('claimed')) {
    let replyText = "📦 **My Orders & Downloads**:\nEvery digital asset you claim is available forever in your account's **'My Orders & Downloads'** section.";
    if (context.orders.length > 0) {
      replyText += `\n\nYou currently have **${context.orders.length} claimed asset(s)** ready for instant download.`;
    } else {
      replyText += "\nYou haven't claimed any free items yet. Browse our catalog and click 'Claim & Download Free' on any product!";
    }
    return {
      reply: replyText,
      actionType: 'downloads',
      actionLabel: 'Open My Orders & Downloads Locker',
      quickFollowUps: ['How to install APK?', 'Apna Assured safety', 'Download issues'],
    };
  }

  // 3. APK Installation & Unknown Sources
  if (lowerQuery.includes('apk') || lowerQuery.includes('android') || lowerQuery.includes('unknown sources') || lowerQuery.includes('install')) {
    return {
      reply: "📱 **Android APK Installation Guide**:\n1. Download the verified APK file from your Downloads Locker.\n2. Open your Android notification bar or Downloads folder.\n3. If your phone asks for permission, enable **'Allow from this source'**.\n4. Click **Install**.\n\n🛡️ All APKs on Apna Bazaar are pre-scanned by 64 security engines!",
      actionType: 'downloads',
      actionLabel: 'Open My Downloads to get APK',
      quickFollowUps: ['Apna Assured details', 'Download issues', 'Where is my order?'],
    };
  }

  // 4. Seller & Publishing
  if (lowerQuery.includes('seller') || lowerQuery.includes('publish') || lowerQuery.includes('upload') || lowerQuery.includes('creator') || lowerQuery.includes('monetize') || lowerQuery.includes('earning')) {
    return {
      reply: "🚀 **Apna Bazaar Creator Hub**:\n• You can publish software, APKs, UI kits, and templates for free.\n• Each uploaded item undergoes automated virus checks and SHA-256 verification.\n• Track total downloads and manage your live listings directly in the Seller Hub!",
      actionType: 'seller_hub',
      actionLabel: 'Open Seller Hub',
      quickFollowUps: ['What file formats are supported?', 'Is everything 100% Free?', 'Apna Assured safety'],
    };
  }

  // 5. Themes & Design Mode
  if (lowerQuery.includes('theme') || lowerQuery.includes('style') || lowerQuery.includes('mandi') || lowerQuery.includes('cyber') || lowerQuery.includes('dark') || lowerQuery.includes('light') || lowerQuery.includes('color')) {
    return {
      reply: "🎨 **Theme & Design Styles**:\n• **Cyber Tech Dark (New)**: Futuristic neon cyber theme (Default).\n• **Classic Indian Mandi (Old)**: Traditional saffron & tricolor marketplace layout.\n\nYou can switch themes anytime in Settings or using the top navigation palette icon!",
      actionType: 'settings',
      actionLabel: 'Open Theme Settings',
      quickFollowUps: ['Switch Theme Now', 'Where is my order?', 'Is everything 100% Free?'],
    };
  }

  // 6. Security / Virus / Safety
  if (lowerQuery.includes('virus') || lowerQuery.includes('safe') || lowerQuery.includes('malware') || lowerQuery.includes('security') || lowerQuery.includes('clean') || lowerQuery.includes('trojan')) {
    return {
      reply: "🛡️ **Apna Assured Zero-Malware Guarantee**:\nEvery package uploaded to Apna Bazaar is verified via:\n• Automated 64-engine antimalware inspection\n• SHA-256 cryptographic checksum matching\n• File header and executable sandbox validation.",
      quickFollowUps: ['How to install APK?', 'Where is my order?', 'Is everything 100% Free?'],
    };
  }

  // 7. Pricing & Free Access
  if (lowerQuery.includes('free') || lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('charge') || lowerQuery.includes('money') || lowerQuery.includes('payment') || lowerQuery.includes('card')) {
    return {
      reply: "🎁 **100% Free Digital Marketplace**:\nApna Bazaar is completely ₹0 (Free)! No payment cards, subscription fees, or hidden charges. All software packages, APKs, Figma files, and code repositories are available with free community and commercial licenses.",
      actionType: 'downloads',
      actionLabel: 'Browse 100% Free Catalog',
      quickFollowUps: ['Where is my order?', 'How to install APK?', 'Become a Seller'],
    };
  }

  return null;
}

export const CustomerCareChatbot: React.FC<CustomerCareChatbotProps> = ({
  user,
  orders = [],
  cart = [],
  seller,
  appStyle = 'new',
  onToggleAppStyle,
  onOpenSellerHub,
  onOpenSellerOnboarding,
  onOpenDownloads,
  onOpenUpload,
  onOpenSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isOldStyle = appStyle === 'old';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Namaste! Welcome to Apna Bazaar 24/7 Support. ⚡\nAll digital assets are 100% Free! Tap any Smart Reply below or ask your question:',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickFollowUps: [
        'Where is my order?',
        'Refund policy?',
        'Download issues',
        'Is everything 100% Free?'
      ]
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Context-Aware Smart Replies Generator
  const smartReplies: SmartReplyItem[] = useMemo(() => {
    const list: SmartReplyItem[] = [];

    // Order & Download Context
    if (orders.length > 0) {
      list.push({
        id: 'sr-where-order',
        label: `📦 Where is my order? (${orders.length} order${orders.length > 1 ? 's' : ''})`,
        query: 'Where is my order?',
        badge: 'Recent Order',
        priority: 1,
      });
      list.push({
        id: 'sr-download-issues',
        label: '🛠️ Download issues?',
        query: 'Download issues',
        priority: 2,
      });
    } else {
      list.push({
        id: 'sr-where-order-gen',
        label: '📦 Where is my order?',
        query: 'Where is my order?',
        priority: 1,
      });
      list.push({
        id: 'sr-download-issues-gen',
        label: '🛠️ Download issues',
        query: 'Download issues',
        priority: 2,
      });
    }

    // Cart Context
    if (cart.length > 0) {
      list.push({
        id: 'sr-cart-free',
        label: `🛒 Are my ${cart.length} cart items 100% Free?`,
        query: 'Are all items in my cart 100% Free?',
        badge: `${cart.length} in Cart`,
        priority: 3,
      });
    }

    // Seller Context
    if (seller) {
      list.push({
        id: 'sr-seller-store',
        label: `💼 Seller Store: ${seller.businessName}`,
        query: 'How to manage my seller uploads and review status?',
        badge: 'Creator',
        priority: 4,
      });
    } else {
      list.push({
        id: 'sr-become-seller',
        label: '🚀 How to publish/sell for Free?',
        query: 'How to become a seller?',
        priority: 4,
      });
    }

    // Universal core options requested
    list.push({
      id: 'sr-refund',
      label: '📄 Refund policy?',
      query: 'Refund policy?',
      priority: 5,
    });

    list.push({
      id: 'sr-free-inquiry',
      label: '🎁 Is everything 100% Free?',
      query: 'Why is everything 100% Free on Apna Bazaar?',
      priority: 6,
    });

    list.push({
      id: 'sr-style',
      label: isOldStyle ? '⚡ Switch to New Cyber Style' : '🏛️ Switch to Old Classic Bazaar Style',
      query: isOldStyle ? 'How do I use the New Cyber Style?' : 'How do I use the Old Classic Style?',
      priority: 7,
    });

    return list.sort((a, b) => (a.priority || 10) - (b.priority || 10));
  }, [orders, cart, seller, isOldStyle]);

  // Intelligent Answer Resolution
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    const lower = text.toLowerCase().trim();

    // 1. ULTRA-FAST INSTANT RESOLVER: Client-side dynamic response engine (<10ms)
    const instantResponse = resolveClientSideInstant(lower, {
      orders,
      cart,
      seller,
      user,
      isOldStyle,
    });

    if (instantResponse) {
      const botMsg: ChatMessage = {
        id: 'bot-inst-' + Date.now(),
        sender: 'assistant',
        text: instantResponse.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: instantResponse.actionType,
        actionLabel: instantResponse.actionLabel,
        quickFollowUps: instantResponse.quickFollowUps,
      };
      setMessages((prev) => [...prev, botMsg]);
      return;
    }

    // 2. SERVER DYNAMIC RESOLVER: For deep custom, multi-turn, or unique queries (with fast Gemini)
    setIsLoading(true);
    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/customer-care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: historyPayload,
          userContext: {
            isLoggedIn: Boolean(user),
            displayName: user?.displayName,
            ordersCount: orders.length,
            isSeller: Boolean(seller),
            appStyle,
          }
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'All digital downloads on Apna Bazaar are 100% Free! You can access all your software and APKs in "My Orders & Downloads" or ask me any question.';

      let actionType: ChatMessage['actionType'] = undefined;
      let actionLabel: string | undefined = undefined;

      if (lower.includes('order') || lower.includes('download') || lower.includes('apk')) {
        actionType = 'downloads';
        actionLabel = 'Open My Downloads Locker';
      } else if (lower.includes('seller') || lower.includes('upload') || lower.includes('publish')) {
        actionType = 'seller_hub';
        actionLabel = 'Open Seller Hub';
      } else if (lower.includes('style') || lower.includes('theme') || lower.includes('mandi') || lower.includes('cyber')) {
        actionType = 'settings';
        actionLabel = 'Open Theme Settings';
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType,
        actionLabel,
        quickFollowUps: data.quickFollowUps || [
          'Where is my order?',
          'Download issues',
          'Become a Seller',
          'Is everything 100% Free?'
        ],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'assistant',
        text: 'Apna Bazaar is 100% Free! All software, APKs, and codebundles are ready for instant download in your "My Orders & Downloads" locker.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: 'downloads',
        actionLabel: 'Open Downloads Locker',
        quickFollowUps: ['Where is my order?', 'Download issues', 'Become a Seller']
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (actionType?: string) => {
    if (actionType === 'seller_hub') {
      setIsOpen(false);
      if (onOpenSellerHub) onOpenSellerHub();
      else if (onOpenSellerOnboarding) onOpenSellerOnboarding();
    } else if (actionType === 'downloads') {
      setIsOpen(false);
      if (onOpenDownloads) onOpenDownloads();
    } else if (actionType === 'upload') {
      setIsOpen(false);
      if (onOpenUpload) onOpenUpload();
    } else if (actionType === 'settings') {
      setIsOpen(false);
      if (onOpenSettings) onOpenSettings();
    } else if (actionType === 'style_toggle') {
      if (onToggleAppStyle) onToggleAppStyle();
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`relative flex items-center gap-2.5 px-4 py-3 text-white font-extrabold rounded-full transition-all transform hover:scale-105 active:scale-95 cursor-pointer group shadow-xl ${
            isOldStyle
              ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 border-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
              : 'bg-gradient-to-r from-[#0040FF] via-[#1a56ff] to-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_30px_rgba(0,229,255,0.4)]'
          }`}
          id="open-customer-care-chat-btn"
          aria-label="Open 24/7 Smart Customer Support"
        >
          <div className="relative">
            <Bot className={`w-5 h-5 ${isOldStyle ? 'text-amber-100' : 'text-white drop-shadow-[0_0_8px_#00E5FF]'}`} />
            <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping ${isOldStyle ? 'bg-amber-300' : 'bg-[#00E5FF]'}`} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-black tracking-wide leading-tight">
              {isOldStyle ? 'अपना सहायता (Support)' : 'Apna AI Support'}
            </span>
            <span className="text-[10px] text-amber-200/90 font-medium">100% Free In-App Help &amp; Smart Replies</span>
          </div>
          <span className="bg-black/50 text-white border border-white/20 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 fill-amber-300 text-amber-300" /> 24/7
          </span>
        </button>
      )}

      {/* Open Chat Widget Window */}
      {isOpen && (
        <div
          className={`w-[94vw] sm:w-[430px] h-[580px] rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
            isOldStyle
              ? 'bg-[#1e293b] border-2 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-slate-100'
              : 'bg-[#0b1120] border border-[#0040FF]/60 shadow-[0_0_50px_rgba(0,64,255,0.35)] text-gray-200'
          }`}
        >
          {/* Widget Header */}
          <div
            className={`p-3.5 sm:p-4 flex items-center justify-between border-b ${
              isOldStyle
                ? 'bg-gradient-to-r from-orange-600 via-amber-700 to-slate-900 border-amber-400/40 text-white'
                : 'bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#0b1120] border-[#00E5FF]/30 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`relative p-2 rounded-xl shadow-md ${
                  isOldStyle
                    ? 'bg-amber-500/30 border border-amber-300 text-amber-200'
                    : 'bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                }`}
              >
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-black rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">
                    {isOldStyle ? 'अपना बाज़ार ग्राहक सेवा' : 'Apna Care AI'}
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Gift className="w-2.5 h-2.5 text-emerald-300" /> 100% Free
                  </span>
                </div>
                <p className="text-[11px] text-amber-100/80">
                  Instant In-App Care • 100% Free Resolution
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onToggleAppStyle && (
                <button
                  onClick={onToggleAppStyle}
                  title={`Switch to ${isOldStyle ? 'New Cyber' : 'Old Classic'} Style`}
                  className="p-1.5 text-amber-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors text-[10px] font-bold flex items-center gap-1 bg-white/5 border border-white/10 cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isOldStyle ? '⚡ Cyber' : '🏛️ Classic'}</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Context-Aware Smart Replies Hero Strip */}
          <div
            className={`px-3 py-2 border-b flex flex-col gap-1.5 ${
              isOldStyle
                ? 'bg-slate-900/90 border-amber-500/30 text-amber-200'
                : 'bg-[#070b14] border-[#0040FF]/30 text-blue-200'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3 h-3 fill-emerald-400" />
                Context Smart Replies (1-Tap):
              </span>
              <span className="text-[9px] text-gray-400 font-mono">
                {orders.length > 0 ? `${orders.length} Order(s) Logged` : 'Instant Answers'}
              </span>
            </div>

            {/* Smart Reply Suggestions Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {smartReplies.map((sr) => (
                <button
                  key={sr.id}
                  onClick={() => handleSendMessage(sr.query)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                    isOldStyle
                      ? 'bg-amber-950/80 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-500/50'
                      : 'bg-[#111a33] hover:bg-[#0040FF] text-gray-200 hover:text-white border border-[#0040FF]/60 hover:border-[#00E5FF]'
                  }`}
                >
                  <span>{sr.label}</span>
                  {sr.badge && (
                    <span className="text-[8px] bg-emerald-500/30 text-emerald-300 px-1 rounded uppercase font-mono">
                      {sr.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Body */}
          <div
            className={`flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs ${
              isOldStyle ? 'bg-slate-950/95' : 'bg-[#070b14]/95'
            }`}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1.5 ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[88%] ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'assistant' && (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                        isOldStyle
                          ? 'bg-amber-600/30 border border-amber-400 text-amber-300'
                          : 'bg-[#0040FF]/40 border border-[#00E5FF]/50 text-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.3)]'
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed space-y-2 ${
                      msg.sender === 'user'
                        ? isOldStyle
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-none shadow-md'
                          : 'bg-gradient-to-r from-[#0040FF] to-[#1a56ff] text-white rounded-tr-none shadow-[0_0_15px_rgba(0,64,255,0.3)]'
                        : isOldStyle
                        ? 'bg-slate-900 border border-amber-500/40 text-slate-100 rounded-tl-none shadow-sm'
                        : 'bg-[#111a33] border border-[#0040FF]/40 text-gray-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* In-Chat Direct Action Card */}
                    {msg.actionType && (
                      <div className="pt-1.5">
                        <button
                          onClick={() => handleActionClick(msg.actionType)}
                          className={`w-full flex items-center justify-between px-3 py-2 font-bold rounded-lg text-[11px] transition-all cursor-pointer shadow-sm ${
                            isOldStyle
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-200'
                              : 'bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 border border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <Zap className="w-3.5 h-3.5 text-emerald-400" />
                            {msg.actionLabel || 'Take Action'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </div>
                    )}

                    <div
                      className={`text-[9px] font-mono text-right ${
                        msg.sender === 'user' ? 'text-amber-100/70' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isOldStyle
                          ? 'bg-amber-500/30 border border-amber-300 text-amber-200'
                          : 'bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF]'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Follow-up Quick Reply Pills */}
                {msg.sender === 'assistant' && msg.quickFollowUps && msg.quickFollowUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-8 pt-0.5">
                    {msg.quickFollowUps.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className={`px-2.5 py-1 text-[10px] rounded-full transition-all cursor-pointer shadow-xs ${
                          isOldStyle
                            ? 'bg-slate-900 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-500/40'
                            : 'bg-[#111a33] hover:bg-[#0040FF] border border-[#0040FF]/50 hover:border-[#00E5FF] text-gray-300 hover:text-white'
                        }`}
                      >
                        ⚡ {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-gray-400 p-2 pl-4">
                <Bot className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span className="font-mono text-[11px] text-emerald-300">
                  Apna AI responding instantly...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Input Bar Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className={`p-2.5 border-t flex items-center gap-2 ${
              isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#070b14] border-[#0040FF]/30'
            }`}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything or tap a Smart Reply above..."
              className={`flex-1 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none ${
                isOldStyle
                  ? 'bg-slate-950 border border-amber-500/40 focus:border-amber-400'
                  : 'bg-[#0d1424] border border-[#0040FF]/40 focus:border-[#00E5FF]'
              }`}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className={`p-2.5 disabled:opacity-40 font-black rounded-xl transition-all cursor-pointer shrink-0 shadow-md ${
                isOldStyle
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:opacity-90'
                  : 'bg-gradient-to-r from-[#0040FF] to-[#00E5FF] text-black hover:opacity-95 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
