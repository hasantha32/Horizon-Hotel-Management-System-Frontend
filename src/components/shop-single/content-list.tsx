import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import Link from '@/components/ui/link';

type ContentListVerticalProps = {
  title: string;
  content: string;
  className?: string;
};

type ContentListHorizontalProps = {
  content: string;
  children: React.ReactNode;
  className?: string;
  isLink?: boolean;
  link?: string;
};

export const ContentListVertical: React.FC<ContentListVerticalProps> = ({
  title,
  content,
  className,
  ...rest
}) => {
  return content ? (
    <div className={twMerge(classNames(className))} {...rest}>
      {title ? (
        <h4 className="mb-1 text-sm font-normal text-[#666]">{title}</h4>
      ) : (
        ''
      )}
      {content ? <p className="text-muted-black">{content}</p> : ''}
    </div>
  ) : (
    <span className="sr-only">No item found</span>
  );
};

export const ContentListHorizontal: React.FC<ContentListHorizontalProps> = ({
  content,
  children,
  className,
  isLink = false,
  link,
  ...rest
}) => {
  return (
    <div
      className={twMerge(
        classNames('flex items-center gap-2 text-base', className)
      )}
      {...rest}
    >
      <span className="text-base-dark">{children}</span>
      {content ? (
        <div className="text-muted-black">
          {isLink ? (
            <Link href={link as string}>{content}</Link>
          ) : (
            <p>{content}</p>
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
