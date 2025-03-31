import ValidationError from '@/components/ui/form-validation-error';
import TooltipLabel from '@/components/ui/tooltip-label';
import { Switch } from '@headlessui/react';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { Control, Controller } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface Props {
  control: Control<any>;
  error?: string;
  name: string;
  disabled?: boolean;
  [key: string]: unknown;
  required?: boolean;
  label?: string;
  toolTipText?: string;
  className?: string;
}

const SwitchInput = ({
  control,
  label,
  name,
  error,
  disabled,
  required,
  toolTipText,
  className,
  ...rest
}: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <div
        className={twMerge(classNames('flex items-center gap-x-4', className))}
      >
        <Controller
          name={name}
          control={control}
          {...rest}
          render={({ field: { onChange, value } }) => (
            <Switch
              checked={value}
              onChange={onChange}
              disabled={disabled}
              className={`${
                value ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none ${
                disabled ? 'cursor-not-allowed bg-[#EEF1F4]' : ''
              }`}
              dir="ltr"
              id={name}
            >
              <span className="sr-only">Enable {label}</span>
              <span
                className={`${
                  value ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          )}
        />
        {label ? (
          <TooltipLabel
            htmlFor={name}
            className="mb-0"
            toolTipText={toolTipText}
            label={label}
            required={required}
          />
        ) : (
          ''
        )}
      </div>
      {error ? <ValidationError message={error} /> : ''}
    </>
  );
};

export default SwitchInput;
