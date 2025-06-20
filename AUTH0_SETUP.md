# Auth0 Setup Guide for Bluesky Integration

This guide will help you set up Auth0 authentication with popup support for your Bluesky application.

## Prerequisites

- An Auth0 account (free tier available at [auth0.com](https://auth0.com))
- Your React application running locally

## Step 1: Create an Auth0 Application

1. Go to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Click "Applications" in the left sidebar
3. Click "Create Application"
4. Choose "Single Page Application" as the application type
5. Click "Create"

## Step 2: Configure Your Auth0 Application

1. In your application settings, configure the following URLs:

   **Allowed Callback URLs:**
   ```
   http://localhost:5173,http://localhost:3000
   ```

   **Allowed Logout URLs:**
   ```
   http://localhost:5173,http://localhost:3000
   ```

   **Allowed Web Origins:**
   ```
   http://localhost:5173,http://localhost:3000
   ```

2. Save the changes

## Step 3: Get Your Auth0 Credentials

1. From your Auth0 application settings, copy:
   - **Domain** (e.g., `your-tenant.auth0.com`)
   - **Client ID** (a long string of characters)

## Step 4: Configure Your Environment Variables

1. Create a `.env` file in your project root
2. Add the following variables:

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://bsky.social
```

Replace the values with your actual Auth0 domain and client ID.

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Click the "Sign in with Auth0" button
3. A popup window should open with the Auth0 login page
4. Complete the authentication flow
5. You should be redirected back to your application and see your username

## Features

- **Popup Authentication**: Uses Auth0's popup mode for seamless authentication
- **Token Management**: Automatically handles access tokens and refresh tokens
- **Persistent Sessions**: Tokens are stored in localStorage for persistence across browser sessions
- **Error Handling**: Comprehensive error handling for authentication failures

## Troubleshooting

### Popup Blocked
If the popup is blocked by your browser:
1. Allow popups for your localhost domain
2. Make sure you're using HTTPS in production (popups work better with HTTPS)

### Authentication Errors
- Check that your Auth0 domain and client ID are correct
- Verify that your callback URLs are properly configured
- Ensure your Auth0 application is set to "Single Page Application" type

### Token Issues
- Check that the audience is correctly set to `https://bsky.social`
- Verify that your Auth0 application has the correct scopes configured

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive configuration
- Consider using Auth0's Rules and Actions for additional security
- Implement proper token validation on your backend if needed

## Next Steps

Once basic authentication is working, you can:
1. Customize the Auth0 login page branding
2. Add additional social login providers (Google, GitHub, etc.)
3. Implement role-based access control
4. Add multi-factor authentication
5. Set up Auth0 Rules for custom user metadata 