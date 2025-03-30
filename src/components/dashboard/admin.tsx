import StickerCard from "@/components/widgets/sticker-card";
import { useTranslation } from "next-i18next";
import { EaringIcon } from "@/components/icons/summary/earning";
import { ShoppingIcon } from "@/components/icons/summary/shopping";
import { BasketIcon } from "@/components/icons/summary/basket";
import { ChecklistIcon } from "../icons/summary/checklist";
import PageHeading from "@/components/common/page-heading";
import { useRoomsQuery } from "@/data/room";
import { useRoomCategoriesQuery } from "@/data/room-category";

export default function Dashboard() {
  const { t } = useTranslation();
  const { rooms, loading, paginatorInfo, error } = useRoomsQuery({
    limit: 999,
    page: 1,
  });

  const { roomCategories } = useRoomCategoriesQuery({
    limit: 999,
    page: 1,
  });
  
  // Filter available rooms and get the count
  const availableRooms = rooms?.filter((room) => room.is_available === true)
    .length;

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
          />
          <StickerCard
            titleTransKey="Available Rooms"
            // subtitleTransKey="sticker-card-subtitle-order"
            icon={<ShoppingIcon className="h-8 w-8" />}
            color="#865DFF"
            price={availableRooms}
          />
          <StickerCard
            titleTransKey="Room Categories"
            icon={<BasketIcon className="h-8 w-8" />}
            color="#E157A0"
            price={roomCategories.length}
          />
          <StickerCard
            titleTransKey="Total Customers"
            icon={<ChecklistIcon className="h-8 w-8" />}
            color="#D74EFF"
            // price={todays_revenue}
          />
        </div>
      </div>
    </div>
    // <div className="grid gap-7 md:gap-8 lg:grid-cols-2 2xl:grid-cols-12">
    //   <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
    //     <div className="mb-5 flex items-center justify-between md:mb-7">
    //       <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
    //         {t('text-summary')}
    //       </h3>
    //     </div>

    //     <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
    //       <StickerCard
    //         titleTransKey="sticker-card-title-rev"
    //         subtitleTransKey="sticker-card-subtitle-rev"
    //         icon={<EaringIcon className="h-8 w-8" />}
    //         color="#1EAE98"
    //         price={total_revenue}
    //       />
    //       <StickerCard
    //         titleTransKey="sticker-card-title-order"
    //         subtitleTransKey="sticker-card-subtitle-order"
    //         icon={<ShoppingIcon className="h-8 w-8" />}
    //         color="#865DFF"
    //         price={data?.totalOrders}
    //       />
    //       <StickerCard
    //         titleTransKey="sticker-card-title-vendor"
    //         icon={<ChecklistIcon className="h-8 w-8" />}
    //         color="#D74EFF"
    //         price={data?.totalVendors}
    //       />
    //       <StickerCard
    //         titleTransKey="sticker-card-title-total-shops"
    //         icon={<BasketIcon className="h-8 w-8" />}
    //         color="#E157A0"
    //         price={data?.totalShops}
    //       />
    //     </div>
    //   </div>

    //   <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
    //     <div className="mb-5 items-center justify-between sm:flex md:mb-7">
    //       <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
    //         {t('text-order-status')}
    //       </h3>
    //       <div className="mt-3.5 inline-flex rounded-full bg-gray-100/80 p-1.5 sm:mt-0">
    //         {timeFrame
    //           ? timeFrame.map((time) => (
    //               <div key={time.day} className="relative">
    //                 <Button
    //                   className={cn(
    //                     '!focus:ring-0  relative z-10 !h-7 rounded-full !px-2.5 text-sm font-medium text-gray-500',
    //                     time.day === activeTimeFrame ? 'text-accent' : '',
    //                   )}
    //                   type="button"
    //                   onClick={() => setActiveTimeFrame(time.day)}
    //                   variant="custom"
    //                 >
    //                   {time.name}
    //                 </Button>
    //                 {time.day === activeTimeFrame ? (
    //                   <motion.div className="absolute bottom-0 left-0 right-0 z-0 h-full rounded-3xl bg-accent/10" />
    //                 ) : null}
    //               </div>
    //             ))
    //           : null}
    //       </div>
    //     </div>

    //     <OrderStatusWidget
    //       order={orderDataRange}
    //       timeFrame={activeTimeFrame}
    //       allowedStatus={[
    //         'pending',
    //         'processing',
    //         'complete',
    //         'cancel',
    //         // 'out-for-delivery',
    //       ]}
    //     />
    //   </div>

    //   <RecentOrders
    //     className="col-span-full"
    //     orders={orderData}
    //     paginatorInfo={orderPaginatorInfo}
    //     title={t('table:recent-order-table-title')}
    //     onPagination={handlePagination}
    //     searchElement={
    //       <Search
    //         onSearch={handleSearch}
    //         placeholderText={t('form:input-placeholder-search-name')}
    //         className="hidden max-w-sm sm:inline-block [&button]:top-0.5"
    //         inputClassName="!h-10"
    //       />
    //     }
    //   />
    //   <div className="lg:col-span-full 2xl:col-span-8">
    //     <ColumnChart
    //       widgetTitle={t('common:sale-history')}
    //       colors={['#6073D4']}
    //       series={salesByYear}
    //       categories={[
    //         t('common:january'),
    //         t('common:february'),
    //         t('common:march'),
    //         t('common:april'),
    //         t('common:may'),
    //         t('common:june'),
    //         t('common:july'),
    //         t('common:august'),
    //         t('common:september'),
    //         t('common:october'),
    //         t('common:november'),
    //         t('common:december'),
    //       ]}
    //     />
    //   </div>

    //   <PopularProductList
    //     products={popularProductData}
    //     title={t('table:popular-products-table-title')}
    //     className="lg:col-span-1 lg:col-start-2 lg:row-start-5 2xl:col-span-4 2xl:col-start-auto 2xl:row-start-auto"
    //   />

    //   <LowStockProduct
    //     //@ts-ignore
    //     products={lowStockProduct}
    //     title={'text-low-stock-products'}
    //     paginatorInfo={withdrawPaginatorInfo}
    //     onPagination={handlePagination}
    //     className="col-span-full"
    //     searchElement={
    //       <Search
    //         onSearch={handleSearch}
    //         placeholderText={t('form:input-placeholder-search-name')}
    //         className="hidden max-w-sm sm:inline-block"
    //         inputClassName="!h-10"
    //       />
    //     }
    //   />

    //   <TopRatedProducts
    //     products={topRatedProducts}
    //     title={'text-most-rated-products'}
    //     className="lg:col-span-1 lg:col-start-1 lg:row-start-5 2xl:col-span-5 2xl:col-start-auto 2xl:row-start-auto 2xl:me-20"
    //   />
    //   <ProductCountByCategory
    //     products={productByCategory}
    //     title={'text-most-category-products'}
    //     className="col-span-full 2xl:col-span-7 2xl:ltr:-ml-20 2xl:rtl:-mr-20"
    //   />

    //   <WithdrawTable
    //     withdraws={withdraws}
    //     title={t('table:withdraw-table-title')}
    //     paginatorInfo={withdrawPaginatorInfo}
    //     onPagination={handlePagination}
    //     className="col-span-full"
    //   />
    // </div>
  );
}
