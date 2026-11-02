import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  KeyRound,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthForm({ initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { signIn, signUp, signInWithMagicLink, signInDemoUser, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (useMagicLink) {
        await signInWithMagicLink(email);
        setSuccessMsg('Check your email for the magic sign-in link!');
      } else if (isLogin) {
        await signIn(email, password);
        navigate('/dashboard');
      } else {
        await signUp(email, password);
        setSuccessMsg('Account created successfully! You can now access your dashboard.');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    signInDemoUser();
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
        
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-10 w-40 h-20 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Form Title & Switcher */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 shadow-glow-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin 
              ? 'Access your private scan history & threat intel' 
              : 'Start analyzing suspicious messages with Gemini'}
          </p>
        </div>

        {/* Demo Mode Instant Access Callout */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center justify-center gap-2 group shadow-sm"
          >
            <Zap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>⚡ Instant Demo Access (No Password Required)</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-[#0F172A] px-3 text-[11px] font-mono text-slate-400 uppercase">
            or continue with credentials
          </span>
          <div className="border-t border-slate-800 w-full" />
        </div>

        {/* Magic Link Toggle */}
        <div className="flex rounded-lg bg-slate-900/90 p-1 mb-5 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setUseMagicLink(false)}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
              !useMagicLink ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Password Sign In
          </button>
          <button
            type="button"
            onClick={() => setUseMagicLink(true)}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
              useMagicLink ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Magic Link OTP
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {!useMagicLink && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {useMagicLink 
                    ? 'Send Magic Link' 
                    : isLogin ? 'Sign In to SpamChain' : 'Create Free Account'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Login / Signup */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isLogin ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

