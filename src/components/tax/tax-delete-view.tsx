import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteTaxMutation } from '@/data/tax';

const TaxDeleteView = () => {
  const { mutate: deleteTax, isLoading: loading } = useDeleteTaxMutation();
  const { data } = useModalState();
  const { closeModal } = useModalAction();

  async function handleDelete() {
    deleteTax({
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

export default TaxDeleteView;
