import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Order, OrderPaginator, OrderQueryOptions } from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { refundClient } from '@/data/client/refund';

export const useUpdateRefundMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(refundClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REFUNDS);
    },
  });
};

export const useRefundQuery = (id: string) => {
  return useQuery<Order, Error>([API_ENDPOINTS.REFUNDS, id], () =>
    refundClient.get({ id })
  );
};

export const useRefundsQuery = (
  params: Partial<OrderQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<OrderPaginator, Error>(
    [API_ENDPOINTS.REFUNDS, params],
    ({ queryKey, pageParam }) =>
      refundClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );

  return {
    data: data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
