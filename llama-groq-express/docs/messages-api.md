# Messages API Documentation

API endpoints for managing chat messages in the `toai_message` table.

**Base URL:** `/api/messages`

**Authentication:** All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Create Message

Create a new chat message.

**Endpoint:** `POST /api/messages`

**Request Body:**
```json
{
  "session_id": "session_123",
  "sender_type": "user",
  "message": "Hello, how are you?",
  "meta": {
    "model": "llama-3.3-70b",
    "tokens": 150
  }
}
```

**Parameters:**
- `session_id` (string, required): Session identifier
- `sender_type` (enum, required): One of `user`, `user_admin`, `toai_ai`
- `message` (string, required): Message content
- `meta` (object, optional): Additional metadata as JSON

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "session_id": "session_123",
    "sender_type": "user",
    "message": "Hello, how are you?",
    "meta": {
      "model": "llama-3.3-70b",
      "tokens": 150
    },
    "created_at": "2025-12-16T10:00:00.000Z"
  }
}
```

---

## Get My Messages

Get messages for the authenticated user.

**Endpoint:** `GET /api/messages`

**Query Parameters:**
- `limit` (number, optional): Number of messages to return (default: 100)
- `offset` (number, optional): Offset for pagination (default: 0)
- `session_id` (string, optional): Filter by session ID

**Example:** `GET /api/messages?limit=50&offset=0&session_id=session_123`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "session_id": "session_123",
      "sender_type": "user",
      "message": "Hello",
      "meta": null,
      "created_at": "2025-12-16T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## Get Messages by Session

Get all messages in a specific session.

**Endpoint:** `GET /api/messages/session/:session_id`

**Query Parameters:**
- `limit` (number, optional): Number of messages to return (default: 100)
- `offset` (number, optional): Offset for pagination (default: 0)

**Example:** `GET /api/messages/session/session_123?limit=50`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

---

## Get Message by ID

Get a specific message by its ID.

**Endpoint:** `GET /api/messages/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "session_id": "session_123",
    "sender_type": "user",
    "message": "Hello",
    "meta": null,
    "created_at": "2025-12-16T10:00:00.000Z"
  }
}
```

---

## Update Message

Update a message (only if you own it).

**Endpoint:** `PUT /api/messages/:id`

**Request Body:**
```json
{
  "message": "Updated message text",
  "meta": {
    "edited": true
  }
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
    "sender_type": "user",
    "message": "Updated message text",
    "meta": {
      "edited": true
    },
    "created_at": "2025-12-16T10:00:00.000Z"
  }
}
```

---

## Delete Message

Delete a message (only if you own it).

**Endpoint:** `DELETE /api/messages/:id`

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## Delete Messages by Session

Delete all messages in a session (only if you own them).

**Endpoint:** `DELETE /api/messages/session/:session_id`

**Response:**
```json
{
  "success": true,
  "message": "Session messages deleted successfully",
  "deletedCount": 10
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
  "error": "You do not have permission to update this message"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Message not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to create message"
}
```

