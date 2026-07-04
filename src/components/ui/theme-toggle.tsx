"use client";

import { Moon, SunMedium } from 'lucide-react';
import { useEffect, useState } from 'react';

const themeOptions = ['system', 'light', 'dark'] as const;
export type ThemeOption = (typeof themeOptions)[number];

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeOption>('system');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && window.localStorage.getItem('theme')) as ThemeOption | null;
    if (stored && themeOptions.includes(stored)) {
      setTheme(stored);
      applyTheme(stored);
      return;
    }
    applyTheme('system');
  }, []);

  const applyTheme = (value: ThemeOption) => {
    const root = document.documentElement;
    if (value === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', value);
    }
  };

  const handleToggle = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
    window.localStorage.setItem('theme', next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 shadow-lg shadow-slate-950/20 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
