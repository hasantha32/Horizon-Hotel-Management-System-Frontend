import Card from '@/components/common/card';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';
import { LIMIT } from '@/utils/constants';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import ShopLayout from '@/components/layouts/shop';
import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import { SortOrder } from '@/types';
import { Config } from '@/config';
import { useMeQuery } from '@/data/user';
import { useShopQuery } from '@/data/shop';
import { useFlashSalesQuery } from '@/data/flash-sale';
import VendorFlashSaleLists from '@/components/flash-sale/flash-sale-list-for-vendors';
import PageHeading from '@/components/common/page-heading';

export default function VendorFlashSalePage() {
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { t } = useTranslation();
  const {
    query: { shop },
    locale,
  } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { flashSale, paginatorInfo, loading, error } = useFlashSalesQuery({
    limit: LIMIT,
    orderBy,
    sortedBy,
    title: searchTerm,
    page,
    language: locale,
  });

  const { data: shopData } = useShopQuery({
    slug: shop as string,
  });
  const { id: shop_id } = shopData ?? {};

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
    !me?.shops?.map((shop) => shop.id).includes(shop_id) &&
    me?.managed_shop?.id != shop_id
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/3 xl:mb-0">
          <PageHeading title={t('form:form-title-currently-flash-sales')} />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-2/4">
          <Search onSearch={handleSearch} />
        </div>
      </Card>

      <VendorFlashSaleLists
        flashSale={flashSale}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
VendorFlashSalePage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
VendorFlashSalePage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
