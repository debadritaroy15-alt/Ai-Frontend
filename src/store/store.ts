import { create } from 'zustand';

export type ChatRole = 'assistant' | 'user';
export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  provider: 'grok' | 'sarvam' | 'ollama';
};

export type UserProfile = {
  name: string;
  email: string;
  tier: 'Free' | 'Pro';
};

export type NotificationItem = {
  id: string;
  title: string;
  read: boolean;
  timestamp: string;
};

export type UploadedFile = {
  name: string;
  content: string;
  type: string;
  size?: string;
};

export type AppState = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  activeProvider: 'grok' | 'sarvam' | 'ollama';
  setActiveProvider: (provider: 'grok' | 'sarvam' | 'ollama') => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  createNewSession: () => void;
  deleteSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  setActiveSessionId: (id: string) => void;
  addMessageToActiveSession: (message: ChatMessage) => void;
  setSessions: (sessions: ChatSession[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  isUpgradeOpen: boolean;
  setUpgradeOpen: (open: boolean) => void;
  isWorkspaceOpen: boolean;
  setWorkspaceOpen: (open: boolean) => void;
  uploadedFiles: UploadedFile[];
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (name: string) => void;
  clearUploadedFiles: () => void;
  notifications: NotificationItem[];
  addNotification: (title: string) => void;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
};

const initialMessages: ChatMessage[] = [
  {
    role: 'assistant',
    content: 'Welcome to Nova AI Studio. Ask me anything and I will help you craft your next great idea.',
  },
];

const defaultSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Design review',
    provider: 'grok',
    messages: [
      { role: 'user', content: 'What are the main principles of clean interface design?' },
      { role: 'assistant', content: 'Clean interface design prioritizes: \n1. **Clarity**: Eliminate ambiguity. Every element should have a clear purpose.\n2. **Visual Hierarchy**: Guide the user\'s eye to key actions via scale, contrast, and spacing.\n3. **Consistency**: Use a cohesive token system (colors, spacing, typography) so elements behave predictably.\n4. **Feedback**: Provide immediate micro-animations or visual responses on interaction.' }
    ]
  },
  {
    id: '2',
    title: 'Product launch',
    provider: 'sarvam',
    messages: [
      { role: 'user', content: 'Suggest a three-step launch plan.' },
      { role: 'assistant', content: 'Here is your launch checklist:\n- **Beta Phase**: Roll out to a close group of 100 power users to gather product metrics and fix performance bottlenecks.\n- **Hype Building**: Publish technical deep-dives on social platforms detailing the premium motion designs and performance optimizations.\n- **Public Release**: Open public registration with streamlined onboarding and multi-provider AI access enabled.' }
    ]
  },
  {
    id: '3',
    title: 'AI prompts',
    provider: 'grok',
    messages: [
      { role: 'user', content: 'Draft a system prompt for a premium writing assistant.' },
      { role: 'assistant', content: 'Use this prompt:\n```markdown\nYou are a premium copy editor. Your tone is professional, clear, and highly articulate. Improve the typography, flow, and visual structure of any draft submitted, emphasizing clarity and impact.\n```' }
    ]
  },
  {
    id: 'default',
    title: 'New chat',
    provider: 'grok',
    messages: initialMessages,
  }
];

export const useStore = create<AppState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  activeProvider: 'grok',
  setActiveProvider: (activeProvider) => set({ activeProvider }),
  sessions: defaultSessions,
  activeSessionId: 'default',
  createNewSession: () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New chat',
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I am your AI assistant. Ask me anything and I will help you right away.',
        },
      ],
      provider: get().activeProvider,
    };
    set((state) => ({
      sessions: [newSession, ...state.sessions],
      activeSessionId: newSession.id,
    }));
  },
  deleteSession: (id) => {
    set((state) => {
      const filtered = state.sessions.filter((s) => s.id !== id);
      const nextActiveId =
        state.activeSessionId === id
          ? filtered[0]?.id || 'default'
          : state.activeSessionId;

      // If no sessions remain, regenerate the default one
      if (filtered.length === 0) {
        return {
          sessions: [
            {
              id: 'default',
              title: 'New chat',
              provider: 'grok',
              messages: initialMessages,
            },
          ],
          activeSessionId: 'default',
        };
      }

      return {
        sessions: filtered,
        activeSessionId: nextActiveId,
      };
    });
  },
  renameSession: (id, title) => {
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? { ...s, title } : s)),
    }));
  },
  setActiveSessionId: (activeSessionId) => {
    const session = get().sessions.find((s) => s.id === activeSessionId);
    set({
      activeSessionId,
      activeProvider: session ? session.provider : get().activeProvider,
    });
  },
  addMessageToActiveSession: (message) => {
    set((state) => {
      const activeSession = state.sessions.find((s) => s.id === state.activeSessionId);
      if (!activeSession) return {};

      const updatedMessages = [...activeSession.messages, message];
      
      // Auto-rename session if it's currently named "New chat" and the message is from a user
      let title = activeSession.title;
      if (title === 'New chat' && message.role === 'user') {
        title = message.content.slice(0, 24) || 'New chat';
      }

      return {
        sessions: state.sessions.map((s) =>
          s.id === state.activeSessionId
            ? { ...s, messages: updatedMessages, title }
            : s
        ),
      };
    });
  },
  setSessions: (sessions) => set({ sessions }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  isSettingsOpen: false,
  setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  isUpgradeOpen: false,
  setUpgradeOpen: (isUpgradeOpen) => set({ isUpgradeOpen }),
  isWorkspaceOpen: false,
  setWorkspaceOpen: (isWorkspaceOpen) => set({ isWorkspaceOpen }),
  uploadedFiles: [],
  addUploadedFile: (file) =>
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
  removeUploadedFile: (name) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((f) => f.name !== name),
    })),
  clearUploadedFiles: () => set({ uploadedFiles: [] }),
  notifications: [
    { id: 'n1', title: 'Welcome to Nova AI Workspace!', read: false, timestamp: 'Just now' },
    { id: 'n2', title: 'Grok API upgraded to Llama 3.3 70B', read: false, timestamp: '1 hour ago' },
    { id: 'n3', title: 'Sarvam translation response times improved', read: true, timestamp: 'Yesterday' },
  ],
  addNotification: (title) => {
    const newItem: NotificationItem = {
      id: Date.now().toString(),
      title,
      read: false,
      timestamp: 'Just now',
    };
    set((state) => ({ notifications: [newItem, ...state.notifications] }));
  },
  markNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
  clearNotifications: () => set({ notifications: [] }),
  theme: 'system',
  setTheme: (theme) => {
    set({ theme });
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  },
}));
