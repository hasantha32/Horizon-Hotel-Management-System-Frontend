import cn from 'classnames';
import {
  useNotifyLogAllReadMutation,
  useNotifyLogReadMutation,
  useNotifyLogsQuery,
} from '@/data/notify-logs';
import { ShoppingBagIcon } from '@/components/icons/sidebar/shopping-bag';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { SortOrder } from '@/types';
import Link from '@/components/ui/link';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import { PusherConfig } from '@/utils/pusher-config';
import { toast } from 'react-toastify';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { useOrderQuery } from '@/data/order';
import { Config } from '@/config';

type IProps = {
  user: any;
};

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const NotifyLogItem = ({ item }: any) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { permissions } = getAuthCredentials();
  const router = useRouter();
  const { mutate: seenNotifyLog, isLoading: creating } =
    useNotifyLogReadMutation();

  const { order } = useOrderQuery({
    id: item?.notify_tracker,
    language: locale!,
  });

  const handleClickOnNotification = (value: any) => {
    seenNotifyLog({ input: value });

    // prepare url for admin & vendor
    const shopURL = order?.shop?.slug;
    const redirectTo = permissions?.includes('super_admin')
      ? Routes?.order?.details(value?.notify_tracker)
      : shopURL + Routes?.order?.details(value?.notify_tracker);

    router.push('/' + redirectTo);
  };

  return (
    <>
      <div
        onClick={() => handleClickOnNotification(item)}
        className={cn(
          "relative flex gap-2 rounded-md py-3.5 px-6 text-sm font-semibold capitalize transition duration-200 before:absolute before:top-5 before:h-2 before:w-2 before:rounded-full before:bg-accent before:opacity-0 before:content-[''] before:start-2 hover:text-accent group-hover:bg-gray-100/70",
          item?.is_read == false ? 'before:opacity-100' : null
        )}
      >
        <div className="overflow-hidden">
          <h3
            className={cn(
              'truncate text-sm font-medium',
              item?.is_read ? 'text-[#666]' : ''
            )}
          >
            {t('text-order')}:{' '}
            <span className="inline-block font-bold hover:text-accent">
              #{item?.notify_tracker}
            </span>{' '}
            {t('text-is-created')}.
          </h3>
          <span className="mt-2 block text-xs font-medium text-[#666666]">
            {dayjs(item?.created_at).format('MMM DD, YYYY')} at{' '}
            {dayjs(item?.created_at).format('hh:mm A')}
          </span>
        </div>
      </div>
    </>
  );
};

const RecentOrderBar = ({ user }: IProps) => {
  const { t } = useTranslation();
  const [orderOpen, setOrderOpen] = useState(false);
  const [order, setOrder] = useState([]);
  const { permissions } = getAuthCredentials();
  const permission = hasAccess(adminOnly, permissions);
  const { mutate: readAllNotifyLogs, isLoading: creating } =
    useNotifyLogAllReadMutation();
  let allOrder: any = [];

  const { notifyLogs } = useNotifyLogsQuery({
    notify_type: 'order',
    limit: 5,
    orderBy: 'created_at',
    sortedBy: SortOrder.Desc as SortOrder,
  });

  const markAllAsRead = () => {
    readAllNotifyLogs({
      set_all_read: true,
      notify_type: 'order',
      receiver: user?.id,
    });
  };

  const activeStatus = notifyLogs.filter((item) => {
    return Boolean(item?.is_read) === false;
  });

  useEffect(() => {
    if (Config.broadcastDriver === 'pusher' && Config.pusherEnable === 'true') {
      const channelName =
        `${process.env.NEXT_PUBLIC_ORDER_CREATED_CHANNEL_PRIVATE}` +
        '.' +
        user?.id;
      const channel = PusherConfig.subscribe(channelName);

      channel.bind(
        `${process.env.NEXT_PUBLIC_ORDER_CREATED_EVENT}`,
        function (data: any) {
          allOrder.push(data);
          setOrder(allOrder);
          toast.success(data?.message, {
            toastId: 'orderSuccess',
          });
        }
      );
      return () => {
        PusherConfig.unsubscribe(channelName);
      };
    } else {
      PusherConfig.disconnect();
    }
  }, [order]);

  return (
    <>
      <Menu as="div" className="inline-block text-left sm:relative">
        <Menu.Button
          className={cn(
            'relative flex h-9 w-9 items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 text-gray-600 before:absolute before:top-0 before:right-0 before:h-2 before:w-2 before:rounded-full focus:outline-none data-[headlessui-state=open]:bg-white data-[headlessui-state=open]:text-accent',
            activeStatus.length > 0 ? 'before:bg-[#3080F8]' : ''
          )}
        >
          <ShoppingBagIcon
            className="h-5 w-5"
            onClick={() => setOrderOpen(!orderOpen)}
          />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            as="div"
            className="absolute top-16 z-30 w-80 rounded-lg border border-gray-200 bg-white shadow-box end-2 origin-top-end focus:outline-none sm:top-12 sm:mt-0.5 sm:end-0 lg:top-14 lg:mt-0"
          >
            <Menu.Item>
              <>
                <div className="flex items-center justify-between rounded-tl-lg rounded-tr-lg border-b border-gray-200/80 px-6 py-4 font-medium">
                  <span>{t('text-orders')}</span>
                  {activeStatus.length > 0 ? (
                    <span
                      className="block cursor-pointer text-sm font-medium text-accent hover:text-heading"
                      onClick={markAllAsRead}
                    >
                      {t('text-mark-all-read')}
                    </span>
                  ) : (
                    ''
                  )}
                </div>
                <div>
                  {notifyLogs?.length ? (
                    notifyLogs?.map((item: any) => {
                      return (
                        <div
                          className="group cursor-pointer border-b border-dashed border-gray-200 last:border-b-0"
                          key={item?.id}
                        >
                          <NotifyLogItem item={item} />
                        </div>
                      );
                    })
                  ) : (
                    <p className="mb-2 pt-5 pb-4 text-center text-sm font-medium text-gray-500">
                      {t('no-order-found')}
                    </p>
                  )}
                </div>
                <Link
                  href={
                    permission
                      ? Routes?.notifyLogs?.list
                      : `${Routes?.ownerDashboardNotifyLogs}/user/${user?.id}`
                  }
                  className="block border-t border-gray-200/80 p-3 text-center text-sm font-medium text-accent hover:text-accent-hover"
                >
                  {t('text-see-all-notification')}
                </Link>
              </>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default RecentOrderBar;
