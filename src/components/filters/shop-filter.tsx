import Label from '@/components/ui/label';
import Select from '@/components/ui/select/select';
import { useShopsQuery } from '@/data/shop';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ActionMeta } from 'react-select';

type Props = {
  onShopFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
  shop?: string;
  enableShop?: boolean;
};

export default function ShopFilter({
  onShopFilter,
  className,
  shop,
  enableShop,
}: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { shops, loading } = useShopsQuery({
    is_active: true,
  });
  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className,
      )}
    >
      {enableShop ? (
        <div className="w-full">
          <Label>Filter by shops</Label>
          <Select
            options={shops}
            isLoading={loading}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder="filter products by listed shops"
            onChange={onShopFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
