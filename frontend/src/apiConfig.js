/**
 * Unified API Configuration for SpamChain AI
 * Automatically normalizes API endpoints so both local Vite development
 * and production deployments (Vercel -> Render) always work reliably.
 */

// 1. Get raw base URL from environment or fallback to relative '/api'
const rawEnvUrl = import.meta.env.VITE_API_BASE_URL || '';

// 2. Strip any trailing slash (e.g. "https://spam-chain-ai.onrender.com/" -> "https://spam-chain-ai.onrender.com")
const cleanBase = rawEnvUrl.trim().replace(/\/+$/, '');

// 3. Normalize API_BASE:
// - If cleanBase is empty (local dev): use '/api' to leverage Vite's dev proxy.
// - If cleanBase already ends with '/api': use cleanBase.
// - If cleanBase is a domain without '/api' (e.g. 'https://spam-chain-ai.onrender.com'): append '/api'.
export const API_BASE = cleanBase
  ? (cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`)
  : '/api';

export const BACKEND_ROOT = cleanBase.replace(/\/api$/, '') || '';
