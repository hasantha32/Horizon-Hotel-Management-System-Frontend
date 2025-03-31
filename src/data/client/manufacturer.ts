import { crudFactory } from '@/data/client/curd-factory';
import {
  CreateManufacturerInput,
  Manufacturer,
  ManufacturerPaginator,
  ManufacturerQueryOptions,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const manufacturerClient = {
  ...crudFactory<Manufacturer, QueryOptions, CreateManufacturerInput>(
    API_ENDPOINTS.MANUFACTURERS
  ),
  paginated: ({
    name,
    shop_id,
    ...params
  }: Partial<ManufacturerQueryOptions>) => {
    return HttpClient.get<ManufacturerPaginator>(API_ENDPOINTS.MANUFACTURERS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name, shop_id }),
    });
  },
};
