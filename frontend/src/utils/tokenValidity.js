import { jwtDecode } from 'jwt-decode';
export const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded)
      const currentTime = Date.now() / 1000; // Current time in seconds
  
      if (decoded.exp > currentTime) {
        // Return the token's validity and update fields from the token payload
        return {
          valid: true,
          user: {email:decoded?.email, userID: decoded?.userId} || null, // Extract user from the token payload
          
        };
      } else {
        localStorage.removeItem('token');
        return {
          valid: false,
          user: null,
        };
      }
    } catch (error) {
      return {
        valid: false,
        user: null,
      };
    }
  };
  
  