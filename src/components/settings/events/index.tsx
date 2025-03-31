import Card from '@/components/common/card';
import { SaveIcon } from '@/components/icons/save';
import { eventsValidationSchema } from '@/components/settings/events/events-validation-schema';
import {
  EMAIL_GROUP_OPTION,
  PUSH_NOTIFICATION_OPTION,
  SMS_GROUP_OPTION,
} from '@/components/settings/events/eventsOption';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import ValidationError from '@/components/ui/form-validation-error';
import SelectInput from '@/components/ui/select-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import TooltipLabel from '@/components/ui/tooltip-label';
import { useUpdateSettingsMutation } from '@/data/settings';
import { Settings } from '@/types';
import { useConfirmRedirectIfDirty } from '@/utils/confirmed-redirect-if-dirty';
import {
  formatEventAPIData,
  formatEventOptions,
} from '@/utils/format-event-options';
import { yupResolver } from '@hookform/resolvers/yup';
import { split } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type EventFormValues = {
  smsEvent: any;
  emailEvent: any;
  pushNotification: any;
};

type IProps = {
  settings?: Settings | null;
};

export default function EventsSettingsForm({ settings }: IProps) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const { mutate: updateSettingsMutation, isLoading: loading } =
    useUpdateSettingsMutation();
  const { language, options } = settings ?? {};

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<EventFormValues>({
    shouldUnregister: true,
    //@ts-ignore
    resolver: yupResolver(eventsValidationSchema),
    defaultValues: {
      ...options,
      smsEvent: options?.smsEvent
        ? formatEventAPIData(options?.smsEvent)
        : null,
      emailEvent: options?.emailEvent
        ? formatEventAPIData(options?.emailEvent)
        : null,
      pushNotification: options?.pushNotification
        ? formatEventAPIData(options?.pushNotification)
        : null,
    },
  }) as any;

  // const isNotDefaultSettingsPage = Config.defaultLanguage !== locale;
  async function onSubmit(values: EventFormValues) {
    const smsEvent = formatEventOptions(values.smsEvent);
    const emailEvent = formatEventOptions(values.emailEvent);
    const pushNotification = formatEventOptions(values.pushNotification);
    updateSettingsMutation({
      language: locale,
      // @ts-ignore // // FIXME
      options: {
        ...options,
        ...values,
        smsEvent,
        emailEvent,
        pushNotification,
      },
    });
    reset(values, { keepValues: true });
  }
  useConfirmRedirectIfDirty({ isDirty });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:title-realtime-notification-settings')}
          details={t('form:description-realtime-notification-settings')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <SelectInput
              name="pushNotification"
              control={control}
              getOptionLabel={(option: any) => {
                let optionUser = split(option.value, '-');
                switch (optionUser[0].toLowerCase()) {
                  case 'all':
                    return `Admin & Vendor : ${option.label}`;
                  default:
                    return option.label;
                }
              }}
              isCloseMenuOnSelect={false}
              options={PUSH_NOTIFICATION_OPTION}
              isMulti
              label={t('form:input-label-realtime-notification-options')}
              toolTipText={t('form:input-tooltip-notification-options')}
            />

            <ValidationError message={t(errors.currency?.message)} />
          </div>
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
              label={t('form:input-label-sms-options')}
              toolTipText={t('form:input-tooltip-sms-options')}
            />
            <ValidationError message={t(errors.currency?.message)} />
          </div>
        </Card>
      </div>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:mt-8 sm:mb-3">
        <Description
          title={t('form:title-email-event-settings')}
          details={t('form:description-email-event-settings')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
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
              label={t('form:input-label-email-options')}
              toolTipText={t('form:input-tooltip-email-options')}
            />
            <ValidationError message={t(errors.currency?.message)} />
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
