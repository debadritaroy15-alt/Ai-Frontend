import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#050816',
        foreground: '#f8fafc',
        card: '#111827',
        border: '#1f2937',
        brand: '#7c3aed',
        accent: '#22d3ee',
      },
      boxShadow: {
        glow: '0 0 80px rgba(124, 58, 237, 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
