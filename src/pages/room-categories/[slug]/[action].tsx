import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useRoomCategoryQuery } from '@/data/room-category';
import CreateOrUpdateRoomCategoryForm from '@/components/roomCategory/room-category-form';
import { Config } from '@/config';

export default function UpdateRoomCategoryPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { roomCategory, loading, error } = useRoomCategoryQuery({
    slug: query.slug as string,
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
      <CreateOrUpdateRoomCategoryForm initialValues={roomCategory} />
    </>
  );
}
UpdateRoomCategoryPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
