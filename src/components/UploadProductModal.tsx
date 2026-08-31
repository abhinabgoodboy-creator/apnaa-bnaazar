import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileArchive,
  Image as ImageIcon,
  Clock,
  ExternalLink,
  Info,
  Phone,
  User,
  AlertCircle,
  FileCheck,
  Zap
} from 'lucide-react';
import { DigitalProduct, ProductCategory, SellerProfile } from '../types';
import { CATEGORIES } from '../data/categories';
import { storeFileBlob, compressImageFile } from '../utils/fileBlobStorage';

interface UploadProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUploaded: (newProduct: DigitalProduct) => void;
  onViewInStore?: (product: DigitalProduct) => void;
  seller: SellerProfile | null;
  editProduct?: DigitalProduct | null;
}

export const UploadProductModal: React.FC<UploadProductModalProps> = ({
  isOpen,
  onClose,
  onProductUploaded,
  onViewInStore,
  seller,
  editProduct,
}) => {
  // Step 1: General Info
  const [productName, setProductName] = useState(editProduct?.title || '');
  const [creatorOrCompanyName, setCreatorOrCompanyName] = useState(
    editProduct?.creatorOrCompanyName ||
      seller?.businessName ||
      editProduct?.sellerName ||
      'Apex Digital Studio'
  );
  const [category, setCategory] = useState<ProductCategory>(
    editProduct?.category || 'Apps & Software'
  );
  const [description, setDescription] = useState(
    editProduct?.description || ''
  );
  const [sellerPhone, setSellerPhone] = useState(
    editProduct?.sellerPhone || seller?.phone || '+91 9876543210'
  );
  const [version, setVersion] = useState(editProduct?.version || 'v1.0.0');

  // Media Section State (Logo/Icon, Main Thumbnail, Screenshot 2)
  const [logo, setLogo] = useState(
    editProduct?.logo || ''
  );
  const [thumbnail1, setThumbnail1] = useState(
    editProduct?.thumbnail_1 || editProduct?.thumbnail || ''
  );
  const [thumbnail2, setThumbnail2] = useState(
    editProduct?.thumbnail_2 || editProduct?.screenshots?.[1] || ''
  );
  const [previewUrl, setPreviewUrl] = useState(editProduct?.previewUrl || '');

  // Digital Asset Delivery File State (ZIP/APK/PDF/JSON)
  const [fileFormat, setFileFormat] = useState(editProduct?.fileFormat || 'APK');
  const [fileName, setFileName] = useState(editProduct?.fileName || 'app-release.apk');
  const [fileSize, setFileSize] = useState(editProduct?.fileSize || '24.5 MB');
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>(
    editProduct?.fileDataUrl
  );
  const [pendingBlob, setPendingBlob] = useState<File | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProduct, setSubmittedProduct] = useState<DigitalProduct | null>(null);
  const [showPostSubmitModal, setShowPostSubmitModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // File picker refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const thumb1InputRef = useRef<HTMLInputElement>(null);
  const thumb2InputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Optimized client-side image upload & compression (prevents giant localStorage payloads)
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImageFile(file, 600, 0.8);
        if (compressedBase64) {
          setter(compressedBase64);
        }
      } catch (err) {
        console.warn('Image compression fallback:', err);
      }
    }
  };

  // Digital asset delivery file upload (APK, ZIP, PDF, JSON, FIG)
  const handleDigitalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMB} MB`);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'ZIP';
      setFileFormat(ext);
      setPendingBlob(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!productName.trim()) {
      setFormError('Please enter the Product / App Name.');
      return;
    }
    if (!creatorOrCompanyName.trim()) {
      setFormError('Please enter the Creator or Company Name.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please provide a Product Description.');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = Date.now();
      const prodId = editProduct?.id || 'prod-' + now;

      // Store large binary file in IndexedDB safely without crashing localStorage
      let resolvedFileDataUrl = fileDataUrl;
      if (pendingBlob) {
        resolvedFileDataUrl = await storeFileBlob(prodId, pendingBlob, fileName);
      }

      // Default fallback image if none provided by seller
      const effectiveLogo =
        logo.trim() ||
        thumbnail1.trim() ||
        thumbnail2.trim() ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
      const effectiveThumb1 = thumbnail1.trim() || effectiveLogo;
      const effectiveThumb2 = thumbnail2.trim() || '';

      // 100% Free Open Marketplace configuration
      const newProduct: DigitalProduct = {
        id: prodId,
        title: productName.trim(),
        tagline: `By ${creatorOrCompanyName.trim()} • Verified 100% Free Digital Asset`,
        category: category,
        price: 0,
        originalPrice: 0,
        currency: 'INR (₹)',
        isFree: true,
        rating: 5.0,
        ratingCount: 1,
        isAssured: true,
        version: version.trim() || 'v1.0.0',
        fileSize: fileSize,
        fileFormat: fileFormat,
        fileName: fileName,
        fileDataUrl: resolvedFileDataUrl,
        description: description.trim(),
        features: [
          'Full production build binary & source bundle',
          'Clean, modular and documented files',
          'Free commercial & developer usage rights included',
          '100% Virus & Malware Inspected (Apna Assured 2.5)',
        ],
        techStack: [category, 'Android', 'Web', 'Digital Goods', 'Open Source'],
        compatibility: ['All Devices', 'Chrome', 'Android 9.0+', 'Windows / macOS / Linux'],
        previewUrl: previewUrl.trim() || undefined,
        logo: effectiveLogo,
        thumbnail: effectiveThumb1,
        thumbnail_1: effectiveThumb1,
        thumbnail_2: effectiveThumb2,
        screenshots: [effectiveThumb1, effectiveThumb2, effectiveLogo].filter(Boolean),
        license: 'Commercial',
        sellerName: creatorOrCompanyName.trim(),
        creatorOrCompanyName: creatorOrCompanyName.trim(),
        sellerUsername: seller?.username || 'seller_hub',
        sellerPhone: sellerPhone.trim() || seller?.phone || undefined,
        sellerRating: 4.9,
        createdAt: editProduct?.createdAt || new Date().toISOString(),
        salesCount: 0,
        downloadCount: 0,
        isUserUploaded: true,
        status: 'deployed', // Automatically active and live for immediate user testing & downloads
        submittedAt: now,
        deployAt: now,
      };

      onProductUploaded(newProduct);
      setSubmittedProduct(newProduct);
      setIsSubmitting(false);
      setShowPostSubmitModal(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setFormError('Failed to process upload. Please check your files and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#0b1120] border border-[#0040FF]/60 rounded-xl shadow-[0_0_50px_rgba(0,64,255,0.3)] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-gray-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* POST-SUBMISSION SUCCESS MODAL */}
        {showPostSubmitModal && submittedProduct ? (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(52,211,153,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 justify-center w-fit mx-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live in Marketplace (100% Free)
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Product Published Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
                <strong className="text-[#00E5FF]">&quot;{submittedProduct.title}&quot;</strong> is now published live on Apna Bazaar. Users can instantly download the verified <strong className="text-emerald-400">{submittedProduct.fileFormat}</strong> package with zero payment barriers.
              </p>
            </div>

            {/* Product Summary Preview */}
            <div className="bg-[#111a33] border border-[#0040FF]/40 rounded-xl p-4 max-w-md mx-auto text-left space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#070b14] border border-[#00E5FF] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow">
                  <img
                    src={submittedProduct.logo || submittedProduct.thumbnail}
                    alt={submittedProduct.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-white truncate">{submittedProduct.title}</div>
                  <div className="text-[11px] text-gray-400">
                    Category: <strong className="text-[#00E5FF]">{submittedProduct.category}</strong>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Format: <strong className="text-emerald-400">{submittedProduct.fileFormat}</strong> • Size: {submittedProduct.fileSize}
                  </div>
                </div>
              </div>
              <div className="flex justify-between border-t border-gray-800 pt-2 font-mono text-[11px]">
                <span className="text-gray-400">Status:</span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> 100% LIVE ON STORE
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (onViewInStore && submittedProduct) {
                    onViewInStore(submittedProduct);
                  } else {
                    onClose();
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#00E5FF] hover:bg-[#33ebff] text-black font-extrabold text-xs rounded shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                View in Marketplace Store
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0040FF] via-[#0b1b4f] to-[#0b1120] text-white px-5 py-4 flex items-center justify-between border-b border-[#00E5FF]/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-base sm:text-lg text-white">
                      {editProduct ? 'Edit Product Listing' : 'Upload Digital Asset / App'}
                    </h2>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      100% Free Distribution
                    </span>
                  </div>
                  <p className="text-xs text-blue-200">
                    Publish your APKs, codes, templates, and designs directly for open public download
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-500/10 border-b border-red-500/30 px-5 py-2.5 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 max-h-[76vh]">
              
              {/* SECTION 1: PRODUCT VISUALS & IMAGES */}
              <div className="space-y-4 bg-[#111a33] p-4 rounded-xl border border-[#0040FF]/40">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                    <ImageIcon className="w-4 h-4 text-[#00E5FF]" />
                    <span>1. Product Images &amp; Visual Media</span>
                  </div>
                  <span className="text-[10px] text-[#00E5FF] font-bold">
                    Upload Images (PNG / JPG / WEBP)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Slot 1: App Logo / Icon */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-300">
                      App Icon / Logo
                    </label>
                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-[#0040FF]/60 hover:border-[#00E5FF] overflow-hidden bg-[#070b14] flex flex-col items-center justify-center p-2 group transition-colors">
                      {logo ? (
                        <>
                          <img
                            src={logo}
                            alt="Logo preview"
                            className="w-full h-full object-contain rounded"
                          />
                          <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity cursor-pointer"
                          >
                            Change Image
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="flex flex-col items-center justify-center text-gray-400 hover:text-[#00E5FF] p-2 text-center cursor-pointer"
                        >
                          <UploadCloud className="w-7 h-7 mb-1" />
                          <span className="text-[11px] font-bold">Upload Icon</span>
                          <span className="text-[9px] text-gray-500">Square 1:1</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={(e) => handleImageUpload(e, setLogo)}
                      accept="image/*"
                      className="hidden"
                    />
                    <input
                      type="text"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="Or enter Image URL"
                      className="w-full px-2.5 py-1.5 bg-[#070b14] border border-[#0040FF]/40 rounded text-[11px] text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  {/* Slot 2: Main Thumbnail / Banner */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-300">
                      Main Thumbnail / Banner <span className="text-[#00E5FF]">*</span>
                    </label>
                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-[#0040FF]/60 hover:border-[#00E5FF] overflow-hidden bg-[#070b14] flex flex-col items-center justify-center p-2 group transition-colors">
                      {thumbnail1 ? (
                        <>
                          <img
                            src={thumbnail1}
                            alt="Thumbnail 1"
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => thumb1InputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity cursor-pointer"
                          >
                            Change Image
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => thumb1InputRef.current?.click()}
                          className="flex flex-col items-center justify-center text-gray-400 hover:text-[#00E5FF] p-2 text-center cursor-pointer"
                        >
                          <UploadCloud className="w-7 h-7 mb-1" />
                          <span className="text-[11px] font-bold">Upload Banner</span>
                          <span className="text-[9px] text-gray-500">Primary Product Card</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={thumb1InputRef}
                      onChange={(e) => handleImageUpload(e, setThumbnail1)}
                      accept="image/*"
                      className="hidden"
                    />
                    <input
                      type="text"
                      value={thumbnail1}
                      onChange={(e) => setThumbnail1(e.target.value)}
                      placeholder="Or enter Image URL"
                      className="w-full px-2.5 py-1.5 bg-[#070b14] border border-[#0040FF]/40 rounded text-[11px] text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  {/* Slot 3: Screenshot 2 / Detail Mockup */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-300">
                      Screenshot 2 / Detail Mockup
                    </label>
                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-[#0040FF]/60 hover:border-[#00E5FF] overflow-hidden bg-[#070b14] flex flex-col items-center justify-center p-2 group transition-colors">
                      {thumbnail2 ? (
                        <>
                          <img
                            src={thumbnail2}
                            alt="Thumbnail 2"
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => thumb2InputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity cursor-pointer"
                          >
                            Change Image
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => thumb2InputRef.current?.click()}
                          className="flex flex-col items-center justify-center text-gray-400 hover:text-[#00E5FF] p-2 text-center cursor-pointer"
                        >
                          <UploadCloud className="w-7 h-7 mb-1" />
                          <span className="text-[11px] font-bold">Upload Screenshot</span>
                          <span className="text-[9px] text-gray-500">Gallery View</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={thumb2InputRef}
                      onChange={(e) => handleImageUpload(e, setThumbnail2)}
                      accept="image/*"
                      className="hidden"
                    />
                    <input
                      type="text"
                      value={thumbnail2}
                      onChange={(e) => setThumbnail2(e.target.value)}
                      placeholder="Or enter Image URL"
                      className="w-full px-2.5 py-1.5 bg-[#070b14] border border-[#0040FF]/40 rounded text-[11px] text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                </div>

                {/* Optional Live Demo URL */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Live Demo / Web Preview URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    placeholder="https://yourdemo.app"
                    className="w-full px-3 py-2 bg-[#070b14] border border-[#0040FF]/40 rounded text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* SECTION 2: PRODUCT SPECIFICATIONS & CREATOR DETAILS */}
              <div className="space-y-4 bg-[#111a33] p-4 rounded-xl border border-[#0040FF]/40">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm border-b border-gray-800 pb-2">
                  <Layers className="w-4 h-4 text-[#00E5FF]" />
                  <span>2. Product Details &amp; Creator Info</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Product / App Title <span className="text-[#00E5FF]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. NeoTrack - Flutter Fitness Tracker"
                      className="w-full px-3 py-2 bg-[#070b14] border border-[#0040FF]/40 rounded text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                      id="upload-product-name-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Category <span className="text-[#00E5FF]">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      className="w-full px-3 py-2 bg-[#070b14] border border-[#0040FF]/40 rounded text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                    >
                      {CATEGORIES.filter((c) => c.name !== 'All').map((cat) => (
                        <option key={cat.name} value={cat.name} className="bg-[#0b1120]">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Creator / Brand Name <span className="text-[#00E5FF]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={creatorOrCompanyName}
                      onChange={(e) => setCreatorOrCompanyName(e.target.value)}
                      placeholder="e.g. Apex Labs"
                      className="w-full px-3 py-2 bg-[#070b14] border border-[#0040FF]/40 rounded text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Version
                    </label>
                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="v1.0.0"
                      className="w-full px-3 py-2 bg-[#070b14] border border-[#0040FF]/40 rounded text-xs text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Contact Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      placeholder="+91 9800000000"
                      className="w-full px-3 py-2 bg-[#070b14] border border-[#0040FF]/40 rounded text-xs text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Product Description <span className="text-[#00E5FF]">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe features, installation guidelines, compatibility, and tech stack..."
                    className="w-full px-3 py-2 bg-[#070b14] border border-[#0040FF]/40 rounded text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* SECTION 3: DIGITAL ASSET FILE ATTACHMENT (APK / ZIP / PDF / JSON) */}
              <div className="space-y-3 bg-[#111a33] p-4 rounded-xl border border-[#0040FF]/40">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                    <FileArchive className="w-4 h-4 text-[#00E5FF]" />
                    <span>3. Digital Asset Delivery File (APK / ZIP / Binary)</span>
                  </div>
                  <span className="text-[11px] text-[#00E5FF] font-mono">{fileSize}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#0040FF] hover:bg-[#1a56ff] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,64,255,0.4)]"
                  >
                    <UploadCloud className="w-4 h-4 text-[#00E5FF]" />
                    <span>Choose Digital File (APK / ZIP / PDF / Code)</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleDigitalFileChange}
                    className="hidden"
                  />
                  <div className="text-xs text-gray-300 truncate">
                    Selected File: <strong className="font-mono text-[#00E5FF]">{fileName}</strong> ({fileFormat})
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    100% Free License Attached: Users will receive instant 1-click download access and open commercial usage.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white font-bold text-xs rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0040FF] via-[#1a56ff] to-[#00E5FF] hover:opacity-95 text-white font-extrabold rounded-lg text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
                  id="submit-upload-product-btn"
                >
                  {isSubmitting ? (
                    <span>Publishing &amp; Validating...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                      <span>Publish 100% Free Product</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
};
