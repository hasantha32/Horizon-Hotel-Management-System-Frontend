import Card from '@/components/common/card';
import { SaveIcon } from '@/components/icons/save';
import * as socialIcons from '@/components/icons/social';
import { shopValidationSchema } from '@/components/settings/shop/shop-validation-schema';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import SwitchInput from '@/components/ui/switch-input';
import TextArea from '@/components/ui/text-area';
import TooltipLabel from '@/components/ui/tooltip-label';
import { useUpdateSettingsMutation } from '@/data/settings';
import { socialIcon } from '@/settings/site.settings';
import { ContactDetailsInput, Settings } from '@/types';
import { useConfirmRedirectIfDirty } from '@/utils/confirmed-redirect-if-dirty';
import { getIcon } from '@/utils/get-icon';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import SelectInput from '@/components/ui/select-input';

type ShopFormValues = {
  isProductReview: boolean;
  enableTerms: boolean;
  enableCoupons: boolean;
  useGoogleMap: boolean;
  enableReviewPopup: boolean;
  maxShopDistance: number;
  contactDetails: ContactDetailsInput;
  deliveryTime: {
    title: string;
    description: string;
  }[];
  google: {
    isEnable: boolean;
    tagManagerId: string;
  };
  facebook: {
    isEnable: boolean;
    appId: string;
    pageId: string;
  };
  reviewSystem: string;
};

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

type IProps = {
  settings?: Settings | null;
};

export default function SettingsForm({ settings }: IProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router;
  const [isCopied, setIsCopied] = useState(false);
  const { mutate: updateSettingsMutation, isLoading: loading } =
    useUpdateSettingsMutation();
  const { language, options } = settings ?? {};
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ShopFormValues>({
    shouldUnregister: true,
    //@ts-ignore
    resolver: yupResolver(shopValidationSchema),
    defaultValues: {
      ...options,
      contactDetails: {
        ...options?.contactDetails,
        socials: options?.contactDetails?.socials
          ? options?.contactDetails?.socials.map((social: any) => ({
              icon: updatedIcons?.find((icon) => icon?.value === social?.icon),
              url: social?.url,
            }))
          : [],
      },
      deliveryTime: options?.deliveryTime ? options?.deliveryTime : [],
      reviewSystem: options?.reviewSystem
        ? options?.reviewSystem
        : 'review_single_time',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'deliveryTime',
  });

  const useGoogleMap = watch('useGoogleMap');

  async function onSubmit(values: ShopFormValues) {
    updateSettingsMutation({
      language: locale,
      // @ts-ignore
      options: {
        ...values,
        ...options,
        deliveryTime: values?.deliveryTime,
        maxShopDistance: Number(values.maxShopDistance),
        useGoogleMap: values?.useGoogleMap,
        enableTerms: values?.enableTerms,
        enableCoupons: values?.enableCoupons,
        isProductReview: values?.isProductReview,
        enableReviewPopup: values?.enableReviewPopup,
        reviewSystem: values?.reviewSystem,
      },
    });
    reset(values, { keepValues: true });
  }
  useConfirmRedirectIfDirty({ isDirty });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
        <Description
          title={t('form:text-delivery-schedule')}
          details={t('form:delivery-schedule-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            {fields.map((item: any & { id: string }, index: number) => (
              <div
                className="py-5 border-b border-dashed border-border-200 first:pt-0 last:border-0 md:py-8"
                key={item.id}
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                  <div className="grid grid-cols-1 gap-5 sm:col-span-4">
                    <Input
                      label={t('form:input-delivery-time-title')}
                      toolTipText={t('form:input-tooltip-shop-title')}
                      variant="outline"
                      {...register(`deliveryTime.${index}.title` as const)}
                      defaultValue={item?.title!} // make sure to set up defaultValue
                      error={t(errors?.deliveryTime?.[index]?.title?.message)}
                    />
                    <TextArea
                      label={t('form:input-delivery-time-description')}
                      toolTipText={t('form:input-tooltip-shop-description')}
                      variant="outline"
                      {...register(
                        `deliveryTime.${index}.description` as const,
                      )}
                      defaultValue={item.description!} // make sure to set up defaultValue
                    />
                  </div>

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
            ))}
          </div>
          <Button
            type="button"
            onClick={() => append({ title: '', description: '' })}
            className="w-full sm:w-auto"
          >
            {t('form:button-label-add-delivery-time')}
          </Button>

          {errors?.deliveryTime?.message ? (
            <Alert
              message={t(errors?.deliveryTime?.message)}
              variant="error"
              className="mt-5"
            />
          ) : null}
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 my-5 border-b border-gray-300 border-dashed sm:mt-8 sm:mb-3">
        <Description
          title={t('form:shop-settings')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mt-6 mb-5">
            <SwitchInput
              name="isProductReview"
              control={control}
              label={t('form:input-label-product-for-review')}
              toolTipText={t('form:input-tooltip-shop-product-review')}
              // disabled={isNotDefaultSettingsPage}
            />
          </div>
          <div className="mt-6 mb-5">
            <SwitchInput
              name="useGoogleMap"
              control={control}
              label={t('form:input-label-use-google-map-service')}
              toolTipText={t('form:input-tooltip-shop-enable-google-map')}
              // disabled={isNotDefaultSettingsPage}
            />
          </div>
          {useGoogleMap ? (
            <Input
              label={t('text-max-search-location-distance')}
              {...register('maxShopDistance')}
              type="number"
              error={t(errors.maxShopDistance?.message!)}
              variant="outline"
              className="my-5"
              // disabled={isNotDefaultSettingsPage}
            />
          ) : (
            ''
          )}
          <div className="mt-6 mb-5">
            <SwitchInput
              name="enableTerms"
              control={control}
              label={t('form:input-label-terms-conditions-vendors')}
              toolTipText={t('form:input-tooltip-shop-enable-terms')}
              // disabled={isNotDefaultSettingsPage}
            />
          </div>
          <div className="mt-6 mb-5">
            <SwitchInput
              name="enableCoupons"
              control={control}
              label={t('form:input-label-coupons-vendors')}
              toolTipText={t('form:input-tooltip-shop-enable-coupons')}
            />
          </div>
          <div className="mt-6 mb-5">
            <SwitchInput
              name="enableReviewPopup"
              control={control}
              label={t('form:text-enable-review-popup')}
              toolTipText={t('form:input-tooltip-enable-review-popup')}
            />
          </div>
          <div className="mb-5 mt-6">
            <SelectInput
              name="reviewSystem"
              control={control}
              defaultValue={options?.reviewSystem}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.value}
              options={[
                {
                  name: t('form:text-conventional-review-system'),
                  value: 'review_single_time',
                },
                {
                  name: t('form:text-order-basis-review-system'),
                  value: 'review_multiple_time',
                },
              ]}
              label={t('form:text-review-system')}
              toolTipText={t('form:input-tooltip-review-system')}
            />
          </div>
        </Card>
      </div>

      <StickyFooterPanel className="z-0">
        <Button
          loading={loading}
          disabled={loading || !Boolean(isDirty)}
          className="text-sm md:text-base"
        >
          <SaveIcon className="relative w-6 h-6 top-px shrink-0 ltr:mr-2 rtl:pl-2" />
          {t('form:button-label-save-settings')}
        </Button>
      </StickyFooterPanel>
    </form>
  );
}
