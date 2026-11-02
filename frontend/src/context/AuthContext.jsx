import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Supabase is configured, hook into Supabase Auth
    if (isSupabaseConfigured && supabase) {
      // Check active session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setToken(session?.access_token ?? null);
        setLoading(false);
      });

      // Listen for changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setToken(session?.access_token ?? null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // In local/demo mode, check if there was a saved demo session in localStorage
      const savedUser = localStorage.getItem('spamchain_demo_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setToken('demo-token');
        } catch (e) {
          localStorage.removeItem('spamchain_demo_user');
        }
      }
      setLoading(false);
    }
  }, []);

  // Email & Password Sign In
  const signIn = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } else {
      // Demo authentication
      const demoUser = {
        id: 'demo-user-uuid',
        email,
        created_at: new Date().toISOString(),
        user_metadata: { name: email.split('@')[0] }
      };
      localStorage.setItem('spamchain_demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      setToken('demo-token');
      return { user: demoUser };
    }
  };

  // Sign Up with Email and Password
  const signUp = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } else {
      const demoUser = {
        id: 'demo-user-uuid',
        email,
        created_at: new Date().toISOString(),
        user_metadata: { name: email.split('@')[0] }
      };
      localStorage.setItem('spamchain_demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      setToken('demo-token');
      return { user: demoUser };
    }
  };

  // Magic Link Sign In
  const signInWithMagicLink = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return data;
    } else {
      const demoUser = {
        id: 'demo-user-uuid',
        email,
        created_at: new Date().toISOString(),
        user_metadata: { name: email.split('@')[0] }
      };
      localStorage.setItem('spamchain_demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      setToken('demo-token');
      return { user: demoUser };
    }
  };

  // Quick Demo Login (for immediate review/judging)
  const signInDemoUser = () => {
    const demoUser = {
      id: isSupabaseConfigured ? 'f3411c75-10b1-454b-b807-e5205ccdedab' : 'demo-user-uuid',
      email: 'demo-analyst@spamchain.ai',
      created_at: new Date().toISOString(),
      user_metadata: { name: 'Threat Analyst' }
    };
    localStorage.setItem('spamchain_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setToken('demo-token');
  };

  // Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('spamchain_demo_user');
    setUser(null);
    setSession(null);
    setToken(null);
  };

  const value = {
    user,
    session,
    token: token || (user ? 'demo-token' : null),
    loading,
    isSupabaseConfigured,
    signIn,
    signUp,
    signInWithMagicLink,
    signInDemoUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

