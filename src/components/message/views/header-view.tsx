import { useRouter } from 'next/router';
import Button from '@/components/ui/button';
import cn from 'classnames';
import PopOver from '@/components/ui/popover';
import Avatar from '@/components/common/avatar';
import { siteSettings } from '@/settings/site.settings';
import { Shop } from '@/types';
import { useWindowSize } from '@/utils/use-window-size';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { BackIcon } from '@/components/icons/back-icon';
import { RESPONSIVE_WIDTH } from '@/utils/constants';
import { ExternalLinkIconNew } from '@/components/icons/external-link';
interface Props {
  className?: string;
  shop: Shop;
}

const HeaderView = ({ className, shop, ...rest }: Props) => {
  const router = useRouter();
  const { locale } = router;
  const { width } = useWindowSize();
  const { permissions } = getAuthCredentials();
  let adminPermission = hasAccess(adminOnly, permissions);
  const routes = adminPermission
    ? Routes.message.list
    : `${Routes?.ownerDashboardMessage}`;
  return (
    <>
      <div
        className={cn(
          'relative flex shrink-0 items-center border-b border-solid border-b-[#E7E7E7] bg-white pb-6',
          width >= RESPONSIVE_WIDTH ? '' : '',
          className
        )}
        {...rest}
      >
        {width <= RESPONSIVE_WIDTH ? (
          <Link
            href={routes}
            className="mr-1 inline-block p-1 pl-0 text-2xl transition-colors duration-300 hover:text-accent-hover"
          >
            <BackIcon />
          </Link>
        ) : (
          ''
        )}
        <div
          className={`flex items-center gap-2 ${
            adminPermission ? 'cursor-pointer' : ''
          }`}
          onClick={() => (adminPermission ? router.push(`/${shop?.slug}`) : '')}
        >
          <Avatar
            src={shop?.logo?.original}
            {...rest}
            name={shop?.name as string}
            className={cn(
              'relative h-10 w-10 border-0',
              shop?.logo?.original
                ? ''
                : 'bg-muted-black text-base font-medium text-white'
            )}
          />
          {shop?.name ? (
            <h2 className="flex items-center gap-2 text-lg font-semibold capitalize text-muted-black">
              {shop?.name}
              <Link
                href={`${process.env.NEXT_PUBLIC_SHOP_URL}/${locale}/shops/${shop?.slug}`}
                target="_blank"
                className="text-xl text-[#929292] transition-colors duration-300 hover:text-opacity-60"
                title={shop?.name}
              >
                <ExternalLinkIconNew />
              </Link>
            </h2>
          ) : (
            ''
          )}
        </div>
        {/* {adminPermission ? (
          <PopOver
            iconStyle="vertical"
            popOverPanelClass="!w-full min-w-[10rem] max-w-full rounded bg-white py-2 px-1 text-left shadow-cardAction"
            popOverButtonClass="text-[#9CA3AF]"
          >
            <Button
              className="!h-auto w-full !justify-start px-2 !py-1 text-sm leading-6 hover:bg-gray-50 hover:text-accent"
              variant="custom"
              onClick={() => router.push(`/${shop?.slug}`)}
            >
              See Profile
            </Button>

            <Button
              className="!h-auto w-full !justify-start px-2 !py-1 text-sm leading-6 hover:bg-gray-50 hover:text-accent"
              variant="custom"
            >
              Set As Default
            </Button>

            <Button
              variant="custom"
              className="!h-auto w-full !justify-start px-2 !py-1 text-sm leading-6 text-[#F83D3D] hover:bg-gray-50 hover:text-[#d03131]"
            >
              Delete
            </Button>
          </PopOver>
        ) : (
          ''
        )} */}
      </div>
    </>
  );
};

export default HeaderView;
