import {
  FAQs,
  FAQsInput,
  FAQsQueryOptions,
  FAQsPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const faqsClient = {
  ...crudFactory<FAQs, any, FAQsInput>(API_ENDPOINTS.FAQS),
  all: ({ faq_title, shop_id, ...params }: Partial<FAQsQueryOptions> = {}) =>
    HttpClient.get<FAQsPaginator>(API_ENDPOINTS.FAQS, {
      searchJoin: 'and',
      shop_id: shop_id,
      ...params,
      search: HttpClient.formatSearchParams({
        faq_title,
        shop_id,
      }),
    }),
  get({ id, language }: { id: string; language: string }) {
    return HttpClient.get<FAQs>(`${API_ENDPOINTS.FAQS}/${id}`, {
      language,
    });
  },
  paginated: ({ faq_title, shop_id, ...params }: Partial<FAQsQueryOptions>) => {
    return HttpClient.get<FAQsPaginator>(API_ENDPOINTS.FAQS, {
      searchJoin: 'and',
      shop_id: shop_id,
      ...params,
      search: HttpClient.formatSearchParams({ faq_title, shop_id }),
    });
  },
};
