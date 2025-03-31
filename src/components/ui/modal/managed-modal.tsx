import Modal from "@/components/ui/modal/modal";
import dynamic from "next/dynamic";
import { MODAL_VIEWS, useModalAction, useModalState } from "./modal.context";

const BookingDeleteView = dynamic(() =>
  import("@/components/booking/booking-delete-view")
);
const BookingItemDeleteView = dynamic(() =>
  import("@/components/booking-item/booking-item-delete-view")
);
const RoomCategoryDeleteView = dynamic(() =>
  import("@/components/roomCategory/room-category-delete-view")
);
const RoomDeleteView = dynamic(() =>
  import("@/components/room/room-delete-view")
);

function renderModal(view: MODAL_VIEWS | undefined, data: any) {
  switch (view) {
    case "DELETE_ROOM":
      return <RoomDeleteView />;
    case "DELETE_ROOM_CATEGORY":
      return <RoomCategoryDeleteView />;
    case "DELETE_BOOKING":
      return <BookingDeleteView />;
    case "DELETE_BOOKING_ITEM":
      return <BookingItemDeleteView />;

    default:
      return null;
  }
}

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {renderModal(view, data)}
    </Modal>
  );
};

export default ManagedModal;
