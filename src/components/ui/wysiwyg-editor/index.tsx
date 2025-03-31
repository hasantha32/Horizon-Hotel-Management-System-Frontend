import Label from '@/components/ui/label';
import classNames from 'classnames';
import { useMemo, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Quill } from 'react-quill';
import ValidationError from '@/components/ui/form-validation-error';
import { uploadClient } from '@/data/client/upload';
import { useTranslation } from 'next-i18next';
import { SnowTheme } from 'quill-color-picker-enhance';
import ReactQuill from 'react-quill';
// @ts-ignore
import quillEmoji from 'react-quill-emoji';
import 'react-quill-emoji/dist/quill-emoji.css';
import 'react-quill/dist/quill.snow.css';
import { twMerge } from 'tailwind-merge';
import Loader from '@/components/ui/loader/loader';

export type RichTextEditorProps = {
  title?: string;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  control: any;
  name: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
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
  const { t } = useTranslation();
  const Font = Quill.import('formats/font');
  const [loading, setLoading] = useState(false);
  Font.whitelist = ['Roboto', 'Raleway', 'Lato', 'Rubik', 'OpenSans'];
  Quill.register(
    {
      'formats/emoji': quillEmoji.EmojiBlot,
      'modules/emoji-toolbar': quillEmoji.ToolbarEmoji,
      'modules/emoji-textarea': quillEmoji.TextAreaEmoji,
      'modules/emoji-shortname': quillEmoji.ShortNameEmoji,
      Font,
      'themes/snow-quill-color-picker-enhance': SnowTheme,
    },
    true,
  );
  const quillRef = useRef();

  const ImageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      const formData = new FormData();

      if (file) {
        formData.append('file', file);
        formData.append('resource_type', 'raw');
        setLoading(true);
        const responseUpload = await uploadClient?.upload(formData);
        setLoading(false);
        const reader = new FileReader();
        // Read the selected file as a data URL
        reader.onload = () => {
          // @ts-ignore
          const quillEditor = quillRef?.current?.getEditor();
          // Get the current selection range and insert the image at that index
          const range = quillEditor?.getSelection(true);
          quillEditor.insertEmbed(
            range.index,
            'image',
            // @ts-ignore
            responseUpload[0]?.original,
            'user',
          );
        };

        reader.readAsDataURL(file);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [
            { header: [1, 2, 3, 4, 5, 6, false] },
            {
              font: Font.whitelist,
            },
          ],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          [
            {
              color: [],
            },
          ],
          [
            {
              background: [],
            },
          ],
          [{ align: [] }],
          ['code-block'],
          ['link', 'image', 'video'],
          ['emoji'],
          [{ script: 'sub' }, { script: 'super' }],
          ['clean'],
        ],
        handlers: {
          image: ImageHandler,
        },
      },
      'emoji-toolbar': true,
      'emoji-textarea': true,
      'emoji-shortname': true,
    }),
    [],
  );

  const formats = [
    'header',
    'font',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
    'color',
    'background',
    'script',
    'code-block',
    'image',
    'video',
    'emoji',
  ];

  return (
    <div className={twMerge(classNames('react-quill-description', className))}>
      {title ? (
        <Label htmlFor={name}>
          {title}
          {required ? <span className="ml-0.5 text-red-500">*</span> : ''}
        </Label>
      ) : (
        ''
      )}
      {loading ? (
        <div className="flex items-center my-2 gap-2">
          <Loader simple className="h-6 w-6" />
          <p className="font-semibold text-body italic">
            {t('text-image-uploading-message')}...
          </p>
        </div>
      ) : (
        ''
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ReactQuill
            id={name}
            modules={modules}
            formats={formats}
            theme="snow-quill-color-picker-enhance"
            {...field}
            placeholder={title ? title : placeholder}
            onChange={(text) => {
              field?.onChange(text);
            }}
            className={twMerge(
              classNames(
                'relative mb-5 rounded border border-border-base',
                editorClassName,
                disabled
                  ? 'select-none bg-[#EEF1F4] cursor-not-allowed disabled-editor'
                  : '',
              ),
            )}
            // @ts-ignore
            ref={quillRef}
            readOnly={disabled}
          />
        )}
        {...rest}
      />

      {error ? <ValidationError message={t(error)} /> : ''}
    </div>
  );
};

export default RichTextEditor;
