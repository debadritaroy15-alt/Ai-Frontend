"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bot, SendHorizonal, Sparkles, Mic, UploadCloud, ShieldCheck, Star, Bolt, X } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Sidebar } from '../../components/layout/sidebar';
import { Topbar } from '../../components/layout/topbar';
import { ChatBubble } from '../../components/chat/chat-bubble';
import { Button } from '../../components/ui/button';
import { useStore, type ChatMessage } from '../../store/store';

// Modal Overlays
import { SettingsModal } from '../../components/ui/SettingsModal';
import { UpgradeModal } from '../../components/ui/UpgradeModal';
import { WorkspaceModal } from '../../components/ui/WorkspaceModal';

const starterPrompts = [
  'Summarize this launch plan',
  'Write a polished product update',
  'Help me structure a design system',
];

export default function ChatPage() {
  const router = useRouter();
  const {
    sessions,
    activeSessionId,
    addMessageToActiveSession,
    activeProvider,
    setActiveProvider,
    uploadedFiles,
    addUploadedFile,
    removeUploadedFile,
    clearUploadedFiles,
    user,
    setUser,
    addNotification
  } = useStore();

  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  // Authenticate user on mount
  useEffect(() => {
    const checkAuth = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ai-backend-doge.onrender.com/api';
      try {
        const res = await fetch(`${apiUrl}/auth/me`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.success) {
          setUser({
            name: data.data?.user?.name || 'User',
            email: data.data?.user?.email || '',
            tier: user?.tier || 'Free', // Preserve upgraded status if any
          });
        } else if (res.status === 401 || res.status === 403) {
          // Only redirect on explicit auth rejection, not on network/server errors
          // router.push('/auth');
        }
      } catch {
        // Fallback for offline/no-backend development so the UI remains testable
        if (!user) {
          setUser({
            name: 'Guest User',
            email: 'guest@example.com',
            tier: 'Free',
          });
        }
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const quickActions = useMemo(() => starterPrompts, []);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ai-backend-doge.onrender.com/api';

  const submitMessage = async () => {
    if (!draft.trim() && uploadedFiles.length === 0) return;

    let finalPrompt = draft.trim();
    
    // Attach files details to prompt if present
    if (uploadedFiles.length > 0) {
      finalPrompt += "\n\n[Attached Files]:\n" + uploadedFiles.map(f => `File: ${f.name}\nType: ${f.type}\nContent Preview:\n${f.content.slice(0, 800)}`).join('\n---\n');
    }

    const newUserMessage: ChatMessage = { role: 'user', content: draft.trim() || `Uploaded ${uploadedFiles.length} file(s)` };
    addMessageToActiveSession(newUserMessage);
    setDraft('');
    clearUploadedFiles();
    setIsSending(true);

    try {
      let assistantReply = '';
      
      // Simulate Ollama response or call actual backend for Grok/Sarvam
      if (activeProvider === 'ollama') {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        assistantReply = "Ollama (Llama-3.2-3b-instruct) generated response:\n\nThis is a mock response from your local Ollama instance. In production, make sure you have run `ollama serve` and `ollama run llama3.2` on port 11434.";
      } else {
        const response = await fetch(`${apiUrl}/ai/chat?provider=${activeProvider}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            prompt: finalPrompt,
            messages: messages.concat(newUserMessage).map(({ role, content }) => ({ role, content })),
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'AI request failed');
        }
        assistantReply = data?.data?.reply || 'No response from the AI provider.';
      }

      addMessageToActiveSession({ role: 'assistant', content: assistantReply });
    } catch (error) {
      addMessageToActiveSession({
        role: 'assistant',
        content: `Sorry, something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = (event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    void submitMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitMessage();
    }
  };

  // Voice Input using SpeechRecognition API
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Simulated Fallback
      setIsRecording(true);
      addNotification("Voice recognition initialized (Simulation fallback)...");
      setTimeout(() => {
        setDraft("Help me design a clean design system interface.");
        setIsRecording(false);
        addNotification("Voice simulation finished.");
      }, 2000);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsRecording(true);
    };

    rec.onresult = (e: any) => {
      const speechToText = e.results[0][0].transcript;
      setDraft(prev => prev + (prev ? " " : "") + speechToText);
      addNotification("Speech transcribed.");
    };

    rec.onerror = () => {
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    rec.start();
  };

  // Document Upload
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string || '';
      addUploadedFile({
        name: file.name,
        content: content,
        type: file.type,
        size: `${Math.round(file.size / 1024)} KB`
      });
      addNotification(`Attached file: ${file.name}`);
    };

    if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.json') || file.name.endsWith('.js') || file.name.endsWith('.ts')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file); // Images/PDFs
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[320px_1fr] xl:px-8">
        <Sidebar />
        <div className="space-y-6">
          <Topbar />

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <section className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">AI conversation</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Modern chat, premium experience.</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { value: 'grok', label: 'Grok', color: 'bg-cyan-400/10 text-cyan-200 border-cyan-400/30' },
                    { value: 'sarvam', label: 'Sarvam', color: 'bg-violet-500/10 text-violet-200 border-violet-500/30' },
                    { value: 'ollama', label: 'Ollama', color: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/30' },
                  ].map((prov) => (
                    <Badge
                      key={prov.value}
                      onClick={() => setActiveProvider(prov.value as any)}
                      className={`cursor-pointer transition-all border px-3 py-1.5 rounded-full ${prov.color} ${
                        activeProvider === prov.value ? 'ring-2 ring-cyan-300 scale-105 brightness-110 font-bold' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {prov.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <Card className="relative overflow-hidden p-0">
                <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_35%)]" />
                <div className="relative flex h-[640px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95">
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <ChatBubble key={`${message.role}-${index}`} role={message.role} content={message.content} />
                      ))}
                      {isSending ? (
                        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-5 py-4 text-slate-300 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
                          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-slate-400">Nova AI is typing</p>
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300 delay-75" />
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300 delay-150" />
                          </div>
                        </div>
                      ) : null}
                      <div ref={scrollRef} />
                    </div>
                  </div>
                  <form onSubmit={handleSend} className="border-t border-white/10 bg-slate-950/90 p-5">
                    <div className="space-y-4">
                      
                      {/* Attached File Chips */}
                      {uploadedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 pb-2">
                          {uploadedFiles.map(file => (
                            <div key={file.name} className="inline-flex items-center gap-1.5 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-slate-200">
                              <span className="truncate max-w-[150px] font-semibold">{file.name}</span>
                              <span className="text-[10px] text-slate-400">({file.size})</span>
                              <button type="button" onClick={() => removeUploadedFile(file.name)} className="text-rose-400 hover:text-rose-300 shrink-0">
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <Textarea
                        placeholder={`Ask Nova AI (${activeProvider.toUpperCase()}) anything…`}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="min-h-[140px]"
                      />
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-3">
                          <Button type="submit" disabled={isSending} className="gap-2">
                            <SendHorizonal className="h-4 w-4" />
                            {isSending ? 'Generating…' : 'Send message'}
                          </Button>
                          <Button
                            type="button"
                            onClick={handleVoiceInput}
                            variant={isRecording ? 'danger' : 'secondary'}
                            className={`gap-2 ${isRecording ? 'animate-pulse' : ''}`}
                          >
                            <Mic className="h-4 w-4" />
                            {isRecording ? 'Recording...' : 'Voice'}
                          </Button>
                          <Button type="button" onClick={handleTriggerUpload} variant="ghost" className="gap-2">
                            <UploadCloud className="h-4 w-4" />
                            Upload
                          </Button>
                          {/* Hidden File Input */}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                        <p className="text-xs text-slate-500">Enter to send, Shift + Enter for newline.</p>
                      </div>
                    </div>
                  </form>
                </div>
              </Card>
            </section>

            <aside className="space-y-6">
              <Card className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-6">
                <div className="mb-5 flex items-center gap-3 text-slate-100">
                  <ShieldCheck className="h-5 w-5 text-cyan-300" />
                  <div>
                    <p className="font-semibold">Protected experience</p>
                    <p className="text-sm text-slate-400">Authenticated access, session persistence, and secure AI workflows.</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  {[
                    { title: 'Real-time search', description: 'Find chats instantly across your workspace.', icon: Star },
                    { title: 'Smart suggestions', description: 'Prompt ideas to help shape better AI responses.', icon: Bolt },
                    { title: 'File support', description: 'Upload text and image prompts with ease.', icon: UploadCloud },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-cyan-300">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Quick actions</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">Starter prompts</h2>
                  </div>
                </div>
                <div className="grid gap-3">
                  {quickActions.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setDraft(prompt)}
                      className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-100 transition hover:border-cyan-300/30 hover:bg-white/10"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </div>

      {/* Render Dialog Overlays */}
      <SettingsModal />
      <UpgradeModal />
      <WorkspaceModal />
    </main>
  );
}
