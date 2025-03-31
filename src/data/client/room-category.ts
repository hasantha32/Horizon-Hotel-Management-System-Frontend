import {
  Coupon,
  CouponInput,
  CouponQueryOptions,
  RoomCategory,
  RoomCategoryInput,
  RoomCategoryPaginator,
  RoomCategoryQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const roomCategoryClient = {
  ...crudFactory<RoomCategory, any, RoomCategoryInput>(API_ENDPOINTS.ROOM_CATEGORIES),
  // get({ code, language }: { code: string; language: string }) {
  //   return HttpClient.get<RoomCategory>(`${API_ENDPOINTS.ROOM_CATEGORIES}/${code}`, {
  //     language,
  //   });
  // },
  paginated: ({ name, ...params }: Partial<RoomCategoryQueryOptions>) => {
    return HttpClient.get<RoomCategoryPaginator>(API_ENDPOINTS.ROOM_CATEGORIES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
