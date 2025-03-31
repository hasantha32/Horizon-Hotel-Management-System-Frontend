import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const exportClient = {
  exportOrder: ({ shop_id }: { shop_id?: string }) => {
    const url = shop_id
      ? `${API_ENDPOINTS.ORDER_EXPORT}/${shop_id}`
      : API_ENDPOINTS.ORDER_EXPORT;

    return HttpClient.get<string>(url);
  },
};
