import Image from 'next/image';
import { CheckMarkFillNew } from '@/components/icons/checkmark-circle-fill';
// import { CloseFillIcon } from '@/components/icons/close-fill';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import Loader from '@/components/ui/loader/loader';
import { useMeQuery } from '@/data/user';
import { useFormatPhoneNumber } from '@/utils/format-phone-number';
import classNames from 'classnames';
import { AvatarIcon } from '@/components/icons/avatar-icon';
import { EmailIcon } from '@/components/icons/email';
import { PhoneOutlineIcon } from '@/components/icons/phone';
import BlockQuote from '@/components/ui/blockquote';
import { miniSidebarInitialValue } from '@/utils/constants';
import { useAtom } from 'jotai';
import { useWindowSize } from '@/utils/use-window-size';
import { RESPONSIVE_WIDTH } from '@/utils/constants';

const UserDetails: React.FC = () => {
  const { t } = useTranslation('common');
  const { data, isLoading: loading } = useMeQuery();
  const phoneNumber = useFormatPhoneNumber({
    customer_contact: data?.profile?.contact as string,
  });
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { width } = useWindowSize();

  if (loading)
    return <Loader text={t('text-loading')} className="!h-auto py-10" />;

  return (
    <div
      className={classNames(
        'relative mt-11 pb-10',
        miniSidebar && width >= RESPONSIVE_WIDTH ? 'px-4' : 'px-8'
      )}
    >
      <div className="flex flex-wrap gap-3">
        <div
          className={classNames(
            'relative h-12 w-12 shrink-0 rounded-full',
            data?.profile?.avatar?.original
              ? ''
              : 'flex bg-[#2B2C2E] text-[#F0F0F0]',
            miniSidebar && width >= RESPONSIVE_WIDTH ? 'm-auto' : ''
          )}
        >
          <div
            className={classNames(
              'relative overflow-hidden',
              data?.profile?.avatar?.original
                ? 'h-full w-full'
                : 'mx-auto self-end'
            )}
          >
            {data?.profile?.avatar?.original ? (
              <Image
                src={data?.profile?.avatar?.original}
                // fill
                sizes="(max-width: 768px) 100vw"
                alt={data?.name ?? ''}
                height={36}
                width={36}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <AvatarIcon className="-mb-px" />
            )}
          </div>

          <div
            className={classNames(
              'absolute top-0 -right-0.5 text-base',
              data?.is_active ? 'text-accent' : 'text-red-500'
            )}
          >
            <CheckMarkFillNew />
          </div>
        </div>
        {miniSidebar && width >= RESPONSIVE_WIDTH ? (
          <div className="absolute -left-8 bottom-0 h-px w-[calc(100%+64px)] border-b border-dashed border-b-[#E5E5E5]" />
        ) : (
          ''
        )}
        {miniSidebar && width >= RESPONSIVE_WIDTH ? (
          ''
        ) : (
          <>
            <div className="flex-1 self-center">
              {data?.name ? (
                <h3 className="mb-1.5 break-all text-xl font-semibold leading-none text-muted-black">
                  {data?.name}
                </h3>
              ) : (
                ''
              )}
              {data?.email ? (
                <div className="flex items-start gap-1 ">
                  <EmailIcon className="shrink-0 text-base text-[#E5E5E5]" />
                  <Link
                    href={`mailTo:${data?.email}`}
                    className="break-all text-xs font-normal text-gray-500"
                  >
                    {data?.email}
                  </Link>
                </div>
              ) : (
                ''
              )}
            </div>
          </>
        )}
      </div>
      {miniSidebar && width >= RESPONSIVE_WIDTH ? (
        ''
      ) : (
        <>
          {!data?.profile ? (
            <p className="mt-4 text-sm text-muted">
              {t('text-add-your')}{' '}
              <Link
                href={Routes.profileUpdate}
                className="text-accent underline"
              >
                {t('authorized-nav-item-profile')}
              </Link>
            </p>
          ) : (
            <>
              {data?.profile?.bio ? (
                <BlockQuote
                  quote={data?.profile?.bio as string}
                  className="mt-4"
                />
              ) : (
                ''
              )}

              {data?.profile?.contact ? (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-black">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <PhoneOutlineIcon className="text-lg text-[#E5E5E5]" />
                    {t('nav-menu-contact')}:
                  </span>
                  <Link href={`tel:${phoneNumber}`}>{phoneNumber}</Link>
                </p>
              ) : (
                ''
              )}
            </>
          )}
          <div className="absolute -left-8 bottom-0 h-px w-[calc(100%+64px)] border-b border-dashed border-b-[#E5E5E5]"></div>
        </>
      )}
    </div>
  );
};
export default UserDetails;
