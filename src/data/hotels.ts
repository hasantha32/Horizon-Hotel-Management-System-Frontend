import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Booking } from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { hotelClient } from './client/hotel';

export const useHotelQuery = () => {
  const { data, error, isLoading } = useQuery<Booking, Error>(
    [API_ENDPOINTS.HOTELS],
    () => hotelClient.get(),
  );

  return {
    hotel: data,
    error,
    isLoading,
  };
};

export const useUpdateHotelMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation(hotelClient.update, {
    onSuccess: async (data) => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOTELS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};
