import CreateOrUpdateFlashSaleForm from '@/components/flash-sale/flash-sale-form';
import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
export default function CreateFlashSalePage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-flash-sale')}
        </h1>
      </div>
      <CreateOrUpdateFlashSaleForm />
    </>
  );
}

CreateFlashSalePage.authenticate = {
  permissions: adminOnly,
};

CreateFlashSalePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
