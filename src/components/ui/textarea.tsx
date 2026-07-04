"use client";

import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ className = '', label, error, ...props }: TextareaProps) {
  return (
    <label className="grid gap-2 text-sm text-slate-200">
      {label ? <span className="font-semibold">{label}</span> : null}
      <textarea
        {...props}
        rows={4}
        className={`min-h-[120px] w-full resize-none rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none ${className}`}
      />
      {error ? <span className="text-rose-300">{error}</span> : null}
    </label>
  );
}
