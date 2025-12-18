const BACKEND_BASE_URL = 'http://localhost:5000'

export interface BackendChatResponse {
  response: string
  query_type?: string
  tools_used?: string[]
}

export interface BackendEmail {
  id: string
  from: string
  fromEmail: string
  subject: string
  preview: string
  timestamp: string
  read: boolean
  category?: string
  body?: string
  summary?: string
  threadId?: string
  messageId?: string
}

// ========== Core Chat ==========

export async function backendChat(query: string): Promise<BackendChatResponse> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.detail || data?.error || `Chat request failed with status ${res.status}`
    throw new Error(message)
  }

  return data as BackendChatResponse
}

// ========== Gmail Emails & Knowledge Upload ==========

export async function fetchBackendEmails(): Promise<BackendEmail[]> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/emails`)
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.error || `Email fetch failed with status ${res.status}`
    throw new Error(message)
  }

  if (!data?.success) {
    // When not authenticated, backend returns success: false and empty list
    return Array.isArray(data?.emails) ? data.emails : []
  }

  return Array.isArray(data.emails) ? (data.emails as BackendEmail[]) : []
}

export async function uploadKnowledgeFiles(files: File[]): Promise<void> {
  if (!files.length) return

  const form = new FormData()
  files.forEach((file) => {
    form.append('files', file)
  })

  const res = await fetch(`${BACKEND_BASE_URL}/api/upload`, {
    method: 'POST',
    body: form,
  })

  // Best-effort; log but don't throw to avoid breaking UI
  if (!res.ok) {
    console.warn('Knowledge upload failed', await res.text())
  }
}

interface GenerateEmailReplyPayload {
  original_body: string
  original_sender: string
  original_subject: string
  user_prompt?: string
  file_context?: string
}

export async function generateEmailReply(
  payload: GenerateEmailReplyPayload,
): Promise<string> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/email/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok || !data?.success) {
    const message = data?.error || `Email generate failed with status ${res.status}`
    throw new Error(message)
  }

  return (data.reply as string) ?? ''
}

// ========== Google OAuth / Drive & Gmail ==========

interface GoogleAuthInitResponse {
  auth_url: string
  state: string
}

interface GoogleDriveFilesResponse {
  files: any[]
  total: number
  loaded_to_rag: number
  emails?: any[]
  emails_loaded?: number
}

export async function getGoogleAuthUrl(): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/drive/auth-url`)
    const data: GoogleAuthInitResponse | null = await res.json().catch(() => null)
    if (!res.ok || !data?.auth_url) {
      console.warn('Google auth init failed', data)
      return null
    }
    return data.auth_url
  } catch (err) {
    console.error('Failed to initiate Google auth:', err)
    return null
  }
}

export async function syncGoogleDriveAndEmail(
  accessToken: string,
  credentials: Record<string, any>,
): Promise<GoogleDriveFilesResponse | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/drive/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        credentials,
      }),
    })

    const data: GoogleDriveFilesResponse | null = await res.json().catch(() => null)

    if (!res.ok) {
      console.warn('Google Drive sync failed', data)
      return null
    }

    return data
  } catch (err) {
    console.error('Failed to sync Google Drive & Gmail:', err)
    return null
  }
}

// ========== WhatsApp backend integration ==========

export async function connectWhatsApp(): Promise<void> {
  await fetch(`${BACKEND_BASE_URL}/api/whatsapp/connect`, {
    method: 'POST',
  }).catch((err) => {
    console.error('Failed to connect WhatsApp:', err)
  })
}

export async function getWhatsAppLoginStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/whatsapp/login-status`)
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      console.warn('WhatsApp login-status error', data)
      return false
    }
    return !!data?.logged_in
  } catch (err) {
    console.error('Failed to get WhatsApp login status:', err)
    return false
  }
}

export async function getWhatsAppQr(): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/whatsapp/qr`)
    const data = await res.json().catch(() => null)

    if (!res.ok) {
      console.warn('WhatsApp QR error', data)
      return null
    }

    if (data?.logged_in) {
      return null
    }

    return (data?.qr_code as string) || null
  } catch (err) {
    console.error('Failed to get WhatsApp QR:', err)
    return null
  }
}

export async function scrapeWhatsAppGroups(groups: string[]): Promise<void> {
  if (!groups.length) return

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/whatsapp/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groups }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.warn('WhatsApp scrape failed', res.status, text)
    } else {
      const data = await res.json().catch(() => null)
      console.log('WhatsApp scrape result:', data)
    }
  } catch (err) {
    console.error('Error scraping WhatsApp groups:', err)
  }
}

export async function disconnectWhatsApp(): Promise<void> {
  try {
    await fetch(`${BACKEND_BASE_URL}/api/whatsapp/disconnect`, {
      method: 'POST',
    })
  } catch (err) {
    console.error('Failed to disconnect WhatsApp:', err)
  }
}

export async function getWhatsAppGroups(): Promise<string[]> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/whatsapp/groups`)
    const data = await res.json().catch(() => null)

    if (!res.ok) {
      console.warn('WhatsApp groups error', data)
      return []
    }

    const groups = Array.isArray(data?.groups) ? (data.groups as string[]) : []
    return groups.filter((g) => typeof g === 'string' && g.trim().length > 0)
  } catch (err) {
    console.error('Failed to get WhatsApp groups:', err)
    return []
  }
}



