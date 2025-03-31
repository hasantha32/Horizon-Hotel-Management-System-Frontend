import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useFlashSaleQuery } from '@/data/flash-sale';
import FlashSaleProductList from '@/components/flash-sale/flash-sale-product-list';
import { adminOnly } from '@/utils/auth-utils';
import SingleView from '@/components/flash-sale/single-view';
import { FlashSale } from '@/types';
import { useProductsByFlashSaleQuery } from '@/data/product';
import { useCallback, useState } from 'react';
import { SortOrder } from '@/types';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const FlashSalePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    flashSale: data,
    loading,
    error,
  } = useFlashSaleQuery({
    slug: query?.slug as string,
    language: locale as string,
  });

  const {
    products,
    paginatorInfo,
    error: errorProducts,
    loading: loadingProducts,
  } = useProductsByFlashSaleQuery({
    name: searchTerm,
    slug: query?.slug as string,
    language: locale as string,
    limit: limit ?? 5,
    page: page ?? 1,
    // orderBy,
    // sortedBy,
  });

  const handleOnLimitChange = useCallback(
    (params: { value: number; name: number }) => {
      setLimit(params?.value);
      setPage(1);
    },
    [setLimit, setPage]
  );

  const handleSearch = useCallback(
    ({ searchText }: { searchText: string }) => {
      setSearchTerm(searchText);
      setPage(1);
    },
    [setSearchTerm, setPage]
  );

  const handlePagination = useCallback(
    (current: any) => {
      setPage(current);
    },
    [setPage]
  );

  if (loading || loadingProducts)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <SingleView data={data as FlashSale} className="mb-10" />
      <FlashSaleProductList
        products={products}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        handleSearch={handleSearch}
        handleOnLimitChange={handleOnLimitChange}
        type={data?.type as FlashSale['type']}
        rate={data?.rate as FlashSale['rate']}
      />
    </>
  );
};

FlashSalePage.authenticate = {
  permissions: adminOnly,
};

FlashSalePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'table', 'form'])),
  },
});

export default FlashSalePage;
