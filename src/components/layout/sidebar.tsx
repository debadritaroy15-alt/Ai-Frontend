"use client";

import { useState } from 'react';
import { LayoutDashboard, MessageSquare, Settings, Sparkles, Star, User, Trash2, Edit3, Check, X, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useStore } from '../../store/store';

export function Sidebar() {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createNewSession,
    deleteSession,
    renameSession,
    setSettingsOpen,
    setUpgradeOpen,
    setWorkspaceOpen,
    searchQuery,
    user
  } = useStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveRename = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      renameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirmId === id) {
      deleteSession(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      // Auto-reset confirm state after 3 seconds
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const sidebarContent = (
    <>
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/10">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Nova AI</p>
            <p className="text-base font-semibold text-white">Workspace</p>
          </div>
        </div>

        <Button variant="primary" className="w-full justify-start gap-2" onClick={() => { createNewSession(); setIsMobileOpen(false); }}>
          <MessageSquare className="h-4 w-4" />
          New chat
        </Button>

        <div className="mt-8 space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => { setActiveSessionId(session.id); setIsMobileOpen(false); }}
              className={`group relative w-full flex items-center justify-between rounded-[1.5rem] border px-4 py-3 text-left text-sm transition cursor-pointer ${
                session.id === activeSessionId
                  ? 'border-cyan-300/35 bg-white/10 text-white'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/20 hover:bg-white/10'
              }`}
            >
              {editingId === session.id ? (
                <form onSubmit={(e) => saveRename(session.id, e)} className="flex w-full items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-transparent text-sm text-white focus:outline-none border-b border-cyan-400"
                    autoFocus
                  />
                  <button type="submit" className="text-cyan-400 hover:text-cyan-300">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={cancelRename} className="text-rose-400 hover:text-rose-300">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </form>
              ) : (
                <>
                  <div className="truncate pr-14">
                    <p className="font-semibold truncate">{session.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400 uppercase tracking-wide">{session.provider}</p>
                  </div>
                  <div className="absolute right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => startRename(session.id, session.title, e)}
                      className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white"
                      title="Rename"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(session.id, e)}
                      className={`rounded p-1 transition hover:bg-white/5 ${
                        deleteConfirmId === session.id ? 'text-rose-400 animate-pulse' : 'text-slate-400 hover:text-rose-400'
                      }`}
                      title={deleteConfirmId === session.id ? 'Tap again to confirm delete' : 'Delete'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {filteredSessions.length === 0 && (
            <p className="text-center text-xs text-slate-500 py-4">No recent chats found.</p>
          )}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3 text-slate-200">
          <User className="h-5 w-5 text-cyan-300" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-cyan-400 uppercase font-bold tracking-wider">{user?.tier || 'Free'} Tier</p>
          </div>
        </div>
        <div className="grid gap-3 border-t border-white/10 pt-4 text-sm text-slate-300">
          <button onClick={() => { setSettingsOpen(true); setIsMobileOpen(false); }} className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10">
            <Settings className="h-4 w-4 text-cyan-300" />
            Settings
          </button>
          <button onClick={() => { setWorkspaceOpen(true); setIsMobileOpen(false); }} className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10">
            <LayoutDashboard className="h-4 w-4 text-cyan-300" />
            Workspace
          </button>
          <button onClick={() => { setUpgradeOpen(true); setIsMobileOpen(false); }} className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10">
            <Star className="h-4 w-4 text-cyan-300" />
            Upgrade
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/90 text-slate-100 shadow-xl backdrop-blur-xl transition hover:bg-white/10 xl:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[320px] flex-col gap-6 overflow-y-auto p-4">
            <div className="flex justify-end">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden h-full w-full max-w-[320px] flex-col gap-6 xl:flex">
        {sidebarContent}
      </aside>
    </>
  );
}
