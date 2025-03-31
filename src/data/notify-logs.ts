import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { NotifyLogsPaginator, NotifyLogsQueryOptions } from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Config } from '@/config';
import { notifyClient } from '@/data/client/notify-logs';

// get all by receiver ID
export const useNotifyLogsQuery = (
  params: Partial<NotifyLogsQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<NotifyLogsPaginator, Error>(
    [API_ENDPOINTS.NOTIFY_LOGS, params],
    ({ queryKey, pageParam }) =>
      notifyClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    notifyLogs: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

// delete
export const useDeleteNotifyLogMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(notifyClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.NOTIFY_LOGS);
    },
  });
};

export const useNotifyLogReadMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(notifyClient.notifyLogSeen, {
    onSuccess: async () => {},
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.NOTIFY_LOG_SEEN);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useNotifyLogAllReadMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutation(notifyClient.readAllNotifyLogs, {
    onSuccess: () => {},
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.READ_ALL_NOTIFY_LOG);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};
