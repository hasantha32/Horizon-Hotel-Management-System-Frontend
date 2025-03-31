import Router, { useRouter } from 'next/router';
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import type { UseInfiniteQueryOptions } from 'react-query';
import {
  GetParams,
  TermsAndConditions,
  TermsAndConditionsPaginator,
  TermsAndConditionsQueryOptions,
} from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { termsAndConditionClients } from '@/data/client/terms-and-condition';

// approve terms

export const useApproveTermAndConditionMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(termsAndConditionClients.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TERMS_AND_CONDITIONS);
    },
  });
};

// disapprove terms

export const useDisApproveTermAndConditionMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(termsAndConditionClients.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TERMS_AND_CONDITIONS);
    },
  });
};


// Read Single Terms And Conditions

export const useTermsAndConditionQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<TermsAndConditions, Error>(
    [API_ENDPOINTS.TERMS_AND_CONDITIONS, { slug, language }],
    () => termsAndConditionClients.get({ slug, language })
  );

  return {
    termsAndConditions: data,
    error,
    loading: isLoading,
  };
};

// Read All Terms And Conditions

export const useTermsAndConditionsQuery = (
  options: Partial<TermsAndConditionsQueryOptions>
) => {
  const { data, error, isLoading } = useQuery<
    TermsAndConditionsPaginator,
    Error
  >(
    [API_ENDPOINTS.TERMS_AND_CONDITIONS, options],
    ({ queryKey, pageParam }) =>
      termsAndConditionClients.paginated(
        Object.assign({}, queryKey[1], pageParam)
      ),
    {
      keepPreviousData: true,
    }
  );

  return {
    termsAndConditions: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};



// Create Terms And Conditions

export const useCreateTermsAndConditionsMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation(termsAndConditionClients.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.termsAndCondition.list}`
        : Routes.termsAndCondition.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TERMS_AND_CONDITIONS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

// Update Terms And Conditions

export const useUpdateTermsAndConditionsMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(termsAndConditionClients.update, {
    onSuccess: async (data: any) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.termsAndCondition.list}`
        : Routes.termsAndCondition.list;
      await router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TERMS_AND_CONDITIONS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

// Delete Terms And Conditions

export const useDeleteTermsAndConditionsMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(termsAndConditionClients.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TERMS_AND_CONDITIONS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};
