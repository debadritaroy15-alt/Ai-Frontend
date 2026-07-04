"use client";

import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110',
  secondary: 'bg-slate-950/85 text-slate-100 border border-white/10 hover:bg-slate-900/95',
  ghost: 'bg-white/5 text-slate-100 hover:bg-white/10',
  outline: 'border border-white/10 bg-transparent text-slate-100 hover:bg-white/5',
  danger: 'bg-rose-500/95 text-white hover:bg-rose-500/90',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ className = '', variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 disabled:pointer-events-none disabled:opacity-60 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    />
  );
}
