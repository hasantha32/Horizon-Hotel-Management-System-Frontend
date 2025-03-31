import {
  FlashSale,
  FlashSaleInput,
  FlashSaleQueryOptions,
  FlashSalePaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const flashSaleClient = {
  ...crudFactory<FlashSale, any, FlashSaleInput>(API_ENDPOINTS.FLASH_SALE),
  all: ({ title, shop_id, ...params }: Partial<FlashSaleQueryOptions> = {}) =>
    HttpClient.get<FlashSalePaginator>(API_ENDPOINTS.FLASH_SALE, {
      searchJoin: 'and',
      shop_id: shop_id,
      ...params,
      search: HttpClient.formatSearchParams({
        title,
        shop_id,
      }),
    }),
  get({
    slug,
    language,
    shop_id,
  }: {
    slug: string;
    language: string;
    shop_id?: string;
  }) {
    return HttpClient.get<FlashSale>(`${API_ENDPOINTS.FLASH_SALE}/${slug}`, {
      language,
      shop_id,
      slug,
      with: 'products',
    });
  },
  paginated: ({
    title,
    shop_id,
    ...params
  }: Partial<FlashSaleQueryOptions>) => {
    return HttpClient.get<FlashSalePaginator>(API_ENDPOINTS.FLASH_SALE, {
      searchJoin: 'and',
      shop_id: shop_id,
      // with: ''
      ...params,
      search: HttpClient.formatSearchParams({ title, shop_id }),
    });
  },
  approve: (variables: { variables: string }) => {
    return HttpClient.post<any>(API_ENDPOINTS.FLASH_SALE, variables);
  },
  disapprove: (variables: { variables: string }) => {
    return HttpClient.post<{ id: string }>(API_ENDPOINTS.FLASH_SALE, variables);
  },
  getFlashSaleInfoByProductID({
    id,
    language,
  }: {
    id: string;
    language: string;
  }) {
    return HttpClient.get<FlashSale>(API_ENDPOINTS.PRODUCT_FLASH_SALE_INFO, {
      searchJoin: 'and',
      id,
      language,
      with: 'flash_sales',
    });
  },
};
