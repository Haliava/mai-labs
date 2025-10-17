import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_admin: boolean;
  is_seller: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
}

export interface VerifyRegistrationData {
  email: string;
  otp: string;
}

export interface PasswordResetData {
  email: string;
}

export interface OTPResendData {
  email: string;
  purpose: 'registration' | 'password_reset' | 'email_change';
}

export const authApi = {
  register: async (data: RegisterData): Promise<{ message: string }> => {
    const response = await axios.post(`${API_URL}/accounts/register`, data);
    return response.data;
  },

  verifyRegistration: async (data: VerifyRegistrationData): Promise<{ message: string }> => {
    const response = await axios.patch(`${API_URL}/accounts/register/verify`, data);
    return response.data;
  },

  login: async (username: string, password: string): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/accounts/login`, formData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post(`${API_URL}/accounts/logout`);
  },

  resetPassword: async (data: PasswordResetData): Promise<{ message: string }> => {
    const response = await axios.post(`${API_URL}/accounts/reset-password`, data);
    return response.data;
  },

  resendOTP: async (data: OTPResendData): Promise<void> => {
    await axios.post(`${API_URL}/accounts/otp`, data);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/accounts/me`);
    return response.data.user;
  },

  updateCurrentUser: async (userData: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_URL}/accounts/me`, userData);
    return response.data.user;
  },

  getUser: async (userId: number): Promise<User> => {
    const response = await axios.get(`${API_URL}/accounts/${userId}`);
    return response.data.user;
  },
}; 