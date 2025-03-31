import ActionButtons from '@/components/common/action-buttons';
import { NoShop } from '@/components/icons/no-shop';
import PriorityColor from '@/components/store-notice/priority-color';
import Badge from '@/components/ui/badge/badge';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import { MappedPaginatorInfo, SortOrder, StoreNotice } from '@/types';
import { useIsRTL } from '@/utils/locals';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { NoDataFound } from '@/components/icons/no-data-found';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  storeNotices: StoreNotice[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const StoreNoticeList = ({
  storeNotices,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    query: { shop },
  } = router;
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
      width: 100,
      onHeaderCell: () => onHeaderClick('id'),
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-notice')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'notice'
          }
          isActive={sortingObj?.column === 'notice'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'notice',
      key: 'notice',
      align: alignLeft,
      ellipsis: true,
      width: 200,
      onHeaderCell: () => onHeaderClick('notice'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },
    {
      title: t('table:table-item-description'),
      dataIndex: 'description',
      key: 'description',
      align: alignLeft,
      width: 300,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('description'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },
    {
      title: t('table:table-item-type'),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 140,
      onHeaderCell: () => onHeaderClick('type'),
      render: (text: string) => {
        const typeText: string = text?.replace(/_/g, ' ');
        const finalResult: string =
          typeText?.charAt(0)?.toUpperCase() + typeText?.slice(1);
        return <span className="whitespace-nowrap">{finalResult}</span>;
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-effective-from')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'effective_from'
          }
          isActive={sortingObj?.column === 'effective_from'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'effective_from',
      key: 'effective_from',
      align: 'center',
      width: 130,
      onHeaderCell: () => onHeaderClick('effective_from'),
      render: (effective_from: string) => (
        <span className="whitespace-nowrap">
          {dayjs()?.to(dayjs?.utc(effective_from)?.tz(dayjs?.tz?.guess()))}
        </span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-expired-at')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'expired_at'
          }
          isActive={sortingObj?.column === 'expired_at'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'expired_at',
      key: 'expired_at',
      align: 'center',
      width: 130,
      onHeaderCell: () => onHeaderClick('expired_at'),
      render: (expired_date: string) => (
        <span className="whitespace-nowrap">
          {dayjs()?.to(dayjs?.utc(expired_date)?.tz(dayjs?.tz?.guess()))}
        </span>
      ),
    },
    {
      title: t('table:table-item-issued-by'),
      dataIndex: 'creator_role',
      key: 'creator_role',
      align: 'center',
      width: 100,
      onHeaderCell: () => onHeaderClick('creator_role'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },
    {
      title: t('table:table-item-priority'),
      dataIndex: 'priority',
      key: 'priority',
      align: 'center',
      width: 120,
      onHeaderCell: () => onHeaderClick('priority'),
      render: (text: string) => (
        <Badge
          text={text}
          className="font-medium uppercase"
          color={PriorityColor(text)}
        />
      ),
    },
    {
      title: t('table:table-item-actions'),
      key: 'actions',
      align: alignRight,
      width: 150,
      render: (data: StoreNotice) => {
        if (router?.asPath !== '/') {
          return (
            <>
              {/* <LanguageSwitcher
                slug={data?.id}
                record={data}
                deleteModalView="DELETE_STORE_NOTICE"
                routes={Routes?.storeNotice}
                isShop={Boolean(shop)}
                shopSlug={(shop as string) ?? ''}
              />*/}
              <ActionButtons
                id={data?.id}
                deleteModalView="DELETE_STORE_NOTICE"
                editUrl={
                  shop
                    ? Routes?.storeNotice?.editWithoutLang(
                        data?.id,
                        shop as string
                      )
                    : Routes?.storeNotice?.editWithoutLang(data?.id)
                }
              />
            </>
          );
        } else {
          return (
            <ActionButtons
              id={data?.id}
              detailsUrl={`${router.asPath}/${data?.id}`}
              customLocale={router?.locale}
            />
          );
        }
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
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={storeNotices}
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

export default StoreNoticeList;
