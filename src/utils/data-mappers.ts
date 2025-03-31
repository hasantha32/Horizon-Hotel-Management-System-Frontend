import camelCaseKeys from 'camelcase-keys';
import { MappedPaginatorInfo, PaginatorInfo } from '@/types';

export const mapPaginatorData = (
  obj: PaginatorInfo<any> | undefined,
): MappedPaginatorInfo | null => {
  if (!obj) return null;
  const {
    //@ts-ignore
    data,
    ...formattedValues
  } = camelCaseKeys(
    //@ts-ignore
    obj,
  );
  //@ts-ignore
  return {
    ...formattedValues,
    hasMorePages:
      //@ts-ignore
      formattedValues.lastPage !== formattedValues.currentPage,
  };
};
