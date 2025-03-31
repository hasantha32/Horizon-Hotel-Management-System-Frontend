import Card from '@/components/common/card';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import * as socialIcons from '@/components/icons/social';
import OpenAIButton from '@/components/openAI/openAI.button';
import { AI } from '@/components/settings/ai';
import {
  EMAIL_GROUP_OPTION,
  SMS_GROUP_OPTION,
} from '@/components/settings/events/eventsOption';
import {
  chatbotAutoSuggestion,
  chatbotAutoSuggestion1,
} from '@/components/settings/openAIPromptSample';
import { COUNTRY_LOCALE } from '@/components/settings/payment/country-locale';
import { CURRENCY } from '@/components/settings/payment/currency';
import { PAYMENT_GATEWAY } from '@/components/settings/payment/payment-gateway';
import WebHookURL from '@/components/settings/payment/webhook-url';
import { settingsValidationSchema } from '@/components/settings/settings-validation-schema';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge/badge';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import ValidationError from '@/components/ui/form-validation-error';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import Loader from '@/components/ui/loader/loader';
import { useModalAction } from '@/components/ui/modal/modal.context';
import PaymentSelect from '@/components/ui/payment-select';
import SelectInput from '@/components/ui/select-input';
import SwitchInput from '@/components/ui/switch-input';
import TextArea from '@/components/ui/text-area';
import { Config } from '@/config';
import { useUpdateSettingsMutation } from '@/data/settings';
import { siteSettings } from '@/settings/site.settings';
import {
  AttachmentInput,
  ContactDetailsInput,
  ItemProps,
  ServerInfo,
  SettingCurrencyOptions,
  Settings,
  Shipping,
  ShopSocialInput,
  Tax,
} from '@/types';
import {
  formatEventAPIData,
  formatEventOptions,
} from '@/utils/format-event-options';
import { getIcon } from '@/utils/get-icon';
import { formatPrice } from '@/utils/use-price';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty, split } from 'lodash';
import omit from 'lodash/omit';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { socialIcon } from '@/settings/site.settings';

type FormValues = {
  siteTitle: string;
  siteSubtitle: string;
  currency: any;
  currencyOptions?: SettingCurrencyOptions;
  minimumOrderAmount: number;
  logo: any;
  useOtp: boolean;
  useAi: boolean;
  defaultAi: any;
  useGoogleMap: boolean;
  useMustVerifyEmail: boolean;
  freeShipping: boolean;
  freeShippingAmount: number;
  useCashOnDelivery: boolean;
  defaultPaymentGateway: paymentGatewayOption;
  useEnableGateway: boolean;
  paymentGateway: paymentGatewayOption[];
  taxClass: Tax;
  shippingClass: Shipping;
  signupPoints: number;
  maxShopDistance: number;
  maximumQuestionLimit: number;
  currencyToWalletRatio: number;
  contactDetails: ContactDetailsInput;
  deliveryTime: {
    title: string;
    description: string;
  }[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImage?: AttachmentInput;
    twitterHandle: string;
    twitterCardType: string;
    metaTags: string;
    canonicalUrl: string;
  };
  google: {
    isEnable: boolean;
    tagManagerId: string;
  };
  facebook: {
    isEnable: boolean;
    appId: string;
    pageId: string;
  };
  guestCheckout: boolean;
  smsEvent: any;
  emailEvent: any;
  server_info: ServerInfo;
};

type paymentGatewayOption = {
  name: string;
  title: string;
};

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

type IProps = {
  settings?: Settings | null;
  taxClasses: Tax[] | undefined | null;
  shippingClasses: Shipping[] | undefined | null;
};

// TODO: Split Settings
export default function SettingsForm({
  settings,
  taxClasses,
  shippingClasses,
}: IProps) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const { mutate: updateSettingsMutation, isLoading: loading } =
    useUpdateSettingsMutation();
  const { language, options } = settings ?? {};
  const [serverInfo, SetSeverInfo] = useState(options?.server_info);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    //@ts-ignore
    resolver: yupResolver(settingsValidationSchema),
    defaultValues: {
      ...options,
      server_info: serverInfo,
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
      logo: options?.logo ?? '',
      useEnableGateway: options?.useEnableGateway ?? true,
      guestCheckout: options?.guestCheckout ?? true,
      currency: options?.currency
        ? CURRENCY.find((item) => item.code == options?.currency)
        : '',
      defaultAi: options?.defaultAi
        ? AI.find((item) => item.value == options?.defaultAi)
        : 'openai',

      // single-select on payment gateway
      // paymentGateway: options?.paymentGateway
      //   ? PAYMENT_GATEWAY.find((item) => item.name == options?.paymentGateway)
      //   : PAYMENT_GATEWAY[0],

      defaultPaymentGateway: options?.defaultPaymentGateway
        ? PAYMENT_GATEWAY.find(
            (item) => item.name == options?.defaultPaymentGateway,
          )
        : PAYMENT_GATEWAY[0],

      currencyOptions: {
        ...options?.currencyOptions,
        formation: options?.currencyOptions?.formation
          ? COUNTRY_LOCALE.find(
              (item) => item.code == options?.currencyOptions?.formation,
            )
          : COUNTRY_LOCALE[0],
      },
      // multi-select on payment gateway
      paymentGateway: options?.paymentGateway
        ? options?.paymentGateway?.map((gateway: any) => ({
            name: gateway?.name,
            title: gateway?.title,
          }))
        : [],

      // @ts-ignore
      taxClass: !!taxClasses?.length
        ? taxClasses?.find((tax: Tax) => tax.id == options?.taxClass)
        : '',
      // @ts-ignore
      shippingClass: !!shippingClasses?.length
        ? shippingClasses?.find(
            (shipping: Shipping) => shipping.id == options?.shippingClass,
          )
        : '',
      smsEvent: options?.smsEvent
        ? formatEventAPIData(options?.smsEvent)
        : null,
      emailEvent: options?.emailEvent
        ? formatEventAPIData(options?.emailEvent)
        : null,
    },
  });
  const { openModal } = useModalAction();

  const generateName = watch('siteTitle');
  const autoSuggestionList = useMemo(() => {
    return chatbotAutoSuggestion({ name: generateName ?? '' });
  }, [generateName]);

  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'seo.metaDescription',
      suggestion: autoSuggestionList as ItemProps[],
    });
  }, [generateName]);

  const autoSuggestionList1 = useMemo(() => {
    return chatbotAutoSuggestion1({ name: generateName ?? '' });
  }, [generateName]);
  const handleGenerateDescription1 = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'seo.ogDescription',
      suggestion: autoSuggestionList1 as ItemProps[],
    });
  }, [generateName]);

  const enableFreeShipping = watch('freeShipping');
  const currentCurrency = watch('currency');
  const formation = watch('currencyOptions.formation');
  const currentFractions = watch('currencyOptions.fractions') as number;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'deliveryTime',
  });

  const {
    fields: socialFields,
    append: socialAppend,
    remove: socialRemove,
  } = useFieldArray({
    control,
    name: 'contactDetails.socials',
  });

  // const isNotDefaultSettingsPage = Config.defaultLanguage !== locale;

  async function onSubmit(values: FormValues) {
    const contactDetails = {
      ...values?.contactDetails,
      location: { ...omit(values?.contactDetails?.location, '__typename') },
      socials: values?.contactDetails?.socials
        ? values?.contactDetails?.socials?.map((social: any) => ({
            icon: social?.icon?.value,
            url: social?.url,
          }))
        : [],
    };
    const smsEvent = formatEventOptions(values.smsEvent);
    const emailEvent = formatEventOptions(values.emailEvent);
    updateSettingsMutation({
      language: locale,
      options: {
        ...values,
        server_info: serverInfo,
        signupPoints: Number(values.signupPoints),
        maxShopDistance: Number(values.maxShopDistance),
        currencyToWalletRatio: Number(values.currencyToWalletRatio),
        minimumOrderAmount: Number(values.minimumOrderAmount),
        freeShippingAmount: Number(values.freeShippingAmount),
        currency: values.currency?.code,
        defaultAi: values?.defaultAi?.value,
        // paymentGateway: values.paymentGateway?.name,
        defaultPaymentGateway: values.defaultPaymentGateway?.name,
        paymentGateway:
          values?.paymentGateway && values?.paymentGateway!.length
            ? values?.paymentGateway?.map((gateway: any) => ({
                name: gateway.name,
                title: gateway.title,
              }))
            : PAYMENT_GATEWAY.filter((value: any, index: number) => index < 2),
        useEnableGateway: values?.useEnableGateway,
        guestCheckout: values?.guestCheckout,
        taxClass: values?.taxClass?.id,
        shippingClass: values?.shippingClass?.id,
        logo: values?.logo,
        smsEvent,
        emailEvent,
        contactDetails,
        //@ts-ignore
        seo: {
          ...values?.seo,
          ogImage: values?.seo?.ogImage,
        },
        currencyOptions: {
          ...values.currencyOptions,
          formation: values?.currencyOptions?.formation?.code,
        },
      },
    });
  }

  let paymentGateway = watch('paymentGateway');
  let defaultPaymentGateway = watch('defaultPaymentGateway');
  let useEnableGateway = watch('useEnableGateway');
  // let enableAi = watch('useAi');

  // const upload_max_filesize = options?.server_info?.upload_max_filesize! / 1024;
  const max_fileSize = options?.server_info?.upload_max_filesize! * 1000;

  const logoInformation = (
    <span>
      {t('form:logo-help-text')} <br />
      {t('form:logo-dimension-help-text')} &nbsp;
      <span className="font-bold">
        {siteSettings.logo.width}x{siteSettings.logo.height} {t('common:pixel')}
      </span>
      <br />
      {t('form:size-help-text')} &nbsp;
      <span className="font-bold">{max_fileSize} MB </span>
    </span>
  );

  let checkAvailableDefaultGateway = paymentGateway?.some(
    (item: any) => item?.name === defaultPaymentGateway?.name,
  );

  const isStripeActive = paymentGateway?.some(
    (payment) => payment?.name === 'stripe',
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-logo')}
          details={logoInformation}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="logo"
            control={control}
            multiple={false}
            maxSize={max_fileSize}
          />
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:site-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-site-title')}
            {...register('siteTitle')}
            error={t(errors.siteTitle?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-site-subtitle')}
            {...register('siteSubtitle')}
            error={t(errors.siteSubtitle?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={`${t('form:input-label-min-order-amount')}`}
            {...register('minimumOrderAmount')}
            type="number"
            error={t(errors.minimumOrderAmount?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={isNotDefaultSettingsPage}
          />
          <Input
            label={`${t('form:input-label-wallet-currency-ratio')}`}
            {...register('currencyToWalletRatio')}
            type="number"
            error={t(errors.currencyToWalletRatio?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={isNotDefaultSettingsPage}
          />
          <Input
            label={`${t('form:input-label-signup-points')}`}
            {...register('signupPoints')}
            type="number"
            error={t(errors.signupPoints?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={isNotDefaultSettingsPage}
          />

          <Input
            label={`${t('form:input-label-maximum-question-limit')}`}
            {...register('maximumQuestionLimit')}
            type="number"
            error={t(errors.maximumQuestionLimit?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={isNotDefaultSettingsPage}
          />

          <div className="mb-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="useOtp"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="mb-0">{t('form:input-label-enable-otp')}</Label>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="useMustVerifyEmail"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="mb-0">
                {t('form:input-label-use-must-verify-email')}
              </Label>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="useAi"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="mb-0">
                {t('form:input-label-enable-open-ai')}
              </Label>
            </div>
          </div>
          <div className="mb-5">
            <Label>{t('form:input-label-select-ai')}</Label>
            <SelectInput
              name="defaultAi"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.value}
              options={AI}
              // disabled={isNotDefaultSettingsPage}
            />
          </div>

          <div className="mb-5">
            <Label>{t('form:input-label-tax-class')}</Label>
            <SelectInput
              name="taxClass"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={taxClasses!}
              // disabled={isNotDefaultSettingsPage}
            />
          </div>

          <div className="mb-5">
            <Label>{t('form:input-label-shipping-class')}</Label>
            <SelectInput
              name="shippingClass"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={shippingClasses!}
              // disabled={isNotDefaultSettingsPage}
            />
          </div>
          <div className="mb-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="guestCheckout"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="mb-0">
                {t('form:input-label-enable-guest-checkout')}
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            <SwitchInput
              name="freeShipping"
              control={control}
              checked={enableFreeShipping}
              // disabled={isNotDefaultSettingsPage}
            />
            <Label className="mb-0">
              {t('form:input-label-enable-free-shipping')}
            </Label>
          </div>

          {enableFreeShipping && (
            <Input
              label={t('form:free-shipping-input-label-amount')}
              {...register('freeShippingAmount')}
              error={t(errors.freeShippingAmount?.message!)}
              variant="outline"
              type="number"
              className="mt-5"
              // disabled={isNotDefaultSettingsPage}
            />
          )}
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('Payment')}
          details={t('Configure Payment Option')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="useCashOnDelivery"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="mb-0">{t('Enable Cash On Delivery')}</Label>
            </div>
          </div>
          <div className="mb-5">
            <Label>{t('form:input-label-currency')}</Label>
            <SelectInput
              name="currency"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.code}
              options={CURRENCY}
              // disabled={isNotDefaultSettingsPage}
            />
            <ValidationError message={t(errors.currency?.message)} />
          </div>
          <div className="flex items-center gap-x-4">
            <SwitchInput
              control={control}
              // disabled={isNotDefaultSettingsPage}
              {...register('useEnableGateway')}
            />
            <Label className="mb-0">{t('Enable Gateway')}</Label>
          </div>
          {useEnableGateway ? (
            <>
              <div className="mt-5 mb-5">
                <Label>{t('text-select-payment-gateway')}</Label>
                <PaymentSelect
                  options={PAYMENT_GATEWAY}
                  control={control}
                  name="paymentGateway"
                  defaultItem={
                    checkAvailableDefaultGateway
                      ? defaultPaymentGateway?.name
                      : ''
                  }
                  disable={isEmpty(paymentGateway)}
                />
              </div>

              {isEmpty(paymentGateway) ? (
                <div className="flex px-5 py-4">
                  <Loader
                    simple={false}
                    showText={true}
                    text="Please wait payment method is preparing..."
                    className="mx-auto !h-20 w-6"
                  />
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <Label>{t('text-select-default-payment-gateway')}</Label>
                    <SelectInput
                      name="defaultPaymentGateway"
                      control={control}
                      getOptionLabel={(option: any) => option.title}
                      getOptionValue={(option: any) => option.name}
                      options={paymentGateway ?? []}
                      // disabled={isNotDefaultSettingsPage}
                    />
                  </div>
                  {isStripeActive && (
                    <>
                      <div className="mb-5">
                        <div className="flex items-center gap-x-4">
                          <SwitchInput
                            name="StripeCardOnly"
                            control={control}
                            // disabled={isNotDefaultSettingsPage}
                          />
                          <Label className="!mb-0">
                            {t('Enable Stripe Element')}
                          </Label>
                        </div>
                      </div>
                    </>
                  )}
                  <Label>{t('text-webhook-url')}</Label>
                  <div className="relative flex flex-col overflow-hidden rounded-md border border-solid border-[#D1D5DB]">
                    {paymentGateway?.map((gateway: any, index: any) => {
                      return <WebHookURL gateway={gateway} key={index} />;
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            ''
          )}
        </Card>
      </div>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title="Currency Options"
          details={t('form:currency-options-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{`${t('form:input-label-currency-formations')} *`}</Label>
            <SelectInput
              {...register('currencyOptions.formation')}
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.code}
              options={COUNTRY_LOCALE}
              // disabled={isNotDefaultSettingsPage}
            />
          </div>
          <Input
            label={`${t('form:input-label-currency-number-of-decimal')} *`}
            {...register('currencyOptions.fractions')}
            type="number"
            variant="outline"
            placeholder={t('form:input-placeholder-currency-number-of-decimal')}
            error={t(errors.currencyOptions?.fractions?.message!)}
            className="mb-5"
          />
          {formation && (
            <div className="mb-5">
              <Label>
                {`Sample Output: `}
                <Badge
                  text={formatPrice({
                    amount: 987456321.123456789,
                    currencyCode:
                      currentCurrency?.code ?? settings?.options?.currency!,
                    // @ts-ignore
                    locale: formation?.code! as string,
                    fractions: currentFractions,
                  })}
                  color="bg-accent"
                />
              </Label>
            </div>
          )}
        </Card>
      </div>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title="SEO"
          details={t('form:tax-form-seo-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-meta-title')}
            {...register('seo.metaTitle')}
            variant="outline"
            className="mb-5"
          />
          <div className="relative">
            {options?.useAi && (
              <OpenAIButton
                title={t('form:button-label-description-ai')}
                onClick={handleGenerateDescription}
              />
            )}
            <TextArea
              label={t('form:input-label-meta-description')}
              {...register('seo.metaDescription')}
              variant="outline"
              className="mb-5"
            />
          </div>

          <Input
            label={t('form:input-label-meta-tags')}
            {...register('seo.metaTags')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-canonical-url')}
            {...register('seo.canonicalUrl')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-og-title')}
            {...register('seo.ogTitle')}
            variant="outline"
            className="mb-5"
          />

          <div className="relative">
            {options?.useAi && (
              <OpenAIButton
                title={t('form:button-label-description-ai')}
                onClick={handleGenerateDescription1}
              />
            )}
            <TextArea
              label={t('form:input-label-og-description')}
              {...register('seo.ogDescription')}
              variant="outline"
              className="mb-5"
            />
          </div>

          <div className="mb-5">
            <Label>{t('form:input-label-og-image')}</Label>
            <FileInput name="seo.ogImage" control={control} multiple={false} />
          </div>
          <Input
            label={t('form:input-label-twitter-handle')}
            {...register('seo.twitterHandle')}
            variant="outline"
            className="mb-5"
            placeholder="your twitter username (exp: @username)"
          />
          <Input
            label={t('form:input-label-twitter-card-type')}
            {...register('seo.twitterCardType')}
            variant="outline"
            className="mb-5"
            placeholder="one of summary, summary_large_image, app, or player"
          />
        </Card>
      </div>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:title-sms-event-settings')}
          details={t('form:description-sms-event-settings')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-sms-options')}</Label>
            <SelectInput
              name="smsEvent"
              control={control}
              getOptionLabel={(option: any) => {
                let optionUser = split(option.value, '-');
                switch (optionUser[0].toLowerCase()) {
                  case 'customer':
                    return `Customer: ${option.label}`;
                  case 'vendor':
                    return `Owner: ${option.label}`;
                  default:
                    return `Admin: ${option.label}`;
                }
              }}
              isCloseMenuOnSelect={false}
              options={SMS_GROUP_OPTION}
              isMulti
              // disabled={isNotDefaultSettingsPage}
            />
            <ValidationError message={t(errors.currency?.message)} />
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:title-email-event-settings')}
          details={t('form:description-email-event-settings')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-email-options')}</Label>
            <SelectInput
              name="emailEvent"
              control={control}
              getOptionLabel={(option: any) => {
                let optionUser = split(option.value, '-');
                switch (optionUser[0].toLowerCase()) {
                  case 'customer':
                    return `Customer: ${option.label}`;
                  case 'vendor':
                    return `Owner: ${option.label}`;
                  default:
                    return `Admin: ${option.label}`;
                }
              }}
              isCloseMenuOnSelect={false}
              options={EMAIL_GROUP_OPTION}
              isMulti
              // disabled={isNotDefaultSettingsPage}
            />
            <ValidationError message={t(errors.currency?.message)} />
          </div>
        </Card>
      </div>

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
                      variant="outline"
                      {...register(`deliveryTime.${index}.title` as const)}
                      defaultValue={item?.title!} // make sure to set up defaultValue
                      // @ts-ignore
                      error={t(errors?.deliveryTime?.[index]?.title?.message)}
                    />
                    <TextArea
                      label={t('form:input-delivery-time-description')}
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

          {
            /*@ts-ignore*/
            errors?.deliveryTime?.message ? (
              <Alert
                // @ts-ignore
                message={t(errors?.deliveryTime?.message)}
                variant="error"
                className="mt-5"
              />
            ) : null
          }
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
        <Description
          title={t('form:shop-settings')}
          details={t('form:shop-settings-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-autocomplete')}</Label>
            <Controller
              control={control}
              name="contactDetails.location"
              render={({ field: { onChange } }) => (
                <GooglePlacesAutocomplete
                  onChange={onChange}
                  data={getValues('contactDetails.location')!}
                  // disabled={isNotDefaultSettingsPage}
                />
              )}
            />
          </div>
          <Input
            label={t('form:input-label-contact')}
            {...register('contactDetails.contact')}
            variant="outline"
            className="mb-5"
            error={t(errors.contactDetails?.contact?.message!)}
            // disabled={isNotDefaultSettingsPage}
          />
          <Input
            label={t('form:input-label-website')}
            {...register('contactDetails.website')}
            variant="outline"
            className="mb-5"
            error={t(errors.contactDetails?.website?.message!)}
            // disabled={isNotDefaultSettingsPage}
          />

          <div className="mt-6">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="useGoogleMap"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="mb-0">
                {t('form:input-label-use-google-map-service')}
              </Label>
            </div>
          </div>

          <Input
            label={`${t('Maximum Search Location Distance(km)')}`}
            {...register('maxShopDistance')}
            type="number"
            error={t(errors.maxShopDistance?.message!)}
            variant="outline"
            className="my-5"
            // disabled={isNotDefaultSettingsPage}
          />

          <div className="mt-6">
            <div className="flex items-center gap-x-4">
              <SwitchInput
                name="isProductReview"
                control={control}
                // disabled={isNotDefaultSettingsPage}
              />
              <Label className="mb-0">
                {t('form:input-label-product-for-review')}
              </Label>
            </div>
          </div>

          {/* Social and Icon picker */}
          <div>
            {socialFields.map(
              (item: ShopSocialInput & { id: string }, index: number) => (
                <div
                  className="py-5 border-b border-dashed border-border-200 first:mt-5 first:border-t last:border-b-0 md:py-8 md:first:mt-10"
                  key={item.id}
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                    <div className="sm:col-span-2">
                      <Label className="whitespace-nowrap">
                        {t('form:input-label-select-platform')}
                      </Label>
                      <SelectInput
                        name={`contactDetails.socials.${index}.icon` as const}
                        control={control}
                        options={updatedIcons}
                        isClearable={true}
                        defaultValue={item?.icon!}
                        // disabled={isNotDefaultSettingsPage}
                      />
                    </div>
                    <Input
                      className="sm:col-span-2"
                      label={t('form:input-label-social-url')}
                      variant="outline"
                      {...register(
                        `contactDetails.socials.${index}.url` as const,
                      )}
                      defaultValue={item.url!} // make sure to set up defaultValue
                      // disabled={isNotDefaultSettingsPage}
                    />
                    {/* {!isNotDefaultSettingsPage && ( */}
                    <button
                      onClick={() => {
                        socialRemove(index);
                      }}
                      type="button"
                      className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4"
                      // disabled={isNotDefaultSettingsPage}
                    >
                      {t('form:button-label-remove')}
                    </button>
                    {/* )} */}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* {!isNotDefaultSettingsPage && ( */}
          <Button
            type="button"
            onClick={() => socialAppend({ icon: '', url: '' })}
            className="w-full sm:w-auto"
            // disabled={isNotDefaultSettingsPage}
          >
            {t('form:button-label-add-social')}
          </Button>
          {/* )} */}
        </Card>
      </div>

      <div className="text-end">
        <Button
          loading={loading}
          disabled={loading}
          className="text-sm md:text-base"
        >
          {t('form:button-label-save-settings')}
        </Button>
      </div>
    </form>
  );
}
