import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { calculateRefreshDelay, isTokenValid } from '../services/utils/jwtUtils.ts';
import { OpenAPI } from '../api-generated/backend';
import { useRefreshToken } from '../hooks/useRefreshToken.ts';

interface UserData {
  id: number;
  username: string;
  email: string;
  userCreatedAt: Date;
  userUpdatedAt: Date;
  userValidTo: Date;
  roles: string[];
  token: string;
}

interface AuthContextType {
  userData: UserData | null;
  isLoading: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { mutate: refreshToken } = useRefreshToken();

  //initial loading of authContext
  useEffect(() => {
    const initAuth = async () => {
      console.log('Loading AuthContext');
      const storedUserData = localStorage.getItem('coinChangeUserData');
      console.log(
        `Checking localStorage: ${storedUserData ? 'user data detected' : 'user data not detected'}`,
      );

      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData, (key, value) => {
          //conversion of date string values into Date format
          if (key === 'userCreatedAt' || key === 'userUpdatedAt' || key === 'userValidTo') {
            return new Date(value);
          }
          return value;
        });

        if (isTokenValid(parsedUserData.token)) {
          setUserData(parsedUserData);
          console.log('AuthContext: using valid userData from localStorage.');
        } else {
          console.log('AuthContext: userData in localStorage are no longer valid.');
          logout();
        }
      } else {
        console.log('AuthContext: no userData found in localStorage.');
      }
      console.log('AuthContext was loaded.');

      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = (userData: UserData) => {
    try {
      if (!isTokenValid(userData.token)) {
        console.log('AuthContext: invalid token detected during login.');
        throw new Error('INVALID_JWT_TOKEN');
      }

      localStorage.setItem(
        'coinChangeUserData',
        JSON.stringify({
          ...userData,
          userCreatedAt: userData.userCreatedAt.toISOString(),
          userUpdatedAt: userData.userUpdatedAt.toISOString(),
          userValidTo: userData.userValidTo.toISOString(),
        }).toString(),
      );

      // setting global states
      setUserData(userData);
      //saving token into openApi (to be used in calls requiring bearerAuth)
      OpenAPI.TOKEN = userData.token;

      console.log(`AuthContext: user ${userData.username} logged in.`);
    } catch (error) {
      console.error('AuthContext: Error in login function:', error);
    }
  };

  const logout = () => {
    console.log(`AuthContext: user ${userData?.username} logged out.`);

    localStorage.removeItem('coinChangeUserData');
    setUserData(null);
  };

  // refresh token funkcionality
  const scheduleTokenRefresh = useCallback(
    (token: string) => {
      const refreshDelay = calculateRefreshDelay(token);

      if (refreshDelay !== null) {
        console.log('Token refresh scheduled in:', Math.round(refreshDelay / 1000), 'seconds');

        return setTimeout(() => {
          refreshToken(undefined, {
            onSuccess: (newTokenData) => {
              const newUserData = {
                ...userData!,
                token: newTokenData.jwtToken,
              };
              login(newUserData);
            },
          });
        }, refreshDelay);
      }
      return null;
    },
    [userData, refreshToken, login, logout],
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null;

    if (userData?.token && isTokenValid(userData.token)) {
      timeoutId = scheduleTokenRefresh(userData.token);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [userData, scheduleTokenRefresh]);

  return (
    <AuthContext.Provider value={{ userData, isLoading, login, logout }}>
      {/*{isLoading ? <ModalLoaderBlocking isOpen /> : children}*/}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
