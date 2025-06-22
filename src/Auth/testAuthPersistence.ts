// Test utility for authentication persistence
export const testAuthPersistence = () => {
  console.log("=== TESTING AUTH PERSISTENCE ===");
  
  // Check localStorage
  const accessToken = localStorage.getItem("bluesky-access-token");
  const refreshToken = localStorage.getItem("bluesky-refresh-token");
  const userData = localStorage.getItem("bluesky-user-data");
  
  console.log("Access Token:", accessToken ? "Present" : "Missing");
  console.log("Refresh Token:", refreshToken ? "Present" : "Missing");
  console.log("User Data:", userData ? JSON.parse(userData) : "Missing");
  
  // Test token decoding
  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = new Date(payload.exp * 1000);
      const currentTime = new Date();
      const isExpired = currentTime >= expirationTime;
      
      console.log("Token Payload:", payload);
      console.log("Token Expires:", expirationTime.toLocaleString());
      console.log("Current Time:", currentTime.toLocaleString());
      console.log("Is Expired:", isExpired);
    } catch (err) {
      console.log("Failed to decode token:", err);
    }
  }
  
  console.log("=== END TEST ===");
};

// Function to simulate a page reload
export const simulateReload = () => {
  console.log("Simulating page reload...");
  testAuthPersistence();
};

// Function to clear all auth data
export const clearAllAuthData = () => {
  localStorage.removeItem("bluesky-access-token");
  localStorage.removeItem("bluesky-refresh-token");
  localStorage.removeItem("bluesky-user-data");
  localStorage.removeItem("bluesky-auth-event");
  console.log("All auth data cleared");
}; 