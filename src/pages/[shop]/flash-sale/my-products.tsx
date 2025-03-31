import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import FlashSaleProductListForVendor from '@/components/flash-sale/flash-sale-product-list-for-vendor';
import ShopLayout from '@/components/layouts/shop';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { Routes } from '@/config/routes';
import { useProductsQuery } from '@/data/product';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';
import { SortOrder } from '@/types';
import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';

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

  const { data: shopData } = useShopQuery({
    slug: shop as string,
  });
  const { id: shop_id } = shopData ?? {};

  const { products, paginatorInfo, loading, error } = useProductsQuery(
    {
      language: locale,
      name: searchTerm,
      limit: 20,
      shop_id: shop_id,
      orderBy,
      sortedBy,
      page,
      flash_sale_builder: Boolean(true),
    },
    {
      enabled: Boolean(shop_id),
    }
  );

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
          <PageHeading title={t('form:form-title-my-products-flash-sales')} />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-2/4">
          <Search onSearch={handleSearch} />
        </div>
      </Card>

      <FlashSaleProductListForVendor
        products={products}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
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
