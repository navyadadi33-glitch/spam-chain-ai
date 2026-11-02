import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your_supabase_project_url') &&
  !supabaseKey.includes('your_supabase_service_role_key')
);

let supabase = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[Supabase Service] Initialized with live Supabase credentials');
  } catch (err) {
    console.error('[Supabase Service] Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('[Supabase Service] Credentials not configured. Operating in high-speed local storage mode.');
}

// Fallback in-memory / local storage
const inMemoryScans = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    user_id: "demo-user-uuid",
    raw_message: "USPS: Your package #US940010920 cannot be delivered due to an incomplete address. Update your delivery address within 12 hours at https://usps-post-redelivery.top/confirm or package will be returned to sender.",
    risk_level: "Scam",
    risk_score: 95,
    category: "SMISHING",
    explanation: "High-risk package delivery smishing impersonating the United States Postal Service with a malicious phishing domain designed to harvest credit card and personal address data.",
    warning_signs: [
      "Spoofed carrier domain '.top' instead of official usps.com",
      "Artificial 12-hour urgency ultimatum to induce panic",
      "Demands credit card verification for a non-existent $0.35 address correction fee"
    ],
    recommendations: [
      "Do not open the link or enter financial data",
      "Report message to USPS Inspection Service and forward to 7726",
      "Track parcels exclusively via official carrier mobile apps"
    ],
    spam_chain: {
      sender: "Unregistered VoIP phone number spoofing USPS notifications",
      urgency: "Immediate 12-hour deadline threatening parcel return to sender",
      suspiciousLink: "https://usps-post-redelivery.top/confirm (Credential & credit card harvesting lure)",
      informationRequest: "Full name, residential address, credit card number, CVV, and billing zip",
      finalRiskSummary: "Total identity theft and unauthorized financial debiting"
    },
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: "c1000000-0000-0000-0000-000000000002",
    user_id: "demo-user-uuid",
    raw_message: "URGENT FRAUD ALERT: A suspicious charge of $1,429.99 at Apple Store NY was attempted on your Chase card ending in 4091. If this was NOT you, call the Fraud Prevention Hotline immediately at 1-888-921-0421.",
    risk_level: "Scam",
    risk_score: 97,
    category: "FINANCIAL_SCAM",
    explanation: "Severe financial social engineering attack creating false urgency around an exorbitant fraudulent purchase to deceive the target into calling a scammer-operated call center.",
    warning_signs: [
      "Manufactured high-dollar transaction panic",
      "Unverified telephone hotline not found on back of official debit/credit card",
      "Typical precursor to live voice social engineering (vishing) and OTP theft"
    ],
    recommendations: [
      "Never dial phone numbers contained within unexpected SMS alerts",
      "Contact bank customer support using the number stamped on the physical card",
      "Review transactions directly within official mobile banking app"
    ],
    spam_chain: {
      sender: "Spoofed toll-free SMS originator claiming to be Chase Fraud Operations",
      urgency: "Emergency alert threatening immediate financial loss if not contested right away",
      suspiciousLink: "Inbound phone hook: 1-888-921-0421 (Scammer call center)",
      informationRequest: "Online banking username, password, and two-factor authentication SMS passcode",
      finalRiskSummary: "Direct unauthorized wire transfers or account takeover"
    },
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: "c1000000-0000-0000-0000-000000000003",
    user_id: "demo-user-uuid",
    raw_message: "Hey! Elon Musk here with the official Tesla foundation giveaway! To celebrate X launch, send 0.1 BTC to 1MuskGiveawayX... and receive 1.0 BTC immediately! Limited to first 50 participants! Visit https://tesla-giveaway2026.buzz",
    risk_level: "Scam",
    risk_score: 99,
    category: "FINANCIAL_SCAM",
    explanation: "Textbook cryptocurrency advance-fee doubling scam leveraging celebrity impersonation and FOMO to trick targets into sending irreversible crypto transactions.",
    warning_signs: [
      "Unrealistic 10x guaranteed multiplier promise",
      "High-profile celebrity impersonation",
      "Irreversible wallet address transfer request",
      "High-pressure artificial counter ('first 50 participants')"
    ],
    recommendations: [
      "Never transfer cryptocurrency to any address promising free funds in return",
      "Block sender and report social handle or phone number",
      "No legitimate executive or company conducts crypto multiplier giveaways"
    ],
    spam_chain: {
      sender: "Impersonator posing as Elon Musk / Tesla Foundation",
      urgency: "Artificial scarcity ('first 50 participants only')",
      suspiciousLink: "https://tesla-giveaway2026.buzz and direct crypto address",
      informationRequest: "Direct transfer of 0.1 - 2.0 Bitcoin or wallet private keys",
      finalRiskSummary: "Permanent, irrecoverable loss of all transferred crypto assets"
    },
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  }
];

export async function ensureProfile(userId, email) {
  if (!isSupabaseConfigured || !supabase) {
    return { id: userId, email: email || 'user@example.com' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, email: email || `${userId}@example.com` }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('[Supabase Service] ensureProfile warning:', error.message);
    }
    return data;
  } catch (err) {
    console.error('[Supabase Service] ensureProfile error:', err.message);
    return null;
  }
}

export async function saveScan({ userId, rawMessage, analysis, userEmail }) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Ensure profile exists first to prevent foreign key errors
      await ensureProfile(userId, userEmail);

      const recordToInsert = {
        user_id: userId,
        raw_message: rawMessage,
        risk_level: analysis.riskLevel,
        risk_score: analysis.riskScore,
        category: analysis.category,
        explanation: analysis.explanation,
        warning_signs: analysis.warningSigns,
        recommendations: analysis.recommendations,
        spam_chain: analysis.spamChain
      };

      const { data, error } = await supabase
        .from('scans')
        .insert(recordToInsert)
        .select()
        .single();

      if (error) {
        console.error('[Supabase Service] DB insert error, falling back to local cache:', error.message);
      } else {
        console.log('[Supabase Service] Scan successfully saved to Supabase PostgreSQL! ID:', data.id);
        return data;
      }
    } catch (err) {
      console.error('[Supabase Service] saveScan exception, using local store:', err.message);
    }
  }

  // Local fallback storage
  const newScan = {
    id: crypto.randomUUID(),
    user_id: userId,
    raw_message: rawMessage,
    risk_level: analysis.riskLevel,
    risk_score: analysis.riskScore,
    category: analysis.category,
    explanation: analysis.explanation,
    warning_signs: analysis.warningSigns,
    recommendations: analysis.recommendations,
    spam_chain: analysis.spamChain,
    created_at: new Date().toISOString()
  };

  inMemoryScans.unshift(newScan);
  return newScan;
}

export async function getUserScans(userId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data;
      }
      console.error('[Supabase Service] Fetch user scans error:', error?.message);
    } catch (err) {
      console.error('[Supabase Service] getUserScans exception:', err.message);
    }
  }

  return inMemoryScans.filter(s => s.user_id === userId);
}

export async function deleteUserScan(scanId, userId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('scans')
        .delete()
        .eq('id', scanId)
        .eq('user_id', userId);

      if (!error) {
        return { success: true };
      }
      console.error('[Supabase Service] Delete scan error:', error.message);
    } catch (err) {
      console.error('[Supabase Service] deleteUserScan exception:', err.message);
    }
  }

  const index = inMemoryScans.findIndex(s => s.id === scanId && s.user_id === userId);
  if (index !== -1) {
    inMemoryScans.splice(index, 1);
    return { success: true };
  }

  return { success: false, message: "Scan not found or not owned by user" };
}

export async function getCommunityScans(limit = 30) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('id, raw_message, risk_level, risk_score, category, explanation, warning_signs, recommendations, spam_chain, created_at')
        .in('risk_level', ['Scam', 'Spam'])
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && Array.isArray(data)) {
        return data;
      }
      console.error('[Supabase Service] Fetch community scans error:', error?.message);
    } catch (err) {
      console.error('[Supabase Service] getCommunityScans exception:', err.message);
    }
  }

  // Return community feed sanitized (anonymized, no user IDs)
  return inMemoryScans
    .filter(s => s.risk_level === 'Scam' || s.risk_level === 'Spam')
    .slice(0, limit)
    .map(({ user_id, ...rest }) => rest);
}

export { isSupabaseConfigured, supabase };

