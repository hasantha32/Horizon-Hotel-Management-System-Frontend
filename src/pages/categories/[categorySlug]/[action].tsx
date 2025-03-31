import Layout from '@/components/layouts/admin';
import CreateOrUpdateCategoriesForm from '@/components/category/category-form';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCategoryQuery, useCategoryQuery_v2 } from '@/data/category';
import { Config } from '@/config';

export default function UpdateCategoriesPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    category,
  } = useCategoryQuery({
    slug: query.categorySlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  console.log('slug: ', query.categorySlug)

  const {
    category_v2,
    isLoading: loading,
    error,
  } = useCategoryQuery_v2({
    slug: query.categorySlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  console.log('category :', category)
  console.log('category_v2 :', category_v2)

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-category')}
        </h1>
      </div>

      <CreateOrUpdateCategoriesForm initialValues={category_v2} />
    </>
  );
}

UpdateCategoriesPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
