import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { Booking, BookingPaginator, BookingQueryOptions, CouponQueryOptions, Room } from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { bookingClient } from './client/booking';
import { bookingItemClient } from './client/booking-item';

export const useBookingsQuery = (options: Partial<BookingQueryOptions>) => {
  const { data, error, isLoading } = useQuery<BookingPaginator, Error>(
    [API_ENDPOINTS.BOOKINGS, options],
    ({ queryKey, pageParam }) =>
      bookingClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    bookings: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(bookingClient.createWithEndpoint, {
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

export const useDeleteBookingItemMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(bookingItemClient.deleteWithEndpoint, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
      ? `/${router.query.shop}${Routes.bookings.list}`
      : Routes.bookings.list;
    await Router.push(generateRedirectUrl, undefined, {
      locale: Config.defaultLanguage,
    });
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BOOKINGS);
    },
  });
};

export const useUpdateBookingMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(bookingClient.updateWithEndpoint, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.bookings.list}`
        : Routes.bookings.list;
      await router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });

      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BOOKINGS);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data.error);
    },
  });
};

export const useBookingQuery = ({
  booking_number,
  language,
}: {
  booking_number: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<Booking, Error>(
    [API_ENDPOINTS.BOOKINGS, { booking_number, language }],
    () => bookingClient.get({ booking_number, language }),
    {
      enabled: Boolean(booking_number),
    }
  );

  return {
    booking: data,
    error,
    isLoading,
  };
};