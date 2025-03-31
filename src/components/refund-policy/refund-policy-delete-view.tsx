import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { getErrorMessage } from '@/utils/form-error';
import { useDeleteRefundPolicyMutation } from '@/data/refund-policy';

const RefundPolicyDeleteView = () => {
  const { mutate: deleteRefundPolicy, isLoading: loading } =
  useDeleteRefundPolicyMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    try {
      deleteRefundPolicy({
        id: data,
      });
      closeModal();
    } catch (error) {
      closeModal();
      getErrorMessage(error);
    }
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default RefundPolicyDeleteView;
