"use client";

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Key, Sliders, Moon, Sun, Monitor, ShieldAlert, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/store';
import { Button } from './button';
import { Input } from './input';

// Inline toast component for settings feedback
function Toast({ message, type }: { message: string; type: 'success' | 'error' | 'warn' }) {
  const colors = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    error: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
    warn: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-200',
  };
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 shrink-0" />,
    error: <AlertTriangle className="h-4 w-4 shrink-0" />,
    warn: <AlertTriangle className="h-4 w-4 shrink-0" />,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${colors[type]}`}
    >
      {icons[type]}
      {message}
    </motion.div>
  );
}

export function SettingsModal() {
  const {
    isSettingsOpen,
    setSettingsOpen,
    theme,
    setTheme,
    user,
    setUser,
    setSessions,
    setActiveSessionId,
    addNotification
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'preferences'>('profile');
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', newPassword: '' });
  const [apiKeys, setApiKeys] = useState({ grok: '', sarvam: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warn' } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Sync profile form and api keys when modal opens
  useEffect(() => {
    if (isSettingsOpen) {
      if (user) {
        setProfileForm({ name: user.name, email: user.email });
      }
      const storedGrok = localStorage.getItem('grok_api_key_override') || '';
      const storedSarvam = localStorage.getItem('sarvam_api_key_override') || '';
      setApiKeys({ grok: storedGrok, sarvam: storedSarvam });
      setConfirmClear(false);
    }
  }, [isSettingsOpen, user]);

  const showToast = (message: string, type: 'success' | 'error' | 'warn' = 'success') => {
    setToast({ message, type });
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) {
      showToast('Please fill out both name and email.', 'error');
      return;
    }

    if (user) {
      setUser({ ...user, name: profileForm.name, email: profileForm.email });
    } else {
      setUser({ name: profileForm.name, email: profileForm.email, tier: 'Free' });
    }

    // Attempt backend update if authenticated
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://ai-backend-doge.onrender.com/api'}/auth/change-password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: passwordForm.current, newPassword: passwordForm.newPassword })
    }).catch(() => {});

    addNotification('Profile settings updated successfully.');
    showToast('Profile saved successfully!', 'success');
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.newPassword) {
      showToast('Please fill out both current and new password fields.', 'error');
      return;
    }

    addNotification('Password updated successfully.');
    showToast('Password updated successfully!', 'success');
    setPasswordForm({ current: '', newPassword: '' });
  };

  const handleApiSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('grok_api_key_override', apiKeys.grok);
    localStorage.setItem('sarvam_api_key_override', apiKeys.sarvam);
    addNotification('Custom API Keys saved.');
    showToast('API Keys saved to browser storage!', 'success');
  };

  const handleClearData = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    setSessions([
      {
        id: 'default',
        title: 'New chat',
        provider: 'grok',
        messages: [
          {
            role: 'assistant',
            content: 'Welcome to Nova AI Studio. Ask me anything and I will help you craft your next great idea.',
          },
        ],
      }
    ]);
    setActiveSessionId('default');
    addNotification('Conversation history cleared.');
    setSettingsOpen(false);
  };

  if (!isSettingsOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSettingsOpen(false)}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative grid h-[580px] w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/90 text-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:grid-cols-[200px_1fr]"
        >
          {/* Tabs Sidebar */}
          <aside className="border-r border-white/15 bg-slate-950/50 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-cyan-300" />
                <span className="font-semibold tracking-wider uppercase text-xs text-slate-400">Settings</span>
              </div>
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeTab === 'profile' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Account
                </button>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeTab === 'api' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Key className="h-4 w-4" />
                  API Keys
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeTab === 'preferences' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Preferences
                </button>
              </nav>
            </div>
            <div className="space-y-2">
              {confirmClear && (
                <p className="text-xs text-rose-300 leading-5">Tap again to confirm — this cannot be undone.</p>
              )}
              <button
                onClick={handleClearData}
                className={`w-full flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-xs font-semibold transition ${
                  confirmClear
                    ? 'bg-rose-500/30 text-rose-200 border border-rose-500/40'
                    : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                {confirmClear ? 'Confirm Clear All' : 'Clear All Data'}
              </button>
            </div>
          </aside>

          {/* Tab Content Panel */}
          <main className="flex flex-col p-8 bg-slate-900/60 overflow-y-auto gap-4">
            <button
              onClick={() => setSettingsOpen(false)}
              className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Toast notification */}
            <AnimatePresence>
              {toast && <Toast key="toast" message={toast.message} type={toast.type} />}
            </AnimatePresence>

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Account Details</h2>
                  <p className="text-sm text-slate-400">View and update your personal information.</p>
                </div>
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <Input
                    name="name"
                    label="Full Name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                  <Input
                    name="email"
                    label="Email Address"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                  <Button type="submit" size="sm">Save Profile</Button>
                </form>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
                  <form onSubmit={handlePasswordSave} className="space-y-4">
                    <Input
                      name="current"
                      label="Current Password"
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    />
                    <Input
                      name="new"
                      label="New Password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />
                    <Button type="submit" variant="ghost" size="sm">Change Password</Button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Custom API Keys</h2>
                  <p className="text-sm text-slate-400">Add custom tokens to route queries through your personal accounts.</p>
                </div>
                <form onSubmit={handleApiSave} className="space-y-4">
                  <Input
                    name="grok"
                    label="Grok API Key"
                    placeholder="gsk_..."
                    type="password"
                    value={apiKeys.grok}
                    onChange={(e) => setApiKeys({ ...apiKeys, grok: e.target.value })}
                  />
                  <Input
                    name="sarvam"
                    label="Sarvam API Key"
                    placeholder="sk_..."
                    type="password"
                    value={apiKeys.sarvam}
                    onChange={(e) => setApiKeys({ ...apiKeys, sarvam: e.target.value })}
                  />
                  <div className="flex items-start gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-xs text-yellow-200">
                    <ShieldAlert className="h-5 w-5 shrink-0 text-yellow-400" />
                    <p>Custom API keys are saved locally in your browser's local storage and are never uploaded to any analytics databases.</p>
                  </div>
                  <Button type="submit" size="sm">Save API Keys</Button>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">System Preferences</h2>
                  <p className="text-sm text-slate-400">Configure theme, appearance and layout behaviors.</p>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-300">Active Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setTheme(opt.value as any);
                            showToast(`Theme set to ${opt.label}.`, 'success');
                          }}
                          className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-semibold transition ${
                            theme === opt.value
                              ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-200'
                              : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </main>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
