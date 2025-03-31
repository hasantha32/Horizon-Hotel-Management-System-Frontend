import React from 'react';
import { useTranslation } from 'next-i18next';
import { NoMessageFound } from '@/components/icons/no-message-found';
import NotFound from '@/components/ui/not-found';

const MessageNotFound = ({ ...rest }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex h-full" {...rest}>
        <div className="m-auto">
          <NotFound
            image="/no-message-found.svg"
            text={t('text-no-message-found')}
            className="mx-auto"
            imageParentClassName="min-h-[14.375rem] md:min-h-[14.375rem]"
          />
        </div>
      </div>
    </>
  );
};

export default MessageNotFound;
