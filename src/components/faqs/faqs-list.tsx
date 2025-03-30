import ActionButtons from '@/components/common/action-buttons';
import { NoDataFound } from '@/components/icons/no-data-found';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import { FAQs, MappedPaginatorInfo, SortOrder } from '@/types';
import { useIsRTL } from '@/utils/locals';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ShortDescription from '@/components/shop-single/short-description';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  faqs: FAQs[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const FaqsLists = ({
  faqs,
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
          title={t('table:table-item-title-title')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'faq_title'
          }
          isActive={sortingObj?.column === 'faq_title'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'faq_title',
      key: 'faq_title',
      align: alignLeft,
      ellipsis: true,
      width: 200,
      onHeaderCell: () => onHeaderClick('faq_title'),
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
            sortingObj?.column === 'faq_description'
          }
          isActive={sortingObj?.column === 'faq_description'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'faq_description',
      key: 'faq_description',
      align: alignLeft,
      width: 300,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('faq_description'),
      render: (text: string) => (
        <span
          dangerouslySetInnerHTML={{
            __html: text?.length < 140 ? text : text?.substring(0, 140) + '...',
          }}
        />
      ),
    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-type')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'faq_type'
          }
          isActive={sortingObj?.column === 'faq_type'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'faq_type',
      key: 'faq_type',
      align: 'center',
      width: 100,
      onHeaderCell: () => onHeaderClick('faq_type'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-issued-by')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'issued_by'
          }
          isActive={sortingObj?.column === 'issued_by'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'issued_by',
      key: 'issued_by',
      align: 'center',
      width: 100,
      onHeaderCell: () => onHeaderClick('issued_by'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },

    {
      title: t('table:table-item-actions'),
      key: 'actions',
      align: alignRight,
      width: 150,
      render: (data: FAQs) => {
        if (router?.asPath !== '/') {
          return (
            <>
              <LanguageSwitcher
                slug={data?.id}
                record={data}
                deleteModalView="DELETE_FAQ"
                routes={Routes?.faqs}
                isShop={Boolean(shop)}
                shopSlug={(shop as string) ?? ''}
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
          data={faqs}
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

export default FaqsLists;
