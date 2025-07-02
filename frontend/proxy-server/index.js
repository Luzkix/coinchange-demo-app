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

// Vytvoření proxy pro vlastní backend
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:2000', //port where i am locally running java backend when developing. In docker image this port does not matter
    changeOrigin: true,
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
