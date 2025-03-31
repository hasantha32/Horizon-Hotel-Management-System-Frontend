import {
  Category,
  CategoryPaginator,
  CategoryQueryOptions,
  CreateCategoryInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
import { crudFactory_v2 } from './curd-factory_v2';
import { HttpClient_v2 } from './http-client_v2';

export const categoryClient = {
  ...crudFactory<Category, QueryOptions, CreateCategoryInput>(
    API_ENDPOINTS.CATEGORIES
  ),
  paginated: ({ type, name, self, ...params }: Partial<CategoryQueryOptions>) => {
    return HttpClient.get<CategoryPaginator>(API_ENDPOINTS.CATEGORIES, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};

export const categoryClient_v2 = {
  ...crudFactory_v2<Category, QueryOptions, CreateCategoryInput>(
    API_ENDPOINTS.CATEGORIES_v2
  ),
  paginated: ({ type, name, self, ...params }: Partial<CategoryQueryOptions>) => {
    return HttpClient_v2.get<CategoryPaginator>(API_ENDPOINTS.CATEGORIES_v2, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
