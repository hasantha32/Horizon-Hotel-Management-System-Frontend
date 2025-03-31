import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { ownerAndStaffOnly } from '@/utils/auth-utils';
import MessagePageIndex from '@/components/message/index';
import OwnerLayout from '@/components/layouts/owner';

const OwnerMessagePage = () => {
  return <MessagePageIndex />;
};

OwnerMessagePage.authenticate = {
  permissions: ownerAndStaffOnly,
};

OwnerMessagePage.Layout = OwnerLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

export default OwnerMessagePage;
