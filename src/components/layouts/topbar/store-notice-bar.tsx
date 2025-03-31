import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useStoreNoticeRead, useStoreNoticesQuery } from '@/data/store-notice';
import { NotificationIcon } from '@/components/icons/sidebar/notification';
import { Fragment, useEffect, useState } from 'react';
import cn from 'classnames';
import { Menu, Transition } from '@headlessui/react';
import Link from '@/components/ui/link';
import { LIMIT } from '@/utils/constants';
import { SortOrder } from '@/types';
import {
  adminOnly,
  getAuthCredentials,
  hasAccess,
  ownerOnly,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { PusherConfig } from '@/utils/pusher-config';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useNotifyLogAllReadMutation } from '@/data/notify-logs';
import { Config } from '@/config';

type IProps = { user: any };

const StoreNoticeBar = ({ user }: IProps) => {
  const { t } = useTranslation();
  const [notice, setNotice] = useState([]);
  let allNotice: any = [];
  const { permissions } = getAuthCredentials();
  const permission = hasAccess(adminOnly, permissions);
  const router = useRouter();
  const { readStoreNotice } = useStoreNoticeRead();
  const [noticeOpen, setNoticeOpen] = useState(false);
  const { locale } = useRouter();
  const { storeNotices, error: errorNotice } = useStoreNoticesQuery({
    language: locale,
    limit: 5,
    orderBy: 'updated_at',
    sortedBy: SortOrder.Desc,
  });

  const { mutate: readAllNotifyLogs, isLoading: creating } =
    useNotifyLogAllReadMutation();

  const markAllAsRead = () => {
    readAllNotifyLogs({
      set_all_read: true,
      notify_type: 'store_notice',
      receiver: user?.id,
    });
  };

  const activeStatus = storeNotices.filter((item) => {
    return item.is_read === false;
  });

  useEffect(() => {
    if (Config.broadcastDriver === 'pusher' && Config.pusherEnable === 'true') {
      const channelName =
        `${process.env.NEXT_PUBLIC_STORE_NOTICE_CREATED_CHANNEL_PRIVATE}` +
        '.' +
        user?.id;
      const channel = PusherConfig.subscribe(channelName);

      channel.bind(
        `${process.env.NEXT_PUBLIC_STORE_NOTICE_CREATED_EVENT}`,
        function (data: any) {
          allNotice.push(data);
          setNotice(allNotice);
          toast.success(data?.message, {
            toastId: 'storeSuccess',
          });
        }
      );

      return () => {
        PusherConfig.unsubscribe(channelName);
      };
    } else {
      PusherConfig.disconnect();
    }
  }, [notice]);

  return (
    <>
      <Menu as="div" className="relative hidden text-left sm:inline-block">
        <Menu.Button
          className={cn(
            'flex h-9 w-9 items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 text-gray-600 before:absolute before:top-0 before:right-0 before:h-2 before:w-2 before:rounded-full  focus:outline-none data-[headlessui-state=open]:bg-white data-[headlessui-state=open]:text-accent ',
            activeStatus.length ? 'before:bg-[#F5A623]' : null
          )}
        >
          <NotificationIcon
            className={cn('h-5 w-5')}
            onClick={() => setNoticeOpen(!noticeOpen)}
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
                  <span>{t('text-notifications')}</span>
                  <span
                    className="block cursor-pointer text-sm font-medium text-accent hover:text-heading"
                    onClick={markAllAsRead}
                  >
                    {t('text-mark-all-read')}
                  </span>
                </div>

                <div>
                  {storeNotices.length ? (
                    storeNotices?.map((item: any) => {
                      const activeUser = permissions?.includes('super_admin')
                        ? Routes?.storeNotice?.details(item?.id)
                        : '/shops/' + Routes?.storeNotice?.details(item?.id);

                      const onClickHandel = () => {
                        router.push(activeUser);
                        readStoreNotice({ id: item?.id });
                      };
                      return (
                        <div
                          className="group cursor-pointer rounded-lg border-b border-dashed border-[#E5E5E5] last:border-b-0 hover:border-gray-100 hover:bg-gray-100"
                          key={item?.id}
                        >
                          <div
                            onClick={onClickHandel}
                            className={cn(
                              "relative flex gap-2 rounded-md py-3.5 px-6 text-sm font-semibold capitalize transition duration-200 before:absolute before:top-5 before:h-2 before:w-2 before:rounded-full before:bg-accent before:opacity-0 before:content-[''] before:start-2 hover:text-accent group-hover:bg-gray-100/70",
                              item?.is_read == false
                                ? 'before:opacity-100'
                                : null
                            )}
                          >
                            <div className="overflow-hidden">
                              <h3
                                className={cn(
                                  'truncate text-sm font-medium',
                                  item?.is_read ? 'text-[#666]' : ''
                                )}
                              >
                                {item?.notice}
                              </h3>
                              <span className="mt-2 block text-xs font-medium text-[#666666]">
                                {dayjs(item?.created_at).format('MMM DD, YYYY')}{' '}
                                at {dayjs(item?.created_at).format('hh:mm A')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="mb-2 pt-5 pb-4 text-center text-sm font-medium text-gray-500">
                      {t('no-notification-found')}
                    </p>
                  )}
                </div>

                {storeNotices.length ? (
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
                ) : null}
              </>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default StoreNoticeBar;
