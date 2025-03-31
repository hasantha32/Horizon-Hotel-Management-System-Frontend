import {
  Withdraw,
  WithdrawPaginator,
  WithdrawQueryOptions,
  CreateWithdrawInput,
  QueryOptions,
  ApproveWithdrawInput,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const withdrawClient = {
  ...crudFactory<Withdraw, QueryOptions, CreateWithdrawInput>(
    API_ENDPOINTS.WITHDRAWS
  ),
  get({ id }: { id: string }) {
    return HttpClient.get<Withdraw>(`${API_ENDPOINTS.WITHDRAWS}/${id}`);
  },
  paginated: ({ shop_id, ...params }: Partial<WithdrawQueryOptions>) => {
    return HttpClient.get<WithdrawPaginator>(API_ENDPOINTS.WITHDRAWS, {
      shop_id,
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ shop_id }),
    });
  },
  approve(data: ApproveWithdrawInput) {
    return HttpClient.post<Withdraw>(API_ENDPOINTS.APPROVE_WITHDRAW, data);
  },
};
