import { EditFillIcon } from '@/components/icons/edit';
import { MapPinIconWithPlatform } from '@/components/icons/map-pin';
import { PhoneIconNew } from '@/components/icons/phone';
import ShopLayout from '@/components/layouts/shop';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { Routes } from '@/config/routes';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';
import {
  adminAndOwnerOnly,
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { formatAddress } from '@/utils/format-address';
import usePrice from '@/utils/use-price';
import dayjs from 'dayjs';
import isEmpty from 'lodash/isEmpty';
import { GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
// import AccessDeniedPage from '@/components/common/access-denied';
// import OwnerLayout from '@/components/layouts/owner';
import { EmailAtIcon } from '@/components/icons/email';
import { ExternalLinkIcon } from '@/components/icons/external-link';
import { IconCard } from '@/components/icons/shop-single/icon-card';
import {
  ContentListHorizontal,
  ContentListVertical,
} from '@/components/shop-single/content-list';
import PaymentInfoList from '@/components/shop-single/payment-info';
import ShortDescription from '@/components/shop-single/short-description';
import ShopAvatar from '@/components/shop/shop-avatar';
import Alert from '@/components/ui/alert';
import Link from '@/components/ui/link';
import { PaymentInfo } from '@/types';
import { useFormatPhoneNumber } from '@/utils/format-phone-number';
import { useSettingsQuery } from '@/data/settings';

export default function ShopPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { permissions, role } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const {
    query: { shop },
    locale,
  } = useRouter();
  const { settings } = useSettingsQuery({
    language: locale!,
  });
  const {
    data,
    isLoading: loading,
    error,
  } = useShopQuery({
    slug: shop!.toString(),
  });
  const { price: totalEarnings } = usePrice(
    data && {
      amount: data?.balance?.total_earnings!,
    },
  );
  const { price: currentBalance } = usePrice(
    data && {
      amount: data?.balance?.current_balance!,
    },
  );

  const phoneNumber = useFormatPhoneNumber({
    customer_contact: data?.settings?.contact as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  const {
    name,
    is_active,
    logo,
    cover_image,
    description,
    products_count,
    orders_count,
    balance,
    address,
    created_at,
    slug,
    owner,
    id: shop_id,
  } = data ?? {};

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shop_id) &&
    me?.managed_shop?.id != shop_id
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <div className="-m-5 md:-m-8">
      {!is_active && (
        <Alert
          className="mb-4"
          message={t('common:text-permission-message')}
          variant="error"
        />
      )}
      {/* {settings?.options?.maintenance?.isUnderMaintenance && (
        <Alert
          className="mb-4"
          message="Site is under maintenance."
          variant="info"
        />
      )} */}
      <div className="relative h-[20rem] bg-white lg:h-[37.5rem]">
        <Image
          src={cover_image?.original ?? '/shop-fallback-cover-photo.png'}
          // fill
          height={600}
          width={1200}
          sizes="(max-width: 768px) 100vw"
          alt={Object(name)}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative z-10 px-4 lg:px-6 xl:px-10">
        <div className="-mt-16 flex flex-wrap gap-6 lg:-mt-[6.0625rem] 2xl:flex-nowrap">
          <div className="shrink-0">
            <ShopAvatar
              is_active={is_active}
              name={name}
              logo={logo}
              size="medium"
            />
          </div>
          <div className="flex w-full flex-wrap justify-between self-end 2xl:flex-1">
            <div className="flex-auto pr-5 xl:flex-1">
              <div className="mb-3 flex items-center gap-2 text-2xl">
                {name ? (
                  <h1 className="font-semibold leading-none text-muted-black">
                    {name}
                  </h1>
                ) : (
                  ''
                )}
                <Link
                  href={Routes.visitStore(`shops/${slug as string}`)}
                  target="_blank"
                  className="text-[#666666] transition-colors duration-300 hover:text-opacity-60"
                >
                  <ExternalLinkIcon />
                </Link>
              </div>
              <div className="flex flex-col space-y-3 divide-[#E7E7E7] leading-none xl:flex-row xl:space-y-0 xl:space-x-5 xl:divide-x">
                {owner?.email ? (
                  <ContentListHorizontal
                    content={owner?.email}
                    isLink
                    link={`mailto:${owner?.email}`}
                  >
                    <EmailAtIcon />
                  </ContentListHorizontal>
                ) : (
                  ''
                )}

                {!isEmpty(formatAddress(address!)) ? (
                  <ContentListHorizontal
                    content={formatAddress(address!) as string}
                    className="xl:pl-5"
                    link={`https://www.google.com/maps/place/${formatAddress(
                      address!,
                    )}`}
                    isLink
                  >
                    <MapPinIconWithPlatform />
                  </ContentListHorizontal>
                ) : (
                  ''
                )}

                {phoneNumber ? (
                  <ContentListHorizontal
                    content={phoneNumber}
                    isLink
                    className="xl:pl-5"
                    link={`tel:${phoneNumber}`}
                  >
                    <PhoneIconNew />
                  </ContentListHorizontal>
                ) : (
                  ''
                )}
              </div>
            </div>
            {hasAccess(adminAndOwnerOnly, permissions) && (
              <div className="self-end pt-4 xl:pt-0">
                <Link
                  className="inline-flex items-center gap-1 rounded-full bg-accent px-[0.625rem] py-[0.5625rem] text-xs font-medium text-white hover:bg-accent-hover"
                  href={`/${shop}/edit`}
                >
                  <EditFillIcon />
                  {t('common:text-edit-shop')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* shop payment info and description */}
        <div className="my-10 flex flex-wrap items-stretch gap-4 lg:gap-6 xl:gap-10">
          <div className="relative w-full shrink-0 overflow-hidden rounded-lg bg-white p-4 lg:w-[18rem] lg:p-6 xl:w-[22.375rem] xl:p-8">
            <ContentListVertical
              title={t('common:text-registered-since')}
              content={dayjs(created_at).format('MMMM D, YYYY')}
            />

            {description ? (
              <div className="relative mt-5 pt-5 xl:mt-7 xl:pt-7">
                <h2 className="mb-4 text-lg font-semibold text-muted-black xl:text-xl">
                  {t('common:text-bio')}
                </h2>

                <ShortDescription content={description} character={90} />
                <div className="absolute top-0 -left-8 w-[calc(100%+64px)] border-b border-dashed border-b-[#F0F0F0]" />
              </div>
            ) : (
              ''
            )}

            <PaymentInfoList payment={balance?.payment_info as PaymentInfo} />
          </div>

          {/* Dashboard */}
          <div className="w-full flex-1 rounded-lg bg-white p-4 lg:p-6 xl:p-7 2xl:p-10">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 xl:gap-5 2xl:grid-cols-3 2xl:gap-7">
              <IconCard
                content={products_count?.toString() as string}
                title={t('common:text-total-products')}
                icon="ProductsIcon"
              />
              <IconCard
                content={orders_count?.toString() as string}
                title={t('common:text-total-orders')}
                icon="OrdersIcon"
                iconClassName="text-[#FF8D29]"
                iconInnerClassName="bg-[#FFF0E2]"
              />
              {role !== 'staff' ? (
                <>
                  <IconCard
                    content={`${balance?.admin_commission_rate ?? 0}%`}
                    title={t('common:text-commission-rate')}
                    icon="CommissionIcon"
                    iconClassName="text-[#DF0D00]"
                    iconInnerClassName="bg-[#FFF7F6]"
                  />
                  <IconCard
                    content={totalEarnings as string}
                    title={t('common:text-gross-sales')}
                    icon="GrossSaleIcon"
                    iconClassName="text-[#00AAFF]"
                    iconInnerClassName="bg-[#EFFAFF]"
                  />
                  <IconCard
                    content={currentBalance as string}
                    title={t('common:text-current-balance')}
                    icon="CurrentBalanceIcon"
                    iconClassName="text-[#0017E1]"
                    iconInnerClassName="bg-[#F0F2FF]"
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
ShopPage.Layout = ShopLayout;
ShopPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};
