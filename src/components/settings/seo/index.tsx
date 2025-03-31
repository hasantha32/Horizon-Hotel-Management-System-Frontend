import Card from '@/components/common/card';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import ValidationError from '@/components/ui/form-validation-error';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import TextArea from '@/components/ui/text-area';
import { useUpdateSettingsMutation } from '@/data/settings';
import { AttachmentInput, Settings } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { seoValidationSchema } from '@/components/settings/seo/seo-validation-schema';
import { SaveIcon } from '@/components/icons/save';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import TooltipLabel from '@/components/ui/tooltip-label';
import { useConfirmRedirectIfDirty } from '@/utils/confirmed-redirect-if-dirty';

type SeoFormValues = {
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
};

type IProps = {
  settings?: Settings | null;
};

export default function SeoSettingsForm({ settings }: IProps) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const { mutate: updateSettingsMutation, isLoading: loading } =
    useUpdateSettingsMutation();
  const { language, options } = settings ?? {};

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<SeoFormValues>({
    shouldUnregister: true,
    //@ts-ignore
    resolver: yupResolver(seoValidationSchema),
    defaultValues: {
      ...options,
    },
  });

  async function onSubmit(values: SeoFormValues) {
    updateSettingsMutation({
      language: locale,
      // @ts-ignore // // FIXME
      options: {
        ...values,
        ...options,
        //@ts-ignore
        seo: {
          ...values?.seo,
          ogImage: values?.seo?.ogImage,
        },
      },
    });
    reset(values, { keepValues: true });
  }
  useConfirmRedirectIfDirty({ isDirty });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:mt-8 sm:mb-3">
        <Description
          title={t('text-seo')}
          details={t('form:tax-form-seo-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-meta-title')}
            toolTipText={t('form:input-tooltip-meta-title')}
            {...register('seo.metaTitle')}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label={t('form:input-label-meta-description')}
            toolTipText={t('form:input-tooltip-meta-description')}
            {...register('seo.metaDescription')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-meta-tags')}
            toolTipText={t('form:input-tooltip-meta-tags')}
            {...register('seo.metaTags')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-canonical-url')}
            toolTipText={t('form:input-tooltip-canonical-url')}
            {...register('seo.canonicalUrl')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-og-title')}
            toolTipText={t('form:input-tooltip-og-title')}
            {...register('seo.ogTitle')}
            variant="outline"
            className="mb-5"
          />
          <TextArea
            label={t('form:input-label-og-description')}
            toolTipText={t('form:input-tooltip-og-description')}
            {...register('seo.ogDescription')}
            variant="outline"
            className="mb-5"
          />
          <div className="mb-5">
            <FileInput
              label={t('form:input-label-og-image')}
              toolTipText={t('form:input-tooltip-og-image')}
              name="seo.ogImage"
              control={control}
              multiple={false}
            />
          </div>
          <Input
            label={t('form:input-label-twitter-handle')}
            toolTipText={t('form:input-tooltip-twitter-handle')}
            {...register('seo.twitterHandle')}
            variant="outline"
            className="mb-5"
            placeholder="your twitter username (exp: @username)"
          />
          <Input
            label={t('form:input-label-twitter-card-type')}
            toolTipText={t('form:input-tooltip-twitter-card-type')}
            {...register('seo.twitterCardType')}
            variant="outline"
            className="mb-5"
            placeholder="one of summary, summary_large_image, app, or player"
          />
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
