import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  Share2, 
  Check, 
  Layers, 
  Flame, 
  HelpCircle,
  ExternalLink,
  Info,
  ShieldCheck,
  Skull,
  Ban,
  CheckCircle,
  RotateCcw,
  ArrowRight,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MessageInput from '../components/MessageInput';
import RiskGauge from '../components/RiskGauge';
import SpamChainView from '../components/SpamChainView';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function DashboardPage() {
  const { token, user, signInDemoUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentScan, setCurrentScan] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

  const handleAnalyze = async (payload) => {
    setErrorMsg('');
    setLoading(true);

    try {
      // If user is not signed in yet, automatically provision demo analyst session
      let activeToken = token;
      if (!activeToken) {
        signInDemoUser();
        activeToken = 'demo-token';
      }

      // Handle both string and structured object inputs
      const requestData = typeof payload === 'string'
        ? { message: payload }
        : {
            message: payload.message,
            phoneNumber: payload.phoneNumber || null,
            inputType: payload.inputType || 'text',
          };

      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to analyze message');
      }

      if (data.scan) {
        setCurrentScan(data.scan);
        // Scroll smoothly to results
        setTimeout(() => {
          const resultsElem = document.getElementById('analysis-results-section');
          if (resultsElem) {
            resultsElem.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMsg(err.message || 'Threat assessment engine encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!currentScan) return;
    const report = `[SpamChain AI Threat Report]
Verdict: ${currentScan.risk_level === 'Safe' ? 'NOT SPAM (SAFE)' : 'LIKELY SPAM / SCAM'}
Risk Score: ${currentScan.risk_score}/100 (${currentScan.risk_level})
Threat Category: ${currentScan.category}

Input Content:
"${currentScan.raw_message}"

Forensic Explanation:
${currentScan.explanation}

Detected Red Flags:
${currentScan.warning_signs?.map(w => `- ${w}`).join('\n')}

Recommended Action Protocol:
${currentScan.recommendations?.map(r => `- ${r}`).join('\n')}

5-Stage Spam Chain Breakdown:
1. Sender Vector: ${currentScan.spam_chain?.sender}
2. Urgency Pressure: ${currentScan.spam_chain?.urgency}
3. Malicious Hook: ${currentScan.spam_chain?.suspiciousLink}
4. Payload Extraction: ${currentScan.spam_chain?.informationRequest}
5. Risk Synthesis: ${currentScan.spam_chain?.finalRiskSummary}`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVerdictTheme = (level, score) => {
    switch (level?.toLowerCase()) {
      case 'scam':
        return {
          verdictText: 'LIKELY SCAM / FRAUD DETECTED',
          isSpam: true,
          color: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/40',
          badgeBg: 'bg-rose-500 text-slate-950',
          icon: Skull,
          summary: 'Critical malicious threat detected. Strong evidence of credential harvesting, identity theft, or financial extortion.',
          actionTag: 'CRITICAL: BLOCK & DO NOT ENGAGE',
        };
      case 'spam':
        return {
          verdictText: 'LIKELY SPAM / UNWANTED',
          isSpam: true,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/40',
          badgeBg: 'bg-amber-500 text-slate-950',
          icon: Flame,
          summary: 'Unsolicited mass broadcast, deceptive promotional bait, or aggressive telemarketing.',
          actionTag: 'RECOMMENDED: BLOCK OR IGNORE',
        };
      case 'suspicious':
        return {
          verdictText: 'SUSPICIOUS ANOMALY DETECTED',
          isSpam: true,
          color: 'text-yellow-300',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/40',
          badgeBg: 'bg-yellow-400 text-slate-950',
          icon: AlertTriangle,
          summary: 'Exhibits social engineering vectors, unverified links, or unfamiliar caller profiles.',
          actionTag: 'CAUTION: VERIFY INDEPENDENTLY',
        };
      case 'safe':
      default:
        return {
          verdictText: 'LIKELY SAFE / LEGITIMATE',
          isSpam: false,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-400 text-slate-950',
          icon: ShieldCheck,
          summary: 'No active phishing traps, spoofing cues, or coercive pressure tactics identified.',
          actionTag: 'VERIFIED: NORMAL COMMUNICATION',
        };
    }
  };

  const verdict = currentScan ? getVerdictTheme(currentScan.risk_level, currentScan.risk_score) : null;
  const VerdictIcon = verdict?.icon;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Threat Intelligence Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium">
              Live Scanner
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Analyze suspicious SMS messages, caller phone numbers, or voicemail transcripts with Gemini AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/history"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scan Vault</span>
          </Link>
          <Link
            to="/community"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Threat Feed</span>
          </Link>
        </div>
      </div>

      {/* Analyzer Multi-Vector Input Component */}
      <div className="space-y-4">
        <MessageInput onAnalyze={handleAnalyze} isLoading={loading} />

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg('')}
              className="text-xs hover:underline text-rose-300 font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton during AI evaluation */}
      {loading && <LoadingSkeleton />}

      {/* Active Analysis Results Display */}
      {currentScan && !loading && (
        <div id="analysis-results-section" className="space-y-6 animate-fade-in">
          
          {/* HIGH-IMPACT VERDICT BANNER */}
          <div className={`p-6 sm:p-7 rounded-2xl ${verdict.bg} border ${verdict.border} shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all`}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              {/* Left Verdict Details */}
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-2xl ${verdict.badgeBg} shadow-lg shrink-0`}>
                  <VerdictIcon className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`text-xs font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full ${verdict.badgeBg}`}>
                      {verdict.actionTag}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Category: <strong className="text-white">{currentScan.category}</strong>
                    </span>
                  </div>

                  <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${verdict.color}`}>
                    {verdict.verdictText}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {verdict.summary}
                  </p>
                </div>
              </div>

              {/* Right Score & Actions */}
              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-800/80 pt-4 lg:pt-0">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Risk Index</span>
                  <div className={`text-3xl sm:text-4xl font-extrabold font-mono ${verdict.color}`}>
                    {currentScan.risk_score}<span className="text-xs text-slate-500 font-normal">/100</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                    title="Copy full threat assessment"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-300" />
                        <span>Copy Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Visual Risk Gauge & Forensic Breakdown */}
          <RiskGauge
            score={currentScan.risk_score}
            level={currentScan.risk_level}
            category={currentScan.category}
          />

          {/* Forensic Explanation Card */}
          <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-xl space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Forensic Assessment & Why It Is Risky</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {currentScan.explanation}
            </p>
          </div>

          {/* 2-Column Grid: Detected Reasons vs Recommended Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Detected Reasons (Red Flags) */}
            <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Detected Reasons & Threat Indicators</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {currentScan.warning_signs?.length || 0} Flags
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 pt-1">
                {currentScan.warning_signs?.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-rose-400 font-bold text-sm leading-none mt-0.5">•</span>
                    <span className="leading-relaxed">{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Action Protocol */}
            <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Recommended Action Protocol</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Defense Checklist
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 pt-1">
                {currentScan.recommendations?.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Interactive 5-Stage Spam Chain Breakdown */}
          {currentScan.spam_chain && (
            <SpamChainView
              spamChain={currentScan.spam_chain}
              riskLevel={currentScan.risk_level}
            />
          )}

          {/* Bottom Action Footer */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-mono">
              Scan Record ID: <strong className="text-slate-200">{currentScan.id}</strong> (Saved to Vault)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Check Another Message</span>
              </button>
              <Link
                to="/history"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium transition-colors"
              >
                <span>View in Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      )}

      {/* Guidance Footer when no scan has been executed */}
      {!currentScan && !loading && (
        <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center space-y-3">
          <h3 className="text-sm font-semibold text-slate-300">
            Multi-Vector Threat Intelligence Engine
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            SpamChain AI uses Google Gemini to inspect SMS phish messages, spoofed caller IDs, and robocall audio transcripts. It parses social engineering urgency, extracts deceptive links, and breaks down the attack into a 5-step Spam Chain.
          </p>
        </div>
      )}

    </div>
  );
}
