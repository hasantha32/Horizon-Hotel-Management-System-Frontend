import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteReviewMutation } from '@/data/review';
import { useRouter } from 'next/router';

const AcceptAbuseReportView = () => {
  const router = useRouter();
  const { mutate: deleteReview, isLoading: loading } =
    useDeleteReviewMutation();

  const { data: modalData } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteReview({
      id: modalData as string,
    });
    closeModal();
    router.push(`/reviews`);
  }

  return (
    <ConfirmationCard
      title="text-accept"
      description="text-accept-report-modal-description"
      onCancel={closeModal}
      deleteBtnText="text-accept"
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default AcceptAbuseReportView;
