import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { TermsAndConditions } from '@/types';
import { getErrorMessage } from '@/utils/form-error';
import { Config } from '@/config';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useSettingsQuery } from '@/data/settings';
import { useCallback, useMemo } from 'react';
import { useModalAction } from '@/components/ui/modal/modal.context';
import OpenAIButton from '@/components/openAI/openAI.button';
import { ItemProps } from '@/types';
import { chatbotAutoSuggestionForTermsAndConditions } from '@/components/terms-and-conditions/terms-and-conditions-ai-prompts';
import { termsAndConditionsValidationSchema } from '@/components/terms-and-conditions/terms-and-conditions-validation-schema';
import { useMeQuery } from '@/data/user';
import { useShopQuery } from '@/data/shop';
import {
  useCreateTermsAndConditionsMutation,
  useUpdateTermsAndConditionsMutation,
} from '@/data/terms-and-condition';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import RichTextEditor from '@/components/ui/wysiwyg-editor/editor';

type FormValues = {
  title: string;
  description?: string;
};

type IProps = {
  initialValues?: TermsAndConditions | null;
};
export default function CreateOrUpdateTermsAndConditionsForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  const { data: user, isLoading: loading, error } = useMeQuery();
  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });
  const { openModal } = useModalAction();

  const { data: shopData } = useShopQuery(
    { slug: router.query.shop as string },
    {
      enabled: !!router.query.shop,
    },
  );
  const shopId = shopData?.id!;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-ignore
    defaultValues: initialValues,
    resolver: yupResolver(termsAndConditionsValidationSchema),
  });

  const { mutate: createTermsAndConditions, isLoading: creating } =
    useCreateTermsAndConditionsMutation();
  const { mutate: updateTermsAndConditions, isLoading: updating } =
    useUpdateTermsAndConditionsMutation();

  const termsAndConditionsName = watch('title');
  const autoSuggestionList = useMemo(() => {
    return chatbotAutoSuggestionForTermsAndConditions({
      name: termsAndConditionsName ?? '',
    });
  }, [termsAndConditionsName]);

  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: termsAndConditionsName,
      set_value: setValue,
      key: 'description',
      suggestion: autoSuggestionList as ItemProps[],
    });
  }, [termsAndConditionsName]);

  const isTranslateTermsAndConditions =
    router.locale !== Config.defaultLanguage;

  const onSubmit = async (values: FormValues) => {
    const inputValues = {
      language: router.locale,
      title: values.title,
      description: values.description,
    };

    try {
      // if (!initialValues) {
      //   createTermsAndConditions({
      //     ...inputValues,
      //     shop_id: shopId || initialValues?.shop_id,
      //   });
      // } else {
      //   updateTermsAndConditions({
      //     ...inputValues,
      //     id: initialValues.id,
      //     shop_id: initialValues.shop_id!,
      //   });
      // }

      // ...(initialValues?.id && { id: initialValues.id }),

      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {
        createTermsAndConditions({
          ...inputValues,
          ...(initialValues?.slug && { slug: initialValues.slug }),
          shop_id: shopId || initialValues?.shop_id,
        });
      } else {
        updateTermsAndConditions({
          ...inputValues,
          id: initialValues.id!,
          shop_id: initialValues.shop_id!,
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
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:terms-conditions-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-title')}
            {...register('title')}
            error={t(errors.title?.message!)}
            variant="outline"
            className="mb-5"
            required
            // disabled={isTranslateTermsAndConditions}
          />

          <div className="relative">
            {/* {options?.useAi && (
              <div
                onClick={handleGenerateDescription}
                className="absolute right-0 z-10 text-sm font-medium cursor-pointer -top-1 text-accent hover:text-accent-hover"
              >
                Generate
              </div>
            )} */}

            {options?.useAi && (
              <OpenAIButton
                title={t('form:button-label-description-ai')}
                onClick={handleGenerateDescription}
              />
            )}

            <RichTextEditor
              title={t('form:input-label-description')}
              required={true}
              error={t(errors?.description?.message!)}
              name="description"
              control={control}
            />
          </div>
        </Card>
      </div>
      <StickyFooterPanel className="z-10">
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
              ? t('button-label-update-terms-conditions')
              : t('button-label-add-terms-conditions')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
