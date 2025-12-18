# TOAI API Documentation

Complete API documentation for the TOAI backend system.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get your token by registering or logging in via the Auth API.

---

## API Endpoints

### Authentication
- [Auth API (Admins & Users)](./auth-api.md)
  - Admin register/login
  - User register/login

### Chat
- [Chat API](../README.md#api-endpoints)
  - Health check
  - Plugin status
  - Send chat messages

### Messages
- [Messages API](./messages-api.md)
  - Create, read, update, delete messages
  - Get messages by session
  - Manage conversation history

### User Saves
- [User Saves API](./user-saves-api.md)
  - Save prompts/responses
  - Search saved items
  - Manage saved conversations

### User Addons
- [User Addons API](./user-addons-api.md)
  - Manage user addons
  - Toggle addon status
  - Check expiration

---

## Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
- `503` - Service Unavailable (Plugin disabled)

---

## Quick Start

1. **Start the server:**
   ```bash
   npm run server:dev
   ```

2. **Register/Login to get a token:**
   ```bash
   POST /api/auth/user/register
   # or
   POST /api/auth/user/login
   ```

3. **Use the token in subsequent requests:**
   ```bash
   Authorization: Bearer <your_token>
   ```

4. **Start using the APIs:**
   - Create messages: `POST /api/messages`
   - Save prompts: `POST /api/user-saves`
   - Manage addons: `GET /api/user-addons`

---

## Database Setup

1. Import the SQL dump:
   ```bash
   mysql -u root -p ai_saas < ai_saas\ \(3\).sql
   ```

2. Configure environment variables in `.env`:
   ```bash
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=ai_saas
   
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=1d
   ```

---

## Support

For issues or questions, refer to the individual API documentation files or check the server logs.

