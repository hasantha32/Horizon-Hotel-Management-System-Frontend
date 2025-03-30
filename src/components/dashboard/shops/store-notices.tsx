import ErrorMessage from '@/components/ui/error-message';
import { useTranslation } from 'next-i18next';
import { useStoreNoticesLoadMoreQuery } from '@/data/store-notice';
import { SortOrder, StoreNotice } from '@/types';
import StoreNoticeCard from '@/components/store-notice/store-notice-card';
import Button from '@/components/ui/button';
import { NoShop } from '@/components/icons/no-shop';
import { LIMIT } from '@/utils/constants';
import NotFound from '@/components/ui/not-found';
import Loader from '@/components/ui/loader/loader';
import { useMeQuery } from '@/data/user';

function StoreNotices() {
  const { t } = useTranslation();
  const { data } = useMeQuery();
  const { storeNotices, loading, error, hasNextPage, isLoadingMore, loadMore } =
    useStoreNoticesLoadMoreQuery(
      {
        limit: LIMIT,
        orderBy: 'effective_from',
        sortedBy: SortOrder.Asc,
        'users.id': data?.id!,
      },
      {
        enabled: Boolean(data?.id!),
      }
    );
  const sortedData = [...storeNotices].reverse();

  if (!loading && !storeNotices?.length)
    return (
      <div className="flex h-full w-full items-center justify-center px-4 pt-6 pb-8 lg:p-8">
        <NotFound
          image="/no-store-notice.svg"
          text="text-notice-not-found"
          className="w-1/3"
        />
      </div>
    );

  if (loading) {
    return <Loader />;
  }

  if (error) return <ErrorMessage message={error?.message} />;

  return (
    <>
      <h2 className="mb-7 border-b border-b-[#E5E5E5] pb-[1.625rem] text-2xl font-semibold leading-none text-muted-black">
        {t('sidebar-nav-item-store-notice')}
      </h2>
      {storeNotices ? (
        <div className="space-y-4 md:space-y-7">
          {sortedData?.map((notice: StoreNotice, idx: number) => (
            <StoreNoticeCard noticeData={notice} key={idx} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-6">
          <div className="relative w-72 sm:h-80 sm:w-96">
            <NoShop />
          </div>
          <div className="pt-5 text-sm font-semibold">
            {t('common:text-empty-notice')}
          </div>
        </div>
      )}

      {hasNextPage && (
        <div className="mt-8 grid place-content-center md:mt-10">
          <Button onClick={loadMore} loading={isLoadingMore}>
            {t('common:text-load-more')}
          </Button>
        </div>
      )}
    </>
  );
}

export default StoreNotices;
