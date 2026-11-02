import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Skull, 
  HelpCircle,
  TrendingUp,
  Tag
} from 'lucide-react';

export default function RiskGauge({ score = 0, level = 'Safe', category = 'SAFE' }) {
  // Normalize score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Color mappings
  const getRiskTheme = (level) => {
    switch (level?.toLowerCase()) {
      case 'scam':
        return {
          color: 'text-rose-500',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          glow: 'shadow-glow-danger',
          strokeColor: '#EF4444',
          badgeText: 'CRITICAL THREAT / SCAM',
          description: 'Active weaponized fraud. Do NOT interact, click links, or reply.',
          icon: Skull,
        };
      case 'spam':
        return {
          color: 'text-amber-500',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          glow: 'shadow-glow-warning',
          strokeColor: '#F59E0B',
          badgeText: 'HIGH RISK SPAM',
          description: 'Intrusive commercial or deceptive blast. Recommended action: Block sender.',
          icon: Flame,
        };
      case 'suspicious':
        return {
          color: 'text-yellow-400',
          bg: 'bg-yellow-400/10',
          border: 'border-yellow-400/30',
          glow: 'shadow-glow-warning',
          strokeColor: '#EAB308',
          badgeText: 'SUSPICIOUS ANOMALY',
          description: 'Exhibits social engineering vectors or unverified links. Proceed with extreme caution.',
          icon: AlertTriangle,
        };
      case 'safe':
      default:
        return {
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          glow: 'shadow-glow-primary',
          strokeColor: '#10B981',
          badgeText: 'BENIGN / SAFE',
          description: 'No known phishing signatures or deceptive triggers detected.',
          icon: ShieldCheck,
        };
    }
  };

  const theme = getRiskTheme(level);
  const IconComponent = theme.icon;

  // SVG Gauge Calculations (Semi-circle or 240-degree arc)
  // Radius: 60, Center: (70, 70)
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  // Use a 240 degree gauge (2/3 of circle)
  const gaugeTotalArc = circumference * 0.75;
  const strokeDashoffset = gaugeTotalArc - (normalizedScore / 100) * gaugeTotalArc;

  const categoryLabels = {
    PHISHING: 'Phishing / Credential Trap',
    FINANCIAL_SCAM: 'Financial / Banking Fraud',
    SMISHING: 'SMS Delivery Smishing',
    SOCIAL_ENGINEERING: 'Social Engineering / Impersonation',
    GENERAL_SPAM: 'General Marketing Spam',
    SAFE: 'Legitimate Communication'
  };

  return (
    <div className={`p-6 rounded-2xl bg-[#0F172A]/90 border ${theme.border} ${theme.glow} transition-all duration-500 backdrop-blur-xl relative overflow-hidden`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Gauge Display */}
        <div className="flex items-center gap-5">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Arc Gauge */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              {/* Background track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={`${gaugeTotalArc} ${circumference}`}
                strokeLinecap="round"
              />
              {/* Progress arc */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={theme.strokeColor}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={`${gaugeTotalArc} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-extrabold tracking-tight font-mono ${theme.color}`}>
                {normalizedScore}
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Risk Index
              </span>
            </div>
          </div>

          {/* Classification details */}
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${theme.bg} ${theme.color} border ${theme.border}`}>
                <IconComponent className="w-3.5 h-3.5" />
                <span>{theme.badgeText}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 justify-center sm:justify-start text-xs text-slate-300">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-200">Category:</span>
              <span className="font-mono text-emerald-400">
                {categoryLabels[category] || category}
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {theme.description}
            </p>
          </div>
        </div>

        {/* Right: Quick metric pills */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
          <div className="flex-1 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center sm:text-left">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Threat Score</span>
            <span className={`text-base font-bold font-mono ${theme.color}`}>{normalizedScore} / 100</span>
          </div>
          <div className="flex-1 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center sm:text-left">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Confidence</span>
            <span className="text-base font-bold text-slate-200">99.4%</span>
          </div>
        </div>

      </div>
    </div>
  );
}

