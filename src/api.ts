const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export interface AuthResponse {
  success: boolean
  data?: {
    user?: {
      id: number
      name: string
      email: string
      role: string
    }
    admin?: {
      id: number
      email: string
      username: string
      role: string
    }
    token?: string
  }
  error?: string
}

const getAuthToken = () => {
  return localStorage.getItem('authToken') || ''
}

export const getAuthHeaders = () => {
  const token = getAuthToken()
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

// ========== Chat message logging (toai_message) ==========

type SenderType = 'user' | 'user_admin' | 'toai_ai'

interface ToaiMessagePayload {
  session_id: string
  sender_type: SenderType
  message: string
  meta?: unknown
  project?: string | null
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data: AuthResponse = await res.json().catch(() => ({ success: false, error: 'Invalid response from server' }))

  if (!res.ok || !data.success) {
    throw new Error(data.error || `Login failed with status ${res.status}`)
  }

  if (data.data?.token) {
    localStorage.setItem('authToken', data.data.token)
    localStorage.setItem('authEmail', email)
    localStorage.setItem('isAuthenticated', 'true')
  }

  return data
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  })

  const data: AuthResponse = await res
    .json()
    .catch(() => ({ success: false, error: 'Invalid response from server' }))

  if (!res.ok || !data.success) {
    throw new Error(data.error || `Signup failed with status ${res.status}`)
  }

  if (data.data?.token) {
    localStorage.setItem('authToken', data.data.token)
    localStorage.setItem('authEmail', email)
    localStorage.setItem('isAuthenticated', 'true')
  }

  return data
}

export async function loginWithGoogle(idToken: string, name: string, email: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/user/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken, name, email }),
  })

  const data: AuthResponse = await res.json().catch(() => ({ success: false, error: 'Invalid response from server' }))

  if (!res.ok || !data.success) {
    throw new Error(data.error || `Google login failed with status ${res.status}`)
  }

  if (data.data?.token) {
    localStorage.setItem('authToken', data.data.token)
    localStorage.setItem('authEmail', email)
    localStorage.setItem('isAuthenticated', 'true')
  }

  return data
}

export async function logChatMessage(payload: ToaiMessagePayload): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      // Best-effort logging only; do not throw to avoid breaking chat
      const text = await res.text().catch(() => '')
      console.warn('Failed to log chat message:', res.status, text)
    }
  } catch (err) {
    console.warn('Error logging chat message:', err)
  }
}

// ========== Chat history (toai_message) ==========

export interface ToaiMessage {
  id: number
  user_id: number
  session_id: string
  project?: string | null
  sender_type: string
  message: string
  meta?: any
  created_at: string
  updated_at?: string
}

export interface ToaiMessagesResponse {
  success: boolean
  data: ToaiMessage[]
  count: number
  error?: string
}

export async function fetchMyMessages(limit = 20): Promise<ToaiMessage[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit), offset: '0' })
    const res = await fetch(`${API_BASE_URL}/messages?${params.toString()}`, {
      headers: {
        ...getAuthHeaders(),
      },
    })
    const data: ToaiMessagesResponse = await res.json().catch(() => ({
      success: false,
      data: [],
      count: 0,
    } as any))

    if (!res.ok || !data.success) {
      console.warn('Failed to fetch messages:', data?.error || res.statusText)
      return []
    }

    return Array.isArray(data.data) ? data.data : []
  } catch (err) {
    console.warn('Error fetching messages:', err)
    return []
  }
}

export async function fetchMessagesBySession(
  sessionId: string,
  limit = 200,
  offset = 0,
): Promise<ToaiMessage[]> {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      session_id: sessionId,
    })

    const res = await fetch(`${API_BASE_URL}/messages?${params.toString()}`, {
      headers: {
        ...getAuthHeaders(),
      },
    })

    const data: ToaiMessagesResponse = await res.json().catch(() => ({
      success: false,
      data: [],
      count: 0,
    } as any))

    if (!res.ok || !data.success) {
      console.warn('Failed to fetch session messages:', data?.error || res.statusText)
      return []
    }

    return Array.isArray(data.data) ? data.data : []
  } catch (err) {
    console.warn('Error fetching session messages:', err)
    return []
  }
}

// ========== Saved Prompts (toai_user_save) ==========

export interface UserSave {
  id: number
  user_id: number
  session_id: string | null
  name: string | null
  description: string | null
  tags: string | null
  scope: string | null
  prompt_template: string
  preview: string | null
  viewer: string | null
  created_at: string
}

interface UserSaveListResponse {
  success: boolean
  data: UserSave[]
  count: number
  error?: string
}

interface UserSaveSingleResponse {
  success: boolean
  data: UserSave
  error?: string
}

export async function listUserSaves(params?: {
  limit?: number
  offset?: number
  session_id?: string
  search?: string
}): Promise<UserSave[]> {
  try {
    const searchParams = new URLSearchParams()
    if (params?.limit !== undefined) searchParams.set('limit', String(params.limit))
    if (params?.offset !== undefined) searchParams.set('offset', String(params.offset))
    if (params?.session_id) searchParams.set('session_id', params.session_id)
    if (params?.search) searchParams.set('search', params.search)

    const url =
      searchParams.toString().length > 0
        ? `${API_BASE_URL}/user-saves?${searchParams.toString()}`
        : `${API_BASE_URL}/user-saves`

    const res = await fetch(url, {
      headers: {
        ...getAuthHeaders(),
      },
    })

    const data: UserSaveListResponse = await res.json().catch(
      () =>
        ({
          success: false,
          data: [],
          count: 0,
        } as any),
    )

    if (!res.ok || !data.success) {
      console.warn('Failed to fetch user saves:', data?.error || res.statusText)
      return []
    }

    return Array.isArray(data.data) ? data.data : []
  } catch (err) {
    console.warn('Error fetching user saves:', err)
    return []
  }
}

export async function createUserSave(payload: {
  session_id?: string | null
  name?: string | null
  description?: string | null
  tags?: string | null
  scope?: string | null
  prompt_template: string
  preview?: string | null
  viewer?: string | null
}): Promise<UserSave | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-saves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })

    const data: UserSaveSingleResponse = await res.json().catch(
      () =>
        ({
          success: false,
          data: null,
        } as any),
    )

    if (!res.ok || !data.success) {
      console.warn('Failed to create user save:', data?.error || res.statusText)
      return null
    }

    return data.data
  } catch (err) {
    console.warn('Error creating user save:', err)
    return null
  }
}

export async function updateUserSave(
  id: number,
  payload: Partial<{
    name: string | null
    description: string | null
    tags: string | null
    scope: string | null
    prompt_template: string
    preview: string | null
    viewer: string | null
  }>,
): Promise<UserSave | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-saves/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })

    const data: UserSaveSingleResponse = await res.json().catch(
      () =>
        ({
          success: false,
          data: null,
        } as any),
    )

    if (!res.ok || !data.success) {
      console.warn('Failed to update user save:', data?.error || res.statusText)
      return null
    }

    return data.data
  } catch (err) {
    console.warn('Error updating user save:', err)
    return null
  }
}

export async function deleteUserSave(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/user-saves/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.warn('Failed to delete user save:', res.status, text)
      return false
    }

    const data = await res.json().catch(() => null)
    return !!data?.success
  } catch (err) {
    console.warn('Error deleting user save:', err)
    return false
  }
}

export function clearAuth() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('authEmail')
  localStorage.removeItem('isAuthenticated')
}


