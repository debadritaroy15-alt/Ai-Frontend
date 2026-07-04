"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles, ShieldCheck, ArrowRight, MessageSquare, Rocket, Mic,
  UploadCloud, Zap, Globe, Star, ChevronRight, Bot, User, CheckCircle
} from 'lucide-react';

const features = [
  {
    title: 'Premium chat experience',
    description: 'A refined dark-mode interface built for clarity, performance, and beautiful AI responses.',
    icon: Sparkles,
    color: 'from-cyan-500/20 to-blue-500/10',
    border: 'border-cyan-400/20',
    iconColor: 'text-cyan-300',
  },
  {
    title: 'Secure authentication',
    description: 'Cookie-based sessions and modern auth flows keep your conversations private and safe.',
    icon: ShieldCheck,
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-400/20',
    iconColor: 'text-violet-300',
  },
  {
    title: 'Multi-provider AI',
    description: 'Switch between Grok, Sarvam, and Ollama in one click. One workspace, infinite capability.',
    icon: Globe,
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-400/20',
    iconColor: 'text-emerald-300',
  },
  {
    title: 'Voice recognition',
    description: 'Speak your thoughts. Native speech-to-text converts your voice into polished prompts.',
    icon: Mic,
    color: 'from-orange-500/20 to-amber-500/10',
    border: 'border-orange-400/20',
    iconColor: 'text-orange-300',
  },
  {
    title: 'File attachments',
    description: 'Upload documents, code, and images to provide rich context to any AI request.',
    icon: UploadCloud,
    color: 'from-pink-500/20 to-rose-500/10',
    border: 'border-pink-400/20',
    iconColor: 'text-pink-300',
  },
  {
    title: 'Blazing fast',
    description: 'Optimized for speed with Next.js 15 Turbopack, instant session switching, and live search.',
    icon: Zap,
    color: 'from-yellow-500/20 to-amber-500/10',
    border: 'border-yellow-400/20',
    iconColor: 'text-yellow-300',
  },
];

const stats = [
  { value: '3+', label: 'AI Providers', color: 'text-cyan-300' },
  { value: '∞', label: 'Chat Sessions', color: 'text-violet-300' },
  { value: '< 2s', label: 'Avg Response', color: 'text-emerald-300' },
  { value: '100%', label: 'Private & Secure', color: 'text-pink-300' },
];

const providers = [
  {
    name: 'Grok',
    model: 'llama-3.3-70b',
    description: 'Fast, reasoning-focused AI by xAI. Ideal for structured tasks and creative problem solving.',
    color: 'from-cyan-500/15 to-blue-600/5',
    border: 'border-cyan-500/25',
    badge: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20',
  },
  {
    name: 'Sarvam',
    model: 'sarvam-30b',
    description: 'India-built multilingual AI optimised for South Asian languages, translation, and local context.',
    color: 'from-violet-500/15 to-purple-600/5',
    border: 'border-violet-500/25',
    badge: 'bg-violet-400/10 text-violet-300 border-violet-400/20',
  },
  {
    name: 'Ollama',
    model: 'local · llama3.2-3b',
    description: 'Run open-source models locally. Perfect for offline workflows and privacy-first applications.',
    color: 'from-emerald-500/15 to-teal-600/5',
    border: 'border-emerald-500/25',
    badge: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  },
];

const chatPreview = [
  { role: 'user' as const, content: 'Help me design a clean design system.' },
  {
    role: 'assistant' as const,
    content:
      'Great! A clean design system starts with: **Tokens** (colors, spacing, typography), **Components** (buttons, inputs, cards), and **Patterns** (layout, navigation). Want me to draft a color palette?',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-cyan-500/8 blur-[120px]" />
        <div className="absolute top-1/3 -right-48 h-[500px] w-[500px] rounded-full bg-violet-500/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/6 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Navigation ── */}
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/60 px-6 py-4 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">Nova</span>
              <p className="text-sm font-semibold leading-none text-white">AI Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Sign in
            </Link>
            <Link
              href="/chat"
              className="rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
            >
              Open app
            </Link>
          </div>
        </motion.nav>

        {/* ── Hero Section ── */}
        <section className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-200"
          >
            <Star className="h-4 w-4 fill-cyan-400 text-cyan-400" />
            Premium AI conversations — built for builders
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="mx-auto max-w-4xl text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl"
          >
            A modern AI studio{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              built for clarity
            </span>
            , speed &amp; beautiful responses.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-slate-400"
          >
            Combine Grok, Sarvam, and Ollama under one roof. Enjoy secure sessions, voice input, file
            uploads, and a polished interface designed for professional AI workflows.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/25 transition hover:brightness-110"
            >
              <MessageSquare className="h-4 w-4" />
              Start chatting free
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              <ArrowRight className="h-4 w-4" />
              Create account
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48 }}
            className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center backdrop-blur"
              >
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Chat Preview ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-20"
        >
          <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_60px_120px_rgba(15,23,42,0.6)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/60" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex-1 rounded-full bg-white/5 px-4 py-1 text-center text-xs text-slate-500">
                nova-ai.studio / chat
              </div>
            </div>
            <div className="space-y-4 px-2">
              {chatPreview.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-cyan-300">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl border px-4 py-3 text-sm leading-6 ${
                      msg.role === 'user'
                        ? 'border-violet-500/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-slate-200'
                        : 'border-white/10 bg-white/5 text-slate-200'
                    }`}
                  >
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {msg.role === 'user' ? 'You' : 'Nova AI'}
                    </p>
                    <p dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-indigo-300">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {/* Typing indicator */}
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-cyan-300">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Nova AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── AI Providers ── */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Multi-provider AI</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              One workspace. Three powerful engines.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-400">
              Switch AI providers seamlessly — each optimised for different tasks, languages, and contexts.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-5 sm:grid-cols-3"
          >
            {providers.map((prov) => (
              <motion.div
                key={prov.name}
                variants={itemVariants}
                className={`rounded-3xl border bg-gradient-to-br p-6 ${prov.color} ${prov.border} transition hover:scale-[1.02]`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-2xl font-extrabold text-white">{prov.name}</h3>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${prov.badge}`}>
                    {prov.model}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-400">{prov.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Features Grid ── */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Everything you need</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Built for the modern AI workflow.
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  variants={itemVariants}
                  className={`group rounded-3xl border bg-gradient-to-br p-6 transition hover:scale-[1.02] ${feat.color} ${feat.border}`}
                >
                  <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/80 ${feat.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-sm leading-6 text-slate-400">{feat.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ── Plans Preview ── */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Simple pricing</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Start free. Upgrade when ready.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2"
          >
            {/* Free Plan */}
            <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
              <h3 className="mb-1 text-xl font-bold text-white">Free</h3>
              <p className="mb-4 text-xs text-slate-400">Great to explore basic conversations.</p>
              <p className="mb-5 text-5xl font-extrabold text-white">$0<span className="text-base font-normal text-slate-400"> / month</span></p>
              <ul className="space-y-3 text-sm text-slate-300">
                {['Access to Grok (llama-3.3)', 'Up to 30 messages / day', 'Standard response speed', 'Text-only input'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 shrink-0 text-slate-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth" className="mt-6 block rounded-full border border-white/10 bg-white/5 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-white/10">
                Get started free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-indigo-950/20 p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
              <span className="absolute -top-3.5 left-6 inline-flex items-center gap-1 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                <Zap className="h-3.5 w-3.5 fill-slate-950" />
                RECOMMENDED
              </span>
              <h3 className="mb-1 text-xl font-bold text-white">Pro</h3>
              <p className="mb-4 text-xs text-slate-400">Unlock full creative and analytical potential.</p>
              <p className="mb-5 text-5xl font-extrabold text-white">$15<span className="text-base font-normal text-slate-400"> / month</span></p>
              <ul className="space-y-3 text-sm text-slate-300">
                {['Priority access to all AI providers', 'Unlimited conversations & sessions', 'Voice input & file attachments', 'Ultra-fast generation times', 'Custom personal API keys support', 'Secure dashboard analytics'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 shrink-0 text-cyan-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/chat" className="mt-6 block rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110">
                Upgrade to Pro
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── CTA Banner ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-slate-950 p-10 text-center shadow-[0_60px_120px_rgba(99,102,241,0.12)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.1),_transparent_55%)]" />
          <div className="relative">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-xl shadow-cyan-500/25">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
              Ready to launch your AI workspace?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-slate-400">
              Join thousands of builders using Nova AI Studio to power their ideas. No credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/25 transition hover:brightness-110"
              >
                <MessageSquare className="h-4 w-4" />
                Open chat now
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                <ArrowRight className="h-4 w-4" />
                Create free account
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/8 pt-8 pb-4 text-center text-xs text-slate-600">
          <p>
            © {new Date().getFullYear()} Nova AI Studio. Built with Next.js 15, Zustand, Framer Motion &amp; Tailwind CSS.
          </p>
        </footer>
      </div>
    </main>
  );
}
