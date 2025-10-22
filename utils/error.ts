import { ApiError } from '@/types';

export const parseApiError = (error: any): ApiError => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.data?.message) {
    return {
      code: 'API_ERROR',
      message: error.response.data.message,
    };
  }

  if (error.message) {
    return {
      code: 'NETWORK_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  };
};

export const getUserFriendlyMessage = (error: ApiError): string => {
  const messageMap: Record<string, string> = {
    'AUTH_INVALID_CREDENTIALS': 'Invalid email or password',
    'AUTH_USER_EXISTS': 'An account with this email already exists',
    'AUTH_TOKEN_EXPIRED': 'Your session has expired. Please log in again',
    'NETWORK_ERROR': 'Unable to connect. Please check your internet connection',
    'VALIDATION_ERROR': 'Please check your input and try again',
    'NOT_FOUND': 'The requested resource was not found',
    'SERVER_ERROR': 'Something went wrong on our end. Please try again later',
  };

  return messageMap[error.code] || error.message || 'An unexpected error occurred';
};
