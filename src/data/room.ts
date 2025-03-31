import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { CouponQueryOptions, Room, RoomPaginator, RoomQueryOptions } from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { roomClient } from './client/rooms';

export const useRoomsQuery = (options: Partial<RoomQueryOptions>) => {
  const { data, error, isLoading } = useQuery<RoomPaginator, Error>(
    [API_ENDPOINTS.ROOMS, options],
    ({ queryKey, pageParam }) =>
      roomClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    rooms: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(roomClient.createWithEndpoint, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.room.list}`
        : Routes.room.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.ROOMS);
    },
  });
};

export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(roomClient.deleteWithEndpoint, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROOMS);
    },
  });
};

export const useUpdateRoomMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(roomClient.updateWithEndpoint, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.room.list}`
        : Routes.room.list;
      await router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });

      toast.error(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ROOMS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useRoomQuery = ({
  room_number,
  language,
}: {
  room_number: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<Room, Error>(
    [API_ENDPOINTS.ROOMS, { room_number, language }],
    () => roomClient.get({ room_number, language }),
  );

  return {
    room: data,
    error,
    loading: isLoading,
  };
};