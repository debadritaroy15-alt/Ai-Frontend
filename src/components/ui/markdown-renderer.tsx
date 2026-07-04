"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface MarkdownRendererProps {
  children: string;
}

export function MarkdownRenderer({ children }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm as any, remarkMath as any]}
      rehypePlugins={[rehypeKatex as any]}
      components={{
        p: ({ node, ...props }) => <p className="leading-7 text-slate-200" {...props} />,
        a: ({ node, ...props }) => (
          <a className="font-semibold text-cyan-300 transition hover:text-cyan-200" target="_blank" rel="noreferrer" {...props} />
        ),
        code: ({ node, inline, className, children: codeChildren, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-4">
              <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl bg-slate-900/80 px-3 py-2 text-[0.82rem] text-slate-300">
                <span>{match[1]}</span>
              </div>
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                customStyle={{ background: 'transparent', margin: 0, padding: 0, fontSize: '0.92rem' }}
              >
                {String(codeChildren).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="rounded-xl bg-white/10 px-2 py-1 text-sm text-cyan-200" {...props}>
              {codeChildren}
            </code>
          );
        },
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-cyan-400/80 pl-4 italic text-slate-300" {...props} />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-sm">
            <table className="min-w-full divide-y divide-slate-700" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => <th className="bg-slate-900 px-3 py-2 text-left text-sm font-semibold text-slate-100" {...props} />,
        td: ({ node, ...props }) => <td className="px-3 py-2 text-sm text-slate-200" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc space-y-2 pl-5 text-slate-200" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal space-y-2 pl-5 text-slate-200" {...props} />,
        li: ({ node, ...props }) => <li className="mt-1" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
