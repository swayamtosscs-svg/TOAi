# User Saves API Documentation

API endpoints for managing saved prompts/responses in the `toai_user_save` table.

**Base URL:** `/api/user-saves`

**Authentication:** All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Create Saved Item

Save a prompt/response pair.

**Endpoint:** `POST /api/user-saves`

**Request Body:**
```json
{
  "session_id": "session_123",
  "prompt_text": "What is artificial intelligence?",
  "response_text": "Artificial intelligence is...",
  "title": "AI Definition"
}
```

**Parameters:**
- `prompt_text` (string, required): The prompt text
- `response_text` (string, optional): The AI response
- `session_id` (string, optional): Session identifier
- `title` (string, optional): Title for the saved item

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "session_id": "session_123",
    "prompt_text": "What is artificial intelligence?",
    "response_text": "Artificial intelligence is...",
    "title": "AI Definition",
    "created_at": "2025-12-16T10:00:00.000Z"
  }
}
```

---

## Get My Saved Items

Get saved items for the authenticated user.

**Endpoint:** `GET /api/user-saves`

**Query Parameters:**
- `limit` (number, optional): Number of items to return (default: 100)
- `offset` (number, optional): Offset for pagination (default: 0)
- `session_id` (string, optional): Filter by session ID
- `search` (string, optional): Search in title or prompt_text

**Examples:**
- `GET /api/user-saves?limit=50&offset=0`
- `GET /api/user-saves?session_id=session_123`
- `GET /api/user-saves?search=artificial`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "session_id": "session_123",
      "prompt_text": "What is AI?",
      "response_text": "AI is...",
      "title": "AI Definition",
      "created_at": "2025-12-16T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## Get Saved Item by ID

Get a specific saved item by its ID.

**Endpoint:** `GET /api/user-saves/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "session_id": "session_123",
    "prompt_text": "What is AI?",
    "response_text": "AI is...",
    "title": "AI Definition",
    "created_at": "2025-12-16T10:00:00.000Z"
  }
}
```

---

## Update Saved Item

Update a saved item (only if you own it).

**Endpoint:** `PUT /api/user-saves/:id`

**Request Body:**
```json
{
  "prompt_text": "Updated prompt",
  "response_text": "Updated response",
  "title": "Updated Title"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "session_id": "session_123",
    "prompt_text": "Updated prompt",
    "response_text": "Updated response",
    "title": "Updated Title",
    "created_at": "2025-12-16T10:00:00.000Z"
  }
}
```

---

## Delete Saved Item

Delete a saved item (only if you own it).

**Endpoint:** `DELETE /api/user-saves/:id`

**Response:**
```json
{
  "success": true,
  "message": "Saved item deleted successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Access token required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "You do not have permission to view this item"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Saved item not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to create saved item"
}
```

