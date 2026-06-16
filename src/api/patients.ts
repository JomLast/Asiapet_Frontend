import { api } from './client';
import type {
  Patient,
  Visit,
  ListResponse,
  CreatePatientRequest,
  UpdatePatientRequest,
} from '@shared/types';

export function getPatients(search?: string): Promise<ListResponse<Patient>> {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  return api.get<ListResponse<Patient>>(`/patients${qs}`);
}

export function getPatient(hn: string): Promise<Patient> {
  return api.get<Patient>(`/patients/${encodeURIComponent(hn)}`);
}

export function createPatient(body: CreatePatientRequest): Promise<Patient> {
  return api.post<Patient>('/patients', body);
}

export function updatePatient(hn: string, body: UpdatePatientRequest): Promise<Patient> {
  return api.put<Patient>(`/patients/${encodeURIComponent(hn)}`, body);
}

export function deletePatient(hn: string): Promise<{ ok: true }> {
  return api.delete<{ ok: true }>(`/patients/${encodeURIComponent(hn)}`);
}

export function getVisits(hn: string): Promise<ListResponse<Visit>> {
  return api.get<ListResponse<Visit>>(`/patients/${encodeURIComponent(hn)}/visits`);
}

export function createVisit(hn: string, body: Visit): Promise<Visit> {
  return api.post<Visit>(`/patients/${encodeURIComponent(hn)}/visits`, body);
}

export function updateVisit(hn: string, date: string, body: Visit): Promise<Visit> {
  return api.put<Visit>(
    `/patients/${encodeURIComponent(hn)}/visits/${encodeURIComponent(date)}`,
    body,
  );
}
