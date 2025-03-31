import {
  Booking,
  BookingInput,
  BookingItem,
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

export const bookingItemClient = {
  ...crudFactory<BookingItem, any, BookingInput>(API_ENDPOINTS.BOOKING_ITEMS),
  get({ booking_number, language }: { booking_number: string; language: string }) {
    return HttpClient.get<Booking>(`${API_ENDPOINTS.BOOKING_ITEMS}/${booking_number}`, {
      language,
    });
  },
  paginated: ({ user, ...params }: Partial<BookingQueryOptions>) => {
    return HttpClient.get<BookingPaginator>(API_ENDPOINTS.BOOKINGS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ user }),
    });
  },
};
