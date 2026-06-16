import { api } from './client';
import type {
  Appointment,
  ListResponse,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '@shared/types';

export function getAppointments(date?: string): Promise<ListResponse<Appointment>> {
  const qs = date ? `?date=${encodeURIComponent(date)}` : '';
  return api.get<ListResponse<Appointment>>(`/appointments${qs}`);
}

export function createAppointment(body: CreateAppointmentRequest): Promise<Appointment> {
  return api.post<Appointment>('/appointments', body);
}

export function updateAppointment(
  id: string,
  body: UpdateAppointmentRequest,
): Promise<Appointment> {
  return api.put<Appointment>(`/appointments/${encodeURIComponent(id)}`, body);
}

export function deleteAppointment(id: string): Promise<{ ok: true }> {
  return api.delete<{ ok: true }>(`/appointments/${encodeURIComponent(id)}`);
}
