import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  RotateCcw, 
  ClipboardPaste, 
  ShieldAlert, 
  AlertTriangle,
  ChevronDown,
  Info,
  MessageSquare,
  PhoneCall,
  Mic,
  Hash
} from 'lucide-react';

const SAMPLES = {
  sms: [
    {
      title: "📦 USPS Package Delivery Smishing",
      tag: "SMISHING",
      phone: "+1 (833) 492-0192",
      text: "USPS: Your package cannot be delivered due to incomplete address. Update info within 12 hours at https://usps-update-parcel.top/verify or item will be returned to sender."
    },
    {
      title: "🚨 Bank Fraud Alert SMS",
      tag: "FINANCIAL",
      phone: "+1 (888) 234-9011",
      text: "URGENT FRAUD ALERT: Suspicious charge of $980.00 detected on your Chase card ending in 8842. Call 1-800-492-0192 immediately or reply STOP to freeze account."
    },
    {
      title: "⚡ Crypto Giveaway DM",
      tag: "CRYPTO",
      phone: "",
      text: "Elon Musk here! Send 0.1 BTC to this wallet address: 1MuskGiveawayX8921 and receive 1.0 BTC back immediately! Only 35 slots left at https://tesla-giveaway.buzz"
    },
    {
      title: "💼 Microsoft 365 Password Phishing",
      tag: "PHISHING",
      phone: "IT-SEC-ALERT",
      text: "IT Department: Your Microsoft 365 password expires in 2 hours. Click here to retain your current password and prevent email disconnection: https://login-portal-office365.online/auth"
    },
    {
      title: "✅ Legitimate Message (Safe)",
      tag: "SAFE",
      phone: "+1 (555) 234-5678",
      text: "Hi Sarah, just wanted to check if you're still free for lunch tomorrow at 12:30 PM? Let me know when you get a chance!"
    }
  ],
  phone: [
    {
      title: "📞 1-888 Spoofed Bank Hotline",
      tag: "SPOOFED",
      phone: "+1 (888) 234-9011",
      text: "Inbound call claiming to be Chase Fraud Department asking to confirm a $1,429 Apple Store purchase and verify cardholder PIN."
    },
    {
      title: "🌍 +232 International One-Ring Trap",
      tag: "WANGIRI",
      phone: "+232 76 892 110",
      text: "Suspicious missed call from Sierra Leone (+232). Rang once and disconnected to bait a costly international callback."
    },
    {
      title: "🏦 +1-800 Official Bank Support (Safe)",
      tag: "VERIFIED",
      phone: "+1 (800) 935-9935",
      text: "Verified Chase customer service line printed on the back of official debit and credit cards."
    }
  ],
  call: [
    {
      title: "⚖️ IRS Arrest Warrant Threat Robocall",
      tag: "LEGAL_SCAM",
      phone: "+1 (202) 555-0198",
      text: "Automated robocall: 'This is Officer Mark Davis from the Internal Revenue Service. A federal warrant has been issued for your arrest due to tax evasion. Press 1 immediately to speak with a federal agent or local police will arrive within 2 hours.'"
    },
    {
      title: "🚗 Vehicle Extended Warranty Robocall",
      tag: "WARRANTY",
      phone: "+1 (800) 555-8833",
      text: "Voicemail: 'This is our final courtesy call regarding your vehicle's factory warranty. Your coverage has lapsed. Press 2 now to extend coverage or your file will be permanently closed.'"
    },
    {
      title: "💻 Geek Squad $499 Auto-Renewal Call",
      tag: "REFUND_SCAM",
      phone: "+1 (888) 901-4421",
      text: "Voicemail: 'Thank you for your business. Your Geek Squad Best Buy annual computer protection has auto-renewed for $499.00. If you did not authorize this charge, call our refund team immediately at 1-888-901-4421.'"
    }
  ]
};

export default function MessageInput({ onAnalyze, isLoading }) {
  const [activeTab, setActiveTab] = useState('sms'); // 'sms' | 'phone' | 'call'
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const maxLength = 2000;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanMessage = message.trim();
    const cleanPhone = phoneNumber.trim();

    if ((!cleanMessage && !cleanPhone) || isLoading) return;

    // Build the payload
    const finalMessage = cleanMessage || (cleanPhone ? `Phone number check for: ${cleanPhone}` : '');
    
    onAnalyze({
      message: finalMessage,
      phoneNumber: cleanPhone || null,
      inputType: activeTab,
    });
  };

  const handleSelectSample = (sample) => {
    setMessage(sample.text);
    if (sample.phone) {
      setPhoneNumber(sample.phone);
    } else {
      setPhoneNumber('');
    }
    setDropdownOpen(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (activeTab === 'phone' && !message) {
          setPhoneNumber(text.slice(0, 50));
        } else {
          setMessage(text.slice(0, maxLength));
        }
      }
    } catch (err) {
      console.warn("Clipboard access denied:", err);
    }
  };

  const currentSamples = SAMPLES[activeTab] || SAMPLES.sms;
  const isOverLimit = message.length > maxLength;

  return (
    <div className="w-full bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <span>Spam & Scam Threat Scanner</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Check suspicious SMS messages, unknown phone numbers, or robocall transcripts for instant risk evaluation.
          </p>
        </div>

        {/* Quick Sample Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-emerald-400 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Test Samples</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-30 space-y-1 animate-scale-in">
              <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Select {activeTab.toUpperCase()} Scam Vector
              </div>
              {currentSamples.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium truncate group-hover:text-emerald-300">{sample.title}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-300 border border-slate-700 shrink-0 ml-2">
                    {sample.tag}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Mode Tabs */}
      <div className="flex items-center gap-2 mb-4 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => { setActiveTab('sms'); setDropdownOpen(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold transition-all ${
            activeTab === 'sms'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>SMS / Text Message</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('phone'); setDropdownOpen(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold transition-all ${
            activeTab === 'phone'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Phone Number / Caller ID</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('call'); setDropdownOpen(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold transition-all ${
            activeTab === 'call'
              ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Call / Voicemail Transcript</span>
        </button>
      </div>

      {/* Scanner Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Caller ID / Phone Number Input Row */}
        {(activeTab === 'phone' || activeTab === 'sms' || activeTab === 'call') && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {activeTab === 'phone' ? 'Phone Number to Investigate' : 'Sender Phone / Caller ID (Optional)'}
                </span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">e.g. +1 (800) 492-0192 or 888-234-9011</span>
            </div>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={activeTab === 'phone' ? "Enter unknown phone number, e.g. +1-888-234-9011 or +232 76 892 110" : "Sender number or name (e.g. +1-833-492-0192, USPS-Alert)"}
              className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              disabled={isLoading}
            />
          </div>
        )}

        {/* Message / Transcript Textarea */}
        <div className="relative rounded-xl border border-slate-700/80 bg-slate-950/70 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              activeTab === 'phone'
                ? "Additional context (optional): Did this number leave a voicemail or claim to be from your bank?"
                : activeTab === 'call'
                ? "Paste voicemail transcript or robocall text (e.g. 'This is Officer Mark from the IRS. A warrant has been issued...')"
                : "Paste suspicious SMS, email body, bank fraud text, delivery link, or WhatsApp message here..."
            }
            rows={activeTab === 'phone' ? 3 : 5}
            maxLength={maxLength}
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-y min-h-[90px] font-sans"
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

              {(message || phoneNumber) && (
                <button
                  type="button"
                  onClick={() => { setMessage(''); setPhoneNumber(''); }}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Clear fields"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Character Counter */}
            <div className="flex items-center gap-2">
              <span className={`font-mono text-xs ${isOverLimit ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                {message.length} / {maxLength}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {activeTab === 'phone' 
                ? 'Checks against known scam caller vectors, toll fraud prefixes, and spoofing signatures.' 
                : 'Evaluates artificial urgency, deceptive URLs, credential lures, and caller vectors.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={(!message.trim() && !phoneNumber.trim()) || isLoading || isOverLimit}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Scanning Threat Vector...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Check for Spam / Scam</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
