import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import {
  useForm,
  useFieldArray,
  FormProvider,
  Controller,
} from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Radio from '@/components/ui/radio/radio';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from '@/components/ui/file-input';
import { productValidationSchema } from '@/components/product/product-validation-schema';
import ProductVariableForm from '@/components/product/product-variable-form';
import ProductSimpleForm from '@/components/product/product-simple-form';
import ProductGroupInput from '@/components/product/product-group-input';
import ProductCategoryInput from '@/components/product/product-category-input';
import ProductTypeInput from '@/components/product/product-type-input';
import { ProductType, Product, ProductStatus } from '@/types';
import { useTranslation } from 'next-i18next';
import { useShopQuery } from '@/data/shop';
import cn from 'classnames';
import ProductTagInput from '@/components/product/product-tag-input';
import { Config } from '@/config';
import Alert from '@/components/ui/alert';
import { useEffect, useMemo, useRef, useState, lazy } from 'react';
import ProductAuthorInput from '@/components/product/product-author-input';
import ProductManufacturerInput from '@/components/product/product-manufacturer-input';
import { EditIcon } from '@/components/icons/edit';
import {
  getProductDefaultValues,
  getProductInputValues,
  ProductFormValues,
} from '@/components/product/form-utils';
import { getErrorMessage } from '@/utils/form-error';
import {
  useCreateProductMutation,
  useCreateProductMutation_v2,
  useUpdateProductMutation,
  useUpdateProductMutation_v2,
} from '@/data/product';
import { isEmpty } from 'lodash';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import { useSettingsQuery } from '@/data/settings';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useCallback } from 'react';
import OpenAIButton from '@/components/openAI/openAI.button';
import { ItemProps } from '@/types';
import { EyeIcon } from '@/components/icons/category/eyes-icon';
import { LongArrowPrev } from '@/components/icons/long-arrow-prev';
import Link from 'next/link';
import { formatSlug } from '@/utils/use-slug';
import ProductFlashSaleBox from '@/components/product/product-flash-sale-box';
import { UpdateIcon } from '@/components/icons/update';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { ProductDescriptionSuggestion } from '@/components/product/product-ai-prompt';
import RichTextEditor from '@/components/ui/wysiwyg-editor/editor';
import TooltipLabel from '@/components/ui/tooltip-label';

type ProductFormProps = {
  initialValues?: Product | null;
};

export default function CreateOrUpdateProductForm({
  initialValues,
}: ProductFormProps) {
  const router = useRouter();
  const { query, locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });
  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const { openModal } = useModalAction();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);

  let statusList = [
    {
      label: 'form:input-label-under-review',
      id: 'under_review',
      value: ProductStatus.UnderReview,
    },
    {
      label: 'form:input-label-draft',
      id: 'draft',
      value: ProductStatus.Draft,
    },
  ];
  // Get creator_id from the localstorage
  const tokens = localStorage.getItem('AUTH_CRED');
  let user_id: string | null = null;
  if (tokens) {
    user_id = JSON.parse(tokens)['user_id'];
  }

  const { data: shopData } = useShopQuery(
    { slug: router.query.shop as string },
    {
      enabled: !!router.query.shop,
    },
  );
  const shopId = shopData?.id!;
  const isNewTranslation = router?.query?.action === 'translate';
  const showPreviewButton =
    router?.query?.action === 'edit' && Boolean(initialValues?.slug);
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  

  const methods = useForm<ProductFormValues>({
    //@ts-ignore
    resolver: yupResolver(productValidationSchema),
    shouldUnregister: true,
    // @ts-ignore
    defaultValues: getProductDefaultValues(initialValues!, isNewTranslation),
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const upload_max_filesize = options?.server_info?.upload_max_filesize / 1024;

  const { mutate: createProduct, isLoading: creating } =
    useCreateProductMutation();
  const { mutate: createProduct_v2} =
    useCreateProductMutation_v2();
  const { mutate: updateProduct, isLoading: updating } =
    useUpdateProductMutation();
  const { mutate: updateProduct_v2} = useUpdateProductMutation_v2();


  const onSubmit = async (values: ProductFormValues) => {
    const inputValues = {
      language: router.locale,
      ...getProductInputValues(values, initialValues),
      created_by: user_id,
      slug: slugAutoSuggest, // To do -> Autosuggest slug gets undefined
    };

    console.log('inputValues: ', inputValues)
    
    try {
      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {

        //@ts-ignore
        // createProduct({
        //   ...inputValues,
        //   ...(initialValues?.slug && { slug: initialValues.slug }),
        //   shop_id: shopId || initialValues?.shop_id,
        // });
        // createProduct_v2({
        //   ...inputValues,
        //   ...(initialValues?.slug && { slug: initialValues.slug }),
        //   shop_id: shopId || initialValues?.shop_id,
        // });
      } else {
        //@ts-ignore
        // updateProduct({
        //   ...inputValues,
        //   id: initialValues.id!,
        //   shop_id: initialValues.shop_id!,
        // });
        updateProduct_v2({
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
  const product_type = watch('product_type');
  const is_digital = watch('is_digital');
  const is_external = watch('is_external');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'video',
  });
  const productName = watch('name');

  const productDescriptionSuggestionLists = useMemo(() => {
    return ProductDescriptionSuggestion({ name: productName ?? '' });
  }, [productName]);

  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: productName,
      set_value: setValue,
      key: 'description',
      suggestion: productDescriptionSuggestionLists as ItemProps[],
    });
  }, [productName]);

  const slugAutoSuggest = formatSlug(watch('name'));
  const slug = watch('slug');

  if (Boolean(options?.isProductReview)) {
    if (permission) {
      if (initialValues?.status !== ProductStatus?.Draft) {
        statusList = [
          {
            label: 'form:input-label-published',
            id: 'published',
            value: ProductStatus.Publish,
          },
          {
            label: 'form:input-label-approved',
            id: 'approved',
            value: ProductStatus.Approved,
          },
          {
            label: 'form:input-label-rejected',
            id: 'rejected',
            value: ProductStatus.Rejected,
          },
          {
            label: 'form:input-label-soft-disabled',
            id: 'unpublish',
            value: ProductStatus.UnPublish,
          },
        ];
      } else {
        statusList = [
          {
            label: 'form:input-label-draft',
            id: 'draft',
            value: ProductStatus.Draft,
          },
        ];
      }
    } else {
      if (
        initialValues?.status === ProductStatus.Publish ||
        initialValues?.status === ProductStatus.Approved ||
        initialValues?.status === ProductStatus.UnPublish
      ) {
        {
          statusList = [
            {
              label: 'form:input-label-published',
              id: 'published',
              value: ProductStatus.Publish,
            },
            {
              label: 'form:input-label-unpublish',
              id: 'unpublish',
              value: ProductStatus.UnPublish,
            },
          ];
        }
      }
    }
  } else {
    statusList = [
      {
        label: 'form:input-label-published',
        id: 'published',
        value: ProductStatus.Publish,
      },
      {
        label: 'form:input-label-draft',
        id: 'draft',
        value: ProductStatus.Draft,
      },
    ];
  }

  const featuredImageInformation = (
    <span>
      {t('form:featured-image-help-text')} <br />
      {t('form:size-help-text')} &nbsp;
      <span className="font-bold">{upload_max_filesize} MB </span>
    </span>
  );

  const galleryImageInformation = (
    <span>
      {t('form:gallery-help-text')} <br />
      {t('form:size-help-text')} &nbsp;
      <span className="font-bold">{upload_max_filesize} MB </span>
    </span>
  );

  const {
    fields: variationsFiled,
    append: variationsAppend,
    remove: variationsRemove,
  } = useFieldArray({
    shouldUnregister: true,
    control,
    name: 'variations',
  });

  // console.log('variationsFiled: ', variationsFiled)

  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
            <Description
              title={t('form:featured-image-title')}
              details={featuredImageInformation}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="image" control={control} multiple={false} />
              {/* {errors.image?.message && (
                <p className="my-2 text-xs text-red-500">
                  {t(errors?.image?.message!)}
                </p>
              )} */}
            </Card>
          </div>

          <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
            <Description
              title={t('form:gallery-title')}
              details={galleryImageInformation}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="gallery" control={control} />
            </Card>
          </div>

          <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
            <Description
              title={t('form:video-title')}
              details={t('form:video-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              {/* Video url picker */}
              <div>
                {fields?.map((item: any, index: number) => (
                  <div
                    className="py-5 border-b border-dashed border-border-200 first:pt-0 last:border-b-0 md:py-8 md:first:pt-0"
                    key={index}
                  >
                    {' '}
                    <div className="flex gap-1 mb-3 text-sm font-semibold leading-none text-body-dark">
                      {`${t('form:input-label-video-embed')} ${index + 1}`}
                      <TooltipLabel toolTipText={'form:text-video-tooltip'} />
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                      <TextArea
                        className="sm:col-span-4"
                        variant="outline"
                        {...register(`video.${index}.url` as const)}
                        defaultValue={item?.url!}
                        // @ts-ignore
                        error={t(errors?.video?.[index]?.url?.message)}
                      />
                      <button
                        onClick={() => {
                          remove(index);
                        }}
                        type="button"
                        className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1"
                      >
                        {t('form:button-label-remove')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={() => {
                  append({ url: '' });
                }}
                className="w-full sm:w-auto"
              >
                {t('form:button-label-add-video')}
              </Button>
            </Card>
          </div>

          <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
            <Description
              title={t('form:type-and-category')}
              details={t('form:type-and-category-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <ProductGroupInput
                control={control}
                error={t((errors?.type as any)?.message)}
              />
              <ProductCategoryInput control={control} setValue={setValue} />
              <ProductAuthorInput control={control} />
              <ProductManufacturerInput control={control} setValue={setValue} />
              <ProductTagInput control={control} setValue={setValue} />
            </Card>
          </div>

          <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
            <Description
              title={t('form:item-description')}
              details={`${
                initialValues
                  ? t('form:item-description-edit')
                  : t('form:item-description-add')
              } ${t('form:product-description-help-text')}`}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <Input
                label={`${t('form:input-label-name')}*`}
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
                    value={slugAutoSuggest}
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
                  // disabled
                  readOnly
                />
              )}
              <Input
                label={`${t('form:input-label-unit')}*`}
                {...register('unit')}
                error={t(errors.unit?.message!)}
                variant="outline"
                className="mb-5"
              />
              <div className="relative mb-5">
                {options?.useAi && (
                  <OpenAIButton
                    title={t('form:button-label-description-ai')}
                    onClick={handleGenerateDescription}
                  />
                )}
                <RichTextEditor
                  title={t('form:input-label-description')}
                  control={control}
                  name="description"
                  error={t(errors?.description?.message)}
                />
              </div>

              <div>
                <Label>{t('form:input-label-status')}</Label>
                {!isEmpty(statusList)
                  ? statusList?.map((status: any, index: number) => (
                      <Radio
                        key={index}
                        {...register('status')}
                        label={t(status?.label)}
                        id={status?.id}
                        value={status?.value}
                        className="mb-2"
                        disabled={
                          permission &&
                          initialValues?.status === ProductStatus?.Draft
                            ? true
                            : false
                        }
                      />
                    ))
                  : ''}
                {errors.status?.message && (
                  <p className="my-2 text-xs text-red-500">
                    {t(errors?.status?.message!)}
                  </p>
                )}
              </div>
            </Card>
          </div>

          {initialValues?.in_flash_sale ? (
            <>
              <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
                <Description
                  title="Promotional"
                  details="Product selected for this campaign."
                  className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
                />
                <Card className="w-full sm:w-8/12 md:w-2/3">
                  <ProductFlashSaleBox
                    initialValues={initialValues}
                    shop={shopData}
                  />
                </Card>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
                <Description
                  title="Promotional"
                  details="Select product promotional settings form here"
                  className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
                />
                <Card className="w-full sm:w-8/12 md:w-2/3">
                  <Alert message={'Product is not selected in any campaign.'} />
                </Card>
              </div>
            </>
          )}

          <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
            <Description
              title={t('form:form-title-product-type')}
              details={t('form:form-description-product-type')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
            />

            <ProductTypeInput />
          </div>

          {/* Simple Type */}
          {product_type?.value === ProductType.Simple && (
            <ProductSimpleForm initialValues={initialValues} />
          )}

          {/* Variation Type */}
          {product_type?.value === ProductType.Variable && (
            <ProductVariableForm
              shopId={shopId}
              initialValues={initialValues}
              settings={options}
              name="variations"
              fields={variationsFiled}
              // @ts-ignore
              append={variationsAppend}
              remove={variationsRemove}
            />
          )}
          <StickyFooterPanel className="z-0">
            <div
              className={cn(
                'flex items-center',
                initialValues ? 'justify-between' : 'justify-end',
              )}
            >
              {initialValues && (
                <Button
                  variant="custom"
                  onClick={router.back}
                  className="!px-0 text-sm !text-body me-4 hover:!text-accent focus:ring-0 md:text-base"
                  type="button"
                  size="medium"
                >
                  <LongArrowPrev className="w-4 h-5 me-2" />
                  {t('form:button-label-back')}
                </Button>
              )}
              <div className="flex items-center">
                {showPreviewButton && (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_SHOP_URL}/products/preview/${query.productSlug}`}
                    target="_blank"
                    className="inline-flex h-12 flex-shrink-0 items-center justify-center rounded border !border-accent bg-transparent px-5 py-0 text-sm font-semibold leading-none !text-accent outline-none transition duration-300 ease-in-out me-4 hover:border-accent hover:bg-accent hover:!text-white focus:shadow focus:outline-none focus:ring-1 focus:ring-accent-700 md:text-base"
                  >
                    <EyeIcon className="w-4 h-4 me-2" />
                    {t('form:button-label-preview-product-on-shop')}
                  </Link>
                )}
                <Button
                  loading={updating || creating}
                  disabled={updating || creating}
                  size="medium"
                  className="text-sm md:text-base"
                >
                  {initialValues ? (
                    <>
                      <UpdateIcon className="w-5 h-5 shrink-0 ltr:mr-2 rtl:pl-2" />
                      <span className="sm:hidden">
                        {t('form:button-label-update')}
                      </span>
                      <span className="hidden sm:block">
                        {t('form:button-label-update-product')}
                      </span>
                    </>
                  ) : (
                    t('form:button-label-add-product')
                  )}
                </Button>
              </div>
            </div>
          </StickyFooterPanel>
          {/* <div className="fixed inset-x-0 left-auto bottom-0 w-full bg-white py-5 px-8 lg:w-[calc(100%-288px)]">
            <div className="flex items-center justify-between">
              {initialValues && (
                <Button
                  variant="custom"
                  onClick={router.back}
                  className="!px-0 !text-body me-4 focus:ring-0"
                  type="button"
                  size="medium"
                >
                  <LongArrowPrev className="w-5 h-5 me-2" />
                  {t('form:button-label-back')}
                </Button>
              )}
              <div className="flex items-center">
                <Link
                  href={`${process.env.NEXT_PUBLIC_SHOP_URL}/products/preview/${query.productSlug}`}
                  target="_blank"
                  className="inline-flex h-12 flex-shrink-0 items-center justify-center rounded border !border-accent bg-transparent px-5 py-0 font-semibold leading-none !text-accent outline-none transition duration-300 ease-in-out me-4 hover:border-accent hover:bg-accent hover:!text-white focus:shadow focus:outline-none focus:ring-1 focus:ring-accent-700"
                >
                  <EyeIcon className="w-4 h-4 me-2" />
                  {t('form:button-label-preview-product-on-shop')}
                </Link>
                <Button loading={updating || creating} size="medium">
                  {initialValues
                    ? t('form:button-label-update-product')
                    : t('form:button-label-add-product')}
                </Button>
              </div>
            </div>
          </div> */}
        </form>
      </FormProvider>
    </>
  );
}
