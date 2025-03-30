import ConfirmationCard from "@/components/common/confirmation-card";
import {
  useModalAction,
  useModalState,
} from "@/components/ui/modal/modal.context";
import { useDeleteBookingItemMutation } from "@/data/booking-item";

const BookingItemDeleteView = () => {
  const {
    mutate: deleteBookingItem,
    isLoading: loading,
  } = useDeleteBookingItemMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteBookingItem({
      id: data.id,
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

export default BookingItemDeleteView;
