import ForgotPasswordForm from '@/components/auth/forget-password/forget-password';
import AuthPageLayout from '@/components/layouts/auth-layout';
import { SUPER_ADMIN } from '@/utils/constants';
import { parseContextCookie } from '@/utils/parse-cookie';
import { Routes } from '@/config/routes';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps = async ({
  context,
  locale,
}: any) => {
  const cookies = parseContextCookie(context?.req?.headers?.cookie);
  if (cookies?.auth_token) {
    if (cookies?.auth_permissions?.includes(SUPER_ADMIN)) {
      return {
        redirect: { destination: Routes.dashboard, permanent: false },
      };
    }
  }
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'form'])),
    },
  };
};

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  return (
    <AuthPageLayout>
      <h3 className="mb-6 mt-4 text-center text-base italic text-body">
        {t('form:form-title-forgot-password')}
      </h3>
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}
