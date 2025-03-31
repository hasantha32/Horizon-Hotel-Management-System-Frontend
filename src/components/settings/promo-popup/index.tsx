import Card from '@/components/common/card';
import { SaveIcon } from '@/components/icons/save';
import { promoPopupValidationSchema } from '@/components/settings/promo-popup/promo-popup-validation-schema';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import ValidationError from '@/components/ui/form-validation-error';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import SwitchInput from '@/components/ui/switch-input';
import TextArea from '@/components/ui/text-area';
import TooltipLabel from '@/components/ui/tooltip-label';
import { useUpdateSettingsMutation } from '@/data/settings';
import { Settings, SettingsOptionsInput } from '@/types';
import { useConfirmRedirectIfDirty } from '@/utils/confirmed-redirect-if-dirty';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

type IProps = {
  settings?: Settings | null;
};

type PromoPopupFormValues = {
  isPromoPopUp?: SettingsOptionsInput['isPromoPopUp'];
  promoPopup?: SettingsOptionsInput['promoPopup'];
};

export default function PromoPopUpSettingsForm({ settings }: IProps) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { mutate: updateSettingsMutation, isLoading: loading } =
    useUpdateSettingsMutation();
  const { options } = settings ?? {};

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<PromoPopupFormValues>({
    shouldUnregister: true,
    // @ts-ignore
    resolver: yupResolver(promoPopupValidationSchema),
    defaultValues: {
      ...options,
    },
  });

  async function onSubmit(values: PromoPopupFormValues) {
    updateSettingsMutation({
      language: locale,
      options: {
        ...options,
        ...values,
      },
    });
    reset(values, { keepValues: true });
  }
  useConfirmRedirectIfDirty({ isDirty });
  const promoPopupImageInformation = (
    <span>
      {t('form:popup-cover-image-help-text')} <br />
      {t('form:cover-image-dimension-help-text')} &nbsp;
      <span className="font-bold">450 x 450{t('common:text-px')}</span>
    </span>
  );

  const isPromoPopUp = watch('isPromoPopUp');

  const isPopUpNotShow = watch('promoPopup.isPopUpNotShow');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:site-popup-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="my-5">
            <SwitchInput
              name="isPromoPopUp"
              control={control}
              label={t('form:text-popup-switch')}
              toolTipText={t('form:input-tooltip-promo-enable')}
            />
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-popup-cover-image')}
          details={promoPopupImageInformation}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full logo-field-area sm:w-8/12 md:w-2/3">
          <FileInput
            name="promoPopup.image"
            control={control}
            multiple={false}
            disabled={!isPromoPopUp}
            label={t('text-upload-highlight')}
            {...(isPromoPopUp && {
              required: true,
            })}
            error={t(errors?.promoPopup?.image?.message)}
          />
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:form-title-popup-information')}
          details={t('form:site-popup-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-title')}
            toolTipText={t('form:input-tooltip-promo-title')}
            {...register('promoPopup.title')}
            error={t(errors?.promoPopup?.title?.message!)}
            variant="outline"
            className="mb-5"
            {...(isPromoPopUp && {
              required: true,
            })}
            disabled={!isPromoPopUp}
          />
          <TextArea
            label={t('form:input-label-description')}
            toolTipText={t('form:input-tooltip-promo-description')}
            {...register('promoPopup.description')}
            error={t(errors?.promoPopup?.description?.message!)}
            variant="outline"
            className="mb-5"
            {...(isPromoPopUp && {
              required: true,
            })}
            disabled={!isPromoPopUp}
          />
        </Card>
      </div>

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:form-title-popup-control')}
          details={t('form:site-popup-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:title-popup-delay')}
            toolTipText={t('form:input-tooltip-promo-delay')}
            {...register('promoPopup.popUpDelay')}
            error={t(errors?.promoPopup?.popUpDelay?.message!)}
            variant="outline"
            className="mb-5"
            type="number"
            {...(isPromoPopUp && {
              required: true,
            })}
            disabled={!isPromoPopUp}
            note={t('form:title-popup-delay-info')}
          />
          <Input
            label={t('form:title-popup-expired-in')}
            toolTipText={t('form:input-tooltip-promo-expired')}
            {...register('promoPopup.popUpExpiredIn')}
            error={t(errors?.promoPopup?.popUpExpiredIn?.message!)}
            variant="outline"
            className="mb-5"
            type="number"
            {...(isPromoPopUp && {
              required: true,
            })}
            disabled={!isPromoPopUp}
            min="1"
            note={t('form:title-popup-expired-in-info')}
          />
          <div className="mb-5">
            <SwitchInput
              name="promoPopup.isPopUpNotShow"
              disabled={!isPromoPopUp}
              control={control}
              label={t('form:title-popup-checkbox')}
              toolTipText={t('form:input-tooltip-promo-not-show')}
              error={t(errors?.promoPopup?.isPopUpNotShow?.message)}
            />
          </div>
          <Input
            label={t('form:input-label-title')}
            toolTipText={t('form:input-tooltip-promo-not-show-title')}
            {...register('promoPopup.popUpNotShow.title')}
            error={t(errors?.promoPopup?.popUpNotShow?.title?.message)}
            variant="outline"
            className="mb-5"
            {...(isPromoPopUp &&
              isPopUpNotShow && {
                required: true,
              })}
            disabled={!isPromoPopUp || !isPopUpNotShow}
          />
          <Input
            label={t('form:title-popup-expired-in')}
            toolTipText={t('form:input-tooltip-promo-not-show-expired')}
            {...register('promoPopup.popUpNotShow.popUpExpiredIn')}
            error={t(errors?.promoPopup?.popUpNotShow?.popUpExpiredIn?.message)}
            variant="outline"
            className="mb-5"
            type="number"
            {...(isPromoPopUp &&
              isPopUpNotShow && {
                required: true,
              })}
            disabled={!isPromoPopUp || !isPopUpNotShow}
            min="1"
            note={t('form:title-popup-expired-in-info')}
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
