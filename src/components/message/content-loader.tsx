import ContentLoader from 'react-content-loader';
import Avatar from '@/components/common/avatar';
import { siteSettings } from '@/settings/site.settings';
import cn from 'classnames';
interface MessageCardLoaderProps {
  classes: any;
  limit: number;
}
interface LoaderProps {
  props?: any;
  backgroundColor: string;
  foregroundColor: string;
}

const rangeMap = (n: number, fn: (i: number) => any) => {
  const arr: string[] = [];
  while (n > arr?.length) {
    arr?.push(fn(arr?.length));
  }
  return arr;
};

const checkOddAdnEven = (number: number) => {
  if (number % 2 == 0) {
    return true;
  } else {
    return false;
  }
};

const Loader = ({ props, backgroundColor, foregroundColor }: LoaderProps) => {
  return (
    <ContentLoader
      speed={2}
      width={'100%'}
      height={'100%'}
      viewBox="0 0 241 18"
      backgroundColor={backgroundColor ? backgroundColor : '#E5E5E5'}
      foregroundColor={foregroundColor ? foregroundColor : '#c0c0c0'}
      {...props}
    >
      <rect width="241" height="6" rx="2" />
      <rect y="12" width="120.5" height="6" rx="2" />
    </ContentLoader>
  );
};

const MessageCardLoader = ({
  classes,
  limit,
  ...rest
}: MessageCardLoaderProps) => {
  return (
    <div className="space-y-3" {...rest}>
      {rangeMap(limit, (i) => (
        <>
          <div
            className={`${
              checkOddAdnEven(i) ? 'space-x-3' : 'flex-row-reverse'
            } flex w-full`}
          >
            {checkOddAdnEven(i) ? (
              <div className="w-10">
                <Avatar src={siteSettings?.avatar?.placeholder} name="avatar" />
              </div>
            ) : (
              ''
            )}
            <div
              className={cn(
                classes?.common,
                checkOddAdnEven(i) ? classes?.default : classes?.reverse,
              )}
            >
              <div className="p-2">
                <Loader
                  backgroundColor={checkOddAdnEven(i) ? '#d7d7d7' : '#119278'}
                  foregroundColor={checkOddAdnEven(i) ? '#ECECEC' : '#21A087'}
                />
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default MessageCardLoader;
