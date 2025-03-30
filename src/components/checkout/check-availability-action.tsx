import { formatOrderedProduct } from '@/utils/format-ordered-product';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ValidationError from '@/components/ui/validation-error';
import omit from 'lodash/omit';
import { useAtom } from 'jotai';
import {
  billingAddressAtom,
  checkoutAtom,
  shippingAddressAtom,
  verifiedResponseAtom,
} from '@/contexts/checkout';
import Button from '@/components/ui/button';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { useTranslation } from 'next-i18next';
import { useVerifyCheckoutMutation } from '@/data/checkout';
import { Address } from '@/types';

export const CheckAvailabilityAction: React.FC<{
  children?: React.ReactNode;
}> = (props) => {
  const { t } = useTranslation('common');

  const [billing_address] = useAtom(billingAddressAtom);
  const [shipping_address] = useAtom(shippingAddressAtom);
  const [{ customer }] = useAtom(checkoutAtom);
  const [_, setVerifiedResponse] = useAtom(verifiedResponseAtom);

  const [errorMessage, setError] = useState('');
  const { items, total, isEmpty } = useCart();

  const { mutate: verifyCheckout, isLoading: loading } =
    useVerifyCheckoutMutation();

  function handleVerifyCheckout() {
    if (billing_address && shipping_address) {
      verifyCheckout(
        {
          amount: total,
          customer_id: customer?.value,
          products: items?.map((item) => formatOrderedProduct(item)),
          billing_address: {
            ...(billing_address?.address &&
              omit(billing_address.address, ['__typename'])),
          } as Address,
          shipping_address: {
            ...(shipping_address?.address &&
              omit(shipping_address.address, ['__typename'])),
          } as Address,
        },
        {
          onSuccess: (data: any) => {
            //@ts-ignore
            if (data?.errors as string) {
              //@ts-ignore
              toast.error(data?.errors[0]?.message);
            } else {
              //@ts-ignore
              setVerifiedResponse(data);
            }
          },
          onError: (error: any) => {
            setError(error?.message);
          },
        },
      );
    } else {
      setError('error-add-both-address');
    }
  }

  return (
    <>
      <Button
        loading={loading}
        className="mt-5 w-full"
        onClick={handleVerifyCheckout}
        disabled={isEmpty || loading}
        {...props}
      >
        <></>
      </Button>
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={t(errorMessage)} />
        </div>
      )}
    </>
  );
};
