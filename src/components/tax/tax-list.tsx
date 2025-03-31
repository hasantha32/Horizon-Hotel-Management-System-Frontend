import { AlignType, Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { SortOrder, Tax } from '@/types';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';

export type IProps = {
  taxes: Tax[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const TaxList = ({ taxes, onSort, onOrder }: IProps) => {
  const { t } = useTranslation();
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
      width: 130,
      onHeaderCell: () => onHeaderClick('id'),
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft as AlignType,
      width: 150,
      onHeaderCell: () => onHeaderClick('name'),
    },
    {
      title: (
        <TitleWithSort
          title={`${t('table:table-item-rate')} (%)`}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'rate'
          }
          isActive={sortingObj.column === 'rate'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'rate',
      key: 'rate',
      align: 'center' as AlignType,
      onHeaderCell: () => onHeaderClick('rate'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-country')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'country'
          }
          isActive={sortingObj.column === 'country'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'country',
      key: 'country',
      align: 'center' as AlignType,
      onHeaderCell: () => onHeaderClick('country'),
    },
    {
      title: t('table:table-item-city'),
      dataIndex: 'city',
      key: 'city',
      align: 'center' as AlignType,
    },
    {
      title: t('table:table-item-state'),
      dataIndex: 'state',
      key: 'state',
      align: 'center' as AlignType,
    },
    {
      title: t('table:table-item-zip'),
      dataIndex: 'zip',
      key: 'zip',
      align: 'center' as AlignType,
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'right' as AlignType,
      render: (id: string) => (
        <ActionButtons
          id={id}
          editUrl={`${Routes.tax.list}/edit/${id}`}
          deleteModalView="DELETE_TAX"
        />
      ),
      width: 200,
    },
  ];
  return (
    <div className="mb-8 overflow-hidden rounded shadow">
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
        data={taxes}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default TaxList;
