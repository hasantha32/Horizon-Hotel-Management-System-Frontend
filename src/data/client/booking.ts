import {
  Booking,
  BookingInput,
  BookingPaginator,
  BookingQueryOptions,
  Room,
  RoomInput,
  RoomPaginator,
  RoomQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const bookingClient = {
  ...crudFactory<Booking, any, BookingInput>(API_ENDPOINTS.BOOKINGS),
  get({ booking_number, language }: { booking_number: string; language: string }) {
    return HttpClient.get<Booking>(`${API_ENDPOINTS.BOOKINGS}/${booking_number}`, {
      language,
    });
  },
  paginated: ({ user, customer_name, ...params }: Partial<BookingQueryOptions>) => {
    return HttpClient.get<BookingPaginator>(API_ENDPOINTS.BOOKINGS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ user, customer_name }),
    });
  },
  myBookings: ({ user, ...params }: Partial<BookingQueryOptions>) => {
    return HttpClient.get<BookingPaginator>(`${API_ENDPOINTS.BOOKINGS}/my-bookings/`, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ user }),
    });
  },
  processBooking: (data: BookingInput) => {
    return HttpClient.post(`admin/process-booking`, data)
  },
  processBookingByCustomer: (data: BookingInput) => {
    return HttpClient.post(`customer/process-booking`, data)
  }
};
