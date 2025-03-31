import Button from '@/components/ui/button';
import {
  useResendVerificationEmail,
  useLogoutMutation,
  useMeQuery,
} from '@/data/user';

import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import AuthPageLayout from '@/components/layouts/auth-layout';

import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getEmailVerified } from '@/utils/auth-utils';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

export default function VerifyEmailActions() {
  const { t } = useTranslation('common');
  useMeQuery();

  const { mutate: logout, isLoading: isLoading } = useLogoutMutation();
  const { mutate: verifyEmail, isLoading: isVerifying } =
    useResendVerificationEmail();
  const router = useRouter();
  const { emailVerified } = getEmailVerified();
  if (emailVerified) {
    router.push(Routes.dashboard);
  }

  return (
    <>
      <AuthPageLayout>
        <h3 className="mt-4 mb-6 text-center text-base italic text-red-500 text-body">
          {t('common:email-not-verified')}
        </h3>
        <div className="w-full space-y-3">
          <Button
            onClick={() => verifyEmail()}
            disabled={isVerifying}
            className="w-full"
          >
            {t('common:text-resend-verification-email')}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            className="w-full"
            onClick={() => logout()}
          >
            {t('common:authorized-nav-item-logout')}
          </Button>
        </div>
      </AuthPageLayout>
    </>
  );
}
