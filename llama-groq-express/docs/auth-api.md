# Auth API (Admins & Users)

Base URL: `http://localhost:5000/api/auth`

All responses are JSON with the shape:

```json
{
  "success": true,
  "data": { ... }
}
```

or on error:

```json
{
  "success": false,
  "error": "Message"
}
```

---

## Admin Register

- **URL**: `POST /api/auth/admin/register`
- **Body**:

```json
{
  "email": "admin@example.com",
  "username": "admin1",
  "password": "Secret123!",
  "role": "admin",          // optional, default: "admin"
  "module": "tally"         // optional
}
```

- **Response 201**:

```json
{
  "success": true,
  "data": {
    "admin": {
      "id": 1,
      "email": "admin@example.com",
      "username": "admin1",
      "role": "admin",
      "module": "tally",
      "created_at": "2025-12-16T10:00:00.000Z"
    },
    "token": "JWT_TOKEN_HERE"
  }
}
```

---

## Admin Login

- **URL**: `POST /api/auth/admin/login`
- **Body**:

```json
{
  "email": "admin@example.com",
  "password": "Secret123!"
}
```

- **Response 200**:

```json
{
  "success": true,
  "data": {
    "admin": {
      "id": 1,
      "email": "admin@example.com",
      "username": "admin1",
      "role": "admin",
      "module": "tally",
      "created_at": "2025-12-16T10:00:00.000Z",
      "last_login": "2025-12-16T11:00:00.000Z"
    },
    "token": "JWT_TOKEN_HERE"
  }
}
```

**Notes**:

- Supports existing `admins.password_hash` values from the dump (legacy scrypt format) and new admins created via this API (bcrypt).

---

## User Register

- **URL**: `POST /api/auth/user/register`
- **Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secret123!",
  "role": "user",                 // optional, default: "user"
  "user_admin_id": 1,             // optional
  "user_admin_email": "ua@x.com"  // optional
}
```

- **Response 201**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 10,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "user_admin_id": 1,
      "user_admin_email": "ua@x.com",
      "created_at": "2025-12-16T10:05:00.000Z"
    },
    "token": "JWT_TOKEN_HERE"
  }
}
```

---

## User Login

- **URL**: `POST /api/auth/user/login`
- **Body**:

```json
{
  "email": "john@example.com",
  "password": "Secret123!"
}
```

- **Response 200**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 10,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "user_admin_id": 1,
      "user_admin_email": "ua@x.com",
      "created_at": "2025-12-16T10:05:00.000Z"
    },
    "token": "JWT_TOKEN_HERE"
  }
}
```

---

## Environment Variables

Add these to your `.env` (backend):

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=ai_saas

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
```

Make sure the `ai_saas` database is imported from `ai_saas (3).sql` before using the API.


