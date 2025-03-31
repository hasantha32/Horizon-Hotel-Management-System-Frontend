import cn from 'classnames';
import { TriangleArrowDown } from '@/components/icons/triangle-arrow-down';
import { TriangleArrowUp } from '@/components/icons/triangle-arrow-up';
import classNames from 'classnames';

type Props = {
  title: string | React.ReactNode;
  ascending: boolean;
  isActive: boolean;
  className?: string;
};

const TitleWithSort = ({
  title,
  ascending,
  isActive = true,
  className,
}: Props) => {
  return (
    <span className={classNames('inline-flex items-center', className)}>
      <span title={`Sort by ${title}`}>{title}</span>

      {ascending ? (
        <TriangleArrowUp
          width="9"
          className={cn('flex-shrink-0 text-gray-300 ms-1.5', {
            '!text-heading': isActive,
          })}
        />
      ) : (
        <TriangleArrowDown
          width="9"
          className={cn('flex-shrink-0 text-gray-300 ms-1.5', {
            '!text-heading': isActive,
          })}
        />
      )}
    </span>
  );
};

export default TitleWithSort;
