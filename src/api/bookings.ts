import { api } from './client';
import type { Booking, ListResponse, UpdateBookingRequest } from '@shared/types';

export function getBookings(): Promise<ListResponse<Booking>> {
  return api.get<ListResponse<Booking>>('/bookings');
}

export function updateBooking(id: string, body: UpdateBookingRequest): Promise<Booking> {
  return api.put<Booking>(`/bookings/${encodeURIComponent(id)}`, body);
}
