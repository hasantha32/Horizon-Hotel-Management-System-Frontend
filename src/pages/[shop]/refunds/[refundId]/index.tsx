import ShopLayout from '@/components/layouts/shop';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import RefundDetailsView from '@/components/refund/refund-details-view';
import { useRefundQuery } from '@/data/refund';
import shop from '@/components/layouts/shop';
import { Routes } from '@/config/routes';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';

export default function RefundDetailsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { query } = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { data: shopData } = useShopQuery({
    slug: query?.shop as string,
  });
  const shopId = shopData?.id!;
  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  const {
    data,
    isLoading: loading,
    error,
  } = useRefundQuery(query.refundId as string);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return <RefundDetailsView refund={data} canChangeStatus={false} />;
}
RefundDetailsPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
RefundDetailsPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
