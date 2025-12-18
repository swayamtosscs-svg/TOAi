import { useState } from 'react'
import { loginUser, registerUser } from '../api'

interface AuthProps {
  onAuthenticated: () => void
}

const Auth = ({ onAuthenticated }: AuthProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        await loginUser(email.trim(), password.trim())
      } else {
        await registerUser(name.trim(), email.trim(), password.trim())
      }

      setIsSubmitting(false)
      onAuthenticated()
    } catch (err) {
      console.error(err)
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-cyan-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 px-3">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center mt-6 mb-4">
            <img
              src="/ChatGPT Image Dec 15, 2025, 12_37_03 PM.png"
              alt="TOAI logo"
              className="h-20 w-auto drop-shadow-md"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Welcome to TOAI
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {mode === 'login'
              ? 'Sign in to continue your workspaces and chats.'
              : 'Create your account to save projects and emails.'}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl px-4 py-5">
          {/* Tabs */}
          <div className="flex mb-4 rounded-full bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-full transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-full transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Create account
            </button>
          </div>

          {/* Social login - logos only, compact */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-4">
              {/* Google */}
              <button
                type="button"
                onClick={() => onAuthenticated()}
                className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500 transition-all"
                title="Continue with Google"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 48 48"
                >
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6 1.54 7.38 2.83l5.42-5.42C33.64 4.07 29.3 2 24 2 14.82 2 7.16 7.58 4.24 15.17l6.76 5.24C12.42 14.83 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.5 24.5c0-1.56-.14-3.06-.4-4.5H24v9h12.7c-.55 2.88-2.23 5.32-4.73 6.97l7.27 5.63C43.9 37.52 46.5 31.51 46.5 24.5z" />
                  <path fill="#FBBC05" d="M11 28.41A14.5 14.5 0 019.5 24c0-1.53.27-3.01.74-4.41l-6.76-5.24A22.45 22.45 0 001.5 24a22.45 22.45 0 001.98 9.65l6.76-5.24z" />
                  <path fill="#34A853" d="M24 46.5c6.3 0 11.6-2.08 15.47-5.68l-7.27-5.63C30.4 36.85 27.5 37.9 24 37.9c-6.26 0-11.56-4.33-13.5-10.26l-6.76 5.24C7.16 40.42 14.82 46.5 24 46.5z" />
                  <path fill="none" d="M1.5 1.5h45v45h-45z" />
                </svg>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={() => onAuthenticated()}
                className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500 transition-all"
                title="Continue with LinkedIn"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 34 34"
                >
                  <rect width="34" height="34" rx="4" fill="#0A66C2" />
                  <path
                    d="M10.07 25.5H6.41V13.49h3.66V25.5zM8.24 11.81C7.06 11.81 6 10.76 6 9.58 6 8.4 7.06 7.34 8.24 7.34c1.17 0 2.24 1.06 2.24 2.24 0 1.18-1.07 2.23-2.24 2.23zM28 25.5h-3.65v-5.9c0-1.41-.03-3.22-1.96-3.22-1.96 0-2.26 1.53-2.26 3.12v6h-3.65V13.49h3.5v1.64h.05c.49-.93 1.68-1.9 3.46-1.9 3.71 0 4.4 2.44 4.4 5.61V25.5z"
                    fill="#fff"
                  />
                </svg>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => onAuthenticated()}
                className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500 transition-all"
                title="Continue with GitHub"
              >
                <svg
                  className="h-5 w-5 text-slate-900 dark:text-slate-100"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 .5C5.648.5.5 5.648.5 12c0 5.088 3.292 9.387 7.868 10.907.575.106.785-.25.785-.556 0-.274-.01-1.003-.016-1.97-3.2.695-3.875-1.542-3.875-1.542-.523-1.33-1.278-1.684-1.278-1.684-1.044-.714.079-.699.079-.699 1.155.081 1.763 1.186 1.763 1.186 1.027 1.76 2.694 1.252 3.35.958.104-.744.402-1.253.73-1.54-2.553-.29-5.236-1.277-5.236-5.683 0-1.255.448-2.281 1.183-3.085-.119-.289-.513-1.453.113-3.03 0 0 .965-.309 3.163 1.178a10.95 10.95 0 0 1 2.88-.387c.976.005 1.96.132 2.879.387 2.199-1.487 3.162-1.178 3.162-1.178.627 1.577.233 2.741.114 3.03.737.804 1.182 1.83 1.182 3.085 0 4.418-2.688 5.389-5.252 5.673.414.357.783 1.065.783 2.147 0 1.551-.014 2.8-.014 3.181 0 .309.207.668.79.555C20.21 21.382 23.5 17.085 23.5 12c0-6.352-5.148-11.5-11.5-11.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-[11px] uppercase tracking-wide text-slate-400">
              Or use email
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Work email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-teal-500 focus:ring-teal-500/60"
                  />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 text-white text-sm font-medium py-2.5 shadow-soft hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing you in…' : 'Creating your space…'}
                </span>
              ) : mode === 'login' ? (
                'Continue to TOAI'
              ) : (
                'Create account & continue'
              )}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-center text-slate-500 dark:text-slate-500">
            By continuing, you agree to the{' '}
            <span className="underline decoration-dotted">Terms</span> and{' '}
            <span className="underline decoration-dotted">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth

