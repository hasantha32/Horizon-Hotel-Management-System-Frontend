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

export const hotelClient = {
  ...crudFactory<Booking, any, BookingInput>(API_ENDPOINTS.HOTELS),
  get() {
    return HttpClient.get<Booking>(API_ENDPOINTS.HOTELS);
  },
  paginated: ({ user, ...params }: Partial<BookingQueryOptions>) => {
    return HttpClient.get<BookingPaginator>(API_ENDPOINTS.BOOKINGS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ user }),
    });
  },
  processBooking: (data: BookingInput) => {
    return HttpClient.post(`admin/process-booking`, data)
  },
  update: (data: any) => {
    return HttpClient.put(`${API_ENDPOINTS.HOTEL}/update`, data)
  }
};
