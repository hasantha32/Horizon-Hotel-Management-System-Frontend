import { useMutation } from 'react-query';
import { checkoutClient } from '@/data/client/checkout';

export const useVerifyCheckoutMutation = () => {
  return useMutation(checkoutClient.verify);
};
