import ShopLayout from '@/components/layouts/shop';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useRouter } from 'next/router';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
  ownerOnly,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';
import { useTermsAndConditionQuery } from '@/data/terms-and-condition';
import CreateOrUpdateTermsAndConditionsForm from '@/components/terms-and-conditions/terms-and-conditions-form';
import { useSettingsQuery } from '@/data/settings';

export default function UpdateTermsAndConditionsPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { data: shopData, isLoading } = useShopQuery({
    slug: query?.shop as string,
  });
  const shopId = shopData?.id!;
  const { termsAndConditions, loading, error } = useTermsAndConditionQuery({
    slug: query.termSlug as string,
    language: locale as string,
  });

  const { settings, loading: settingsLoading } = useSettingsQuery({
    language: locale as string,
  });

  if (loading || isLoading || settingsLoading) return <Loader text={t('common:text-loading')} />;

  // if (
  //   !hasAccess(adminOnly, permissions) &&
  //   !me?.shops?.map((shop) => shop?.id).includes(shopId) &&
  //   me?.managed_shop?.id != shopId
  // ) {
  //   router.replace(Routes?.dashboard);
  // }

  let currentUser = 'vendor';

  if (currentUser === 'vendor') {
    const isEnableTermsRoute = settings?.options?.enableTerms;
    const routePermission = isEnableTermsRoute ? adminAndOwnerOnly : adminOnly;
    const isSuperAdmin = hasAccess(adminOnly, permissions)
    const hasPermission = hasAccess(routePermission, permissions);
    const vendorHasShop =
      me?.shops?.map((shop: any) => shop.id).includes(shopId) ?? true;
    const shouldRedirect = (!hasPermission || !vendorHasShop) && !isSuperAdmin;
    if (shouldRedirect) {
      router.replace(Routes.dashboard);
    }
  }

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-store-notice')}
        </h1>
      </div>
      <CreateOrUpdateTermsAndConditionsForm
        initialValues={termsAndConditions}
      />
    </>
  );
}
UpdateTermsAndConditionsPage.authenticate = {
  permissions: ownerOnly,
};
UpdateTermsAndConditionsPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
