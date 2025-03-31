import { PaymentInfo } from '@/types';
import { useTranslation } from 'next-i18next';
import { ContentListVertical } from '@/components/shop-single/content-list';

type PaymentInfoProps = {
  payment: PaymentInfo;
};

const PaymentInfoList: React.FC<PaymentInfoProps> = ({ payment }) => {
  const { t } = useTranslation();
  return (
    <>
      {payment?.name || payment?.email || payment?.bank || payment?.account ? (
        <div className="relative mt-5 pt-5 xl:mt-9">
          <div className="absolute top-0 -left-8 w-[calc(100%+64px)] border-b border-dashed border-b-[#F0F0F0]" />
          <h2 className="mb-4 text-lg font-semibold text-muted-black xl:mb-6 xl:text-xl">
            {t('common:text-payment-info')}
          </h2>
          <div className="space-y-4">
            <ContentListVertical
              title={t('common:text-name')}
              content={payment?.name as string}
            />

            <ContentListVertical
              title={t('common:text-email')}
              content={payment?.email as string}
            />

            <ContentListVertical
              title={t('common:text-bank')}
              content={payment?.bank as string}
            />

            <ContentListVertical
              title={t('common:text-account-no')}
              content={payment?.account as string}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default PaymentInfoList;
