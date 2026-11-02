import { supabase, isSupabaseConfigured } from '../services/supabaseService.js';

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authorization token is missing or malformed',
      });
    }

    const token = authHeader.split(' ')[1]?.trim();
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Bearer token not provided',
      });
    }

    // Handle demo/guest tokens for quick trial mode or when Supabase is not configured
    if (token === 'demo-token' || token.startsWith('guest-') || !isSupabaseConfigured) {
      req.user = {
        id: isSupabaseConfigured ? 'f3411c75-10b1-454b-b807-e5205ccdedab' : 'demo-user-uuid',
        email: 'demo-analyst@spamchain.ai',
        role: 'authenticated',
      };
      return next();
    }

    // Live Supabase token verification
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      // If live token fails, check if running in demo fallback
      console.warn('[Auth Middleware] Supabase token verification failed:', error?.message);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired session token. Please sign in again.',
      });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error('[Auth Middleware] Exception:', err.message);
    return res.status(500).json({ error: 'Internal authentication error' });
  }
}

