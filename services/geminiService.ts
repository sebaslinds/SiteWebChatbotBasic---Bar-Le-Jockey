export const initializeChat = async () => {
  // Initialization is now handled on the server.
  // We just return true to indicate the service is ready.
  return true;
};

export const sendMessageToGemini = async (
  message: string, 
  language: 'fr' | 'en',
  onOpenCab?: () => void
): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, language }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 429) {
        return language === 'fr' 
          ? "⚠️ Désolé, le concierge reçoit trop de demandes en ce moment. Veuillez patienter une minute avant de réessayer."
          : "⚠️ Sorry, the concierge is receiving too many requests right now. Please wait a minute before trying again.";
      }
      return errorData.fallbackText || (language === 'fr' 
        ? "Oups, j'ai eu un petit problème technique. On en reparle plus tard ?" 
        : "Oops, I had a little technical glitch. Let's talk later?");
    }

    const data = await response.json();
    
    if (data.openCab && onOpenCab) {
      onOpenCab();
    }

    return data.text;
  } catch (error) {
    console.error("API Error:", error);
    return language === 'fr' 
      ? "Oups, j'ai eu un petit problème technique. On en reparle plus tard ?" 
      : "Oops, I had a little technical glitch. Let's talk later?";
  }
};

export const transcribeAudio = async (audioBase64: string, mimeType: string, language: 'fr' | 'en'): Promise<string> => {
  try {
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audioBase64, mimeType, language }),
    });

    if (!response.ok) {
      throw new Error("Transcription failed");
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};