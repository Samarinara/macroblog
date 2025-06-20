// Auth0 Configuration
// Replace these values with your actual Auth0 domain and client ID
// You can get these from your Auth0 dashboard

export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || "your-domain.auth0.com",
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "your-client-id",
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || "https://bsky.social",
    scope: "openid profile email"
  },
  cacheLocation: "localstorage" as const,
  useRefreshTokens: true
};

// Instructions for setup:
// 1. Create an Auth0 account at https://auth0.com
// 2. Create a new Single Page Application
// 3. Set the Allowed Callback URLs to: http://localhost:5173, http://localhost:3000
// 4. Set the Allowed Logout URLs to: http://localhost:5173, http://localhost:3000
// 5. Set the Allowed Web Origins to: http://localhost:5173, http://localhost:3000
// 6. Copy your Domain and Client ID from the Auth0 dashboard
// 7. Create a .env file in your project root with:
//    VITE_AUTH0_DOMAIN=your-domain.auth0.com
//    VITE_AUTH0_CLIENT_ID=your-client-id 