import { ProductCategory } from '../types';

export interface CategoryInfo {
  name: ProductCategory;
  label: string;
  iconName: string;
  description: string;
  badge?: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'All',
    label: 'All Digital',
    iconName: 'LayoutGrid',
    description: 'Explore full digital collection',
  },
  {
    name: 'Apps & Software',
    label: 'Apps & Software',
    iconName: 'Smartphone',
    description: 'Android APKs, iOS builds & Desktop apps',
    badge: 'Popular',
  },
  {
    name: 'Web Templates & Code',
    label: 'Web & Source Code',
    iconName: 'Code',
    description: 'React, Next.js, Node, Laravel full-stack apps',
    badge: 'Hot',
  },
  {
    name: 'UI/UX Kits',
    label: 'UI/UX & Figma',
    iconName: 'Palette',
    description: 'Figma templates, wireframes & component systems',
  },
  {
    name: 'E-Books & Guides',
    label: 'E-Books & PDFs',
    iconName: 'BookOpen',
    description: 'Tech guides, cheat-sheets & digital manuals',
  },
  {
    name: 'Graphics & Vectors',
    label: 'Graphics & Design',
    iconName: 'Image',
    description: 'Logos, vector bundles, 3D icons & illustrations',
  },
  {
    name: '3D Models & Assets',
    label: '3D & Game Assets',
    iconName: 'Box',
    description: 'Blender, FBX, Unity & Unreal engine packages',
  },
  {
    name: 'Audio & Sound Effects',
    label: 'Audio & SFX',
    iconName: 'Music',
    description: 'Royalty-free music, podcast SFX & synth packs',
  },
  {
    name: 'Plugins & Scripts',
    label: 'Plugins & Scripts',
    iconName: 'Terminal',
    description: 'Automation scripts, browser extensions & API bots',
  },
];

export const POPULAR_FORMATS = [
  'ZIP',
  'APK',
  'FIG',
  'PDF',
  'JSON',
  'MP4',
  'WAV',
  'BLENDER',
  'SQL',
];

export const TECH_STACKS = [
  'React',
  'Next.js',
  'React Native',
  'Flutter',
  'Node.js',
  'Python',
  'Tailwind CSS',
  'TypeScript',
  'Figma',
  'WordPress',
  'Android',
  'iOS',
];

// Sample demo products ready ONLY if user explicitly toggles "Load Sample Demo"
export const SAMPLE_PRODUCTS = [
  {
    id: 'demo-1',
    title: 'Apna Store - Full-Stack E-Commerce App (React Native & Node.js)',
    tagline: 'Complete Flipkart clone mobile app source code with instant setup & admin panel',
    category: 'Apps & Software' as ProductCategory,
    price: 0,
    originalPrice: 0,
    isFree: true,
    rating: 4.8,
    ratingCount: 142,
    isAssured: true,
    version: 'v3.2.0',
    fileSize: '64.5 MB',
    fileFormat: 'ZIP',
    fileName: 'apna-store-react-native-v3.zip',
    description: 'Complete production-ready e-commerce mobile application codebase featuring user authentication, category navigation, cart, checkout, instant downloads, and powerful administrative dashboard.',
    features: [
      'Clean React Native + TypeScript architecture',
      '100% Free Open Source & Community Distribution',
      'Real-time order tracking & push notifications',
      'Dark and Light theme support out of the box',
      'Admin web dashboard with sales charts included'
    ],
    techStack: ['React Native', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS'],
    compatibility: ['Android', 'iOS', 'Web'],
    previewUrl: 'https://demo.example.com/ecommerce-preview',
    screenshots: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    license: 'Commercial' as const,
    sellerName: 'Apna Code Labs',
    sellerRating: 4.9,
    createdAt: new Date().toISOString(),
    salesCount: 389,
    downloadCount: 412,
    isUserUploaded: false
  },
  {
    id: 'demo-2',
    title: 'SaaSify - Modern AI Dashboard & Landing Page UI Kit (Figma)',
    tagline: '350+ components, 40+ responsive screens with Auto Layout 5.0 and Dark Mode',
    category: 'UI/UX Kits' as ProductCategory,
    price: 0,
    originalPrice: 0,
    isFree: true,
    rating: 4.9,
    ratingCount: 88,
    isAssured: true,
    version: 'v2.1',
    fileSize: '42.0 MB',
    fileFormat: 'FIG',
    fileName: 'saasify-figma-kit-v2.fig',
    description: 'High-converting Figma UI kit tailored for modern SaaS and AI web applications. Includes complete design tokens, typography styles, variable states, charts, tables, and marketing pages.',
    features: [
      '350+ atomic Figma components with variants',
      'Fully responsive Auto Layout 5.0',
      '100% Free Open Access for all designers',
      'Pre-built dashboard analytics & onboarding flows',
      'Free lifetime updates & documentation'
    ],
    techStack: ['Figma', 'Design Tokens', 'Tailwind Colors'],
    compatibility: ['Figma', 'FigJam', 'Web'],
    previewUrl: 'https://figma.com/@demo-saasify',
    screenshots: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    license: 'Commercial' as const,
    sellerName: 'PixelCraft Studios',
    sellerRating: 4.8,
    createdAt: new Date().toISOString(),
    salesCount: 245,
    downloadCount: 260,
    isUserUploaded: false
  },
  {
    id: 'demo-3',
    title: 'Mastering Full-Stack TypeScript & Cloud Microservices (E-Book + Code)',
    tagline: 'Comprehensive 450-page PDF handbook with real-world enterprise architectures',
    category: 'E-Books & Guides' as ProductCategory,
    price: 0,
    originalPrice: 0,
    isFree: true,
    rating: 4.7,
    ratingCount: 64,
    isAssured: false,
    version: '2026 Edition',
    fileSize: '28.4 MB',
    fileFormat: 'PDF',
    fileName: 'fullstack-typescript-microservices-2026.pdf',
    description: 'Practical guide to building scalable, resilient microservices in TypeScript, Docker, Kubernetes, and event-driven backends with Kafka and PostgreSQL.',
    features: [
      '450 pages of in-depth architectural patterns',
      '12 runnable GitHub code repositories included',
      '100% Free Complete Digital Download',
      'CI/CD GitHub Actions blueprints',
      'Print-ready high-res PDF and EPUB versions'
    ],
    techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    compatibility: ['PDF', 'EPUB', 'Kindle', 'Any Device'],
    screenshots: [
      'https://images.unsplash.com/photo-1532012164546-f432f2e37262?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1532012164546-f432f2e37262?auto=format&fit=crop&w=800&q=80',
    license: 'Personal' as const,
    sellerName: 'DevArch Publications',
    sellerRating: 4.7,
    createdAt: new Date().toISOString(),
    salesCount: 178,
    downloadCount: 190,
    isUserUploaded: false
  }
];
