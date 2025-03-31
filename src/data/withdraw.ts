import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  WithdrawQueryOptions,
  GetParams,
  WithdrawPaginator,
  Withdraw,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { withdrawClient } from './client/withdraw';

export const useCreateWithdrawMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(withdrawClient.create, {
    onSuccess: () => {
      router.push(`/${router.query.shop}/withdraws`);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.WITHDRAWS);
    },
  });
};

export const useApproveWithdrawMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(withdrawClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.APPROVE_WITHDRAW);
    },
  });
};

export const useWithdrawQuery = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useQuery<Withdraw, Error>(
    [API_ENDPOINTS.WITHDRAWS, { id }],
    () => withdrawClient.get({ id })
  );

  return {
    withdraw: data,
    error,
    isLoading,
  };
};

export const useWithdrawsQuery = (
  params: Partial<WithdrawQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<WithdrawPaginator, Error>(
    [API_ENDPOINTS.WITHDRAWS, params],
    ({ queryKey, pageParam }) =>
      withdrawClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );

  return {
    withdraws: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
