import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  Manufacturer,
  ManufacturerPaginator,
  ManufacturerQueryOptions,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { manufacturerClient } from '@/data/client/manufacturer';
import { Config } from '@/config';

export const useCreateManufacturerMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(manufacturerClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.manufacturer.list}`
        : Routes.manufacturer.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.MANUFACTURERS);
    },
  });
};

export const useDeleteManufacturerMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(manufacturerClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.MANUFACTURERS);
    },
  });
};

export const useUpdateManufacturerMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(manufacturerClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.manufacturer.list}`
        : Routes.manufacturer.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.MANUFACTURERS);
    },
  });
};

export const useUpdateManufacturerMutationInList = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(manufacturerClient.update, {
    onSuccess: async () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.MANUFACTURERS);
    },
  });
};

export const useManufacturerQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Manufacturer, Error>(
    [API_ENDPOINTS.MANUFACTURERS, { slug, language }],
    () => manufacturerClient.get({ slug, language })
  );

  return {
    manufacturer: data,
    error,
    loading: isLoading,
  };
};

export const useManufacturersQuery = (
  options: Partial<ManufacturerQueryOptions>
) => {
  const { data, error, isLoading } = useQuery<ManufacturerPaginator, Error>(
    [API_ENDPOINTS.MANUFACTURERS, options],
    ({ queryKey, pageParam }) =>
      manufacturerClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    manufacturers: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
