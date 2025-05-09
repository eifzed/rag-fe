// src/utils/auth.js

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  try {
    const payloadBase64 = token.split('.')[1];
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    );
    
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
      removeAuth()
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth verification failed:', error);
    localStorage.removeItem('token');
    return false;
  }
};

export const removeAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


export const getUserAuth = () => {
  return {
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user'),
  };
};

export const setUserAUth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user))
}