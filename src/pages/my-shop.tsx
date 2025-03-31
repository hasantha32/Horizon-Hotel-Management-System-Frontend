import OwnerLayout from '@/components/layouts/owner';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { ownerAndStaffOnly } from '@/utils/auth-utils';
import ShopList from '@/components/dashboard/shops/shops';

const MyShop = () => {
  return <ShopList />;
};

MyShop.authenticate = {
  permissions: ownerAndStaffOnly,
};

MyShop.Layout = OwnerLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

export default MyShop;
