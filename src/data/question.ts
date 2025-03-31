import { useQuery } from 'react-query';
import { mapPaginatorData } from '@/utils/data-mappers';
import { API_ENDPOINTS } from './client/api-endpoints';
import { QuestionPaginator, QuestionQueryOptions } from '@/types';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { questionClient } from '@/data/client/question';

export const useQuestionsQuery = (options: Partial<QuestionQueryOptions>) => {
  const { data, error, isLoading } = useQuery<QuestionPaginator, Error>(
    [API_ENDPOINTS.QUESTIONS, options],
    ({ queryKey, pageParam }) =>
      questionClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    questions: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useReplyQuestionMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(questionClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.QUESTIONS);
    },
  });
};

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(questionClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.QUESTIONS);
    },
  });
};
