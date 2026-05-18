import { apiClient } from './client';
import type { ApiSuccessResponse, AuthResponse, User } from '@/types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient.post<ApiSuccessResponse<AuthResponse>>('/auth/register', data),

  login: (data: LoginPayload) =>
    apiClient.post<ApiSuccessResponse<AuthResponse>>('/auth/login', data),

  me: () => apiClient.get<ApiSuccessResponse<{ user: User }>>('/auth/me'),
};
