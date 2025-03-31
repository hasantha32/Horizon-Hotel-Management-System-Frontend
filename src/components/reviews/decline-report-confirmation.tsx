import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeclineReviewMutation } from '@/data/review';
import { useRouter } from 'next/router';

const DeclineAbuseReportView = () => {
  const router = useRouter();
  const { mutate: declineReports, isLoading: loading } =
    useDeclineReviewMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    declineReports(data);
    closeModal();
    router.push(`/reviews`);
  }

  return (
    <ConfirmationCard
      title="text-decline"
      description="text-decline-report-modal-description"
      onCancel={closeModal}
      deleteBtnText="text-decline"
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default DeclineAbuseReportView;
