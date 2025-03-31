import { useTranslation } from 'next-i18next';
import cn from 'classnames';

interface Props {
  className?: string;
  name: string;
}

const BlockedView = ({ className, name, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <div
        className={cn(
          'space-y-3 rounded bg-[#ebebeb] px-4 py-5 text-center',
          className
        )}
        {...rest}
      >
        <p className="text-lg">
          {t('text-blocked-content-one')} <strong>{name}</strong>{' '}
          {t('text-account')}
        </p>
        <p className="text-sm">{t('text-blocked-content-two')}</p>
      </div>
    </>
  );
};

export default BlockedView;
