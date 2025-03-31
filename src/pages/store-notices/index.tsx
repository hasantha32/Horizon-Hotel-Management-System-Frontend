import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import StoreNoticeList from '@/components/store-notice/store-notice-list';
import LinkButton from '@/components/ui/link-button';
import { useState, useEffect } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { useStoreNoticesQuery } from '@/data/store-notice';
import { useRouter } from 'next/router';
import { Config } from '@/config';
import PageHeading from '@/components/common/page-heading';
// import Pusher from 'pusher-js';

export default function StoreNotices() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  // const [message, setMessage] = useState([]);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { storeNotices, loading, paginatorInfo, error } = useStoreNoticesQuery({
    language: locale,
    limit: 20,
    page,
    notice: searchTerm,
    orderBy,
    sortedBy,
  });

  let allMessage: any = [];

  // useEffect(() => {
  //   // Enable pusher logging - don't include this in production
  //   Pusher.logToConsole = true;

  //   const pusher = new Pusher('4ef94e52833c9542eadc', {
  //     cluster: 'ap2',
  //   });

  //   const channel = pusher.subscribe('store_notice.created');
  //   channel.bind('TestPusherEvent', function (data: any) {
  //     allMessage.push(data);
  //     setMessage(allMessage);
  //     alert(JSON.stringify(data));
  //   });
  // }, [storeNotices]);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-store-notices')} />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-2/3 md:flex-row md:space-y-0 xl:w-3/4 2xl:w-1/2">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-notice')}
          />

          {locale === Config.defaultLanguage && (
            <LinkButton
              href="/store-notices/create"
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="hidden xl:block">
                + {t('form:button-label-add-store-notice')}
              </span>
              <span className="xl:hidden">+ {t('form:button-label-add')}</span>
            </LinkButton>
          )}
        </div>
      </Card>
      <StoreNoticeList
        storeNotices={storeNotices}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

StoreNotices.authenticate = {
  permissions: adminOnly,
};

StoreNotices.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
