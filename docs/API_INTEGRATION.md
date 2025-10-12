# API Integration với Axios - Next.js

## 📁 Folder Structure

```
src/
├── lib/
│   └── axios.ts                    # Axios configuration & interceptors
├── services/
│   └── auth.service.ts             # Auth API service
├── types/
│   ├── api.ts                      # Base API types
│   └── auth.type.ts                # ✅ All auth types (request + response)
└── components/
    └── features/
        └── auth/
            ├── LoginForm.tsx
            └── RegisterForm.tsx    # ✅ Integrated with API
```

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install axios
```

### 2. Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Restart Development Server

```bash
npm run dev
```

## 🎯 Axios Configuration (Senior Level)

### Features

✅ **Request/Response Interceptors** - Auto logging, token injection
✅ **Error Handling** - Custom ApiError class
✅ **Auto Token Management** - localStorage integration
✅ **Auto Redirect** - 401 → Login page
✅ **Type Safety** - Full TypeScript support
✅ **Environment Config** - Centralized base URL
✅ **Timeout Handling** - 30s default timeout
✅ **Development Logging** - Console logs in dev mode only

### Axios Instance (`src/lib/axios.ts`)

```typescript
// Request interceptor
- Auto inject Bearer token from localStorage
- Log requests in development mode

// Response interceptor
- Auto handle 401 (logout + redirect to login)
- Auto handle 403 (access denied)
- Auto handle 500+ (server errors)
- Parse ApiResponse structure
- Throw custom ApiError
```

## 📦 API Response Structure

Tất cả API responses theo format:

```typescript
{
   code: number // HTTP status code
   message: string // Success/Error message
   data: any // Response data
}
```

### Example Responses

#### Success (Register)

```json
{
   "code": 201,
   "message": "User registered successfully",
   "data": {
      "id": 1,
      "email": "user@example.com",
      "roleName": "CANDIDATE",
      "status": "ACTIVE",
      "provider": "LOCAL",
      "dateCreated": "2025-10-12T11:44:51.899143+07:00"
   }
}
```

#### Error

```json
{
   "code": 400,
   "message": "Email already exists",
   "data": null
}
```

## 🔧 Auth Service (`src/services/auth.service.ts`)

### Available Methods

```typescript
// Register candidate
await authService.registerCandidate({
   fullName: 'John Doe',
   email: 'john@example.com',
   password: 'Password123'
})

// Login
await authService.login({
   email: 'john@example.com',
   password: 'Password123'
})

// Logout
await authService.logout()

// Get current user
await authService.getCurrentUser()

// Refresh token
await authService.refreshToken(refreshToken)

// Check if authenticated
authService.isAuthenticated()

// Get access token
authService.getAccessToken()
```

## 💡 Usage Example

### RegisterForm Component

```tsx
'use client'

import { authService } from '@/services/auth.service'
import { ApiError } from '@/lib/axios'

export default function RegisterForm() {
   const onSubmit = async (data) => {
      try {
         // Call API
         const response = await authService.registerCandidate(data)

         // Success
         console.log(response.message) // "User registered successfully"
         console.log(response.data) // User data

         // Redirect
         router.push('/auth/login')
      } catch (err) {
         // Error handling
         if (err instanceof ApiError) {
            console.log(err.code) // 400
            console.log(err.message) // "Email already exists"
            console.log(err.data) // Additional error data
         }
      }
   }
}
```

## 🔐 Token Management

### Auto Token Injection

Axios tự động thêm token vào mọi request:

```typescript
headers: {
   Authorization: `Bearer ${token}`
}
```

### Storage Location

- Access Token: `localStorage.getItem('accessToken')`
- Refresh Token: `localStorage.getItem('refreshToken')`

### Auto Logout on 401

Khi API trả về 401 Unauthorized:

1. Clear tokens from localStorage
2. Redirect to `/auth/login`

## 🎨 Type Safety

### Auth Types (`auth.type.ts`)

```typescript
// ============================================
// REQUEST TYPES (Data gửi lên server)
// ============================================

export interface LoginType {
   email: string
   password: string
}

export interface RegisterType {
   email: string
   fullName: string
   password: string
}

export interface RegisterFormType extends RegisterType {
   confirmPassword: string
}

// ============================================
// RESPONSE TYPES (Data nhận từ server)
// ============================================

export interface UserData {
   id: number
   email: string
   roleName: 'CANDIDATE' | 'RECRUITER' | 'ADMIN'
   status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
   provider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'LINKEDIN'
   dateCreated: string
}

export interface RegisterResponseData {
   id: number
   email: string
   roleName: string
   status: string
   provider: string
   dateCreated: string
}

export interface LoginResponseData {
   accessToken: string
   refreshToken?: string
   user: UserData
}
```

### API Base Types (`api.ts`)

```typescript
export interface ApiResponse<T = unknown> {
   code: number
   message: string
   data: T
}
```

## 🐛 Error Handling

### ApiError Class

```typescript
class ApiError extends Error {
   code: number // Error code from API
   message: string // Error message
   data?: unknown // Additional error data
}
```

### Handling Errors

```typescript
try {
   await authService.registerCandidate(data)
} catch (err) {
   if (err instanceof ApiError) {
      // API error
      setError(err.message)
   } else if (err instanceof Error) {
      // Other errors
      setError(err.message)
   }
}
```

## 📝 Development Logs

### Request Log

```
🚀 API Request: {
  method: "POST",
  url: "/auth/register/candidate",
  data: { fullName: "...", email: "...", password: "..." }
}
```

### Response Log (Success)

```
✅ API Response: {
  url: "/auth/register/candidate",
  status: 201,
  data: { code: 201, message: "...", data: {...} }
}
```

### Response Log (Error)

```
❌ API Error: {
  url: "/auth/register/candidate",
  status: 400,
  data: { code: 400, message: "Email already exists", data: null }
}
```

## 🚦 Testing

1. Start backend API on port 8080
2. Start Next.js: `npm run dev`
3. Navigate to `/auth/register`
4. Fill form and submit
5. Check browser console for logs
6. Check Network tab for requests

## 🔄 Flow Diagram

```
User fills form
     ↓
RegisterForm.onSubmit()
     ↓
authService.registerCandidate(data)
     ↓
axios.post('/auth/register/candidate', data)
     ↓
Request Interceptor
  - Add Bearer token
  - Log request (dev mode)
     ↓
Backend API
     ↓
Response Interceptor
  - Log response (dev mode)
  - Handle errors
  - Parse ApiResponse
     ↓
Return data to component
     ↓
Success: Show alert → Redirect to login
Error: Show error message
```

## 🎯 Best Practices

✅ **Singleton Pattern** - AuthService là class instance duy nhất
✅ **Type Safety** - Tất cả types được define rõ ràng
✅ **Error Handling** - Custom ApiError class
✅ **Separation of Concerns** - Service layer tách biệt khỏi UI
✅ **Environment Variables** - Không hardcode URLs
✅ **Development Logging** - Chỉ log trong dev mode
✅ **Token Security** - Auto clear tokens on logout/401

## 🆚 So với Fetch

| Feature                    | Axios  | Fetch       |
| -------------------------- | ------ | ----------- |
| Interceptors               | ✅     | ❌          |
| Auto JSON parse            | ✅     | ❌ (manual) |
| Request/Response transform | ✅     | ❌          |
| Timeout                    | ✅     | ❌ (manual) |
| Error handling             | Better | Basic       |
| Browser support            | Wider  | Modern only |
| Bundle size                | Larger | Smaller     |

Axios phù hợp cho project lớn với requirements phức tạp! 🚀
