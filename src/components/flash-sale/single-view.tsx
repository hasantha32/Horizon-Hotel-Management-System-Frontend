import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import { FlashSale } from '@/types';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { useSanitizeContent } from '@/utils/sanitize-content';

type SingleViewProps = {
  data: FlashSale;
  className?: string;
};

const SingleView: React.FC<SingleViewProps> = ({
  data,
  className,
  ...rest
}) => {
  const { t } = useTranslation();
  const description = useSanitizeContent({ description: data?.description });
  return (
    <div className={twMerge(classNames(className))} {...rest}>
      <h2 className="mb-8 border-b border-b-[#E5E5E5] pb-6 text-2xl font-semibold text-muted-black">
        {t('text-flash-sale')}
      </h2>
      <div className="relative overflow-hidden rounded-tl-[1.25rem] rounded-tr-[1.25rem] bg-white">
        <div className="relative overflow-hidden lg:h-[43.75rem]">
          <Image
            src={data?.cover_image?.original ?? '/flash-sale-fallback.png'}
            // fill
            width={2000}
            height={700}
            sizes="(max-width: 768px) 100vw"
            alt={String(data?.cover_image?.id)}
            className="block h-full w-full lg:object-cover lg:object-center"
          />
        </div>
        <div className="p-10">
          {data?.title ? (
            <h3 className="mb-4 text-xl font-semibold text-muted-black">
              {data?.title}
            </h3>
          ) : (
            ''
          )}

          {description ? (
            <p
              className="mb-8 text-base leading-[150%] text-[#666] lg:text-lg react-editor-description"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          ) : (
            ''
          )}

          <ul className="space-y-4 text-sm lg:text-base [&>li>p]:text-base-dark [&>li>span]:font-semibold [&>li>span]:text-muted-black [&>li]:flex [&>li]:items-center [&>li]:gap-1">
            {data?.sale_status ? (
              <li>
                <span>{t('text-campaign-status')} : </span>
                <p>{data?.sale_status ? 'On going' : 'On hold'}</p>
              </li>
            ) : (
              ''
            )}

            {data?.start_date ? (
              <li>
                <span>{t('notice-active-date')}: </span>
                <p>{dayjs(data?.start_date).format('DD MMM YYYY')}</p>
              </li>
            ) : (
              ''
            )}

            {data?.end_date ? (
              <li>
                <span>{t('notice-expire-date')}: </span>
                <p>{dayjs(data?.end_date).format('DD MMM YYYY')}</p>
              </li>
            ) : (
              ''
            )}

            {data?.type ? (
              <li>
                <span>{t('text-campaign-type-on')} : </span>
                <p>{t(data?.type)}</p>
              </li>
            ) : (
              ''
            )}

            {data?.rate ? (
              <li>
                <span>{t('text-deals-rate')} : </span>
                <p>
                  {data?.rate}
                  {data?.type === 'percentage' ? '% off.' : ''}
                  {data?.type === 'wallet_point_gift' ? ' point.' : ''}
                  {data?.type === 'free_shipping' ? ' N/A' : ''}
                </p>
              </li>
            ) : (
              ''
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SingleView;
