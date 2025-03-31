import Layout from '@/components/layouts/admin';
import CouponCreateOrUpdateForm from '@/components/coupon/coupon-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreateOrUpdateRoomForm from '@/components/room/room-form';

export default function CreateRoomPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-room')}
        </h1>
      </div>
      <CreateOrUpdateRoomForm />
    </>
  );
}
CreateRoomPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
