import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { SortOrder } from '@/types';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Coupon, MappedPaginatorInfo, Attachment } from '@/types';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { NoDataFound } from '@/components/icons/no-data-found';
import { useIsRTL } from '@/utils/locals';
import Badge from '../ui/badge/badge';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  // coupons: CouponPaginator | null | undefined;
  coupons: Coupon[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const CouponList = ({
  coupons,
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
  const { alignLeft } = useIsRTL();

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
        currentSortDirection === SortOrder.Desc
          ? SortOrder.Asc
          : SortOrder.Desc,
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
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
      title: t('table:table-item-banner'),
      dataIndex: 'image',
      key: 'image',
      width: 74,
      render: (image: Attachment) => (
        <Image
          src={image?.thumbnail ?? siteSettings.product.placeholder}
          alt="coupon banner"
          width={42}
          height={42}
          className="overflow-hidden rounded"
        />
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-code')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'code'
          }
          isActive={sortingObj.column === 'code'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      onHeaderCell: () => onHeaderClick('code'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-coupon-amount')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'amount'
          }
          isActive={sortingObj.column === 'amount'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 150,
      onHeaderCell: () => onHeaderClick('amount'),
      render: function Render(amount: number, record: any) {
        const { price } = usePrice({
          amount: amount,
        });
        if (record.type === 'PERCENTAGE_COUPON') {
          return <span>{amount}%</span>;
        }
        return <span>{price}</span>;
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-minimum-cart-amount')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'minimum_cart_amount'
          }
          isActive={sortingObj.column === 'minimum_cart_amount'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'minimum_cart_amount',
      key: 'minimum_cart_amount',
      align: 'center',
      width: 150,
      onHeaderCell: () => onHeaderClick('minimum_cart_amount'),
      render: function Render(minimum_cart_amount: number) {
        const { price } = usePrice({
          amount: minimum_cart_amount,
        });
        return <span>{price}</span>;
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-active')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'active_from'
          }
          isActive={sortingObj.column === 'active_from'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'active_from',
      key: 'active_from',
      align: 'center',
      onHeaderCell: () => onHeaderClick('active_from'),
      render: (active_date: string) => (
        <span className="whitespace-nowrap">
          {dayjs().to(dayjs.utc(active_date).tz(dayjs.tz.guess()))}
        </span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-expired')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'expire_at'
          }
          isActive={sortingObj.column === 'expire_at'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'expire_at',
      key: 'expire_at',
      align: 'center',
      onHeaderCell: () => onHeaderClick('expire_at'),
      render: (expired_date: string) => (
        <span className="whitespace-nowrap">
          {dayjs().to(dayjs.utc(expired_date).tz(dayjs.tz.guess()))}
        </span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-status')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'is_approve'
          }
          isActive={sortingObj.column === 'is_approve'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'is_approve',
      key: 'is_approve',
      align: 'center',
      width: 150,
      onHeaderCell: () => onHeaderClick('is_approve'),
      render: (is_approve: boolean) => (
        <Badge
          textKey={is_approve ? 'Approved' : 'Disapprove'}
          color={
            is_approve
              ? 'bg-accent/10 !text-accent'
              : 'bg-status-failed/10 text-status-failed'
          }
        />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'code',
      key: 'actions',
      align: 'right',
      width: 260,
      render: (slug: string, record: Coupon) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_COUPON"
          routes={Routes?.coupon}
          isShop={Boolean(shop)}
          shopSlug={(shop as string) ?? ''}
          couponApproveButton={true}
          isCouponApprove={record?.is_approve}
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
          data={coupons}
          rowKey="id"
          scroll={{ x: 900 }}
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

export default CouponList;
