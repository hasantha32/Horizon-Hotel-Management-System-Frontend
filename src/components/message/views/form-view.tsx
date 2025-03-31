import Avatar from '@/components/common/avatar';
import { SendMessageGhostIcon } from '@/components/icons/send-message';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import { useSendMessage } from '@/data/conversations';
import { Conversations } from '@/types';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

type FormValues = {
  message: string;
};

const messageSchema = yup.object().shape({
  message: yup.string().required('error-body-required'),
});

interface Props {
  className?: string;
  shop?: Conversations;
}

const CreateMessageForm = ({ className, shop, ...rest }: Props) => {
  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(messageSchema),
  });

  const { t } = useTranslation();
  const router = useRouter();
  const { query } = router;
  const { mutate: createMessage, isLoading: creating } = useSendMessage();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);
  useEffect(() => {
    const listener = (event: any) => {
      if (event.key === 'Enter' && event.shiftKey) {
        return false;
      }
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        const values = getValues();
        onSubmit(values);
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [query?.id]);
  const onSubmit = async (values: FormValues) => {
    if (isEmpty(values.message)) {
      toast?.error(t('form:error-message-required'));
      return;
    }
    createMessage(
      {
        message: values?.message,
        id: query?.id as string,
      },
      {
        onError: (error: any) => {
          toast?.error(error?.message);
        },
        onSuccess: () => {
          const chatBody = document.getElementById('chatBody');
          chatBody?.scrollTo({
            top: chatBody?.scrollHeight,
            behavior: 'smooth',
          });
          reset();
        },
      }
    );
  };
  useEffect(() => {
    setFocus('message');
  }, [setFocus]);
  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          <div className="relative h-10 w-10 shrink-0">
            <Avatar
              src={
                !permission
                  ? shop?.shop?.logo?.original
                  : shop?.user?.profile?.avatar?.original
              }
              {...rest}
              name={
                !permission
                  ? (shop?.shop?.name as string)
                  : (shop?.user?.name as string)
              }
              className={classNames(
                'relative h-full w-full border-0',
                (
                  !permission
                    ? shop?.shop?.logo?.original
                    : shop?.user?.profile?.avatar?.original
                )
                  ? ''
                  : 'bg-muted-black text-base font-medium text-white'
              )}
            />
          </div>
          <div className="relative flex-1">
            {!!creating ? (
              <div className="absolute top-0 left-0 z-50 flex h-full w-full cursor-not-allowed bg-[#EEF1F4]/50">
                <div className="m-auto h-5 w-4 animate-spin rounded-full border-2 border-t-2 border-transparent border-t-accent"></div>
              </div>
            ) : (
              ''
            )}
            <TextArea
              className="overflow-y-auto overflow-x-hidden"
              placeholder={t('form:placeholder-type-message')}
              {...register('message')}
              variant="solid"
              inputClassName="border-0 pr-12 block h-[7.6875rem] rounded-lg bg-[#FAFAFA] focus:bg-[#FAFAFA] resize-none"
              rows={3}
              disabled={!!creating}
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 h-full">
          <Button
            className="h-full px-5 text-lg focus:shadow-none focus:ring-0"
            variant="custom"
            disabled={!!creating}
          >
            <SendMessageGhostIcon className="mt-5 inline-flex self-start" />
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateMessageForm;
