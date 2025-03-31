import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { ClipboardIcon } from '@/components/icons/clipboard';
import { MollieIcon } from '@/components/icons/payment-gateways/mollie';
import { PayPalIcon } from '@/components/icons/payment-gateways/paypal';
import { RazorPayIcon } from '@/components/icons/payment-gateways/razorpay';
import { StripeIcon } from '@/components/icons/payment-gateways/stripe';
import { SSLComerz } from '@/components/icons/payment-gateways/sslcomerz';
import { PayStack } from '@/components/icons/payment-gateways/paystack';
import { IyzicoIcon } from '@/components/icons/payment-gateways/iyzico';
import { XenditIcon } from '@/components/icons/payment-gateways/xendit';
import Badge from '@/components/ui/badge/badge';
import Image from 'next/image';
import { BkashIcon } from '@/components/icons/payment-gateways/bkash';
import { PaymongoIcon } from '@/components/icons/payment-gateways/paymongo';
import { FlutterwaveIcon } from '@/components/icons/payment-gateways/flutterwave';

interface WebHookURLProps {
  gateway: gatewayType;
}

type gatewayType = {
  name: string;
  title: string;
};

const WebHookURL = ({ gateway }: WebHookURLProps) => {
  const [_, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setCopied] = useState(false);

  const icon: any = {
    stripe: <StripeIcon className="h-4 w-auto" />,
    paypal: <PayPalIcon className="h-4 w-auto" />,
    razorpay: <RazorPayIcon className="h-4 w-auto" />,
    mollie: <MollieIcon className="h-4 w-auto" />,
    sslcommerz: <SSLComerz className="h-4 w-auto" />,
    paystack: <PayStack className="h-4 w-auto" />,
    iyzico: <IyzicoIcon className="h-4 w-auto" />,
    xendit: <XenditIcon className="h-4 w-auto" />,
    bkash: <BkashIcon className="h-4 w-auto" />,
    paymongo: <PaymongoIcon className="h-4 w-auto" />,
    flutterwave: <FlutterwaveIcon className="h-4 w-auto" />,
  };
  const url = `${
    process.env.NEXT_PUBLIC_REST_API_ENDPOINT
  }/webhooks/${gateway?.name?.toLowerCase()}`;

  setTimeout(() => {
    setCopied(false);
  }, 5000);

  return (
    <div className="flex items-center border-t border-t-[#D1D5DB] px-5 py-4 transition-all first:border-t-0 hover:bg-gray-100">
      <span className="relative h-5 min-w-[80px] sm:min-w-[100px] lg:min-w-[120px]">
        {icon[gateway?.name] ? icon[gateway?.name] : ''}
      </span>
      <span className="ml-5 flex-grow truncate pr-2 text-xs text-gray-500">
        {url}
      </span>
      <div className="relative flex items-center">
        {isCopied && (
          <span className="absolute right-full top-1/2 z-10 -translate-y-1/2 px-2">
            <Badge text="Copied!" className="inline-flex" />
          </span>
        )}
        <button
          type="button"
          onClick={() => {
            copyToClipboard(url);
            setCopied(true);
          }}
          className="text-accent-500 transition hover:text-accent-400"
        >
          <ClipboardIcon />
        </button>
      </div>
    </div>
  );
};

export default WebHookURL;
