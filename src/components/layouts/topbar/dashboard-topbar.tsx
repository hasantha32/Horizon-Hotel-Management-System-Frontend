import { useRouter } from 'next/router';
import { useSettingsQuery } from '@/data/settings';
import VisitStore from '@/components/layouts/topbar/visit-store';
import SearchBar from '@/components/layouts/topbar/search-bar';
import MessageBar from '@/components/layouts/topbar/message-bar';
import StoreNoticeBar from '@/components/layouts/topbar/store-notice-bar';
import RecentOrderBar from '@/components/layouts/topbar/recent-order-bar';
import { useMeQuery } from '@/data/user';

type IProps = {};

const DashboardTopBar = ({}: IProps) => {
  const { locale } = useRouter();
  const { data, isLoading: meLoading, error: meError } = useMeQuery();
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <VisitStore />
        <SearchBar />

        {options?.pushNotification?.all?.message ? (
          <MessageBar user={data} />
        ) : (
          ''
        )}

        {options?.pushNotification?.all?.storeNotice ? (
          <StoreNoticeBar user={data} />
        ) : (
          ''
        )}

        {options?.pushNotification?.all?.order ? (
          <RecentOrderBar user={data} />
        ) : (
          ''
        )}
      </div>
    </>
  );
};

export default DashboardTopBar;
