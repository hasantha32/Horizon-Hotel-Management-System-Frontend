import usePrice from '@/utils/use-price';
import isEmpty from 'lodash/isEmpty';

export default function VariationPrice({
  selectedVariation,
  minPrice,
  maxPrice,
}: any) {
  const { price, basePrice } = usePrice(
    selectedVariation && {
      amount: selectedVariation?.sale_price
        ? Number(selectedVariation?.sale_price)
        : Number(selectedVariation?.price),
      baseAmount: Number(selectedVariation?.price),
    }
  );
  const { price: min_price } = usePrice({
    amount: minPrice,
  });
  const { price: max_price } = usePrice({
    amount: maxPrice,
  });
  return (
    <span className="flex items-center">
      <ins className="text-2xl font-semibold text-accent no-underline">
        {!isEmpty(selectedVariation)
          ? `${price}`
          : `${min_price} - ${max_price}`}
      </ins>
      {basePrice && (
        <del className="text-sm font-normal text-muted ms-2 md:text-base">
          {basePrice}
        </del>
      )}
    </span>
  );
}
