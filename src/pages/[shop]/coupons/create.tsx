import CouponCreateOrUpdateForm from '@/components/coupon/coupon-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOwnerAndStaffOnly, getAuthCredentials } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import ShopLayout from '@/components/layouts/shop';
import { STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
import { useSettingsQuery } from '@/data/settings';
import Loader from '@/components/ui/loader/loader';

export default function CreateCouponPage() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter();
  const { role } = getAuthCredentials();
  const { settings, loading: settingsLoading } = useSettingsQuery({
    language: locale!,
  });

  if (settingsLoading) return <Loader text={t('common:text-loading')} />;

  (role === STORE_OWNER || role === SUPER_ADMIN) &&
  settings?.options?.enableCoupons
    ? ' '
    : router.replace(Routes.dashboard);

  return (
    <>
      <div className="flex pb-5 border-b border-dashed border-border-base md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-coupon')}
        </h1>
      </div>
      <CouponCreateOrUpdateForm />
    </>
  );
}
CreateCouponPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
CreateCouponPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
