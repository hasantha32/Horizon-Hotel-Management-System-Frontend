import {
  StoreNotice,
  StoreNoticeInput,
  StoreNoticePaginator,
  StoreNoticeQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const storeNoticeClient = {
  ...crudFactory<StoreNotice, any, StoreNoticeInput>(
    API_ENDPOINTS.STORE_NOTICES
  ),
  all: ({
    notice,
    ...params
  }: Partial<StoreNoticeQueryOptions> = {}) =>
    HttpClient.get<StoreNoticePaginator>(API_ENDPOINTS.STORE_NOTICES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({
        notice,
        'users.id': params['users.id']
      }),
    }),
  get({ id, language }: { id: string; language: string }) {
    return HttpClient.get<StoreNotice>(`${API_ENDPOINTS.STORE_NOTICES}/${id}`, {
      language,
    });
  },
  paginated: ({
    notice,
    shops,
    ...params
  }: Partial<StoreNoticeQueryOptions>) => {
    return HttpClient.get<StoreNoticePaginator>(API_ENDPOINTS.STORE_NOTICES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ notice, shops, 'users.id': params['users.id'] }),
    });
  },

  toggle: (input: { id: string; language?: string }) =>
    HttpClient.post<any>(API_ENDPOINTS.STORE_NOTICES_IS_READ, input),

  getTypeList: ({ type }: { type: string }) =>
    HttpClient.get<any>(API_ENDPOINTS.STORE_NOTICE_GET_STORE_NOTICE_TYPE),
  getUserOrShopList: ({ type }: { type: string }) =>
    HttpClient.get<any>(API_ENDPOINTS.STORE_NOTICES_USER_OR_SHOP_LIST, type),
};
