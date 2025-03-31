import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useRouter } from 'next/router';
import { useFlashSaleQuery } from '@/data/flash-sale';
import CreateOrUpdateFlashSaleForm from '@/components/flash-sale/flash-sale-form';
import { adminOnly } from '@/utils/auth-utils';

export default function UpdateFlashSalePage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    flashSale: data,
    loading,
    error,
  } = useFlashSaleQuery({
    slug: query.slug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:item-description-edit')} {t('text-campaign')} :{' '}
          {`${data?.title}`}
        </h1>
      </div>
      <CreateOrUpdateFlashSaleForm initialValues={data} />
    </>
  );
}

UpdateFlashSalePage.authenticate = {
  permissions: adminOnly,
};

UpdateFlashSalePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
