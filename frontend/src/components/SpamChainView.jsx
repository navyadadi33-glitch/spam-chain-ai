import React, { useState } from 'react';
import { 
  UserX, 
  Hourglass, 
  Link2Off, 
  CreditCard, 
  ShieldAlert, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  AlertOctagon,
  Copy,
  Check
} from 'lucide-react';

export default function SpamChainView({ spamChain, riskLevel }) {
  const [copiedStep, setCopiedStep] = useState(null);

  if (!spamChain) return null;

  const steps = [
    {
      num: 1,
      title: "Sender Vector",
      subtitle: "Spoofed Identity & Origin",
      description: spamChain.sender || "Unverified sender impersonating legitimate institution.",
      icon: UserX,
      color: "from-blue-500/20 to-indigo-500/10",
      border: "border-blue-500/30",
      accent: "text-blue-400",
      badge: "ORIGIN HOOK"
    },
    {
      num: 2,
      title: "Urgency Pressure",
      subtitle: "Psychological Tactic",
      description: spamChain.urgency || "Artificial deadline designed to disable analytical caution.",
      icon: Hourglass,
      color: "from-amber-500/20 to-orange-500/10",
      border: "border-amber-500/30",
      accent: "text-amber-400",
      badge: "COERCION"
    },
    {
      num: 3,
      title: "Malicious Hook",
      subtitle: "Redirect / Link Analysis",
      description: spamChain.suspiciousLink || "Deceptive domain or unverified phone hook.",
      icon: Link2Off,
      color: "from-rose-500/20 to-red-500/10",
      border: "border-rose-500/30",
      accent: "text-rose-400",
      badge: "TRAP MECHANISM"
    },
    {
      num: 4,
      title: "Payload Demanded",
      subtitle: "Sensitive Data Extraction",
      description: spamChain.informationRequest || "Harvesting credentials, payment info, or OTP codes.",
      icon: CreditCard,
      color: "from-purple-500/20 to-violet-500/10",
      border: "border-purple-500/30",
      accent: "text-purple-400",
      badge: "EXTRACTION"
    },
    {
      num: 5,
      title: "Risk Consequence",
      subtitle: "Synthesis & Impact",
      description: spamChain.finalRiskSummary || "High probability of credential takeover or asset depletion.",
      icon: ShieldAlert,
      color: "from-red-600/30 to-rose-700/20",
      border: "border-red-500/40",
      accent: "text-red-400",
      badge: "FINAL ASSESSMENT"
    }
  ];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(idx);
    setTimeout(() => setCopiedStep(null), 1800);
  };

  return (
    <div className="w-full bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Interactive Spam Chain™ Breakdown</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                5-Stage Forensic Vector
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Tracing the anatomy of deceit from initial bait to final financial/identity risk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Chain Integrity Verified</span>
        </div>
      </div>

      {/* Chain Nodes Grid / Sequential Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCopied = copiedStep === idx;
          return (
            <div
              key={step.num}
              className={`relative rounded-xl p-4 bg-gradient-to-b ${step.color} border ${step.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between group`}
            >
              {/* Step indicator top */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-slate-700/80 font-mono text-xs font-bold text-white shadow-inner">
                    {step.num}
                  </span>
                  <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 ${step.accent}`}>
                    {step.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${step.accent} shrink-0`} />
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {step.title}
                  </h4>
                </div>

                <p className="text-[11px] font-medium text-slate-400 mb-2 font-mono">
                  {step.subtitle}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed break-words bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 font-sans">
                  {step.description}
                </p>
              </div>

              {/* Bottom copy / inspect action */}
              <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-[10px] text-slate-400">Vector #{step.num}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(step.description, idx)}
                  className="flex items-center gap-1 hover:text-white transition-colors p-1"
                  title="Copy vector text"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanatory Banner Below Chain */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Scammers rely on compounding each link of the chain. Disrupting even <strong>one link</strong> (e.g. refusing to click the link or calling the bank directly) completely neutralizes the threat.
          </span>
        </div>
      </div>

    </div>
  );
}

