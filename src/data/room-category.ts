import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Coupon, CouponQueryOptions, RoomCategory, RoomCategoryPaginator, RoomCategoryQueryOptions } from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { roomCategoryClient } from './client/room-category';

export const useRoomCategoriesQuery = (options: Partial<RoomCategoryQueryOptions>) => {
  const { data, error, isLoading } = useQuery<RoomCategoryPaginator, Error>(
    [API_ENDPOINTS.ROOM_CATEGORIES, options],
    ({ queryKey, pageParam }) =>
        roomCategoryClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    roomCategories: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useRoomCategoryQuery = ({
  slug,
  language,
}: {
  slug: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<RoomCategory, Error>(
    [API_ENDPOINTS.ROOM_CATEGORIES, { slug, language }],
    () => roomCategoryClient.get({ slug, language }),
  );

  return {
    roomCategory: data,
    error,
    loading: isLoading,
  };
};

export const useCreateRoomCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(roomCategoryClient.createWithEndpoint, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.coupon.list}`
        : Routes.roomCategories.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.ROOM_CATEGORIES);
    },
  });
};

export const useUpdateRoomCategoryMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(roomCategoryClient.updateWithEndpoint, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.coupon.list}`
        : Routes.roomCategories.list;
      await router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });

      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROOM_CATEGORIES);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useDeleteRoomCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(roomCategoryClient.deleteWithEndpoint, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROOM_CATEGORIES);
    },
  });
};
