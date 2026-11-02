import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  RotateCcw, 
  ClipboardPaste, 
  ShieldAlert, 
  AlertTriangle,
  ChevronDown,
  Info
} from 'lucide-react';

const SAMPLE_MESSAGES = [
  {
    title: "📦 Package Delivery Smishing",
    tag: "SMISHING",
    text: "USPS: Your package cannot be delivered due to incomplete address. Update info within 12 hours at https://usps-update-parcel.top/verify or item will be returned to sender."
  },
  {
    title: "🚨 Bank Fraud Alert",
    tag: "FINANCIAL",
    text: "URGENT FRAUD ALERT: Suspicious charge of $980.00 detected on your Chase card ending in 8842. Call 1-800-492-0192 immediately or reply STOP to freeze account."
  },
  {
    title: "⚡ Crypto Giveaway Scam",
    tag: "CRYPTO",
    text: "Elon Musk here! Send 0.1 BTC to this wallet address: 1MuskGiveawayX8921 and receive 1.0 BTC back immediately! Only 35 slots left at https://tesla-giveaway.buzz"
  },
  {
    title: "💼 Microsoft 365 Phishing",
    tag: "PHISHING",
    text: "IT Department: Your Microsoft 365 password expires in 2 hours. Click here to retain your current password and prevent email disconnection: https://login-portal-office365.online/auth"
  },
  {
    title: "✅ Legitimate Message (Safe)",
    tag: "SAFE",
    text: "Hi Sarah, just wanted to check if you're still free for lunch tomorrow at 12:30 PM? Let me know when you get a chance!"
  }
];

export default function MessageInput({ onAnalyze, isLoading }) {
  const [message, setMessage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const maxLength = 2000;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    onAnalyze(message.trim());
  };

  const handleSelectSample = (sampleText) => {
    setMessage(sampleText);
    setDropdownOpen(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessage(text.slice(0, maxLength));
      }
    } catch (err) {
      console.warn("Clipboard access denied or not supported:", err);
    }
  };

  const charPercentage = (message.length / maxLength) * 100;
  const isOverLimit = message.length > maxLength;

  return (
    <div className="w-full bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Sample Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <span>Message Threat Analyzer</span>
          </h2>
          <p className="text-xs text-slate-400">
            Paste suspicious SMS, phishing email, WhatsApp or DM text for instant Gemini forensic breakdown.
          </p>
        </div>

        {/* Quick Sample Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-emerald-400 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Samples</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-20 space-y-1 animate-scale-in">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Test Scam Vector
              </div>
              {SAMPLE_MESSAGES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample.text)}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium truncate group-hover:text-emerald-300">{sample.title}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-300 border border-slate-700">
                    {sample.tag}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Textarea Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative rounded-xl border border-slate-700/80 bg-slate-950/60 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste suspicious SMS, email body, bank alert, or DM message here..."
            rows={5}
            maxLength={maxLength}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-y min-h-[120px] font-sans"
            disabled={isLoading}
          />

          {/* Action buttons inside textarea footer */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border-t border-slate-800/80 rounded-b-xl text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>

              {message && (
                <button
                  type="button"
                  onClick={() => setMessage('')}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Clear text"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Character Counter */}
            <div className="flex items-center gap-2">
              <span className={`font-mono text-xs ${isOverLimit ? 'text-rose-400 font-bold' : charPercentage > 85 ? 'text-amber-400' : 'text-slate-400'}`}>
                {message.length} / {maxLength}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Strict privacy: Messages are evaluated securely and never logged publicly without redaction.</span>
          </div>

          <button
            type="submit"
            disabled={!message.trim() || isLoading || isOverLimit}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Parsing Threat Vector...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Analyze Message</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

