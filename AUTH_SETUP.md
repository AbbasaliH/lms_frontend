# Authentication Setup Guide

## Overview
This project uses a secure token-based authentication system with JWT tokens and automatic token refresh.

## Configuration

### 1. Environment Variables
The `.env.local` file has been configured with your API base URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://172.19.240.1:7777/api/v1
```

**Available endpoints:**
- Local: `http://localhost:7777/api/v1`
- Network: `http://172.19.240.1:7777/api/v1` (accessible from other devices on the network)

To switch between local and network access, update the `NEXT_PUBLIC_API_BASE_URL` in `.env.local`.

### 2. API Endpoints

#### Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Body**:
```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "role": "ADMIN",
      "fullName": "Admin",
      "phoneNumber": "1234567890"
    },
    "token": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

## Security Features

### 1. Secure Token Storage
- Tokens are stored in Zustand store with persistence to localStorage
- Automatic token refresh when access token expires
- Tokens are included in Authorization header for API requests

### 2. Protected Routes
The following routes are protected and require authentication:
- `/admin/*` - Admin dashboard
- `/super-admin/*` - Super admin dashboard
- `/dashboard/*` - User dashboard

### 3. Automatic Redirects
- Unauthenticated users accessing protected routes → redirected to `/auth`
- Authenticated users accessing `/auth` → redirected to their dashboard

## Usage

### Login
```tsx
import { useAuth } from '@/lib/hooks/use-auth';

function LoginForm() {
  const { login, isLoading } = useAuth();

  const handleLogin = () => {
    login({
      email: 'admin@example.com',
      password: 'Admin@123'
    });
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

### Logout
```tsx
import { useAuth } from '@/lib/hooks/use-auth';

function LogoutButton() {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
}
```

## Production Credentials

For testing the production API:
- **Email**: admin@example.com
- **Password**: Admin@123

## Development

### Running the Project
```bash
npm run dev
```

The application will be available at `http://localhost:3000`