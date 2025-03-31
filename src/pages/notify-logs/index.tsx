import Card from '@/components/common/card';
import Select from '@/components/ui/select/select';
import Layout from '@/components/layouts/admin';
import { useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import { Routes } from '@/config/routes';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { useOrderQuery } from '@/data/order';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
  useNotifyLogReadMutation,
  useNotifyLogsQuery,
} from '@/data/notify-logs';
import { useMeQuery } from '@/data/user';
import Avatar from '@/components/common/avatar';
import cn from 'classnames';
import { ActionMeta } from 'react-select';
import { SortOrder } from '@/types';
import NotFound from '@/components/ui/not-found';
import PageHeading from '@/components/common/page-heading';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const NotifyLogItem = ({ item }: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { locale } = useRouter();

  const { mutate: seenNotifyLog, isLoading: creating } =
    useNotifyLogReadMutation();

  const { order } = useOrderQuery({
    // id: item?.notify_type === 'order' ? item?.notify_tracker : '',
    id: item?.notify_tracker,
    language: locale!,
  });

  let notifyLogText = '';
  switch (item?.notify_type) {
    case 'order':
      notifyLogText = 'text-created-new-order';
      break;

    case 'message':
      notifyLogText = 'text-sent-new-message';
      break;
  }

  const handleClickOnNotification = (value: any) => {
    seenNotifyLog({ input: value });

    // prepare url for admin & vendor
    let redirectTo;
    switch (value?.notify_type) {
      case 'order':
        //@ts-ignore
        const shopURL = order?.shop?.slug;
        redirectTo = permissions?.includes('super_admin')
          ? Routes?.order?.details(value?.notify_tracker)
          : shopURL + Routes?.order?.details(value?.notify_tracker);

        router.push('/' + redirectTo);
        break;

      case 'message':
        //@ts-ignore
        redirectTo = Routes?.message?.details(value?.notify_tracker);

        router.push('/' + redirectTo);
        break;
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative flex cursor-pointer rounded-lg bg-white p-4 border-s-4 before:absolute before:top-1/2 before:h-2.5 before:w-2.5 before:-translate-y-1/2 before:rounded-full before:bg-accent before:opacity-0 before:content-[''] before:end-4 md:before:end-7 xl:p-7",
          item?.is_read ? 'border-gray-300' : 'border-accent before:opacity-100'
        )}
        onClick={() => handleClickOnNotification(item)}
      >
        <Avatar
          name={item?.user?.name}
          size="lg"
          src={item?.sender_user?.profile?.avatar?.thumbnail}
        />
        <div className="ps-4">
          <div className="mb-0.5 gap-2 text-[15px]">
            <span className="font-semibold text-heading">
              {item?.user?.name}
            </span>{' '}
            {t(notifyLogText)}
            {item?.notify_type !== 'message' ? (
              <span
                className={cn(
                  'inline-block font-medium text-accent hover:text-accent',
                  item?.is_read ? 'text-gray-500/80' : 'text-accent'
                )}
              >
                #{item?.notify_tracker}
              </span>
            ) : (
              ''
            )}
          </div>
          <span
            className={cn(
              'text-sm font-medium',
              item?.is_read ? 'text-gray-500/80' : 'text-accent'
            )}
          >
            {dayjs(item?.created_at).format('MMM DD, YYYY')} at{' '}
            {dayjs(item?.created_at).format('hh:mm A')}
          </span>
        </div>
      </div>
    </>
  );
};

type Props = {
  showTargetFilter?: boolean;
  showReadStatusFilter?: boolean;
  onReadStatusFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onTargetFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
};

function NotificationFilter({
  showTargetFilter,
  showReadStatusFilter,
  onReadStatusFilter,
  onTargetFilter,
  className,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className={cn('flex w-full', className)}>
      {showTargetFilter && (
        <div className="w-full pr-3">
          <Select
            options={[
              {
                name: 'All',
                value: '',
              },
              {
                name: 'Order',
                value: 'order',
              },
              {
                name: 'Messages',
                value: 'message',
              },
            ]}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.value}
            placeholder={t('common:filter-by-notification-type')}
            onChange={onTargetFilter}
            isClearable={true}
            defaultValue={[
              {
                name: 'All',
                value: '',
              },
            ]}
          />
        </div>
      )}

      {showReadStatusFilter && (
        <div className="w-full">
          <Select
            options={[
              {
                name: 'All',
                value: '',
              },
              {
                name: 'Unread',
                value: '0',
              },
              {
                name: 'Read',
                value: '1',
              },
            ]}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.value}
            placeholder={t('common:filter-by-notification-type')}
            onChange={onReadStatusFilter}
            isClearable={true}
            defaultValue={[
              {
                name: 'All',
                value: '',
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}

export default function NotifyLogsPage() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [target, setTarget] = useState<string>();
  const [page, setPage] = useState(1);
  const [readStatus, setReadStatus] = useState<string>();
  const { data, isLoading: loading, error } = useMeQuery();

  const {
    notifyLogs,
    loading: loadingLogs,
    paginatorInfo,
    error: errorLogs,
  } = useNotifyLogsQuery({
    receiver: data?.id,
    notify_type: target,
    language: locale,
    limit: 30,
    orderBy: 'created_at',
    sortedBy: SortOrder.Desc,
    page,
  });

  if (loadingLogs) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:form-title-all-notifications')} />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-2/3 md:flex-row md:space-y-0 xl:w-3/4 2xl:w-2/5">
          <NotificationFilter
            className="md:ms-6"
            onTargetFilter={(target: any) => {
              setTarget(target?.value!);
              setPage(1);
            }}
            onReadStatusFilter={(readStatus: any) => {
              setReadStatus(readStatus?.value!);
              setPage(1);
            }}
            showTargetFilter
            // showReadStatusFilter
          />
        </div>
      </Card>

      <div className={`space-y-3.5`}>
        {notifyLogs ? (
          notifyLogs?.map((item: any) => {
            return <NotifyLogItem item={item} key={item.id} />;
          })
        ) : (
          <NotFound text="text-no-log-found" className="mx-auto w-7/12" />
        )}
      </div>
    </>
  );
}

NotifyLogsPage.authenticate = {
  permissions: adminOnly,
};

NotifyLogsPage.Layout = Layout;
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
