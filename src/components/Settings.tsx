import { useState, useEffect } from 'react'
import Logo from './Logo'

interface SettingsProps {
  onClose?: () => void
  onLogout?: () => void
}

const Settings = ({ onClose, onLogout }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState<'model-usage' | 'api-usage' | 'load-balancing'>('model-usage')
  const [activeNav, setActiveNav] = useState('dashboard')
  const [showNavMobile, setShowNavMobile] = useState(false)
  const [profileName, setProfileName] = useState<string>('—')
  const [profileEmail, setProfileEmail] = useState<string>('—')
  const [authMethod, setAuthMethod] = useState<string>('—')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedName = localStorage.getItem('userName') || '—'
    const storedEmail = localStorage.getItem('userEmail') || '—'
    const loginMethod = localStorage.getItem('loginMethod') || 'email'

    let authLabel = 'Email & password'
    if (loginMethod === 'google') {
      authLabel = 'Google · SSO'
    }

    setProfileName(storedName)
    setProfileEmail(storedEmail)
    setAuthMethod(authLabel)
  }, [])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'addons', label: 'Addons', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
    { id: 'company', label: 'Company', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'plans', label: 'Plans', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'integration', label: 'Integration', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ]

  return (
    <div className="flex flex-col md:flex-row h-full bg-white dark:bg-slate-900">
      {/* Left Sidebar Navigation (desktop only) */}
      <div className="hidden md:flex md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col">
        {/* Logo Section - reuse main app logo */}
        <div className="px-5 pt-[25px] pb-[25px] border-b border-slate-200 dark:border-slate-700">
          <Logo size="default" />
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeNav === item.id
            return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors rounded-r-2xl ${
                  isActive
                    ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-200 shadow-sm border-r-2 border-blue-500/80'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-[15px] ${
                      isActive
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
                  </span>
                  <span className={isActive ? 'font-semibold' : 'font-medium'}>{item.label}</span>
                </div>
                {isActive && (
                  <span className="hidden md:inline-flex text-[11px] font-medium text-blue-600/80 dark:text-blue-300">
                    Active
                  </span>
                )}
            </button>
            )
          })}
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-colors"
          >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
                </svg>
            <span>Logout</span>
              </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header – custom menu + logo for Settings dashboard */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="flex items-center">
            {/* Left: settings menu trigger (mobile) */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setShowNavMobile(true)}
              title="Open settings menu"
            >
              <svg className="w-5 h-5 text-slate-700 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h13M4 17h10" />
              </svg>
            </button>

            {/* Center: TOAI logo (mobile only) */}
            <div className="flex-1 flex items-center justify-center md:hidden pointer-events-none">
              <Logo size="small" />
            </div>

            {/* Right: close button (only when Settings opened as overlay), pushed to far right */}
            <div className="ml-auto flex items-center">
              {onClose ? (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Close settings"
                >
                  <svg className="w-4 h-4 text-slate-700 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <div className="w-9" />
              )}
            </div>
          </div>

        </div>

        {/* Tabs – only for Dashboard section */}
        {activeNav === 'dashboard' && (
          <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-hide -mb-px">
              {[
                { id: 'model-usage', label: 'Model Usage' },
                { id: 'api-usage', label: 'API Usage' },
                { id: 'load-balancing', label: 'Load Balancing' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-0.5 sm:px-1 text-sm font-medium whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                      : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 px-4 py-6 sm:px-6 lg:px-8">
          {activeNav === 'dashboard' && activeTab === 'model-usage' && (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* KPI row */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Total tokens */}
                <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow px-5 py-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Total tokens this month
                    </p>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-medium">
                      +8.3% vs last month
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      195,173
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">tokens</span>
                  </div>
                  {/* Sparkline */}
                  <div className="mt-1 h-12 w-full">
                    <svg viewBox="0 0 100 32" className="w-full h-full text-emerald-500 dark:text-emerald-400">
                      <defs>
                        <linearGradient id="tokensGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M2 26 L15 20 L28 22 L41 14 L54 16 L67 9 L80 12 L93 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 26 L15 20 L28 22 L41 14 L54 16 L67 9 L80 12 L93 6 L93 30 L2 30 Z"
                        fill="url(#tokensGradient)"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Combined across chat, email and integrations.
                  </p>
                </div>

                {/* Active models */}
                <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow px-5 py-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Active models
                    </p>
                    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 px-2 py-0.5 text-[11px] font-medium">
                      3 of 5 slots
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      3
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">production models</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                    <span>2 realtime · 1 batch</span>
                  </div>
                </div>

                {/* Success rate */}
                <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow px-5 py-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Success rate
                    </p>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-medium">
                      Healthy
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      99.3%
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">successful calls</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-cyan-500"
                      style={{ width: '99.3%' }}
                    />
                  </div>
                </div>

                {/* Spend snapshot */}
                <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow px-5 py-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Est. spend
                    </p>
                    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 px-2 py-0.5 text-[11px] font-medium">
                      72% of monthly cap
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      $4,280
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ $6,000 cap</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: '72%' }} />
                  </div>
                </div>
              </div>

              {/* Main grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Donut chart + legend */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-6 py-5 flex flex-col gap-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Model distribution
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Share of total tokens by model family.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Last 30 days</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                            stroke="#4f46e5"
                          strokeWidth="8"
                          strokeDasharray={`${81.5 * 2.513} 251.3`}
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                            stroke="#38bdf8"
                          strokeWidth="8"
                          strokeDasharray={`${18.5 * 2.513} 251.3`}
                          strokeDashoffset={`-${81.5 * 2.513}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Total tokens
                          </p>
                          <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                            195,173
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            across all models
                          </p>
                      </div>
                    </div>
                  </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                              Pension others
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            159,246
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 ml-5">
                          Aviva · 81.5% of total usage.
                        </p>
                    </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                              Employment pension
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            35,927
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 ml-5">
                          Aegon · 18.5% of total usage.
                        </p>
                      </div>

                      <div className="pt-1 border-t border-dashed border-slate-200 dark:border-slate-700 mt-3" />
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Benchmark deviation</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          +2.1 pts vs peer group
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact breakdown card */}
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-5 py-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Utilization snapshot
                    </h3>
                    <button className="px-2.5 py-1 text-[11px] font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      View details
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Latency p95</span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">420 ms</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: '42%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Token utilization
                        </span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">86%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: '86%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Error budget used
                        </span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">19%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: '19%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-dashed border-slate-200 dark:border-slate-700" />

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Capacity overview
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Shared desks &amp; private offices</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200">40 + 39</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Maximum capacity</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200">96 people</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Current occupancy</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200">50% · 48 people</span>
                      </div>
                      <div className="mt-1 w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: '50%' }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Haven guidelines</span>
                        <svg
                          className="w-3.5 h-3.5 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-600 dark:bg-red-900/25 dark:text-red-300">
                        Not met
                      </span>
                    </div>
                      </div>
                      </div>
                    </div>
                  </div>
          )}

          {/* Dashboard · API Usage */}
          {activeNav === 'dashboard' && activeTab === 'api-usage' && (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* KPI row */}
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-5 py-4 flex flex-col gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Total requests
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      1.8M
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">calls</span>
                  </div>
                  {/* Sparkline */}
                  <div className="mt-1 h-12 w-full">
                    <svg viewBox="0 0 100 32" className="w-full h-full text-sky-500 dark:text-sky-400">
                      <defs>
                        <linearGradient id="requestsGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M2 24 L14 22 L26 18 L38 20 L50 15 L62 17 L74 10 L86 14 L98 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 24 L14 22 L26 18 L38 20 L50 15 L62 17 L74 10 L86 14 L98 8 L98 30 L2 30 Z"
                        fill="url(#requestsGradient)"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Across all projects this month.</p>
                </div>

                <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-5 py-4 flex flex-col gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Average latency
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      220 ms
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-sky-500" style={{ width: '22%' }} />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-5 py-4 flex flex-col gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Error rate
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      0.7%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: '7%' }} />
                  </div>
                    </div>

                <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-5 py-4 flex flex-col gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Rate limit headroom
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      64%
                    </span>
                    </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: '64%' }} />
                    </div>
                  </div>
                </div>

              {/* Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Per-endpoint usage */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Endpoint usage
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Distribution of calls by endpoint in the last 24 hours.
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Live · aggregated</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: '/v1/chat/completions', value: '1.2M', percent: 68 },
                      { name: '/v1/embeddings', value: '410k', percent: 23 },
                      { name: '/v1/moderations', value: '95k', percent: 9 },
                    ].map((row) => (
                      <div key={row.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <span className="inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="font-medium">{row.name}</span>
                          </div>
                          <span className="text-slate-500 dark:text-slate-400">
                            {row.value} · {row.percent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-cyan-500"
                            style={{ width: `${row.percent}%` }}
                          />
                  </div>
                      </div>
                    ))}
                      </div>
                    </div>

                {/* API keys */}
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-5 py-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      API keys
                    </h3>
                    <button className="px-2.5 py-1 text-[11px] font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Manage
                    </button>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Production keys</span>
                      <span className="font-medium text-slate-900 dark:text-slate-50">3 active</span>
                    </div>
                      <div className="flex items-center justify-between">
                      <span>Sandbox keys</span>
                      <span className="font-medium text-slate-900 dark:text-slate-50">5 active</span>
                        </div>
                    <div className="flex items-center justify-between">
                      <span>Rotated this week</span>
                      <span className="font-medium text-slate-900 dark:text-slate-50">2 keys</span>
                      </div>
                    </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Use separate keys per environment and per product surface to keep observability clean.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard · Load Balancing */}
          {activeNav === 'dashboard' && activeTab === 'load-balancing' && (
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-5 py-4 flex flex-col gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Active regions
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      3
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">data centers</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">US-East · EU-West · AP-South.</p>
                </div>

                <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-5 py-4 flex flex-col gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Traffic split
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      40 / 35 / 25
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Weighted round‑robin across primary regions.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-5 py-4 flex flex-col gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Failover readiness
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      99.99%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: '99.99%' }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Region health */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Region health
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Latency and saturation across regions.
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Last 15 minutes</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'US-East', latency: '190 ms', sat: 62, color: 'bg-emerald-500' },
                      { name: 'EU-West', latency: '230 ms', sat: 54, color: 'bg-sky-500' },
                      { name: 'AP-South', latency: '260 ms', sat: 48, color: 'bg-indigo-500' },
                    ].map((r) => (
                      <div key={r.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <span className={`inline-flex w-1.5 h-1.5 rounded-full ${r.color}`} />
                            <span className="font-medium">{r.name}</span>
                          </div>
                          <span className="text-slate-500 dark:text-slate-400">p95 {r.latency}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.sat}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policy summary */}
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-5 py-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Routing policy
                    </h3>
                    <button className="px-2.5 py-1 text-[11px] font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Edit policy
                    </button>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <p>• Primary: latency‑based weighted routing with health checks every 10s.</p>
                    <p>• Automatic failover to secondary region after 3 consecutive failed probes.</p>
                    <p>• Sticky sessions enabled for chat workloads only.</p>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Changes apply instantly across your organization and are fully auditable.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Side navigation sections */}
          {activeNav === 'users' && (
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Team members</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manage who can access TOAI and what they can do.
                      </p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition">
                      Invite user
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 rounded-xl px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-50">Owner</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Full access, billing &amp; security</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">1</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 rounded-xl px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-50">Admins</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Settings &amp; routing rules</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">4</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 rounded-xl px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-50">Analysts</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Read-only insights</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">7</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 rounded-xl px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-50">Service accounts</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Automation &amp; CI/CD</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">3</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-5 py-5 flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Access policies</h3>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <p>• SSO required for all members.</p>
                    <p>• MFA enforced for admins and owners.</p>
                    <p>• Just‑in‑time elevation for production changes.</p>
                  </div>
                  <button className="mt-2 self-start px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Review policies
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'addons' && (
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Email Intelligence',
                    desc: 'Enhance email classification and summarization. Ideal for support and sales inboxes.',
                    status: 'Active',
                    badge: 'Recommended',
                    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
                  },
                  {
                    name: 'WhatsApp Connector',
                    desc: 'Sync conversations from approved WhatsApp workspaces into TOAI.',
                    status: 'In review',
                    badge: 'Beta',
                    color: 'text-sky-500 bg-sky-50 dark:bg-sky-900/30',
                  },
                  {
                    name: 'Advanced Analytics',
                    desc: 'Granular reporting for usage, latency and cost across teams.',
                    status: 'Planned',
                    badge: 'Coming soon',
                    color: 'text-slate-500 bg-slate-100 dark:bg-slate-800',
                  },
                ].map((addon) => (
                  <div
                    key={addon.name}
                    className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow px-5 py-5 flex flex-col gap-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{addon.name}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{addon.desc}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${addon.color}`}
                      >
                        {addon.badge}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        {addon.status}
                      </span>
                      <button className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNav === 'company' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-6 py-5 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Organization profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                        Company name
                      </p>
                      <p className="font-medium text-slate-900 dark:text-slate-50">Acme Corp</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                        Region
                      </p>
                      <p className="font-medium text-slate-900 dark:text-slate-50">EU · GDPR aligned</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                        Industry
                      </p>
                      <p className="font-medium text-slate-900 dark:text-slate-50">Financial services</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                        Data residency
                      </p>
                      <p className="font-medium text-slate-900 dark:text-slate-50">EU‑only</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-6 py-5 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Compliance</h3>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <li>• SOC 2 Type II attested.</li>
                    <li>• Data encrypted in transit and at rest.</li>
                    <li>• Fine‑grained data retention controls.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'plans' && (
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-emerald-200/80 dark:border-emerald-500/50 shadow-sm px-6 py-5 flex flex-col gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    Current plan
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">Enterprise</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Custom limits, dedicated support, and advanced security controls.
                  </p>
                  <button className="mt-2 self-start px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    View contract
                  </button>
                </div>
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-6 py-5 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Usage cap
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      You are at <span className="font-semibold text-slate-900 dark:text-slate-50">72%</span> of your
                      monthly commitment.
                    </p>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: '72%' }} />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-6 py-5 flex flex-col gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Billing contact
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">billing@acme.com</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Invoices and renewal notices are sent monthly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'integration' && (
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* WhatsApp */}
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow px-5 py-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">WhatsApp</p>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      API · QR link
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Connect WhatsApp via official API or QR linking and stream chats into TOAI.
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>2 workspaces · 8 active channels</span>
                  </div>
                  <button className="mt-3 self-start px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Manage connection
                  </button>
                </div>

                {/* Gmail API */}
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow px-5 py-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Gmail API</p>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                      OAuth 2.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ingest threads, labels and messages from Gmail for smart drafting and triage.
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Primary</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Support</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Sales</span>
                  </div>
                  <button className="mt-3 self-start px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Connect Gmail
                  </button>
                </div>

                {/* Google Drive API */}
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow px-5 py-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Google Drive API</p>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                      Read‑only
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Index folders and documents from Drive for retrieval‑augmented answers.
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Docs</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Sheets</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Slides</span>
                  </div>
                  <button className="mt-3 self-start px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Configure Drive
                  </button>
                </div>

                {/* SQL / Oracle DB */}
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow px-5 py-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">SQL / Oracle DB</p>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      3 sources
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Securely connect transactional databases for reporting, summaries and deep dives.
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">MySQL</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Postgres</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Oracle</span>
                  </div>
                  <button className="mt-3 self-start px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Add DB connector
                  </button>
                </div>

                {/* Tally ERP */}
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow px-5 py-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Tally ERP</p>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      Via gateway
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Connect Tally for ledgers, invoices and GST reports without exporting files manually.
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Ledgers</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Vouchers</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Reports</span>
                  </div>
                  <button className="mt-3 self-start px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Configure Tally
                  </button>
                </div>

                {/* Custom REST APIs */}
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow px-5 py-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Custom REST APIs</p>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      Flexible
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bring any HTTP JSON API into TOAI with mapping for prompts and responses.
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">GET</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">POST</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">Webhooks</span>
                  </div>
                  <button className="mt-3 self-start px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Define API schema
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm px-6 py-5 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                      Name
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-50">{profileName}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                      Role
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-50">Workspace owner</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                      Email
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-50">{profileEmail}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                      Authentication
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-50">{authMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile settings menu drawer */}
      {showNavMobile && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-72 max-w-[80%] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col">
            <div className="px-5 pt-4 pb-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Settings
              </span>
              <button
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setShowNavMobile(false)}
                title="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 py-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = activeNav === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveNav(item.id)
                      setShowNavMobile(false)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-200'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-[15px] ${
                          isActive
                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </span>
                      <span className={isActive ? 'font-semibold' : 'font-medium'}>{item.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={onLogout}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>

          <button
            className="flex-1 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowNavMobile(false)}
            aria-label="Close settings menu"
          />
        </div>
      )}
    </div>
  )
}

export default Settings
