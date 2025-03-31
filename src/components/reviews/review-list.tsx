import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import dayjs from 'dayjs';
import { MappedPaginatorInfo, Product, Review, SortOrder } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { siteSettings } from '@/settings/site.settings';
import ReviewCard from './review-card';
import { useRouter } from 'next/router';
import TitleWithSort from '@/components/ui/title-with-sort';
import { StarIcon } from '@/components/icons/star-icon';
import { NoDataFound } from '@/components/icons/no-data-found';
import { useModalAction } from '@/components/ui/modal/modal.context';
import Link from 'next/link';

export type IProps = {
  reviews: Review[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const ReviewList = ({
  reviews,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { alignLeft } = useIsRTL();
  const { openModal } = useModalAction();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  function openAbuseReportModal(id: string) {
    openModal('ABUSE_REPORT', {
      model_id: id,
      model_type: 'Review',
    });
  }

  let columns = [
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
      title: t('table:table-item-product'),
      dataIndex: 'product',
      key: 'product-image',
      align: alignLeft,
      width: 220,
      render: (product: Product) => (
        <div className="flex items-center">
          <div className="relative aspect-square h-14 w-14 shrink-0 overflow-hidden rounded border border-border-200/80 bg-gray-100 me-2.5">
            <Image
              src={
                product?.image?.thumbnail ?? siteSettings.product.placeholder
              }
              alt={product?.name}
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw"
            />
          </div>
          <Link
            href={`${process.env.NEXT_PUBLIC_SHOP_URL}/products/${product?.slug}`}
          >
            <span className="truncate whitespace-nowrap font-medium">
              {product?.name}
            </span>
          </Link>
        </div>
      ),
    },
    {
      title: t('table:table-item-customer-review'),
      key: 'review',
      align: alignLeft,
      width: 350,
      render: (record: any) => <ReviewCard review={record} />,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-ratings')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'rating'
          }
          isActive={sortingObj.column === 'rating'}
        />
      ),
      key: 'rating',
      className: 'cursor-pointer',
      align: 'center',
      width: 150,
      onHeaderCell: () => onHeaderClick('rating'),
      render: (record: any) => (
        <div className="inline-flex shrink-0 items-center rounded-full border border-accent px-3 py-0.5 text-base text-accent">
          {record?.rating}
          <StarIcon className="h-3 w-3 ms-1" />
        </div>
      ),
    },
    {
      title: t('table:table-item-reports'),
      key: 'report',
      align: 'center',
      width: 150,
      render: (record: any) => {
        if (router.query.shop) {
          return (
            <span className="font-bold">{record?.abusive_reports_count}</span>
          );
        }
        return (
          <>
            <span className="font-bold">{record?.abusive_reports_count}</span>
            {record?.abusive_reports_count > 0 && (
              <a
                href={`${router.asPath}/${record?.id}`}
                className="text-sm transition-colors ms-2 hover:text-accent"
                target="_blank"
                rel="noreferrer"
              >
                ({t('text-details')})
              </a>
            )}
          </>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-date')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'created_at'
          }
          isActive={sortingObj.column === 'created_at'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      key: 'created_at',
      align: alignLeft,
      width: 120,
      onHeaderCell: () => onHeaderClick('created_at'),
      render: (date: string) => {
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
          </span>
        );
      },
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'right',
      width: 100,
      render: (id: string) => {
        if (router?.query?.shop) {
          return (
            <button onClick={() => openAbuseReportModal(id)}>
              {t('common:text-report')}
            </button>
          );
        }
        return <ActionButtons id={id} deleteModalView="DELETE_REVIEW" />;
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
          data={reviews}
          rowKey="id"
          scroll={{ x: 1200 }}
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

export default ReviewList;
