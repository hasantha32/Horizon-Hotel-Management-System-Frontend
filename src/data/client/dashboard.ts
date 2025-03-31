import { HttpClient } from '@/data/client/http-client';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';

export const dashboardClient = {
  analytics() {
    return HttpClient.get<any>(API_ENDPOINTS.ANALYTICS);
  },
};
