# Authentication Setup

## Overview
The application now has a complete authentication system that automatically redirects users to the login page when they're not authenticated.

## How it works

### 1. Authentication Context (`contexts/AuthContext.js`)
- Manages user authentication state across the application
- Provides `login`, `logout`, and `checkAuth` functions
- Automatically checks authentication status on app load

### 2. Protected Routes
- The `index.js` page automatically redirects to `/login` if user is not authenticated, or to `/accueil` if authenticated
- The `NavBar` component is hidden on the login page
- All protected pages should be wrapped with the `ProtectedRoute` component

### 3. API Endpoints
- `/api/auth/login` - Handles user login
- `/api/auth/logout` - Handles user logout
- `/api/auth/check` - Verifies authentication status

### 4. Backend Integration
- The backend provides `/auth/verify` endpoint to validate tokens
- Login returns both token and user data
- JWT tokens are stored in HTTP-only cookies for security

## Usage

### For Protected Pages
Wrap your page content with the `ProtectedRoute` component:

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Your protected content here</div>
    </ProtectedRoute>
  );
}
```

### For Authentication State
Use the `useAuth` hook in any component:

```jsx
import { useAuth } from '../contexts/AuthContext';

export default function MyComponent() {
  const { user, login, logout } = useAuth();
  
  // Access user data, login/logout functions
}
```

## Testing
1. Start the backend server (port 4000)
2. Start the frontend server (port 3000)
3. Visit `http://localhost:3000`
4. You should be automatically redirected to the login page
5. After successful login, you'll be redirected to the accueil page (dashboard)

## Notes
- The authentication system uses HTTP-only cookies for security
- Tokens expire after 1 hour
- The NavBar is automatically hidden on the login page
- Loading spinners are shown while checking authentication status 