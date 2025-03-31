import { IosArrowLeft } from '@/components/icons/ios-arrow-left';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { useProductFlashSaleInfo } from '@/data/flash-sale';
import { Shop } from '@/types';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

type IProps = {
  initialValues: any;
  shop?: Shop;
};

type FlashSaleProps = {
  flashSale: any;
  shop: any;
};

const FlashSaleInfo = ({ flashSale, shop }: FlashSaleProps) => {
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  const { slug } = shop ?? '';

  let flashSaleRoute = '';
  if (hasAccess(adminOnly, permissions)) {
    flashSaleRoute = Routes?.flashSale.details(flashSale?.slug);
  } else {
    flashSaleRoute = `/${slug}${Routes?.flashSale.details(flashSale?.slug)}`;
  }

  let classes = {
    title: 'font-semibold',
    content: 'text-sm font-normal text-muted-black',
  };

  return (
    <>
      <h3 className="mb-4 text-xl font-semibold">{flashSale?.title}</h3>
      <ul className={`space-y-3.5 ${classes?.content}`}>
        <li>
          <strong className={classes?.title}>
            {t('notice-active-date')}:{' '}
          </strong>
          {dayjs(flashSale?.start_date).format('DD MMM YYYY')}
        </li>
        <li>
          <strong className={classes?.title}>
            {t('notice-expire-date')}:{' '}
          </strong>
          {dayjs(flashSale?.end_date).format('DD MMM YYYY')}
        </li>
        <li>
          <strong className={classes?.title}>
            {t('text-campaign-type-on')} :{' '}
          </strong>
          {t(`${flashSale?.type}`)}
        </li>
        <li>
          <strong className={classes?.title}>{t('text-deals-rate')} : </strong>
          {flashSale?.rate}
        </li>
      </ul>

      <div className="mt-5">
        <Link
          href={flashSaleRoute}
          className="inline-flex items-center text-accent no-underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:underline focus:text-accent-700 focus:no-underline focus:outline-none"
        >
          <IosArrowLeft height={12} width={15} className="mr-2.5" />
          {t('text-see-details')}
        </Link>
      </div>
    </>
  );
};

export default function ProductFlashSaleBox({ initialValues, shop }: IProps) {
  const { flashSaleInfo, error, loading } = useProductFlashSaleInfo({
    id: initialValues?.id,
    language: initialValues?.language,
  });

  return (
    <>
      {flashSaleInfo &&
        Object.entries(flashSaleInfo).map(([key, value]) => {
          return <FlashSaleInfo key={key} flashSale={value} shop={shop} />;
        })}
    </>
  );
}

{
  /* <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
  <Description
    title="Promotional"
    details="Select product promotional settings form here"
    className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
  />

  <Card className="w-full sm:w-8/12 md:w-2/3">
    {initialValues?.in_flash_sale ? (
      <ProductFlashSaleForm initialValues={initialValues} />
    ) : (
      'Not in flash sale'
    )}
  </Card>
</div>; */
}

//   <Checkbox
//     {...register('in_flash_sale')}
//     id="in_flash_sale"
//     label="Ask for availability in flash sale"
//     // disabled={Boolean(is_external)}
//     className="mb-5"
//   />;

//   {
//     ('Currently available in Cyber Monday');
//   }
