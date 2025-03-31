import {
  CreateRefundPolicyInput,
  QueryOptions,
  RefundPolicy,
  RefundPolicyPaginator,
  RefundPolicyQueryOptions
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const RefundPolicyClient = {
  ...crudFactory<RefundPolicy, QueryOptions, CreateRefundPolicyInput>(
    API_ENDPOINTS.REFUND_POLICIES
  ),
  paginated: ({
    target,
    title,
    status,
    ...params
  }: Partial<RefundPolicyQueryOptions>) => {
    return HttpClient.get<RefundPolicyPaginator>(API_ENDPOINTS.REFUND_POLICIES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ title, target, status }),
    });
  },
};
