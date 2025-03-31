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
import { storeNoticeClient } from './client/store-notice';
import type { UseInfiniteQueryOptions, UseQueryOptions } from 'react-query';

import {
  StoreNotice,
  StoreNoticePaginator,
  StoreNoticeQueryOptions,
} from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';

export const useCreateStoreNoticeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation(storeNoticeClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.storeNotice.list}`
        : Routes.storeNotice.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STORE_NOTICES);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useDeleteStoreNoticeMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(storeNoticeClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STORE_NOTICES);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useUpdateStoreNoticeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(storeNoticeClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.storeNotice.list}`
        : Routes.storeNotice.list;
      await router.push(`${generateRedirectUrl}/${data?.id}/edit`, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STORE_NOTICES);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useListMutation = () => {
  const { t } = useTranslation();
  return useMutation(storeNoticeClient.getUserOrShopList);
};

export const useStoreNoticeQuery = ({
  id,
  language,
}: {
  id: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<StoreNotice, Error>(
    [API_ENDPOINTS.STORE_NOTICES, { id, language }],
    () => storeNoticeClient.get({ id, language })
  );

  return {
    storeNotice: data,
    error,
    loading: isLoading,
  };
};

export const useStoreNoticesQuery = (
  options: Partial<StoreNoticeQueryOptions>,
  config: UseQueryOptions<StoreNoticePaginator, Error> = {}
) => {
  const { data, error, isLoading } = useQuery<StoreNoticePaginator, Error>(
    [API_ENDPOINTS.STORE_NOTICES, options],
    ({ queryKey, pageParam }) =>
      storeNoticeClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      ...config,
      keepPreviousData: true,
    }
  );

  return {
    storeNotices: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useStoreNoticesLoadMoreQuery = (
  options: Partial<StoreNoticeQueryOptions>,
  config?: UseInfiniteQueryOptions<StoreNoticePaginator, Error>
) => {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<StoreNoticePaginator, Error>(
    [API_ENDPOINTS.STORE_NOTICES, options],
    ({ queryKey, pageParam }) =>
      storeNoticeClient.all(Object.assign({}, queryKey[1], pageParam)),
    {
      ...config,
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    storeNotices: data?.pages.flatMap((page) => page?.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? data?.pages[data.pages.length - 1]
      : null,
    error,
    hasNextPage,
    loading: isLoading,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
  };
};

export const useStoreNoticeTypeQuery = (
  options: Partial<{ type: string }> = {}
) => {
  const { data, error, isLoading } = useQuery<any, Error>(
    [API_ENDPOINTS.STORE_NOTICE_GET_STORE_NOTICE_TYPE, options],
    ({ queryKey, pageParam }) =>
      storeNoticeClient.getTypeList(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    noticeTypes: data ?? [],
    error,
    loading: isLoading,
  };
};
export const useUsersOrShopsQuery = (
  options: Partial<{ type: string }> = {}
) => {
  const { data, error, isLoading } = useQuery<any, Error>(
    [API_ENDPOINTS.STORE_NOTICES_USER_OR_SHOP_LIST, options],
    ({ queryKey, pageParam }) =>
      storeNoticeClient.getUserOrShopList(
        Object.assign({}, queryKey[1], pageParam)
      ),
    {
      keepPreviousData: true,
    }
  );

  return {
    usersOrShops: data ?? [],
    error,
    loading: isLoading,
  };
};

export function useStoreNoticeRead() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const {
    mutate: readStoreNotice,
    isLoading,
    isSuccess,
  } = useMutation(storeNoticeClient.toggle, {
    onSuccess: () => {},
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.STORE_NOTICES_IS_READ);
    },
  });

  return { readStoreNotice, isLoading, isSuccess };
}
