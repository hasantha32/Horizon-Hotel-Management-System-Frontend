import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteRoomMutation } from '@/data/room';
import { useDeleteRoomCategoryMutation } from '@/data/room-category';

const RoomCategoryDeleteView = () => {
  const { mutate: deleteRoomCategory, isLoading: loading } =
  useDeleteRoomCategoryMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteRoomCategory({
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

export default RoomCategoryDeleteView;
