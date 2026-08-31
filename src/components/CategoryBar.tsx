import React from 'react';
import {
  LayoutGrid,
  Smartphone,
  Code,
  Palette,
  BookOpen,
  Image as ImageIcon,
  Box,
  Music,
  Terminal
} from 'lucide-react';
import { ProductCategory } from '../types';
import { CATEGORIES } from '../data/categories';

interface CategoryBarProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutGrid': return <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Code': return <Code className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Palette': return <Palette className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Image': return <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Box': return <Box className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Music': return <Music className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Terminal': return <Terminal className="w-5 h-5 sm:w-6 sm:h-6" />;
      default: return <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  return (
    <div className="bg-[#0b1120] border-b border-[#0040FF]/30 shadow-md mb-3 sm:mb-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-6 overflow-x-auto py-2.5 sm:py-3 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`group flex flex-col items-center justify-center shrink-0 min-w-[72px] sm:min-w-[84px] py-1 px-2 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'text-[#00E5FF] font-bold bg-[#0040FF]/25 border-b-2 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'text-gray-400 hover:text-white font-medium hover:bg-white/5'
                }`}
                id={`category-btn-${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                <div
                  className={`p-2 rounded-full mb-1 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0040FF] to-[#00E5FF] text-black shadow-[0_0_10px_#00E5FF]'
                      : 'bg-[#070b14] border border-gray-800 text-gray-400 group-hover:border-[#0040FF] group-hover:text-[#00E5FF]'
                  }`}
                >
                  {getCategoryIcon(cat.iconName)}
                </div>
                <div className="relative flex flex-col items-center">
                  <span className="text-[11px] sm:text-xs whitespace-nowrap leading-tight text-center">
                    {cat.label}
                  </span>
                  {cat.badge && (
                    <span className="absolute -top-6 -right-3 bg-[#00E5FF] text-black text-[9px] font-black px-1.5 py-0.2 rounded-full scale-90 shadow-[0_0_8px_#00E5FF]">
                      {cat.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
