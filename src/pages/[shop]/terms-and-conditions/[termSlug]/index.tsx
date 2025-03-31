import ShopLayout from '@/components/layouts/shop';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ownerOnly } from '@/utils/auth-utils';
import { useTermsAndConditionQuery } from '@/data/terms-and-condition';
import TermsAndConditionsDetails from '@/components/terms-and-conditions/details-view';
import { TermsAndConditions } from '@/types';
import { useSettingsQuery } from '@/data/settings';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useMeQuery } from '@/data/user';
import { useShopQuery } from '@/data/shop';
import { Routes } from '@/config/routes';
import { Config } from '@/config';

const TermsAndConditionsPage = () => {
  const router = useRouter();
  const { query, locale } = router;
  const {
    query: { shop },
  } = router;
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { termsAndConditions, loading, error } = useTermsAndConditionQuery({
    slug: query.termSlug as string,
    language: locale as string,
  });

  const { settings } = useSettingsQuery({
    language: locale as string,
  });

  const { data: shopData, isLoading } = useShopQuery({ slug: shop as string });
  const shopId = shopData?.id!;

  if (loading || isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  let currentUser = 'vendor';

  if (currentUser === 'vendor') {
    const isEnableTermsRoute = settings?.options?.enableTerms;
    const routePermission = isEnableTermsRoute ? adminAndOwnerOnly : adminOnly;
    const isSuperAdmin = hasAccess(adminOnly, permissions);
    const hasPermission = hasAccess(routePermission, permissions);
    const vendorHasShop =
      me?.shops?.map((shop: any) => shop.id).includes(shopId) ?? true;
    const shouldRedirect = (!hasPermission || !vendorHasShop) && !isSuperAdmin;
    if (shouldRedirect) {
      router.replace(Routes.dashboard);
    }
  }

  return (
    <TermsAndConditionsDetails
      termsAndConditions={termsAndConditions as TermsAndConditions}
    />
  );
};

TermsAndConditionsPage.authenticate = {
  permissions: ownerOnly,
};
TermsAndConditionsPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default TermsAndConditionsPage;
