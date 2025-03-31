import {
  CreateRefundReasonInput,
  QueryOptions,
  RefundReason,
  RefundReasonPaginator,
  RefundReasonQueryOptions
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const RefundReasonClient = {
  ...crudFactory<RefundReason, QueryOptions, CreateRefundReasonInput>(
    API_ENDPOINTS.REFUND_REASONS
  ),
  paginated: ({
    name,
    ...params
  }: Partial<RefundReasonQueryOptions>) => {
    return HttpClient.get<RefundReasonPaginator>(API_ENDPOINTS.REFUND_REASONS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
