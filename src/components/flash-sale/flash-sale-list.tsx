import ActionButtons from '@/components/common/action-buttons';
import { NoDataFound } from '@/components/icons/no-data-found';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import { FlashSale, MappedPaginatorInfo, SortOrder } from '@/types';
import { useIsRTL } from '@/utils/locals';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Badge from '../ui/badge/badge';

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
const FlashSaleLists = ({
  flashSale,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { alignLeft, alignRight } = useIsRTL();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder?.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder?.Desc
          ? SortOrder?.Asc
          : SortOrder?.Desc,
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
      title: (
        <TitleWithSort
          title={t('table:table-item-id')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
      width: 120,
      onHeaderCell: () => onHeaderClick('id'),
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
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
      width: 350,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('description'),
      render: (text: string) => (
        <span
          dangerouslySetInnerHTML={{
            __html: text?.length < 130 ? text : text?.substring(0, 130) + '...',
          }}
        />
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
        const start = dayjs(start_date).format('DD MMM YYYY');
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
        const end = dayjs(end_date).format('DD MMM YYYY');
        return <span className="whitespace-nowrap">{end}</span>;
      },
    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-status')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'sale_status'
          }
          isActive={sortingObj.column === 'sale_status'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'sale_status',
      key: 'sale_status',
      align: 'center',
      width: 150,
      onHeaderCell: () => onHeaderClick('sale_status'),
      render: (sale_status: boolean) => (
        <Badge
          textKey={sale_status ? 'Active' : 'Inactive'}
          color={
            sale_status
              ? 'bg-accent/10 !text-accent'
              : 'bg-status-failed/10 text-status-failed'
          }
        />
      ),
    },

    {
      title: t('table:table-item-details'),
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      width: 150,
      render: (id: string, { slug, is_approved }: any) => {
        return <ActionButtons id={id} detailsUrl={`/flash-sale/${slug}`} />;
      },
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: alignRight,
      width: 150,
      render: (slug: string, record: FlashSale) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_FLASH_SALE"
          routes={Routes?.flashSale}
        />
      ),
    },
  ];
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="pt-6 mb-1 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
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

export default FlashSaleLists;
