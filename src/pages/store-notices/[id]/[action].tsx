import Layout from '@/components/layouts/admin';
import StoreNoticeCreateOrUpdateForm from '@/components/store-notice/store-notice-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useStoreNoticeQuery } from '@/data/store-notice';
import { useRouter } from 'next/router';

export default function UpdateStoreNoticePage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { storeNotice, loading, error } = useStoreNoticeQuery({
    id: query.id as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-store-notice')}
        </h1>
      </div>
      <StoreNoticeCreateOrUpdateForm initialValues={storeNotice} />
    </>
  );
}
UpdateStoreNoticePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
