import { useState } from 'react';
import PageHeading from '@/components/common/page-heading';
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import LinkButton from '@/components/ui/link-button';
import { LIMIT } from '@/utils/constants';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopLayout from '@/components/layouts/shop';
import {
  adminAndOwnerOnly,
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { useMeQuery } from '@/data/user';
import { useRouter } from 'next/router';
import { useShopQuery } from '@/data/shop';
import { Config } from '@/config';
import FlashSaleRequestLists from '@/components/flash-sale/vendor-request/flash-sale-vendor-request-list';
import { useRequestedListsForFlashSale } from '@/data/flash-sale-vendor-request';
import { SortOrder } from '@/types';

export default function FlashSaleVendorRequestLists() {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = useRouter();
  const {
    query: { shop },
  } = useRouter();
  const { permissions } = getAuthCredentials();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { data: me } = useMeQuery();
  const { data: shopData } = useShopQuery({
    slug: shop as string,
  });
  const shopId = shopData?.id!;

  const { flashSaleRequests, paginatorInfo, loading, error } =
    useRequestedListsForFlashSale({
      limit: LIMIT,
      orderBy,
      sortedBy,
      title: searchTerm,
      page,
      language: locale,
    });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/3 xl:mb-0">
          <PageHeading title="Lists of created flash sale requests." />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-2/4">
          <Search onSearch={handleSearch} />
        </div>
        {locale === Config.defaultLanguage && (
          <LinkButton
            href={`/${shop}/flash-sale/vendor-request/create`}
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span className="hidden xl:block">+ Create Request</span>
            <span className="xl:hidden">+ {t('form:button-label-add')}</span>
          </LinkButton>
        )}
      </Card>

      <FlashSaleRequestLists
        flashSaleRequests={flashSaleRequests}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
FlashSaleVendorRequestLists.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
FlashSaleVendorRequestLists.Layout = ShopLayout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
