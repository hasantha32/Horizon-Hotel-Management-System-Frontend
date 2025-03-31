import Card from '@/components/common/card';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import Button from '@/components/ui/button';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useModalAction } from '@/components/ui/modal/modal.context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ProductType, Review } from '@/types';
import Link from '@/components/ui/link';
import { StarIcon } from '@/components/icons/star-icon';
import { CheckedIcon } from '@/components/icons/checked';
import { LikeIcon } from '@/components/icons/like-icon';
import { DislikeIcon } from '@/components/icons/dislike-icon';
import isEmpty from 'lodash/isEmpty';
import { NoDataFound } from '@/components/icons/no-data-found';

type IProps = {
  review: Review | undefined | null;
};

const ReviewDetailsView = ({ review }: IProps) => {
  const {
    product,
    id,
    abusive_reports,
    comment,
    negative_feedbacks_count,
    positive_feedbacks_count,
    photos,
    rating,
    user,
  } = review ?? {};

  const {
    slug,
    name,
    image,
    product_type,
    price,
    max_price,
    min_price,
    sale_price,
    ratings,
  } = product ?? {};

  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();
  const { openModal } = useModalAction();

  const { price: currentPrice, basePrice } = usePrice({
    amount: sale_price ? sale_price : price!,
    baseAmount: price ?? 0,
  });
  const { price: minPrice } = usePrice({
    amount: min_price ?? 0,
  });
  const { price: maxPrice } = usePrice({
    amount: max_price ?? 0,
  });

  function handleImageClick() {
    openModal('REVIEW_IMAGE_POPOVER', {
      images: photos,
    });
  }

  function handleAcceptReport() {
    openModal('ACCEPT_ABUSE_REPORT', id);
  }

  function handleDeclineReport() {
    openModal('DECLINE_ABUSE_REPORT', {
      model_id: id,
      model_type: abusive_reports?.[0]?.model_type,
    });
  }

  const columns = [
    {
      title: t('table:table-item-message'),
      key: 'message',
      align: alignLeft,
      width: 650,
      render: (record: any) => <span>{record?.message}</span>,
    },
    {
      title: t('table:table-item-customer-details'),
      key: 'user',
      align: alignLeft,
      width: 200,
      render: (record: any) => (
        <div className="flex flex-col space-y-1">
          <span className="font-semibold text-heading">
            {record?.user?.name}
          </span>
          <span className="text-xs font-semibold text-heading">
            {record?.user?.email}
          </span>
        </div>
      ),
    },
    {
      title: t('table:table-item-created-at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      width: 120,
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
  ];

  return (
    <Card className="md:px-10 xl:px-20">
      <h3 className="mb-8 text-center text-3xl font-semibold text-heading">
        {t('common:text-abuse-report')}
      </h3>

      {/* Product details */}
      <div className="mb-10 flex w-full items-start space-x-4 rtl:space-x-reverse md:space-x-5">
        <div className="relative h-20 w-20 shrink-0 border border-gray-200">
          <Image
            src={image?.thumbnail ?? siteSettings.product.placeholder}
            alt={String(name)}
            width={75}
            height={75}
            className="overflow-hidden rounded"
          />
        </div>

        <div className="flex flex-col space-y-1.5 pe-4 md:pe-5">
          <Link
            href={process.env.NEXT_PUBLIC_SHOP_URL + '/products/' + slug}
            className="text-lg font-semibold text-heading transition-colors hover:text-accent hover:no-underline focus:text-accent-700 focus:no-underline"
          >
            {name}
          </Link>

          {product_type === ProductType.Variable ? (
            <div className="flex items-center">
              <span className="text-sm font-semibold text-heading md:text-base">
                {minPrice}
              </span>
              <span> - </span>
              <span className="text-sm font-semibold text-heading md:text-base">
                {maxPrice}
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-sm font-semibold text-heading md:text-base">
                {currentPrice}
              </span>
              {basePrice && (
                <del className="text-xs text-muted ms-2 md:text-sm">
                  {basePrice}
                </del>
              )}
            </div>
          )}
        </div>

        <div className="!ml-auto inline-flex shrink-0 items-center rounded-full border border-accent px-3 py-0.5 text-base text-accent">
          {ratings}
          <StarIcon className="h-3 w-3 ms-1" />
        </div>
      </div>

      {/* Rating details */}
      <div className="mb-8 block">
        <div className="mb-5 flex items-center justify-between">
          <div className="inline-flex shrink-0 items-center rounded-full border border-accent px-3 py-0.5 text-base text-accent">
            {rating}
            <StarIcon className="h-3 w-3 ms-1" />
          </div>

          {/* Accept/decline buttons */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse md:space-x-5">
            <Button
              size="small"
              variant="outline"
              className="!border-accent text-accent"
              onClick={handleAcceptReport}
            >
              {t('common:text-accept')}
            </Button>
            <Button
              size="small"
              variant="outline"
              className="!border-red-500 text-red-500 hover:border-red-500 hover:bg-red-500"
              onClick={handleDeclineReport}
            >
              {t('common:text-decline')}
            </Button>
          </div>
        </div>

        <div className="mb-3 flex items-center text-xs text-gray-500">
          {t('common:text-by')}{' '}
          <span className="font-semibold capitalize text-heading ltr:ml-1 rtl:mr-1">
            {user?.name ? user?.name : t('common:text-guest')}
          </span>
          {user?.is_active && (
            <CheckedIcon className="h-[13px] w-[13px] text-gray-700 ltr:ml-1 rtl:mr-1" />
          )}
        </div>
        <p className="text-sm leading-6 text-heading">{comment}</p>
        {photos && !isEmpty(photos) && (
          <div className="flex items-start pt-3 space-s-2">
            {photos?.map((photo: any, idx: any) => (
              <div className="mb-1" key={idx}>
                <Image
                  src={photo?.original ?? '/product-placeholder-borderless.svg'}
                  width={32}
                  height={32}
                  className="inline-flex rounded-md bg-gray-200"
                  // @ts-ignore
                  alt={review?.product?.name}
                />
              </div>
            ))}

            <button
              className="my-1.5 text-sm font-semibold text-heading underline transition-colors hover:text-accent"
              onClick={handleImageClick}
            >
              {t('common:text-view-images')}
            </button>
          </div>
        )}
        <div className="mt-4 flex items-center space-x-4 rtl:space-x-reverse">
          <span className="flex items-center text-xs tracking-wider text-gray-400 transition">
            <LikeIcon className="h-4 w-4 me-1.5" />
            {positive_feedbacks_count}
          </span>
          <span className="flex items-center text-xs tracking-wider text-gray-400 transition">
            <DislikeIcon className="h-4 w-4 me-1.5" />
            {negative_feedbacks_count}
          </span>
        </div>
      </div>

      {/* Abuse report table */}
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
        data={abusive_reports}
        rowKey="id"
        scroll={{ x: 700 }}
        // scroll={{ x: 300 }}
      />
    </Card>
  );
};

export default ReviewDetailsView;
