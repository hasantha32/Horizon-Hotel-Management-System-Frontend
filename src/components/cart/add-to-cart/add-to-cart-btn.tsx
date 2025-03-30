import { PlusIcon } from '@/components/icons/plus-icon';
import CartIcon from '@/components/icons/cart';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

type Props = {
  variant?: 'helium' | 'neon' | 'argon' | 'oganesson' | 'single' | 'big';
  onClick(event: React.MouseEvent<HTMLButtonElement | MouseEvent>): void;
  disabled?: boolean;
};

const AddToCartBtn: React.FC<Props> = ({ variant, onClick, disabled }) => {
  const { t } = useTranslation('common');

  switch (variant) {
    case 'neon':
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className="group flex h-7 w-full items-center justify-between rounded bg-gray-100 text-xs text-body-dark transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-none md:h-9 md:text-sm"
        >
          <span className="flex-1">{t('text-add')}</span>
          <span className="rounded-te rounded-be grid h-7 w-7 place-items-center bg-gray-200 transition-colors duration-200 group-hover:bg-accent-600 group-focus:bg-accent-600 md:h-9 md:w-9">
            <PlusIcon className="h-4 w-4 stroke-2 group-hover:text-light" />
          </span>
        </button>
      );
    case 'argon':
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className="flex h-7 w-7 items-center justify-center rounded border border-border-200 bg-light text-sm text-heading transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-none md:h-9 md:w-9"
        >
          <PlusIcon className="h-5 w-5 stroke-2" />
        </button>
      );
    case 'oganesson':
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className="shadow-500 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm text-light transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-none md:h-10 md:w-10"
        >
          <span className="sr-only">{t('text-plus')}</span>
          <PlusIcon className="h-5 w-5 stroke-2 md:h-6 md:w-6" />
        </button>
      );
    case 'single':
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className="order-5 flex items-center justify-center rounded-full border-2 border-border-100 bg-light py-2 px-3 text-sm font-semibold text-accent transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-none sm:order-4 sm:justify-start sm:px-5"
        >
          <CartIcon className="me-2.5 h-4 w-4" />
          <span>{t('text-cart')}</span>
        </button>
      );
    case 'big':
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'flex w-full items-center justify-center rounded bg-accent py-4 px-5 text-sm font-light text-light transition-colors duration-300 hover:bg-accent-hover focus:bg-accent-hover focus:outline-none lg:text-base',
            {
              'cursor-not-allowed border border-border-400 !bg-gray-300 !text-body hover:!bg-gray-300':
                disabled,
            }
          )}
        >
          <span>{t('text-add-cart')}</span>
        </button>
      );
    default:
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          title={disabled ? 'Out Of Stock' : ''}
          className="flex h-7 w-7 items-center justify-center rounded border border-border-200 bg-light text-sm text-accent transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-none md:h-9 md:w-9"
        >
          <span className="sr-only">{t('text-plus')}</span>
          <PlusIcon className="h-5 w-5 stroke-2" />
        </button>
      );
  }
};

export default AddToCartBtn;
