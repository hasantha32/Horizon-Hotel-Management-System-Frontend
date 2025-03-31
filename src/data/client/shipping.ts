import {
  Shipping,
  ShippingInput,
  QueryOptions,
  ShippingQueryOptions,
  ShippingPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from '@/data/client/http-client';

export const shippingClient = {
  ...crudFactory<Shipping, QueryOptions, ShippingInput>(
    API_ENDPOINTS.SHIPPINGS
  ),
  get({ id }: { id: string }) {
    return HttpClient.get<Shipping>(`${API_ENDPOINTS.SHIPPINGS}/${id}`);
  },
  paginated: ({ name, ...params }: Partial<ShippingQueryOptions>) => {
    return HttpClient.get<ShippingPaginator>(API_ENDPOINTS.SHIPPINGS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  all: ({ name, ...params }: Partial<ShippingQueryOptions>) => {
    return HttpClient.get<Shipping[]>(API_ENDPOINTS.SHIPPINGS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
