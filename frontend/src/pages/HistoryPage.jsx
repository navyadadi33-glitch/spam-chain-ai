import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  Plus, 
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ScanCard from '../components/ScanCard';

export default function HistoryPage() {
  const { token, user, signInDemoUser } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

  const fetchScans = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      let activeToken = token;
      if (!activeToken) {
        signInDemoUser();
        activeToken = 'demo-token';
      }

      const response = await fetch(`${API_BASE}/scans`, {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch scan history');
      }

      setScans(data.scans || []);
    } catch (err) {
      console.error('History fetch error:', err);
      setErrorMsg(err.message || 'Could not load your scan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, [token]);

  const handleDelete = async (scanId) => {
    try {
      const response = await fetch(`${API_BASE}/scans/${scanId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token || 'demo-token'}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete scan');
      }

      setScans(prev => prev.filter(s => s.id !== scanId));
    } catch (err) {
      console.error('Delete scan error:', err);
      alert('Could not delete scan: ' + err.message);
    }
  };

  // Filter & Search Logic
  const filteredScans = scans.filter((scan) => {
    const matchesFilter = selectedFilter === 'ALL' || scan.risk_level?.toUpperCase() === selectedFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      scan.raw_message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.explanation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalScans = scans.length;
  const scamCount = scans.filter(s => s.risk_level === 'Scam').length;
  const safeCount = scans.filter(s => s.risk_level === 'Safe').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personal Scan Vault
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-medium">
              {scans.length} Scans Saved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Review your historical threat evaluations, filter by vector, and analyze past phishing hooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Scan</span>
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Total Analyses</span>
            <div className="text-2xl font-bold font-mono text-white mt-0.5">{totalScans}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
            <History className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-rose-400 uppercase">High Risk Scams</span>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-0.5">{scamCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 uppercase">Verified Safe</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">{safeCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, domains, or categories..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {['ALL', 'SCAM', 'SPAM', 'SUSPICIOUS', 'SAFE'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                selectedFilter === lvl
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {lvl}
            </button>
          ))}

          <button
            onClick={fetchScans}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-auto sm:ml-2"
            title="Refresh Scan Vault"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scan Cards List */}
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Retrieving encrypted scan records...</p>
        </div>
      ) : errorMsg ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#0F172A]/50 border border-slate-800/80 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mx-auto">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No scan records found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery || selectedFilter !== 'ALL'
                ? 'No scans match your current filter criteria. Try resetting filters.'
                : 'You have not analyzed any messages yet. Start your first scan on the dashboard!'}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Scan A Message Now</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredScans.map((scan) => (
            <ScanCard
              key={scan.id}
              scan={scan}
              onDelete={handleDelete}
              isPublic={false}
            />
          ))}
        </div>
      )}

    </div>
  );
}

