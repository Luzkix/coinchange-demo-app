import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Vytvoření Express aplikace
const app = express();

// Nastavení portu, na kterém bude proxy server běžet
const PORT = 5000;

// Povolení CORS pro všechny požadavky
app.use(cors());

// Logging middleware pro lepší debug
app.use((req, res, next) => {
  //console.log(`[Proxy] ${req.method} ${req.url}`);
  next();
});

// Vytvoření proxy pro Coinbase API
app.use(
  '/api-coinbase',
  createProxyMiddleware({
    target: 'https://api.coinbase.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api-coinbase': '', // Odstraní prefix '/api-coinbase' při přesměrování
    },
    // Přidání logování pro debug
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Proxy] Proxying to: ${proxyReq.path}`);
    },
  }),
);

// Vytvoření proxy pro Coinbase Exchange API
app.use(
  '/api-coinbase-exchange',
  createProxyMiddleware({
    target: 'https://api.exchange.coinbase.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api-coinbase-exchange': '',
    },
  }),
);

// Vytvoření proxy pro vlastní backend
app.use(
  '/api-backend',
  createProxyMiddleware({
    target: 'http://localhost:2000/ui-api',
    changeOrigin: true,
    pathRewrite: {
      '^/api-backend': '',
    },
  }),
);

// Jednoduchý health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Proxy server is running' });
});

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
