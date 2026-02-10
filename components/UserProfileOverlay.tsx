import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { X } from 'lucide-react';
import { Logo } from './Logo';

interface UserProfileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  initialTab?: 'orders' | 'account';
}

const UserProfileOverlay: React.FC<UserProfileOverlayProps> = ({ isOpen, onClose, user, initialTab = 'orders' }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'account'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-[#0e0e0e] overflow-y-auto animate-in fade-in duration-300">
      {/* Header / Close */}
      <div className="absolute top-6 right-6 z-50">
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <X size={32} />
        </button>
      </div>

      {/* Main Container */}
      <div className="min-h-screen flex flex-col items-center pt-20 pb-10 px-6">
        
        {/* Logo (Optional background branding) */}
        <div className="flex flex-col items-center mb-16 select-none opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <Logo className="w-40" />
        </div>

        {/* Greeting */}
        <h1 className="text-4xl md:text-5xl font-serif text-brand-accent mb-20 text-center animate-in slide-in-from-bottom-5 duration-500">
          Bonjour, {user.firstName}
        </h1>

        {/* Content Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20">
          
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 flex flex-col gap-6 text-left border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 pr-0 md:pr-8">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`text-lg font-bold transition-colors text-left ${activeTab === 'orders' ? 'text-brand-accent' : 'text-brand-dim hover:text-white'}`}
            >
              Commandes
            </button>
            <button 
              onClick={() => setActiveTab('account')}
              className={`text-lg font-bold transition-colors text-left ${activeTab === 'account' ? 'text-brand-accent' : 'text-brand-dim hover:text-white'}`}
            >
              Compte
            </button>
          </div>

          {/* Tab Content */}
          <div className="md:col-span-3 min-h-[300px]">
            {activeTab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-serif text-white mb-6">Historique des commandes</h2>
                <p className="text-brand-dim font-light text-lg">Vous n’avez pas encore de commandes</p>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-serif text-white mb-10">{user.firstName} {user.lastName}</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1">Email</h3>
                    <p className="text-brand-dim font-light">{user.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1">Téléphone</h3>
                    <p className="text-brand-dim font-light">{user.phone || '-'}</p>
                  </div>

                  <div className="pt-4">
                    <button className="text-brand-accent hover:text-white transition-colors text-sm underline underline-offset-4 decoration-brand-accent/30 hover:decoration-brand-accent">
                      Modifier le profil
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-20 text-center text-sm font-light">
          <p className="text-white font-bold mb-2">Bar Le Jockey</p>
          <p className="text-brand-accent mb-4">(514) 718-1537</p>
          <p className="text-brand-dim text-xs opacity-50">Copyright © {new Date().getFullYear()} Bar Le Jockey</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileOverlay;