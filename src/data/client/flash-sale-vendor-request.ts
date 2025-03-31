import {
  FlashSaleProductsRequestPaginator,
  FlashSaleProductsRequestQueryOptions,
  FlashSaleProductsRequest,
  FlashSaleProductsRequestInput,
  ProductQueryOptions,
  ProductPaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const flashSaleVendorRequestClient = {
  ...crudFactory<FlashSaleProductsRequest, any, FlashSaleProductsRequestInput>(
    API_ENDPOINTS.REQUEST_LISTS_FOR_FLASH_SALE,
  ),
  all: ({
    title,
    shop_id,
    ...params
  }: Partial<FlashSaleProductsRequestQueryOptions> = {}) =>
    HttpClient.get<FlashSaleProductsRequestPaginator>(
      API_ENDPOINTS.REQUEST_LISTS_FOR_FLASH_SALE,
      {
        searchJoin: 'and',
        shop_id: shop_id,
        ...params,
        search: HttpClient.formatSearchParams({
          title,
          shop_id,
        }),
      },
    ),
  get({
    id,
    language,
    shop_id,
  }: {
    id: string;
    language: string;
    shop_id?: string;
  }) {
    return HttpClient.get<FlashSaleProductsRequest>(
      `${API_ENDPOINTS.REQUEST_LISTS_FOR_FLASH_SALE}/${id}`,
      {
        language,
        shop_id,
        id,
        with: 'flash_sale;products',
      },
    );
  },
  paginated: ({
    title,
    shop_id,
    ...params
  }: Partial<FlashSaleProductsRequestQueryOptions>) => {
    return HttpClient.get<FlashSaleProductsRequestPaginator>(
      API_ENDPOINTS.REQUEST_LISTS_FOR_FLASH_SALE,
      {
        searchJoin: 'and',
        shop_id: shop_id,
        // with: ''
        ...params,
        search: HttpClient.formatSearchParams({ title, shop_id }),
      },
    );
  },
  approve: (id: { id: string }) => {
    return HttpClient.post<{ id: string }>(
      API_ENDPOINTS.APPROVE_FLASH_SALE_REQUESTED_PRODUCTS,
      id,
    );
  },
  disapprove: (id: { id: string }) => {
    return HttpClient.post<{ id: string }>(
      API_ENDPOINTS.DISAPPROVE_FLASH_SALE_REQUESTED_PRODUCTS,
      id,
    );
  },
  requestedProducts({ name, ...params }: Partial<ProductQueryOptions>) {
    return HttpClient.get<ProductPaginator>(
      API_ENDPOINTS.REQUESTED_PRODUCTS_FOR_FLASH_SALE,
      {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({ name }),
      },
    );
  },
};
