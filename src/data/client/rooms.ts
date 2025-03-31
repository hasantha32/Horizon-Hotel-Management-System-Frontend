import {
  Room,
  RoomInput,
  RoomPaginator,
  RoomQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const roomClient = {
  ...crudFactory<Room, any, RoomInput>(API_ENDPOINTS.ROOMS),
  get({ room_number, language }: { room_number: string; language: string }) {
    return HttpClient.get<Room>(`${API_ENDPOINTS.ROOMS}/${room_number}`, {
      language,
    });
  },
  paginated: ({ room_number, category, ...params }: Partial<RoomQueryOptions>) => {
    return HttpClient.get<RoomPaginator>(API_ENDPOINTS.ROOMS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ room_number, category }),
    });
  },
};
