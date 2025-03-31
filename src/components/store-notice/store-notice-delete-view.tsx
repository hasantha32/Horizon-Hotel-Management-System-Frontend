import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteStoreNoticeMutation } from '@/data/store-notice';

const StoreNoticeDeleteView = () => {
  const { mutate: deleteStoreNotice, isLoading: loading } =
    useDeleteStoreNoticeMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteStoreNotice({
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

export default StoreNoticeDeleteView;
