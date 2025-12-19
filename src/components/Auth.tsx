import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { loginUser, registerUser, loginWithGoogle } from '../api'

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsGoogleLoading(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      if (!user.email) {
        throw new Error('Google account does not have an email address')
      }

      // Get the Firebase ID token
      const idToken = await user.getIdToken()

      // Persist basic profile info for header avatar
      try {
        const displayName = user.displayName || user.email.split('@')[0]
        const photoUrl = user.photoURL || ''
        localStorage.setItem('userName', displayName)
        localStorage.setItem('userPhoto', photoUrl)
        localStorage.setItem('loginMethod', 'google')
        localStorage.setItem('userEmail', user.email)
      } catch {
        // Ignore localStorage errors (e.g., in private mode)
      }

      // Send to backend for verification and user creation/login
      await loginWithGoogle(idToken, user.displayName || user.email.split('@')[0], user.email)
      
      setIsGoogleLoading(false)
      onAuthenticated()
    } catch (err) {
      console.error('Google sign-in error:', err)
      const message =
        err instanceof Error ? err.message : 'Google sign-in failed. Please try again.'
      setError(message)
      setIsGoogleLoading(false)
    }
  }

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

      // Clear any social avatar info for email/password login
      try {
        localStorage.setItem('loginMethod', 'email')
        localStorage.setItem('userEmail', email.trim())
        if (mode === 'signup' && name.trim()) {
          localStorage.setItem('userName', name.trim())
        } else if (!localStorage.getItem('userName')) {
          localStorage.setItem('userName', email.trim().split('@')[0])
        }
        localStorage.removeItem('userPhoto')
      } catch {
        // Ignore localStorage errors
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
          <div className="flex mb-3 rounded-full bg-slate-100 dark:bg-slate-800 p-1">
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

          {/* Google Social Login - Prominent Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm shadow-sm hover:shadow-md hover:border-slate-400 dark:hover:border-slate-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
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
              )}
              <span>{isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
            </button>
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

