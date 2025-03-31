import UserListIndex from '@/components/message/user-list-index';
import UserMessageIndex from '@/components/message/user-message-index';
import Card from '@/components/common/card';
import { useWindowSize } from '@/utils/use-window-size';
import ResponsiveView from '@/components/message/views/responsive-vew';
import { RESPONSIVE_WIDTH } from '@/utils/constants';

export default function MessagePageIndex() {
  const { width } = useWindowSize();
  return (
    <>
      <div
        className="h-full overflow-hidden"
        style={{ maxHeight: 'calc(100% - 5px)' }}
      >
        {width >= RESPONSIVE_WIDTH ? (
          <div className="flex h-full flex-wrap gap-6 overflow-hidden">
            <UserListIndex />

            <UserMessageIndex />
          </div>
        ) : (
          <ResponsiveView />
        )}
      </div>
    </>
  );
}
