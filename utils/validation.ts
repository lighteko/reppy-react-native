export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  return { valid: true };
};

export const validateUsername = (username: string): { valid: boolean; message?: string } => {
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }

  if (username.length > 15) {
    return { valid: false, message: 'Username must be at most 15 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true };
};

export const validateWeight = (weight: number): boolean => {
  return weight > 0 && weight <= 1000;
};

export const validateHeight = (height: number): boolean => {
  return height > 0 && height <= 300;
};

export const validateReps = (reps: number): boolean => {
  return Number.isInteger(reps) && reps > 0 && reps <= 1000;
};
