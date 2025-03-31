import Input from '@/components/ui/input';
import { useState } from 'react';
import Badge from '@/components/ui/badge/badge';

type CopyContentProps = {
  label: string;
  variant?: 'normal' | 'solid' | 'outline';
  className?: string;
  name: string;
  value: string;
};

const CopyContent: React.FC<CopyContentProps> = ({
  label,
  variant,
  className,
  name,
  value,
  ...rest
}) => {
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  async function handleWebhookCopyClick() {
    await copyTextToClipboard(value);
    setIsCopied(true);
  }

  setTimeout(() => {
    setIsCopied(false);
  }, 5000);

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-3 block text-sm font-semibold leading-none text-body-dark"
      >
        {label}
      </label>
      <div className="relative">
        <Input
          label={label}
          variant={variant}
          className={className}
          name={name}
          value={value}
          readOnly={true}
          showLabel={false}
          disabled={true}
          inputClassName="pr-11"
          {...rest}
        />
        <div
          className="absolute top-px right-px w-10 rounded-tr rounded-br border-0 border-l border-solid border-border-base bg-white"
          style={{ height: 'calc(100% - 2px)' }}
        >
          <button
            onClick={handleWebhookCopyClick}
            type="button"
            className="flex h-full w-full"
          >
            <span className="m-auto">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 0 0 174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"></path>
              </svg>
            </span>
          </button>
          {isCopied ? (
            <span className="absolute -top-9 right-0 z-10">
              <Badge text="Copied!" className="inline-flex" />
            </span>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyContent;
