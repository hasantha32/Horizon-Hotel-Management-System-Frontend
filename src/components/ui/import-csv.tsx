import { UploadIcon } from '@/components/icons/upload-icon';
import { useDropzone } from 'react-dropzone';

export default function ImportCsv({ onDrop, loading, title }: any) {
  const { getRootProps, getInputProps } = useDropzone({
    // @ts-ignore
    accept: '.csv',
    multiple: false,
    onDrop,
  });

  return (
    <section className="upload">
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none p-5',
        })}
      >
        <input {...getInputProps()} />
        {loading && (
          <span
            className="ms-2 h-[30px] w-[30px] animate-spin rounded-full border-2 border-t-2 border-transparent"
            style={{
              borderTopColor: 'rgb(var(--color-accent))',
            }}
          />
        )}
        {!loading && <UploadIcon className="text-muted-light" />}
        <p className="mt-4 text-center text-sm text-body">
          <span className="font-semibold text-accent">{title}</span>
        </p>
      </div>
    </section>
  );
}
