import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteFlashSaleMutation } from '@/data/flash-sale';

const FlashSaleDeleteView = () => {
  const { mutate: deleteFlashSale, isLoading: loading } =
    useDeleteFlashSaleMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteFlashSale({
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

export default FlashSaleDeleteView;
