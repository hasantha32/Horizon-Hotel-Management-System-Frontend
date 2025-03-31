import {
  QueryOptions,
  TermsAndConditions,
  TermsAndConditionsInput,
  TermsAndConditionsQueryOptions,
  TermsAndConditionsPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const termsAndConditionClients = {
  ...crudFactory<TermsAndConditions, QueryOptions, TermsAndConditionsInput>(
    API_ENDPOINTS.TERMS_AND_CONDITIONS
  ),
  paginated: ({
    title,
    shop_id,
    ...params
  }: Partial<TermsAndConditionsQueryOptions>) => {
    return HttpClient.get<TermsAndConditionsPaginator>(
      API_ENDPOINTS.TERMS_AND_CONDITIONS,
      {
        searchJoin: 'and',
        shop_id: shop_id,
        ...params,
        search: HttpClient.formatSearchParams({ title, shop_id }),
      }
    );
  },
  approve: (variables: { id: string }) => {
    return HttpClient.post<any>(API_ENDPOINTS.APPROVE_TERMS_AND_CONDITIONS, variables);
  },
  disapprove: (variables: { id: string }) => {
    return HttpClient.post<{ id: string }>(
      API_ENDPOINTS.DISAPPROVE_TERMS_AND_CONDITIONS,
      variables
    );
  },
};
