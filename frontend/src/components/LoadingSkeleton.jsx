import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Top Notification Status */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <div className="h-4 w-48 bg-slate-700 rounded mb-1" />
            <div className="h-3 w-64 bg-slate-800 rounded" />
          </div>
        </div>
        <div className="h-6 w-24 bg-emerald-500/20 rounded-full" />
      </div>

      {/* Risk Gauge Skeleton */}
      <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full sm:w-auto">
          <div className="w-28 h-28 rounded-full border-4 border-slate-800 border-t-emerald-500/40 animate-spin" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-36 bg-slate-700 rounded-full" />
            <div className="h-3 w-48 bg-slate-800 rounded" />
            <div className="h-3 w-72 bg-slate-800 rounded" />
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="h-14 w-28 bg-slate-800 rounded-xl" />
          <div className="h-14 w-28 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Spam Chain 5 Steps Skeleton */}
      <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-60 bg-slate-700 rounded" />
          <div className="h-4 w-32 bg-slate-800 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <div className="w-6 h-6 rounded bg-slate-800" />
                <div className="w-12 h-4 rounded bg-slate-800" />
              </div>
              <div className="h-4 w-20 bg-slate-700 rounded" />
              <div className="h-12 w-full bg-slate-950 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-2">
          <div className="h-4 w-32 bg-slate-700 rounded" />
          <div className="h-3 w-full bg-slate-800 rounded" />
          <div className="h-3 w-5/6 bg-slate-800 rounded" />
        </div>
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 space-y-2">
          <div className="h-4 w-32 bg-slate-700 rounded" />
          <div className="h-3 w-full bg-slate-800 rounded" />
          <div className="h-3 w-5/6 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
}

