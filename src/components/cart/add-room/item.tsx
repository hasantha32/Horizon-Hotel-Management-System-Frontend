import Image from 'next/image';
import { motion } from 'framer-motion';
import Counter from '@/components/ui/counter';
import { CloseIcon } from '@/components/icons/close-icon';
import { fadeInOut } from '@/utils/motion/fade-in-out';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/contexts/quick-cart/cart.context';
import usePrice from '@/utils/use-price';
import BookingCounter from '@/components/ui/booking-counter';
import { useBooking } from '@/contexts/quick-booking/booking.context';
import { Room } from '@/types';

interface CartItemProps {
  room: Room;
}

const BookingItem = ({ room }: CartItemProps) => {
  const { t } = useTranslation('common');
  const { isInStock, clearItemFromCart, addItemToCart, removeItemFromCart } =
    useCart();
  const {
    addRoomToCart,
    isRoomInCart,
    removeRoomFromCart,
    // removeItemFromCart,
    // isInStock,
    // getItemFromCart,
    // isInCart,
  } = useBooking();

  const {room_number, price} = room;

  console.log('item: ', room)

  // const { price } = usePrice({
  //   amount: room.price,
  // });
  // const { price: itemPrice } = usePrice({
  //   amount: room.itemTotal,
  // });

  // function handleIncrement(e: any) {
  //   e.stopPropagation();
  //   addItemToCart(item, 1);
  // }

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeRoomFromCart(room.id);
  };

    const { price: totalPrice } = usePrice({
      amount: Number(price),
    });

  // const outOfStock = !isInStock(item.id);
  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className="flex items-center border-b border-solid border-border-200 border-opacity-75 px-4 py-4 text-sm sm:px-6"
    >
      {/* <div className="flex-shrink-0">
        <BookingCounter
          value={item.quantity}
          onDecrement={handleRemoveClick}
          onIncrement={handleIncrement}
          variant="pillVertical"
          disabled={outOfStock}
        />
      </div> */}

      <div className="relative mx-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
        <Image
          src={room?.image?.original ?? '/'}
          alt={room.room_number}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-contain"
        />
      </div>
      <div>
        <h3 className="font-bold text-heading">Room No. {room_number}</h3>
        <p className="my-2.5 font-semibold text-accent">{totalPrice}</p>
        {/* <span className="text-xs text-body">
          {item.quantity} X {item.unit}
        </span> */}
      </div>
      {/* <span className="font-bold text-heading ms-auto">{itemPrice}</span> */}
      <button
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
        onClick={() => removeRoomFromCart(room.id)}
      >
        <span className="sr-only">{t('text-close')}</span>
        <CloseIcon className="h-3 w-3" />
      </button>
    </motion.div>
  );
};

export default BookingItem;
