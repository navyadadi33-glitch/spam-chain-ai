import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import scanRoutes from './routes/scanRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import sandboxRoutes from './routes/sandboxRoutes.js';
import honeypotRoutes from './routes/honeypotRoutes.js';
import { isSupabaseConfigured } from './services/supabaseService.js';

const app = express();
const PORT = process.env.PORT || 5050;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Cross-Origin Resource Sharing
app.use(cors({
  origin: true, // Allow frontend dev server and production origins
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser
app.use(express.json({ limit: '1mb' }));

// Request Logger (Development friendly)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health & System Info Route
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY && 
    !process.env.GEMINI_API_KEY.includes('your_gemini_api_key')
  );

  res.status(200).json({
    status: 'healthy',
    application: 'SpamChain AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      geminiAi: hasGeminiKey ? `connected (live model: ${process.env.GEMINI_MODEL || 'gemini-3.8-flash'})` : 'heuristic intelligence mode (ready for live API key)',
      database: isSupabaseConfigured ? 'supabase postgres (connected)' : 'high-speed local cache (ready for Supabase credentials)'
    }
  });
});

// API Routes
app.use('/api', scanRoutes);
app.use('/api', communityRoutes);
app.use('/api', sandboxRoutes);
app.use('/api', honeypotRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message,
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🛡️  SpamChain AI Backend Server running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

