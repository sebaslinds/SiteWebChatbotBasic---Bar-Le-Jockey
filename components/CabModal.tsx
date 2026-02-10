import React from 'react';
import { X, Phone, Car } from 'lucide-react';
import { Logo } from './Logo';

interface CabModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fr' | 'en';
}

const CabModal: React.FC<CabModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0e0e0e]/95 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-lg p-8 flex flex-col items-center shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-6 opacity-80">
            <Logo className="w-32" />
        </div>

        <h2 className="text-2xl font-serif text-white mb-2 text-center">{t("Bien rentrer", "Get Home Safe")}</h2>
        <p className="text-brand-dim text-sm text-center mb-8 font-light">
          {t("La sécurité avant tout. Choisissez votre option de transport.", "Safety first. Choose your ride option.")}
        </p>

        <div className="w-full space-y-4">
          {/* TAXI BUTTON */}
          <a 
            href="tel:5148360000"
            className="group w-full flex items-center justify-between bg-[#222] hover:bg-white hover:text-black border border-white/10 p-4 rounded transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-brand-accent/20 text-brand-accent group-hover:bg-black/10 group-hover:text-black p-3 rounded-full transition-colors">
                <Phone size={24} />
              </div>
              <div className="text-left">
                <div className="font-bold text-lg leading-none">Taxis Coop</div>
                <div className="text-xs opacity-60 mt-1">514-836-0000</div>
              </div>
            </div>
          </a>

          {/* UBER BUTTON */}
          <a 
            href="https://m.uber.com/ul/"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center justify-between bg-[#222] hover:bg-black hover:border-brand-accent border border-white/10 p-4 rounded transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-black text-white p-3 rounded-full transition-colors border border-white/20">
                <Car size={24} />
              </div>
              <div className="text-left">
                <div className="font-bold text-lg leading-none text-white group-hover:text-brand-accent">Uber</div>
                <div className="text-xs text-brand-dim mt-1">{t("Ouvrir l'application", "Open App")}</div>
              </div>
            </div>
          </a>
        </div>

        <div className="mt-8 text-[10px] text-brand-dim/50 uppercase tracking-widest text-center">
          Bar Le Jockey • Rosemont
        </div>
      </div>
    </div>
  );
};

export default CabModal;