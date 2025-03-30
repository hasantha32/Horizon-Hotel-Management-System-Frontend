import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteFlashSaleRequestMutation } from '@/data/flash-sale-vendor-request';

const FlashSaleDeleteView = () => {
  const { mutate: deleteFlashSaleRequest, isLoading: loading } =
    useDeleteFlashSaleRequestMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteFlashSaleRequest({
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
