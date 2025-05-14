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
