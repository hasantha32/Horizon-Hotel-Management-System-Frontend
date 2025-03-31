import ShopLayout from '@/components/layouts/shop';
import CreateOrUpdateTermsAndConditionsForm from '@/components/terms-and-conditions/terms-and-conditions-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';
import { useRouter } from 'next/router';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
  ownerOnly,
} from '@/utils/auth-utils';
import { useSettingsQuery } from '@/data/settings';
import Loader from '@/components/ui/loader/loader';
import { useEffect } from 'react';

export default function CreateTermsAndConditionsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    query: { shop },
    locale,
  } = router;
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { data: shopData, isLoading } = useShopQuery({
    slug: shop as string,
  });
  const shopId = shopData?.id!;

  const { settings, loading } = useSettingsQuery({
    language: locale as string,
  });

  if (isLoading || loading) return <Loader text={t('common:text-loading')} />;

  // if (
  //   !hasAccess(adminOnly, permissions) &&
  //   !me?.shops?.map((shop: any) => shop.id).includes(shopId) &&
  //   me?.managed_shop?.id != shopId
  // ) {
  //   router.replace(Routes.dashboard);
  // }
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
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('text-create-terms-conditions')}
        </h1>
      </div>
      <CreateOrUpdateTermsAndConditionsForm />
    </>
  );
}

CreateTermsAndConditionsPage.authenticate = {
  permissions: ownerOnly,
};
CreateTermsAndConditionsPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
