import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import dayjs from 'dayjs';
import {
  Product,
  User,
  SortOrder,
  Question,
  MappedPaginatorInfo,
} from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { NoDataFound } from '@/components/icons/no-data-found';
import { siteSettings } from '@/settings/site.settings';
import { useRouter } from 'next/router';
import TitleWithSort from '@/components/ui/title-with-sort';
import QuestionCard from './question-card';
import { LikeIcon } from '@/components/icons/like-icon';
import { DislikeIcon } from '@/components/icons/dislike-icon';
import Link from 'next/link';
import { Routes } from '@/config/routes';

export type IProps = {
  questions: Question[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const QuestionList = ({
  questions,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();
  const router = useRouter();
  const {
    query: { shop },
  } = router;

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
      title: t('table:table-item-image'),
      dataIndex: 'product',
      key: 'product-image',
      align: alignLeft,
      width: 250,
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
      title: t('table:table-item-question-answer'),
      className: 'cursor-pointer',
      // dataIndex: "question",
      key: 'question',
      align: alignLeft,
      width: 350,
      render: (record: any, id: string) => (
        <QuestionCard record={record} id={id} />
      ),
    },
    {
      title: t('table:table-item-customer'),
      dataIndex: 'user',
      key: 'user',
      align: alignLeft,
      width: 150,
      render: (user: User) => (
        <span>{user?.name ? user?.name : t('common:text-guest')}</span>
      ),
    },
    {
      title: t('table:table-item-feedbacks'),
      // dataIndex: "product",
      key: 'feedbacks',
      align: alignLeft,
      width: 150,
      render: (record: any) => (
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-xs tracking-wider text-gray-400 transition">
            <LikeIcon className="h-4 w-4 me-1.5" />
            {record?.positive_feedbacks_count}
          </span>
          <span className="flex items-center text-xs tracking-wider text-gray-400 transition">
            <DislikeIcon className="h-4 w-4 me-1.5" />
            {record?.negative_feedbacks_count}
          </span>
        </div>
      ),
    },
    {
      // title: t("table:table-item-date"),
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
      width: 150,
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
      width: 120,
      render: function Render(_: any, id: string) {
        const {
          query: { shop },
        } = useRouter();
        return (
          <ActionButtons
            id={id}
            editModalView="REPLY_QUESTION"
            deleteModalView={!shop ? 'DELETE_QUESTION' : false}
          />
        );
      },
    },
  ];

  if (shop) {
    columns = columns?.filter((column) => column?.key !== 'actions');
  }

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
          data={questions}
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

export default QuestionList;
