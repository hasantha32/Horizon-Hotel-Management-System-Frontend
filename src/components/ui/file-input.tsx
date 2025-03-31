import Uploader from '@/components/common/uploader';
import TooltipLabel from '@/components/ui/tooltip-label';
import { Controller } from 'react-hook-form';
import ValidationError from '@/components/ui/form-validation-error';

interface FileInputProps {
  control: any;
  name: string;
  multiple?: boolean;
  acceptFile?: boolean;
  helperText?: string;
  defaultValue?: any;
  maxSize?: number;
  disabled?: boolean;
  toolTipText?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

const FileInput = ({
  control,
  name,
  multiple = true,
  acceptFile = false,
  helperText,
  defaultValue = [],
  maxSize,
  disabled,
  label,
  toolTipText,
  required,
  error,
}: FileInputProps) => {
  return (
    <>
      {label && (
        <TooltipLabel
          htmlFor={name}
          toolTipText={toolTipText}
          label={label}
          required={required}
        />
      )}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { ref, ...rest } }) => (
          <Uploader
            {...rest}
            multiple={multiple}
            acceptFile={acceptFile}
            helperText={helperText}
            maxSize={maxSize}
            disabled={disabled}
          />
        )}
      />
      <ValidationError message={error} />
    </>
  );
};

export default FileInput;
