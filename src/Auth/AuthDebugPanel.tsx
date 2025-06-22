import { useBlueskyAuth } from "./BlueskyAuthProvider";
import { useAuthDebug } from "./useAuthDebug";

export const AuthDebugPanel = () => {
  const { user, token, isLoading, error } = useBlueskyAuth();
  const debugInfo = useAuthDebug();

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>Auth Debug Panel</strong></div>
      <div>User: {user ? `${user.displayName || user.username} (${user.did})` : 'null'}</div>
      <div>Token: {token ? 'Present' : 'Missing'}</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Error: {error || 'None'}</div>
      <div>Tab ID: {debugInfo.tabId}</div>
      <div>Token Expiry: {debugInfo.tokenExpiry || 'N/A'}</div>
      <div>Last Event: {debugInfo.lastAuthEvent || 'None'}</div>
      <div>Has User Data: {debugInfo.hasUserData ? 'Yes' : 'No'}</div>
    </div>
  );
}; 