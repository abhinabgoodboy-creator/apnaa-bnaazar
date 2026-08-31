import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Zap,
  Code,
  Smartphone,
  Layers,
  Wrench,
  Tag,
  CheckCircle2,
  Download,
  Users,
  Search,
  Sparkles,
} from 'lucide-react';
import { AppStyle } from '../types';

interface SEOAndFAQSectionProps {
  appStyle?: AppStyle;
  onTagClick?: (tag: string) => void;
  onOpenSellerHub?: () => void;
}

const FAQS_DATA = [
  {
    id: 'faq-1',
    question: 'Is everything on Apna Bazaar really 100% free?',
    answer:
      'Yes! All digital products listed in the free catalog on Apna Bazaar are 100% free to access and download. You do not need to enter credit card details or sign up for paid subscriptions to get your files.',
  },
  {
    id: 'faq-2',
    question: 'Do I need an account to download free files?',
    answer:
      'While you can browse the marketplace freely, creating a quick account via Google Sign-In or Mobile OTP helps you track your download history, receive update notifications for your files, and access your personal Digital Vault.',
  },
  {
    id: 'faq-3',
    question: 'How do I upload and showcase my own digital products on Apna Bazaar?',
    answer:
      'If you are a developer or creator, navigate to the top right corner of the website and click "Become a Seller". Complete the quick 3-step onboarding process in the Seller Hub to list your software, apps, or templates for the community.',
  },
  {
    id: 'faq-4',
    question: 'Are the files on Apna Bazaar safe from viruses and malware?',
    answer:
      'Absolute security is guaranteed. Every file uploaded by creators undergoes an automated security inspection during our review process. Suspicious files or malicious scripts are automatically rejected to keep your devices 100% safe.',
  },
  {
    id: 'faq-5',
    question: 'Can I use the downloaded digital assets for commercial projects?',
    answer:
      'Yes, most digital assets on Apna Bazaar come with standard open usage rights for both personal and commercial projects unless specified otherwise by the creator in the product description.',
  },
];

const TARGET_KEYWORDS = [
  'free digital products marketplace',
  'download free software assets',
  'free app source code',
  'Apna Bazaar free downloads',
  'best free website templates',
  'free UI UX design kits',
  'free digital tools India',
  'download free developer assets',
  'free digital market online',
  'free software download store',
];

const TRENDING_HASHTAGS = [
  '#ApnaBazaar',
  '#FreeDigitalProducts',
  '#SoftwareDevelopment',
  '#FreeTemplates',
  '#SourceCode',
  '#DigitalMarketplace',
  '#TechTools',
  '#FreeDownloads',
  '#WebDesign',
  '#AppDevelopment',
];

export const SEOAndFAQSection: React.FC<SEOAndFAQSectionProps> = ({
  appStyle = 'new',
  onTagClick,
  onOpenSellerHub,
}) => {
  const isOldStyle = appStyle === 'old';
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="seo-faq-section"
      className={`border-t transition-colors duration-300 py-14 sm:py-20 ${
        isOldStyle
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-[#090e1c] border-[#0040FF]/25 text-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ========================================================================= */}
        {/* SECTION 1: STRUCTURED SEO ARTICLE                                         */}
        {/* ========================================================================= */}
        <article className="space-y-10" id="apna-bazaar-about-article">
          <header className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-[#00E5FF] border border-[#00E5FF]/30">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Open Source & Digital Asset Hub
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Welcome to Apna Bazaar – The Ultimate Free Digital Products Marketplace
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              In today’s fast-paced digital world, finding high-quality software, mobile applications, website templates, graphic designs, and digital assets usually comes with a heavy price tag. <strong>Apna Bazaar</strong> is changing the game completely. Apna Bazaar is a premier digital marketplace engineered specifically to empower creators, developers, students, and everyday users by offering an extensive library where everything is <strong>100% FREE</strong> to download.
            </p>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Whether you are looking for ready-to-deploy web templates, powerful software utilities, mobile application source codes, or creative graphics assets, Apna Bazaar provides instant, hassle-free access without subscription fees, credit cards, or hidden charges.
            </p>
          </header>

          {/* Subheading: Why Choose Apna Bazaar */}
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2.5">
                <ShieldCheck className="w-6 h-6 text-[#00E5FF]" />
                Why Choose Apna Bazaar for Free Digital Products?
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Built with precision engineering, security safeguards, and zero paywalls.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Point 1 */}
              <div
                id="feature-free-forever"
                className={`p-5 rounded-xl border transition-all duration-200 hover:-translate-y-1 ${
                  isOldStyle
                    ? 'bg-slate-950/60 border-slate-800 hover:border-amber-500/50'
                    : 'bg-[#0d152a] border-[#0040FF]/30 hover:border-[#00E5FF]/60 shadow-lg shadow-black/40'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base mb-3.5">
                  1
                </div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                  100% Free Downloads Forever
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  At Apna Bazaar, we believe in democratizing technology and digital creativity. Every product listed in our main public catalog—from website templates to digital scripts—can be downloaded completely free of cost.
                </p>
              </div>

              {/* Point 2 */}
              <div
                id="feature-verified-safe"
                className={`p-5 rounded-xl border transition-all duration-200 hover:-translate-y-1 ${
                  isOldStyle
                    ? 'bg-slate-950/60 border-slate-800 hover:border-amber-500/50'
                    : 'bg-[#0d152a] border-[#0040FF]/30 hover:border-[#00E5FF]/60 shadow-lg shadow-black/40'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] font-bold text-base mb-3.5">
                  2
                </div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                  Verified & Safe Digital Assets
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Security is our highest priority. Every file uploaded to Apna Bazaar undergoes an automated security review and virus check before listing. This ensures that every file, script, or template you download is clean, secure, and ready for immediate deployment on your personal or commercial projects.
                </p>
              </div>

              {/* Point 3 */}
              <div
                id="feature-for-creators"
                className={`p-5 rounded-xl border transition-all duration-200 hover:-translate-y-1 ${
                  isOldStyle
                    ? 'bg-slate-950/60 border-slate-800 hover:border-amber-500/50'
                    : 'bg-[#0d152a] border-[#0040FF]/30 hover:border-[#00E5FF]/60 shadow-lg shadow-black/40'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-base mb-3.5">
                  3
                </div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                  Built for Creators & Independent Developers
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Apna Bazaar is not just a place to download assets; it is a community built for creators. Independent developers, software engineers, and digital designers can showcase their work to thousands of daily visitors through our integrated Seller Hub.
                </p>
              </div>

              {/* Point 4 */}
              <div
                id="feature-fast-downloads"
                className={`p-5 rounded-xl border transition-all duration-200 hover:-translate-y-1 ${
                  isOldStyle
                    ? 'bg-slate-950/60 border-slate-800 hover:border-amber-500/50'
                    : 'bg-[#0d152a] border-[#0040FF]/30 hover:border-[#00E5FF]/60 shadow-lg shadow-black/40'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-base mb-3.5">
                  4
                </div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                  Lightning-Fast Instant Downloads
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  No waiting rooms, no survey walls, and no deceptive ad link redirects. When you click download on Apna Bazaar, your file transfers directly to your device within seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Subheading: What Can You Find on Apna Bazaar */}
          <div className="space-y-6 pt-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-[#00E5FF]" />
                What Can You Find on Apna Bazaar?
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Explore thousands of production-ready digital resources across core developer disciplines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                id="category-web-apps"
                className={`p-4 rounded-xl border ${
                  isOldStyle ? 'bg-slate-950/40 border-slate-800' : 'bg-[#0d152a]/70 border-[#0040FF]/25'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-[#00E5FF]">
                    <Code className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Web Applications & Scripts</h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Modern source code packages, full-stack website templates, and custom scripts built using HTML, React, Node.js, and Python.
                </p>
              </div>

              <div
                id="category-mobile-apps"
                className={`p-4 rounded-xl border ${
                  isOldStyle ? 'bg-slate-950/40 border-slate-800' : 'bg-[#0d152a]/70 border-[#0040FF]/25'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Mobile App Templates</h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  UI kits and source code repositories for Android and iOS mobile applications with APK and Flutter packages.
                </p>
              </div>

              <div
                id="category-graphics-ui"
                className={`p-4 rounded-xl border ${
                  isOldStyle ? 'bg-slate-950/40 border-slate-800' : 'bg-[#0d152a]/70 border-[#0040FF]/25'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Graphic Assets & UI Kits</h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  High-resolution icons, logos, vector graphics, dashboard UI kits, and design media for Figma and Sketch.
                </p>
              </div>

              <div
                id="category-tools-utilities"
                className={`p-4 rounded-xl border ${
                  isOldStyle ? 'bg-slate-950/40 border-slate-800' : 'bg-[#0d152a]/70 border-[#0040FF]/25'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Digital Tools & Utilities</h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Productivity software, desktop tools, and digital automation scripts tailored for businesses, developers, and freelancers.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* ========================================================================= */}
        {/* SECTION 2: INTERACTIVE ACCORDION FAQS                                     */}
        {/* ========================================================================= */}
        <section id="faqs-accordion-section" className="space-y-6 pt-6 border-t border-gray-800/80">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20">
              <HelpCircle className="w-3.5 h-3.5" />
              Help & Information
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Everything you need to know about claiming, downloading, and publishing free digital assets on Apna Bazaar.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3.5">
            {FAQS_DATA.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  id={faq.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? isOldStyle
                        ? 'bg-slate-950 border-amber-500/40 shadow-md'
                        : 'bg-[#0e162c] border-[#00E5FF]/50 shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                      : isOldStyle
                      ? 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      : 'bg-[#0a1020] border-[#0040FF]/25 hover:border-[#0040FF]/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                    id={`btn-${faq.id}`}
                  >
                    <span className="font-bold text-sm sm:text-base text-white flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isOpen
                            ? 'bg-[#00E5FF] text-black'
                            : 'bg-gray-800 text-gray-300'
                        }`}
                      >
                        Q
                      </span>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#00E5FF]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-gray-800/60 bg-black/20">
                      <div className="flex items-start gap-2.5 pt-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: SEO METADATA & TRENDING TOPICS                                 */}
        {/* ========================================================================= */}
        <section id="trending-topics-section" className="space-y-6 pt-6 border-t border-gray-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#00E5FF]" />
                Trending Topics & Search Tags
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Popular indexed keywords for developers, engineers, and digital asset seekers.
              </p>
            </div>
            {onOpenSellerHub && (
              <button
                type="button"
                onClick={onOpenSellerHub}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-[#00E5FF] border border-[#00E5FF]/40 cursor-pointer transition-colors shrink-0"
              >
                <Users className="w-3.5 h-3.5" />
                Publish Your Asset
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Target Keywords */}
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">
                Target Search Keywords:
              </span>
              <div className="flex flex-wrap gap-2" id="target-search-keywords">
                {TARGET_KEYWORDS.map((kw, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onTagClick && onTagClick(kw)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      isOldStyle
                        ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-[#111a33] hover:bg-[#19264d] text-gray-200 hover:text-[#00E5FF] border border-[#0040FF]/30 hover:border-[#00E5FF]/50 shadow-sm'
                    }`}
                  >
                    <Search className="w-3 h-3 text-gray-400" />
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Hashtags */}
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">
                Trending Hashtags:
              </span>
              <div className="flex flex-wrap gap-2" id="trending-hashtags">
                {TRENDING_HASHTAGS.map((tag, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onTagClick && onTagClick(tag.replace('#', ''))}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-emerald-950/40 text-emerald-300 hover:text-white border border-emerald-500/30 hover:bg-emerald-800/40 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </section>
  );
};
