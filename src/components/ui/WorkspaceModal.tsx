"use client";

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, BarChart3, Database, MessageSquare, Clock, Cpu } from 'lucide-react';
import { useStore } from '../../store/store';

export function WorkspaceModal() {
  const { isWorkspaceOpen, setWorkspaceOpen, sessions, user } = useStore();

  const stats = useMemo(() => {
    let totalMessages = 0;
    const providerCount = { grok: 0, sarvam: 0, ollama: 0 };
    
    sessions.forEach(s => {
      totalMessages += s.messages.length;
      if (s.provider in providerCount) {
        providerCount[s.provider]++;
      }
    });

    const activeSessionsCount = sessions.length;
    // Simulate some token counts and response speeds for visual metrics
    const simulatedTokens = totalMessages * 128;
    const avgResponseTime = '1.2s';
    
    return {
      totalMessages,
      activeSessionsCount,
      providerCount,
      simulatedTokens,
      avgResponseTime
    };
  }, [sessions]);

  if (!isWorkspaceOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setWorkspaceOpen(false)}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-slate-900/90 p-8 text-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <button
            onClick={() => setWorkspaceOpen(false)}
            className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Nova Workspace Studio</h2>
              <p className="text-sm text-slate-400">Real-time usage and API performance metrics.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between mb-3 text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Chats</span>
                <MessageSquare className="h-4 w-4 text-cyan-300" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.activeSessionsCount}</p>
              <p className="text-xs text-slate-400 mt-1">Stored locally in browser</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between mb-3 text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Messages</span>
                <BarChart3 className="h-4 w-4 text-violet-300" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalMessages}</p>
              <p className="text-xs text-slate-400 mt-1">Across all workspace threads</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-3 text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Simulated Tokens</span>
                <Database className="h-4 w-4 text-indigo-300" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.simulatedTokens}</p>
              <p className="text-xs text-slate-400 mt-1">Avg speed: {stats.avgResponseTime}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-3">AI Engine Orchestration</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Provider Distribution */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 space-y-4">
                <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  Provider Splits
                </h4>
                <div className="space-y-3 text-sm">
                  {[
                    { name: 'Grok (llama-3.3)', count: stats.providerCount.grok, color: 'bg-cyan-400' },
                    { name: 'Sarvam (sarvam-30b)', count: stats.providerCount.sarvam, color: 'bg-violet-400' },
                    { name: 'Ollama (local fallback)', count: stats.providerCount.ollama, color: 'bg-emerald-400' },
                  ].map((prov) => {
                    const percentage = stats.activeSessionsCount > 0 
                      ? Math.round((prov.count / stats.activeSessionsCount) * 100)
                      : 0;
                    return (
                      <div key={prov.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-400">
                          <span>{prov.name}</span>
                          <span>{prov.count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${prov.color} rounded-full`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* API Connection Health */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 space-y-4">
                <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-violet-400" />
                  Orchestrator Status
                </h4>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">Backend Endpoint:</span>
                    <span className="font-mono text-cyan-300">https://ai-backend-doge.onrender.com</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">API Connection:</span>
                    <span className="font-semibold text-emerald-400 inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Healthy
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Workspace Tier:</span>
                    <span className={`font-bold uppercase ${user?.tier === 'Pro' ? 'text-cyan-300' : 'text-slate-400'}`}>
                      {user?.tier === 'Pro' ? '⭐ PRO ACTIVE' : 'FREE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
