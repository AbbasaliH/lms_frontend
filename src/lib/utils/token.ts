// Token utility functions

export const tokenUtils = {
  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Treat as expired if there's an error
    }
  },

  // Get token expiration time
  getTokenExpiration: (token: string): Date | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  },

  // Decode token payload
  decodeToken: (token: string): Record<string, unknown> | null => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },
};