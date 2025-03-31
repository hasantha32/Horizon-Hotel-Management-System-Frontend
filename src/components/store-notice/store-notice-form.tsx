import { useEffect } from 'react';
import Input from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from '@/components/ui/date-picker';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { storeNoticeValidationSchema } from '@/components/store-notice/store-notice-validation-schema';
import { StoreNotice, StoreNoticePriorityType, StoreNoticeType } from '@/types';
import {
  useCreateStoreNoticeMutation,
  useUpdateStoreNoticeMutation,
  useUsersOrShopsQuery,
} from '@/data/store-notice';
import { getErrorMessage } from '@/utils/form-error';
import { Config } from '@/config';
import SelectInput from '@/components/ui/select-input';
import NoticeReceivedByInput from '@/components/store-notice/store-notice-received-input';
import { getAuthCredentials } from '@/utils/auth-utils';
import { find } from 'lodash';
import { useSettingsQuery } from '@/data/settings';
import { useCallback, useMemo } from 'react';
import { useModalAction } from '@/components/ui/modal/modal.context';
import OpenAIButton from '@/components/openAI/openAI.button';
import { ItemProps } from '@/types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { StoreNoticeDescriptionSuggestions } from '@/components/store-notice/store-notice-ai-prompt';

type user = {
  id: string;
  name: string;
  email: string;
};
type shop = {
  id: string;
  name: string;
};

type FormValues = {
  priority: { name: string; value: string };
  notice: string;
  description: string;
  effective_from: string;
  expired_at: string;
  type: { name: string; value: string };
  received_by?: user[] | shop[];
};

const priorityType = [
  { name: 'High', value: StoreNoticePriorityType.High },
  { name: 'Medium', value: StoreNoticePriorityType.Medium },
  { name: 'Low', value: StoreNoticePriorityType.Low },
];

type IProps = {
  initialValues?: StoreNotice | null;
};
export default function CreateOrUpdateStoreNoticeForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });
  const { openModal } = useModalAction();

  let noticeTypes: any = [];
  let superAdmin = permissions?.includes('super_admin');
  const noticeReceived =
    initialValues?.shops || initialValues?.users
      ? //@ts-ignore
        initialValues?.shops.concat(initialValues?.users)
      : [];

  if (superAdmin) {
    noticeTypes = [
      { name: 'All Vendor', value: 'all_vendor' },
      { name: 'Specific Vendor', value: 'specific_vendor' },
    ];
  } else {
    noticeTypes = [
      { name: 'All Shop', value: 'all_shop' },
      { name: 'Specific Shop', value: 'specific_shop' },
    ];
  }
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
          effective_from: new Date(initialValues.effective_from!),
          expired_at: new Date(initialValues?.expired_at!),
          priority: initialValues?.priority
            ? priorityType?.find(
                (priority) => priority.value === initialValues?.priority!,
              )
            : { name: '', value: '' },
          type: initialValues?.type
            ? noticeTypes &&
              noticeTypes?.find(
                (type: any) => type.value === initialValues.type!,
              )
            : { name: '', value: '' },
          received_by: noticeReceived ? noticeReceived : [],
        }
      : {
          priority: priorityType[0],
        },
    //@ts-ignore
    resolver: yupResolver(storeNoticeValidationSchema),
  });

  const { mutate: createStoreNotice, isLoading: creating } =
    useCreateStoreNoticeMutation();
  const { mutate: updateStoreNotice, isLoading: updating } =
    useUpdateStoreNoticeMutation();

  const noticeType = watch('type');
  const { usersOrShops } = useUsersOrShopsQuery();
  let shopIndexFind: any = find(
    usersOrShops,
    (x: any) => x.slug === router.query.shop,
  );

  const noticeName = watch('notice');
  const storeNoticeDescriptionSuggestionLists = useMemo(() => {
    return StoreNoticeDescriptionSuggestions({ name: noticeName ?? '' });
  }, [noticeName]);

  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: noticeName,
      set_value: setValue,
      key: 'description',
      suggestion: storeNoticeDescriptionSuggestionLists as ItemProps[],
    });
  }, [noticeName]);

  const [effective_from, expired_at] = watch(['effective_from', 'expired_at']);
  const isTranslateStoreNotice = router.locale !== Config.defaultLanguage;
  const onSubmit = async (values: FormValues) => {
    const inputValues = {
      priority: values.priority.value,
      notice: values.notice,
      description: values.description,
      type: superAdmin ? values.type?.value : 'specific_shop',
      effective_from: new Date(effective_from).toISOString(),
      expired_at: new Date(expired_at).toISOString(),
      received_by: superAdmin
        ? values.received_by?.map((r) => r.id)
        : [shopIndexFind?.id],
    };
    try {
      if (!initialValues) {
        createStoreNotice({
          ...inputValues,
        });
      } else {
        updateStoreNotice({
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
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:store-notice-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-priority')}</Label>
            <SelectInput
              name="priority"
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.value}
              control={control}
              options={priorityType}
            />
            <ValidationError
              //@ts-ignore
              message={t(errors.priority?.message!)}
            />
          </div>
          <Input
            label={`${t('form:input-title')}*`}
            {...register('notice')}
            placeholder={t('form:enter-notice-heading')}
            error={t(errors.notice?.message!)}
            variant="outline"
            className="mb-5"
            disabled={isTranslateStoreNotice}
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

            <TextArea
              label={`${t('form:input-label-description')}*`}
              {...register('description')}
              placeholder={t('form:enter-notice-description')}
              error={t(errors.description?.message!)}
              variant="outline"
              className="mb-5"
              disabled={isTranslateStoreNotice}
            />
          </div>

          <div className="flex flex-col mb-4 sm:flex-row">
            <div className="w-full p-0 mb-5 sm:mb-0 sm:w-1/2 sm:pe-2">
              <DatePicker
                control={control}
                name="effective_from"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                maxDate={new Date(expired_at)}
                startDate={new Date(effective_from)}
                endDate={new Date(expired_at)}
                className="border border-border-base"
                disabled={isTranslateStoreNotice}
                label={t('form:store-notice-active-from')}
                error={t(errors.effective_from?.message!)}
                required
              />
            </div>
            <div className="w-full p-0 sm:w-1/2 sm:ps-2">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                control={control}
                name="expired_at"
                startDate={new Date(effective_from)}
                endDate={new Date(expired_at)}
                minDate={new Date(effective_from)}
                className="border border-border-base"
                disabled={isTranslateStoreNotice}
                error={t(errors.expired_at?.message!)}
                label={t('form:store-notice-expire-at')}
                required
              />
            </div>
          </div>
          {superAdmin && (
            <>
              <div className="mb-0">
                <Label>{t('form:input-label-type')}</Label>
                <SelectInput
                  name="type"
                  control={control}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.value}
                  options={noticeTypes}
                  defaultValue={noticeTypes[0]}
                />

                <ValidationError //@ts-ignore
                  message={t(errors.type?.message)}
                />
              </div>
              {noticeType &&
                (noticeType.value == StoreNoticeType.specific_vendor ||
                  noticeType.value == StoreNoticeType.specific_shop) && (
                  <NoticeReceivedByInput
                    className="mt-5"
                    control={control}
                    setValue={setValue}
                    //@ts-ignore
                    error={t(errors.received_by?.message!)}
                  />
                )}
            </>
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
            {initialValues
              ? t('form:button-label-update-store-notice')
              : t('form:button-label-add-store-notice')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
