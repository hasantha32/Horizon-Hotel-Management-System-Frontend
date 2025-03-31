import Layout from '@/components/layouts/admin';
import StoreNoticeCreateOrUpdateForm from '@/components/store-notice/store-notice-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateStoreNoticePage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-store-notice')}
        </h1>
      </div>
      <StoreNoticeCreateOrUpdateForm />
    </>
  );
}
CreateStoreNoticePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
