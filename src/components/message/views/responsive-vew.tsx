import UserListIndex from '@/components/message/user-list-index';
import { useRouter } from 'next/router';
import UserMessageIndex from '@/components/message/user-message-index';

export default function MessagePageIndex() {
  const { query } = useRouter();
  return <>{query?.id ? <UserMessageIndex /> : <UserListIndex />}</>;
}
