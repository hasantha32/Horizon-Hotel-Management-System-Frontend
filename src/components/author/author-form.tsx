import Input from '@/components/ui/input';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Label from '@/components/ui/label';
import DatePicker from '@/components/ui/date-picker';
import { getErrorMessage } from '@/utils/form-error';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { authorValidationSchema } from './author-validation-schema';
import ValidationError from '@/components/ui/form-validation-error';
import { getIcon } from '@/utils/get-icon';
import SelectInput from '@/components/ui/select-input';
import * as socialIcons from '@/components/icons/social';
import { AttachmentInput, Author, ItemProps, ShopSocialInput } from '@/types';
import { useShopQuery } from '@/data/shop';
import { EditIcon } from '@/components/icons/edit';
import { Config } from '@/config';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { join, split } from 'lodash';
import {
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
} from '@/data/author';
import { useSettingsQuery } from '@/data/settings';
import { useModalAction } from '@/components/ui/modal/modal.context';

import OpenAIButton from '@/components/openAI/openAI.button';
import { formatSlug } from '@/utils/use-slug';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { socialIcon } from '@/settings/site.settings';
import {
  AuthorBioSuggestion,
  AuthorQuoteSuggestion,
} from '@/components/author/author-ai-prompt';
// const socialIcon = [
//   {
//     value: 'FacebookIcon',
//     label: 'Facebook',
//   },
//   {
//     value: 'InstagramIcon',
//     label: 'Instagram',
//   },
//   {
//     value: 'TwitterIcon',
//     label: 'Twitter',
//   },
//   {
//     value: 'YouTubeIcon',
//     label: 'Youtube',
//   },
// ];

export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="flex items-center text-body space-s-4">
      <span className="flex items-center justify-center w-4 h-4">
        {getIcon({
          iconList: socialIcons,
          iconName: item.value,
          className: 'w-4 h-4',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type FormValues = {
  name: string;
  slug: string;
  bio: string;
  quote: string;
  death: string;
  socials: ShopSocialInput[];
  born: string;
  languages: string;
  shop_id: string;
  is_approved: boolean;
  image: AttachmentInput;
  cover_image?: AttachmentInput;
};

type IProps = {
  initialValues?: Author | null;
};

export default function CreateOrUpdateAuthorForm({ initialValues }: IProps) {
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
  const { data: shopData } = useShopQuery(
    {
      slug: shop as string,
    },
    { enabled: !!router.query.shop },
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
    shouldUnregister: true,
    //@ts-ignore
    resolver: yupResolver(authorValidationSchema),
    ...(initialValues && {
      defaultValues: {
        ...initialValues,
        socials: initialValues?.socials
          ? initialValues?.socials.map((social: any) => ({
              icon: updatedIcons?.find((icon) => icon?.value === social?.icon),
              url: social?.url,
            }))
          : [],
        born: initialValues.born ? new Date(initialValues.born!) : '',
        death: initialValues.death ? new Date(initialValues.death!) : '',
      } as any,
    }),
  });

  const { openModal } = useModalAction();
  const slugAutoSuggest = formatSlug(watch('name'));
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const generateName = watch('name');
  const authorBioSuggestionList = useMemo(() => {
    return AuthorBioSuggestion({ name: generateName ?? '' });
  }, [generateName]);

  const handleGenerateBioDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'bio',
      suggestion: authorBioSuggestionList as ItemProps[],
    });
  }, [generateName]);

  const authorQuoteSuggestionLists = useMemo(() => {
    return AuthorQuoteSuggestion({ name: generateName ?? '' });
  }, [generateName]);
  const handleGenerateQuoteDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'quote',
      suggestion: authorQuoteSuggestionLists as ItemProps[],
    });
  }, [generateName]);

  const { mutate: createAuthor, isLoading: creating } =
    useCreateAuthorMutation();
  const { mutate: updateAuthor, isLoading: updating } =
    useUpdateAuthorMutation();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socials',
  });

  const onSubmit = async (values: FormValues) => {
    const input = {
      ...values,
      language: router.locale,
      socials: values?.socials
        ? values?.socials?.map((social: any) => ({
            icon: social?.icon?.value,
            url: social?.url,
          }))
        : [],
      image: {
        thumbnail: values?.image?.thumbnail,
        original: values?.image?.original,
        id: values?.image?.id,
      },
      cover_image: {
        thumbnail: values?.image?.thumbnail,
        original: values?.image?.original,
        id: values?.image?.id,
      },
    };

    try {
      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {
        createAuthor({
          ...input,
          shop_id: shopId,
          ...(initialValues?.slug && { slug: initialValues.slug }),
        });
      } else {
        updateAuthor({
          ...input,
          id: initialValues.id!,
          shop_id: shopId,
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
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-image')}
          details={t('form:author-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-cover-image')}
          details={t('form:author-cover-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="cover_image" control={control} multiple={false} />
        </Card>
      </div>

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:author-form-description-details')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
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
          <Input
            label={t('form:input-label-languages')}
            {...register('languages')}
            error={t(errors.languages?.message!)}
            variant="outline"
            className="mb-5"
            placeholder={t('form:placeholder-add-languages-comma-separated')}
          />

          <div className="relative">
            {options?.useAi && (
              <OpenAIButton
                title={t('form:button-label-description-ai')}
                onClick={handleGenerateBioDescription}
              />
            )}
            <TextArea
              label={t('form:input-label-bio')}
              {...register('bio')}
              variant="outline"
              className="mb-5"
            />
          </div>

          <div className="relative">
            {options?.useAi && (
              <OpenAIButton
                title={t('form:button-label-description-ai')}
                onClick={handleGenerateQuoteDescription}
              />
            )}
            <TextArea
              label={t('form:input-label-quote')}
              {...register('quote')}
              variant="outline"
              className="mb-5"
            />
          </div>

          <div className="flex flex-col mb-5 sm:flex-row">
            <div className="w-full p-0 mb-5 sm:mb-0 sm:w-1/2 sm:pe-2">
              <DatePicker
                control={control}
                name="born"
                dateFormat="dd/MM/yyyy"
                startDate={new Date()}
                locale={locale}
                className="border border-border-base"
                label={t('form:input-label-author-born')}
                error={t(errors?.born?.message!)}
              />
            </div>
            <div className="w-full p-0 sm:w-1/2 sm:ps-2">
              <DatePicker
                control={control}
                name="death"
                dateFormat="dd/MM/yyyy"
                startDate={new Date()}
                locale={locale}
                className="border border-border-base"
                label={t('form:input-label-author-death')}
                error={t(errors?.death?.message!)}
              />
            </div>
          </div>
          {/* Social and Icon picker */}
          <div>
            {fields.map(
              (item: ShopSocialInput & { id: string }, index: number) => (
                <div
                  className="py-5 border-b border-dashed border-border-200 first:mt-5 first:border-t last:border-b-0 md:py-8 md:first:mt-10"
                  key={item.id}
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                    <div className="sm:col-span-2">
                      <Label>{t('form:input-label-select-platform')}</Label>
                      <SelectInput
                        name={`socials.${index}.icon` as const}
                        control={control}
                        options={updatedIcons}
                        isClearable={true}
                        defaultValue={item?.icon!}
                      />
                    </div>
                    {/* <Input
                        className="sm:col-span-2"
                        label={t("form:input-label-icon")}
                        variant="outline"
                        {...register(`socials.${index}.icon` as const)}
                        defaultValue={item?.icon!} // make sure to set up defaultValue
                      /> */}
                    <Input
                      className="sm:col-span-2"
                      label={t('form:input-label-social-url')}
                      variant="outline"
                      {...register(`socials.${index}.url` as const)}
                      defaultValue={item.url!} // make sure to set up defaultValue
                    />
                    <button
                      onClick={() => {
                        remove(index);
                      }}
                      type="button"
                      className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4"
                    >
                      {t('form:button-label-remove')}
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>

          <Button
            type="button"
            onClick={() => append({ icon: '', url: '' })}
            className="w-full sm:w-auto"
          >
            {t('form:button-label-add-social')}
          </Button>
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
              ? t('form:button-label-update-author')
              : t('form:button-label-add-author')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
