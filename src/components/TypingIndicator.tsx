const TypingIndicator = () => {
  return (
    <div className="flex gap-4 justify-start animate-slide-up">
      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-soft dark:shadow-soft-dark overflow-hidden">
        <img 
          src="/ChatGPT Image Dec 15, 2025, 12_37_03 PM.png" 
          alt="TOAI" 
          className="w-full h-full object-contain"
        />
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

