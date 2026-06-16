import { api } from './client';
import type {
  Owner,
  ListResponse,
  CreateOwnerRequest,
  UpdateOwnerRequest,
} from '@shared/types';

export function getOwners(search?: string): Promise<ListResponse<Owner>> {
  const qs = search ? `?q=${encodeURIComponent(search)}` : '';
  return api.get<ListResponse<Owner>>(`/owners${qs}`);
}

export function getOwner(id: string): Promise<Owner> {
  return api.get<Owner>(`/owners/${encodeURIComponent(id)}`);
}

export function createOwner(body: CreateOwnerRequest): Promise<Owner> {
  return api.post<Owner>('/owners', body);
}

export function updateOwner(id: string, body: UpdateOwnerRequest): Promise<Owner> {
  return api.put<Owner>(`/owners/${encodeURIComponent(id)}`, body);
}

export function deleteOwner(id: string): Promise<{ ok: true }> {
  return api.delete<{ ok: true }>(`/owners/${encodeURIComponent(id)}`);
}
