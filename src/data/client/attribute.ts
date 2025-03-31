import { crudFactory } from '@/data/client/curd-factory';
import {
  Attribute,
  AttributePaginator,
  AttributeQueryOptions,
  CreateAttributeInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';
import { crudFactory_v2 } from './curd-factory_v2';
import { HttpClient_v2 } from './http-client_v2';

export const attributeClient = {
  ...crudFactory<Attribute, QueryOptions, CreateAttributeInput>(
    API_ENDPOINTS.ATTRIBUTES
  ),
  paginated: ({
    type,
    name,
    shop_id,
    ...params
  }: Partial<AttributeQueryOptions>) => {
    return HttpClient.get<AttributePaginator>(API_ENDPOINTS.ATTRIBUTES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name, shop_id }),
    });
  },
  all: ({ type, name, shop_id, ...params }: Partial<AttributeQueryOptions>) => {
    return HttpClient.get<Attribute[]>(API_ENDPOINTS.ATTRIBUTES, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name, shop_id }),
    });
  },
};

export const attributeClient_v2 = {
  ...crudFactory_v2<Attribute, QueryOptions, CreateAttributeInput>(
    API_ENDPOINTS.ATTRIBUTES_v2
  ),
  paginated: ({
    type,
    name,
    shop_id,
    ...params
  }: Partial<AttributeQueryOptions>) => {
    return HttpClient_v2.get<AttributePaginator>(API_ENDPOINTS.ATTRIBUTES_v2, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name, shop_id }),
    });
  },
  all: ({ type, name, shop_id, ...params }: Partial<AttributeQueryOptions>) => {
    return HttpClient_v2.get<Attribute[]>(API_ENDPOINTS.ATTRIBUTES_v2, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ type, name, shop_id }),
    });
  },
};
