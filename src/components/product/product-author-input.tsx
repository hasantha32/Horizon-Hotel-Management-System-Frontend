import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useAuthorsQuery } from '@/data/author';
import { useRouter } from 'next/router';

interface Props {
  control: Control<any>;
}

const ProductAuthorInput = ({ control }: Props) => {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const { authors, loading } = useAuthorsQuery({
    limit: 1000,
    is_approved: true,
    language: locale,
  });

  return (
    <div className="mb-5">
      <Label>{t('common:text-authors')}</Label>
      <SelectInput
        name="author"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        // @ts-ignore
        // options={data?.authors?.data ?? []}
        options={authors}
        isLoading={loading}
      />
    </div>
  );
};

export default ProductAuthorInput;
