import StickerCard from "@/components/widgets/sticker-card";
import { useTranslation } from "next-i18next";
import { EaringIcon } from "@/components/icons/summary/earning";
import { ShoppingIcon } from "@/components/icons/summary/shopping";
import { BasketIcon } from "@/components/icons/summary/basket";
import { ChecklistIcon } from "../icons/summary/checklist";
import PageHeading from "@/components/common/page-heading";
import { useRoomsQuery } from "@/data/room";
import { useRoomCategoriesQuery } from "@/data/room-category";
import { useBookingsQuery } from "@/data/booking-item";

export default function DashboardOriginal() {
  const { t } = useTranslation();
  const url_prefix = process.env.NEXT_PUBLIC_DJANGO_API_ENDPOINT;

  const { rooms } = useRoomsQuery({
    limit: 999,
    page: 1,
  });

  const { roomCategories } = useRoomCategoriesQuery({
    limit: 999,
    page: 1,
  });

  const { bookings } = useBookingsQuery({
    limit: 999,
    page: 1,
  });

  // Filter available rooms and get the count
  const availableRooms = rooms?.filter((room) => room.is_available === true)
    .length;

  function downloadTotalRoomsReport() {
    const url = `${url_prefix}analytics/total-rooms`;
    window.open(url, "_blank");
  }

  function downloadAvailableRoomsReport() {
    const url = `${url_prefix}analytics/available-rooms`;
    window.open(url, "_blank");
  }

  function downloadRoomCategoriesReport() {
    const url = `${url_prefix}analytics/room-categories`;
    window.open(url, "_blank");
  }

  function downloadBookingsReport() {
    const url = `${url_prefix}analytics/bookings`;
    window.open(url, "_blank");
  }

  function downloadRevenueReport() {
    const url = `${url_prefix}analytics/revenue`;
    window.open(url, "_blank");
  }

  return (
    <div>
      <div className="mb-8 rounded-lg bg-light p-5 md:p-8">
        <div className="mb-7 flex items-center justify-between">
          <PageHeading title={t("text-summary")} />
        </div>
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StickerCard
            titleTransKey="Total Rooms"
            // subtitleTransKey="sticker-card-subtitle-rev"
            icon={<EaringIcon className="h-8 w-8" />}
            color="#047857"
            price={rooms.length}
            buttonClick={() => downloadTotalRoomsReport()}
          />
          <StickerCard
            titleTransKey="Available Rooms"
            // subtitleTransKey="sticker-card-subtitle-order"
            icon={<ShoppingIcon className="h-8 w-8" />}
            color="#865DFF"
            price={availableRooms}
            buttonClick={() => downloadAvailableRoomsReport()}
          />
          <StickerCard
            titleTransKey="Room Categories"
            icon={<BasketIcon className="h-8 w-8" />}
            color="#E157A0"
            price={roomCategories.length}
            buttonClick={() => downloadRoomCategoriesReport()}
          />
          <StickerCard
            titleTransKey="Total Bookings"
            icon={<ChecklistIcon className="h-8 w-8" />}
            color="#D74EFF"
            price={bookings.length}
            buttonClick={() => downloadBookingsReport()}
          />
          <StickerCard
            titleTransKey="Total Revenue"
            icon={<ChecklistIcon className="h-8 w-8" />}
            color="#D74EFF"
            // price={bookings.length}
            buttonClick={() => downloadRevenueReport()}
          />
        </div>
      </div>
    </div>
  );
}
