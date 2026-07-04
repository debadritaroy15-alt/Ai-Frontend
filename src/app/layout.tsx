import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nova AI Studio — Premium AI Workspace',
  description:
    'A modern AI workspace with multi-provider support (Grok, Sarvam, Ollama), voice input, file uploads, and a premium chat experience.',
  keywords: ['AI chat', 'Nova AI', 'Grok', 'Sarvam', 'Ollama', 'AI workspace', 'multi-provider AI'],
  authors: [{ name: 'Nova AI Studio' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Nova AI Studio — Premium AI Workspace',
    description: 'Launch an elegant AI chat experience with secure auth and flexible AI providers.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020617',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
