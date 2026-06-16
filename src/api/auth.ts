import { api } from './client';
import type { LoginRequest, LoginResponse, AuthUser } from '@shared/types';

export function login(body: LoginRequest): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/login', body);
}

export function getMe(): Promise<AuthUser> {
  return api.get<AuthUser>('/auth/me');
}
