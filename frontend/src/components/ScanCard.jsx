import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Skull, 
  Trash2, 
  ChevronDown, 
  Clock, 
  Tag, 
  Share2, 
  Check, 
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import SpamChainView from './SpamChainView';

export default function ScanCard({ scan, onDelete, isPublic = false }) {
  const [expanded, setExpanded] = useState(false);
  const [showChain, setShowChain] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!scan) return null;

  const getRiskBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'scam':
        return {
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: Skull,
        };
      case 'spam':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: AlertTriangle,
        };
      case 'suspicious':
        return {
          bg: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
          icon: AlertTriangle,
        };
      case 'safe':
      default:
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: ShieldCheck,
        };
    }
  };

  const badge = getRiskBadge(scan.risk_level);
  const IconComponent = badge.icon;

  const formattedDate = scan.created_at
    ? new Date(scan.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Recent';

  const handleCopySummary = () => {
    const text = `[SpamChain AI Threat Report]\nRisk: ${scan.risk_level} (${scan.risk_score}/100)\nCategory: ${scan.category}\nExplanation: ${scan.explanation}\nMessage: "${scan.raw_message}"`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#0F172A]/80 border border-slate-800 p-5 sm:p-6 shadow-xl backdrop-blur-md hover:border-slate-700 transition-all">
      {/* Top Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Risk Level Badge */}
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.bg}`}>
            <IconComponent className="w-3.5 h-3.5" />
            <span>{scan.risk_level} ({scan.risk_score}/100)</span>
          </span>

          {/* Threat Category */}
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
            {scan.category}
          </span>
        </div>

        {/* Timestamp & Actions */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{formattedDate}</span>
          </div>

          <button
            type="button"
            onClick={handleCopySummary}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Copy Report"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {!isPublic && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(scan.id)}
              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
              title="Delete Scan Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Raw Suspicious Message Snippet */}
      <div className="mb-4">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
          Analyzed Payload Message
        </span>
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-xs text-slate-200 leading-relaxed break-words">
          {expanded || scan.raw_message.length <= 160
            ? scan.raw_message
            : `${scan.raw_message.slice(0, 160)}...`}
          {scan.raw_message.length > 160 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-2 text-emerald-400 hover:underline text-xs font-sans font-medium"
            >
              {expanded ? 'Show Less' : 'Show Full Message'}
            </button>
          )}
        </div>
      </div>

      {/* Threat Explanation */}
      <div className="mb-4">
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {scan.explanation}
        </p>
      </div>

      {/* Warning Signs & Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Red Flags */}
        {scan.warning_signs && scan.warning_signs.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Red Flags & Indicators</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {scan.warning_signs.map((sign, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safety Recommendations */}
        {scan.recommendations && scan.recommendations.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Actionable Defense</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {scan.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Toggle Full Spam Chain Breakdown Button */}
      {scan.spam_chain && (
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowChain(!showChain)}
            className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>{showChain ? 'Collapse 5-Step Spam Chain' : 'Inspect 5-Step Spam Chain Breakdown'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showChain ? 'rotate-180' : ''}`} />
          </button>

          {showChain && (
            <div className="mt-4 animate-fade-in">
              <SpamChainView spamChain={scan.spam_chain} riskLevel={scan.risk_level} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

