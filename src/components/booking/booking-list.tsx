import Pagination from "@/components/ui/pagination";
import Image from "next/image";
import { Table } from "@/components/ui/table";
import { Booking, Room, SortOrder } from "@/types";
import { siteSettings } from "@/settings/site.settings";
import usePrice from "@/utils/use-price";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import TitleWithSort from "@/components/ui/title-with-sort";
import { Coupon, MappedPaginatorInfo, Attachment } from "@/types";
import { Routes } from "@/config/routes";
import LanguageSwitcher from "@/components/ui/lang-action/action";
import { NoDataFound } from "@/components/icons/no-data-found";
import { useIsRTL } from "@/utils/locals";
import Badge from "../ui/badge/badge";
import { getAuthCredentials } from "@/utils/auth-utils";
import { useRouter } from "next/router";
import StatusColor from "../order/status-color";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  // coupons: CouponPaginator | null | undefined;
  bookings: Booking[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const BookingList = ({
  bookings,
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
      title: "Booking No.",
      dataIndex: "booking_number",
      key: "booking_number",
      align: alignLeft,
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      align: alignLeft,
    },
    {
      title: "Check-In",
      dataIndex: "check_in",
      key: "check_in",
      align: alignLeft,
    },
    {
      title: "Check-Out",
      dataIndex: "check_out",
      key: "check_out",
      align: alignLeft,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: alignLeft,
    },
    {
      title: "Status",
      className: "cursor-pointer",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 150,
      onHeaderCell: () => onHeaderClick("status"),
      render: (status: string) => (
        <Badge text={t(status)} color={StatusColor(status)} />
      ),
    },
    {
      title: "Price",
      dataIndex: "total_price",
      key: "total_price",
      align: alignLeft,
    },
    {
      title: t("table:table-item-actions"),
      dataIndex: "code",
      key: "actions",
      align: "right",
      width: 260,
      render: (slug: string, record: Booking) => (
        <LanguageSwitcher
          slug={record.booking_number}
          record={record}
          deleteModalView="DELETE_BOOKING"
          routes={Routes?.bookings}
          isShop={Boolean(shop)}
          shopSlug={(shop as string) ?? ""}
          // couponApproveButton={true}
          // isCouponApprove={record?.is_approve}
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
                {t("table:empty-table-data")}
              </div>
              <p className="text-[13px]">{t("table:empty-table-sorry-text")}</p>
            </div>
          )}
          data={bookings}
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

export default BookingList;
