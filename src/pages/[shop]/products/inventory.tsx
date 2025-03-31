import Card from '@/components/common/card';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import Search from '@/components/common/search';
import { useProductsQuery } from '@/data/product';
import { useRouter } from 'next/router';
import ProductInventoryList from '@/components/product/product-inventory-list';
import { useMeQuery } from '@/data/user';
import {
  adminAndOwnerOnly,
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useShopQuery } from '@/data/shop';
import ShopLayout from '@/components/layouts/shop';
import { Routes } from '@/config/routes';
import PageHeading from '@/components/common/page-heading';
import CategoryTypeFilter from '@/components/filters/category-type-filter';
import cn from 'classnames';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import { Category, SortOrder, Type } from '@/types';

interface ProductTypeOptions {
  name: string;
  slug: string;
}

export default function VendorProductInventoryPage() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData, isLoading: fetchingShop } = useShopQuery({
    slug: shop as string,
  });
  const shopId = shopData?.id!;
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(true);
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [productType, setProductType] = useState('');

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const { products, paginatorInfo, loading, error } = useProductsQuery({
    language: locale,
    name: searchTerm,
    limit: 20,
    page,
    orderBy,
    sortedBy,
    shop_id: shopId,
    categories: category,
    product_type: productType,
    type,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
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
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <PageHeading title={t('form:input-label-products')} />
          </div>

          <div className="flex w-full flex-col items-center ms-auto md:w-2/4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />
          </div>

          <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button>
        </div>

        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <CategoryTypeFilter
              className="w-full"
              type={type}
              onCategoryFilter={(category: Category) => {
                setCategory(category?.slug!);
                setPage(1);
              }}
              onTypeFilter={(type: Type) => {
                setType(type?.slug!);
                setPage(1);
              }}
              onProductTypeFilter={(productType: ProductTypeOptions) => {
                setProductType(productType?.slug!);
                setPage(1);
              }}
              enableCategory
              enableType
              enableProductType
            />
          </div>
        </div>
      </Card>

      <ProductInventoryList
        products={products}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

VendorProductInventoryPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
VendorProductInventoryPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
