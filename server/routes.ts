import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertXPTransactionSchema, insertLearningProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Solana RPC proxy to avoid CORS issues
  app.post('/api/solana-rpc', async (req, res) => {
    try {
      const rpcEndpoints = [
        'https://api.mainnet-beta.solana.com',
        'https://solana-mainnet.g.alchemy.com/v2/demo'
      ];

      let lastError;
      for (const endpoint of rpcEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
          });

          if (response.ok) {
            const data = await response.json();
            return res.json(data);
          } else {
            console.warn(`RPC ${endpoint} failed with status: ${response.status}`);
            lastError = `HTTP ${response.status}`;
            continue;
          }
        } catch (error) {
          console.warn(`Error with RPC ${endpoint}:`, error);
          lastError = error;
          continue;
        }
      }
      
      res.status(503).json({ 
        error: 'All RPC endpoints failed', 
        lastError: lastError?.toString() 
      });
    } catch (error) {
      console.error('RPC proxy error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // XP System Routes
  // XP system removed to prevent deployment issues

  const httpServer = createServer(app);
  return httpServer;
}
