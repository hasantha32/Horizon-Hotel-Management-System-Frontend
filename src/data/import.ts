import { useMutation, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { importClient } from '@/data/client/import';

type Input = {
  shop_id: string;
  csv: any;
};

export const useImportAttributesMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutation(
    (input: Input) => {
      return importClient.importCsv(API_ENDPOINTS.IMPORT_ATTRIBUTES, input);
    },
    {
      onSuccess: () => {
        toast.success(t('common:attribute-imported-successfully'));
      },
      onError: (error: any) => {
        toast.error(t(`common:${error?.response?.data.message}`));
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ATTRIBUTES);
      },
    }
  );
};

export const useImportProductsMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutation(
    (input: Input) => {
      return importClient.importCsv(API_ENDPOINTS.IMPORT_PRODUCTS, input);
    },
    {
      onSuccess: () => {
        toast.success(t('common:product-imported-successfully'));
      },
      onError: (error: any) => {
        toast.error(t(`common:${error?.response?.data.message}`));
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
      },
    }
  );
};

export const useImportVariationOptionsMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutation(
    (input: Input) => {
      return importClient.importCsv(
        API_ENDPOINTS.IMPORT_VARIATION_OPTIONS,
        input
      );
    },
    {
      onSuccess: () => {
        toast.success(t('common:variation-options-imported-successfully'));
      },
      onError: (error: any) => {
        toast.error(t(`common:${error?.response?.data.message}`));
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
      },
    }
  );
};
