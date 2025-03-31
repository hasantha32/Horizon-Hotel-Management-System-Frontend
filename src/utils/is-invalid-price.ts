import { FlashSaleType, ProductType } from '@/types';
import { useMemo } from 'react';

type IsInvalidPriceProps = {
  type: string;
  product_type: string;
  rate: number;
  max_price: number;
  min_price: number;
};

export const useIsInvalidPrice = ({
  type,
  product_type,
  rate,
  max_price,
  min_price,
}: IsInvalidPriceProps) => {
  const isInvalidPrice = useMemo(() => {
    let isInvalidPrice: boolean = false;

    if (
      type === FlashSaleType?.FIXED_RATE &&
      product_type === ProductType.Variable
    ) {
      isInvalidPrice =
        ((max_price as number) - Number(rate)! ||
          (min_price as number) - Number(rate)!) <= 0;
    }

    return { isInvalidPrice };
  }, [type, product_type, min_price, max_price, rate]);

  return isInvalidPrice;
};
