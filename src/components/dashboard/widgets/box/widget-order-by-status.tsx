import StickerCard from '@/components/widgets/sticker-card';
import { useTranslation } from 'react-i18next';
import { TodayTotalOrderByStatus } from '@/types';
import { Fragment } from 'react';
import { OrderProcessedIcon } from '@/components/icons/summary/order-processed';
import { CustomersIcon } from '@/components/icons/summary/customers';
import { ChecklistIcon } from '@/components/icons/summary/checklist';
import { EaringIcon } from '@/components/icons/summary/earning';

interface IProps {
  order: TodayTotalOrderByStatus;
  timeFrame?: number;
  allowedStatus: any;
}

const WidgetOrderByStatus: React.FC<IProps> = ({
  order,
  timeFrame = 1,
  allowedStatus,
}) => {
  const { t } = useTranslation();

  let tempContent = [];
  const widgetContents = [
    {
      key: 'pending',
      title: t('text-pending-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <ChecklistIcon className="h-8 w-8" />,
      color: '#0094FF',
      data: order?.pending!,
    },
    {
      key: 'processing',
      title: t('text-processing-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <CustomersIcon className="h-8 w-8" />,
      color: '#28B7FF',
      data: order?.processing!,
    },
    {
      key: 'complete',
      title: t('text-completed-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <OrderProcessedIcon className="h-8 w-8" />,
      color: '#FF8D29',
      data: order?.complete!,
    },
    {
      key: 'cancel',
      title: t('text-cancelled-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <EaringIcon className="h-8 w-8" />,
      color: '#D7E679',
      data: order?.cancelled!,
    },
    {
      key: 'refund',
      title: t('text-refunded-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <OrderProcessedIcon className="h-8 w-8" />,
      color: '#A7F3D0',
      data: order?.refunded!,
    },
    {
      key: 'fail',
      title: t('text-failed-order'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <OrderProcessedIcon className="h-8 w-8" />,
      color: '#A7F3D0',
      data: order?.failed!,
    },
    {
      key: 'local-facility',
      title: t('text-order-local-facility'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <OrderProcessedIcon className="h-8 w-8" />,
      color: '#A7F3D0',
      data: order?.localFacility!,
    },
    {
      key: 'out-for-delivery',
      title: t('text-order-out-delivery'),
      subtitle: `sticker-card-subtitle-last-${timeFrame}-days`,
      icon: <OrderProcessedIcon className="h-8 w-8" />,
      color: '#A7F3D0',
      data: order?.outForDelivery!,
    },
  ];

  for (let index = 0; index < allowedStatus.length; index++) {
    const element = allowedStatus[index];
    const items = widgetContents.find((item) => item.key === element);
    tempContent.push(items);
  }

  return (
    <Fragment>
      <div className="mt-5 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {tempContent && tempContent.length > 0
          ? tempContent.map((content) => {
              return (
                <div className="w-full" key={content?.key}>
                  <StickerCard
                    titleTransKey={content?.title}
                    subtitleTransKey={content?.subtitle}
                    icon={content?.icon}
                    color={content?.color}
                    price={content?.data}
                  />
                </div>
              );
            })
          : ''}
      </div>
    </Fragment>
  );
};

export default WidgetOrderByStatus;
