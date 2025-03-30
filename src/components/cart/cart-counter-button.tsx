import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import { formatString } from '@/utils/format-string';
import usePrice from '@/utils/use-price';
import { useUI } from '@/contexts/ui.context';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { useTranslation } from 'next-i18next';
import { useBooking } from '@/contexts/quick-booking/booking.context';

const CartCounterButton = () => {
  const { t } = useTranslation();
  // const { totalUniqueItems, total } = useCart();
  const { totalUniqueItems, total } = useBooking();
  const { openCartSidebar } = useUI();
  const { price: totalPrice } = usePrice({
    amount: total,
  });
  // function handleCartSidebar() {
  //   setDisplayCart({ display: true, view: 'cart' });
  // }
  return (
    <button
      className="product-cart ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto shadow-900 rounded-te-none rounded-be-none fixed top-1/2 z-40 -mt-12 flex flex-col items-center justify-center rounded bg-accent p-3 pt-3.5 text-sm font-semibold text-light transition-colors duration-200 hover:bg-accent-hover focus:outline-none"
      onClick={openCartSidebar}
    >
      <span className="flex pb-0.5">
        <CartCheckBagIcon className="flex-shrink-0" width={14} height={16} />
        <span className="ms-2 flex">
          {formatString(totalUniqueItems, t('common:text-item'))}
        </span>
      </span>
      <span className="mt-3 w-full rounded bg-light py-2 px-2 text-accent">
        {totalPrice}
      </span>
    </button>
  );
};

export default CartCounterButton;
