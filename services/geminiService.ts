import { GoogleGenAI, Chat, FunctionDeclaration, Type, Part, GenerateContentResponse } from "@google/genai";
import { getSystemInstruction } from "../data/barData";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

// gemini-2.5-flash is required for Maps Grounding
const CHAT_MODEL_NAME = "gemini-2.5-flash";
const TRANSCRIPTION_MODEL_NAME = "gemini-3-flash-preview";

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 2000;

async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await operation();
    } catch (error: any) {
      const isQuotaError = 
        error.status === 429 || 
        error.code === 429 ||
        (error.error && error.error.code === 429) ||
        (error.error && error.error.status === 'RESOURCE_EXHAUSTED') ||
        (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));

      if (isQuotaError && i < MAX_RETRIES - 1) {
        const delay = BASE_DELAY * Math.pow(2, i);
        console.warn(`[Gemini] Rate limit exceeded. Retrying in ${delay}ms... (Attempt ${i + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

// Define the tool for ordering
const orderTool: FunctionDeclaration = {
  name: "addToOrder",
  description: "Add an item from the menu to the customer's shopping cart/order. Use this when the user explicitly wants to order a drink or item.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      itemName: {
        type: Type.STRING,
        description: "The exact name of the item from the menu. IMPORTANT: For items with multiple sizes (e.g., beers like 'Cold IPA'), you MUST include the size/format in the name (e.g., 'Cold IPA (Verre)', 'Cold IPA (Pinte)').",
      },
      quantity: {
        type: Type.INTEGER,
        description: "The number of items to order. Defaults to 1.",
      },
    },
    required: ["itemName"],
  },
};

const cabTool: FunctionDeclaration = {
  name: "openCabModal",
  description: "Open the taxi/cab selection modal for the user. Use this when the user asks for a taxi, uber, cab, or a ride home.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export const initializeChat = async () => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key not found in process.env");
      throw new Error("API Key missing");
    }

    genAI = new GoogleGenAI({ apiKey });
    
    chatSession = genAI.chats.create({
      model: CHAT_MODEL_NAME,
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.9, // High creativity for custom cocktail names
        maxOutputTokens: 1000, // Increased to allow detailed bullet-point recipes
        tools: [
          { functionDeclarations: [orderTool, cabTool] },
          { googleMaps: {} } // Enable Maps Grounding
        ], 
      },
    });

    return true;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return false;
  }
};

type OrderCallback = (itemName: string, quantity: number) => { success: boolean; message: string; price?: string };

export const sendMessageToGemini = async (
  message: string, 
  language: 'fr' | 'en',
  onAddToCart?: OrderCallback,
  onOpenCab?: () => void
): Promise<string> => {
  if (!chatSession) {
    const success = await initializeChat();
    if (!success || !chatSession) {
        return language === 'fr' 
          ? "Désolé, je ne suis pas disponible pour le moment. Veuillez demander au barman." 
          : "Sorry, I am not available at the moment. Please ask the bartender.";
    }
  }

  try {
    // Prepend a language directive to the user's message.
    const languageDirective = language === 'fr' 
      ? `[Note système : L'utilisateur parle Français. Réponds en Français.]\n` 
      : `[System Note: User speaks English. Reply in English.]\n`;

    const fullMessage = languageDirective + message;

    // 1. Send user message with Retry
    let response: GenerateContentResponse = await withRetry(() => chatSession!.sendMessage({ message: fullMessage }));

    // 2. Check for Function Calls (Loop for multiple turns)
    let maxTurns = 5;
    
    while (response.functionCalls && response.functionCalls.length > 0 && maxTurns > 0) {
      maxTurns--;
      
      const functionResponseParts: Part[] = [];

      for (const call of response.functionCalls) {
        if (call.name === "addToOrder" && onAddToCart) {
          const args = call.args as any;
          const itemName = args.itemName;
          const quantity = args.quantity || 1;

          console.log(`[Gemini] Tool Call: Adding ${quantity}x ${itemName}`);
          const actionResult = onAddToCart(itemName, quantity);

          functionResponseParts.push({
            functionResponse: {
              name: "addToOrder",
              id: call.id,
              response: {
                result: actionResult.success ? "SUCCESS" : "FAILURE",
                details: actionResult.message,
                price: actionResult.price
              }
            }
          });
        } else if (call.name === "openCabModal" && onOpenCab) {
           console.log(`[Gemini] Tool Call: Opening Cab Modal`);
           onOpenCab();
           functionResponseParts.push({
             functionResponse: {
               name: "openCabModal",
               id: call.id,
               response: { result: "SUCCESS", message: "Cab modal opened." }
             }
           });
        } else {
          functionResponseParts.push({
            functionResponse: {
              name: call.name,
              id: call.id,
              response: { error: "Function not supported or handler missing." }
            }
          });
        }
      }

      if (functionResponseParts.length > 0) {
        // Send tool response with Retry
        response = await withRetry(() => chatSession!.sendMessage({
          message: functionResponseParts
        }));
      }
    }

    // 3. Extract Maps Grounding Data
    let finalText = response.text || (language === 'fr' ? "Commande prise en compte." : "Order received.");
    
    // Check for grounding chunks (Google Maps)
    const candidates = response.candidates;
    if (candidates && candidates[0]?.groundingMetadata?.groundingChunks) {
      const chunks = candidates[0].groundingMetadata.groundingChunks;
      let linksText = "";
      
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
            linksText += `\n🔗 [${chunk.web.title}](${chunk.web.uri})`;
        }
      });

      if (linksText) {
        finalText += `\n\n${linksText}`;
      }
    }

    return finalText;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    const isQuotaError = 
      error.status === 429 || 
      error.code === 429 ||
      (error.error && error.error.code === 429) ||
      (error.error && error.error.status === 'RESOURCE_EXHAUSTED') ||
      (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));

    if (isQuotaError) {
       return language === 'fr'
         ? "⚠️ Désolé, le concierge reçoit trop de demandes en ce moment. Veuillez patienter une minute avant de réessayer."
         : "⚠️ Sorry, the concierge is receiving too many requests right now. Please wait a minute before trying again.";
    }
    
    return language === 'fr' 
      ? "Oups, j'ai eu un petit problème technique. On en reparle plus tard ?" 
      : "Oops, I had a little technical glitch. Let's talk later?";
  }
};

export const transcribeAudio = async (audioBase64: string, mimeType: string, language: 'fr' | 'en'): Promise<string> => {
  if (!genAI) await initializeChat();
  if (!genAI) throw new Error("AI not initialized");

  try {
    // Use gemini-3-flash-preview for transcription as requested
    const response: GenerateContentResponse = await withRetry(() => genAI!.models.generateContent({
      model: TRANSCRIPTION_MODEL_NAME,
      contents: {
        parts: [
          { 
            inlineData: { 
              mimeType: mimeType || "audio/webm", // Use dynamic mime type from recorder
              data: audioBase64 
            } 
          },
          { 
            text: language === 'fr' 
              ? "Transcris cet audio en texte. Si l'audio est vide ou incompréhensible, retourne une chaîne vide. Ne réponds JAMAIS que tu n'as pas reçu de fichier audio." 
              : "Transcribe this audio to text. If audio is empty or unclear, return empty string. NEVER respond that you didn't receive an audio file." 
          }
        ]
      }
    }));

    return response.text || "";
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};