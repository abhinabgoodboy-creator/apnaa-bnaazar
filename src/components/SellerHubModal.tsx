import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Store,
  UploadCloud,
  Edit,
  Trash2,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  Download,
  Clock,
  CheckCircle2,
  Zap,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Building,
  User,
  AlertCircle,
  LogOut,
  AlertTriangle,
  Puzzle,
  Check,
  Mail,
  Phone,
  FileCheck,
  KeyRound,
  Copy,
  Search,
  Truck
} from 'lucide-react';
import { DigitalProduct, SellerProfile, Order } from '../types';
import { forceDeployProduct, checkAndDeployPendingProducts, saveStoredSeller, triggerDigitalDownload } from '../utils/storage';

interface SellerHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: DigitalProduct[];
  orders?: Order[];
  seller: SellerProfile | null;
  onOpenUpload: () => void;
  onEditProduct: (product: DigitalProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onProductUpdated: () => void;
  onOpenOnboarding: () => void;
  onSellerLogout?: () => void;
}

export const SellerHubModal: React.FC<SellerHubModalProps> = ({
  isOpen,
  onClose,
  products,
  orders = [],
  seller,
  onOpenUpload,
  onEditProduct,
  onDeleteProduct,
  onProductUpdated,
  onOpenOnboarding,
  onSellerLogout,
}) => {
  // Live ticker for 1-hour review timer
  const [now, setNow] = useState(Date.now());
  const [activeTab, setActiveTab] = useState<'products' | 'deliveries' | 'store_profile' | 'plugins'>('products');
  const [deliverySearch, setDeliverySearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Custom in-modal Delete Confirmation state
  const [productToDelete, setProductToDelete] = useState<DigitalProduct | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setNow(Date.now());
      checkAndDeployPendingProducts(products);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, products]);

  // Flatten real deliveries from all stored orders (Hooks must run unconditionally)
  const allDeliveries = useMemo(() => {
    const list: Array<{
      orderId: string;
      date: string;
      createdAt?: string;
      customerName: string;
      customerEmail: string;
      transactionId: string;
      product: DigitalProduct;
      license: string;
      licenseKey: string;
    }> = [];

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        list.push({
          orderId: order.id,
          date: order.date,
          createdAt: order.createdAt,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          transactionId: order.transactionId,
          product: item.product,
          license: item.license,
          licenseKey: item.licenseKey,
        });
      });
    });

    return list;
  }, [orders]);

  // Filter deliveries by search
  const filteredDeliveries = useMemo(() => {
    if (!deliverySearch.trim()) return allDeliveries;
    const query = deliverySearch.toLowerCase().trim();
    return allDeliveries.filter((d) =>
      d.orderId.toLowerCase().includes(query) ||
      d.customerName.toLowerCase().includes(query) ||
      d.customerEmail.toLowerCase().includes(query) ||
      d.product.title.toLowerCase().includes(query) ||
      d.licenseKey.toLowerCase().includes(query)
    );
  }, [allDeliveries, deliverySearch]);

  if (!isOpen) return null;

  const userProducts = products;
  const underReviewProducts = userProducts.filter((p) => p.status === 'under_review');
  const deployedProducts = userProducts.filter((p) => p.status === 'deployed' || !p.status);

  // Real total completed deliveries count
  const totalDeliveries = allDeliveries.length;

  const formatRemainingTime = (deployAt?: number) => {
    if (!deployAt) return '00:00';
    const diffSeconds = Math.max(0, Math.floor((deployAt - now) / 1000));
    if (diffSeconds <= 0) return 'Deploying Live...';

    const mins = Math.floor(diffSeconds / 60);
    const secs = diffSeconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleInstantDeploy = (productId: string) => {
    forceDeployProduct(productId);
    onProductUpdated();
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      
      {/* DELETE CONFIRMATION DIALOG */}
      {productToDelete && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0b1120] rounded-lg shadow-2xl border border-red-500/50 max-w-md w-full p-5 space-y-4 animate-in zoom-in-95 duration-150 text-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded-full shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-white">Delete Product</h3>
                <p className="text-xs text-gray-300">
                  Are you sure you want to delete <strong className="text-white">&quot;{productToDelete.title}&quot;</strong>?
                </p>
                <p className="text-[11px] text-red-400 font-semibold">
                  This action permanently removes the listing, media, and APK/ZIP binary from the store.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded shadow-lg cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION DIALOG */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0b1120] rounded-lg shadow-2xl border border-[#0040FF]/50 max-w-md w-full p-5 space-y-4 animate-in zoom-in-95 duration-150 text-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#0040FF]/20 text-[#00E5FF] rounded-full shrink-0 border border-[#00E5FF]/40">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-white">Log Out from Seller Hub</h3>
                <p className="text-xs text-gray-300">
                  Are you sure you want to exit your creator dashboard session?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onClose();
                  if (onSellerLogout) onSellerLogout();
                }}
                className="px-4 py-2 bg-[#0040FF] hover:bg-[#1a56ff] text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Seller Hub Modal Container */}
      <div className="bg-[#0b1120] border border-[#0040FF]/50 rounded-xl shadow-[0_0_50px_rgba(0,64,255,0.3)] w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden text-gray-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#0b1120] text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-[#00E5FF]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg tracking-wide text-white">
                  {seller ? seller.businessName : 'Seller Hub Dashboard'}
                </h2>
                <span className="bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#00E5FF]" />
                  Verified Creator Store
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Independent Digital Creator Analytics &amp; Control Panel • Direct Public Downloads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenUpload();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00E5FF] hover:bg-[#33ebff] text-black font-extrabold text-xs rounded shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
              id="hub-quick-upload-btn"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New Product</span>
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-300 rounded transition-colors"
              title="Log Out Seller"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* METRICS (4 SPECIFIED CARDS) */}
        <div className="bg-[#070b14] px-4 sm:px-6 py-4 border-b border-[#0040FF]/20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Card 1: Total Public Deliveries */}
            <div className="bg-[#111a33] border border-[#0040FF]/40 rounded-lg p-3.5 sm:p-4 space-y-1 shadow-[0_0_15px_rgba(0,64,255,0.15)]">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>Total Deliveries</span>
                <Truck className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {totalDeliveries}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">
                Verified Customer Deliveries
              </div>
            </div>

            {/* Card 2: Active Listed Items */}
            <div className="bg-[#111a33] border border-[#00E5FF]/50 rounded-lg p-3.5 sm:p-4 space-y-1 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              <div className="flex items-center justify-between text-xs text-[#00E5FF] font-bold">
                <span>Listed Products</span>
                <Package className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#00E5FF] font-mono">
                {userProducts.length}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">
                {deployedProducts.length} Live in Catalog
              </div>
            </div>

            {/* Card 3: Free CDN Bandwidth */}
            <div className="bg-[#111a33] border border-[#0040FF]/40 rounded-lg p-3.5 sm:p-4 space-y-1 shadow-[0_0_15px_rgba(0,64,255,0.15)]">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>CDN Bandwidth</span>
                <Zap className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                Unlimited
              </div>
              <div className="text-[10px] text-gray-400">
                Instant Edge File Distribution
              </div>
            </div>

            {/* Card 4: Storefront Status */}
            <div className="bg-[#111a33] border border-[#0040FF]/40 rounded-lg p-3.5 sm:p-4 space-y-1 shadow-[0_0_15px_rgba(0,64,255,0.15)]">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>Store Status</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                Active
              </div>
              <div className="text-[10px] text-gray-400">
                Verified Creator Account
              </div>
            </div>

          </div>
        </div>

        {/* Dashboard Navigation Sub-tabs */}
        <div className="bg-[#070b14] px-4 sm:px-6 border-b border-[#0040FF]/20 flex items-center gap-4 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'products'
                ? 'border-[#00E5FF] text-[#00E5FF] shadow-[0_4px_10px_rgba(0,229,255,0.3)]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Listed Digital Products ({userProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deliveries')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'deliveries'
                ? 'border-[#00E5FF] text-[#00E5FF] shadow-[0_4px_10px_rgba(0,229,255,0.3)]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Real Deliveries &amp; Claims ({totalDeliveries})</span>
            {totalDeliveries > 0 && (
              <span className="bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full">
                {totalDeliveries}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('store_profile')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'store_profile'
                ? 'border-[#00E5FF] text-[#00E5FF] shadow-[0_4px_10px_rgba(0,229,255,0.3)]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Storefront Profile &amp; Distribution</span>
          </button>

          <button
            onClick={() => setActiveTab('plugins')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'plugins'
                ? 'border-[#00E5FF] text-[#00E5FF] shadow-[0_4px_10px_rgba(0,229,255,0.3)]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>Plugins Store</span>
            <span className="bg-[#00E5FF]/20 text-[#00E5FF] text-[9px] px-1.5 py-0.2 rounded font-black uppercase">
              Coming Soon
            </span>
          </button>
        </div>

        {/* Dashboard Main Content Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-6">
          
          {/* TAB 1: MY LISTED DIGITAL PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#00E5FF]" />
                    <span>Catalog Management</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Track automated 1-hour review pipelines, edit prices, and manage digital asset files.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenUpload();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#0040FF] to-[#1a56ff] hover:from-[#1a56ff] hover:to-[#0040FF] text-white font-bold text-xs rounded-lg shadow-[0_0_15px_rgba(0,64,255,0.4)] flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4 text-[#00E5FF]" />
                  <span>Upload New Product</span>
                </button>
              </div>

              {userProducts.length === 0 ? (
                <div className="bg-[#111a33] border border-[#0040FF]/30 rounded-xl p-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-[#0040FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                    <Package className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">No Products Uploaded Yet</h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    You have 0 products listed in your digital storefront. Click below to upload your first app, APK, source code ZIP, or Figma template.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenUpload();
                    }}
                    className="mt-2 px-6 py-2.5 bg-[#00E5FF] hover:bg-[#33ebff] text-black font-extrabold text-xs rounded shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer"
                  >
                    Upload Your First Product
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-[#0040FF]/30 bg-[#111a33]">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#070b14] text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-[#0040FF]/30">
                      <tr>
                        <th className="py-3 px-4">Product Asset</th>
                        <th className="py-3 px-4">Format &amp; Size</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Real Deliveries</th>
                        <th className="py-3 px-4">Review Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {userProducts.map((product) => {
                        const isUnderReview = product.status === 'under_review';
                        const displayImage = product.thumbnail || product.thumbnail_1 || product.logo || product.screenshots?.[0];
                        const productDeliveriesCount = allDeliveries.filter((d) => d.product.id === product.id).length;

                        return (
                          <tr key={product.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {displayImage ? (
                                  <img
                                    src={displayImage}
                                    alt={product.title}
                                    className="w-10 h-10 rounded object-cover border border-[#0040FF]/50 shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded bg-[#070b14] border border-gray-700 flex items-center justify-center text-[#00E5FF] font-bold text-xs shrink-0">
                                    {product.fileFormat}
                                  </div>
                                )}
                                <div className="max-w-[200px] truncate">
                                  <div className="font-bold text-white text-xs truncate">
                                    {product.title}
                                  </div>
                                  <div className="text-[10px] text-gray-400 font-mono">
                                    {product.category} • {product.version}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4 font-mono text-xs">
                              <span className="bg-[#0040FF]/30 text-[#00E5FF] border border-[#00E5FF]/30 px-1.5 py-0.5 rounded font-bold text-[10px] uppercase">
                                {product.fileFormat}
                              </span>
                              <span className="text-gray-400 ml-1.5 text-[11px]">
                                {product.fileSize}
                              </span>
                            </td>

                            <td className="py-3 px-4 font-mono font-bold text-white text-xs">
                              <span className="text-emerald-400 font-bold">100% FREE</span>
                            </td>

                            <td className="py-3 px-4 font-mono text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-bold ${productDeliveriesCount > 0 ? 'text-emerald-400 font-extrabold' : 'text-white'}`}>
                                  {productDeliveriesCount}
                                </span>
                                <span className="text-gray-400 text-[10px]">
                                  {productDeliveriesCount === 1 ? 'delivery' : 'deliveries'}
                                </span>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              {isUnderReview ? (
                                <div className="space-y-1">
                                  <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                                    <Clock className="w-3 h-3 animate-spin" />
                                    <span>Review: {formatRemainingTime(product.deployAt)}</span>
                                  </div>
                                  <button
                                    onClick={() => handleInstantDeploy(product.id)}
                                    className="block text-[9px] text-[#00E5FF] hover:underline font-semibold cursor-pointer"
                                  >
                                    ⚡ Instant Test Deploy
                                  </button>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>Live on Store</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    onClose();
                                    onEditProduct(product);
                                  }}
                                  className="p-1.5 bg-[#0040FF]/30 hover:bg-[#0040FF] text-[#00E5FF] rounded transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setProductToDelete(product)}
                                  className="p-1.5 bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white rounded transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REAL DELIVERIES & CUSTOMER CLAIMS */}
          {activeTab === 'deliveries' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0040FF]/20 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#00E5FF]" />
                    <span>Real Customer Deliveries &amp; Dispatches</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Authentic records of digital applications, license keys, and source code claimed and delivered to customers.
                  </p>
                </div>

                {/* Delivery Search Bar */}
                <div className="relative min-w-[240px]">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={deliverySearch}
                    onChange={(e) => setDeliverySearch(e.target.value)}
                    placeholder="Search by order, buyer, product..."
                    className="w-full bg-[#070b14] border border-[#0040FF]/40 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* Delivery Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#111a33] border border-[#0040FF]/30 rounded-lg p-3.5 space-y-1">
                  <span className="text-gray-400 text-[11px] font-semibold">Total Verified Deliveries</span>
                  <div className="text-xl font-mono font-black text-white">{totalDeliveries}</div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    100% Delivery Success Rate
                  </span>
                </div>

                <div className="bg-[#111a33] border border-[#0040FF]/30 rounded-lg p-3.5 space-y-1">
                  <span className="text-gray-400 text-[11px] font-semibold">Active License Keys Issued</span>
                  <div className="text-xl font-mono font-black text-[#00E5FF]">{totalDeliveries}</div>
                  <span className="text-[10px] text-gray-400">Cryptographically Generated Keys</span>
                </div>

                <div className="bg-[#111a33] border border-[#0040FF]/30 rounded-lg p-3.5 space-y-1">
                  <span className="text-gray-400 text-[11px] font-semibold">Delivery Speed</span>
                  <div className="text-xl font-mono font-black text-emerald-400">Instant (0s)</div>
                  <span className="text-[10px] text-gray-400">Real-time Cloud Edge Transfer</span>
                </div>
              </div>

              {/* Delivery Records List */}
              {filteredDeliveries.length === 0 ? (
                <div className="bg-[#111a33] border border-[#0040FF]/30 rounded-xl p-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-[#0040FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                    <Truck className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">
                    {deliverySearch ? 'No matching deliveries found' : 'No Customer Deliveries Yet'}
                  </h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    {deliverySearch
                      ? `No delivered order matches "${deliverySearch}". Try a different keyword.`
                      : 'When users claim or download products from your marketplace catalog, every single delivery log with buyer details, order ID, and license key will appear here instantly.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-[#0040FF]/30 bg-[#111a33]">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#070b14] text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-[#0040FF]/30">
                      <tr>
                        <th className="py-3 px-4">Delivery / Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Delivered Product</th>
                        <th className="py-3 px-4">Dispatched License Key</th>
                        <th className="py-3 px-4">Date &amp; Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredDeliveries.map((deliv, idx) => {
                        const img = deliv.product.thumbnail || deliv.product.thumbnail_1 || deliv.product.logo;
                        return (
                          <tr key={`${deliv.orderId}-${idx}`} className="hover:bg-white/5 transition-colors">
                            {/* Order ID */}
                            <td className="py-3 px-4">
                              <div className="font-mono font-bold text-white text-xs">
                                #{deliv.orderId}
                              </div>
                              <div className="text-[10px] text-gray-500 font-mono">
                                {deliv.transactionId}
                              </div>
                            </td>

                            {/* Customer */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-white text-xs flex items-center gap-1">
                                <span>{deliv.customerName}</span>
                              </div>
                              <div className="text-[11px] text-[#00E5FF] font-mono truncate max-w-[180px]">
                                {deliv.customerEmail}
                              </div>
                            </td>

                            {/* Delivered Product */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                {img ? (
                                  <img
                                    src={img}
                                    alt={deliv.product.title}
                                    className="w-9 h-9 rounded object-cover border border-[#0040FF]/50 shrink-0"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded bg-[#070b14] border border-[#0040FF]/50 flex items-center justify-center text-[#00E5FF] font-bold text-xs shrink-0">
                                    {deliv.product.fileFormat}
                                  </div>
                                )}
                                <div className="max-w-[180px] truncate">
                                  <div className="font-bold text-white text-xs truncate">
                                    {deliv.product.title}
                                  </div>
                                  <div className="text-[10px] text-gray-400 font-mono">
                                    {deliv.product.fileFormat} • {deliv.product.fileSize || 'Instant Asset'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Dispatched Key */}
                            <td className="py-3 px-4 font-mono text-xs">
                              <div className="flex items-center gap-1.5 bg-[#070b14] border border-[#0040FF]/40 px-2 py-1 rounded w-fit">
                                <KeyRound className="w-3 h-3 text-[#00E5FF] shrink-0" />
                                <span className="font-bold text-white text-[11px] select-all">
                                  {deliv.licenseKey}
                                </span>
                                <button
                                  onClick={() => handleCopyKey(deliv.licenseKey)}
                                  className="text-gray-400 hover:text-white ml-1 cursor-pointer"
                                  title="Copy License Key"
                                >
                                  {copiedKey === deliv.licenseKey ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Date & Status */}
                            <td className="py-3 px-4">
                              <div className="text-[11px] text-gray-300 font-mono">
                                {deliv.date}
                              </div>
                              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[9px] font-bold mt-1">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                Delivered &amp; Dispatched
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => triggerDigitalDownload(deliv.product, deliv.licenseKey)}
                                className="px-2.5 py-1.5 bg-[#0040FF]/30 hover:bg-[#0040FF] text-[#00E5FF] hover:text-white rounded text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                                title="Download Deliverable Package"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download File</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STOREFRONT PROFILE & DISTRIBUTION */}
          {activeTab === 'store_profile' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-[#0040FF]/20 pb-2">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#00E5FF]" />
                  <span>Storefront Profile &amp; Distribution Settings</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Manage your creator identity, storefront information, and public digital distribution preferences.
                </p>
              </div>

              {/* Creator Profile Overview */}
              <div className="bg-[#111a33] border border-[#0040FF]/40 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#00E5FF]" />
                  <span>Creator &amp; Brand Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#070b14] p-3.5 rounded-lg border border-[#0040FF]/30 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Storefront Name</span>
                    <span className="font-bold text-white text-sm">{seller?.businessName || 'My Digital Studio'}</span>
                  </div>
                  <div className="bg-[#070b14] p-3.5 rounded-lg border border-[#0040FF]/30 space-y-1">
                    <span className="text-gray-400 text-[11px] block">Creator Username</span>
                    <span className="font-mono font-bold text-[#00E5FF] text-sm">@{seller?.username || 'creator'}</span>
                  </div>
                  <div className="bg-[#070b14] p-3.5 rounded-lg border border-[#0040FF]/30 space-y-1">
                    <span className="text-gray-400 text-[11px] block flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>Contact &amp; Support Email</span>
                    </span>
                    <span className="font-mono text-white text-xs">{seller?.email || 'creator@gmail.com'}</span>
                  </div>
                  <div className="bg-[#070b14] p-3.5 rounded-lg border border-[#0040FF]/30 space-y-1">
                    <span className="text-gray-400 text-[11px] block flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>Registered Creator Phone</span>
                    </span>
                    <span className="font-mono text-white text-xs">{seller?.phone || '+91 9876543210'}</span>
                  </div>
                </div>
              </div>

              {/* Public Distribution & Free Licensing Info */}
              <div className="bg-[#111a33] border border-[#0040FF]/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#00E5FF]" />
                      <span>Direct CDN Distribution &amp; Public Licenses</span>
                    </h4>
                    <p className="text-xs text-gray-400">
                      All uploaded assets are distributed directly to developers and designers globally without payment barriers.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    100% Free CDN Live
                  </span>
                </div>

                <div className="p-3.5 bg-[#070b14] border border-[#0040FF]/30 rounded-lg text-xs text-gray-300 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                    <span>Free Open Distribution Policy</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Products you deploy are instantly available for free instant downloads with open developer and commercial use rights. No payment gateways or scanner configurations are required.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLUGINS STORE (COMING SOON) */}
          {activeTab === 'plugins' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-[#0040FF]/20 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Puzzle className="w-4 h-4 text-[#00E5FF]" />
                    <span>Seller Plugins &amp; Extensions Store</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Powerful add-ons to supercharge your digital marketplace sales and operations.
                  </p>
                </div>
                <span className="bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 text-xs font-black px-2.5 py-1 rounded tracking-wider uppercase">
                  Coming Soon
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Plugin 1: SEO Optimization */}
                <div className="bg-[#111a33] border border-[#0040FF]/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
                  <div className="p-2 bg-[#0040FF]/30 text-[#00E5FF] rounded-lg w-fit">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">SEO Optimization &amp; Schema</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Auto-generate rich search snippets, schema metadata, and Google search indexing for all your listed APKs and web apps.
                    </p>
                  </div>
                  <span className="inline-block bg-gray-800 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    Status: In Development
                  </span>
                </div>

                {/* Plugin 2: Automatic Watermarking */}
                <div className="bg-[#111a33] border border-[#0040FF]/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
                  <div className="p-2 bg-[#0040FF]/30 text-[#00E5FF] rounded-lg w-fit">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Automatic Watermarking</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Protect preview screenshots, UI design kits, and PDFs with dynamic watermarking prior to purchase checkout.
                    </p>
                  </div>
                  <span className="inline-block bg-gray-800 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    Status: In Development
                  </span>
                </div>

                {/* Plugin 3: Community Developer Badges */}
                <div className="bg-[#111a33] border border-[#0040FF]/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
                  <div className="p-2 bg-[#0040FF]/30 text-[#00E5FF] rounded-lg w-fit">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Community Developer Badges</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Highlight verified creator credentials, open source contributor badges, and top-rated developer status.
                    </p>
                  </div>
                  <span className="inline-block bg-gray-800 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    Status: In Development
                  </span>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Hub Footer */}
        <div className="bg-[#070b14] border-t border-[#0040FF]/20 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
            <span className="font-mono text-[#00E5FF] text-[11px]">
              Seller Hub Online • {userProducts.length} Active Listings
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded transition-colors cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
