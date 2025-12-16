import { Project } from '../types'

interface ProjectsProps {
  onClose: () => void
  projects: Project[]
  selectedProjectId: string | null
}

const Projects = ({ onClose, projects, selectedProjectId }: ProjectsProps) => {
  return (
    <div className="flex flex-col h-full max-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close projects"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">Projects</h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {projects.length
                  ? 'Switch between workspaces for different teams or initiatives.'
                  : 'Group related chats, prompts, and integrations into workspaces.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {projects.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-dashed border-slate-300 dark:border-slate-700 p-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg shadow-soft">
                P
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                No projects yet
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                Create a project from the sidebar to start grouping related chats, prompts, and email flows.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 p-6 space-y-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">Your projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((project) => {
                  const isActive = project.id === selectedProjectId
                  return (
                    <div
                      key={project.id}
                      className={`rounded-xl border px-4 py-3 flex items-center gap-3 text-sm ${
                        isActive
                          ? 'border-teal-500/80 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 text-white text-sm font-semibold">
                        {project.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 dark:text-slate-50 truncate">
                          {project.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {isActive ? 'Currently active' : 'Workspace'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Projects

