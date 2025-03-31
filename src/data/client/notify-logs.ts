import {
  CreateNotifyLogsInput,
  NotifyLogsQueryOptions,
  NotifyLogsPaginator,
  QueryOptions,
  NotifyLogs,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const notifyClient = {
  ...crudFactory<NotifyLogs, QueryOptions, CreateNotifyLogsInput>(
    API_ENDPOINTS.NOTIFY_LOGS
  ),
  get: ({ id, language }: { id: string; language: string }) => {
    return HttpClient.get<NotifyLogs>(`${API_ENDPOINTS.NOTIFY_LOGS}/${id}`, {
      language,
    });
  },
  paginated: ({
    notify_type,
    is_read,
    ...params
  }: Partial<NotifyLogsQueryOptions>) => {
    return HttpClient.get<NotifyLogsPaginator>(API_ENDPOINTS.NOTIFY_LOGS, {
      searchJoin: 'and',
      notify_type,
      is_read,
      ...params,
      search: HttpClient.formatSearchParams({ notify_type, is_read }),
    });
  },
  notifyLogSeen({ input }: { input: any }) {
    return HttpClient.post<any>(API_ENDPOINTS.NOTIFY_LOG_SEEN, input);
  },
  readAllNotifyLogs({ ...params }: Partial<NotifyLogsQueryOptions>) {
    return HttpClient.post<any>(API_ENDPOINTS.READ_ALL_NOTIFY_LOG, {
      ...params,
    });
  },
};
