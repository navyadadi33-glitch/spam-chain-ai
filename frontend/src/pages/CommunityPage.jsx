import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe2, 
  Flame, 
  ShieldAlert, 
  Filter, 
  RotateCcw, 
  AlertOctagon, 
  Sparkles, 
  CheckCircle2,
  ExternalLink,
  Plus
} from 'lucide-react';
import ScanCard from '../components/ScanCard';

export default function CommunityPage() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

  const fetchCommunityFeed = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE}/community?limit=30`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch community threat intelligence feed');
      }

      setFeed(data.feed || []);
    } catch (err) {
      console.error('Community feed fetch error:', err);
      setErrorMsg(err.message || 'Could not load the community threat feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityFeed();
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Threats' },
    { id: 'SMISHING', label: '📦 Smishing' },
    { id: 'FINANCIAL_SCAM', label: '🚨 Banking/Crypto' },
    { id: 'PHISHING', label: '🎣 Credential Phishing' },
    { id: 'SOCIAL_ENGINEERING', label: '🎭 Social Engineering' },
  ];

  const filteredFeed = feed.filter((scan) => {
    if (selectedCategory === 'ALL') return true;
    return scan.category === selectedCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Globe2 className="w-7 h-7 text-emerald-400" />
              <span>Community Threat Intel Stream</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-medium">
              Live Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time anonymized telemetry of confirmed scams, phishing payloads, and smishing hooks detected across the community.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Suspicious Text</span>
          </Link>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white block mb-0.5">Privacy First Anonymization Guarantee:</span>
          All community reports are automatically stripped of user identifiers, phone numbers, and recipient names. Only threat vectors, deceptive domains, and psychological tactics are cataloged for public defense.
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={fetchCommunityFeed}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading verified threat vectors...</p>
        </div>
      ) : errorMsg ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {errorMsg}
        </div>
      ) : filteredFeed.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#0F172A]/50 border border-slate-800/80 space-y-3">
          <p className="text-sm font-semibold text-slate-300">No threats found in this category.</p>
          <p className="text-xs text-slate-400">Try selecting "All Threats" to view general reports.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredFeed.map((scan) => (
            <ScanCard
              key={scan.id}
              scan={scan}
              isPublic={true}
            />
          ))}
        </div>
      )}

    </div>
  );
}

