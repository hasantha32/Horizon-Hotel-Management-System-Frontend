import { getIcon } from '@/utils/get-icon';
import * as productsCardIcon from '@/components/icons/shop-single';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';

type IconCardProps = {
  title: string;
  content: string;
  icon: string;
  className?: string;
  iconClassName?: string;
  iconInnerClassName?: string;
};

export const IconCard: React.FC<IconCardProps> = ({
  title,
  content,
  icon,
  className,
  iconClassName,
  iconInnerClassName,
  ...rest
}) => {
  return (
    <>
      <div
        className={twMerge(
          classNames(
            'flex items-center rounded-lg border border-[#E5E5E5] bg-white 3xl:px-6 px-4 3xl:py-8 py-5',
            className
          )
        )}
        {...rest}
      >
        <div className="max-w-[calc(100%-48px)] flex-1 3xl:max-w-[calc(100%-64px)]">
          {content ? (
            <h2 className="mb-1.5 text-xl md:text-2xl font-medium text-muted-black">
              {content}
            </h2>
          ) : (
            ''
          )}

          {title ? (
            <p className="truncate text-sm text-base-dark">{title}</p>
          ) : (
            ''
          )}
        </div>
        <div
          className={twMerge(
            classNames(
              'relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-current text-[#865DFF] 3xl:h-16 3xl:w-16',
              iconClassName
            )
          )}
        >
          <div
            className={twMerge(
              classNames(
                'flex h-full w-full rounded-full border-[3px] border-white bg-[#F4EFFF] text-3xl',
                iconInnerClassName
              )
            )}
          >
            {getIcon({
              iconList: productsCardIcon,
              iconName: icon,
              className: 'm-auto',
            })}
          </div>
        </div>
      </div>
    </>
  );
};
