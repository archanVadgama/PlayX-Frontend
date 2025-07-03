/**
 * Authentication related types
 */
export interface LogInRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  username: string;
  password: string;
  displayName: string;
  mobileNumber: string;
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  password: string;
  confirmPassword: string;
}
