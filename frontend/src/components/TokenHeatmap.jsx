import React, { useState } from 'react';
import { Flame, AlertTriangle, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

const CATEGORY_STYLES = {
  URGENCY: {
    bg: 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50',
    dot: 'bg-red-500',
    label: 'Artificial Urgency',
    icon: '🚨'
  },
  AUTHORITY: {
    bg: 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/50',
    dot: 'bg-amber-500',
    label: 'Authority Spoofing',
    icon: '🎭'
  },
  MALICIOUS_LINK: {
    bg: 'bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-300 border-fuchsia-500/50',
    dot: 'bg-fuchsia-500',
    label: 'Malicious Contact Hook',
    icon: '🎣'
  },
  CREDENTIAL_DEMAND: {
    bg: 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border-pink-500/50',
    dot: 'bg-pink-500',
    label: 'Credential Harvesting',
    icon: '🔑'
  },
  FINANCIAL_BAIT: {
    bg: 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/50',
    dot: 'bg-emerald-500',
    label: 'Financial Bait',
    icon: '💸'
  }
};

export default function TokenHeatmap({ rawMessage, highlights = [] }) {
  const [selectedToken, setSelectedToken] = useState(null);

  if (!rawMessage) return null;

  // Build segments from text matching highlights
  const renderHighlightedText = () => {
    if (!highlights || highlights.length === 0) {
      return <span className="text-slate-300 font-mono text-sm leading-relaxed">{rawMessage}</span>;
    }

    // Sort highlights by length descending to match longer phrases first
    const sorted = [...highlights].sort((a, b) => (b.text?.length || 0) - (a.text?.length || 0));

    // Construct regex pattern of all highlight phrases safely
    const escapedTerms = sorted
      .map(h => h.text?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .filter(Boolean);

    if (escapedTerms.length === 0) {
      return <span className="text-slate-300 font-mono text-sm leading-relaxed">{rawMessage}</span>;
    }

    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    const parts = rawMessage.split(regex);

    return (
      <div className="font-mono text-sm leading-relaxed text-slate-300">
        {parts.map((part, idx) => {
          const matchedHighlight = sorted.find(
            h => h.text?.toLowerCase() === part.toLowerCase()
          );

          if (!matchedHighlight) {
            return <span key={idx}>{part}</span>;
          }

          const style = CATEGORY_STYLES[matchedHighlight.category] || CATEGORY_STYLES.URGENCY;
          const isSelected = selectedToken?.text?.toLowerCase() === part.toLowerCase();

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedToken(matchedHighlight)}
              className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded border transition-all text-xs font-semibold cursor-pointer ${
                style.bg
              } ${isSelected ? 'ring-2 ring-white scale-105 shadow-lg' : ''}`}
              title={`${style.label} (Severity: ${matchedHighlight.severity}/10)`}
            >
              <span className="mr-1">{style.icon}</span>
              {part}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Explainable AI (XAI) Threat Heatmap
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Interactive Tokens
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Hover or tap highlighted tokens to inspect psychological manipulation triggers and threat vectors.
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs text-slate-400 font-mono">
            Triggers flagged: <strong className="text-red-400">{highlights?.length || 0}</strong>
          </span>
        </div>
      </div>

      {/* Interactive Tokenized Text View */}
      <div className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-lg min-h-[80px]">
        {renderHighlightedText()}
      </div>

      {/* Selected Token Inspector Drawer */}
      {selectedToken && (
        <div className="p-3.5 bg-slate-950 border border-indigo-500/40 rounded-lg animate-fadeIn flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-slate-800 text-white">
                "{selectedToken.text}"
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${CATEGORY_STYLES[selectedToken.category]?.bg || 'text-slate-300'}`}>
                {CATEGORY_STYLES[selectedToken.category]?.icon} {CATEGORY_STYLES[selectedToken.category]?.label || selectedToken.category}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {selectedToken.explanation}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Severity Weight</div>
              <div className="text-sm font-bold font-mono text-red-400">
                {selectedToken.severity || 8} / 10
              </div>
            </div>
            <button
              onClick={() => setSelectedToken(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Category Legend */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
        <span className="font-semibold text-slate-300 mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Taxonomy:
        </span>
        {Object.entries(CATEGORY_STYLES).map(([catKey, style]) => (
          <span
            key={catKey}
            className={`inline-flex items-center px-2 py-0.5 rounded border ${style.bg}`}
          >
            <span className="mr-1">{style.icon}</span>
            {style.label}
          </span>
        ))}
      </div>
    </div>
  );
}
