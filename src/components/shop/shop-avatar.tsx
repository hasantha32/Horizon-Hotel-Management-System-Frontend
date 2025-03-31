import classNames from 'classnames';
import Image from 'next/image';
import { Shop } from '@/types';
import { twMerge } from 'tailwind-merge';
import { isEmpty } from 'lodash';

type ShopAvatarProps = {
  is_active: Shop['is_active'];
  logo: Shop['logo'];
  name: Shop['name'];
  size?: 'small' | 'medium';
  className?: string;
};

const ShopAvatar: React.FC<ShopAvatarProps> = ({
  is_active,
  logo,
  name,
  size = 'small',
  className,
  ...rest
}) => {
  return (
    <div
      className={twMerge(
        classNames(
          'shrink-0 rounded-full border-2 bg-[#F2F2F2] drop-shadow-shopLogo',
          is_active ? 'border-accent' : 'border-[#F75159]',
          size === 'small'
            ? 'h-[5.75rem] w-[5.75rem]'
            : 'h-32 w-32 lg:h-[12.125rem] lg:w-[12.125rem]',
          className
        )
      )}
      {...rest}
    >
      <div
        className={classNames(
          'relative p-1.5',
          logo?.original ? '' : 'flex h-full'
        )}
      >
        {logo?.original ? (
          <Image
            alt={name as string}
            src={logo?.original}
            sizes="(max-width: 768px) 100vw"
            className={twMerge(
              classNames(
                'rounded-full object-cover',
                size === 'small'
                  ? 'h-[4.75rem] w-[4.75rem]'
                  : 'h-28 w-28 lg:h-[11.125rem] lg:w-[11.125rem]'
              )
            )}
            width={80}
            height={80}
          />
        ) : (
          <Image
            alt={name as string}
            src={'/shop-logo-placeholder.svg'}
            sizes="(max-width: 768px) 100vw"
            className={classNames(
              'm-auto',
              size === 'small' ? 'w-10' : 'w-14 lg:w-20'
            )}
            width={80}
            height={80}
          />
        )}
        <div
          className={classNames(
            'absolute rounded-full border-2 border-white',
            is_active ? 'bg-accent' : 'bg-[#F75159]',
            size === 'small'
              ? 'top-2 right-[0.625rem] h-2 w-2'
              : 'top-4 right-[4px] h-4 w-4 lg:right-[1.4375rem]'
          )}
        />
      </div>
    </div>
  );
};

export default ShopAvatar;
