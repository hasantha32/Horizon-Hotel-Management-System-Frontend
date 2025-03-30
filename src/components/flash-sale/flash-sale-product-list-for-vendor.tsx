import { NoDataFound } from '@/components/icons/no-data-found';
import Badge from '@/components/ui/badge/badge';
import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { siteSettings } from '@/settings/site.settings';
import { MappedPaginatorInfo, Product, ProductType, SortOrder } from '@/types';
import { useIsRTL } from '@/utils/locals';
import usePrice from '@/utils/use-price';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

export type IProps = {
  products: Product[] | undefined;
  paginatorInfo?: MappedPaginatorInfo | null;
  onPagination?: (current: number) => void;
};

type SearchValue = {
  searchText: string;
};

type SortingObjType = {
  sort: SortOrder;
  column: string | null;
};

export const LimitList = [
  {
    name: 30,
    value: 30,
  },
  {
    name: 25,
    value: 25,
  },
  {
    name: 20,
    value: 20,
  },
  {
    name: 15,
    value: 15,
  },
  {
    name: 10,
    value: 10,
  },
  {
    name: 5,
    value: 5,
  },
];

const FlashSaleProductListForVendor = ({
  products,
  paginatorInfo,
  onPagination,
}: IProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

  let columns = [
    {
      title: t('table:table-item-product'),
      dataIndex: 'image',
      key: 'image',
      align: alignLeft,
      width: 280,
      render: (image: any, { name }: { name: string }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8">
            <Image
              src={image?.thumbnail ?? siteSettings.product.placeholder}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw"
              className="block h-full w-full rounded-full"
            />
          </div>
          <h2 className="truncate">{name}</h2>
        </div>
      ),
    },
    {
      title: t('table:table-item-slug'),
      dataIndex: 'slug',
      key: 'slug',
      align: alignLeft,
      render: (slug: string) => {
        return <span className="truncate whitespace-nowrap">{slug}</span>;
      },
    },
    {
      title: t('table:table-item-sku'),
      dataIndex: 'sku',
      key: 'sku',
      align: alignLeft,
      render: (sku: string) => {
        return <span className="truncate whitespace-nowrap">{sku}</span>;
      },
    },
    {
      title: t('table:table-item-product-type'),
      dataIndex: 'product_type',
      key: 'product_type',
      align: alignLeft,
      render: (product_type: string) => (
        <span className="truncate whitespace-nowrap capitalize">
          {product_type}
        </span>
      ),
    },
    {
      title: t('table:table-item-regular-price'),
      dataIndex: 'price',
      key: 'price',
      align: alignLeft,
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
          <span className="whitespace-nowrap" title={renderPrice}>
            {renderPrice}
          </span>
        );
      },
    },

    {
      title: t('table:table-item-quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: alignLeft,
      render: (quantity: number) => {
        if (quantity < 1) {
          return (
            <Badge
              text={t('common:text-out-of-stock')}
              color="bg-red-500 text-red-500"
              className="bg-opacity-10 capitalize"
            />
          );
        }
        return <span>{quantity}</span>;
      },
    },
    {
      title: t('table:table-item-sold-quantity'),
      dataIndex: 'sold_quantity',
      key: 'sold_quantity',
      align: alignLeft,
      render: (sold_quantity: number) => {
        return <span>{sold_quantity}</span>;
      },
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: alignLeft,
      render: (status: string, record: any) => (
        <div
          className={`flex justify-start ${
            record?.quantity > 0 && record?.quantity < 10
              ? 'flex-col items-baseline space-y-3 3xl:flex-row 3xl:space-x-3 3xl:space-y-0 rtl:3xl:space-x-reverse'
              : 'items-center space-x-3 rtl:space-x-reverse'
          }`}
        >
          <Badge
            text={status}
            className={classNames(
              'bg-opacity-10 capitalize',
              status?.toLocaleLowerCase() === 'draft'
                ? 'bg-[#F3AF00] text-[#F3AF00]'
                : 'bg-accent text-accent',
            )}
          />
          {record?.quantity > 0 && record?.quantity < 10 && (
            <Badge
              text={t('common:text-low-quantity')}
              color="bg-red-600"
              animate={true}
              className="capitalize"
            />
          )}
        </div>
      ),
    },
  ];

  if (router?.query?.shop) {
    columns = columns?.filter((column) => column?.key !== 'shop');
  }

  return (
    <>
      <Table
        /* @ts-ignore */
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
        scroll={{ x: 900 }}
        className="flash-sale-table"
      />

      {!!paginatorInfo?.total && (
        <div className="mt-8 flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
            showLessItems
            className="flash-sale-pagination"
          />
        </div>
      )}
    </>
  );
};

export default FlashSaleProductListForVendor;
