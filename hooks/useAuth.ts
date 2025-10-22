import { useState } from 'react';
import { useUserStore } from '@/store';
import { authService, userService } from '@/services';
import { LoginRequest, SignupRequest } from '@/types';
import { parseApiError, getUserFriendlyMessage } from '@/utils';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuth, clearAuth, setProfile, isAuthenticated, profile } = useUserStore();

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);
      await setAuth(response.token, response.user.userId);

      const userProfile = await userService.getUserProfile(response.user.userId);
      setProfile(userProfile);

      return true;
    } catch (err: any) {
      const apiError = parseApiError(err);
      setError(getUserFriendlyMessage(apiError));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.signup(data);
      await setAuth(response.token, response.user.userId);

      const userProfile = await userService.getUserProfile(response.user.userId);
      setProfile(userProfile);

      return true;
    } catch (err: any) {
      const apiError = parseApiError(err);
      setError(getUserFriendlyMessage(apiError));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      await clearAuth();
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!profile?.userId) return;

    try {
      const userProfile = await userService.getUserProfile(profile.userId);
      setProfile(userProfile);
    } catch (err: any) {
      console.error('Error refreshing profile:', err);
    }
  };

  return {
    login,
    signup,
    logout,
    refreshProfile,
    loading,
    error,
    isAuthenticated,
    profile,
  };
};
