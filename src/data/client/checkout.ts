import { VerifyCheckoutInputType } from '@/types';
import { HttpClient } from '@/data/client/http-client';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';

export const checkoutClient = {
  verify: (input: VerifyCheckoutInputType) => {
    {
      return HttpClient.post<VerifyCheckoutInputType>(
        API_ENDPOINTS.CHECKOUT,
        input
      );
    }
  },
};
