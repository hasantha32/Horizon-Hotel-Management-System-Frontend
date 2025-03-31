import AuthPageLayout from '@/components/layouts/auth-layout';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { licenseKeyValidationSchema } from '@/components/user/license-key-validation-schema';
import {
  useLicenseKeyMutation,
  useMeQuery
} from '@/data/user';
import { getErrorMessage } from '@/utils/form-error';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

type FormValues = {
  license_key: string;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

export default function VerifyLicenseKeyActions() {
  const { t } = useTranslation('common');
  useMeQuery();


  const { mutate: verifyLicenseKey, isLoading } =
    useLicenseKeyMutation();
  const router = useRouter();

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
    resolver: yupResolver(licenseKeyValidationSchema),
    defaultValues: {
      license_key: "",
    } as FormValues,

  });


  const onSubmit = async (values: FormValues) => {
    const input = {
      ...values,
    };
    try {
      await verifyLicenseKey({
        ...input,
      });
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
    <>
      <AuthPageLayout>
        <h3 className="mt-4 mb-6 text-center text-base italic text-red-500 text-body">
          {t('common:license-not-verified')}
        </h3>
        <div className="w-full space-y-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label
              htmlFor="licenseKey"
              className="mb-5 cursor-pointer"
              title={t('form:for-help-contact-support-portal')}
            >{`${t('form:input-label-license-key')}*`}
            </label>
            <Input
              {...register('license_key')}
              placeholder={t(
                'form:input-label-license-key-placeholder'
              )}
              id='licenseKey'
              error={t(errors.license_key?.message!)}
              variant="outline"
              className="mb-5"
            />

            <Button
              disabled={isLoading}
              className="w-full"
            >
              {t('common:authorized-nav-item-submit')}
            </Button>


          </form>

        </div>
      </AuthPageLayout>
    </>
  );
}
