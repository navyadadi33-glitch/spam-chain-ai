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
  Info
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

  const handleAnalyze = async (messageText) => {
    setErrorMsg('');
    setLoading(true);

    try {
      // If user is not signed in yet, automatically provision demo analyst session
      let activeToken = token;
      if (!activeToken) {
        signInDemoUser();
        activeToken = 'demo-token';
      }

      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ message: messageText }),
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
        }, 100);
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
    const report = `[SpamChain AI Threat Report]\nRisk Level: ${currentScan.risk_level} (${currentScan.risk_score}/100)\nCategory: ${currentScan.category}\n\nExplanation:\n${currentScan.explanation}\n\n5-Stage Spam Chain Breakdown:\n- Sender: ${currentScan.spam_chain?.sender}\n- Urgency: ${currentScan.spam_chain?.urgency}\n- Suspicious Link: ${currentScan.spam_chain?.suspiciousLink}\n- Info Demanded: ${currentScan.spam_chain?.informationRequest}\n- Risk Summary: ${currentScan.spam_chain?.finalRiskSummary}`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Threat Intelligence Console
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium">
              Live Scanner
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Submit SMS strings, email bodies, or social media messages for deep forensic decomposition.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/history"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scan History</span>
          </Link>
          <Link
            to="/community"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Community Feed</span>
          </Link>
        </div>
      </div>

      {/* Analyzer Input Component */}
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
              className="text-xs hover:underline text-rose-300 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && <LoadingSkeleton />}

      {/* Active Analysis Results Display */}
      {currentScan && !loading && (
        <div id="analysis-results-section" className="space-y-6 animate-fade-in">
          
          {/* Top Result Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Gemini Threat Assessment Complete</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    ID: {currentScan.id?.slice(0, 8)}...
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Scan saved automatically to your profile record.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                title="Copy threat report summary"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Report Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy Full Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Risk Gauge Visual Component */}
          <RiskGauge
            score={currentScan.risk_score}
            level={currentScan.risk_level}
            category={currentScan.category}
          />

          {/* Explanation Box */}
          <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-xl space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Forensic Assessment & Why It Is Risky</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {currentScan.explanation}
            </p>
          </div>

          {/* Warning Signs & Recommendations 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Warning Signs */}
            <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Detected Red Flags & Psychological Levers</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentScan.warning_signs?.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <span className="text-rose-400 font-bold text-sm leading-none">•</span>
                    <span className="leading-relaxed">{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Actionable Security Countermeasures</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentScan.recommendations?.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <span className="text-emerald-400 font-bold text-sm leading-none">✓</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Interactive Spam Chain View Breakdown */}
          {currentScan.spam_chain && (
            <SpamChainView
              spamChain={currentScan.spam_chain}
              riskLevel={currentScan.risk_level}
            />
          )}

        </div>
      )}

      {/* Informational Guidance Footer when no scan yet */}
      {!currentScan && !loading && (
        <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center space-y-3">
          <h3 className="text-sm font-semibold text-slate-300">
            How SpamChain AI Evaluates Incoming Text
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every submission is processed through Google Gen AI (`gemini-2.5-flash`) with structured schema constraints. We examine typo-squatted URLs, spoofed sender domains, artificial scarcity keywords, and deceptive credential request patterns.
          </p>
        </div>
      )}

    </div>
  );
}

