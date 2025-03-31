import dayjs from 'dayjs';
import { Table } from '@/components/ui/table';
import usePrice from '@/utils/use-price';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Shop, ProductType, Product, MappedPaginatorInfo } from '@/types';
import { useTranslation } from 'next-i18next';
import Badge from '@/components/ui/badge/badge';
import StatusColor from '@/components/order/status-color';
import { useIsRTL } from '@/utils/locals';
import Search from '../common/search';
import Image from 'next/image';
import { siteSettings } from '@/settings/site.settings';
import Pagination from '../ui/pagination';
import { NoDataFound } from '@/components/icons/no-data-found';
import cn from 'classnames';

type IProps = {
  products: Product[];
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  searchElement: React.ReactNode;
  title?: string;
  className?: string;
};

const LowStockProduct = ({
  products,
  title,
  searchElement,
  onPagination,
  paginatorInfo,
  className,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

  const columns = [
    {
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
      width: 140,
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: t('table:table-item-product'),
      dataIndex: 'product',
      key: 'product',
      align: alignLeft,
      width: 280,
      render: (_: string, item: Product) => (
        <div className="flex items-center font-medium">
          <div className="relative aspect-square h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border-200/80 bg-gray-100 me-2">
            <Image
              alt={item.name}
              src={item.image?.thumbnail ?? siteSettings.product.placeholder}
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw"
            />
          </div>
          <span className="truncate">{item.name}</span>
        </div>
      ),
    },
    {
      title: t('table:table-item-sku'),
      dataIndex: 'sku',
      key: 'sku',
      align: alignLeft,
      ellipsis: true,
      width: 170,
      render: (sku: string) => (
        <span className="truncate whitespace-nowrap">{sku}</span>
      ),
    },
    {
      title: t('table:table-item-group'),
      dataIndex: 'type',
      key: 'type',
      align: alignLeft,
      width: 180,
      render: (type: any) => (
        <span className="whitespace-nowrap">{type?.name}</span>
      ),
    },
    {
      title: t('table:table-item-shop'),
      dataIndex: 'shop',
      key: 'shop',
      ellipsis: true,
      align: alignLeft,
      width: 200,
      render: (shop: Shop) => (
        <div className="flex items-center">
          <div className="relative aspect-square h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border-200/80 bg-gray-100 me-2">
            <Image
              src={shop.logo?.thumbnail ?? siteSettings.product.placeholder}
              alt={shop?.name ?? 'Shop Name'}
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw"
            />
          </div>
          <span className="truncate">{shop?.name}</span>
        </div>
      ),
    },
    {
      title: t('table:table-item-unit'),
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      width: 120,
      render: function Render(value: number, record: Product) {
        const { price: max_price } = usePrice({
          amount: record?.max_price as number,
        });
        const { price: min_price } = usePrice({
          amount: record?.min_price as number,
        });

        const { price } = usePrice({
          amount: value,
        });

        const renderPrice =
          record?.product_type === ProductType.Variable
            ? `${min_price} - ${max_price}`
            : price;

        return (
          <span className="whitespace-nowrap font-medium" title={renderPrice}>
            {renderPrice}
          </span>
        );
      },
    },
    {
      title: t('table:table-item-stock-status'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (quantity: any) => {
        return (
          <>
            {quantity < 1 ? (
              <span className="truncate whitespace-nowrap rounded bg-status-failed/10 px-3 py-1.5 text-xs font-medium text-status-failed">
                {t('common:text-out-of-stock')}
              </span>
            ) : (
              <span className="truncate whitespace-nowrap rounded bg-status-processing/10 px-3 py-1.5 text-xs font-medium text-status-processing">
                {t('common:text-low-in-stock')}
              </span>
            )}
          </>
        );
      },
    },
    {
      title: t('table:table-item-quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 120,
    },
  ];

  return (
    <>
      <div
        className={cn(
          'overflow-hidden rounded-lg bg-white p-6 md:p-7',
          className
        )}
      >
        <div className="flex items-center justify-between pb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            {t(title)}
          </h3>
          {searchElement}
        </div>
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
          data={products}
          rowKey="id"
          scroll={{ x: 200 }}
        />
        {!!paginatorInfo?.total && (
          <div className="flex items-center justify-between py-2">
            <div className="mt-2 text-gray-500">
              {paginatorInfo?.currentPage} of {paginatorInfo?.lastPage} pages
            </div>
            <Pagination
              total={paginatorInfo?.total}
              current={paginatorInfo?.currentPage}
              pageSize={paginatorInfo?.perPage}
              onChange={onPagination}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LowStockProduct;
