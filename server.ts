import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { getSystemInstruction } from "./data/barData.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Basic CORS safety
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  
  if (origin) {
    if (origin === allowedOrigin || process.env.NODE_ENV !== "production") {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Rate limiting state
const ipRequests = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10;

// Concurrency limiting state
let activeGeminiCalls = 0;
const MAX_CONCURRENT_CALLS = 2;
const requestQueue: (() => void)[] = [];

// Lightweight caching
const responseCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Helper to acquire concurrency slot
async function acquireConcurrencySlot(): Promise<void> {
  if (activeGeminiCalls < MAX_CONCURRENT_CALLS) {
    activeGeminiCalls++;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    requestQueue.push(() => {
      activeGeminiCalls++;
      resolve();
    });
  });
}

// Helper to release concurrency slot
function releaseConcurrencySlot() {
  activeGeminiCalls--;
  if (requestQueue.length > 0) {
    const next = requestQueue.shift();
    if (next) next();
  }
}

// Helper for exponential backoff retry
async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  const maxRetries = 3;
  const delays = [1000, 2000, 4000];
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      const isQuotaError = 
        error.status === 429 || 
        error.status === 503 ||
        error.code === 429 ||
        (error.error && (error.error.code === 429 || error.error.code === 503)) ||
        (error.message && (error.message.includes('429') || error.message.includes('503') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));

      if (isQuotaError && i < maxRetries) {
        console.warn(`[Gemini] Rate limit/Unavailable. Retrying in ${delays[i]}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delays[i]));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

const cabTool: FunctionDeclaration = {
  name: "openCabModal",
  description: "Open the taxi/cab selection modal for the user. Use this when the user asks for a taxi, uber, cab, or a ride home.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  // 1. Rate Limiting
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  let ipData = ipRequests.get(ip);
  
  if (!ipData || now > ipData.resetTime) {
    ipData = { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
  }
  
  if (ipData.count >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({ 
      error: "Too many requests", 
      message: "Please wait a minute before sending more messages." 
    });
  }
  
  ipData.count++;
  ipRequests.set(ip, ipData);

  const { message, language } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // 2. Caching
  const cacheKey = `${language}:${message.trim().toLowerCase()}`;
  const cached = responseCache.get(cacheKey);
  if (cached && now < cached.expiry) {
    return res.json(cached.data);
  }

  // 3. Concurrency Limiting
  await acquireConcurrencySlot();
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const genAI = new GoogleGenAI({ apiKey });
    const chatSession = genAI.chats.create({
      model: "gemini-3.1-pro",
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.9,
        maxOutputTokens: 600,
        tools: [
          { functionDeclarations: [cabTool] },
          { googleMaps: {} }
        ], 
      },
    });

    const languageDirective = language === 'fr' 
      ? `[Note système : L'utilisateur parle Français. Réponds en Français.]\n` 
      : `[System Note: User speaks English. Reply in English.]\n`;

    const fullMessage = languageDirective + message;

    // 4. Retry Logic
    let response = await withRetry(() => chatSession.sendMessage({ message: fullMessage }));

    // Handle tool calls
    let maxTurns = 5;
    let openCab = false;
    
    while (response.functionCalls && response.functionCalls.length > 0 && maxTurns > 0) {
      maxTurns--;
      const functionResponseParts: any[] = [];

      for (const call of response.functionCalls) {
        if (call.name === "openCabModal") {
           openCab = true;
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
        response = await withRetry(() => chatSession.sendMessage({
          message: functionResponseParts
        }));
      }
    }

    let finalText = response.text || (language === 'fr' ? "Je n'ai pas de réponse." : "I have no response.");
    
    // Extract Maps Grounding Data
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

    const responseData = { text: finalText, openCab };
    
    // Cache successful response
    responseCache.set(cacheKey, { data: responseData, expiry: now + CACHE_TTL_MS });
    
    res.json(responseData);
    
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Friendly fallback JSON response
    res.status(500).json({ 
      error: "Internal Server Error",
      fallbackText: language === 'fr' 
        ? "⚠️ Désolé, le concierge reçoit trop de demandes en ce moment. Veuillez patienter une minute avant de réessayer."
        : "⚠️ Sorry, the concierge is receiving too many requests right now. Please wait a minute before trying again."
    });
  } finally {
    releaseConcurrencySlot();
  }
});

app.post("/api/transcribe", async (req, res) => {
  const { audioBase64, mimeType, language } = req.body;
  
  if (!audioBase64) {
    return res.status(400).json({ error: "Audio data is required" });
  }

  await acquireConcurrencySlot();
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const genAI = new GoogleGenAI({ apiKey });
    
    const response = await withRetry(() => genAI.models.generateContent({
      model: "gemini-3.1-pro",
      contents: {
        parts: [
          { 
            inlineData: { 
              mimeType: mimeType || "audio/webm",
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

    res.json({ text: response.text || "" });
  } catch (error: any) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Transcription failed" });
  } finally {
    releaseConcurrencySlot();
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
