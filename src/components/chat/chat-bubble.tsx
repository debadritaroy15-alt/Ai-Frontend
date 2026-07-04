"use client";

import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { MarkdownRenderer } from '../ui/markdown-renderer';

interface ChatBubbleProps {
  role: 'assistant' | 'user';
  content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`group flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/90 text-cyan-300 shadow-lg shadow-cyan-500/10">
          <Bot className="h-5 w-5" />
        </div>
      ) : null}
      <div
        className={`max-w-[calc(100%-5rem)] rounded-[2rem] border px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] ${
          isUser ? 'bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-slate-100' : 'bg-white/5 text-slate-100'
        } ${isUser ? 'border-violet-500/20' : 'border-white/10'}`}
      >
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
          <span>{isUser ? 'You' : 'Nova AI'}</span>
        </div>
        <MarkdownRenderer>{content}</MarkdownRenderer>
      </div>
      {isUser ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/90 text-indigo-300 shadow-lg shadow-indigo-500/10">
          <User className="h-5 w-5" />
        </div>
      ) : null}
    </motion.div>
  );
}
