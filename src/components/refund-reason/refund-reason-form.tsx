import { useModalAction } from '@/components//ui/modal/modal.context';
import Card from '@/components/common/card';
import { EditIcon } from '@/components/icons/edit';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Input from '@/components/ui/input';
import { Config } from '@/config';
import { useSettingsQuery } from '@/data/settings';
import { RefundReason } from '@/types';
import { getErrorMessage } from '@/utils/form-error';
import { formatSlug } from '@/utils/use-slug';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { refundReasonValidationSchema } from './refund-reason-validation-schema';
import {
  useCreateRefunReasonMutation,
  useUpdateRefundReasonMutation,
} from '@/data/refund-reason';
import { RefundReasonSuggestions } from '@/components/refund-reason/refund-reason-ai-prompt';
import StickyFooterPanel from '../ui/sticky-footer-panel';

type FormValues = {
  name: string;
  slug: string;
  languages: string;
};

type IProps = {
  initialValues?: RefundReason | null;
};

export default function CreateOrUpdateRefundReasonForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const {
    query: { shop },
  } = router;
  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    //@ts-ignore
    resolver: yupResolver(refundReasonValidationSchema),
    ...(initialValues && {
      defaultValues: {
        ...initialValues,
        languages: router?.locale!,
      } as FormValues,
    }),
  });
  const { openModal } = useModalAction();
  const { settings } = useSettingsQuery({
    language: locale!,
  });

  const { options } = settings!;

  const generateName = watch('name');
  const slugAutoSuggest = formatSlug(generateName);
  const autoSuggestionList = useMemo(() => {
    return RefundReasonSuggestions({ name: generateName ?? '' });
  }, [generateName]);

  const { mutate: createRefundReason, isLoading: creating } =
    useCreateRefunReasonMutation();
  const { mutate: updateRefundReason, isLoading: updating } =
    useUpdateRefundReasonMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      ...values,
      language: router.locale!,
      slug: formatSlug(values.slug!),
    };

    try {
      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {
        createRefundReason({
          ...input,
        });
      } else {
        updateRefundReason({
          ...input,
          id: initialValues.id!,
        });
      }
    } catch (error) {
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split('.')[1], {
          type: 'manual',
          message: serverErrors?.validation[field][0],
        });
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:refund-reason-form-description-details')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={`${t('form:input-label-refund-reason-heading')}*`}
            {...register('name')}
            placeholder={t(
              'form:input-label-refund-reason-heading-placeholder',
            )}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />

          {isSlugEditable ? (
            <div className="relative mb-5">
              <Input
                label={t('form:input-label-slug')}
                {...register('slug')}
                error={t(errors.slug?.message!)}
                variant="outline"
                disabled={isSlugDisable}
              />
              <button
                className="absolute top-[27px] right-px z-0 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
                type="button"
                title={t('common:text-edit')}
                onClick={() => setIsSlugDisable(false)}
              >
                <EditIcon width={14} />
              </button>
            </div>
          ) : (
            <Input
              label={t('form:input-label-slug')}
              {...register('slug')}
              value={slugAutoSuggest}
              variant="outline"
              className="mb-5"
              disabled
            />
          )}
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
              ? t('form:button-label-update-refund-reason')
              : t('form:button-label-add-refund-reason')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
