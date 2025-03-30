import ConfirmationCard from "@/components/common/confirmation-card";
import {
  useModalAction,
  useModalState,
} from "@/components/ui/modal/modal.context";
import { useDeleteBookingMutation } from "@/data/booking";
import { useDeleteBookingItemMutation } from "@/data/booking-item";

const BookingDeleteView = () => {
  const {
    mutate: deleteBooking,
    isLoading: loading,
  } = useDeleteBookingMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteBooking({
      id: data,
    });
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default BookingDeleteView;
