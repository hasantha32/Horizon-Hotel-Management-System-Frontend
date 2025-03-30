import Select from '@/components/ui/select/select';
import cn from 'classnames';
import Label from '@/components/ui/label';
import { useTranslation } from 'next-i18next';
import { ActionMeta } from 'react-select';

interface Props {
  className?: string;
  showLabel?: boolean;
  onSortChange: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onOrderChange: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  options: {
    id?: number;
    value: string;
    label: string;
  }[];
}

const SortForm: React.FC<Props> = ({
  onSortChange,
  onOrderChange,
  options,
  className,
  showLabel = true,
}) => {
  const { t } = useTranslation('common');

  return (
    <div className={cn('flex w-full items-end', className)}>
      <div className="w-full">
        {showLabel && <Label>{t('filter-by-order')}</Label>}
        <Select
          options={options}
          onChange={onOrderChange}
          name="orderBy"
          placeholder={t('filter-by-order-placeholder')}
        />
      </div>

      <div className="ms-5 w-[150px]">
        <Select
          options={[
            { id: 1, value: 'asc', label: 'ASC' },
            { id: 2, value: 'desc', label: 'DESC' },
          ]}
          onChange={onSortChange}
          defaultValue={{ id: 1, value: 'desc', label: 'DESC' }}
          name="sortedBy"
        />
      </div>
    </div>
  );
};

export default SortForm;
