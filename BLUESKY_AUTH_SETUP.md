# Bluesky Authentication Setup

This guide explains the new Bluesky authentication system that replaces Auth0 with direct Bluesky API integration.

## Overview

The new authentication system uses Bluesky's native ATProto API for authentication, eliminating the need for third-party identity providers like Auth0. This provides:

- **Direct Bluesky Integration**: Authenticate directly with Bluesky using handles and app passwords
- **No Third-Party Dependencies**: No external auth providers or costs
- **Full Control**: Complete control over the authentication flow and user experience
- **Better Performance**: Faster authentication without external redirects
- **Cost Effective**: No per-user charges or monthly fees

## How It Works

### Authentication Flow
1. User enters their Bluesky handle (e.g., `alice.bsky.social`) and app password
2. System calls Bluesky's `com.atproto.server.createSession` endpoint
3. Bluesky returns access and refresh tokens
4. Tokens are stored securely in localStorage
5. User profile is fetched and displayed

### Token Management
- **Access Token**: Used for API calls, automatically refreshed when needed
- **Refresh Token**: Used to get new access tokens when they expire
- **Automatic Refresh**: System automatically refreshes tokens in the background
- **Secure Storage**: Tokens stored in localStorage with proper error handling

## Features

### ✅ What's Included
- **Direct Bluesky Login**: Authenticate with handle/email + app password
- **Token Management**: Automatic token refresh and storage
- **User Profile**: Fetch and display user's display name and avatar
- **Session Persistence**: Stay logged in across browser sessions
- **Error Handling**: Comprehensive error messages and recovery
- **Loading States**: Proper loading indicators during authentication
- **Modern UI**: Beautiful, responsive login modal
- **TypeScript Support**: Full type safety throughout

### 🔧 Technical Features
- **JWT Decoding**: Extract user info from Bluesky JWT tokens
- **Profile Fetching**: Get full user profile data after login
- **Session Restoration**: Automatically restore sessions on page load
- **Error Recovery**: Handle network errors and invalid tokens gracefully
- **React Hooks**: Clean, composable authentication hooks

## Usage

### Basic Authentication
```tsx
import { useBlueskyAuth } from './Auth/BlueskyAuthProvider';

function MyComponent() {
  const { user, login, logout, isLoading } = useBlueskyAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (user) {
    return (
      <div>
        <p>Welcome, {user.displayName || user.username}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
  
  return <button onClick={() => setShowLogin(true)}>Login</button>;
}
```

### Login Modal
```tsx
import BlueskyLoginModal from './Auth/BlueskyLoginModal';

function LoginButton() {
  const [showLogin, setShowLogin] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowLogin(true)}>Sign in to Bluesky</button>
      {showLogin && <BlueskyLoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
```

## API Endpoints Used

### Authentication
- `POST https://bsky.social/xrpc/com.atproto.server.createSession`
  - Creates a new session with handle/email and app password
  - Returns access and refresh tokens

### Token Refresh
- `POST https://bsky.social/xrpc/com.atproto.server.refreshSession`
  - Refreshes access token using refresh token
  - Called automatically when access token expires

### User Profile
- `GET https://bsky.social/xrpc/app.bsky.actor.getProfile?actor={did}`
  - Fetches user's full profile information
  - Includes display name, avatar, and other profile data

## Security Considerations

### Token Storage
- Tokens are stored in localStorage for persistence
- Access tokens are automatically refreshed before expiration
- Invalid tokens trigger automatic logout

### App Passwords
- Users must create app passwords in their Bluesky settings
- App passwords are more secure than main account passwords
- Link provided to Bluesky app password settings

### Error Handling
- Network errors are caught and displayed to users
- Invalid credentials show clear error messages
- Session restoration handles corrupted tokens gracefully

## Migration from Auth0

### What Changed
- Removed Auth0 dependencies (`@auth0/auth0-react`, `@auth0/auth0-spa-js`)
- Replaced Auth0 provider with `BlueskyAuthProvider`
- Updated login modal to use Bluesky credentials
- Simplified authentication flow

### Benefits
- **No External Dependencies**: No more Auth0 configuration or costs
- **Direct Integration**: Authenticate directly with Bluesky
- **Better Performance**: Faster login without external redirects
- **Full Control**: Complete control over authentication UX
- **Cost Savings**: No per-user charges or monthly fees

## Troubleshooting

### Common Issues

#### "Invalid identifier or password"
- Ensure user is using their Bluesky handle (e.g., `alice.bsky.social`) or email
- Verify they're using an app password, not their main account password
- Direct them to [Bluesky App Passwords](https://bsky.app/settings/app-passwords)

#### "Network error"
- Check internet connection
- Verify Bluesky API is accessible
- Try refreshing the page

#### "Session expired"
- Tokens automatically refresh in the background
- If refresh fails, user will be logged out and can log in again
- This is normal behavior for security

### Debug Mode
Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('debug', 'bluesky-auth');
```

## Future Enhancements

### Potential Features
- **Social Login**: Add support for Google, GitHub, etc. (if needed)
- **Multi-Factor Authentication**: Support for Bluesky MFA
- **Session Management**: Advanced session controls
- **Offline Support**: Cache user data for offline use
- **Analytics**: Track authentication events

### Integration Possibilities
- **Backend Integration**: Connect to your own backend for additional features
- **User Management**: Store additional user data in your database
- **Role-Based Access**: Implement custom authorization logic
- **Audit Logging**: Track authentication events for security

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Bluesky API documentation
3. Check the browser console for error messages
4. Verify your Bluesky credentials are correct

## References

- [Bluesky ATProto Documentation](https://atproto.com/)
- [Bluesky App Passwords](https://bsky.app/settings/app-passwords)
- [ATProto Lexicons](https://atproto.com/lexicons/)
- [Bluesky API Reference](https://atproto.com/lexicons/com-atproto-server) 