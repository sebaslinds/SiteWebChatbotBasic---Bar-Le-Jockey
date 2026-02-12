import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../types';
import { Send, X, MessageCircle, Sparkles, Loader2, CreditCard, ShoppingBag, Mic, StopCircle } from 'lucide-react';
import { BAR_DATA } from '../data/barData';

interface ChatInterfaceProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onTranscribeAudio: (audioBase64: string, mimeType: string) => Promise<string>;
  onTriggerPayment: () => void;
  onTriggerCab: () => void;
  cartCount: number;
  onOpenCart: () => void;
  language: 'fr' | 'en';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isOpen, 
  setIsOpen, 
  messages, 
  isLoading, 
  onSendMessage,
  onTranscribeAudio,
  onTriggerPayment,
  onTriggerCab,
  cartCount,
  onOpenCart,
  language
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extract categories dynamically, filtering out 'Special' as it has its own dedicated button ("Sur Mesure")
  const categories = Array.from(new Set(BAR_DATA.menu.map(item => item.category)))
    .filter(cat => cat !== 'Special');

  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  const quickActions = [
    // 1. Sur Mesure
    { 
        label: t("Sur Mesure", "Custom"), 
        text: t("Je veux un cocktail sur mesure. Crée-moi quelque chose d'unique !", "I want a custom cocktail. Create something unique for me!") 
    },
    // 2. Suggestion
    { 
        label: t("Suggestion", "Suggestion"), 
        text: t("Suggère-moi un cocktail de ton menu.", "Suggest a cocktail from your menu.") 
    },
    // 3. Location (New)
    { 
        label: t("Localisation", "Location"), 
        text: t("Où êtes-vous situés ?", "Where are you located?") 
    },
    // 4. Menu Categories
    ...categories.map(cat => ({
      label: cat,
      text: t(`Qu'est-ce qu'il y a dans la catégorie ${cat} ?`, `What is in the ${cat} category?`)
    })),
    // 5. Taxi
    { 
        label: t("Taxi", "Taxi"), 
        action: "CAB" 
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Audio Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);
        
        // Use the actual mime type from the recorder
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        
        // Convert to Base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
          const base64Data = base64String.split(',')[1];
          
          if (base64Data) {
            const transcription = await onTranscribeAudio(base64Data, mimeType);
            if (transcription && transcription.trim()) {
              // DIRECT SEND instead of setInput
              onSendMessage(transcription.trim());
            }
          }
          setIsTranscribing(false);
          
          // Stop all tracks to release mic
          stream.getTracks().forEach(track => track.stop());
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert(t("Impossible d'accéder au microphone.", "Could not access microphone."));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleActionClick = (action: { label: string, text?: string, action?: string }) => {
    if (action.action === "PAY") {
      onTriggerPayment();
    } else if (action.action === "CAB") {
      onTriggerCab();
    } else if (action.text) {
      onSendMessage(action.text);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSendMessage(input);
        setInput('');
      }
    }
  };

  const handleSendClick = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  // Parses text for special syntaxes
  const parseMessageContent = (text: string) => {
    let cleanText = text;
    let options: string[] = [];

    // Remove PAY tag if it exists (but we don't render the button anymore)
    if (/(\/\/\/PAY\/\/\/)/i.test(cleanText)) {
      cleanText = cleanText.replace(/(\/\/\/PAY\/\/\/)/gi, '').trim();
    }

    // Check for ///OPTIONS: .../// using a robust regex that handles newlines and spaces around the tag
    // Matches ///OPTIONS: ... /// globally OR ///OPTIONS: ... at end of string (handle missing closing slash)
    const optionsRegex = /\/\/\/\s*OPTIONS\s*:([\s\S]*?)(\/\/\/|$)/gi;
    
    // Find all matches
    const matches = Array.from(cleanText.matchAll(optionsRegex));
    
    if (matches.length > 0) {
      // Use the last match for the interactive chips logic
      const lastMatch = matches[matches.length - 1];
      if (lastMatch && lastMatch[1]) {
        options = lastMatch[1].split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);
      }
      
      // Remove ALL options tags from the visible text
      cleanText = cleanText.replace(optionsRegex, '').trim();
    }

    return { cleanText, options };
  };

  // Helper to parse **bold** text and render it as a button directly
  // Also basic link parsing for [Text](Url)
  const renderRichText = (text: string, isUser: boolean) => {
    if (isUser) return text;

    // Split by markdown bold syntax first
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return <strong key={index} className="font-bold text-white">{content}</strong>;
      }
      // Simple link parser for the part (very basic)
      // Regex to find [Title](URL)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const subParts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = linkRegex.exec(part)) !== null) {
        if (match.index > lastIndex) {
            subParts.push(part.substring(lastIndex, match.index));
        }
        subParts.push(
            <a key={`${index}-${match.index}`} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-brand-accent underline hover:text-white">
                {match[1]}
            </a>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < part.length) {
          subParts.push(part.substring(lastIndex));
      }

      return subParts.length > 0 ? <span key={index}>{subParts}</span> : <span key={index}>{part}</span>;
    });
  };

  const MessageBubble: React.FC<{ msg: Message, isLast: boolean }> = ({ msg, isLast }) => {
    const isUser = msg.role === 'user';
    
    // Only parse options for model messages
    const { cleanText, options } = !isUser 
      ? parseMessageContent(msg.text) 
      : { cleanText: msg.text, options: [] };

    // Detect if the options are all numeric (1, 2, 3...) to render them as squares
    const isNumericOptions = !isUser && options.length > 0 && options.every(opt => /^\d+$/.test(opt));

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[85%] p-4 text-sm leading-relaxed whitespace-pre-wrap shadow-md flex flex-col gap-3 ${
            isUser
              ? 'bg-brand-accent text-black rounded-2xl rounded-tr-sm font-medium'
              : msg.isPaymentRequest 
                ? 'bg-gradient-to-br from-green-900/40 to-black border border-green-500/30 text-white rounded-2xl rounded-tl-sm'
                : 'bg-[#1c1c1c] text-gray-200 rounded-2xl rounded-tl-sm border border-white/5'
          }`}
        >
          {msg.role === 'model' && !msg.isPaymentRequest && (
              <Sparkles size={12} className="text-brand-accent opacity-70" />
          )}
          {msg.isPaymentRequest && (
            <div className="flex items-center gap-2 text-green-400 font-bold uppercase text-xs tracking-widest">
              <CreditCard size={14} />
              {t("Confirmation", "Confirmation")}
            </div>
          )}
          
          {/* Main Text Content */}
          <div className="leading-7 break-words">
            {renderRichText(cleanText, isUser)}
          </div>

          {/* Render Options Chips - Only show on last message */}
          {!isUser && options.length > 0 && isLast && (
            <div className={`mt-2 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2`}>
              
              {isNumericOptions ? (
                  <div className="flex flex-wrap gap-1.5">
                    {/* Square Buttons for Numbers */}
                    {options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSendMessage(opt)}
                        className="w-12 h-12 flex items-center justify-center bg-black/40 border border-brand-accent/30 text-brand-accent text-base font-bold rounded hover:bg-brand-accent hover:text-black transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
              ) : (
                // Standard Options Rendering (Rectangular)
                options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(opt)}
                    className="px-5 py-2.5 bg-[#252525] border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-wide rounded-md hover:bg-brand-accent hover:text-black hover:border-brand-accent hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                  >
                    {opt}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Action Buttons */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
          
          {/* Cart Button - Visible when items in cart */}
          {cartCount > 0 && (
            <button
              onClick={onOpenCart}
              className="pointer-events-auto bg-[#1a1a1a] text-white p-4 rounded-full shadow-lg shadow-black/50 transition-all hover:scale-105 flex items-center justify-center relative border border-white/10 hover:border-brand-accent group animate-in slide-in-from-bottom-4 fade-in duration-300"
            >
               <ShoppingBag size={20} />
               <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-black text-xs font-bold flex items-center justify-center rounded-full shadow-sm">
                 {cartCount}
               </div>
               <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black border border-white/10 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                 {t("Voir le panier", "View Cart")}
               </span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto bg-brand-accent hover:bg-[#b08d55] text-black p-4 rounded-full shadow-lg shadow-black/50 transition-all hover:scale-105 flex items-center gap-2 group border-2 border-transparent hover:border-white/20"
          >
            <MessageCircle size={24} fill="currentColor" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-serif font-bold tracking-wide">
              {t("Assistant Barman", "Bar Assistant")}
            </span>
          </button>
        </div>
      )}

      {/* Chat Window with Backdrop */}
      {isOpen && (
        <>
          {/* Backdrop to close on outside click */}
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[400px] h-[85vh] sm:h-[600px] bg-[#121212] border border-brand-accent/20 shadow-2xl sm:rounded-lg flex flex-col z-50 overflow-hidden font-sans animate-in slide-in-from-bottom-10 duration-300">
            
            {/* Header */}
            <div className="p-4 bg-black border-b border-brand-accent/20 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-brand-accent animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-brand-accent blur opacity-50"></div>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-brand-accent text-lg">Le Jockey IA</h3>
                  <p className="text-brand-dim text-sm tracking-wide">Concierge</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Cart Icon in Header */}
                {cartCount > 0 && (
                    <button onClick={onOpenCart} className="text-brand-dim hover:text-white relative transition-colors mr-2">
                      <ShoppingBag size={20} />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-accent text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    </button>
                  )}
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-brand-dim hover:text-brand-accent transition-colors"
                  >
                    <X size={20} />
                  </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#0e0e0e]">
              {messages.map((msg, idx) => (
                <MessageBubble 
                  key={idx} 
                  msg={msg} 
                  isLast={idx === messages.length - 1} 
                />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1c1c1c] p-4 rounded-2xl rounded-tl-sm border border-white/5">
                    <Loader2 className="animate-spin text-brand-accent" size={20} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 pt-2 pb-0 bg-black flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleActionClick(action)}
                  disabled={isLoading || isRecording}
                  className="whitespace-nowrap px-5 py-2.5 rounded-full border border-brand-accent/30 text-brand-accent text-xs font-bold hover:bg-brand-accent hover:text-black transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black border-t border-brand-accent/10 shrink-0">
              <div className="flex items-center gap-2 relative">
                
                {/* Microphone Button */}
                <button
                  onClick={handleMicClick}
                  disabled={isLoading || isTranscribing}
                  className={`p-2.5 rounded-full transition-all duration-300 ${
                    isRecording 
                      ? 'bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white animate-pulse' 
                      : 'bg-[#2a2a2a] text-brand-dim hover:text-brand-accent border border-white/10'
                  }`}
                  title={t("Utiliser le microphone", "Use microphone")}
                >
                  {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                </button>

                <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={
                        isRecording 
                          ? t("Écoute en cours...", "Listening...") 
                          : isTranscribing
                            ? t("Transcription...", "Transcribing...")
                            : t("Posez une question...", "Ask a question...")
                      }
                      className="w-full bg-[#1c1c1c] text-white placeholder-brand-dim/50 border border-white/10 rounded-full py-3 pl-5 pr-12 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/50 transition-all font-light disabled:opacity-50"
                      disabled={isLoading || isRecording || isTranscribing}
                    />
                    <button
                      onClick={handleSendClick}
                      disabled={isLoading || !input.trim() || isRecording}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-accent text-black rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-brand-accent"
                    >
                      <Send size={16} />
                    </button>
                </div>

              </div>
              <p className="text-center text-[10px] text-brand-dim/40 mt-3 uppercase tracking-widest">
                {t("Généré par IA • Vérifiez avec le staff", "AI Generated • Verify with staff")}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatInterface;