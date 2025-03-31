import dynamic from 'next/dynamic';
import Loader from '@/components/ui/loader/loader';
import { useMemo } from 'react';
import { RichTextEditorProps } from '@/components/ui/wysiwyg-editor';

const Editor: React.FC<RichTextEditorProps> = ({
  title,
  placeholder,
  control,
  className,
  editorClassName,
  name,
  required,
  disabled,
  error,
  ...rest
}) => {
  const RichTextEditor = useMemo(
    () =>
      dynamic(() => import('@/components/ui/wysiwyg-editor'), {
        ssr: false,
        loading: () => (
          <div className="py-8 flex">
            <Loader simple={true} className="h-6 w-6 mx-auto" />
          </div>
        ),
      }),
    [],
  );
  return (
    <RichTextEditor
      title={title}
      placeholder={placeholder}
      control={control}
      className={className}
      editorClassName={editorClassName}
      name={name}
      required={required}
      disabled={disabled}
      error={error}
      {...rest}
    />
  );
};

export default Editor;
