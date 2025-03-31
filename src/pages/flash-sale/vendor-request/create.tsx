import CreateOrUpdateVendorProductsRequestFlashSaleForm from '@/components/flash-sale/vendor-request/flash-sale-vendor-product-request-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/layouts/admin';
import { adminOnly } from '@/utils/auth-utils';
import { useRouter } from 'next/router';

export default function VendorProductsRequestForFlashSale() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <div className="flex pb-5 border-b border-dashed border-border-base md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:create-new-vendor-request')}
        </h1>
      </div>
      <CreateOrUpdateVendorProductsRequestFlashSaleForm />
    </>
  );
}
VendorProductsRequestForFlashSale.authenticate = {
  permissions: adminOnly,
};
VendorProductsRequestForFlashSale.Layout = Layout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form'])),
  },
});
