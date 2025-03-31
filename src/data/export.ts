import { useQuery } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { exportClient } from '@/data/client/export';

export const useExportOrderQuery = (
  { shop_id }: { shop_id?: string },
  options: any = {}
) => {
  return useQuery<string, Error>(
    [API_ENDPOINTS.ORDER_EXPORT, { shop_id }],
    () => exportClient.exportOrder({ shop_id }),
    {
      ...options,
    }
  );
};
