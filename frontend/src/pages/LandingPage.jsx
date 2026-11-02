import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Lock, 
  Cpu, 
  Globe2, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Terminal,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import SpamChainView from '../components/SpamChainView';

export default function LandingPage() {
  const previewSpamChain = {
    sender: "Spoofed postal carrier service from an unregistered virtual SMS gateway (+1-833-XXX-XXXX)",
    urgency: "Strict 12-hour ultimatum claiming the parcel will be permanently returned to sender",
    suspiciousLink: "https://usps-post-redelivery.top/confirm (Credential & credit card harvesting domain)",
    informationRequest: "Requests full name, billing address, card number, expiration, and 3-digit CVV",
    finalRiskSummary: "Total identity fraud and unauthorized banking charges via weaponized smishing"
  };

  return (
    <div className="space-y-24 py-8 sm:py-16">
      
      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium shadow-glow-primary">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Powered by Google Gemini 2.5 Flash</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans max-w-4xl mx-auto leading-tight">
          Decode Deceit. Expose Scams.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Unravel The Spam Chain.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Suspicious SMS? Unrecognized bank alert? Dubious crypto offer? SpamChain AI tears down social engineering attacks into a transparent 5-step attack vector so you never fall victim.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
          >
            <span>Start Scanning Suspicious Text</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/community"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
          >
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>View Public Threat Feed</span>
          </Link>
        </div>

        {/* Trust metrics */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Structured JSON Intelligence</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Supabase RLS Data Isolation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero Data Leakage Backend</span>
          </div>
        </div>
      </section>

      {/* Live Interactive Preview Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Forensic Inspection in Action
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            See how SpamChain AI dissects an active USPS package delivery smishing lure in real time.
          </p>
        </div>

        <div className="space-y-6 bg-slate-950/60 p-4 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
          
          {/* Mock Input snippet */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 flex items-start gap-3">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Incoming SMS Sample:</span>
              "USPS: Your package cannot be delivered due to incomplete address. Update info within 12 hours at https://usps-post-redelivery.top/confirm or item will be returned to sender."
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
              THREAT DETECTED
            </span>
          </div>

          {/* Risk Gauge Preview */}
          <RiskGauge score={95} level="Scam" category="SMISHING" />

          {/* Spam Chain 5 Steps Preview */}
          <SpamChainView spamChain={previewSpamChain} riskLevel="Scam" />
        </div>
      </section>

      {/* 5-Step Anatomy Vector Feature Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>The SpamChain Framework</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            The 5 Critical Steps of Every Scam
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Scams are engineered using systematic psychological levers. SpamChain AI maps each layer to keep you ahead of modern social engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-white">Sender Vector Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects VoIP gateways, typo-squatted domains, and unauthorized impersonation of institutions like USPS, Chase, Apple, and PayPal.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-white">Psychological Pressure Gauging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies artificial countdowns, threats of arrest, simulated account freeze ultimatums, and predatory FOMO triggers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-white">Deceptive Hook Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Isolates rogue URL shorteners, fake call center phone numbers, and WhatsApp redirect hooks before you click.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold">
              04
            </div>
            <h3 className="text-base font-bold text-white">Payload & Credential Demands</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies whether attackers are soliciting one-time passcodes (OTPs), bank logins, credit card CVVs, or crypto seed phrases.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
              05
            </div>
            <h3 className="text-base font-bold text-white">Actionable Defense Protocol</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Delivers tailored defensive countermeasures: carrier reporting (7726), card replacement instructions, and official channel verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900/90 border border-emerald-500/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mt-3">Ready to test any message?</h3>
              <p className="text-xs text-slate-300 mt-1">
                Zero installations required. Run instant scans directly in your browser.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>Launch Analyzer</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-900/20 to-slate-900 p-8 sm:p-12 border border-emerald-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Stay One Step Ahead of Modern Phishing
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Join security-conscious individuals and analysts relying on SpamChain AI to evaluate messages instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
            >
              Analyze Your First Message
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

