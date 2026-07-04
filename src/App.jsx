import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content:
      'Hello! I am your AI assistant. Ask me anything and I will help you right away.',
  },
]

const createSession = (messages = initialMessages) => ({
  id: Date.now().toString(),
  title: messages.find((message) => message.role === 'user')?.content?.slice(0, 24) || 'New chat',
  messages,
})

const quickPrompts = [
  'Summarize this project in one paragraph',
  'Draft a polished email reply',
  'Suggest three creative product ideas',
]

const api = axios.create({
  baseURL: 'https://ai-backend-doge.onrender.com/api',
  withCredentials: true,
})

function App() {
  const [view, setView] = useState('login')
  const [authUser, setAuthUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [sessions, setSessions] = useState([createSession(initialMessages)])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [input, setInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [provider, setProvider] = useState('grok')
  const [theme, setTheme] = useState('dark')
  const [typingText, setTypingText] = useState('')

  const activeSession = sessions.find((session) => session.id === activeSessionId) || sessions[0]
  const messages = activeSession?.messages || []

  useEffect(() => {
    if (!activeSessionId && sessions.length > 0) {
      setActiveSessionId(sessions[0].id)
    }
  }, [activeSessionId, sessions])

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await api.get('/auth/me')
        if (response.data?.success) {
          setAuthUser(response.data.data.user)
          setView('chat')
        }
      } catch {
        setAuthUser(null)
      }
    }

    loadCurrentUser()
  }, [])

  const handleAuthChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    if (authError) setAuthError('')
    if (authSuccess) setAuthSuccess('')
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      setAuthError('Please complete all fields to create your account.')
      return
    }

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      setAuthUser(response.data?.data?.user || null)
      setAuthSuccess(response.data?.message || 'Registration successful')
      setView('chat')
      setFormData({ name: '', email: '', password: '' })
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Registration failed')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    if (!formData.email || !formData.password) {
      setAuthError('Please enter your email and password.')
      return
    }

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      })

      setAuthUser(response.data?.data?.user || null)
      setAuthSuccess(response.data?.message || 'Login successful')
      setView('chat')
      setFormData({ name: '', email: '', password: '' })
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Login failed')
    }
  }

  const handleForgotPassword = async (event) => {
    event.preventDefault()

    if (!formData.email || !formData.password) {
      setAuthError('Please enter your email and a new password.')
      return
    }

    try {
      const response = await api.post('/auth/forgot-password', {
        email: formData.email,
        newPassword: formData.password,
      })

      setAuthSuccess(response.data?.message || 'Password updated successfully')
      setFormData({ name: '', email: '', password: '' })
      setView('login')
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Unable to reset password')
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore logout errors and clear local UI state.
    }

    setAuthUser(null)
    setView('login')
    setSessions([createSession(initialMessages)])
    setActiveSessionId(null)
    setInput('')
    setAuthError('')
    setAuthSuccess('')
    setFormData({ name: '', email: '', password: '' })
  }

  const handleQuickPrompt = (prompt) => {
    setInput(prompt)
  }

  const typeReply = (reply) => {
    setTypingText('')
    let index = 0

    const interval = setInterval(() => {
      setTypingText((current) => {
        const nextValue = reply.slice(0, index + 1)
        index += 1

        if (index >= reply.length) {
          clearInterval(interval)
          setIsChatLoading(false)
        }

        return nextValue
      })
    }, 18)
  }

  const createNewSession = () => {
    const newSession = createSession(initialMessages)
    setSessions((current) => [newSession, ...current])
    setActiveSessionId(newSession.id)
    setInput('')
  }

  const switchSession = (sessionId) => {
    setActiveSessionId(sessionId)
  }

  const sendMessage = async (event) => {
    event.preventDefault()
    if (!input.trim()) return

    const trimmedPrompt = input.trim()
    const userMessage = { id: Date.now(), role: 'user', content: trimmedPrompt }
    const conversation = [...messages, userMessage]

    const nextSession = {
      ...activeSession,
      title: trimmedPrompt.slice(0, 24),
      messages: conversation,
    }

    setSessions((current) => current.map((session) => (session.id === activeSession.id ? nextSession : session)))
    setInput('')
    setIsChatLoading(true)
    setTypingText('')

    try {
      const response = await api.post(`/ai/chat?provider=${provider}`, {
        prompt: trimmedPrompt,
        messages: conversation.map(({ role, content }) => ({ role, content })),
      })

      const assistantReply = response.data?.data?.reply || 'I did not receive a response.'
      const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: assistantReply }

      setSessions((current) =>
        current.map((session) =>
          session.id === activeSession.id
            ? {
                ...session,
                messages: [...session.messages, assistantMessage],
              }
            : session,
        ),
      )

      typeReply(assistantReply)
    } catch (error) {
      const fallbackMessage = {
        id: Date.now() + 2,
        role: 'assistant',
        content: `Sorry, something went wrong: ${error.message}`,
      }

      setSessions((current) =>
        current.map((session) =>
          session.id === activeSession.id
            ? {
                ...session,
                messages: [...session.messages, fallbackMessage],
              }
            : session,
        ),
      )
      setTypingText('')
      setIsChatLoading(false)
    }
  }

  return (
    <div className={`app-shell ${theme}`}>
      <aside className="sidebar">
        <div>
          <div className="hero-top">
            <p className="eyebrow">Connected AI Workspace</p>
            <button type="button" className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          <h1>Launch a smart, beautiful conversation.</h1>
          <p className="sidebar-copy">
            Sign in securely, then switch between Grok and Sarvam to create polished answers, ideas, and writing from a single modern workspace.
          </p>
        </div>

        <div className="sidebar-card">
          <h2>Why it feels premium</h2>
          <ul>
            <li>Fast, reliable AI responses</li>
            <li>Secure authentication and sessions</li>
            <li>One-click access to multiple providers</li>
          </ul>
        </div>
      </aside>

      <main className="content-panel">
        {view !== 'chat' ? (
          <div className="auth-card">
            <div className="auth-header">
              <p className="eyebrow">
                {view === 'login' ? 'Welcome back' : view === 'forgot' ? 'Reset password' : 'Create account'}
              </p>
              <h2>
                {view === 'login' ? 'Sign in to continue' : view === 'forgot' ? 'Reset your password' : 'Join the platform'}
              </h2>
              <p>
                {view === 'login'
                  ? 'Access your workspace and continue your conversations.'
                  : view === 'forgot'
                    ? 'Enter your email and choose a new password.'
                    : 'Start building your smarter experience in just a few steps.'}
              </p>
            </div>

            <form
              onSubmit={view === 'login' ? handleLogin : view === 'forgot' ? handleForgotPassword : handleSignUp}
              className="auth-form"
            >
              {view === 'signup' && (
                <label>
                  <span>Full name</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleAuthChange}
                    placeholder="Alicia Brooks"
                  />
                </label>
              )}

              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleAuthChange}
                  placeholder="you@example.com"
                />
              </label>

              <label>
                <span>{view === 'forgot' ? 'New password' : 'Password'}</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleAuthChange}
                  placeholder="••••••••"
                />
              </label>

              {authError ? <p className="error-text">{authError}</p> : null}
              {authSuccess ? <p className="success-text">{authSuccess}</p> : null}

              <button type="submit" className="primary-btn">
                {view === 'login' ? 'Log in' : view === 'forgot' ? 'Reset password' : 'Create account'}
              </button>
            </form>

            <div className="switch-row">
              {view === 'login' ? (
                <>
                  <span>New here?</span>
                  <button type="button" onClick={() => setView('signup')}>
                    Create account
                  </button>
                  <span>•</span>
                  <button type="button" onClick={() => setView('forgot')}>
                    Forgot password?
                  </button>
                </>
              ) : view === 'forgot' ? (
                <>
                  <span>Remembered it?</span>
                  <button type="button" onClick={() => setView('login')}>
                    Back to login
                  </button>
                </>
              ) : (
                <>
                  <span>Already have an account?</span>
                  <button type="button" onClick={() => setView('login')}>
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="chat-card">
            <div className="chat-header">
              <div>
                <p className="eyebrow">Signed in as {authUser?.name || 'Guest'}</p>
                <h2>AI assistant workspace</h2>
              </div>
              <div className="chat-toolbar">
                <span className="provider-badge">{provider === 'grok' ? 'Grok' : 'Sarvam'}</span>
                <button type="button" className="ghost-btn" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            </div>

            <div className="history-panel">
              <button type="button" className="new-chat-btn" onClick={createNewSession}>+ New chat</button>
              <div className="history-list">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    className={`history-item ${session.id === activeSession?.id ? 'active' : ''}`}
                    onClick={() => switchSession(session.id)}
                  >
                    {session.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="quick-actions">
              {quickPrompts.map((prompt) => (
                <button key={prompt} type="button" className="chip-btn" onClick={() => handleQuickPrompt(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>

            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.role}`}>
                  <strong>{message.role === 'user' ? 'You' : 'Assistant'}</strong>
                  <p>{message.content}</p>
                </div>
              ))}
              {isChatLoading ? (
                <div className="message assistant typing">
                  <strong>Assistant</strong>
                  <p>{typingText || 'Thinking…'}</p>
                </div>
              ) : null}
            </div>

            <form onSubmit={sendMessage} className="chat-form">
              <select value={provider} onChange={(event) => setProvider(event.target.value)}>
                <option value="grok">Grok</option>
                <option value="sarvam">Sarvam</option>
              </select>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask the assistant anything..."
              />
              <button type="submit" className="primary-btn">
                {isChatLoading ? 'Thinking…' : 'Send'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
