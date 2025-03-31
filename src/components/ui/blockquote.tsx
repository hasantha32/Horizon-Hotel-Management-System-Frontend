import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { QuoteIcon } from '@/components/icons/quote';
import ReadMore from './truncate';

type BlockQuoteProps = {
  quote: string;
  className?: string;
};

const BlockQuote: React.FC<BlockQuoteProps> = ({
  quote,
  className,
  ...rest
}) => {
  return (
    <blockquote
      {...rest}
      className={twMerge(
        classNames(
          'relative pl-2 text-xs font-normal leading-[180%] text-muted-black',
          className
        )
      )}
    >
      {quote ? (
        <div className="absolute -top-px -left-1.5 text-[#F8F8F8]">
          <QuoteIcon />
        </div>
      ) : null}
      <p className="relative z-10">
        <ReadMore character={150}>{quote}</ReadMore>
      </p>
    </blockquote>
  );
};

export default BlockQuote;
