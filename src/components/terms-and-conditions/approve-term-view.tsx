import { Form } from '@/components/ui/form/form';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
import { useApproveTermAndConditionMutation } from '@/data/terms-and-condition';

const ApproveShopView = () => {
  const { t } = useTranslation();
  const { mutate: approveTermMutation, isLoading: loading } =
    useApproveTermAndConditionMutation();

  const { data: shopId } = useModalState();
  const { closeModal } = useModalAction();

  function onSubmit() {
    approveTermMutation({
      id: shopId as string,
    });
    closeModal();
  }

  return (
    <Form onSubmit={onSubmit}>
      {({ register, formState: { errors } }) => (
        <div className="m-auto flex w-full max-w-sm flex-col rounded bg-light p-5 sm:w-[24rem]">
          <h2 className="mb-4 text-lg font-semibold text-muted-black">
            {t('form:form-title-do-you-approve')}
          </h2>
          <div>
            <Button type="submit" loading={loading} disabled={loading}>
              {t('form:button-label-submit')}
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
};

export default ApproveShopView;
