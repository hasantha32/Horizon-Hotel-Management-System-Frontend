import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useRemoveStaffMutation } from '@/data/staff';
import { getErrorMessage } from '@/utils/form-error';

const StaffDeleteView = () => {
  const { mutate: removeStaffByID, isLoading: loading } =
    useRemoveStaffMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  async function handleDelete() {
    try {
      removeStaffByID({
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

export default StaffDeleteView;
