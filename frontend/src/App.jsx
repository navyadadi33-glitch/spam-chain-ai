import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import CommunityPage from './pages/CommunityPage';
import AuthForm from './components/AuthForm';
import { ShieldCheck, ShieldAlert, Heart, Github } from 'lucide-react';

function AuthPageWrapper({ mode }) {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6">
      <AuthForm initialMode={mode} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
          {/* Navigation Bar */}
          <Navbar />

          {/* Main Route Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthPageWrapper mode="login" />} />
              <Route path="/signup" element={<AuthPageWrapper mode="signup" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Enterprise Footer */}
          <footer className="border-t border-slate-800/80 bg-[#070A12] py-10 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200">SpamChain AI</span>
                  <p className="text-[11px] text-slate-400">
                    Decode deceit, expose scams, and protect yourself with Gemini-powered message intelligence.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Analyzer</Link>
                <Link to="/community" className="hover:text-emerald-400 transition-colors">Threat Feed</Link>
                <Link to="/history" className="hover:text-emerald-400 transition-colors">Vault</Link>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span>Enterprise Cybersecurity Hackathon Edition</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Gemini 2.5 Flash</span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

