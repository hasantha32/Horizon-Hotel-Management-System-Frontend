import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import ValidationError from '@/components/ui/form-validation-error';
import { Control } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useTypesQuery, useTypesQuery_v2 } from '@/data/type';
import { useRouter } from 'next/router';

interface Props {
  control: Control<any>;
  error: string | undefined;
}

const ProductGroupInput = ({ control, error }: Props) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { types, loading } = useTypesQuery({
    limit: 200,
    language: locale,
  });
  // const { types_v2 } = useTypesQuery_v2({
  //   limit: 200,
  //   language: locale,
  // });

  return (
    <div className="mb-5">
      <Label>{t('form:input-label-group')}*</Label>
      <SelectInput
        name="type"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={types!}
        isLoading={loading}
      />
      <ValidationError message={t(error!)} />
    </div>
  );
};

export default ProductGroupInput;
