import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { getErrorMessage } from '@/utils/form-error';
import { useDeleteAuthorMutation } from '@/data/author';

const AuthorDeleteView = () => {
  const { mutate: deleteAuthor, isLoading: loading } =
    useDeleteAuthorMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    try {
      deleteAuthor({
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

export default AuthorDeleteView;
