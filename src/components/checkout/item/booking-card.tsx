import { Room } from "@/types";
import usePrice from "@/utils/use-price";
import cn from "classnames";
import { useTranslation } from "next-i18next";
interface Props {
  room: Room;
  notAvailable?: boolean;
}

const BookingCard = ({ room, notAvailable }: Props) => {
  const { t } = useTranslation("common");
  const { price } = usePrice({
    amount: Number(room.price),
  });
  return (
    <div className={cn("flex justify-between py-2")} key={room.id}>
      <p className="flex items-center justify-between text-base">
        <span
          className={cn("text-sm", notAvailable ? "text-red-500" : "text-body")}
        >
          {/* <span
            className={cn(
              "text-sm font-bold",
              notAvailable ? "text-red-500" : "text-heading"
            )}
          >
            {room.quantity}
          </span> */}
          {/* <span className="mx-2">x</span> */}
          <span>Room Number: {room.room_number}</span>
        </span>
      </p>
      <span
        className={cn("text-sm", notAvailable ? "text-red-500" : "text-body")}
      >
        {!notAvailable ? price : t("text-unavailable")}
      </span>
    </div>
  );
};

export default BookingCard;
