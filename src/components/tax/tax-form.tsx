import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { Tax } from '@/types';
import {
  useCreateTaxClassMutation,
  useUpdateTaxClassMutation,
} from '@/data/tax';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { taxValidationSchema } from './tax-validation-schema';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

const defaultValues = {
  name: '',
  rate: 0,
  country: '',
  state: '',
  zip: '',
  city: '',
};

type IProps = {
  initialValues?: Tax | null;
};
export default function CreateOrUpdateTaxForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Tax>({
    shouldUnregister: true,
    //@ts-ignore
    resolver: yupResolver(taxValidationSchema),
    defaultValues: initialValues ?? defaultValues,
  });
  const { mutate: createTaxClass, isLoading: creating } =
    useCreateTaxClassMutation();
  const { mutate: updateTaxClass, isLoading: updating } =
    useUpdateTaxClassMutation();
  const onSubmit = async (values: Tax) => {
    if (initialValues) {
      updateTaxClass({
        id: initialValues.id!,
        ...values,
      });
    } else {
      createTaxClass({
        ...values,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={`${
            initialValues
              ? t('form:item-description-update')
              : t('form:item-description-add')
          } ${t('form:tax-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name', { required: 'Name is required' })}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            required
          />
          <Input
            label={t('form:input-label-rate')}
            {...register('rate')}
            type="number"
            error={t(errors.rate?.message!)}
            variant="outline"
            className="mb-5"
            required
          />
          <Input
            label={t('form:input-label-country')}
            {...register('country')}
            error={t(errors.country?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-city')}
            {...register('city')}
            error={t(errors.city?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-state')}
            {...register('state')}
            error={t(errors.state?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-zip')}
            {...register('zip')}
            error={t(errors.zip?.message!)}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>

      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="text-sm me-4 md:text-base"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
            className="text-sm md:text-base"
          >
            {initialValues
              ? t('form:button-label-update')
              : t('form:button-label-add')}{' '}
            {t('form:button-label-tax')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
