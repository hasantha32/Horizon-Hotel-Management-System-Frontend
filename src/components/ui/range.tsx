import TooltipLabel from '@/components/ui/tooltip-label';
import React, { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  toolTipText?: string;
  note?: string;
  name: string;
  error?: string;
  showLabel?: boolean;
  required?: boolean;
}

const Range = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      label,
      note,
      name,
      error,
      disabled,
      showLabel = true,
      required,
      toolTipText,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className={twMerge(className)}>
        {showLabel ? (
          <TooltipLabel
            htmlFor={name}
            toolTipText={toolTipText}
            label={label}
            required={required}
          />
        ) : (
          ''
        )}
        <input
          id={name}
          name={name}
          type="range"
          ref={ref}
          className={
            disabled
              ? `cursor-not-allowed border-[#D4D8DD] bg-[#EEF1F4] select-none`
              : ''
          }
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          {...rest}
        />
        {note && <p className="mt-2 text-xs text-body">{note}</p>}
        {error && (
          <p className="my-2 text-xs text-red-500 text-start">{error}</p>
        )}
      </div>
    );
  },
);

Range.displayName = 'Range';

export default Range;
