// src/utils/auth.js

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  try {
    const payloadBase64 = token.split('.')[1]; // Get the payload part
    const decodedPayload = JSON.parse(atob(payloadBase64)); // Decode from Base64
    
    if (!decodedPayload.exp) {
        throw new Error("JWT does not contain an 'exp' field.");
    }

    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
    return decodedPayload.exp < currentTime;
  } catch (error) {
      console.error("Invalid JWT:", error);
      return true; // Treat invalid tokens as expired
  }

};

export const checkAuthStatus = async () => {
  try {
    if (!isAuthenticated()) {
      return false;
    }

    if (isTokenExpired()) {
      console.log("removing token in checkAuthStatus")
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth verification failed:', error);
    localStorage.removeItem('token');
    return false;
  }
};