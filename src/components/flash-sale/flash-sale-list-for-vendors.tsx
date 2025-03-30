import ActionButtons from '@/components/common/action-buttons';
import { NoShop } from '@/components/icons/no-shop';
import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import TitleWithSort from '@/components/ui/title-with-sort';
import { FlashSale, MappedPaginatorInfo, SortOrder } from '@/types';
import { useIsRTL } from '@/utils/locals';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  flashSale: FlashSale[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const VendorFlashSaleLists = ({
  flashSale,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder?.Desc,
    column: null,
  });

  const {
    query: { shop },
    locale,
  } = useRouter();

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder?.Desc
          ? SortOrder?.Asc
          : SortOrder?.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj?.sort === SortOrder?.Desc
            ? SortOrder?.Asc
            : SortOrder?.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 100,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title-title')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'title'
          }
          isActive={sortingObj?.column === 'title'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'title',
      key: 'title',
      align: alignLeft,
      ellipsis: true,
      width: 200,
      onHeaderCell: () => onHeaderClick('title'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-description')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'description'
          }
          isActive={sortingObj?.column === 'description'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'description',
      key: 'description',
      align: alignLeft,
      width: 500,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('description'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-start-date')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'start_date'
          }
          isActive={sortingObj?.column === 'start_date'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'start_date',
      key: 'start_date',
      align: 'center',
      onHeaderCell: () => onHeaderClick('start_date'),
      render: (start_date: string) => {
        const startDate = new Date(start_date!);
        const month = startDate.getMonth() + 1;
        const year = startDate.getFullYear();
        const date = startDate.getDate();
        const start = month + '/' + date + '/' + year;
        return <span className="whitespace-nowrap">{start}</span>;
      },
    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-end-date')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'end_date'
          }
          isActive={sortingObj?.column === 'end_date'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'end_date',
      key: 'end_date',
      align: 'center',
      onHeaderCell: () => onHeaderClick('end_date'),
      render: (end_date: string) => {
        const endDate = new Date(end_date!);
        const month = endDate.getMonth() + 1;
        const year = endDate.getFullYear();
        const date = endDate.getDate();
        const end = month + '/' + date + '/' + year;
        return <span className="whitespace-nowrap">{end}</span>;
      },
    },
    {
      title: t('table:table-item-type'),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 150,
    },
    {
      title: t('table:table-item-rate'),
      dataIndex: 'rate',
      key: 'rate',
      align: 'center',
      width: 150,
    },
    {
      title: t('table:table-item-details'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      render: (id: string, { slug }: any) => {
        return (
          <ActionButtons
            id={id}
            detailsUrl={`/${shop}/flash-sale/${slug}`}
            // termApproveButton={true}
            // isTermsApproved={is_approved}
          />
        );
      },
    },
  ];
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-6">
              <div className="relative w-72 sm:h-80 sm:w-96">
                <NoShop />
              </div>
              <div className="pt-6 text-sm font-semibold">
                {t('table:empty-table-data')}
              </div>
            </div>
          )}
          data={flashSale}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default VendorFlashSaleLists;
