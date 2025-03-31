import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { Review, ReviewPaginator, ReviewQueryOptions } from '@/types';
import { reviewClient } from '@/data/client/review';

export const useAbuseReportMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  return useMutation(reviewClient.reportAbuse, {
    onSuccess: () => {
      toast.success(t('text-abuse-report-submitted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.refetchQueries(API_ENDPOINTS.REVIEWS);
      closeModal();
    },
  });
};

export const useDeclineReviewMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutation(reviewClient.decline, {
    onSuccess: () => {
      toast.success(t('successfully-decline'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.refetchQueries(API_ENDPOINTS.REVIEWS);
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(reviewClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REVIEWS);
    },
  });
};

export const useReviewQuery = (id: string) => {
  return useQuery<Review, Error>([API_ENDPOINTS.REVIEWS, id], () =>
    reviewClient.get({ id })
  );
};

export const useReviewsQuery = (
  params: Partial<ReviewQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuery<ReviewPaginator, Error>(
    [API_ENDPOINTS.REVIEWS, params],
    ({ queryKey, pageParam }) =>
      reviewClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      ...options,
    }
  );

  return {
    reviews: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
