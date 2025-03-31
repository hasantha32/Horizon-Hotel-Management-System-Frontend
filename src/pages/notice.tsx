import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ownerAndStaffOnly } from '@/utils/auth-utils';
import OwnerLayout from '@/components/layouts/owner';
import StoreNotices from '@/components/dashboard/shops/store-notices';

export default function StoreNoticePage() {
  return <StoreNotices />;
}

StoreNoticePage.authenticate = {
  permissions: ownerAndStaffOnly,
};

StoreNoticePage.Layout = OwnerLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
