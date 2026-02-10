import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, X, Trash2, CreditCard, Instagram, Facebook, Mail, Sparkles, Globe, User, Loader2, MapPin } from 'lucide-react';
import MenuDisplay from './components/MenuDisplay';
import ChatInterface from './components/ChatInterface';
import ProductDisplay from './components/ProductDisplay';
import CabModal from './components/CabModal';
import Logo from './components/Logo';
import { MenuItem, ProductItem, CartItem, Message } from './types';
import { BAR_DATA } from './data/barData';
import { sendMessageToGemini, transcribeAudio } from './services/geminiService';
import { submitOrderToFirebase } from './services/firebase';

const GREETING_FR = "Salut ! Je suis ton barman virtuel. \n\nJe peux te conseiller des cocktails, te donner des recettes ou appeler un taxi.\n\nQuelle est ton envie du moment ?";
const GREETING_EN = "Hi! I'm your virtual bartender. \n\nI can suggest cocktails, share recipes, or call a cab.\n\nWhat are you in the mood for?";

const App: React.FC = () => {
  // --- STATE ---
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout State
  const [paymentMethod, setPaymentMethod] = useState<'DEBIT' | 'CASH'>('DEBIT');
  const [customerIdentifier, setCustomerIdentifier] = useState(''); // Table number or Name
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: GREETING_FR, 
      timestamp: new Date() 
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isCabModalOpen, setIsCabModalOpen] = useState(false);

  // --- HELPERS ---
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  // Sync Initial Greeting with Language
  useEffect(() => {
    setMessages(prev => {
      // Only translate the greeting if it's the very first message and hasn't been interacted with
      if (prev.length === 1 && prev[0].role === 'model') {
        return [{
          ...prev[0],
          text: language === 'fr' ? GREETING_FR : GREETING_EN
        }];
      }
      return prev;
    });
  }, [language]);

  const cartTotal = cart.reduce((total, item) => {
    const priceString = item.price.split('/')[0].replace('$', '').replace(',', '.').trim();
    const price = parseFloat(priceString) || 0;
    return total + (price * item.quantity);
  }, 0);

  const addToCart = (item: MenuItem | ProductItem, quantity = 1, customPrice?: string) => {
    setCart(prev => {
      const finalPrice = customPrice || (item as ProductItem).salePrice || item.price;
      const cartItemId = `${item.name}-${finalPrice}`;
      
      const existing = prev.find(i => i.id === cartItemId);
      if (existing) {
        return prev.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        id: cartItemId,
        name: item.name,
        price: finalPrice,
        image: item.image,
        quantity,
        type: (item as ProductItem).id ? 'product' : 'menu'
      }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  const handleSendMessage = async (text: string) => {
    const newUserMsg: Message = { role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, newUserMsg]);
    setIsChatLoading(true);

    try {
      // We removed the order callback, so the AI will simply advise.
      const responseText = await sendMessageToGemini(
        text,
        language,
        () => setIsCabModalOpen(true) 
      );

      const newModelMsg: Message = { 
        role: 'model', 
        text: responseText, 
        timestamp: new Date(),
        isPaymentRequest: false
      };
      setMessages(prev => [...prev, newModelMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: t("Désolé, une erreur est survenue.", "Sorry, an error occurred."), timestamp: new Date() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleTranscribeAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
     try {
       return await transcribeAudio(audioBase64, mimeType, language);
     } catch (e) {
       console.error("Transcription failed", e);
       return "";
     }
  };

  const handleTriggerPayment = () => {
    setIsCartOpen(true);
    setIsChatOpen(false);
  };

  const handleCustomizeItem = (item: MenuItem) => {
    setIsChatOpen(true);
    // Changed prompt from ordering to asking about the drink
    const prompt = language === 'fr' 
      ? `Parle-moi du cocktail ${item.name} et de ses saveurs.` 
      : `Tell me about the ${item.name} cocktail and its flavors.`;
    handleSendMessage(prompt);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerIdentifier.trim()) {
        alert(t("Veuillez indiquer votre nom ou numéro de table.", "Please enter your name or table number."));
        return;
    }

    setIsSubmittingOrder(true);

    try {
        await submitOrderToFirebase({
            customerName: customerIdentifier,
            items: cart,
            totalPrice: cartTotal,
            paymentMethod: paymentMethod,
            language: language,
            status: 'pending'
        });

        setIsPaymentSuccess(true);
        setTimeout(() => {
            setCart([]);
            setCustomerIdentifier('');
            setIsPaymentSuccess(false);
            setIsCartOpen(false);
            // Optional: Send a chat message confirming
            setMessages(prev => [...prev, {
                role: 'model',
                text: language === 'fr' 
                  ? "Merci ! Votre commande est en cuisine." 
                  : "Thanks! Your order is being prepared.",
                timestamp: new Date()
            }]);
        }, 1500); 

    } catch (error) {
        console.error("Failed to submit order", error);
        alert(t("Erreur lors de l'envoi de la commande. Veuillez réessayer.", "Error submitting order. Please try again."));
    } finally {
        setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans selection:bg-brand-accent selection:text-black relative">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-40 bg-[#0e0e0e]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="md:hidden font-serif font-bold text-xl text-brand-accent tracking-widest">
             LE JOCKEY
           </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Language Toggle */}
          <button 
             onClick={toggleLanguage}
             className="text-white text-xs font-bold border border-white/20 px-2 py-1 rounded hover:bg-white hover:text-black transition-all flex items-center gap-1"
          >
             <Globe size={12} />
             {language === 'fr' ? 'EN' : 'FR'}
          </button>

          <a 
            href="https://www.google.com/maps/search/?api=1&query=Bar+Le+Jockey+1309+Rue+Saint-Zotique+Est+Montréal+QC" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-brand-dim hover:text-white transition-colors"
            aria-label="Localisation"
          >
            <MapPin size={20} />
          </a>

          <a 
            href="https://www.instagram.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-brand-dim hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
          <a 
            href="https://www.facebook.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-brand-dim hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative text-brand-dim hover:text-white transition-colors ml-2"
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-accent text-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* --- HERO --- */}
      <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/50 to-transparent"></div>
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=1920&q=80" 
            alt="Bar Interior" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative z-10 text-center px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Logo className="w-64 md:w-96 mx-auto mb-8" />
          <p className="text-brand-accent uppercase tracking-[0.3em] text-sm md:text-base mb-8">
            Est. 2013 • Rosemont, Montréal
          </p>
          <button 
            onClick={() => document.getElementById('menu')?.scrollIntoView({behavior: 'smooth'})}
            className="border border-white/20 hover:bg-brand-accent hover:text-black hover:border-brand-accent text-white px-8 py-3 uppercase text-xs font-bold tracking-[0.2em] transition-all duration-300"
          >
            {t("Voir le menu", "View Menu")}
          </button>
        </div>
      </header>

      {/* --- MENU SECTION --- */}
      <section id="menu" className="relative z-10 bg-[#0e0e0e]">
        <MenuDisplay 
          addToCart={addToCart} 
          onCustomizeItem={handleCustomizeItem} 
          language={language}
        />
      </section>

      {/* --- MERCH SECTION --- */}
      <section id="merch" className="bg-[#121212]">
        <ProductDisplay addToCart={addToCart} language={language} />
      </section>

      {/* --- EVENTS SECTION --- */}
      <section id="events" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-accent mb-4">
            {t("ÉVÉNEMENTS", "EVENTS")}
          </h2>
          <div className="w-16 h-1 bg-brand-accent mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {BAR_DATA.events.map((event, idx) => {
            const mailSubject = `Réservation - ${event.name}`;
            const mailBody = `Bonjour,\n\nJe souhaite réserver une table pour la soirée ${event.name}.\n\nDate souhaitée : ${event.date}\nNombre de personnes : \nHeure d'arrivée :\n\nNom :\n\nMerci !`;
            const mailToLink = `mailto:info@barlejockey.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

            // Localization
            const displayName = language === 'en' && event.nameEn ? event.nameEn : event.name;
            const displayDate = language === 'en' && event.dateEn ? event.dateEn : event.date;
            const displayDesc = language === 'en' && event.descriptionEn ? event.descriptionEn : event.description;

            return (
              <div key={idx} className="bg-[#1a1a1a] p-8 border border-white/5 hover:border-brand-accent/30 transition-colors group flex flex-col justify-between h-full">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-brand-accent/10 text-brand-accent p-3 rounded-sm group-hover:bg-brand-accent group-hover:text-black transition-colors shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-white mb-1">{displayName}</h3>
                    <div className="text-sm text-brand-accent font-bold uppercase tracking-wider mb-3">
                      {displayDate} • {event.time}
                    </div>
                    <p className="text-brand-dim font-light text-sm leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>
                </div>

                <div className="pl-[60px] md:pl-[68px]">
                   <a 
                     href={mailToLink}
                     className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border border-white/20 hover:bg-brand-accent hover:text-black hover:border-brand-accent px-4 py-2 rounded-sm transition-all duration-300"
                   >
                     <Mail size={14} />
                     {t("Réserver", "Book Now")}
                   </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- CUSTOM EVENT / BOOKING BLOCK --- */}
        <div className="border border-white/10 bg-[#151515] p-10 md:p-12 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent"></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="bg-brand-accent/10 p-4 rounded-full text-brand-accent mb-6">
                <Sparkles size={32} />
             </div>
             
             <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">
               {t("Un Événement à Célébrer ?", "Celebrate an Event?")}
             </h3>
             <p className="text-brand-dim mb-8 font-light text-lg max-w-xl mx-auto leading-relaxed">
               {t(
                 "Anniversaire, Party de bureau, Lancement ou Concert... Le Jockey est l'endroit idéal pour vos rassemblements privés ou corporatifs.",
                 "Birthday, Office Party, Launch or Concert... Le Jockey is the ideal place for your private or corporate gatherings."
               )}
             </p>
             
             <a 
               href="mailto:info@barlejockey.com?subject=Demande%20de%20Privatisation%20%2F%20%C3%89v%C3%A9nement&body=Bonjour..."
               className="inline-flex items-center gap-3 px-8 py-4 bg-brand-accent text-black font-bold uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-white transition-all duration-300 shadow-lg shadow-brand-accent/10"
             >
               <Mail size={16} />
               {t("Organiser un événement", "Host an Event")}
             </a>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>

      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black py-12 px-6 border-t border-white/5 text-center">
        <p className="text-brand-dim text-sm font-light">
          1309 Rue Saint-Zotique Est, Montréal, QC H2G 1G6
        </p>
      </footer>


      {/* --- CART DRAWER --- */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-[#121212] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-serif text-2xl text-white">{t("Votre Commande", "Your Order")}</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-white/50 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-brand-dim mt-20">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                  <p>{t("Votre panier est vide.", "Your cart is empty.")}</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-4 items-center">
                     <div className="w-16 h-16 bg-[#222] rounded overflow-hidden flex-shrink-0">
                       {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                     </div>
                     <div className="flex-1">
                       <h4 className="text-white font-serif">{item.name}</h4>
                       <p className="text-brand-accent text-sm">{item.price}</p>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-brand-dim">{t("Qté:", "Qty:")} {item.quantity}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-black border-t border-white/10">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-brand-dim uppercase text-xs tracking-widest">{t("Total estimé", "Estimated Total")}</span>
                  <span className="text-2xl font-serif text-brand-accent">{cartTotal.toFixed(2)}$</span>
                </div>

                {!isPaymentSuccess ? (
                  <form onSubmit={handleCheckout} className="space-y-4">
                    {/* CUSTOMER IDENTIFICATION */}
                    <div>
                       <label className="block text-xs uppercase tracking-widest text-brand-dim mb-3">
                         {t("Nom ou # Table", "Name or Table #")}
                       </label>
                       <div className="relative">
                         <input 
                           type="text"
                           required
                           value={customerIdentifier}
                           onChange={(e) => setCustomerIdentifier(e.target.value)}
                           placeholder={t("Ex: Table 4 / Julie", "Ex: Table 4 / Julie")}
                           className="w-full bg-[#1c1c1c] text-white border border-white/10 rounded-sm py-3 pl-10 pr-4 focus:outline-none focus:border-brand-accent transition-colors"
                         />
                         <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                       </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-brand-dim mb-3">{t("Méthode de paiement", "Payment Method")}</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('DEBIT')}
                          className={`p-3 border rounded text-sm font-bold transition-all ${paymentMethod === 'DEBIT' ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                        >
                          {t("Débit / Crédit", "Debit / Credit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('CASH')}
                          className={`p-3 border rounded text-sm font-bold transition-all ${paymentMethod === 'CASH' ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                        >
                          {t("Comptant", "Cash")}
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-[#222] border border-white/5 rounded p-4 text-center mt-4">
                       <p className="text-white font-serif mb-1 text-sm">
                         {paymentMethod === 'DEBIT' 
                           ? t('Terminal sans fil', 'Wireless Terminal') 
                           : t('Paiement au comptoir', 'Pay at counter')}
                       </p>
                       <p className="text-xs text-brand-dim leading-relaxed">
                         {t("Veuillez confirmer la commande. Le règlement se fera avec votre serveur.", "Please confirm order. Payment will be handled by your server.")}
                       </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmittingOrder}
                      className="w-full bg-brand-accent hover:bg-white text-black font-bold uppercase tracking-[0.2em] py-4 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingOrder ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                      {t("Confirmer", "Confirm")}
                    </button>
                  </form>
                ) : (
                  <div className="bg-green-900/20 border border-green-500/30 p-6 text-center rounded animate-in zoom-in">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CreditCard className="text-black" />
                    </div>
                    <h3 className="text-green-500 font-bold uppercase tracking-widest mb-1">{t("Commande Envoyée", "Order Sent")}</h3>
                    <p className="text-sm text-green-400/70">{t("Un membre de l'équipe arrive bientôt.", "A team member will arrive shortly.")}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* --- FLOATING CHAT --- */}
      <ChatInterface 
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        messages={messages}
        isLoading={isChatLoading}
        onSendMessage={handleSendMessage}
        onTranscribeAudio={handleTranscribeAudio}
        onTriggerPayment={handleTriggerPayment}
        onTriggerCab={() => handleSendMessage(t("Je veux un taxi", "I need a taxi"))}
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        language={language}
      />

      {/* --- MODALS --- */}
      <CabModal 
        isOpen={isCabModalOpen}
        onClose={() => setIsCabModalOpen(false)}
        language={language}
      />

    </div>
  );
};

export default App;