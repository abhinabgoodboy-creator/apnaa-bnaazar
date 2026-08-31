import { DigitalProduct, CartItem, Order, LicenseType, UserProfile, SellerProfile, MarketplaceSettings, MarketplaceNotification } from '../types';
import { SAMPLE_PRODUCTS } from '../data/categories';
import { ALL_UPLOADED_PRODUCTS } from '../data/allProducts';
import { getFileBlob, getCachedMemoryUrl } from './fileBlobStorage';

const PRODUCTS_KEY = 'apna_bazaar_products_v2';
const USER_UPLOADS_KEY = 'apna_bazaar_user_products_v3';
const CART_KEY = 'apna_bazaar_cart';
const WISHLIST_KEY = 'apna_bazaar_wishlist';
const ORDERS_KEY = 'apna_bazaar_orders';
const USER_KEY = 'apna_bazaar_user';
const SELLER_KEY = 'apna_bazaar_seller';
const SETTINGS_KEY = 'apna_bazaar_settings';
const NOTIFICATIONS_KEY = 'apna_bazaar_notifications';

export function getUserUploadedProducts(): DigitalProduct[] {
  try {
    const raw = localStorage.getItem(USER_UPLOADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserUploadedProducts(prods: DigitalProduct[]): void {
  try {
    localStorage.setItem(USER_UPLOADS_KEY, JSON.stringify(prods));
  } catch (e) {
    console.error('Failed to save user uploaded products', e);
  }
}

export const DEFAULT_NOTIFICATIONS: MarketplaceNotification[] = [
  {
    id: 'notif-1',
    title: 'Apna Bazaar 100% Free Open Access',
    message: 'All APKs, codebases, templates, and digital assets are now 100% Free with instant one-click downloads.',
    type: 'system',
    timestamp: 'Just now',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Apna Assured 2.5 Security Online',
    message: 'Automated virus & malware inspection is active across all APK binaries and source packages.',
    type: 'security',
    timestamp: '10m ago',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Classic & Cyber Style Switcher Active',
    message: 'Switch between Old Apna Bazaar (Heritage Mandi) and New Apna Bazaar (Cyberpunk Tech) anytime in Settings or top bar.',
    type: 'system',
    timestamp: '1h ago',
    read: true,
  },
];

export function getStoredNotifications(): MarketplaceNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifications: MarketplaceNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

export function addNotificationToStorage(notification: MarketplaceNotification): MarketplaceNotification[] {
  const current = getStoredNotifications();
  const updated = [notification, ...current];
  saveStoredNotifications(updated);
  return updated;
}

export const DEFAULT_SETTINGS: MarketplaceSettings = {
  appStyle: 'new',
  themeColor: 'cyan',
  autoDownloadOnPurchase: true,
  defaultDownloadLocation: 'Browser Default',
  twoFactorAuth: false,
  emailReceipts: true,
  productUpdateNotifications: true,
  priceDropAlerts: false,
  defaultCurrency: 'INR (₹)',
};

export function getStoredSettings(): MarketplaceSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: MarketplaceSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const user: UserProfile = JSON.parse(raw);
    if (user && (user.displayName === 'Avinav Datta' || user.displayName === 'Abhinav Datta' || user.displayName === 'Avinav')) {
      user.displayName = 'Abhinav Dutta';
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return user;
  } catch (e) {
    console.error('Failed to load user from storage', e);
    return null;
  }
}

export function saveStoredUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error('Failed to save user to storage', e);
  }
}

export function updateStoredUserName(newDisplayName: string): UserProfile | null {
  const user = getStoredUser();
  if (!user) return null;
  const updated = { ...user, displayName: newDisplayName };
  saveStoredUser(updated);
  return updated;
}

// Seller Profile Storage
export function getStoredSeller(): SellerProfile | null {
  try {
    const raw = localStorage.getItem(SELLER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to load seller from storage', e);
    return null;
  }
}

export function saveStoredSeller(seller: SellerProfile | null): void {
  try {
    if (seller) {
      localStorage.setItem(SELLER_KEY, JSON.stringify(seller));
    } else {
      localStorage.removeItem(SELLER_KEY);
    }
  } catch (e) {
    console.error('Failed to save seller to storage', e);
  }
}

export function getStoredProducts(): DigitalProduct[] {
  try {
    const userUploads = getUserUploadedProducts();
    const raw = localStorage.getItem(PRODUCTS_KEY);
    let baseList: DigitalProduct[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        baseList = Array.isArray(parsed) && parsed.length > 0 ? parsed : ALL_UPLOADED_PRODUCTS;
      } catch {
        baseList = ALL_UPLOADED_PRODUCTS;
      }
    } else {
      baseList = ALL_UPLOADED_PRODUCTS;
      saveStoredProducts(baseList);
    }

    // Merge user uploads at the front of catalog, deduplicated by id
    const userIds = new Set(userUploads.map((p) => p.id));
    const merged = [
      ...userUploads.map((p) => ({ ...p, isUserUploaded: true, status: 'deployed' as const })),
      ...baseList.filter((p) => !userIds.has(p.id)),
    ];

    return checkAndDeployPendingProducts(merged);
  } catch (e) {
    console.error('Failed to load products from storage', e);
    return ALL_UPLOADED_PRODUCTS;
  }
}

export function saveStoredProducts(products: DigitalProduct[]): void {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('LocalStorage quota exceeded, optimizing fallback', e);
    try {
      // Keep user uploads intact, optimize only catalog demo items
      const lightweight = products.map((p) => {
        if (p.isUserUploaded) return p;
        return {
          ...p,
          fileDataUrl: p.fileDataUrl?.startsWith('data:') ? undefined : p.fileDataUrl,
        };
      });
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(lightweight));
    } catch (err2) {
      console.error('Final fallback: could not persist products to localStorage', err2);
    }
  }
}

// Auto-deployment simulation: checks if 1 hour (3600 seconds) has elapsed since submission
export function checkAndDeployPendingProducts(products: DigitalProduct[]): DigitalProduct[] {
  const now = Date.now();
  let hasChanges = false;

  // Calculate real delivery counts from actual stored orders
  const orders = getStoredOrders();
  const orderCountMap = new Map<string, number>();
  orders.forEach((order) => {
    order.items?.forEach((item) => {
      if (item.product?.id) {
        const curr = orderCountMap.get(item.product.id) || 0;
        orderCountMap.set(item.product.id, curr + 1);
      }
    });
  });

  const checked = products.map((p) => {
    let updated = { ...p };
    // Enforce 100% Free digital access
    if (updated.price !== 0 || updated.originalPrice !== 0 || !updated.isFree) {
      updated.price = 0;
      updated.originalPrice = 0;
      updated.isFree = true;
      hasChanges = true;
    }

    // Ensure salesCount and downloadCount reflect authentic real delivery numbers
    const realOrdersCount = orderCountMap.get(p.id) || 0;
    // If fake inflated mock numbers were present (> 100 with 0 real orders), reset to authentic count
    if ((updated.salesCount || 0) > 100 && orders.length === 0) {
      updated.salesCount = realOrdersCount;
      updated.downloadCount = realOrdersCount;
      hasChanges = true;
    } else if (realOrdersCount > (updated.salesCount || 0)) {
      updated.salesCount = realOrdersCount;
      updated.downloadCount = realOrdersCount;
      hasChanges = true;
    }

    // User-uploaded or deployed products are always deployed
    if (updated.isUserUploaded || !updated.status || (updated.status === 'under_review' && updated.deployAt && now >= updated.deployAt)) {
      if (updated.status !== 'deployed') {
        updated.status = 'deployed';
        hasChanges = true;
      }
    }
    return updated;
  });

  if (hasChanges) {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(checked));
    } catch {
      // ignore
    }
  }

  return checked;
}

// Simulation trigger: instantly deploy a product without waiting full 1 hour
export function forceDeployProduct(productId: string): DigitalProduct[] {
  const current = getStoredProducts();
  const updated = current.map((p) => {
    if (p.id === productId) {
      return { ...p, status: 'deployed' as const, deployAt: Date.now() - 1000 };
    }
    return p;
  });
  saveStoredProducts(updated);
  return updated;
}

export function addProductToStorage(product: DigitalProduct): DigitalProduct[] {
  const verifiedProduct: DigitalProduct = {
    ...product,
    isUserUploaded: true,
    status: 'deployed',
    deployAt: Date.now() - 1000,
  };

  const userUploads = getUserUploadedProducts();
  const updatedUserUploads = [verifiedProduct, ...userUploads.filter((p) => p.id !== verifiedProduct.id)];
  saveUserUploadedProducts(updatedUserUploads);

  const current = getStoredProducts();
  const updated = [verifiedProduct, ...current.filter((p) => p.id !== verifiedProduct.id)];
  saveStoredProducts(updated);
  return updated;
}

export function updateProductInStorage(updatedProduct: DigitalProduct): DigitalProduct[] {
  const verifiedProduct: DigitalProduct = {
    ...updatedProduct,
    isUserUploaded: true,
    status: 'deployed',
  };

  const userUploads = getUserUploadedProducts();
  const uIdx = userUploads.findIndex((p) => p.id === verifiedProduct.id);
  if (uIdx !== -1) {
    userUploads[uIdx] = verifiedProduct;
  } else {
    userUploads.unshift(verifiedProduct);
  }
  saveUserUploadedProducts(userUploads);

  const current = getStoredProducts();
  const index = current.findIndex((p) => p.id === verifiedProduct.id);
  if (index !== -1) {
    current[index] = verifiedProduct;
  } else {
    current.unshift(verifiedProduct);
  }
  saveStoredProducts(current);
  return [...current];
}

export function deleteProductFromStorage(productId: string): DigitalProduct[] {
  const userUploads = getUserUploadedProducts().filter((p) => p.id !== productId);
  saveUserUploadedProducts(userUploads);

  const current = getStoredProducts().filter((p) => p.id !== productId);
  saveStoredProducts(current);
  return current;
}

export function seedSampleProducts(): DigitalProduct[] {
  saveStoredProducts(ALL_UPLOADED_PRODUCTS);
  return getStoredProducts();
}

export function clearAllProducts(): DigitalProduct[] {
  saveUserUploadedProducts([]);
  saveStoredProducts([]);
  return [];
}

/**
 * Flexible Category Matching: Ensures products uploaded under variations
 * (e.g., 'Android Apps (APK)' vs 'Apps & Software') cleanly match store category tabs.
 */
export function matchProductCategory(productCategory: string | undefined, filterCategory: string): boolean {
  if (!filterCategory || filterCategory === 'All') return true;
  if (!productCategory) return false;
  if (productCategory === filterCategory) return true;

  const normProd = productCategory.toLowerCase().trim();
  const normFilt = filterCategory.toLowerCase().trim();

  if (normProd === normFilt) return true;

  // Apps & Software
  if (filterCategory === 'Apps & Software') {
    return (
      normProd.includes('app') ||
      normProd.includes('apk') ||
      normProd.includes('software') ||
      normProd.includes('android') ||
      normProd.includes('ios') ||
      normProd.includes('tool')
    );
  }

  // Web Templates & Code
  if (filterCategory === 'Web Templates & Code') {
    return (
      normProd.includes('web') ||
      normProd.includes('code') ||
      normProd.includes('template') ||
      normProd.includes('script') ||
      normProd.includes('react') ||
      normProd.includes('source')
    );
  }

  // UI/UX Kits
  if (filterCategory === 'UI/UX Kits') {
    return (
      normProd.includes('ui') ||
      normProd.includes('ux') ||
      normProd.includes('figma') ||
      normProd.includes('kit') ||
      normProd.includes('wireframe')
    );
  }

  // E-Books & Guides
  if (filterCategory === 'E-Books & Guides') {
    return (
      normProd.includes('book') ||
      normProd.includes('guide') ||
      normProd.includes('pdf') ||
      normProd.includes('manual')
    );
  }

  // Graphics & Vectors
  if (filterCategory === 'Graphics & Vectors') {
    return (
      normProd.includes('graphic') ||
      normProd.includes('vector') ||
      normProd.includes('icon') ||
      normProd.includes('logo') ||
      normProd.includes('design') ||
      normProd.includes('illustration')
    );
  }

  // 3D Models & Assets
  if (filterCategory === '3D Models & Assets') {
    return (
      normProd.includes('3d') ||
      normProd.includes('model') ||
      normProd.includes('asset') ||
      normProd.includes('blender') ||
      normProd.includes('unity') ||
      normProd.includes('game')
    );
  }

  // Audio & Sound Effects
  if (filterCategory === 'Audio & Sound Effects') {
    return (
      normProd.includes('audio') ||
      normProd.includes('sound') ||
      normProd.includes('music') ||
      normProd.includes('sfx') ||
      normProd.includes('synth')
    );
  }

  // Plugins & Scripts
  if (filterCategory === 'Plugins & Scripts') {
    return (
      normProd.includes('plugin') ||
      normProd.includes('script') ||
      normProd.includes('bot') ||
      normProd.includes('extension')
    );
  }

  return false;
}

// Cart Storage
export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
}

// Wishlist Storage
export function getStoredWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredWishlist(wishlist: string[]): void {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  } catch (e) {
    console.error('Failed to save wishlist', e);
  }
}

// Orders Storage
export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders', e);
  }
}

export function incrementProductDeliveries(productIds: string[]): DigitalProduct[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return [];
    const products: DigitalProduct[] = JSON.parse(raw);
    const updated = products.map((p) => {
      if (productIds.includes(p.id)) {
        return {
          ...p,
          salesCount: (p.salesCount || 0) + 1,
          downloadCount: (p.downloadCount || 0) + 1,
        };
      }
      return p;
    });
    saveStoredProducts(updated);
    return updated;
  } catch (e) {
    console.error('Failed to increment product deliveries', e);
    return [];
  }
}

export function addOrderToStorage(order: Order): Order[] {
  const current = getStoredOrders();
  const updated = [order, ...current];
  saveStoredOrders(updated);

  // Increment real delivery counts for all products in this order
  const productIds = order.items.map((item) => item.product.id).filter(Boolean);
  if (productIds.length > 0) {
    incrementProductDeliveries(productIds);
  }

  // Record real notification
  const firstItem = order.items[0]?.product?.title || 'Digital Asset';
  addNotificationToStorage({
    id: `notif-deliv-${Date.now()}`,
    title: `Order Delivered: ${order.id}`,
    message: `Delivered ${order.items.length} item(s) (${firstItem}) to ${order.customerEmail}. Digital locker unlocked.`,
    type: 'order',
    timestamp: 'Just now',
    read: false,
  });

  return updated;
}

export function recordDirectDownloadOrder(
  product: DigitalProduct,
  user?: UserProfile | null
): { orders: Order[]; products: DigitalProduct[] } {
  const licenseKey = `APNA-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const newOrder: Order = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    createdAt: new Date().toISOString(),
    customerEmail: user?.email || 'customer@apnabazaar.in',
    customerName: user?.displayName || 'Apna Customer',
    paymentMethod: '100% Free Open Claim',
    transactionId: `TXN-DELIV-${Date.now()}`,
    items: [
      {
        product,
        license: 'Commercial',
        licenseKey,
        downloadUrl: `${product.title.toLowerCase().replace(/\s+/g, '-')}.${(product.fileFormat || 'ZIP').toLowerCase()}`,
        price: 0,
      },
    ],
    totalAmount: 0,
    totalSavings: 0,
  };

  const updatedOrders = addOrderToStorage(newOrder);
  const updatedProducts = getStoredProducts();
  return { orders: updatedOrders, products: updatedProducts };
}

// Helper to trigger instant file download in the exact format provided by the seller
export async function triggerDigitalDownload(product: DigitalProduct, licenseKey?: string): Promise<void> {
  const formatExt = (product.fileFormat || 'ZIP').toLowerCase().replace(/^\./, '');
  let targetFilename = product.fileName?.trim();
  
  if (!targetFilename) {
    const slug = product.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    targetFilename = `${slug}.${formatExt}`;
  } else if (!targetFilename.includes('.')) {
    targetFilename = `${targetFilename}.${formatExt}`;
  }

  // If stored in IndexedDB or memory cache, retrieve the real binary file
  if (product.fileDataUrl?.startsWith('indexeddb:')) {
    const cachedMemoryUrl = getCachedMemoryUrl(product.fileDataUrl);
    if (cachedMemoryUrl) {
      const link = document.createElement('a');
      link.href = cachedMemoryUrl;
      link.download = targetFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    try {
      const stored = await getFileBlob(product.fileDataUrl);
      if (stored && stored.blob) {
        const url = URL.createObjectURL(stored.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = stored.filename || targetFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return;
      }
    } catch (e) {
      console.warn('Could not read file from IndexedDB, falling back to container download', e);
    }
  }

  // If direct data URL exists, download it directly with exact filename
  if (product.fileDataUrl && !product.fileDataUrl.startsWith('indexeddb:')) {
    const link = document.createElement('a');
    link.href = product.fileDataUrl;
    link.download = targetFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Determine MIME type based on format / extension
  let mimeType = 'application/octet-stream';
  const lowerName = targetFilename.toLowerCase();
  
  if (lowerName.endsWith('.apk') || formatExt === 'apk') {
    mimeType = 'application/vnd.android.package-archive';
  } else if (lowerName.endsWith('.zip') || formatExt === 'zip') {
    mimeType = 'application/zip';
  } else if (lowerName.endsWith('.json') || formatExt === 'json') {
    mimeType = 'application/json';
  } else if (lowerName.endsWith('.pdf') || formatExt === 'pdf') {
    mimeType = 'application/pdf';
  } else if (lowerName.endsWith('.fig') || formatExt === 'fig') {
    mimeType = 'application/x-figma';
  } else if (lowerName.endsWith('.tar.gz') || lowerName.endsWith('.tgz')) {
    mimeType = 'application/gzip';
  }

  // Construct structured asset payload matching the target format
  let blobData: BlobPart;
  if (lowerName.endsWith('.json') || formatExt === 'json') {
    const jsonPayload = {
      app: product.title,
      version: product.version,
      category: product.category,
      format: product.fileFormat,
      fileSize: product.fileSize,
      license: product.license,
      licenseKey: licenseKey || 'AB-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      seller: product.creatorOrCompanyName || product.sellerName,
      downloadDate: new Date().toISOString(),
      features: product.features,
      techStack: product.techStack,
      compatibility: product.compatibility,
      instructions: 'Integrate this configuration file into your target runtime or project root.'
    };
    blobData = JSON.stringify(jsonPayload, null, 2);
  } else {
    // Binary/Text package container
    blobData = `=====================================================
APNA BAZAAR DIGITAL ASSET PACKAGE
=====================================================
Package Name: ${targetFilename}
Title: ${product.title}
Version: ${product.version}
Category: ${product.category}
File Format: ${product.fileFormat.toUpperCase()}
Declared Size: ${product.fileSize}
License Type: ${product.license}
License Key: ${licenseKey || 'AB-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now().toString(36).toUpperCase()}
Verified Seller: ${product.creatorOrCompanyName || product.sellerName}
Timestamp: ${new Date().toLocaleString()}

-----------------------------------------------------
FEATURES INCLUDED:
${(product.features || []).map(f => '• ' + f).join('\n')}

-----------------------------------------------------
TECH STACK / COMPATIBILITY:
Tech Stack: ${(product.techStack || []).join(', ')}
Compatible Environments: ${(product.compatibility || []).join(', ')}

-----------------------------------------------------
DIGITAL ASSET INSTRUCTIONS:
1. Use this file directly in your build pipeline or install onto your device (${formatExt.toUpperCase()} format).
2. Retain your unique License Key for verification, updates, and customer support.
3. For re-downloads, access your Apna Bazaar My Downloads Locker.

Thank you for choosing Apna Bazaar Digital Marketplace!
=====================================================`;
  }

  const blob = new Blob([blobData], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = targetFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
