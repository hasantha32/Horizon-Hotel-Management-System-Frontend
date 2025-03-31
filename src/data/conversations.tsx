import { useRouter } from 'next/router';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  MessageQueryOptions,
  ConversionPaginator,
  ConversationQueryOptions,
  MessagePaginator,
  Conversations,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { conversationsClient } from './client/conversations';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';

export const useConversationsQuery = (
  options: Partial<ConversationQueryOptions>
) => {
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isSuccess,
    isFetchingNextPage,
  } = useInfiniteQuery<ConversionPaginator, Error>(
    [API_ENDPOINTS.CONVERSIONS, options],
    ({ queryKey, pageParam }) =>
      conversationsClient.allConversation(
        Object.assign({}, queryKey[1], pageParam)
      ),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    if (Boolean(hasNextPage)) {
      fetchNextPage();
    }
  }

  return {
    conversations: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    loading: isLoading,
    error,
    isFetching,
    refetch,
    isSuccess,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
};

export const useCreateConversations = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);
  return useMutation(conversationsClient.create, {
    onSuccess: (data) => {
      if (data?.id) {
        const routes = permission
          ? Routes?.message?.details(data?.id)
          : Routes?.shopMessage?.details(data?.id);
        toast.success(t('common:successfully-created'));
        router.push(`${routes}`);
        closeModal();
      } else {
        // @ts-ignore
        toast.error(t(data?.errors[0]?.message));
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.MESSAGE);
      queryClient.invalidateQueries(API_ENDPOINTS.CONVERSIONS);
    },
  });
};

export const useMessagesQuery = (options: Partial<MessageQueryOptions>) => {
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isSuccess,
    isFetchingNextPage,
  } = useInfiniteQuery<MessagePaginator, Error>(
    [API_ENDPOINTS.MESSAGE, options],
    ({ queryKey, pageParam }) =>
      conversationsClient.getMessage(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );

  function handleLoadMore() {
    if (Boolean(hasNextPage)) {
      fetchNextPage();
    }
  }

  return {
    messages: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    loading: isLoading,
    error,
    isFetching,
    refetch,
    isSuccess,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
};

export const useConversationQuery = ({ id }: { id: string }) => {
  const { data, error, isLoading, isFetching } = useQuery<Conversations, Error>(
    [API_ENDPOINTS.CONVERSIONS, id],
    () => conversationsClient.getConversion({ id }),
    {
      keepPreviousData: true,
    }
  );

  return {
    data: data ?? [],
    error,
    loading: isLoading,
    isFetching,
  };
};

export const useSendMessage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(conversationsClient.messageCreate, {
    onSuccess: () => {
      toast.success(t('common:text-message-sent'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.MESSAGE);
      queryClient.invalidateQueries(API_ENDPOINTS.CONVERSIONS);
    },
  });
};

export const useMessageSeen = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(conversationsClient.messageSeen, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.MESSAGE);
      queryClient.invalidateQueries(API_ENDPOINTS.CONVERSIONS);
    },
  });
};
