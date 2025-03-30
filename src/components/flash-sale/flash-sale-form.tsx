import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from '@/components/ui/date-picker';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Author,
  Category,
  FlashSale,
  FlashSaleType,
  Manufacturer,
  Shop,
  Type,
} from '@/types';
import { getErrorMessage } from '@/utils/form-error';
import { Config } from '@/config';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useSettings } from '@/contexts/settings.context';
import { useSettingsQuery } from '@/data/settings';
import { useModalAction } from '@/components/ui/modal/modal.context';
import OpenAIButton from '@/components/openAI/openAI.button';
import { ItemProps } from '@/types';
import { chatbotAutoSuggestionForFlashSale } from '@/components/flash-sale/flash-sale-ai-prompts';
import { useMeQuery } from '@/data/user';
import { useShopQuery } from '@/data/shop';
import { flashSaleValidationSchema } from '@/components/flash-sale/flash-sale-validation-schema';
import {
  useCreateFlashSaleMutation,
  useUpdateFlashSaleMutation,
} from '@/data/flash-sale';
import SelectInput from '@/components/ui/select-input';
import FileInput from '@/components/ui/file-input';
import { useProductsQuery } from '@/data/product';
import Radio from '@/components/ui/radio/radio';
import SwitchInput from '@/components/ui/switch-input';
import CategoryTypeFilter from '@/components/filters/category-type-filter';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import Alert from '@/components/ui/alert';
import dayjs from 'dayjs';
import ShopFilter from '@/components/filters/shop-filter';
import RichTextEditor from '@/components/ui/wysiwyg-editor/editor';

type FormValues = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  image: any;
  cover_image: any;
  type: FlashSaleType;
  rate: string;
  sale_status: boolean;
  products?: any;
  sale_builder: {
    data_type: string;
    product_ids?: any;
    // author_ids?: any;
    // manufacturer_ids?: any;
  };
};

type IProps = {
  initialValues?: FlashSale | null;
};

export default function CreateOrUpdateFlashSaleForm({ initialValues }: IProps) {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation();
  const [author, setAuthor] = useState('');
  const [type, setType] = useState('');
  const [shop, setShop] = useState('');
  const [category, setCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const { permissions } = getAuthCredentials();
  const { data: user, isLoading: loading, error } = useMeQuery();
  const { currency } = useSettings();
  const { openModal } = useModalAction();
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });
  const { data: shopData } = useShopQuery(
    { slug: router.query.shop as string },
    {
      enabled: !!router.query.shop,
    },
  );
  const shopId = shopData?.id!;

  const { products, loading: loadingProduct } = useProductsQuery({
    limit: 999,
    language: locale,
    type,
    categories: category,
    flash_sale_builder: true,
    status: 'publish',
    shop_id: shop,
    searchedByUser: 'super_admin_builder',
    author: author,
    manufacturer: manufacturer,
  });

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
    defaultValues: initialValues
      ? {
          ...initialValues,
          start_date: new Date(initialValues.start_date!),
          end_date: new Date(initialValues?.end_date!),
          image: initialValues?.image,
          cover_image: initialValues?.cover_image,
          type: initialValues?.type,
          rate: initialValues?.rate,
          sale_status: initialValues?.sale_status,
          sale_builder: initialValues?.sale_builder
            ? initialValues?.sale_builder
            : [],
        }
      : {
          start_date: new Date(),
          type: FlashSaleType.PERCENTAGE,
          sale_builder: {
            data_type: 'handpicked_products',
          },
        },
    //@ts-ignore
    resolver: yupResolver(flashSaleValidationSchema),
  });

  const { mutate: createFlashSale, isLoading: creating } =
    useCreateFlashSaleMutation();
  const { mutate: updateFlashSale, isLoading: updating } =
    useUpdateFlashSaleMutation();

  const flashSaleName = watch('title');
  const autoSuggestionList = useMemo(() => {
    return chatbotAutoSuggestionForFlashSale({ name: flashSaleName ?? '' });
  }, [flashSaleName]);

  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: flashSaleName,
      set_value: setValue,
      key: 'description',
      suggestion: autoSuggestionList as ItemProps[],
    });
  }, [flashSaleName]);

  const [start_date, end_date] = watch(['start_date', 'end_date']);
  const flashSaleType = watch('type');
  const saleBuilderType = watch('sale_builder');
  const saleBuilderDataType = watch('sale_builder.data_type');

  useEffect(() => {
    switch (saleBuilderDataType) {
      case 'handpick_shop':
        setType('');
        setCategory('');
        setAuthor('');
        setManufacturer('');
        break;

      case 'handpick_category':
        setShop('');
        setAuthor('');
        setManufacturer('');
        break;

      case 'handpick_author':
        setShop('');
        setType('');
        setCategory('');
        setManufacturer('');
        break;

      case 'handpick_manufacturer':
        setShop('');
        setType('');
        setCategory('');
        setAuthor('');
        break;
    }
  }, [saleBuilderDataType]);

  const isTranslateFlashSale = router.locale !== Config.defaultLanguage;

  const onSubmit = async (values: FormValues) => {
    const inputValues = {
      language: router.locale,
      title: values.title,
      description: values.description,
      image: values.image,
      cover_image: values.cover_image,
      start_date: new Date(values.start_date).toISOString(),
      end_date: new Date(values.end_date).toISOString(),
      type: values.type,
      rate: values.rate,
      sale_status: values.sale_status,
      sale_builder: {
        data_type: values?.sale_builder?.data_type,
        product_ids: values?.products?.map((product: any) => product?.id),
        // authors: values?.sale_builder?.author_ids,
        // manufacturers: values?.sale_builder?.manufacturer_ids,
      },
    };

    try {
      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {
        createFlashSale({
          ...inputValues,
        });
      } else {
        updateFlashSale({
          ...inputValues,
          id: initialValues.id,
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

  const thumbImageInformation = (
    <span>
      {t('form:flash-sale-thumb-image-help-text')} <br />
      {t('form:flash-sale-grid-image-dimension-help-text')} &nbsp;
      <span className="font-bold">520 x 347{t('common:text-px')}</span>
    </span>
  );

  const coverImageInformation = (
    <span>
      {t('form:flash-sale-cover-image-help-text')} <br />
      {t('form:cover-image-dimension-help-text')} &nbsp;
      <span className="font-bold">1920 x 700{t('common:text-px')}</span>
    </span>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:info-flash-sale-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="my-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput name="sale_status" control={control} />
              <Label className="!mb-0.5">{t('Enable flash deals')}</Label>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:flash-sale-thumb-image-title')}
          details={thumbImageInformation}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:shop-cover-image-title')}
          details={coverImageInformation}
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
          } campaign here.`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={`${t('form:input-title')}`}
            {...register('title')}
            error={t(errors.title?.message!)}
            variant="outline"
            className="mb-5"
            required
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

            {/* {options?.useAi && (
              <OpenAIButton
                title={t('form:button-label-description-ai')}
                onClick={handleGenerateDescription}
              />
            )} */}

<OpenAIButton
                title={t('form:button-label-description-ai')}
                onClick={handleGenerateDescription}
              />

            <RichTextEditor
              title={t('form:input-label-description')}
              error={t(errors?.description?.message!)}
              name="description"
              control={control}
              required
            />
          </div>
          <Alert
            message={t('form:info-flash-sale-select-dates-text')}
            variant="info"
            closeable={false}
            className="mt-5 mb-5"
          />
          <div className="flex flex-col mb-4 sm:flex-row">
            <div className="w-full p-0 mb-5 sm:mb-0 sm:w-1/2 sm:pe-2">
              <DatePicker
                control={control}
                name="start_date"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                maxDate={new Date(end_date)}
                startDate={new Date(start_date)}
                endDate={new Date(end_date)}
                className="border border-border-base"
                disabled={isTranslateFlashSale}
                label={t('form:store-notice-active-from')}
                error={t(errors.start_date?.message!)}
                required
              />
            </div>
            <div className="w-full p-0 sm:w-1/2 sm:ps-2">
              <DatePicker
                control={control}
                name="end_date"
                dateFormat="dd/MM/yyyy"
                startDate={new Date(start_date)}
                endDate={new Date(end_date)}
                minDate={new Date(start_date)}
                className="border border-border-base"
                disabled={isTranslateFlashSale}
                required
                label={t('form:store-notice-expire-at')}
                error={t(errors.end_date?.message!)}
              />
            </div>
          </div>
          <div className="mb-5">
            <Label>
              {t('form:input-label-offering-campaign')}
              <span className="ltr:ml-0.5 rtl:mr-0.5 text-red-500">*</span>
            </Label>
            <div className="mt-5 space-y-3.5">
              <Radio
                label="Fixed rate"
                {...register('type')}
                id="fixed_rate"
                value={FlashSaleType.FIXED_RATE}
                disabled={isTranslateFlashSale}
              />
              <Radio
                label={t('form:input-label-percentage')}
                {...register('type')}
                id="percentage"
                value={FlashSaleType.PERCENTAGE}
                disabled={isTranslateFlashSale}
              />
              {errors.type?.message && (
                <p className="my-2 text-xs text-red-500 ltr:text-left rtl:text-right">
                  {t(errors.type?.message)}
                </p>
              )}
              {/* <Radio
                label="Wallet point gift"
                {...register('type')}
                id="wallet_point_gift"
                value={FlashSaleType.WALLET_POINT_GIFT}
              />
              <Radio
                label={t('form:input-label-free-shipping')}
                {...register('type')}
                id="free_shipping"
                value={FlashSaleType.FREE_SHIPPING}
              /> */}
            </div>
          </div>

          {flashSaleType && (
            <>
              <Input
                label={`${t(
                  flashSaleType,
                )} amount applicable for this campaign (${currency})`}
                {...register('rate')}
                // type="number"
                error={t(errors.rate?.message!)}
                variant="outline"
                className="mb-5"
                disabled={isTranslateFlashSale}
                required
              />
            </>
          )}

          {flashSaleType === FlashSaleType.FIXED_RATE && (
            <>
              <Alert
                message={t('form:info-flash-sale-campaign-rate-text')}
                variant="info"
                closeable={false}
                className="mt-5"
              />
            </>
          )}
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-offering-campaign-choose-products')}
          details={t('form:input-label-offering-campaign-choose-details')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>
              {t('form:input-label-offering-campaign-filter-option')}
              <span className="ml-0.5 text-red-500">*</span>
            </Label>
            <div className="mt-5 space-y-3.5">
              <Radio
                label="Handpicked products"
                {...register('sale_builder.data_type')}
                id="handpicked_products"
                value="handpicked_products"
                disabled={isTranslateFlashSale}
              />
              <Radio
                label="Filter products by group & related Category"
                {...register(`sale_builder.data_type` as const)}
                id="handpick_category"
                value="handpick_category"
                disabled={isTranslateFlashSale}
              />
              <Radio
                label="Filter products by shops"
                {...register(`sale_builder.data_type` as const)}
                id="handpick_shop"
                value="handpick_shop"
                disabled={isTranslateFlashSale}
              />
              <Radio
                label="Filter products by authors"
                {...register(`sale_builder.data_type` as const)}
                id="handpick_author"
                value="handpick_author"
                disabled={isTranslateFlashSale}
              />
              <Radio
                label="Filter products by manufacturer/publications"
                {...register(`sale_builder.data_type` as const)}
                id="handpick_manufacturer"
                value="handpick_manufacturer"
                disabled={isTranslateFlashSale}
              />
              {errors?.sale_builder?.data_type?.message && (
                <p className="my-2 text-xs text-red-500 ltr:text-left rtl:text-right">
                  {t(errors?.sale_builder?.data_type?.message)}
                </p>
              )}
            </div>
          </div>

          {saleBuilderType?.data_type === 'handpick_category' ? (
            <>
              <div className="mt-10">
                <CategoryTypeFilter
                  className="w-full"
                  type={type}
                  enableCategory
                  enableType
                  onCategoryFilter={(category: Category) => {
                    setCategory(category?.slug!);
                  }}
                  onTypeFilter={(type: Type) => {
                    setType(type?.slug!);
                  }}
                />
              </div>
            </>
          ) : (
            ''
          )}

          {saleBuilderType?.data_type === 'handpick_shop' ? (
            <>
              <div className="mt-10">
                <ShopFilter
                  className="w-full"
                  shop={shop}
                  enableShop
                  onShopFilter={(shop: Shop) => {
                    setShop(shop?.id!);
                  }}
                />
              </div>
            </>
          ) : (
            ''
          )}

          {saleBuilderType?.data_type === 'handpick_author' ? (
            <>
              <div className="mt-10">
                <CategoryTypeFilter
                  className="w-full"
                  enableAuthor
                  onAuthorFilter={(author: Author) => {
                    setAuthor(author?.id!);
                  }}
                />
              </div>
            </>
          ) : (
            ''
          )}

          {saleBuilderType?.data_type === 'handpick_manufacturer' ? (
            <>
              <div className="mt-10">
                <CategoryTypeFilter
                  className="w-full"
                  enableManufacturer
                  onManufactureFilter={(manufacture: Manufacturer) => {
                    setManufacturer(manufacture?.id!);
                  }}
                />
              </div>
            </>
          ) : (
            ''
          )}

          {saleBuilderDataType && (
            <div className="mt-10">
              <Label>
                {t('form:input-label-offering-campaign-choose-products')}{' '}
                <span className="ml-0.5 text-red-500">*</span>
              </Label>
              <SelectInput
                name="products"
                control={control}
                getOptionLabel={(option: any) =>
                  `${option.name} ${
                    option?.price ? `- ${currency} ${option?.price}` : ''
                  }`
                }
                getOptionValue={(option: any) => option.id}
                options={products}
                isClearable={true}
                isLoading={loadingProduct}
                isMulti
              />
              <Alert
                message={t('form:info-about-product-chose-on-flash-sale')}
                variant="warning"
                closeable={false}
                className="mt-5"
              />
              {errors?.products?.message && (
                <p className="my-2 text-xs text-red-500 ltr:text-left rtl:text-right">
                  {t(errors?.products?.message)}
                </p>
              )}
            </div>
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
            loading={updating || creating}
            disabled={updating || creating}
            className="text-sm md:text-base"
          >
            {initialValues ? 'Update Campaign' : 'Add Campaign'}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
