import type {
  QueryOptions,
  Order,
  CreateOrderInput,
  OrderQueryOptions,
  OrderPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const refundClient = {
  ...crudFactory<Order, QueryOptions, CreateOrderInput>(API_ENDPOINTS.REFUNDS),
  get({ id }: { id: string }) {
    return HttpClient.get<Order>(`${API_ENDPOINTS.REFUNDS}/${id}`);
  },
  paginated: ({
    type,
    name,
    shop_id,
    refund_reason,
    ...params
  }: Partial<OrderQueryOptions>) => {
    return HttpClient.get<OrderPaginator>(API_ENDPOINTS.REFUNDS, {
      searchJoin: 'and',
      shop_id,
      with: 'order;customer;refund_policy',
      ...params,
      search: HttpClient.formatSearchParams({ type, name, shop_id, refund_reason }),
    });
  },
};
