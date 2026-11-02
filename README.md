# 🛡️ SpamChain AI - Enterprise Threat Intelligence & Scam Chain Parser

> **Tagline:** Decode deceit, expose scams, and protect yourself with Gemini-powered message intelligence.

[![Model: Gemini 2.5 Flash](https://img.shields.io/badge/Model-Gemini%202.5%20Flash-emerald)](https://deepmind.google/technologies/gemini/)
[![Backend: Node.js & Express](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-blue)](https://nodejs.org)
[![Database: Supabase PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL%20RLS-green)](https://supabase.com)
[![Frontend: React + Tailwind CSS](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Tailwind-cyan)](https://tailwindcss.com)

SpamChain AI is a full-stack, enterprise-grade cybersecurity web application that leverages the official Google Gen AI SDK (`@google/genai`) to parse suspicious messages (SMS, phishing emails, banking alerts, crypto scams, social media DMs). It systematically deconstructs social engineering traps into a visual 5-stage **"Spam Chain"**:

```
[1. Sender Vector] ➡️ [2. Urgency Pressure] ➡️ [3. Malicious Hook] ➡️ [4. Payload Extraction] ➡️ [5. Final Risk Consequence]
```

---

## 🌟 Key Features

1. **Server-Side Gemini 2.5 Flash Engine:** High-precision threat analysis returning strict JSON formatted via predefined schema.
2. **Interactive 5-Stage Spam Chain™:** Unpacks the anatomy of an attack to show users where to sever the deceptive custody chain.
3. **Calibrated Risk Gauge (0–100):** Visual threat score meter and color-coded tiering (`Safe`, `Suspicious`, `Spam`, `Scam`).
4. **Targeted Classification:** Categorizes threats into `PHISHING`, `FINANCIAL_SCAM`, `SMISHING`, `SOCIAL_ENGINEERING`, `GENERAL_SPAM`, or `SAFE`.
5. **Private Scan History Vault:** Secure per-user scan archiving powered by Supabase PostgreSQL Row Level Security (RLS).
6. **Community Threat Intelligence Feed:** Anonymized public telemetry of active scam campaigns for community vigilance.
7. **Developer-First Aesthetic:** Clean, dark-mode Vercel/Supabase-inspired UI with instant sample scam injectors and loading skeleton states.

---

## 🏗️ Architecture & Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, React Router DOM v7
- **Backend:** Node.js (ESM), Express.js, Helmet, CORS, Dotenv, Zod v3
- **AI Intelligence:** `@google/genai` (Google Gen AI SDK with `gemini-2.5-flash`)
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth

```
spamchain-ai/
├── backend/
│   ├── server.js                     # Express application entrypoint
│   ├── package.json
│   ├── .env.example
│   ├── services/
│   │   ├── aiService.js              # Gemini 2.5 Flash & heuristic engine
│   │   └── supabaseService.js        # Supabase PostgreSQL + in-memory store
│   ├── middleware/
│   │   ├── authMiddleware.js         # Supabase Bearer token verification
│   │   └── validateMiddleware.js     # Zod payload validation (min 3, max 2000 chars)
│   └── routes/
│       ├── scanRoutes.js             # /api/analyze, /api/scans, /api/scans/:id
│       └── communityRoutes.js        # /api/community public feed
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── App.jsx                   # Application shell & routes
│   │   ├── main.jsx
│   │   ├── index.css                 # Tailwind directives & custom glassmorphism
│   │   ├── supabaseClient.js         # Supabase client initialization
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Supabase Auth state & demo access
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Responsive navigation & auth badges
│   │   │   ├── MessageInput.jsx      # Text area, samples, character counter
│   │   │   ├── RiskGauge.jsx         # Circular SVG risk meter & category pill
│   │   │   ├── SpamChainView.jsx     # Visual 5-step vector breakdown
│   │   │   ├── ScanCard.jsx          # Reusable scan summary card
│   │   │   ├── LoadingSkeleton.jsx   # Shimmering skeleton states
│   │   │   └── AuthForm.jsx          # Supabase login/signup & magic link
│   │   └── pages/
│   │       ├── LandingPage.jsx       # Value prop, live preview & CTAs
│   │       ├── DashboardPage.jsx     # Main scanner console
│   │       ├── HistoryPage.jsx       # Personal scan vault with filtering
│   │       └── CommunityPage.jsx     # Anonymized public threat feed
├── supabase/
│   └── schema.sql                    # Production PostgreSQL DDL & RLS policies
└── README.md
```

---

## 🗄️ Database Setup (Supabase PostgreSQL)

Execute the SQL script located in `supabase/schema.sql` in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Scans table
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    raw_message TEXT NOT NULL,
    risk_level TEXT CHECK (risk_level IN ('Safe', 'Suspicious', 'Spam', 'Scam')) NOT NULL,
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100) NOT NULL,
    category TEXT NOT NULL,
    explanation TEXT NOT NULL,
    warning_signs TEXT[] NOT NULL,
    recommendations TEXT[] NOT NULL,
    spam_chain JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scans" ON public.scans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scans" ON public.scans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans" ON public.scans
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view high-risk community scans" ON public.scans
    FOR SELECT USING (risk_level IN ('Scam', 'Spam'));
```

---

## ⚙️ Configuration & Environment Variables

### Backend (`backend/.env`)
```env
PORT=5050
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5050/api
```

*(Note: The application includes a built-in heuristic cybersecurity intelligence engine and local cache fallback so it functions smoothly out-of-the-box even before API credentials are provided).*

---

## 🚀 Production Deployment Guide

### A. Deploy Backend to Render (Node.js Web Service)
1. In [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
2. Connect your Git repository.
3. Configure the service settings:
   - **Name:** `spamchain-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. In the **Environment Variables** section, add:
   - `GEMINI_API_KEY` = *Your Google Gemini API Key*
   - `SUPABASE_URL` = *Your Supabase Project URL*
   - `SUPABASE_SERVICE_ROLE_KEY` = *Your Supabase Service Role Key*
   - *(Note: Render will automatically set `PORT`, which the backend binds to automatically).*
5. Deploy and copy your live backend URL (e.g. `https://spamchain-backend.onrender.com`).

### B. Deploy Frontend to Vercel (React + Vite SPA)
1. In [Vercel Dashboard](https://vercel.com/new), import your Git repository.
2. Configure the project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. In the **Environment Variables** section, add:
   - `VITE_API_BASE_URL` = `https://spamchain-backend.onrender.com/api` (your deployed Render URL)
   - `VITE_SUPABASE_URL` = *Your Supabase Project URL*
   - `VITE_SUPABASE_ANON_KEY` = *Your Supabase Anon Key*
4. Click **Deploy**. Vercel will build the frontend using `npm run build`, and `frontend/vercel.json` ensures all React Router paths (`/dashboard`, `/history`, `/community`) route seamlessly without 404s.

---

## 💻 Local Development

### 1. Install Backend Dependencies & Start Server
```bash
cd backend
npm install
npm run dev
```
The backend server runs on `http://localhost:5000`. Test health at `http://localhost:5000/api/health`.

### 2. Install Frontend Dependencies & Start UI
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 REST API Reference

| Endpoint | Method | Auth Required | Description |
|---|---|---|---|
| `/api/health` | GET | No | Server status & connected AI service health |
| `/api/analyze` | POST | Yes (`Bearer <token>`) | Analyzes message with Gemini & saves scan |
| `/api/scans` | GET | Yes (`Bearer <token>`) | Returns user's private scan history |
| `/api/scans/:id` | DELETE | Yes (`Bearer <token>`) | Deletes an owned scan record |
| `/api/community` | GET | No | Public anonymized high-risk threat feed |

---

## 🔒 Security Best Practices Implemented

- **Backend API Secret Isolation:** The `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are kept strictly server-side.
- **Strict Input Validation:** Zod middleware validates string length (3–2000 chars) and sanitizes payloads.
- **Row Level Security (RLS):** Cross-user data leakage is strictly prevented via PostgreSQL session policies.
- **Helmet Security Headers:** Defends against clickjacking, cross-site scripting (XSS), and MIME-sniffing.

