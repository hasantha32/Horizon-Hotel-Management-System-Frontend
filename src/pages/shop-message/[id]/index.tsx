import Layout from '@/components/layouts/owner';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ownerAndStaffOnly } from '@/utils/auth-utils';
import MessagePageIndex from '@/components/message/index';
import { SUPER_ADMIN } from '@/utils/constants';
import { getAuthCredentials } from '@/utils/auth-utils';
import AccessDeniedPage from '@/components/common/access-denied';

export default function MessagePage() {
  const { permissions } = getAuthCredentials();
  return (
    <>
      {permissions?.includes(SUPER_ADMIN) ? (
        <AccessDeniedPage />
      ) : (
        <MessagePageIndex />
      )}
    </>
  );
}

MessagePage.authenticate = {
  permissions: ownerAndStaffOnly,
};

MessagePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
