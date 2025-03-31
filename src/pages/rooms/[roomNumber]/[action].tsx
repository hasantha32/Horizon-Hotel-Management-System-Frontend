import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useRouter } from 'next/router';
import { useRoomQuery } from '@/data/room';
import CreateOrUpdateRoomForm from '@/components/room/room-form';

export default function UpdateCouponPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { room, loading, error } = useRoomQuery({
    room_number: query.roomNumber as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex pb-5 border-b border-dashed border-border-base md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          Edit Room
        </h1>
      </div>
      <CreateOrUpdateRoomForm initialValues={room} />
    </>
  );
}
UpdateCouponPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
