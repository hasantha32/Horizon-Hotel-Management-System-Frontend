import Card from '@/components/common/card';
import { DownloadIcon } from '@/components/icons/download-icon';
import { useTranslation } from 'next-i18next';
import ImportAttributes from '@/components/attribute/import-attributes';
import { useModalState } from '@/components/ui/modal/modal.context';

const AttributeExportImport = () => {
  const { t } = useTranslation();
  const { data: shopId } = useModalState();

  return (
    <Card className="flex min-h-screen w-screen flex-col md:min-h-0 md:w-auto lg:min-w-[900px]">
      <div className="mb-5 w-full">
        <h1 className="text-lg font-semibold text-heading">
          {t('common:text-export-import')}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
        <ImportAttributes />
        <a
          href={`${process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT}/export-attributes/${shopId}`}
          target="_blank"
          rel={'noreferrer'}
          className="flex h-36 cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-border-base p-5 focus:border-accent-400 focus:outline-none"
        >
          <DownloadIcon className="w-10 text-muted-light" />

          <span className="mt-4 text-center text-sm font-semibold text-accent">
            {t('common:text-export-attributes')}
          </span>
        </a>
      </div>
    </Card>
  );
};

export default AttributeExportImport;
