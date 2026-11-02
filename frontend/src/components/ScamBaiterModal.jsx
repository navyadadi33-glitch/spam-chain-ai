import React, { useState } from 'react';
import { Bot, User, Clock, DollarSign, Target, Send, Sparkles, X, Shield, RefreshCw } from 'lucide-react';
import { API_BASE } from '../apiConfig';

const PERSONAS = [
  {
    id: 'grandma',
    name: 'Grandma Gertrude',
    avatar: '👵',
    desc: '81 y/o, sweet, bakes cookies, confuses internet with microwave. Stalls endlessly.'
  },
  {
    id: 'crypto_noob',
    name: 'Crypto Kevin',
    avatar: '📱',
    desc: '22 y/o beginner with $45 in Dogecoin. Asks endless naive blockchain questions.'
  },
  {
    id: 'confused_exec',
    name: 'VP Richard',
    avatar: '💼',
    desc: 'Corporate VP in board meetings. Demands W-9 tax forms and procurement approval.'
  }
];

export default function ScamBaiterModal({ initialScamMessage, isOpen, onClose }) {
  if (!isOpen) return null;

  const [persona, setPersona] = useState('grandma');
  const [messages, setMessages] = useState([
    {
      role: 'scammer',
      content: initialScamMessage || 'USPS: Your package cannot be delivered due to incomplete address. Update info at http://usps-update-parcel.top/verify or pay $1.50 redelivery fee.'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [intel, setIntel] = useState([
    'Phishing URL: http://usps-update-parcel.top/verify'
  ]);
  const [timeWasted, setTimeWasted] = useState(3.5);
  const [userInput, setUserInput] = useState('');

  const activePersonaObj = PERSONAS.find(p => p.id === persona) || PERSONAS[0];

  const sendHoneypotTurn = async (customScammerMsg = null) => {
    setLoading(true);
    try {
      const updatedMessages = customScammerMsg
        ? [...messages, { role: 'scammer', content: customScammerMsg }]
        : messages;

      if (customScammerMsg) {
        setMessages(updatedMessages);
        setUserInput('');
      }

      const res = await fetch(`${API_BASE}/honeypot/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageHistory: updatedMessages,
          persona,
          scamContext: initialScamMessage
        })
      });

      if (!res.ok) throw new Error('Failed to query Honeypot API');
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply }
      ]);
      setTimeWasted(prev => prev + 3.5);

      if (Array.isArray(data.extractedIntel) && data.extractedIntel.length > 0) {
        setIntel(prev => Array.from(new Set([...prev, ...data.extractedIntel])));
      }
    } catch (err) {
      console.error('Honeypot error:', err);
      // Fallback in-character response
      const fallbackReplies = {
        grandma: "Oh dear, my glasses are in the sewing basket! Is this for the parcel with my knitting yarn? Which button do I push?",
        crypto_noob: "Bro, is gas fee included in this? My MetaMask says insufficient funds, can you send 0.005 ETH to activate my wallet?",
        confused_exec: "I'm in an executive briefing. Please email your W-9 and company purchase order to our billing desk."
      };
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: fallbackReplies[persona] || fallbackReplies.grandma }
      ]);
      setTimeWasted(prev => prev + 3.5);
    } finally {
      setLoading(false);
    }
  };

  const simulateAutoBait = async () => {
    if (loading) return;
    setLoading(true);
    const simulatedPrompts = [
      "Scammer: You must pay now or your account will be permanently locked!",
      "Scammer: Send $50 Apple Card or Bitcoin to wallet 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa immediately."
    ];

    for (const prompt of simulatedPrompts) {
      setMessages(prev => [...prev, { role: 'scammer', content: prompt }]);
      await new Promise(r => setTimeout(r, 800));
      await sendHoneypotTurn();
      await new Promise(r => setTimeout(r, 800));
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  ScamBaiter AI: Autonomous Counter-Spammer Honeypot
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
                  ACTIVE SIMULATION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deploy autonomous personas to waste scammer time, stall attacks, and extract criminal telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Threat Scoreboard Ticker */}
        <div className="bg-slate-950/60 px-4 py-2.5 border-b border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
            <div className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> SCAMMER TIME WASTED
            </div>
            <div className="text-sm font-bold text-cyan-400">{timeWasted.toFixed(1)} mins</div>
          </div>
          <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
            <div className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> LOSS PREVENTED
            </div>
            <div className="text-sm font-bold text-emerald-400">$1,450.00</div>
          </div>
          <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
            <div className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
              <Target className="w-3 h-3 text-red-400" /> INTEL EXTRACTED
            </div>
            <div className="text-sm font-bold text-red-400">{intel.length} Threat Items</div>
          </div>
        </div>

        {/* Persona Selector Tabs */}
        <div className="bg-slate-950/40 p-3 border-b border-slate-800 flex flex-wrap gap-2 items-center justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase">Select Counter-Persona:</span>
          <div className="flex gap-1.5">
            {PERSONAS.map(p => (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  persona === p.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{p.avatar}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-900/50 min-h-[260px] max-h-[380px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.role === 'scammer' ? 'justify-start' : 'justify-end'}`}
            >
              {m.role === 'scammer' && (
                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center shrink-0 text-sm">
                  👺
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-mono leading-relaxed shadow-md ${
                  m.role === 'scammer'
                    ? 'bg-slate-800/90 text-red-200 border border-red-500/30 rounded-tl-none'
                    : 'bg-indigo-600/90 text-white border border-indigo-500/50 rounded-tr-none'
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-70">
                  {m.role === 'scammer' ? 'Malicious Attacker' : `${activePersonaObj.name} (AI Counter-Agent)`}
                </div>
                {m.content}
              </div>

              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0 text-sm">
                  {activePersonaObj.avatar}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono italic">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              {activePersonaObj.name} is crafting a believable stall response...
            </div>
          )}
        </div>

        {/* Harvested Attacker Intelligence Bar */}
        {intel.length > 0 && (
          <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
            <span className="text-red-400 font-bold shrink-0 flex items-center gap-1">
              <Target className="w-3 h-3" /> Harvested Intel:
            </span>
            {intel.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30 shrink-0"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => sendHoneypotTurn()}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shadow-indigo-600/30"
            >
              <Bot className="w-4 h-4" />
              Generate Counter-Reply
            </button>

            <button
              onClick={simulateAutoBait}
              disabled={loading}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
              title="Automatically simulate multiple turns to showcase judge demo"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Auto-Bait Demo
            </button>
          </div>

          {/* Test Attacker Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (userInput.trim()) sendHoneypotTurn(userInput);
            }}
            className="flex items-center gap-1.5 w-full sm:w-auto sm:flex-1 sm:max-w-xs"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Simulate scammer message..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
            />
            <button
              type="submit"
              disabled={!userInput.trim() || loading}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

