import Counter from "@/components/ui/counter";
import AddToCartBtn from "@/components/cart/add-to-cart/add-to-cart-btn";
import { cartAnimation } from "@/utils/cart-animation";
import { useCart } from "@/contexts/quick-cart/cart.context";
import { generateCartItem } from "@/contexts/quick-cart/generate-cart-item";
import AddRoomBtn from "./add-room-btn";
import { Room } from "@/types";
import { useBooking } from "@/contexts/quick-booking/booking.context";
import BookingCounter from "@/components/ui/booking-counter";

interface Props {
  data: Room;
  variant?: "helium" | "neon" | "argon" | "oganesson" | "single" | "big";
  counterVariant?:
    | "helium"
    | "neon"
    | "argon"
    | "oganesson"
    | "single"
    | "details";
  counterClass?: string;
  variation?: any;
  disabled?: boolean;
}

export const AddRoom = ({
  data,
  variant = "helium",
  counterVariant,
  counterClass,
  variation,
  disabled,
}: Props) => {
  const {
    addRoomToCart,
    isRoomInCart,
    removeRoomFromCart,
    // removeItemFromCart,
    // isInStock,
    // getItemFromCart,
    // isInCart,
  } = useBooking();
  // const item = generateCartItem(data, variation);
  const item = data;

  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    addRoomToCart(item, 1);
    if (!isRoomInCart(item.id)) {
      cartAnimation(e);
    }
  };

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeRoomFromCart(item.id);
  };

  // const outOfStock = isRoomInCart(item?.id) && !isInStock(item.id);

  return !isRoomInCart(item?.id) ? (
    <AddRoomBtn
      // disabled={disabled || outOfStock}
      disabled={disabled}
      variant={variant}
      onClick={handleAddClick}
    />
  ) : (
    <>
      <BookingCounter value="Added" onDecrement={handleRemoveClick} />
    </>
  );
};
