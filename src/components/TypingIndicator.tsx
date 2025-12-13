const TypingIndicator = () => {
  return (
    <div className="flex gap-4 justify-start animate-slide-up">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 flex-shrink-0 flex items-center justify-center shadow-soft dark:shadow-soft-dark">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div className="bg-white dark:bg-slate-700 rounded-2xl px-5 py-3 shadow-soft dark:shadow-soft-dark">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator

