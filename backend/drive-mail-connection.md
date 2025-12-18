# Google Drive & Gmail Connection Documentation

This document describes the Google Drive and Gmail integration in TOAI, including OAuth setup, API endpoints, and data flow.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [OAuth Configuration](#oauth-configuration)
4. [API Endpoints](#api-endpoints)
5. [Connection Flow](#connection-flow)
6. [File Processing](#file-processing)
7. [Email Features](#email-features)
8. [State Variables](#state-variables)
9. [Troubleshooting](#troubleshooting)

---

## Overview

TOAI integrates with Google Drive and Gmail to:
- **Google Drive**: Import files (PDFs, documents, Excel files) into the RAG system and Excel agent
- **Gmail**: Fetch emails, generate AI summaries, and reply to emails with AI assistance

Both services use **OAuth 2.0** authentication with a single consent flow.

---

## Prerequisites

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Google Drive API**
   - **Gmail API**

### 2. OAuth Credentials

1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Configure:
   - **Name**: TOAI Backend
   - **Authorized redirect URIs**: `http://localhost:5000/oauth2callback`
5. Download the credentials and note:
   - `CLIENT_ID`
   - `CLIENT_SECRET`

### 3. Environment Variables

Add to `backend/ai_engine/.env`:

```env
CLIENT_ID=your_google_client_id_here
CLIENT_SECRET=your_google_client_secret_here
REDIRECT_URI=http://localhost:5000/oauth2callback
```

---

## OAuth Configuration

### Scopes Requested

```python
SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',    # Read Drive files
    'https://www.googleapis.com/auth/gmail.readonly',    # Read emails
    'https://www.googleapis.com/auth/gmail.send',        # Send/reply to emails
]
```

### Token Storage

- **Location**: `backend/ai_engine/token.json`
- **Contents**: OAuth access & refresh tokens
- **Security**: File is gitignored to prevent accidental commits

---

## API Endpoints

### Drive Connection

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/drive/status` | GET | Check if user is authenticated with Google |
| `/api/drive/auth-url` | GET | Get OAuth authorization URL for login |
| `/oauth2callback` | GET | OAuth callback - exchanges code for tokens |
| `/api/drive/files` | GET | Fetch Drive files and Gmail, load into RAG |

### Email Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/emails` | GET | Fetch Gmail emails with AI summaries |
| `/api/email/generate` | POST | Generate AI reply to an email |
| `/api/email/send` | POST | Send an email reply via Gmail |

---

## Connection Flow

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE DRIVE/GMAIL CONNECTION                │
└─────────────────────────────────────────────────────────────────┘

User clicks "Connect Drive"
         │
         ▼
┌─────────────────┐
│ Check Status    │ GET /api/drive/status
│ (authenticated?)│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Not Auth] [Authenticated]
    │             │
    ▼             ▼
┌───────────┐  ┌──────────────────┐
│ Get Auth  │  │ Fetch Files      │
│ URL       │  │ GET /api/drive/  │
└─────┬─────┘  │    files         │
      │        └────────┬─────────┘
      ▼                 │
┌───────────────┐       ▼
│ Popup OAuth   │  ┌──────────────────┐
│ Google Login  │  │ Process Files:   │
└───────┬───────┘  │ • PDFs → RAG     │
        │          │ • Excel → Agent  │
        ▼          │ • Emails → RAG   │
┌───────────────┐  └──────────────────┘
│ Callback with │
│ auth code     │
└───────┬───────┘
        │
        ▼
┌───────────────────┐
│ Exchange code for │
│ access token      │
│ Save token.json   │
└───────────────────┘
```

### Frontend Implementation

**Button Location**: ChatInterface.tsx - "Connect Drive" button in header

**States**:
```typescript
const [isDriveConnected, setIsDriveConnected] = useState(false)
const [showDriveModal, setShowDriveModal] = useState(false)
const [driveStep, setDriveStep] = useState<'idle' | 'connecting' | 'fetching' | 'success'>('idle')
```

---

## File Processing

### Supported File Types

| File Type | Processing |
|-----------|------------|
| `.pdf` | Extracted text → RAG system |
| `.docx` | Extracted text → RAG system |
| `.txt` | Direct text → RAG system |
| `.xlsx`, `.xls` | Data → Excel Agent |

### Processing Flow

```python
# From /api/drive/files endpoint

# 1. Download files from Drive
downloaded_files = mcp_client.download_files(file_ids, download_dir)

# 2. Separate by type
excel_files = [f for f in downloaded_files if f.endswith(('.xlsx', '.xls'))]
other_files = [f for f in downloaded_files if not f.endswith(('.xlsx', '.xls'))]

# 3. Process Excel files → Excel Agent
for excel_path in excel_files:
    excel_agent_system.add_excel_file(excel_path)

# 4. Process other files → RAG System
rag_system.load_documents(other_files)

# 5. Fetch and process emails → RAG System
emails = mcp_client.fetch_gmail_emails()
for email in emails:
    rag_system.add_text(email['subject'] + '\n' + email['body'])
```

---

## Email Features

### Fetching Emails

**Endpoint**: `GET /api/emails?max_results=5`

**Response**:
```json
{
  "success": true,
  "emails": [
    {
      "id": "msg_123",
      "threadId": "thread_456",
      "messageId": "<message-id@mail.gmail.com>",
      "from": "John Doe",
      "fromEmail": "john@example.com",
      "subject": "Project Update",
      "preview": "Hi, here's the latest...",
      "body": "Full email body...",
      "summary": "AI-generated 2-sentence summary",
      "timestamp": "2024-12-17T10:00:00Z",
      "category": "Client",
      "read": false
    }
  ]
}
```

### Generating AI Reply

**Endpoint**: `POST /api/email/generate`

**Request**:
```json
{
  "original_body": "The original email content...",
  "original_sender": "John Doe",
  "original_subject": "Project Update",
  "user_prompt": "Make it more formal",
  "file_context": "Optional context from attached files"
}
```

**Response**:
```json
{
  "success": true,
  "reply": "Dear John,\n\nThank you for your email..."
}
```

### Sending Reply

**Endpoint**: `POST /api/email/send`

**Request**:
```json
{
  "to": "john@example.com",
  "subject": "Re: Project Update",
  "body": "Dear John,\n\nThank you...",
  "cc": "optional@cc.com",
  "thread_id": "thread_456",
  "message_id": "<message-id@mail.gmail.com>"
}
```

---

## State Variables

### Backend (app.py)

```python
# MCP Client instance (handles Drive & Gmail)
_mcp_client = None  # Singleton instance

def get_mcp_client():
    global _mcp_client
    if _mcp_client is None:
        _mcp_client = MCPClient(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            redirect_uri=REDIRECT_URI,
            scopes=SCOPES
        )
    return _mcp_client

# Credentials store for OAuth tokens
credentials_store = {}  # {user_id: credentials}

# Download directory for Drive files
GOOGLE_DRIVE_DOWNLOAD_DIR = "google_drive_downloads/"
```

### Frontend (ChatInterface.tsx)

```typescript
// Drive connection state
const [isDriveConnected, setIsDriveConnected] = useState(false)

// Modal visibility
const [showDriveModal, setShowDriveModal] = useState(false)

// Connection progress
const [driveStep, setDriveStep] = useState<'idle' | 'connecting' | 'fetching' | 'success'>('idle')

// Results
const [driveResult, setDriveResult] = useState<{
  files: number
  message: string
} | null>(null)
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Not authenticated" | No token.json or expired | Re-authenticate via Connect Drive |
| "Invalid client_id" | Wrong CLIENT_ID in .env | Check Google Cloud Console |
| "Redirect URI mismatch" | Callback URL not configured | Add `http://localhost:5000/oauth2callback` in GCP |
| "Access denied" | User didn't grant permissions | User must accept all scopes |
| "Rate limit exceeded" | Too many API calls | Wait and retry, or request quota increase |

### Debug Logging

Check backend console for:
```
[MCP] Authenticating with Google...
[MCP] Token saved successfully
[API] Fetching 5 files from Drive...
[API] Downloaded: report.pdf
[RAG] Loaded 3 documents with 1500 chunks
```

### Token Issues

To reset authentication:
1. Delete `backend/ai_engine/token.json`
2. Restart backend
3. Click "Connect Drive" again

---

## Security Notes

1. **Never commit** `token.json` or `.env` files
2. **OAuth tokens** contain sensitive access credentials
3. **CLIENT_SECRET** should be kept confidential
4. In production, use **secure storage** for tokens (database/secret manager)
5. Consider **token encryption** for multi-tenant deployments

---

## Related Files

| File | Purpose |
|------|---------|
| `backend/ai_engine/app.py` | API endpoints |
| `backend/ai_engine/mcp_client.py` | Google Drive & Gmail API wrapper |
| `frontend/src/components/ChatInterface.tsx` | Drive connection UI |
| `frontend/src/components/EmailManager.tsx` | Email management UI |
| `backend/ai_engine/.env` | OAuth credentials |
| `backend/ai_engine/token.json` | OAuth tokens (gitignored) |
