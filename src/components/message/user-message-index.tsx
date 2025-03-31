import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import UserMessageView from '@/components/message/views/message-view';
import { useMessagesQuery } from '@/data/conversations';
import { useConversationQuery } from '@/data/conversations';
import { LIMIT } from '@/utils/constants';
import SelectConversation from '@/components/message/views/select-conversation';
import BlockedView from '@/components/message/views/blocked-view';
import CreateMessageForm from '@/components/message/views/form-view';
import HeaderView from '@/components/message/views/header-view';
import { useEffect, useRef } from 'react';
import MessageCardLoader from '@/components/message/content-loader';
import { useWindowSize } from '@/utils/use-window-size';
import { RESPONSIVE_WIDTH } from '@/utils/constants';
import ErrorMessage from '@/components/ui/error-message';
import { useMessageSeen } from '@/data/conversations';
import { Conversations, Shop } from '@/types';

interface Props {
  className?: string;
}

const UserMessageIndex = ({ className, ...rest }: Props) => {
  const { t } = useTranslation();
  const loadMoreRef = useRef(null);
  const router = useRouter();
  const { mutate: createSeenMessage } = useMessageSeen();
  const { query } = router;
  const { data, loading, error } = useConversationQuery({
    id: query.id as string,
  });
  const { width } = useWindowSize();
  let {
    error: messageError,
    messages,
    loading: messageLoading,
    isSuccess,
    hasMore,
    loadMore,
    isLoadingMore,
    isFetching,
  } = useMessagesQuery({
    slug: query?.id as string,
    limit: LIMIT,
  });

  useEffect(() => {
    if (!hasMore) {
      return;
    }

    const option = { rootMargin: '-110px', threshold: [0, 0.25, 0.5, 0.75, 1] };

    const handleObserver = (entries: any[]) =>
      entries?.forEach((entry) => entry?.isIntersecting && loadMore());

    const observer = new IntersectionObserver(handleObserver, option);

    const element = loadMoreRef && loadMoreRef?.current;

    if (!element) {
      return;
    }

    observer?.observe(element);
  }, [loadMoreRef?.current, hasMore]);

  messages = [...messages].reverse();
  const classes = {
    common:
      'inline-block rounded-[8px] px-4 py-2 break-all leading-[150%] text-sm',
    default: 'bg-[#FAFAFA] text-left text-base-dark',
    reverse: 'bg-accent text-white',
  };
  if (!isEmpty(query?.id) && messageError)
    return (
      <div className="flex !h-full flex-1 items-center justify-center bg-[#F3F4F6]">
        <ErrorMessage message={messageError?.message} />
      </div>
    );
  const seenMessage = (unseen: boolean) => {
    if (unseen) {
      createSeenMessage({
        id: query?.id as string,
      });
    }
  };
  return (
    <>
      <div
        className={cn(
          'flex h-full max-h-[calc(100%-51px)] flex-1 items-stretch bg-[#F3F4F6]',
          width >= RESPONSIVE_WIDTH ? '2xl:max-w-[calc(100%-26rem)]' : '',
          className
        )}
        {...rest}
      >
        {!isEmpty(query?.id) ? (
          <>
            {!loading || !messageLoading ? (
              <div
                className={cn(
                  'flex h-full w-full flex-col overflow-hidden rounded-xl bg-white p-6'
                )}
                onFocus={() => {
                  // @ts-ignore
                  seenMessage(Boolean(data?.unseen));
                }}
              >
                {/* @ts-ignore */}
                <HeaderView shop={data?.shop} />

                <UserMessageView
                  messages={messages}
                  id="chatBody"
                  error={messageError}
                  loading={messageLoading}
                  classes={classes}
                  isSuccess={isSuccess}
                  isLoadingMore={isLoadingMore}
                  isFetching={isFetching}
                >
                  {hasMore ? (
                    <div ref={loadMoreRef} className="mb-4">
                      {isLoadingMore ? (
                        <MessageCardLoader
                          classes={classes}
                          limit={LIMIT / 2}
                        />
                      ) : (
                        <div className="hidden">{t('text-no-search')}</div>
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </UserMessageView>

                <div className="relative mt-auto">
                  {/* @ts-ignore */}
                  {Boolean(data?.shop?.is_active) ? (
                    <>
                      <CreateMessageForm
                        // @ts-ignore
                        shop={data as Conversations}
                      />
                    </>
                  ) : (
                    <>
                      {/* @ts-ignore */}
                      <BlockedView name={data?.shop?.name} />
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Loader className="!h-full" text={t('common:text-loading')} />
            )}
          </>
        ) : (
          <>{width >= RESPONSIVE_WIDTH ? <SelectConversation /> : ''}</>
        )}
      </div>
    </>
  );
};

export default UserMessageIndex;
