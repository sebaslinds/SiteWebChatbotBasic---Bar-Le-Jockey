import React from 'react';
import { BAR_DATA } from '../data/barData';
import { ProductItem } from '../types';
import { ShoppingBag, ChevronDown } from 'lucide-react';

interface ProductDisplayProps {
  addToCart: (product: ProductItem) => void;
  language: 'fr' | 'en';
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ addToCart, language }) => {
  // Use French categories as keys, but we can display the English version
  const allowedCategories = ['Vêtements', 'Accessoires'];
  
  const merchProducts = BAR_DATA.products.filter(product => 
    product.category && allowedCategories.includes(product.category)
  );

  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  // Helper to get category display label
  const getCategoryLabel = (cat: string) => {
      if (language === 'fr') return cat;
      const product = BAR_DATA.products.find(p => p.category === cat);
      return product?.categoryEn || cat;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 border-b border-white/5">
      
      {/* Header of Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div className="mb-6 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-accent mb-2">
            {t("Boutique Jockey", "Jockey Shop")}
          </h2>
          <p className="text-brand-dim font-light text-sm tracking-wide uppercase">
            {t("Vêtements & Accessoires", "Clothing & Accessories")}
          </p>
        </div>

        {/* Sort Mimic */}
        <div className="flex items-center gap-2 text-sm text-brand-dim cursor-pointer hover:text-white transition-colors">
          <span>{t("Les plus populaires", "Most Popular")}</span>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Filter (Mimic) */}
        <div className="w-full md:w-1/4 hidden md:block">
           <h3 className="text-brand-accent font-bold mb-4">{t("Catégories", "Categories")}</h3>
           <ul className="space-y-2 text-brand-dim text-sm">
             <li className="text-white font-medium cursor-pointer">{t("Tous les produits", "All Products")}</li>
             {allowedCategories.map(cat => (
               <li key={cat} className="hover:text-brand-accent cursor-pointer transition-colors">
                 {getCategoryLabel(cat)}
               </li>
             ))}
           </ul>
        </div>

        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchProducts.length > 0 ? (
              merchProducts.map((product) => {
                const displayName = language === 'en' && product.nameEn ? product.nameEn : product.name;

                return (
                  <div key={product.id} className="group cursor-pointer">
                    {/* Image Container */}
                    <div className="relative aspect-square bg-[#1a1a1a] rounded-sm overflow-hidden mb-4 border border-white/5 group-hover:border-brand-accent/30 transition-all">
                      <img 
                        src={product.image} 
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Sale Badge */}
                      {product.isOnSale && (
                        <div className="absolute top-2 right-2 bg-brand-accent text-black text-[10px] font-bold uppercase px-2 py-1 tracking-wider">
                          {t("Soldes", "Sale")}
                        </div>
                      )}

                      {/* Add to Cart Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="flex items-center gap-2 text-xs uppercase font-bold text-white hover:text-brand-accent tracking-widest"
                        >
                           <ShoppingBag size={14} />
                           {t("Ajouter", "Add")}
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div>
                      <h4 className="text-white font-serif text-lg leading-tight mb-1 group-hover:text-brand-accent transition-colors">{displayName}</h4>
                      <div className="flex items-center gap-2 font-light text-sm">
                        {product.isOnSale && product.salePrice ? (
                          <>
                            <span className="text-brand-dim/60 line-through">{product.price}</span>
                            <span className="text-[#ff4d4d]">{product.salePrice}</span>
                          </>
                        ) : (
                          <span className="text-brand-dim">{product.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-brand-dim italic py-12">
                {t("Aucun produit disponible pour le moment.", "No products available at the moment.")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;