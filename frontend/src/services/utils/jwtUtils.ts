import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  //note - jwt claims has standardized naming which needs to be used
  jti: string; // token ID (in my case it is user id)
  iat: number; // issued at time (timestamp in seconds)
  exp: number; // expiration time (timestamp v seconds)
}

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime && decoded.iat <= currentTime;
  } catch (error) {
    console.error('isTokenValid: error during token validation. Error message: ' + error);
    return false;
  }
};

/**
 * Function to calculate delay for performing token refresh (in milliseconds). Token should be refreshed 5 minutes before its expiration time.
 **/
export const calculateRefreshDelay = (token: string): number | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const expiresAt = decoded.exp * 1000;
    const now = Date.now();
    const fiveMinutesBeforeExpiry = expiresAt - 5 * 60 * 1000;

    return fiveMinutesBeforeExpiry > now ? fiveMinutesBeforeExpiry - now : null;
  } catch (error) {
    console.error('calculateRefreshDelay error:', error);
    return null;
  }
};
