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
import { FlashSale, FlashSalePaginator, FlashSaleQueryOptions } from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { flashSaleClient } from '@/data/client/flash-sale';

// approve terms

export const useApproveFlashSaleMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(flashSaleClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FLASH_SALE);
    },
  });
};

// disapprove terms

export const useDisApproveFlashSaleMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(flashSaleClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FLASH_SALE);
    },
  });
};

// Read Single flashSale

export const useFlashSaleQuery = ({
  slug,
  language,
  shop_id,
}: {
  slug: string;
  language: string;
  shop_id?: string;
}) => {
  const { data, error, isLoading } = useQuery<any, Error>(
    [API_ENDPOINTS.FLASH_SALE, { slug, language, shop_id }],
    () => flashSaleClient.get({ slug, language, shop_id })
  );

  return {
    flashSale: data,
    error,
    loading: isLoading,
  };
};

// Read All flashSale

export const useFlashSalesQuery = (options: Partial<FlashSaleQueryOptions>) => {
  const { data, error, isLoading } = useQuery<FlashSalePaginator, Error>(
    [API_ENDPOINTS.FLASH_SALE, options],
    ({ queryKey, pageParam }) =>
      flashSaleClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    flashSale: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

// Read All flash sale paginated

export const useFlashSaleLoadMoreQuery = (
  options: Partial<FlashSaleQueryOptions>,
  config?: UseInfiniteQueryOptions<FlashSalePaginator, Error>
) => {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<FlashSalePaginator, Error>(
    [API_ENDPOINTS.FLASH_SALE, options],
    ({ queryKey, pageParam }) =>
      flashSaleClient.all(Object.assign({}, queryKey[1], pageParam)),
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
    flashSale: data?.pages.flatMap((page) => page?.data) ?? [],
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

// Create flash sale

export const useCreateFlashSaleMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation(flashSaleClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.flashSale.list}`
        : Routes.flashSale.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FLASH_SALE);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

// Update flash sale

export const useUpdateFlashSaleMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(flashSaleClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.flashSale.list}`
        : Routes.flashSale.list;
      await router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FLASH_SALE);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

// Delete FAQ

export const useDeleteFlashSaleMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(flashSaleClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FLASH_SALE);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useProductFlashSaleInfo = ({
  id,
  language,
}: {
  id: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<FlashSale, Error>(
    [API_ENDPOINTS.PRODUCT_FLASH_SALE_INFO, { id, language }],
    () => flashSaleClient.getFlashSaleInfoByProductID({ id, language })
  );

  return {
    flashSaleInfo: data,
    error,
    loading: isLoading,
  };
};
