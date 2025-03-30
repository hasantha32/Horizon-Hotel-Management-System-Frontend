import ActionButtons from '@/components/common/action-buttons';
import { NoDataFound } from '@/components/icons/no-data-found';
import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import {
  FlashSaleProductsRequest,
  MappedPaginatorInfo,
  SortOrder,
} from '@/types';
import { useIsRTL } from '@/utils/locals';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  flashSaleRequests: FlashSaleProductsRequest[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const FlashSaleRequestLists = ({
  flashSaleRequests,
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

  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);

  const {
    query: { shop },
  } = useRouter();

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
          title="Campaign Name"
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
      dataIndex: 'note',
      key: 'note',
      align: alignLeft,
      width: 500,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('description'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },

    {
      title: 'Requested Status',
      className: 'cursor-pointer',
      dataIndex: 'request_status',
      key: 'request_status',
      align: alignLeft,
      ellipsis: true,
      width: 200,
      render: (request_status: Boolean) => {
        return (
          <>
            {request_status ? (
              <span className="whitespace-nowrap">Accepted</span>
            ) : (
              <span className="whitespace-nowrap">Pending</span>
            )}
          </>
        );
      },
    },

    {
      title: t('table:table-item-details'),
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      width: 150,
      render: (id: string, { request_status }: any) => {
        return (
          <ActionButtons
            id={id}
            detailsUrl={
              shop
                ? `/${shop}/flash-sale/vendor-request/${id}`
                : `/flash-sale/vendor-request/${id}`
            }
            flashSaleVendorRequestApproveButton={permission}
            isFlashSaleVendorRequestApproved={request_status}
          />
        );
      },
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      width: 150,
      render: (id: string, record: FlashSaleProductsRequest) => (
        <>
          <ActionButtons
            id={id}
            deleteModalView="DELETE_FLASH_SALE_REQUEST"
            // editUrl={Routes?.vendorRequestForFlashSale?.editByIdWithoutLang(
            //   id,
            //   shop as string,
            // )}
          />
        </>
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
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={flashSaleRequests}
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

export default FlashSaleRequestLists;
