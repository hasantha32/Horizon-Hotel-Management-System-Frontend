import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import CouponList from '@/components/coupon/coupon-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { Config } from '@/config';
import { Routes } from '@/config/routes';
import { useCouponsQuery } from '@/data/coupon';
import { useShopQuery } from '@/data/shop';
import { SortOrder } from '@/types';
import { adminOwnerAndStaffOnly, getAuthCredentials } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { STAFF, STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
import ShopLayout from '@/components/layouts/shop';
import { useSettingsQuery } from '@/data/settings';

export default function Coupons() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { role } = getAuthCredentials();
  const router = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchCoupon, setSearchCoupon] = useState('');
  const [page, setPage] = useState(1);
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData } = useShopQuery({ slug: shop as string });
  const shopId = shopData?.id!;
  const { settings, loading: settingsLoading } = useSettingsQuery({
    language: locale!,
  });
  const { coupons, loading, paginatorInfo, error } = useCouponsQuery({
    language: locale,
    limit: 20,
    page,
    code: searchCoupon,
    orderBy,
    sortedBy,
    shop_id: shopId,
  });

  if (loading || settingsLoading)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchCoupon(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  (role === STAFF || role === STORE_OWNER || role === SUPER_ADMIN) &&
  settings?.options?.enableCoupons
    ? ' '
    : router.replace(Routes.dashboard);

  return (
    <>
      <Card className="flex flex-col items-center mb-8 md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-coupons')} />
        </div>

        <div className="flex flex-col items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/2">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-code')}
          />

          {locale === Config.defaultLanguage && role !== STAFF && (
            <LinkButton
              href={`/${shop}/coupons/create`}
              className="w-full h-12 md:w-auto md:ms-6"
            >
              <span>+ {t('form:button-label-add-coupon')}</span>
            </LinkButton>
          )}
        </div>
      </Card>
      <CouponList
        coupons={coupons}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Coupons.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};

Coupons.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
