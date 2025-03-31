import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useBlockUserMutation, useUnblockUserMutation } from '@/data/user';

const CustomerBanView = () => {
  const { mutate: blockUser, isLoading: loading } = useBlockUserMutation();
  const { mutate: unblockUser, isLoading: activeLoading } =
    useUnblockUserMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  async function handleDelete() {
    if (data?.type === 'ban') {
      blockUser({ id: data?.id });
    } else {
      unblockUser({ id: data?.id });
    }
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnText={data?.type === 'ban' ? 'Block' : 'Unblock'}
      title={data?.type === 'ban' ? 'Block Customer' : 'Unblock Customer'}
      description="Are you sure you want to block this customer?"
      deleteBtnLoading={loading || activeLoading}
    />
  );
};

export default CustomerBanView;
