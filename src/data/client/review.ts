import type {
  QueryOptions,
  Review,
  CreateAbuseReportInput,
  ReviewPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
import { ReviewQueryOptions } from '@/types';

interface InputType {
  model_id: number;
  model_type: string;
}

export const reviewClient = {
  ...crudFactory<Review, QueryOptions, CreateAbuseReportInput>(
    API_ENDPOINTS.REVIEWS
  ),
  reportAbuse: (data: CreateAbuseReportInput) => {
    return HttpClient.post<Review>(API_ENDPOINTS.ABUSIVE_REPORTS, data);
  },
  decline: (data: InputType) => {
    return HttpClient.post<Review>(API_ENDPOINTS.ABUSIVE_REPORTS_DECLINE, data);
  },
  get({ id }: { id: string }) {
    return HttpClient.get<Review>(`${API_ENDPOINTS.REVIEWS}/${id}`, {
      with: 'abusive_reports.user;product;user',
    });
  },
  paginated: ({ type, shop_id, ...params }: Partial<ReviewQueryOptions>) => {
    return HttpClient.get<ReviewPaginator>(API_ENDPOINTS.REVIEWS, {
      searchJoin: 'and',
      with: 'product;user',
      ...params,
      search: HttpClient.formatSearchParams({ type, shop_id }),
    });
  },
};
