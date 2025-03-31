import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Category,
  CategoryPaginator,
  CategoryQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { categoryClient, categoryClient_v2 } from './client/category';
import { Config } from '@/config';

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(categoryClient.create, {
    onSuccess: () => {
      Router.push(Routes.category.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES);
    },
  });
};

export const useCreateCategoryMutation_v2 = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(categoryClient_v2.create, {
    onSuccess: () => {
      Router.push(Routes.category.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES_v2);
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(categoryClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES);
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(categoryClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.category.list}`
        : Routes.category.list;
      await router.push(
        `${generateRedirectUrl}/${data?.slug}/edit`,
        undefined,
        {
          locale: Config.defaultLanguage,
        }
      );
      toast.success(t('common:successfully-updated'));
    },
    // onSuccess: () => {
    //   toast.success(t('common:successfully-updated'));
    // },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES);
    },
  });
};

export const useCategoryQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Category, Error>(
    [API_ENDPOINTS.CATEGORIES, { slug, language }],
    () => categoryClient.get({ slug, language })
  );

  return {
    category: data,
    error,
    isLoading,
  };
};

export const useCategoryQuery_v2 = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Category, Error>(
    [API_ENDPOINTS.CATEGORIES_v2, { slug, language }],
    () => categoryClient_v2.get({ slug, language })
  );

  return {
    category_v2: data,
    error,
    isLoading,
  };
};

export const useCategoriesQuery = (options: Partial<CategoryQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CategoryPaginator, Error>(
    [API_ENDPOINTS.CATEGORIES, options],
    ({ queryKey, pageParam }) =>
      categoryClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    categories: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useCategoriesQuery_v2 = (options: Partial<CategoryQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CategoryPaginator, Error>(
    [API_ENDPOINTS.CATEGORIES_v2, options],
    ({ queryKey, pageParam }) =>
      categoryClient_v2.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  console.log('data: ', data)

  return {
    categories_v2: data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
