import ConfirmationCard from '@/components/common/confirmation-card';
import { CheckMarkCircle } from '@/components/icons/checkmark-circle';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useApproveCouponMutation } from '@/data/coupon';
import { useDisApproveShopMutation } from '@/data/shop';
import { useTranslation } from 'next-i18next';

const ApproveCouponView = () => {
  const { t } = useTranslation();
  const { mutate: ApproveCouponById, isLoading: loading } =
    useApproveCouponMutation();

  const { data: modalData } = useModalState();
  const { closeModal } = useModalAction();

  async function handleDelete() {
    ApproveCouponById(
      { id: modalData as string },
      {
        onSettled: () => {
          closeModal();
        },
      },
    );
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
      deleteBtnText="text-approve"
      icon={<CheckMarkCircle className="w-10 h-10 m-auto mt-4 text-accent" />}
      deleteBtnClassName="!bg-accent focus:outline-none hover:!bg-accent-hover focus:!bg-accent-hover"
      cancelBtnClassName="!bg-red-600 focus:outline-none hover:!bg-red-700 focus:!bg-red-700"
      title="text-approve-coupon"
      description="text-want-approve-coupon"
    />
  );
};

export default ApproveCouponView;
