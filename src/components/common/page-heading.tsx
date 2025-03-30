import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

const PageHeading = ({
  title,
  className,
  ...props
}: {
  title: string;
  className?: string;
}) => {
  return (
    <h2
      className={twMerge(
        classNames(
          "before:content-'' relative text-lg font-semibold text-heading before:absolute before:-top-0.5 before:h-8 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-8 rtl:before:-right-8 md:before:w-1",
          className
        )
      )}
      {...props}
    >
      {title}
    </h2>
  );
};

export default PageHeading;
