import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import { FlashSale, FlashSaleProductsRequest } from '@/types';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

type SingleViewProps = {
  data: FlashSaleProductsRequest;
  className?: string;
};

const SingleViewVendorRequest: React.FC<SingleViewProps> = ({
  data,
  className,
  ...rest
}) => {
  const flashSaleInfo = data?.flash_sale;
  const { t } = useTranslation();

  return (
    <>
      <div className={twMerge(classNames(className))} {...rest}>
        <h2 className="mb-8 border-b border-b-[#E5E5E5] pb-6 text-2xl font-semibold text-muted-black">
          Flash sale request.
        </h2>
        <div className="relative overflow-hidden rounded-tl-[1.25rem] rounded-tr-[1.25rem] bg-white mb-5">
          <div className="p-10">
            {data?.title ? (
              <h3 className="mb-4 text-xl font-semibold text-muted-black">
                {data?.title}
              </h3>
            ) : (
              ''
            )}

            {flashSaleInfo?.description ? (
              <p className="mb-8 text-base leading-[150%] text-[#666] lg:text-lg">
                {flashSaleInfo?.description}
              </p>
            ) : (
              ''
            )}

            <ul className="space-y-4 text-sm lg:text-base [&>li>p]:text-base-dark [&>li>span]:font-semibold [&>li>span]:text-muted-black [&>li]:flex [&>li]:items-center [&>li]:gap-1">
              {flashSaleInfo?.sale_status ? (
                <li>
                  <span>{t('text-campaign-status')} : </span>
                  <p>{flashSaleInfo?.sale_status ? 'On going' : 'On hold'}</p>
                </li>
              ) : (
                ''
              )}

              {flashSaleInfo?.start_date ? (
                <li>
                  <span>{t('notice-active-date')}: </span>
                  <p>
                    {dayjs(flashSaleInfo?.start_date).format('DD MMM YYYY')}
                  </p>
                </li>
              ) : (
                ''
              )}

              {flashSaleInfo?.end_date ? (
                <li>
                  <span>{t('notice-expire-date')}: </span>
                  <p>{dayjs(flashSaleInfo?.end_date).format('DD MMM YYYY')}</p>
                </li>
              ) : (
                ''
              )}

              {flashSaleInfo?.type ? (
                <li>
                  <span>{t('text-campaign-type-on')} : </span>
                  <p>{t(flashSaleInfo?.type)}</p>
                </li>
              ) : (
                ''
              )}

              {flashSaleInfo?.rate ? (
                <li>
                  <span>{t('text-deals-rate')} : </span>
                  <p>
                    {flashSaleInfo?.rate}
                    {flashSaleInfo?.type === 'percentage' ? '% off.' : ''}
                    {flashSaleInfo?.type === 'wallet_point_gift'
                      ? ' point.'
                      : ''}
                    {flashSaleInfo?.type === 'free_shipping' ? ' N/A' : ''}
                  </p>
                </li>
              ) : (
                ''
              )}
            </ul>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white mb-5">
          <div className="p-10">
            <h3 className="mb-4 text-xl font-semibold text-muted-black">
              Request note.
            </h3>
            {data?.note ? (
              <p className="mb-8 text-base leading-[150%] text-[#666] lg:text-lg">
                {data?.note}
              </p>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleViewVendorRequest;
