import cn from 'classnames';
import { SelectConversationIcon } from '@/components/icons/select-conversation';
import { useTranslation } from 'next-i18next';

interface Props {
  className?: string;
}

const SelectConversation = ({ className, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={cn('m-auto w-full', className)} {...rest}>
        <div className="text-center">
          <SelectConversationIcon className="mx-auto mb-14" />
          <h2 className="text-xl font-medium">
            {t('text-select-your-conversation')}
          </h2>
        </div>
      </div>
    </>
  );
};

export default SelectConversation;
