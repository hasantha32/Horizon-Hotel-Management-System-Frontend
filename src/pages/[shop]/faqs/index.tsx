import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import LinkButton from '@/components/ui/link-button';
import { useState, useEffect } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { useStoreNoticesQuery } from '@/data/store-notice';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import FaqsLists from '@/components/faqs/faqs-list';
import { useFaqsQuery } from '@/data/faqs';
import { useShopQuery } from '@/data/shop';
import {
  adminOwnerAndStaffOnly,
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useMeQuery } from '@/data/user';
import { Routes } from '@/config/routes';
import ShopLayout from '@/components/layouts/shop';
import PageHeading from '@/components/common/page-heading';

export default function Faqs() {
  // at first fetch related data (e.g. settings, shop, user, terms etc)
  // if vendor/staff/admin then it will run through permission code

  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData } = useShopQuery({ slug: shop as string });
  const shopId = shopData?.id!;

  const { faqs, loading, paginatorInfo, error } = useFaqsQuery({
    language: locale,
    limit: 20,
    page,
    faq_title: searchTerm,
    orderBy,
    sortedBy,
    shop_id: shopId,
  });

  const handleSearch = ({ searchText }: { searchText: string }) => {
    setSearchTerm(searchText);
    setPage(1);
  };

  const handlePagination = (current: number) => {
    setPage(current);
  };

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:form-title-faqs')} />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-2/3 md:flex-row md:space-y-0 xl:w-3/4 2xl:w-1/2">
          <Search onSearch={handleSearch} />

          {locale === Config.defaultLanguage && (
            <LinkButton
              href={`/${shop}/faqs/create`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="hidden xl:block">
                + {t('form:button-label-add-faq')}
              </span>
              <span className="xl:hidden">+ {t('form:button-label-add')}</span>
            </LinkButton>
          )}
        </div>
      </Card>
      <FaqsLists
        faqs={faqs}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Faqs.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};

Faqs.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
