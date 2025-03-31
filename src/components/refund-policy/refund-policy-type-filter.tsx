import { RefundPolicyType } from '@/components/refund-policy/refund-policy-utils';
import Select from '@/components/ui/select/select';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { ActionMeta } from 'react-select';

type Props = {
  onTargetFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
};

export default function RefundPolicyTypeFilter({ onTargetFilter, className }: Props) {
  const { t } = useTranslation();

  return (
    <div className={cn('flex w-full', className)}>
      <div className="w-full">
        <Select
          options={RefundPolicyType}
          getOptionLabel={(option: any) => t(`form:${option.name}`)}
          getOptionValue={(option: any) => option.value}
          placeholder={t('common:filter-by-refund-policy')}
          onChange={onTargetFilter}
          isClearable={true}
        />
      </div>
    </div>
  );
}
