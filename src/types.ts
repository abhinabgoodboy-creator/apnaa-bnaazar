export type ProductCategory =
  | 'All'
  | 'Android Apps (APK)'
  | 'Apps & Software'
  | 'Digital Tools'
  | 'Templates'
  | 'Graphics'
  | 'Other'
  | 'Web Templates & Code'
  | 'UI/UX Kits'
  | 'E-Books & Guides'
  | 'Audio & Sound Effects'
  | '3D Models & Assets'
  | 'Graphics & Vectors'
  | 'Plugins & Scripts';

export type LicenseType = 'Personal' | 'Commercial' | 'Extended Commercial';

export type AppStyle = 'new' | 'old';

export type ProductReviewStatus = 'under_review' | 'deployed';

export interface DigitalProduct {
  id: string;
  title: string;
  tagline: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  currency?: 'INR (₹)' | 'USD ($)' | 'EUR (€)';
  isFree?: boolean;
  rating: number;
  ratingCount: number;
  isAssured: boolean;
  version: string;
  fileSize: string;
  fileFormat: string; // e.g. "ZIP", "APK", "FIG", "PDF", "TAR.GZ", "JSON"
  fileName: string;
  fileDataUrl?: string; // real file data (base64/blob URL) or simulated downloadable URL
  externalDownloadUrl?: string;
  description: string;
  features: string[];
  techStack: string[];
  compatibility: string[];
  previewUrl?: string;
  screenshots: string[];
  thumbnail: string;
  logo?: string;
  thumbnail_1?: string;
  thumbnail_2?: string;
  license: LicenseType;
  sellerName: string;
  creatorOrCompanyName?: string;
  sellerRating?: number;
  createdAt: string;
  salesCount: number;
  downloadCount: number;
  isUserUploaded?: boolean;
  status?: ProductReviewStatus;
  submittedAt?: number; // timestamp in ms
  deployAt?: number; // timestamp in ms (submittedAt + 3600000)
  sellerUsername?: string;
  sellerPhone?: string;
}

export interface SellerProfile {
  phone: string;
  businessName: string;
  username: string;
  email: string;
  upiId?: string;
  upiQrImageUrl?: string;
  agreedTerms: boolean;
  onboardedAt: string;
  isVerified: boolean;
}

export interface MarketplaceSettings {
  appStyle: 'new' | 'old';
  themeColor: 'cyan' | 'saffron' | 'emerald' | 'indigo';
  autoDownloadOnPurchase: boolean;
  defaultDownloadLocation: 'Browser Default' | 'Cloud Locker' | 'Custom Directory';
  twoFactorAuth: boolean;
  emailReceipts: boolean;
  productUpdateNotifications: boolean;
  priceDropAlerts: boolean;
  defaultCurrency: 'INR (₹)' | 'USD ($)';
  savedUpiHandles?: string[];
}

export interface CartItem {
  product: DigitalProduct;
  selectedLicense: LicenseType;
  quantity: number;
}

export interface OrderItem {
  product: DigitalProduct;
  license: LicenseType;
  licenseKey: string;
  downloadUrl: string;
  price: number;
}

export type PaymentMethod =
  | '100% Free Open Claim'
  | '100% Free Claim'
  | 'UPI'
  | 'Credit / Debit Card'
  | 'Net Banking'
  | 'Digital Wallet';

export interface Order {
  id: string;
  date: string;
  createdAt?: string;
  customerEmail: string;
  customerName: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  items: OrderItem[];
  totalAmount: number;
  totalSavings: number;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  googleId?: string;
  phone?: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface FilterState {
  category: ProductCategory;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  selectedFormats: string[];
  selectedLicenses: LicenseType[];
  onlyAssured: boolean;
  sortBy: 'popularity' | 'price_low' | 'price_high' | 'rating' | 'newest';
}

export interface MarketplaceNotification {
  id: string;
  title: string;
  message: string;
  type: 'security' | 'order' | 'deployment' | 'payout' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export type ActivePageView = 'home' | 'profile' | 'privacy' | 'terms';
