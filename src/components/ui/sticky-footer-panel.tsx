import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

type StickyFooterPanelProps = {
  children: React.ReactNode;
  className?: string;
};

const StickyFooterPanel: React.FC<StickyFooterPanelProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div
      className={twMerge(
        classNames(
          'sticky bottom-0 -mx-5 bg-gray-100/10 py-3 px-5 backdrop-blur text-end md:py-5 lg:-mx-8 lg:px-8',
          className
        )
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default StickyFooterPanel;
