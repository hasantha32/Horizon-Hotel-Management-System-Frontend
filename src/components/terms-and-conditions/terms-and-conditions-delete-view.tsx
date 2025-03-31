import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteTermsAndConditionsMutation } from '@/data/terms-and-condition';

const TermsAndConditionsDeleteView = () => {
  const { mutate: deleteTermsAndConditions, isLoading: loading } =
    useDeleteTermsAndConditionsMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteTermsAndConditions({
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

export default TermsAndConditionsDeleteView;
