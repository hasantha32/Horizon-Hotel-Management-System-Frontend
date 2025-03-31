import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreateOrUpdateTagForm from '@/components/tag/tag-form';
import { adminOnly } from '@/utils/auth-utils';
import { useTagQuery } from '@/data/tag';
import { Config } from '@/config';
import HotelForm from '@/components/hotel/hotel-form';
import { useHotelQuery } from '@/data/hotels';

export default function HotelDetailsPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { hotel, isLoading, error } = useHotelQuery();

  console.log('hotel: ', hotel)

  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex pb-5 border-b border-dashed border-border-base md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          Hotel Details
        </h1>
      </div>

      <HotelForm initialValues={hotel} />
    </>
  );
}
HotelDetailsPage.authenticate = {
  permissions: adminOnly,
};
HotelDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
