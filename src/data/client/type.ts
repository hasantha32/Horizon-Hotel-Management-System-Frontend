import { crudFactory } from '@/data/client/curd-factory';
import { CreateTypeInput, QueryOptions, Type, TypeQueryOptions } from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';
import { HttpClient_v2 } from './http-client_v2';

export const typeClient = {
  ...crudFactory<Type, QueryOptions, CreateTypeInput>(API_ENDPOINTS.TYPES),
  all: ({ name, ...params }: Partial<TypeQueryOptions>) => {
    return HttpClient.get<Type[]>(API_ENDPOINTS.TYPES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};

export const typeClient_v2 = {
  ...crudFactory<Type, QueryOptions, CreateTypeInput>(API_ENDPOINTS.TYPES_v2),
  all: ({ name, ...params }: Partial<TypeQueryOptions>) => {
    return HttpClient_v2.get<Type[]>(API_ENDPOINTS.TYPES_v2, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
