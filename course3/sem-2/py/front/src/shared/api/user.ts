import { BASE_API_URL } from "../consts/api"
import { User } from "../types/entity"

export type RegisterResponse = {
  email: string;
  message: string;
}

export type RegisterVerifyResponse = {
  access_token: string;
  message: string;
}

export type LoginResponse = {
  access_token: string;
  token_type: string;
}

export const register = (user: { email: string; password: string; password_confirm: string }): Promise<RegisterResponse> => {
  return fetch(`${BASE_API_URL}/accounts/register`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(user),
  }).then(res => res.json());
}

export const verifyRegistration = (email: string, otp: string): Promise<RegisterVerifyResponse> => {
  return fetch(`${BASE_API_URL}/accounts/register/verify`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify({ email, otp }),
  }).then(res => res.json());
}

export const login = (email: string, password: string): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  return fetch(`${BASE_API_URL}/accounts/login`, {
    method: 'POST',
    body: formData,
  }).then(res => res.json());
}

export const logout = (token: string): Promise<void> => {
  return fetch(`${BASE_API_URL}/accounts/logout`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    method: 'POST',
  }).then(() => {});
}

export const getCurrentUser = (token: string): Promise<{ user: User }> => {
  return fetch(`${BASE_API_URL}/accounts/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    method: 'GET',
  }).then(res => res.json());
}