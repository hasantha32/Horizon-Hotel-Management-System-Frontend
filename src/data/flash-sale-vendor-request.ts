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
  FlashSale,
  FlashSalePaginator,
  FlashSaleProductsRequest,
  FlashSaleProductsRequestPaginator,
  FlashSaleProductsRequestQueryOptions,
  FlashSaleQueryOptions,
  FlashSaleRequestedProductsQueryOptions,
  ProductPaginator,
  ProductQueryOptions,
} from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { flashSaleVendorRequestClient } from '@/data/client/flash-sale-vendor-request';

// get all flash sale request list

export const useRequestedListsForFlashSale = (
  options: Partial<FlashSaleProductsRequestQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<
    FlashSaleProductsRequestPaginator,
    Error
  >(
    [API_ENDPOINTS.REQUEST_LISTS_FOR_FLASH_SALE, options],
    ({ queryKey, pageParam }) =>
      flashSaleVendorRequestClient.paginated(
        Object.assign({}, queryKey[1], pageParam),
      ),
    {
      keepPreviousData: true,
    },
  );

  return {
    flashSaleRequests: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

// Read Single flashSale request

export const useRequestedListForFlashSale = ({
  id,
  language,
  shop_id,
}: {
  id: string;
  language: string;
  shop_id?: string;
}) => {
  const { data, error, isLoading } = useQuery<any, Error>(
    [API_ENDPOINTS.FLASH_SALE, { id, language, shop_id }],
    () => flashSaleVendorRequestClient.get({ id, language, shop_id }),
  );

  return {
    flashSaleRequest: data,
    error,
    loading: isLoading,
  };
};

// get all flash sale products list in a enlisted requests

export const useRequestedProductsForFlashSale = (
  options: Partial<FlashSaleRequestedProductsQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<ProductPaginator, Error>(
    [API_ENDPOINTS.REQUESTED_PRODUCTS_FOR_FLASH_SALE, options],
    ({ queryKey, pageParam }) =>
      flashSaleVendorRequestClient.requestedProducts(
        Object.assign({}, queryKey[1], pageParam),
      ),
    {
      keepPreviousData: true,
    },
  );

  return {
    products: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

// Create flash sale

export const useCreateFlashSaleRequestMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation(flashSaleVendorRequestClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.vendorRequestForFlashSale.list}`
        : Routes.vendorRequestForFlashSale.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REQUEST_LISTS_FOR_FLASH_SALE);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

// Update flash sale

export const useUpdateFlashSaleRequestMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(flashSaleVendorRequestClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.vendorRequestForFlashSale.list}`
        : Routes.vendorRequestForFlashSale.list;
      await router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REQUEST_LISTS_FOR_FLASH_SALE);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

// Delete Flash Sale Request

export const useDeleteFlashSaleRequestMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(flashSaleVendorRequestClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REQUEST_LISTS_FOR_FLASH_SALE);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

// approve flash sale vendor request

export const useApproveVendorFlashSaleRequestMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(flashSaleVendorRequestClient.approve, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.vendorRequestForFlashSale.list}`
        : Routes.vendorRequestForFlashSale.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });

      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FLASH_SALE);
    },
  });
};

// disapprove flash sale vendor request

export const useDisApproveVendorFlashSaleRequestMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(flashSaleVendorRequestClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.FLASH_SALE);
    },
  });
};
