import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface Props {
  text?: string;
  image?: string;
  className?: string;
  imageParentClassName?: string;
}

const NotFound: React.FC<Props> = ({
  className,
  imageParentClassName,
  text,
  image = '/no-result.svg',
}) => {
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cn('flex flex-col items-center', className))}>
      <div
        className={twMerge(
          cn(
            'relative flex h-full min-h-[380px] w-full items-center justify-center md:min-h-[450px]',
            imageParentClassName
          )
        )}
      >
        <Image
          src={image}
          alt={text ? t(text) : t('text-no-result-found')}
          className="h-full w-full object-contain"
          fill
          sizes="(max-width: 768px) 100vw"
        />
      </div>
      {text && (
        <h3 className="my-7 w-full text-center text-base font-semibold text-heading/80 lg:text-xl">
          {t(text)}
        </h3>
      )}
    </div>
  );
};

export default NotFound;
