import { useState } from "react";
import { useRouter } from "next/router";
import ValidationError from "@/components/ui/validation-error";
import Button from "@/components/ui/button";
import { useCreateOrderMutation } from "@/data/order";
import { useTranslation } from "react-i18next";
import { useBooking } from "@/contexts/quick-booking/booking.context";
import BookingCard from "../checkout/item/booking-card";
import EmptyCartIcon from "@/components/icons/empty-cart";
import usePrice from "@/utils/use-price";

export const PlaceBookingAction: React.FC<{
  children?: React.ReactNode;
}> = (props) => {
  const { t } = useTranslation();
  const { locale, ...router } = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createOrder, isLoading: loading } = useCreateOrderMutation();
  const { rooms, isEmpty, total } = useBooking();

  const { price: totalPrice } = usePrice({
    amount: total,
  });
  return (
    <>
      <div className="flex flex-col border-b border-border-200 pb-2">
        {!isEmpty ? (
          rooms?.map((room) => {
            // const notAvailable = verifiedResponse?.unavailable_products?.find(
            //   (d: any) => d === item.id
            // );
            return (
              <BookingCard
                room={room}
                key={room.id}
                // notAvailable={!!notAvailable}
              />
            );
          })
        ) : (
          <EmptyCartIcon />
        )}
        <div className="flex justify-between border-t-4 border-double border-border-200 pt-3">
          <p className="text-base font-semibold text-heading">
            {t("text-total")}
          </p>
          <span className="text-base font-semibold text-heading">{totalPrice}</span>
        </div>
      </div>
      <Button
        loading={loading}
        className="mt-5 w-full"
        // onClick={handlePlaceOrder}
        {...props}
      >
        Place Booking
      </Button>
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
    </>
  );
};
