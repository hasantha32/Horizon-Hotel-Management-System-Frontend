import Layout from '@/components/layouts/admin';
import CouponCreateOrUpdateForm from '@/components/coupon/coupon-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useCouponQuery } from '@/data/coupon';
import { useRouter } from 'next/router';
import ShopLayout from '@/components/layouts/shop';
import { adminOwnerAndStaffOnly, getAuthCredentials } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { STAFF, STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
import { useSettingsQuery } from '@/data/settings';

export default function UpdateCouponPage() {
  const { query, locale } = useRouter();
  const router = useRouter();
  const { t } = useTranslation();
  const { role } = getAuthCredentials();
  const { coupon, loading, error } = useCouponQuery({
    code: query.couponSlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });
  const { settings, loading: settingsLoading } = useSettingsQuery({
    language: locale!,
  });

  if (loading || settingsLoading)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  (role === STAFF || role === STORE_OWNER || role === SUPER_ADMIN) &&
  settings?.options?.enableCoupons
    ? ' '
    : router.replace(Routes.dashboard);

  return (
    <>
      <div className="flex pb-5 border-b border-dashed border-border-base md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-coupon')}
        </h1>
      </div>
      <CouponCreateOrUpdateForm initialValues={coupon} />
    </>
  );
}
UpdateCouponPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
UpdateCouponPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
