"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Zap, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/store';
import { Button } from './button';

export function UpgradeModal() {
  const { isUpgradeOpen, setUpgradeOpen, user, setUser, addNotification } = useStore();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleUpgrade = (tierName: 'Free' | 'Pro') => {
    setLoadingTier(tierName);
    setTimeout(() => {
      if (user) {
        setUser({ ...user, tier: tierName });
      } else {
        setUser({ name: 'Guest User', email: 'guest@example.com', tier: tierName });
      }
      addNotification(`Successfully switched to Nova ${tierName} plan. Enjoy your workspace!`);
      setLoadingTier(null);
      setUpgradeOpen(false);
    }, 1200);
  };

  if (!isUpgradeOpen) return null;

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for exploring basic conversations.',
      features: [
        'Access to Grok (llama-3.3)',
        'Up to 30 messages per day',
        'Standard response speeds',
        'Standard text-only input'
      ],
      action: () => handleUpgrade('Free'),
      btnText: 'Current Plan',
      isCurrent: user?.tier !== 'Pro',
      color: 'border-white/10 bg-white/5'
    },
    {
      name: 'Pro',
      price: '$15',
      description: 'Unlock full creative and analytical potential.',
      features: [
        'Priority access to Grok & Sarvam models',
        'Unlimited conversations & sessions',
        'Ultra-fast generation times',
        'Advanced features: Voice & File attachments',
        'Secure dashboard analytics',
        'Custom personal API Keys support'
      ],
      action: () => handleUpgrade('Pro'),
      btnText: 'Upgrade to Pro',
      isCurrent: user?.tier === 'Pro',
      recommended: true,
      color: 'border-cyan-500/30 bg-cyan-950/20'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setUpgradeOpen(false)}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-[2.5rem] border border-white/10 bg-slate-900/90 p-8 text-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <button
            onClick={() => setUpgradeOpen(false)}
            className="absolute right-6 top-6 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs text-cyan-200">
              <Star className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400" />
              Elevate Your Workspace
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Upgrade to Nova Premium</h2>
            <p className="text-sm text-slate-400">Unlock advanced multi-provider switching, custom configuration, speech recognition, and secure document uploading.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col justify-between rounded-[2rem] border p-6 ${tier.color} transition hover:border-white/20`}
              >
                {tier.recommended && (
                  <span className="absolute -top-3.5 left-6 inline-flex items-center gap-1 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                    <Zap className="h-3.5 w-3.5 fill-slate-950" />
                    RECOMMENDED
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    <p className="mt-1 text-xs text-slate-400">{tier.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                    <span className="text-sm text-slate-400">/ month</span>
                  </div>
                  <ul className="space-y-2.5 border-t border-white/10 pt-4 text-sm text-slate-300">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  {tier.isCurrent ? (
                    <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200">
                      <ShieldCheck className="h-4 w-4" />
                      Active Plan
                    </div>
                  ) : (
                    <Button
                      onClick={tier.action}
                      disabled={loadingTier !== null}
                      variant={tier.recommended ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      {loadingTier === tier.name ? 'Processing...' : tier.btnText}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
