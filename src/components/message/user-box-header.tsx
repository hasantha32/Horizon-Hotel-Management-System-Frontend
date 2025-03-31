import Input from '@/components/ui/input';
import { SearchIcon } from '@/components/icons/search-icon';
import cn from 'classnames';
import { CloseIcon } from '@/components/icons/close-icon';
import { useTranslation } from 'next-i18next';

interface Props {
  className?: string;
  onChange: any;
  value: string;
  clear: any;
}

const UserBoxHeaderView = ({
  className,
  onChange,
  value,
  clear,
  ...rest
}: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <form
        className={cn(
          'relative h-14 border-b border-solid border-b-[#E7E7E7] sm:h-[5.625rem]',
          className
        )}
        {...rest}
        onSubmit={(e) => e.preventDefault()}
        onChange={onChange}
      >
        <Input
          type="text"
          name="search"
          variant="solid"
          className="h-full"
          inputClassName="!bg-white !pr-11 !border-0 !h-full"
          showLabel={false}
          onKeyUp={onChange}
          value={value}
          placeholder={t('text-input-search')}
        />
        <div className="absolute top-0 right-0 flex h-full w-12 select-none">
          {!!value ? (
            <button
              type="button"
              onClick={clear}
              className="my-auto ml-auto mr-3 text-[#9CA3AF] outline-none focus:outline-none active:outline-none"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          ) : (
            <SearchIcon
              height={15}
              width={16}
              className="my-auto ml-auto mr-3 text-[#9CA3AF]"
            />
          )}
        </div>
      </form>
    </>
  );
};

export default UserBoxHeaderView;
