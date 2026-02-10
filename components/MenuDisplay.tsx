import React, { useState } from 'react';
import { BAR_DATA } from '../data/barData';
import { MenuItem } from '../types';
import { MessageCircle, Wine, ScrollText, X } from 'lucide-react';

interface MenuDisplayProps {
  addToCart: (item: MenuItem) => void;
  onCustomizeItem: (item: MenuItem) => void;
  language: 'fr' | 'en';
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ addToCart, onCustomizeItem, language }) => {
  // Dynamically extract available categories from the data to avoid empty tabs
  const availableCategories = Array.from(new Set(BAR_DATA.menu.map(item => item.category)));
  
  // Default to the first available category, or 'Nouveaux Signatures' if empty
  const [activeCategory, setActiveCategory] = useState<MenuItem['category']>(
    (availableCategories.includes('Special') ? 'Special' : availableCategories[0]) || 'Cocktails'
  );

  // Track which recipe tooltip is open (by item name)
  const [activeRecipe, setActiveRecipe] = useState<string | null>(null);

  const filteredItems = BAR_DATA.menu.filter(item => item.category === activeCategory);
  
  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  // Helper to find the English name of the category for the tab label
  const getCategoryLabel = (cat: string) => {
    if (language === 'fr') return cat;
    const itemWithCat = BAR_DATA.menu.find(i => i.category === cat);
    return itemWithCat?.categoryEn || cat;
  };

  const toggleRecipe = (itemName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeRecipe === itemName) {
      setActiveRecipe(null);
    } else {
      setActiveRecipe(itemName);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-20">
      
      {/* Decorative Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-accent mb-4 tracking-tighter">
            {t('LE MENU', 'THE MENU')}
        </h2>
        <div className="w-24 h-1 bg-brand-accent mx-auto mb-4"></div>
        <p className="text-brand-dim italic font-light tracking-wide">
            {t('Une sélection curée pour votre plaisir', 'A curated selection for your pleasure')}
        </p>
      </div>
      
      {/* Category Tabs - Scrollable for Mobile Swipe */}
      <div className="relative mb-16">
        <div className="flex overflow-x-auto gap-8 pb-6 border-b border-white/10 scrollbar-hide snap-x px-4 md:px-0 justify-start md:justify-center">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat as MenuItem['category']);
                setActiveRecipe(null); // Close tooltips when changing category
              }}
              className={`text-lg uppercase tracking-[0.15em] font-serif transition-all duration-300 pb-2 border-b-2 px-2 whitespace-nowrap snap-center flex-shrink-0 ${
                activeCategory === cat
                  ? 'text-brand-accent border-brand-accent'
                  : 'text-brand-dim border-transparent hover:text-white hover:border-white/20'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
        {/* Fade effect on right for scroll indication on mobile */}
        <div className="absolute right-0 top-0 bottom-6 w-12 bg-gradient-to-l from-brand-dark to-transparent md:hidden pointer-events-none"></div>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredItems.map((item, index) => {
          // Logic to determine if this is a custom flow item
          const isCustomItem = item.category === 'Special' || item.name === 'Cocktail Sur Mesure';
          const isRecipeOpen = activeRecipe === item.name;
          
          // Localization
          const displayName = language === 'en' && item.nameEn ? item.nameEn : item.name;
          const displayDesc = language === 'en' && item.descriptionEn ? item.descriptionEn : item.description;
          const displaySpirit = language === 'en' && item.baseSpiritEn ? item.baseSpiritEn : item.baseSpirit;
          const displayProfile = language === 'en' && item.tastingProfileEn ? item.tastingProfileEn : item.tastingProfile;

          return (
            <div key={index} className="group relative bg-[#151515] p-6 sm:p-8 rounded-lg border border-white/5 hover:border-brand-accent/40 transition-all duration-300 flex flex-col h-full animate-in slide-in-from-bottom-4 fade-in duration-500" style={{ animationDelay: `${index * 50}ms` }}>
              
              {/* TOP ROW: Spirit Badge & Price */}
              <div className="flex justify-between items-start mb-3">
                 {displaySpirit ? (
                   <span className="inline-block bg-brand-accent text-black text-[11px] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded-sm shadow-sm">
                     {displaySpirit}
                   </span>
                 ) : (
                   <div></div> /* Spacer */
                 )}
                 <span className="font-serif text-lg text-brand-accent font-medium">{item.price}</span>
              </div>

              {/* Name */}
              <h3 className="font-serif font-bold text-2xl text-white mb-3 group-hover:text-brand-accent transition-colors duration-300 leading-none">
                {displayName}
              </h3>

              {/* PROMINENT TASTING PROFILE */}
              {displayProfile && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                    <Wine size={16} className="text-brand-accent shrink-0" />
                    <span className="text-sm font-medium text-white/90 italic font-serif tracking-wide">
                      {displayProfile}
                    </span>
                </div>
              )}

              {/* Spacer to push button to bottom */}
              <div className="flex-grow"></div>

              {/* Action Area */}
              <div className="flex justify-end pt-4 relative">
                
                {/* TOOLTIP BUBBLE */}
                {isRecipeOpen && !isCustomItem && (
                  <div className="absolute bottom-[115%] right-0 w-64 bg-[#0e0e0e] border border-brand-accent p-4 rounded-lg shadow-2xl z-20 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start mb-2 border-b border-white/10 pb-2">
                       <span className="text-brand-accent text-xs font-bold uppercase tracking-widest">{t('Ingrédients', 'Ingredients')}</span>
                       <button onClick={(e) => toggleRecipe(item.name, e)} className="text-white/50 hover:text-white">
                         <X size={14} />
                       </button>
                    </div>
                    <p className="text-white text-sm font-light leading-relaxed">
                      {displayDesc}
                    </p>
                    {/* Tiny triangle for speech bubble effect */}
                    <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0e0e0e] border-b border-r border-brand-accent rotate-45"></div>
                  </div>
                )}

                {/* BUTTONS */}
                {isCustomItem ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomizeItem(item);
                    }}
                    className="flex items-center gap-2 text-xs uppercase font-bold text-brand-accent hover:text-black bg-brand-accent/10 hover:bg-brand-accent tracking-widest border border-brand-accent/30 hover:border-brand-accent px-5 py-3 rounded-sm transition-all duration-300"
                  >
                    <MessageCircle size={14} />
                    {t('Personnaliser', 'Customize')}
                  </button>
                ) : (
                  <button 
                    onClick={(e) => toggleRecipe(item.name, e)}
                    className={`flex items-center gap-2 text-xs uppercase font-bold tracking-widest border px-5 py-3 rounded-sm transition-all duration-300 ${
                      isRecipeOpen 
                        ? 'bg-brand-accent text-black border-brand-accent'
                        : 'text-white hover:text-black hover:bg-brand-accent bg-[#1a1a1a] border-white/10 hover:border-brand-accent'
                    }`}
                  >
                    <ScrollText size={14} />
                    {t('Recette', 'Recipe')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center text-brand-dim py-10 italic">
            {t('Menu en cours de mise à jour...', 'Menu is being updated...')}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuDisplay;