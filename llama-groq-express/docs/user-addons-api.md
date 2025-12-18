# User Addons API Documentation

API endpoints for managing user addons in the `toai_user_adon` table.

**Base URL:** `/api/user-addons`

**Authentication:** All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Create User Addon

Create a new addon for the authenticated user.

**Endpoint:** `POST /api/user-addons`

**Request Body:**
```json
{
  "addon_code": "premium_features",
  "addon_name": "Premium Features",
  "description": "Access to premium features",
  "is_active": 1,
  "purchased_at": "2025-12-16T10:00:00.000Z",
  "expires_at": "2026-12-16T10:00:00.000Z"
}
```

**Parameters:**
- `addon_code` (string, required): Unique code for the addon
- `addon_name` (string, required): Display name of the addon
- `description` (string, optional): Description of the addon
- `is_active` (number, optional): 1 for active, 0 for inactive (default: 0)
- `purchased_at` (datetime, optional): Purchase date (default: current time)
- `expires_at` (datetime, optional): Expiration date

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "addon_code": "premium_features",
    "addon_name": "Premium Features",
    "description": "Access to premium features",
    "is_active": 1,
    "purchased_at": "2025-12-16T10:00:00.000Z",
    "expires_at": "2026-12-16T10:00:00.000Z",
    "created_at": "2025-12-16T10:00:00.000Z",
    "updated_at": "2025-12-16T10:00:00.000Z"
  }
}
```

**Error (409 Conflict):**
```json
{
  "success": false,
  "error": "Addon already exists for this user"
}
```

---

## Get My Addons

Get addons for the authenticated user.

**Endpoint:** `GET /api/user-addons`

**Query Parameters:**
- `limit` (number, optional): Number of items to return (default: 100)
- `offset` (number, optional): Offset for pagination (default: 0)
- `active_only` (string, optional): Set to "true" to get only active, non-expired addons

**Examples:**
- `GET /api/user-addons?limit=50&offset=0`
- `GET /api/user-addons?active_only=true`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "addon_code": "premium_features",
      "addon_name": "Premium Features",
      "description": "Access to premium features",
      "is_active": 1,
      "purchased_at": "2025-12-16T10:00:00.000Z",
      "expires_at": "2026-12-16T10:00:00.000Z",
      "created_at": "2025-12-16T10:00:00.000Z",
      "updated_at": "2025-12-16T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## Get Addon by ID

Get a specific addon by its ID.

**Endpoint:** `GET /api/user-addons/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "addon_code": "premium_features",
    "addon_name": "Premium Features",
    "description": "Access to premium features",
    "is_active": 1,
    "purchased_at": "2025-12-16T10:00:00.000Z",
    "expires_at": "2026-12-16T10:00:00.000Z",
    "created_at": "2025-12-16T10:00:00.000Z",
    "updated_at": "2025-12-16T10:00:00.000Z"
  }
}
```

---

## Update Addon

Update an addon (only if you own it).

**Endpoint:** `PUT /api/user-addons/:id`

**Request Body:**
```json
{
  "addon_name": "Updated Premium Features",
  "description": "Updated description",
  "is_active": 1,
  "expires_at": "2027-12-16T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "addon_code": "premium_features",
    "addon_name": "Updated Premium Features",
    "description": "Updated description",
    "is_active": 1,
    "purchased_at": "2025-12-16T10:00:00.000Z",
    "expires_at": "2027-12-16T10:00:00.000Z",
    "created_at": "2025-12-16T10:00:00.000Z",
    "updated_at": "2025-12-16T11:00:00.000Z"
  }
}
```

---

## Toggle Addon Active Status

Toggle the active status of an addon.

**Endpoint:** `PATCH /api/user-addons/:id/toggle`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "addon_code": "premium_features",
    "addon_name": "Premium Features",
    "is_active": 0,
    "created_at": "2025-12-16T10:00:00.000Z",
    "updated_at": "2025-12-16T11:00:00.000Z"
  }
}
```

---

## Delete Addon

Delete an addon (only if you own it).

**Endpoint:** `DELETE /api/user-addons/:id`

**Response:**
```json
{
  "success": true,
  "message": "Addon deleted successfully"
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
  "error": "You do not have permission to view this addon"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Addon not found"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "error": "Addon already exists for this user"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to create addon"
}
```

