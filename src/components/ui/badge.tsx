import type { HTMLAttributes, ReactNode } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = '', ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={`inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 ${className}`}
    >
      {children}
    </span>
  );
}
