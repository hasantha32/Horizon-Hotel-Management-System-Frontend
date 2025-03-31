import Card from '@/components/common/card';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopLayout from '@/components/layouts/shop';
import { useRouter } from 'next/router';
import StaffList from '@/components/shop/staff-list';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import ErrorMessage from '@/components/ui/error-message';
import { useShopQuery } from '@/data/shop';
import { useStaffsQuery } from '@/data/staff';
import { useState } from 'react';
import { SortOrder } from '@/types';
import { Routes } from '@/config/routes';
import { useMeQuery } from '@/data/user';
import PageHeading from '@/components/common/page-heading';

export default function StaffsPage() {
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const {
    query: { shop },
  } = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { data: shopData, isLoading: fetchingShopId } = useShopQuery({
    slug: shop as string,
  });

  const shopId = shopData?.id!;
  const {
    staffs,
    paginatorInfo,
    loading: loading,
    error,
  } = useStaffsQuery(
    {
      shop_id: shopId,
      page,
      orderBy,
      sortedBy,
    },
    {
      enabled: Boolean(shopId),
    }
  );
  if (fetchingShopId || loading)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error?.message} />;

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
      <Card className="mb-8 flex flex-row items-center justify-between">
        <div className="md:w-1/4">
          <PageHeading title={t('form:text-staff')} />
        </div>

        <div className="flex w-3/4 items-center ms-auto xl:w-2/4">
          <LinkButton href={`/${shop}/staffs/create`} className="h-12 ms-auto">
            <span>+ {t('form:button-label-add-staff')}</span>
          </LinkButton>
        </div>
      </Card>

      <StaffList
        staffs={staffs}
        onPagination={handlePagination}
        paginatorInfo={paginatorInfo}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
StaffsPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
StaffsPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
