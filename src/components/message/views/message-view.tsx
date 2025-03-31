import cn from 'classnames';
import { useRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import Avatar from '@/components/common/avatar';
import { siteSettings } from '@/settings/site.settings';
import { Conversations } from '@/types';
import MessageNotFound from '@/components/message/views/no-message-found';
import React, { useEffect, useState, useRef } from 'react';
import { useWindowSize } from '@/utils/use-window-size';
import { RESPONSIVE_WIDTH } from '@/utils/constants';
import {
  offset,
  flip,
  autoUpdate,
  useFloating,
  shift,
} from '@floating-ui/react';
import { ArrowDown } from '@/components/icons/arrow-down';
import { useMeQuery } from '@/data/user';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import { Message } from '@/types';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  conversation?: Conversations;
  className?: string;
  id?: string;
  listen?: boolean;
  loading?: boolean;
  messages: any[];
  error: any;
  classes: any;
  isSuccess: boolean;
  children: React.ReactNode;
  isLoadingMore: boolean;
  isFetching: boolean;
}

const UserMessageView = ({
  conversation,
  className,
  id,
  listen,
  messages = [],
  error,
  loading,
  classes,
  isSuccess,
  children,
  isLoadingMore,
  isFetching,
  ...rest
}: Props) => {
  const { query } = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const [visible, setVisible] = useState(false);
  const { data, isLoading: meLoading, error: meError } = useMeQuery();
  const messagesEndRef = useRef(null);
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);
  const { x, y, strategy, update, refs } = useFloating({
    strategy: 'fixed',
    placement: 'bottom',
    middleware: [offset(-80), flip(), shift()],
  });

  // default scroll to bottom
  const defaultScrollToBottom = () => {
    //@ts-ignore
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };
  // useEffect(defaultScrollToBottom, [messages, loading]);

  // scroll to bottom
  useEffect(() => {
    const chatBody = document.getElementById('chatBody');
    // @ts-ignore
    chatBody?.scrollTo({
      top: chatBody?.scrollHeight,
    });
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [query?.id, isSuccess, refs.reference, refs.floating, update]);
  const chatBody = document.getElementById('chatBody');
  const scrollToBottom = () => {
    chatBody?.scrollTo({
      top: chatBody?.scrollHeight,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    const chatBody = document.getElementById('chatBody');
    const toggleVisible = () => {
      if (
        Number(
          Number(chatBody?.scrollHeight) - Number(chatBody?.clientHeight),
        ) !== Number(chatBody?.scrollTop) &&
        Number(chatBody?.clientHeight) <= Number(chatBody?.scrollHeight)
      ) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    chatBody?.addEventListener('scroll', toggleVisible);
    return () => {
      chatBody?.removeEventListener('scroll', toggleVisible);
    };
  }, [loading]);

  if (loading || meLoading)
    return (
      <Loader className="!h-full flex-1" text={t('common:text-loading')} />
    );
  if (meError)
    return (
      <div className="!h-full flex-1">
        <ErrorMessage message={meError?.message} />
      </div>
    );
  return (
    <>
      <div
        id={id}
        className="relative flex-auto flex-grow h-full py-16 overflow-x-hidden overflow-y-auto"
        ref={refs.setReference}
        style={{
          maxHeight:
            width >= RESPONSIVE_WIDTH
              ? 'calc(100vh - 336px)'
              : 'calc(100vh - 300px)',
        }}
        {...rest}
      >
        <div
          onClick={scrollToBottom}
          className={`flex h-10 w-10 transform cursor-pointer rounded-full border border-solid border-[#F3F4F6] bg-[#F3F4F6] text-black shadow-lg transition-all duration-300 hover:border-accent-hover hover:bg-accent-hover hover:text-white ${
            visible
              ? 'visible translate-y-0 opacity-100'
              : 'invisible translate-y-1 opacity-0'
          }`}
          ref={refs.setReference}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
            zIndex: 50,
          }}
        >
          <ArrowDown height="14" width="14" className="m-auto" />
        </div>
        {/* render loader */}
        {children}
        {/* render content */}
        {isSuccess ? (
          <>
            {!isEmpty(messages) ? (
              <div className="space-y-6">
                {messages?.map((item: Message, key: number) => {
                  const { body, created_at, user_id, conversation } = item;
                  const checkUser = Number(data?.id) === Number(user_id);
                  let avatarUrl = !permission
                    ? conversation?.user?.profile?.avatar?.original
                    : item?.conversation?.shop?.logo?.original;
                  return (
                    <div
                      className={`flex w-full gap-x-3 ${
                        checkUser ? 'flex-row-reverse' : ''
                      }`}
                      key={key}
                    >
                      {checkUser ? null : (
                        <div className="relative w-10 h-10 shrink-0">
                          <Avatar
                            src={avatarUrl}
                            {...rest}
                            name="avatar"
                            // className="relative w-full h-full text-base font-medium text-white border-0 bg-muted-black"
                            className={cn(
                              'relative h-full w-full border-0',
                              avatarUrl
                                ? ''
                                : 'bg-muted-black text-base font-medium text-white',
                            )}
                          />
                        </div>
                      )}
                      <div
                        className={`w-full sm:w-3/4 ${
                          checkUser ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div className="space-y-1">
                          <h2
                            className={`${cn(
                              classes?.common,
                              checkUser ? classes?.default : classes?.reverse,
                            )}`}
                          >
                            {body.replace(/['"]+/g, '')}
                          </h2>
                        </div>
                        <div className="mt-2 text-xs text-[#686D73]">
                          {dayjs().to(dayjs.utc(created_at))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <MessageNotFound />
              </>
            )}
          </>
        ) : (
          ''
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default UserMessageView;
