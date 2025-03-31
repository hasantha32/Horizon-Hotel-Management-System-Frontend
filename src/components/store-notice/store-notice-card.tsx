import Badge from '@/components/ui/badge/badge';
import { InfoIconNew } from '@/components/icons/info-icon';
import { StoreNotice, StoreNoticePriorityType } from '@/types';
// import PriorityColor from '@/components/store-notice/priority-color';
import { Routes } from '@/config/routes';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useStoreNoticeRead } from '@/data/store-notice';
// import { CheckMarkCircle } from '@/components/icons/checkmark-circle';
// import { useRouter } from 'next/router';
import { CheckMarkGhost } from '@/components/icons/checkmark-circle';
import { getAuthCredentials } from '@/utils/auth-utils';
import Link from '@/components/ui/link';

type NoticeCardProps = {
  noticeData: StoreNotice;
};

const StoreNoticeCard: React.FC<NoticeCardProps> = ({ noticeData }) => {
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  // const router = useRouter();
  const { id, notice, is_read, description, priority } = noticeData;
  const { readStoreNotice } = useStoreNoticeRead();

  const activeUser = permissions?.includes('super_admin')
    ? Routes?.storeNotice?.details(id)
    : '/shops/' + Routes?.storeNotice?.details(id);

  const onClickHandel = () => {
    readStoreNotice({ id: id });
  };

  return (
    <Link
      href={activeUser}
      className={cn(
        `relative flex flex-col gap-2 rounded-lg border-l-4 p-5 md:flex-row md:gap-6 xl:p-7`,
        is_read ? 'border border-[#E7E7E7] bg-[#F4F4F4]' : 'bg-white',
        {
          'border-l-accent': StoreNoticePriorityType.High === priority,
          'border-l-[#43A5FF]': StoreNoticePriorityType.Medium === priority,
          'border-l-[#F75159]': StoreNoticePriorityType.Low === priority,
        }
      )}
      onClick={onClickHandel}
    >
      <div
        className={cn(`shrink-0 rounded-xl text-4xl lg:text-5xl`, {
          'text-accent': StoreNoticePriorityType.High === priority,
          'text-[#43A5FF]': StoreNoticePriorityType.Medium === priority,
          'text-[#F75159]': StoreNoticePriorityType.Low === priority,
        })}
      >
        <InfoIconNew />
      </div>
      <div className="flex-1">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 lg:mb-4 lg:flex-nowrap">
          {notice ? (
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <h3 className="text-base font-semibold text-muted-black xl:text-xl">
                {notice?.length >= 100
                  ? notice?.substring(0, 100) + '...'
                  : notice}
              </h3>
              <div>
                <Badge
                  text={priority}
                  className={cn(
                    `rounded-full border border-current bg-opacity-10 py-2 px-3 text-sm font-medium capitalize leading-none`,
                    {
                      'bg-accent text-accent':
                        StoreNoticePriorityType.High === priority,
                      'bg-[#43A5FF] text-[#43A5FF]':
                        StoreNoticePriorityType.Medium === priority,
                      'bg-[#F75159] text-[#F75159]':
                        StoreNoticePriorityType.Low === priority,
                    }
                  )}
                />
              </div>
            </div>
          ) : (
            ''
          )}
          <div
            className={cn('hidden text-xl lg:block', {
              'text-accent': StoreNoticePriorityType.High === priority,
              'text-[#43A5FF]': StoreNoticePriorityType.Medium === priority,
              'text-[#F75159]': StoreNoticePriorityType.Low === priority,
            }, is_read ? 'text-opacity-50' : '')}
          >
            <CheckMarkGhost />
          </div>
        </div>
        {description && (
          <p className="text-sm leading-[175%] text-[#666] lg:text-base">
            {description?.length >= 250
              ? description?.substring(0, 250) + '...'
              : description}
            {description?.length >= 250 ? (
              <span className="font-semibold text-accent">
                {t('common:text-read-more')}
              </span>
            ) : (
              ''
            )}
          </p>
        )}
      </div>
    </Link>
  );
};

export default StoreNoticeCard;
