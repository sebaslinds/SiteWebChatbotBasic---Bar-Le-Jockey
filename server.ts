import express from "express";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example endpoint to handle orders
  app.post("/api/orders", (req, res) => {
    const orderData = req.body;
    console.log("Received order:", orderData);
    
    // Here you would typically save the order to a database (e.g., PostgreSQL, MongoDB)
    // For now, we just simulate a successful save.
    
    res.status(201).json({ 
      success: true, 
      message: "Order received successfully",
      orderId: `ORD-${Date.now()}`
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
