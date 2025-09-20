'use client';

import { useState, useEffect } from 'react';
import { getUserInfo, isTokenExpired, UserInfo, hasRole, hasAnyRole } from '@/lib/jwt-utils';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  roles: string[];
}

export function useAuth(): UseAuthReturn {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const info = getUserInfo();

        if (!info) {
          setUserInfo(null);
          setIsLoading(false);
          return;
        }

        if (isTokenExpired(info)) {
          setUserInfo(null);
          setIsLoading(false);
          return;
        }

        setUserInfo(info);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Vérifier périodiquement si le token est toujours valide
    const interval = setInterval(checkAuth, 60000); // Toutes les minutes

    return () => clearInterval(interval);
  }, []);

  const isAuthenticated = userInfo !== null && !isTokenExpired(userInfo);

  return {
    isAuthenticated,
    isLoading,
    user: userInfo,
    hasRole: (role: string) => userInfo ? hasRole(userInfo, role) : false,
    hasAnyRole: (roles: string[]) => userInfo ? hasAnyRole(userInfo, roles) : false,
    roles: userInfo?.roles || [],
  };
}