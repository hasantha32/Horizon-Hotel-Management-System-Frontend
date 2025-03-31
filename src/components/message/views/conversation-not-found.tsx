import { useTranslation } from 'next-i18next';
import { EmptyInbox } from '@/components/icons/empty-inbox';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

const UserListNotFound = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  let adminPermission = hasAccess(adminOnly, permissions);
  return (
    <>
      <div
        className={twMerge(
          classNames(
            'flex h-full flex-auto items-center justify-center',
            adminPermission ? 'pb-6 md:pb-10' : '',
            className
          )
        )}
      >
        <div className="px-5 text-center">
          <div className="mb-7">
            <EmptyInbox className="mx-auto" />
          </div>
          <p className="text-sm font-medium text-body/80">
            {t('text-inbox-empty')}
          </p>
        </div>
      </div>
    </>
  );
};

export default UserListNotFound;
