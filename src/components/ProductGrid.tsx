import React, { useState } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Star,
  RotateCcw,
  UploadCloud,
  Sparkles,
  PackageX,
  FileCode,
  ShieldCheck,
  Check,
  Layers,
  ArrowUpDown,
  Gift
} from 'lucide-react';
import { DigitalProduct, FilterState, ProductCategory, LicenseType } from '../types';
import { POPULAR_FORMATS, TECH_STACKS } from '../data/categories';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: DigitalProduct[];
  filters: FilterState;
  appStyle?: 'new' | 'old';
  onFilterChange: (filters: FilterState) => void;
  isWishlisted: (id: string) => boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: DigitalProduct) => void;
  onQuickBuy: (product: DigitalProduct) => void;
  onSelectProduct: (product: DigitalProduct) => void;
  onOpenUpload: () => void;
  onSeedDemo: () => void;
  totalUnfilteredCount: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  filters,
  appStyle = 'new',
  onFilterChange,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickBuy,
  onSelectProduct,
  onOpenUpload,
  onSeedDemo,
  totalUnfilteredCount,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const isOldStyle = appStyle === 'old';

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  const handleRatingChange = (minRating: number) => {
    onFilterChange({ ...filters, minRating: filters.minRating === minRating ? 0 : minRating });
  };

  const handleFormatToggle = (format: string) => {
    const exists = filters.selectedFormats.includes(format);
    const updated = exists
      ? filters.selectedFormats.filter((f) => f !== format)
      : [...filters.selectedFormats, format];
    onFilterChange({ ...filters, selectedFormats: updated });
  };

  const handleLicenseToggle = (license: LicenseType) => {
    const exists = filters.selectedLicenses.includes(license);
    const updated = exists
      ? filters.selectedLicenses.filter((l) => l !== license)
      : [...filters.selectedLicenses, license];
    onFilterChange({ ...filters, selectedLicenses: updated });
  };

  const resetFilters = () => {
    onFilterChange({
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
  };

  const FilterContent = (
    <div
      className={`rounded-2xl border divide-y text-sm shadow-lg ${
        isOldStyle
          ? 'bg-slate-900 border-amber-500/30 divide-slate-800 text-slate-200'
          : 'bg-[#0b1120] border-[#0040FF]/40 divide-gray-800 text-gray-300 shadow-[0_0_25px_rgba(0,64,255,0.1)]'
      }`}
    >
      {/* Header */}
      <div className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-black text-white text-base">
          <SlidersHorizontal className={`w-4 h-4 ${isOldStyle ? 'text-amber-400' : 'text-[#00E5FF]'}`} />
          <span>{isOldStyle ? 'फ़िल्टर (Filters)' : 'Filters & Formats'}</span>
        </div>
        <button
          onClick={resetFilters}
          className={`text-xs font-bold hover:underline cursor-pointer flex items-center gap-1 ${
            isOldStyle ? 'text-amber-400' : 'text-[#00E5FF]'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
          <span>CLEAR ALL</span>
        </button>
      </div>

      {/* 100% Free Badge Filter Box */}
      <div className="p-3 sm:p-4 space-y-1 bg-emerald-950/20">
        <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
          <Gift className="w-4 h-4 text-emerald-400" />
          <span>100% Free Open Marketplace</span>
        </div>
        <p className="text-[11px] text-gray-400">
          All {totalUnfilteredCount} digital assets are available for free instant download.
        </p>
      </div>

      {/* Assured Filter */}
      <div className="p-3 sm:p-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span className={isOldStyle ? 'text-amber-300 font-black' : 'text-[#00E5FF] italic font-black'}>
              {isOldStyle ? 'अपना प्रमाणित' : 'Apna Assured'}
            </span>
            <span className="text-emerald-400 font-bold">✔</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded font-black uppercase border border-emerald-500/40">
              Verified
            </span>
          </div>
          <input
            type="checkbox"
            checked={filters.onlyAssured}
            onChange={(e) => onFilterChange({ ...filters, onlyAssured: e.target.checked })}
            className="w-4 h-4 text-emerald-500 rounded border-gray-700 bg-gray-900 focus:ring-emerald-400"
          />
        </label>
      </div>

      {/* Customer Ratings Filter */}
      <div className="p-3 sm:p-4 space-y-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
          Customer Rating
        </span>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => handleRatingChange(stars)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                filters.minRating === stars
                  ? isOldStyle
                    ? 'bg-amber-600/30 text-amber-200 border border-amber-400/50'
                    : 'bg-[#0040FF]/30 text-[#00E5FF] border border-[#00E5FF]/40'
                  : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>{stars}★ &amp; above</span>
              </div>
              {filters.minRating === stars && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* File Formats Filter */}
      <div className="p-3 sm:p-4 space-y-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
          File Formats
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {POPULAR_FORMATS.map((fmt) => {
            const isSelected = filters.selectedFormats.includes(fmt);
            return (
              <button
                key={fmt}
                onClick={() => handleFormatToggle(fmt)}
                className={`px-2 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? isOldStyle
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-[#0040FF] text-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'bg-black/30 text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                <span>{fmt}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* License Type Filter */}
      <div className="p-3 sm:p-4 space-y-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
          License Type
        </span>
        <div className="space-y-1.5">
          {(['Standard', 'Commercial', 'Extended', 'Open Source', 'Reseller'] as LicenseType[]).map(
            (lic) => {
              const isSelected = filters.selectedLicenses.includes(lic);
              return (
                <label
                  key={lic}
                  className="flex items-center justify-between text-xs text-gray-300 hover:text-white cursor-pointer"
                >
                  <span>{lic}</span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleLicenseToggle(lic)}
                    className="w-3.5 h-3.5 text-emerald-500 rounded border-gray-700 bg-gray-900"
                  />
                </label>
              );
            }
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Top Controls: Filter Toggle (Mobile) + Sort Dropdown */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className={`lg:hidden flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold text-white transition-colors cursor-pointer ${
              isOldStyle
                ? 'bg-slate-900 border-amber-500/40 hover:bg-slate-800'
                : 'bg-[#0d1424] border-[#0040FF]/40 hover:bg-[#111a33]'
            }`}
          >
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Filters</span>
          </button>

          <span className="text-xs sm:text-sm text-gray-400">
            Showing <strong className="text-white">{products.length}</strong> of{' '}
            <strong className="text-emerald-400">{totalUnfilteredCount}</strong> free assets
          </span>
        </div>

        {/* Sort Options Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider hidden sm:inline">
            Sort by:
          </span>
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-gray-800 text-xs">
            {[
              { id: 'popularity', label: 'Popular' },
              { id: 'rating', label: 'Top Rated' },
              { id: 'newest', label: 'Newest' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => handleSortChange(s.id as any)}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                  filters.sortBy === s.id
                    ? isOldStyle
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-[#0040FF] text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout: Filters (Left) + Product Cards Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Desktop Sidebar Filter (3 cols) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24 space-y-4">
          {FilterContent}
        </div>

        {/* Mobile Filter Slide Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-gray-700">
                <span className="font-bold text-white">Marketplace Filters</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-white font-bold p-1"
                >
                  ✕ Close
                </button>
              </div>
              {FilterContent}
            </div>
          </div>
        )}

        {/* Right Products Grid (9 cols) */}
        <div className="lg:col-span-9">
          {products.length === 0 ? (
            <div
              className={`rounded-2xl border p-8 sm:p-12 text-center space-y-4 ${
                isOldStyle ? 'bg-slate-900 border-amber-500/30' : 'bg-[#0b1120] border-[#0040FF]/30'
              }`}
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white">
                  No Matching Digital Products Found
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                  Try adjusting your filter selection or clear all search keywords to see our full catalog.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Reset All Filters
                </button>

                <button
                  onClick={onSeedDemo}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow"
                >
                  Reload Sample Catalog
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  appStyle={appStyle}
                  isWishlisted={isWishlisted(prod.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onQuickBuy={onQuickBuy}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
