import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { useTypesQuery } from '@/data/type';
import { useRouter } from 'next/router';
import { ActionMeta } from 'react-select';

type Props = {
  onTypeFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
};

export default function TypeFilter({ onTypeFilter, className }: Props) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { types, loading } = useTypesQuery({ language: locale });

  return (
    <div className={cn('flex w-full', className)}>
      <div className="w-full">
        <Select
          options={types}
          isLoading={loading}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.slug}
          placeholder={t('common:filter-by-group-placeholder')}
          onChange={onTypeFilter}
          isClearable={true}
        />
      </div>
    </div>
  );
}
