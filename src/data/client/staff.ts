import { StaffQueryOptions, StaffPaginator, AddStaffInput } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const staffClient = {
  paginated: ({ ...params }: Partial<StaffQueryOptions>) => {
    return HttpClient.get<StaffPaginator>(API_ENDPOINTS.STAFFS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({}),
    });
  },
  addStaff: (variables: AddStaffInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.ADD_STAFF, variables);
  },
  removeStaff: ({ id }: { id: string }) => {
    return HttpClient.delete<any>(`${API_ENDPOINTS.REMOVE_STAFF}/${id}`);
  },
};
