"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Bell, UserCircle, LogOut, CheckCircle2, Shield, Settings, Trash, X } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';
import { useStore } from '../../store/store';

export function Topbar() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationsAsRead,
    clearNotifications,
    user,
    setUser,
    setSettingsOpen
  } = useStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
      await fetch(`${apiUrl}/auth/logout`, { method: 'POST' });
    } catch (err) {
      console.warn("Logout request failed:", err);
    }
    setUser(null);
    setShowProfile(false);
    router.push('/auth');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
    if (!showNotifications && unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  return (
    <div className="sticky top-0 z-20 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-[0_40px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/90">Workspace</p>
          <h1 className="text-2xl font-semibold text-white">Nova AI Studio</h1>
        </div>
        <div className="flex items-center gap-2 relative">
          
          {/* Notifications Trigger */}
          <button
            onClick={toggleNotifications}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 text-slate-100 transition hover:bg-white/10 relative ${
              showNotifications ? 'bg-white/10' : 'bg-white/5'
            }`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-slate-950 shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Trigger */}
          <button
            onClick={toggleProfile}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 text-slate-100 transition hover:bg-white/10 ${
              showProfile ? 'bg-white/10' : 'bg-white/5'
            }`}
          >
            <UserCircle className="h-5 w-5" />
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-12 top-14 w-80 rounded-3xl border border-white/10 bg-slate-900/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl z-30">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1">
                    <Trash className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {notifications.map(n => (
                  <div key={n.id} className="flex gap-2.5 items-start p-2 rounded-xl bg-white/5 text-xs text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-100">{n.title}</p>
                      <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-xs text-slate-500 py-6">No notifications</p>
                )}
              </div>
            </div>
          )}

          {/* Profile Dropdown Panel */}
          {showProfile && (
            <div className="absolute right-0 top-14 w-72 rounded-3xl border border-white/10 bg-slate-900/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl z-30 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <UserCircle className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user?.name || 'Guest User'}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email || 'guest@example.com'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs bg-cyan-400/10 rounded-2xl px-3 py-2 border border-cyan-400/20 text-cyan-200">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Shield className="h-3.5 w-3.5" />
                  Nova {user?.tier || 'Free'} Plan
                </span>
              </div>
              <div className="grid gap-2 text-xs">
                <button
                  onClick={() => { setShowProfile(false); setSettingsOpen(true); }}
                  className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2.5 text-left text-slate-300 hover:bg-white/10 hover:text-white transition"
                >
                  <Settings className="h-4 w-4 text-cyan-300" />
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-2xl bg-rose-500/10 px-4 py-2.5 text-left text-rose-300 hover:bg-rose-500/20 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chats, prompts, or models"
          className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
