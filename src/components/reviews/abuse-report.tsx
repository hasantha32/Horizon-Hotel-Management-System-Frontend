import { useTranslation } from 'next-i18next';
import type { CreateAbuseReportInput } from '@/types';
import { Form } from '@/components/ui/form/form';
import TextArea from '@/components/ui/text-area';
import Button from '@/components/ui/button';
import { useAbuseReportMutation } from '@/data/review';

export default function AbuseReport({ data }: { data: any }) {
  const { t } = useTranslation('common');
  const { mutate: createAbuseReport, isLoading } = useAbuseReportMutation();

  function onSubmit(values: Pick<CreateAbuseReportInput, 'message'>) {
    createAbuseReport({
      ...data,
      ...values,
    });
  }

  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light p-7 md:h-auto md:min-h-0 md:max-w-[590px] md:rounded-xl">
      <Form<CreateAbuseReportInput> onSubmit={onSubmit}>
        {({ register }) => (
          <div className="space-y-4">
            <TextArea
              label={t('text-report-reason')}
              {...register('message')}
            />
            <Button loading={isLoading} disabled={isLoading}>
              {t('text-report')}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
