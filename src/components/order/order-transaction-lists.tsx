import Pagination from '@/components/ui/pagination';
import dayjs from 'dayjs';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import usePrice from '@/utils/use-price';
import { formatAddress } from '@/utils/format-address';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { SortOrder, UserAddress } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Order, MappedPaginatorInfo } from '@/types';
import { useRouter } from 'next/router';
import StatusColor from '@/components/order/status-color';
import Badge from '@/components/ui/badge/badge';
import Button from '@/components/ui/button';
import { Routes } from '@/config/routes';
import { ChatIcon } from '@/components/icons/chat';
import { useCreateConversations } from '@/data/conversations';
import { SUPER_ADMIN } from '@/utils/constants';
import { getAuthCredentials } from '@/utils/auth-utils';
import { NoDataFound } from '@/components/icons/no-data-found';

type IProps = {
  orders: Order[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const OrderTransactionList = ({
  orders,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  // const { data, paginatorInfo } = orders! ?? {};
  const router = useRouter();
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft, alignRight } = useIsRTL();
  const { permissions } = getAuthCredentials();
  const { mutate: createConversations, isLoading: creating } =
    useCreateConversations();
  const [loading, setLoading] = useState<boolean | string | undefined>(false);
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onSubmit = async (shop_id: string | undefined) => {
    setLoading(shop_id);
    createConversations({
      // @ts-ignore
      shop_id,
      via: 'admin',
    });
  };

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

  const columns = [
    {
      title: t('table:table-item-tracking-number'),
      dataIndex: 'tracking_number',
      key: 'tracking_number',
      align: 'center',
      width: 150,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-total')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'paid_total'
          }
          isActive={sortingObj?.column === 'paid_total'}
          className="cursor-pointer"
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'paid_total',
      key: 'paid_total',
      align: 'center',
      width: 120,
      onHeaderCell: () => onHeaderClick('paid_total'),
      render: function Render(paid_total: any) {
        const paid_total_amount = paid_total ? paid_total : 0;
        const { price } = usePrice({
          amount: paid_total_amount,
        });
        return <span className="whitespace-nowrap">{price}</span>;
      },
    },
    {
      title: t('table:table-item-product-price'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      render: function Render(amount: any) {
        const sales_tax_amount = amount ? amount : 0;
        const { price } = usePrice({
          amount: sales_tax_amount,
        });
        return <span>{price}</span>;
      },
    },
    {
      title: t('table:table-item-delivery-fee'),
      dataIndex: 'delivery_fee',
      key: 'delivery_fee',
      align: 'center',
      render: function Render(value: any) {
        const delivery_fee = value ? value : 0;
        const { price } = usePrice({
          amount: delivery_fee,
        });
        return <span>{price}</span>;
      },
    },
    {
      title: t('table:table-item-taxable-amount'),
      dataIndex: 'sales_tax',
      key: 'sales_tax',
      align: 'center',
      render: function Render(sales_tax: any) {
        const sales_tax_amount = sales_tax ? sales_tax : 0;
        const { price } = usePrice({
          amount: sales_tax_amount,
        });
        return <span>{price}</span>;
      },
    },
    {
      title: t('table:table-item-discount'),
      dataIndex: 'discount',
      key: 'discount',
      align: 'center',
      render: function Render(discount: any) {
        const sales_tax_amount = discount ? discount : 0;
        const { price } = usePrice({
          amount: sales_tax_amount,
        });
        return <span>{price}</span>;
      },
    },
    {
      title: t('table:table-item-payment-gateway'),
      dataIndex: 'payment_gateway',
      key: 'payment_gateway',
      align: alignLeft,
      render: (payment_gateway: string) => <div>{payment_gateway}</div>,
    },
    {
      title: t('table:table-item-payment-status'),
      dataIndex: 'payment_status',
      key: 'payment_status',
      align: 'center',
      render: (payment_status: string) => (
        <Badge text={t(payment_status)} color={StatusColor(payment_status)} />
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
          data={orders}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => '',
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo?.total}
            current={paginatorInfo?.currentPage}
            pageSize={paginatorInfo?.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default OrderTransactionList;
