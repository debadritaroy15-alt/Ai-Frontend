"use client";

import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className = '', label, error, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm text-slate-200">
      {label ? <span className="font-semibold">{label}</span> : null}
      <input
        {...props}
        className={`w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none ${className}`}
      />
      {error ? <span className="text-rose-300">{error}</span> : null}
    </label>
  );
}
