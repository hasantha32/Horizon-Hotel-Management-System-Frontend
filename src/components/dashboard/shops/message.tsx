import MessagePageIndex from '@/components/message/index';
import { ownerAndStaffOnly } from '@/utils/auth-utils';

const Message = () => {
  return <MessagePageIndex />;
};

Message.authenticate = {
  permissions: ownerAndStaffOnly,
};

export default Message;
