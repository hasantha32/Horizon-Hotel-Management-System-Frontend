import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import ValidationError from '@/components/ui/form-validation-error';
import { Control, useFormState, useWatch } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useUsersOrShopsQuery } from '@/data/store-notice';
import { useEffect } from 'react';
import { StoreNoticeType } from '@/types';

interface Props {
  className?: string;
  control: Control<any>;
  setValue: any;
  error?: string | undefined;
}

const NoticeReceivedByInput = ({
  className = 'mb-5',
  control,
  setValue,
  error,
}: Props) => {
  const typeArr: any = [StoreNoticeType.all_vendor, StoreNoticeType.all_shop];
  const { t } = useTranslation();
  const { usersOrShops, loading } = useUsersOrShopsQuery();
  const type = useWatch({
    control,
    name: 'type',
  });
  const { dirtyFields } = useFormState({
    control,
  });
  useEffect(() => {
    if (type?.value && dirtyFields?.type) {
      setValue('received_by', []);
    }
  }, [type?.value]);

  return (
    <div className={className}>
      <Label>
        {t('form:input-label-received-by')}
        {dirtyFields?.type && !typeArr.includes(type?.value) && '*'}
      </Label>
      <SelectInput
        name="received_by"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={usersOrShops!}
        isMulti
        isLoading={loading}
      />
      <ValidationError message={t(error!)} />
    </div>
  );
};

export default NoticeReceivedByInput;
