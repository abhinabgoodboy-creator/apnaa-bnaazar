import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { PromotionalBanner } from './components/PromotionalBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { UploadProductModal } from './components/UploadProductModal';
import { CartDrawer } from './components/CartDrawer';
import { MyDownloadsModal } from './components/MyDownloadsModal';
import { SellerHubModal } from './components/SellerHubModal';
import { SellerOnboardingModal } from './components/SellerOnboardingModal';
import { WishlistModal } from './components/WishlistModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { CustomerCareChatbot } from './components/CustomerCareChatbot';
import { ProfileSettingsPage } from './components/ProfileSettingsPage';
import { LegalDocumentPage } from './components/LegalDocumentPage';
import { SEOAndFAQSection } from './components/SEOAndFAQSection';
import { Footer } from './components/Footer';
import {
  DigitalProduct,
  CartItem,
  Order,
  FilterState,
  ProductCategory,
  LicenseType,
  UserProfile,
  SellerProfile,
  MarketplaceSettings,
  MarketplaceNotification,
  ActivePageView,
} from './types';
import {
  getStoredProducts,
  saveStoredProducts,
  addProductToStorage,
  updateProductInStorage,
  deleteProductFromStorage,
  clearAllProducts,
  seedSampleProducts,
  getStoredCart,
  saveStoredCart,
  getStoredWishlist,
  saveStoredWishlist,
  getStoredOrders,
  addOrderToStorage,
  recordDirectDownloadOrder,
  getStoredUser,
  saveStoredUser,
  updateStoredUserName,
  getStoredSeller,
  saveStoredSeller,
  getStoredSettings,
  saveStoredSettings,
  getStoredNotifications,
  saveStoredNotifications,
  addNotificationToStorage,
  checkAndDeployPendingProducts,
  matchProductCategory,
} from './utils/storage';
import { CheckCircle2, ShieldCheck, Sparkles, Store } from 'lucide-react';

export default function App() {
  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authBlockedReason, setAuthBlockedReason] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Seller Hub State
  const [seller, setSeller] = useState<SellerProfile | null>(() => getStoredSeller());
  const [isSellerOnboardingOpen, setIsSellerOnboardingOpen] = useState(false);
  const [isSellerHubOpen, setIsSellerHubOpen] = useState(false);

  // Settings & Notifications State
  const [settings, setSettings] = useState<MarketplaceSettings>(() => getStoredSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState<MarketplaceNotification[]>(() =>
    getStoredNotifications()
  );
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Active View / Routing
  const [currentPage, setCurrentPage] = useState<ActivePageView>('home');

  // Products initialized from storage
  const [products, setProducts] = useState<DigitalProduct[]>(() => getStoredProducts());
  const [cart, setCart] = useState<CartItem[]>(() => getStoredCart());
  const [wishlist, setWishlist] = useState<string[]>(() => getStoredWishlist());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());

  // Filter State (Price is removed/zeroed since all products are 100% free)
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 0,
    minRating: 0,
    selectedFormats: [],
    selectedLicenses: [],
    onlyAssured: false,
    sortBy: 'popularity',
  });

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Sync states to storage
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  useEffect(() => {
    saveStoredWishlist(wishlist);
  }, [wishlist]);

  // Periodic check for automated 1-hour deployments
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const updated = checkAndDeployPendingProducts(products);
      if (
        updated.length !== products.length ||
        updated.some((p, i) => p.status !== products[i]?.status)
      ) {
        setProducts(updated);
      }
    }, 5000);
    return () => clearInterval(checkInterval);
  }, [products]);

  // Style Mode Toggle Handler
  const currentAppStyle = settings.appStyle || 'new';
  const isOldStyle = currentAppStyle === 'old';

  const handleToggleAppStyle = () => {
    const nextStyle: 'new' | 'old' = currentAppStyle === 'old' ? 'new' : 'old';
    const updated: MarketplaceSettings = {
      ...settings,
      appStyle: nextStyle,
    };
    setSettings(updated);
    saveStoredSettings(updated);
    showToast(
      nextStyle === 'new'
        ? 'Switched to ⚡ New Cyber Apna Bazaar'
        : 'Switched to 🏛️ Old Classic Apna Bazaar Mandi'
    );
  };

  // Access Control & Protected Action Guard
  const requireAuth = (reason: string, action: () => void) => {
    if (user) {
      action();
    } else {
      setAuthBlockedReason(reason);
      setPendingAction(() => action);
      setIsAuthOpen(true);
    }
  };

  // Auth Handlers
  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    saveStoredUser(authenticatedUser);
    setIsAuthOpen(false);
    showToast(`Welcome ${authenticatedUser.displayName}! Signed in with Google.`);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setAuthBlockedReason(null);
  };

  const handleLogout = () => {
    setUser(null);
    saveStoredUser(null);
    setCurrentPage('home');
    showToast('Signed out of Google account successfully.');
  };

  const handleUpdateDisplayName = (newName: string) => {
    const updated = updateStoredUserName(newName);
    if (updated) {
      setUser(updated);
      showToast('Profile display name updated successfully!');
    }
  };

  // Navigation Handler
  const handleNavigate = (page: ActivePageView) => {
    if (page === 'profile') {
      requireAuth('Access Profile & Settings', () => setCurrentPage('profile'));
    } else {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Seller Hub Access Handler
  const handleOpenSellerHub = () => {
    requireAuth('Access Seller Hub & Uploads', () => {
      if (!seller || !seller.isVerified) {
        setIsSellerOnboardingOpen(true);
      } else {
        setIsSellerHubOpen(true);
      }
    });
  };

  const handleSellerOnboarded = (newSeller: SellerProfile) => {
    setSeller(newSeller);
    saveStoredSeller(newSeller);
    setIsSellerOnboardingOpen(false);
    setIsSellerHubOpen(true);
    showToast(`Congratulations ${newSeller.businessName}! Seller account activated.`);
  };

  const handleSellerLogout = () => {
    setSeller(null);
    saveStoredSeller(null);
    setIsSellerHubOpen(false);
    showToast('Logged out of Seller Hub store account.');
  };

  // Product CRUD & Security Audit
  const handleProductUploaded = async (newProduct: DigitalProduct) => {
    if (editingProduct) {
      const updated = updateProductInStorage(newProduct);
      setProducts(updated);
      showToast(`Updated "${newProduct.title}" successfully!`);
    } else {
      const updated = addProductToStorage(newProduct);
      setProducts(updated);
      showToast(`🎉 "${newProduct.title}" is now LIVE in the marketplace!`);

      // Add Live deployment notification
      const liveNotif: MarketplaceNotification = {
        id: 'notif-submit-' + Date.now(),
        title: `Product Live: ${newProduct.title}`,
        message: `Your asset "${newProduct.title}" (${newProduct.fileFormat}) is now live in ${newProduct.category} for free public download!`,
        type: 'deployment',
        timestamp: 'Just now',
        read: false,
      };
      const notifsWithSubmit = addNotificationToStorage(liveNotif);
      setNotifications(notifsWithSubmit);

      // Asynchronous automated virus & integrity scan
      try {
        const scanRes = await fetch('/api/scan-asset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: newProduct.fileName,
            fileFormat: newProduct.fileFormat,
            fileSize: newProduct.fileSize,
            title: newProduct.title,
          }),
        });
        const scanData = await scanRes.json();
        if (scanData.status === 'clean') {
          const scanNotif: MarketplaceNotification = {
            id: 'notif-scan-' + Date.now(),
            title: `Apna Assured: Virus Scan Clean (${newProduct.fileFormat})`,
            message:
              scanData.scanSummary ||
              `SHA-256 and integrity checks passed. "${newProduct.title}" is verified safe.`,
            type: 'security',
            timestamp: 'Just now',
            read: false,
          };
          const updatedNotifs = addNotificationToStorage(scanNotif);
          setNotifications(updatedNotifs);
        }
      } catch (err) {
        console.warn('Security scan background notification err:', err);
      }
    }
    setEditingProduct(null);
  };

  // Notification Operations
  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
    showToast('Marked all notifications as read');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    saveStoredNotifications([]);
    showToast('Notifications cleared');
  };

  const handleUpdateSettings = (newSettings: MarketplaceSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    showToast('Marketplace settings saved successfully!');
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = deleteProductFromStorage(productId);
    setProducts(updated);
    showToast('Product deleted from store.');
  };

  const handleSeedDemoProducts = () => {
    const seeded = seedSampleProducts();
    setProducts(seeded);
    showToast('Loaded 3 sample 100% free digital products for layout preview.');
  };

  // Cart Operations
  const handleAddToCart = (product: DigitalProduct, license: LicenseType = 'Commercial') => {
    requireAuth('Add Product to Cart', () => {
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { product, selectedLicense: license, quantity: 1 }];
      });
      showToast(`Added "${product.title}" to Free Cart!`);
    });
  };

  const handleQuickBuy = (product: DigitalProduct, license: LicenseType = 'Commercial') => {
    requireAuth('Instant Free Claim & Download', () => {
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) return prev;
        return [...prev, { product, selectedLicense: license, quantity: 1 }];
      });
      setIsCartOpen(true);
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed item from cart.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Order Placement
  const handleOrderPlaced = (order: Order) => {
    const updated = addOrderToStorage(order);
    setOrders(updated);
    setProducts(getStoredProducts());
    showToast('Free digital files and license keys added to My Downloads!');
  };

  // Direct Product Download / Claim Handler
  const handleDirectDownload = (product: DigitalProduct) => {
    const { orders: updatedOrders, products: updatedProducts } = recordDirectDownloadOrder(product, user);
    setOrders(updatedOrders);
    setProducts(updatedProducts);
    showToast(`Delivered "${product.title}" to My Downloads!`);
  };

  // Wishlist Operations
  const handleToggleWishlist = (productId: string) => {
    requireAuth('Save Item to Wishlist', () => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast('Removed from wishlist');
          return prev.filter((id) => id !== productId);
        } else {
          showToast('Added to wishlist ❤️');
          return [...prev, productId];
        }
      });
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const wishlistedProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  // Product Selection for Modal
  const handleSelectProduct = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const currentProducts = checkAndDeployPendingProducts(products);

    let list = currentProducts.filter(
      (p) => p.status === 'deployed' || !p.status || p.status === undefined
    );

    if (filters.category !== 'All') {
      list = list.filter((p) => matchProductCategory(p.category, filters.category));
    }

    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.tagline.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.fileFormat.toLowerCase().includes(query) ||
          p.techStack.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (filters.minRating > 0) {
      list = list.filter((p) => p.rating >= filters.minRating);
    }

    if (filters.selectedFormats.length > 0) {
      list = list.filter((p) => filters.selectedFormats.includes(p.fileFormat));
    }

    if (filters.selectedLicenses.length > 0) {
      list = list.filter((p) => filters.selectedLicenses.includes(p.license));
    }

    if (filters.onlyAssured) {
      list = list.filter((p) => p.isAssured);
    }

    switch (filters.sortBy) {
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popularity':
      default:
        list.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
    }

    return list;
  }, [products, filters]);

  const totalDownloadsCount = orders.reduce((acc, o) => acc + o.items.length, 0);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isOldStyle
          ? 'bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-black'
          : 'bg-[#070b14] text-gray-100 selection:bg-[#00E5FF] selection:text-black'
      }`}
    >
      {/* Toast popup */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 border animate-in fade-in slide-in-from-bottom-2 duration-150 text-xs sm:text-sm font-semibold ${
            isOldStyle
              ? 'bg-slate-900 border-amber-400 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
              : 'bg-[#0b1120] border-[#00E5FF]/40 text-white shadow-[0_0_25px_rgba(0,64,255,0.4)]'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isOldStyle ? 'text-amber-400' : 'text-[#00E5FF]'}`} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => {
          setFilters((prev) => ({ ...prev, category: cat }));
          if (currentPage !== 'home') setCurrentPage('home');
        }}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        unreadNotificationsCount={notifications.filter((n) => !n.read).length}
        appStyle={currentAppStyle}
        onToggleAppStyle={handleToggleAppStyle}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSellerHub={handleOpenSellerHub}
        onOpenSellerOnboarding={() => {
          requireAuth('Become a Seller', () => setIsSellerOnboardingOpen(true));
        }}
        onOpenUpload={handleOpenSellerHub}
        onOpenWishlist={() => {
          requireAuth('View Wishlist', () => setIsWishlistOpen(true));
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenOrders={() => {
          requireAuth('Access My Orders & Downloads', () => setIsDownloadsOpen(true));
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={user}
        seller={seller}
        onOpenAuth={() => {
          setAuthBlockedReason(null);
          setPendingAction(null);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* CONDITIONAL MAIN CONTENT VIEWS */}
      {currentPage === 'home' && (
        <>
          {/* Promotional Top Hero Banner */}
          <PromotionalBanner
            appStyle={currentAppStyle}
            onOpenUpload={handleOpenSellerHub}
            onSeedDemo={handleSeedDemoProducts}
            hasProducts={products.length > 0}
            onOpenSellerHub={handleOpenSellerHub}
          />

          {/* Main Product Catalog & Filters */}
          <div className="flex-1">
            <ProductGrid
              products={filteredProducts}
              filters={filters}
              appStyle={currentAppStyle}
              onFilterChange={setFilters}
              isWishlisted={isWishlisted}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onQuickBuy={handleQuickBuy}
              onSelectProduct={handleSelectProduct}
              onOpenUpload={handleOpenSellerHub}
              onSeedDemo={handleSeedDemoProducts}
              totalUnfilteredCount={products.length}
            />
          </div>

          {/* SEO Content, FAQs Accordion & Trending Search Metadata */}
          <SEOAndFAQSection
            appStyle={currentAppStyle}
            onOpenSellerHub={handleOpenSellerHub}
            onTagClick={(tag) => {
              setFilters((prev) => ({
                ...prev,
                category: 'All',
                searchQuery: tag,
              }));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}

      {currentPage === 'profile' && user && (
        <div className="flex-1">
          <ProfileSettingsPage
            user={user}
            onUpdateDisplayName={handleUpdateDisplayName}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            onOpenDownloads={() => setIsDownloadsOpen(true)}
            onOpenSellerHub={handleOpenSellerHub}
            downloadsCount={totalDownloadsCount}
          />
        </div>
      )}

      {currentPage === 'privacy' && (
        <div className="flex-1">
          <LegalDocumentPage initialTab="privacy" onNavigate={handleNavigate} />
        </div>
      )}

      {currentPage === 'terms' && (
        <div className="flex-1">
          <LegalDocumentPage initialTab="terms" onNavigate={handleNavigate} />
        </div>
      )}

      {/* Product Details Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        appStyle={currentAppStyle}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
        onBuyNow={handleQuickBuy}
        onDirectDownload={handleDirectDownload}
        isWishlisted={selectedProduct ? isWishlisted(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 3-Step Seller Onboarding Modal */}
      <SellerOnboardingModal
        isOpen={isSellerOnboardingOpen}
        onClose={() => setIsSellerOnboardingOpen(false)}
        user={user}
        onOnboardingComplete={handleSellerOnboarded}
        onOpenPrivacy={() => {
          setIsSellerOnboardingOpen(false);
          handleNavigate('privacy');
        }}
        onOpenTerms={() => {
          setIsSellerOnboardingOpen(false);
          handleNavigate('terms');
        }}
      />

      {/* Upload Digital Product / App Modal */}
      <UploadProductModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setEditingProduct(null);
        }}
        onProductUploaded={handleProductUploaded}
        editProduct={editingProduct}
        seller={seller}
        onViewInStore={(uploadedProd) => {
          setIsUploadOpen(false);
          setIsSellerHubOpen(false);
          setEditingProduct(null);
          setCurrentPage('home');
          setFilters((prev) => ({
            ...prev,
            category: uploadedProd.category || 'All',
            searchQuery: '',
          }));
          handleSelectProduct(uploadedProd);
        }}
      />

      {/* Seller Hub Dashboard Modal */}
      <SellerHubModal
        isOpen={isSellerHubOpen}
        onClose={() => setIsSellerHubOpen(false)}
        products={products}
        orders={orders}
        seller={seller}
        onOpenUpload={() => {
          setEditingProduct(null);
          setIsUploadOpen(true);
        }}
        onEditProduct={(product) => {
          setEditingProduct(product);
          setIsSellerHubOpen(false);
          setIsUploadOpen(true);
        }}
        onDeleteProduct={handleDeleteProduct}
        onProductUpdated={() => setProducts(getStoredProducts())}
        onOpenOnboarding={() => {
          setIsSellerHubOpen(false);
          setIsSellerOnboardingOpen(true);
        }}
        onSellerLogout={handleSellerLogout}
      />

      {/* Cart & Instant Free Claim Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        appStyle={currentAppStyle}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        user={user}
        onRequireAuth={requireAuth}
      />

      {/* My Downloads & Digital Locker Modal */}
      <MyDownloadsModal
        isOpen={isDownloadsOpen}
        onClose={() => setIsDownloadsOpen(false)}
        orders={orders}
        appStyle={currentAppStyle}
        onOpenStore={() => setIsDownloadsOpen(false)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistedProducts={wishlistedProducts}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleSelectProduct}
      />

      {/* Unified Google Sign-In & Sign-Up Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setPendingAction(null);
          setAuthBlockedReason(null);
        }}
        onSuccess={handleAuthSuccess}
        actionBlockedReason={authBlockedReason}
      />

      {/* Interactive Tabbed Marketplace Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onUpdateDisplayName={handleUpdateDisplayName}
        onOpenPrivacy={() => handleNavigate('privacy')}
        onOpenTerms={() => handleNavigate('terms')}
        orders={orders}
      />

      {/* Real-time Notifications & Security Audits Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClearAll={handleClearNotifications}
        onNotificationClick={(notif) => {
          if (notif.type === 'order') {
            setIsNotificationsOpen(false);
            requireAuth('Access My Downloads', () => setIsDownloadsOpen(true));
          } else if (notif.type === 'payout' || notif.type === 'deployment') {
            setIsNotificationsOpen(false);
            handleOpenSellerHub();
          }
        }}
      />

      {/* Context-Aware Fast Customer Care Chatbot */}
      <CustomerCareChatbot
        user={user}
        orders={orders}
        cart={cart}
        seller={seller}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSellerHub={handleOpenSellerHub}
        onOpenSellerOnboarding={() => {
          requireAuth('Become a Seller', () => setIsSellerOnboardingOpen(true));
        }}
        onOpenDownloads={() => {
          requireAuth('Access My Downloads', () => setIsDownloadsOpen(true));
        }}
        onOpenUpload={handleOpenSellerHub}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Footer */}
      <Footer
        appStyle={currentAppStyle}
        onToggleAppStyle={handleToggleAppStyle}
        onOpenUpload={handleOpenSellerHub}
        onOpenSellerHub={handleOpenSellerHub}
        onOpenDownloads={() => {
          requireAuth('Access Download Locker', () => setIsDownloadsOpen(true));
        }}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
