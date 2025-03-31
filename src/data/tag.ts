import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Routes } from '@/config/routes';
import { TagQueryOptions, GetParams, TagPaginator, Tag } from '@/types';
import { tagClient } from '@/data/client/tag';
import { Config } from '@/config';

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(tagClient.create, {
    onSuccess: () => {
      Router.push(Routes.tag.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TAGS);
    },
  });
};

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(tagClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TAGS);
    },
  });
};

export const useUpdateTagMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(tagClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.tag.list}`
        : Routes.tag.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.TAGS);
    },
  });
};

export const useTagQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Tag, Error>(
    [API_ENDPOINTS.TYPES, { slug, language }],
    () => tagClient.get({ slug, language })
  );
  return {
    tag: data,
    error,
    loading: isLoading,
  };
};

export const useTagsQuery = (options: Partial<TagQueryOptions>) => {
  const { data, error, isLoading } = useQuery<TagPaginator, Error>(
    [API_ENDPOINTS.TAGS, options],
    ({ queryKey, pageParam }) =>
      tagClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    tags: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
