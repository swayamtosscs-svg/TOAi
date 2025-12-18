// Centralized route definitions for the application.
// Note: Existing components and files are not modified; this file only
// provides a single source of truth for route paths and metadata.

export const ROUTE_PATHS = {
  AUTH: '/auth',
  CHAT: '/',
  EMAIL_MANAGER: '/email',
  SAVED_PROMPTS: '/saved-prompts',
  PROJECTS: '/projects',
  SETTINGS: '/settings',
} as const

export type RouteKey = keyof typeof ROUTE_PATHS

export interface AppRoute {
  /** Stable identifier for the route within the app */
  key: RouteKey
  /** URL path pattern for the route */
  path: (typeof ROUTE_PATHS)[RouteKey]
  /** Human‑readable label for navigation, breadcrumbs, etc. */
  label: string
}

export const appRoutes: AppRoute[] = [
  {
    key: 'AUTH',
    path: ROUTE_PATHS.AUTH,
    label: 'Sign in',
  },
  {
    key: 'CHAT',
    path: ROUTE_PATHS.CHAT,
    label: 'Chat',
  },
  {
    key: 'EMAIL_MANAGER',
    path: ROUTE_PATHS.EMAIL_MANAGER,
    label: 'Email Manager',
  },
  {
    key: 'SAVED_PROMPTS',
    path: ROUTE_PATHS.SAVED_PROMPTS,
    label: 'Saved Prompts',
  },
  {
    key: 'PROJECTS',
    path: ROUTE_PATHS.PROJECTS,
    label: 'Projects',
  },
  {
    key: 'SETTINGS',
    path: ROUTE_PATHS.SETTINGS,
    label: 'Settings',
  },
]


