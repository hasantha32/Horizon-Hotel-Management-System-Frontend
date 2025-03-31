import AdminLayout from '@/components/layouts/admin';
import EventsSettingsForm from '@/components/settings/events';
import SettingsPageHeader from '@/components/settings/settings-page-header';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useSettingsQuery } from '@/data/settings';
import { adminOnly } from '@/utils/auth-utils';
import { Settings } from '@/types';
import { useShippingClassesQuery } from '@/data/shipping';
import { useTaxesQuery } from '@/data/tax';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

export default function EventsSettings() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { settings, loading, error } = useSettingsQuery({
    language: locale! as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <SettingsPageHeader pageTitle="form:form-title-events-settings" />
      <EventsSettingsForm settings={settings as Settings} />
    </>
  );
}
EventsSettings.authenticate = {
  permissions: adminOnly,
};
EventsSettings.Layout = AdminLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
