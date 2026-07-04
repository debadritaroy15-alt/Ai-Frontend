"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Sparkles, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useStore } from '../../store/store';

export default function AuthPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const addNotification = useStore((state) => state.addNotification);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const features = useMemo(
    () => [
      { title: 'Secure sessions', description: 'Protected cookies and safe access for your AI workspace.', icon: ShieldCheck },
      { title: 'Fast access', description: 'Modern login flows with a polished experience on every device.', icon: Sparkles },
      { title: 'Built for AI', description: 'A premium interface that feels familiar and reliable.', icon: User },
    ],
    [],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    setAlert(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.email || !formData.password || (mode === 'signup' && !formData.name)) {
      setAlert({ type: 'error', message: 'Please complete all required fields before continuing.' });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      if (mode === 'signup') {
        const regRes = await fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          throw new Error(regData.message || 'Registration failed');
        }

        // On success register, auto-login the user
        const loginRes = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
          throw new Error(loginData.message || 'Login failed after registration');
        }

        setUser({
          name: loginData.data?.user?.name || formData.name,
          email: loginData.data?.user?.email || formData.email,
          tier: 'Free',
        });
        
        addNotification(`Welcome, ${formData.name}! Your account has been registered.`);
        router.push('/chat');
      } else {
        const loginRes = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
          throw new Error(loginData.message || 'Invalid email or password');
        }

        setUser({
          name: loginData.data?.user?.name || 'User',
          email: loginData.data?.user?.email || formData.email,
          tier: 'Free', // Defaults to Free tier (can upgrade to Pro in UpgradeModal)
        });

        addNotification('Signed in successfully.');
        router.push('/chat');
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_40px_100px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <motion.section initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Designed for premium AI workflows
            </div>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Authentication</p>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Secure sign in for the Nova AI workspace.</h1>
              <p className="max-w-xl text-slate-400">Enjoy a modern login experience with polished spacing, clear forms, and gentle motion across devices.</p>
            </div>
            <div className="grid gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4">
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-6 shadow-[0_40px_100px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-semibold text-white">{mode === 'login' ? 'Welcome back' : 'Create your account'}</p>
                <p className="mt-1 text-sm text-slate-400">Sign in to continue to your AI workspace.</p>
              </div>
              <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-200 transition hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>
            </div>

            <div className="mb-5 flex overflow-hidden rounded-full border border-white/10 bg-white/5 text-sm text-slate-300">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-full px-4 py-3 transition ${mode === 'login' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-full px-4 py-3 transition ${mode === 'signup' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
              >
                Signup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' ? <Input name="name" label="Full name" placeholder="Enter your name" value={formData.name} onChange={handleChange} /> : null}
              <Input name="email" label="Email" placeholder="you@example.com" type="email" value={formData.email} onChange={handleChange} />
              <Input name="password" label="Password" placeholder="••••••••" type="password" value={formData.password} onChange={handleChange} />
              {alert ? (
                <div className={`rounded-3xl px-4 py-3 text-sm ${alert.type === 'success' ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200'}`}>
                  {alert.message}
                </div>
              ) : null}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Processing...' : mode === 'login' ? 'Sign in securely' : 'Create account'}
              </Button>
            </form>

            <div className="mt-5 text-center text-sm text-slate-500">
              {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-semibold text-white hover:text-cyan-300">
                {mode === 'login' ? 'Create account' : 'Sign in'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
