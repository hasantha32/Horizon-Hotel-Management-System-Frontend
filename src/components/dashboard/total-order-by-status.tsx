import StickerCard from '@/components/widgets/sticker-card';
import { CartIconBig } from '@/components/icons/cart-icon-bag';
import { useTranslation } from 'react-i18next';
import { TodayTotalOrderByStatus } from '@/types';
import { useAnalyticsQuery } from '@/data/dashboard';
import Loader from '@/components/ui/loader/loader';
import { Fragment } from 'react';

interface IProps {
  order: TodayTotalOrderByStatus;
  timeFrame?: number;
}

const TotalOrderByStatus: React.FC<IProps> = ({ order, timeFrame = 1 }) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <h3>{`For ${timeFrame} days`}</h3>

      <div className="w-full">
        <StickerCard
          titleTransKey="Pending Order"
          subtitleTransKey={`sticker-card-subtitle-last-${timeFrame}-days`}
          icon={<CartIconBig />}
          iconBgStyle={{ backgroundColor: '#A7F3D0' }}
          price={order?.pending!}
        />
      </div>
      <div className="w-full">
        <StickerCard
          titleTransKey={t('text-processing-order')}
          subtitleTransKey={`sticker-card-subtitle-last-${timeFrame}-days`}
          icon={<CartIconBig />}
          iconBgStyle={{ backgroundColor: '#A7F3D0' }}
          price={order?.processing!}
        />
      </div>
      <div className="w-full">
        <StickerCard
          titleTransKey={t('text-completed-order')}
          subtitleTransKey={`sticker-card-subtitle-last-${timeFrame}-days`}
          icon={<CartIconBig />}
          iconBgStyle={{ backgroundColor: '#A7F3D0' }}
          price={order?.complete!}
        />
      </div>
      <div className="w-full">
        <StickerCard
          titleTransKey={t('text-cancelled-order')}
          subtitleTransKey={`sticker-card-subtitle-last-${timeFrame}-days`}
          icon={<CartIconBig />}
          iconBgStyle={{ backgroundColor: '#A7F3D0' }}
          price={order?.cancelled!}
        />
      </div>
      <div className="w-full">
        <StickerCard
          titleTransKey={t('text-refunded-order')}
          subtitleTransKey={`sticker-card-subtitle-last-${timeFrame}-days`}
          icon={<CartIconBig />}
          iconBgStyle={{ backgroundColor: '#A7F3D0' }}
          price={order?.refunded!}
        />
      </div>
      <div className="w-full">
        <StickerCard
          titleTransKey={t('text-failed-order')}
          subtitleTransKey={`sticker-card-subtitle-last-${timeFrame}-days`}
          icon={<CartIconBig />}
          iconBgStyle={{ backgroundColor: '#A7F3D0' }}
          price={order?.failed!}
        />
      </div>
      <div className="w-full">
        <StickerCard
          titleTransKey={t('text-order-local-facility')}
          subtitleTransKey={`sticker-card-subtitle-last-${timeFrame}-days`}
          icon={<CartIconBig />}
          iconBgStyle={{ backgroundColor: '#A7F3D0' }}
          price={order?.localFacility!}
        />
      </div>
      <div className="w-full">
        <StickerCard
          titleTransKey={t('text-order-out-delivery')}
          subtitleTransKey={`sticker-card-subtitle-last-${timeFrame}-days`}
          icon={<CartIconBig />}
          iconBgStyle={{ backgroundColor: '#A7F3D0' }}
          price={order?.outForDelivery!}
        />
      </div>
    </Fragment>
  );
};

export default TotalOrderByStatus;
