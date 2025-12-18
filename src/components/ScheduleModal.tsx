import { useState, useRef } from 'react'

interface ScheduleModalProps {
  prompt: {
    id: string
    title: string
    description: string
    owner: string
    lastRun: string
    tags: string[]
  }
  onClose: () => void
}

const ScheduleModal = ({ prompt, onClose }: ScheduleModalProps) => {
  const [name, setName] = useState(prompt.title)
  const [to, setTo] = useState('')
  const [cc, setCc] = useState('')
  const [description, setDescription] = useState(prompt.description)
  const [tags, setTags] = useState(prompt.tags.join(', '))
  const [scope, setScope] = useState('')
  const [promptTemplate, setPromptTemplate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFileName(file.name)
    }
  }

  const handleExcelUpload = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    // Handle form submission here
    console.log('Schedule submitted:', {
      name,
      to,
      cc,
      description,
      tags,
      scope,
      promptTemplate,
      startDate,
      endDate,
      uploadedFileName
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200/50 dark:border-slate-700/50" style={{ animation: 'slideUp 0.2s ease-out' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200/80 dark:border-slate-700/80 bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500/10 to-violet-500/10 dark:from-teal-500/20 dark:to-violet-500/20">
              <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                Schedule Prompt
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {prompt.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 dark:bg-slate-900/50">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Inputs */}
            <div className="flex-1 space-y-5 pr-8 lg:pr-8">
              {/* Name */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter schedule name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:focus:border-teal-400 transition-all shadow-sm hover:shadow-md"
                />
              </div>

              {/* Description */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a detailed description"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:focus:border-teal-400 transition-all resize-none shadow-sm hover:shadow-md"
                />
              </div>

              {/* Tags */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags (comma separated)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:focus:border-teal-400 transition-all shadow-sm hover:shadow-md"
                />
              </div>

              {/* Scope */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Scope
                </label>
                <input
                  type="text"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="Enter scope"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:focus:border-teal-400 transition-all shadow-sm hover:shadow-md"
                />
              </div>

              {/* Prompt Template */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Prompt Template
                </label>
                <textarea
                  value={promptTemplate}
                  onChange={(e) => setPromptTemplate(e.target.value)}
                  placeholder="Enter your prompt template here..."
                  rows={14}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:focus:border-teal-400 transition-all resize-none shadow-sm hover:shadow-md font-mono text-sm min-h-[390px]"
                />
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-px bg-slate-200 dark:bg-slate-700 mx-8 flex-shrink-0"></div>

            {/* Right Side - Preview */}
            <div className="flex-1 lg:max-w-md pl-0 lg:pl-8 mt-8 lg:mt-0">
              <div className="sticky top-0">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500/10 to-cyan-500/10 dark:from-violet-500/20 dark:to-cyan-500/20">
                    <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    Preview
                  </h3>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 space-y-5">
                  <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Title</h4>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{prompt.title}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{description || <span className="text-slate-400 italic">No description</span>}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags ? tags.split(',').filter(t => t.trim()).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-teal-100 to-violet-100 dark:from-teal-900/30 dark:to-violet-900/30 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-700/50"
                        >
                          {tag.trim()}
                        </span>
                      )) : <span className="text-sm text-slate-400 italic">No tags</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Scope</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{scope || <span className="text-slate-400 italic">No scope specified</span>}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        To
                      </label>
                      <input
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="Enter recipient emails (comma separated)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        CC
                      </label>
                      <input
                        type="text"
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                        placeholder="Enter CC emails (comma separated)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                      />
                    </div>
                  </div>
                  {promptTemplate && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Prompt Template</h4>
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{promptTemplate}</p>
                      </div>
                    </div>
                  )}
                  {/* Excel Upload Button */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Upload Excel File</h4>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handleExcelUpload}
                      className={`w-full px-4 py-3 rounded-xl border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-3 group ${
                        uploadedFileName
                          ? 'border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-teal-400 dark:hover:border-teal-600 hover:bg-teal-50/30 dark:hover:bg-teal-900/10 text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {uploadedFileName ? (
                        <>
                          <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-semibold">{uploadedFileName}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setUploadedFileName(null)
                              if (fileInputRef.current) fileInputRef.current.value = ''
                            }}
                            className="ml-auto p-1 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm font-semibold">Upload Excel File</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">(.xlsx, .xls, .csv)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Start Date, End Date - Flex Form */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Schedule Details</h4>
                    <div className="flex flex-wrap gap-4">
                        {/* Start Date */}
                        <div className="flex-1 min-w-[140px]">
                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Start Date
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:focus:border-teal-400 transition-all shadow-sm hover:shadow-md"
                            />
                          </div>
                        </div>

                        {/* End Date */}
                        <div className="flex-1 min-w-[140px]">
                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            End Date
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:focus:border-teal-400 transition-all shadow-sm hover:shadow-md"
                            />
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom - Action Buttons */}
        <div className="border-t border-slate-200/80 dark:border-slate-700/80 px-8 py-6 bg-gradient-to-r from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleModal
