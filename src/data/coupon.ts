import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { couponClient } from './client/coupon';
import { Coupon, CouponPaginator, CouponQueryOptions } from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(couponClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.coupon.list}`
        : Routes.coupon.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COUPONS);
    },
  });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(couponClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COUPONS);
    },
  });
};

export const useUpdateCouponMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(couponClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.coupon.list}`
        : Routes.coupon.list;
      await router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });

      toast.error(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COUPONS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useVerifyCouponMutation = () => {
  return useMutation(couponClient.verify);
};

export const useCouponQuery = ({
  code,
  language,
}: {
  code: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<Coupon, Error>(
    [API_ENDPOINTS.COUPONS, { code, language }],
    () => couponClient.get({ code, language }),
  );

  return {
    coupon: data,
    error,
    loading: isLoading,
  };
};

export const useCouponsQuery = (options: Partial<CouponQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CouponPaginator, Error>(
    [API_ENDPOINTS.COUPONS, options],
    ({ queryKey, pageParam }) =>
      couponClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    coupons: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useApproveCouponMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(couponClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COUPONS);
    },
  });
};
export const useDisApproveCouponMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(couponClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COUPONS);
    },
  });
};
