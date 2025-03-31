import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useStoreNoticeQuery } from '@/data/store-notice';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { adminOnly } from '@/utils/auth-utils';
import { IosArrowLeft } from '@/components/icons/ios-arrow-left';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const StoreNoticePage = () => {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    storeNotice: data,
    loading,
    error,
  } = useStoreNoticeQuery({
    id: query?.id as string,
    language: locale as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  let classes = {
    title: 'font-semibold',
    content: 'text-sm font-normal text-[#212121]',
  };

  return (
    <div className="px-8 py-10 bg-white rounded shadow">
      <div className="mb-5">
        <Link
          href={`${Routes?.adminMyShops}?tab=2`}
          className="flex items-center font-bold no-underline transition-colors duration-200 text-accent ms-1 hover:text-accent-hover hover:underline focus:text-accent-700 focus:no-underline focus:outline-none"
        >
          <IosArrowLeft height={12} width={15} className="mr-2.5" />
          {t('common:text-back-to-home')}
        </Link>
      </div>
      <h3 className="mb-6 text-[22px] font-bold">{data?.notice}</h3>

      <p className="mb-6 text-[15px] leading-[1.75em] text-[#5A5A5A]">
        {data?.description}
      </p>

      <ul className={`space-y-3.5 ${classes?.content}`}>
        <li>
          <strong className={classes?.title}>
            {t('notice-active-date')}:{' '}
          </strong>
          {dayjs(data?.effective_from).format('DD MMM YYYY')}
        </li>
        <li>
          <strong className={classes?.title}>
            {t('notice-expire-date')}:{' '}
          </strong>
          {dayjs(data?.expired_at).format('DD MMM YYYY')}
        </li>
        <li>
          <strong className={classes?.title}>{t('notice-created-by')}: </strong>
          {data?.creator_role}
        </li>
      </ul>
    </div>
  );
};

StoreNoticePage.authenticate = {
  permissions: adminOnly,
};
StoreNoticePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default StoreNoticePage;
