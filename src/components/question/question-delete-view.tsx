import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteQuestionMutation } from '@/data/question';

const QuestionDeleteView = () => {
  const { mutate: deleteQuestion, isLoading: loading } =
    useDeleteQuestionMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteQuestion({
      id: data?.id as string,
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

export default QuestionDeleteView;
