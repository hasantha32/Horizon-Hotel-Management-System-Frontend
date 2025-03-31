import {
  QueryOptions,
  MessageQueryOptions,
  CreateMessageInput,
  ConversationQueryOptions,
  Conversations,
  ConversionPaginator,
  MessagePaginator,
  CreateMessageSeenInput,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const conversationsClient = {
  ...crudFactory<Conversations, QueryOptions, CreateMessageInput>(
    API_ENDPOINTS.CONVERSIONS
  ),
  getMessage({ slug, ...prams }: Partial<MessageQueryOptions>) {
    return HttpClient.get<MessagePaginator>(
      `${API_ENDPOINTS.MESSAGE}/${slug}`,
      {
        searchJoin: 'and',
        ...prams,
      }
    );
  },
  getConversion({ id }: { id: string }) {
    return HttpClient.get<Conversations>(`${API_ENDPOINTS.CONVERSIONS}/${id}`);
  },
  messageCreate({ id, ...input }: Partial<CreateMessageInput>) {
    return HttpClient.post<CreateMessageInput>(
      `${API_ENDPOINTS.MESSAGE}/${id}`,
      input
    );
  },
  messageSeen({ id }: CreateMessageSeenInput) {
    return HttpClient.post<CreateMessageSeenInput>(
      `${API_ENDPOINTS.MESSAGE_SEEN}/${id}`,
      id
    );
  },
  allConversation: (params: Partial<ConversationQueryOptions>) =>
    HttpClient.get<ConversionPaginator>(API_ENDPOINTS.CONVERSIONS, params),
};
