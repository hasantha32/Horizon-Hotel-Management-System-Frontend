import type { GetParams, PaginatorInfo } from '@/types';
import { HttpClient } from './http-client';
import { HttpClient_v2 } from './http-client_v2';

interface LanguageParam {
  language: string;
}

export function crudFactory_v2<Type, QueryParams extends LanguageParam, InputType>(
  endpoint: string
) {
  return {
    all(params: QueryParams) {
      return HttpClient_v2.get<Type[]>(endpoint, params);
    },
    paginated(params: QueryParams) {
      return HttpClient_v2.get<PaginatorInfo<Type>>(endpoint, params);
    },
    get({ slug, language }: GetParams) {
      console.log('slug value is here: ', slug)
      return HttpClient_v2.get<Type>(`${endpoint}/${slug}`, { language });
    },
    create(data: InputType) {
      return HttpClient_v2.post<Type>(`${endpoint}/create`, data);
    },
    update({ id, ...input }: Partial<InputType> & { id: string }) {
      return HttpClient_v2.put<Type>(`${endpoint}/${id}`, input);
    },
    delete({ id }: { id: string }) {
      return HttpClient_v2.delete<boolean>(`${endpoint}/${id}/delete`);
    },
  };
}
