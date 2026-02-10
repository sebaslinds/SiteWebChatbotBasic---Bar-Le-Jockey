import React, { useState } from 'react';
import { User } from '../types';
import { X, Mail, Loader2 } from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP' | 'CONFIRM';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('SIGNUP');
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMode('CONFIRM');
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const mockUser: User = {
        firstName: firstName || 'Sebastien',
        lastName: lastName || 'Lindsay',
        email: email,
        phone: phone
      };
      onLogin(mockUser);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0e0e0e]/95 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-transparent flex flex-col items-center animate-in zoom-in-95 duration-300">
        
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-8 select-none">
            <Logo className="w-48 md:w-56" />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 md:-right-12 text-white/50 hover:text-white transition-colors"
        >
          <X size={32} />
        </button>

        {/* --- SIGN UP FORM --- */}
        {mode === 'SIGNUP' && (
          <div className="w-full text-center">
            <h2 className="text-4xl font-serif text-brand-accent mb-6">Créer un compte</h2>
            <div className="w-12 h-px bg-white/20 mx-auto mb-6"></div>
            <p className="text-gray-400 mb-8 font-light text-sm">
              Lorsque vous créez un compte, vous pouvez recevoir des bulletins ou des promotions.
            </p>

            <form onSubmit={handleSignup} className="flex flex-col gap-4 max-w-lg mx-auto">
              <input 
                required
                type="text" 
                placeholder="Prénom" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full bg-[#e8f0fe] text-black px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              <input 
                required
                type="text" 
                placeholder="Nom" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full bg-[#e8f0fe] text-black px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              <input 
                required
                type="email" 
                placeholder="Adresse email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#e8f0fe] text-black px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              <input 
                required
                type="tel" 
                placeholder="Téléphone" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#e8f0fe] text-black px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              
              <div className="mt-8">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="px-10 py-4 rounded-full border border-brand-accent text-brand-accent uppercase text-xs font-bold tracking-[0.2em] hover:bg-brand-accent hover:text-black transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin inline" /> : 'CRÉER UN COMPTE'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-sm">
              <span className="text-gray-400">Vous avez déjà un compte ? </span>
              <button onClick={() => setMode('LOGIN')} className="text-brand-accent hover:underline">
                Se connecter
              </button>
            </div>

            <div className="mt-12 text-[10px] text-gray-500 max-w-md mx-auto leading-relaxed">
              Ce site est protégé par reCAPTCHA ; la <span className="text-brand-accent/70">Politique de confidentialité</span> et les <span className="text-brand-accent/70">Conditions d’utilisation</span> de Google s’appliquent.
            </div>
          </div>
        )}

        {/* --- CONFIRMATION SCREEN --- */}
        {mode === 'CONFIRM' && (
          <div className="w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center mb-8">
               <div className="relative">
                  <Mail size={64} className="text-brand-accent" strokeWidth={1} />
                  {/* Decorative lines similar to screenshot icon */}
                  <div className="absolute -bottom-2 -right-2 border-l border-b border-brand-accent w-8 h-8"></div>
               </div>
            </div>
            
            <h2 className="text-3xl font-serif text-white mb-6">Consultez vos emails</h2>
            
            <p className="text-gray-400 max-w-md mx-auto text-lg leading-relaxed font-light">
              Vous y êtes presque ! Nous avons envoyé à <span className="text-brand-accent">{email}</span> un email 
              contenant un lien pour activer votre compte. Veuillez vérifier votre email et 
              cliquer sur le lien d’activation.
            </p>

            <button 
              onClick={() => setMode('LOGIN')}
              className="mt-10 px-8 py-3 text-brand-dim hover:text-white underline decoration-brand-accent/30 hover:decoration-brand-accent underline-offset-4 transition-all"
            >
              Retour à la connexion
            </button>
          </div>
        )}

        {/* --- LOGIN SCREEN --- */}
        {mode === 'LOGIN' && (
          <div className="w-full text-center">
            <h2 className="text-4xl font-serif text-brand-accent mb-6">Connexion au compte</h2>
            <div className="w-12 h-px bg-white/20 mx-auto mb-6"></div>
            <p className="text-gray-400 mb-8 font-light text-sm max-w-lg mx-auto">
              Connectez-vous à votre compte pour accéder à votre profil, à votre historique et à toutes 
              les pages privées auxquelles vous avez accès.
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-lg mx-auto">
              <input 
                required
                type="email" 
                placeholder="Adresse email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/20 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-brand-accent transition-colors"
              />
              <input 
                required
                type="password" 
                placeholder="Mot de passe" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/20 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-brand-accent transition-colors"
              />
              
              <div className="mt-8">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="px-10 py-4 rounded-full border border-brand-accent text-brand-accent uppercase text-xs font-bold tracking-[0.2em] hover:bg-brand-accent hover:text-black transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin inline" /> : 'SE CONNECTER'}
                </button>
              </div>
            </form>

            <div className="mt-6">
               <button className="text-brand-accent/70 hover:text-brand-accent text-sm transition-colors">
                 Réinitialiser le mot de passe
               </button>
            </div>

            <div className="mt-8 text-sm">
              <span className="text-gray-400">Vous n’êtes pas membre ? </span>
              <button onClick={() => setMode('SIGNUP')} className="text-brand-accent hover:underline">
                Créez un compte.
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthModal;