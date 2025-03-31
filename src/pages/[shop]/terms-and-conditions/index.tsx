import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useState, useEffect } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import { useTermsAndConditionsQuery } from '@/data/terms-and-condition';
import TermsAndConditionsLists from '@/components/terms-and-conditions/terms-and-conditions-list';
import { useShopQuery } from '@/data/shop';
import {
  adminAndOwnerOnly,
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useMeQuery } from '@/data/user';
import { Routes } from '@/config/routes';
import ShopLayout from '@/components/layouts/shop';
import { useSettingsQuery } from '@/data/settings';
import { useAdminsQuery } from '@/data/user';
import PageHeading from '@/components/common/page-heading';

export default function TermsAndConditions() {
  // at first fetch related data (e.g. settings, shop, user, terms etc)
  // then check if the current user is admin or vendor
  // if admin then there will be no restrictions
  // if vendor then it will run through permission code

  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);


  const { settings, loading: settingsLoading } = useSettingsQuery({
    language: locale!,
  });

  const {
    query: { shop },
  } = useRouter();
  const { data: shopData, isLoading } = useShopQuery({ slug: shop as string });
  const shopId = shopData?.id!;

  const { termsAndConditions, loading, paginatorInfo, error } =
    useTermsAndConditionsQuery({
      language: locale,
      limit: 20,
      page,
      title: searchTerm,
      orderBy,
      sortedBy,
      shop_id: shopId,
    });

  // const {
  //   admins,
  //   loading: adminLoading,
  //   error: adminError,
  // } = useAdminsQuery({
  //   limit: 1000,
  //   page: 1,
  //   orderBy: 'created_at',
  //   sortedBy: SortOrder.Desc as SortOrder,
  // });

  const handleSearch = ({ searchText }: { searchText: string }) => {
    setSearchTerm(searchText);
    setPage(1);
  };

  const handlePagination = (current: number) => {
    setPage(current);
  };

  if (settingsLoading || isLoading || loading)
    return <Loader text={t('common:text-loading')} />;

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  let currentUser = 'vendor';
  // if (
  //   admins.length > 0 &&
  //   admins?.map((user: any) => user.id).includes(me?.id)
  // ) {
  //   currentUser = 'admin';
  // } else {
  //   currentUser = 'vendor';
  // }

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

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('text-listed-terms-conditions')} />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-2/3 md:flex-row md:space-y-0 xl:w-3/4 2xl:w-1/2">
          <Search onSearch={handleSearch} />

          {locale === Config.defaultLanguage && (
            <LinkButton
              href={`/${shop}/terms-and-conditions/create`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="hidden xl:block">
                + {t('text-add-terms-conditions')}
              </span>
              <span className="xl:hidden">+ {t('form:button-label-add')}</span>
            </LinkButton>
          )}
        </div>
      </Card>
      <TermsAndConditionsLists
        termsAndConditions={termsAndConditions}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        user={me}
      />
    </>
  );
}

TermsAndConditions.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
TermsAndConditions.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
