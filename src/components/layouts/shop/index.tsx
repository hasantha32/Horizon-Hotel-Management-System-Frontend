import Navbar from '@/components/layouts/navigation/top-navbar';
import { miniSidebarInitialValue } from '@/utils/constants';
import { useRouter } from 'next/router';
import { getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import SidebarItem from '@/components/layouts/navigation/sidebar-item';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import MobileNavigation from '@/components/layouts/navigation/mobile-navigation';
import Footer from '@/components/layouts/footer/footer-bar';
import { useSettingsQuery } from '@/data/settings';
import { useAtom } from 'jotai';
import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import { useWindowSize } from '@/utils/use-window-size';
import { RESPONSIVE_WIDTH } from '@/utils/constants';
import {
  checkIsMaintenanceModeComing,
  checkIsMaintenanceModeStart,
} from '@/utils/constants';
import { adminOnly } from '@/utils/auth-utils';

interface MenuItemsProps {
  [key: string]: {
    href: string;
    label: string;
    icon: string;
    permissions?: string[];
    childMenu: {
      href: string | any;
      label: string;
      icon: string;
      permissions?: string[];
    }[];
  };
}

const SidebarItemMap = ({ menuItems }: any) => {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { settings } = useSettingsQuery({
    language: locale!,
  });
  const { childMenu } = menuItems;

  // @ts-ignore
  const isEnableTermsRoute = settings?.options?.enableTerms;
  const isEnableCouponsRoute = settings?.options?.enableCoupons;
  const { permissions: currentUserPermissions } = getAuthCredentials();
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { width } = useWindowSize();
  const {
    query: { shop },
  } = useRouter();

  let termsAndConditions;
  let coupons;

  if (!isEnableTermsRoute) {
    termsAndConditions = menuItems?.childMenu.find(
      (item: any) => item.label === 'Terms And Conditions',
    );
    if (termsAndConditions) termsAndConditions.permissions = adminOnly;
  }

  if (!isEnableCouponsRoute) {
    coupons = menuItems?.childMenu.find(
      (item: any) => item.label === 'Coupons',
    );
    if (coupons) coupons.permissions = adminOnly;
  }

  return (
    <div className="space-y-2">
      {childMenu?.map(
        ({
          href,
          label,
          icon,
          permissions,
          childMenu,
        }: {
          href: string;
          label: string;
          icon: string;
          childMenu: any;
          permissions: any;
        }) => {
          if (!childMenu && !hasAccess(permissions, currentUserPermissions)) {
            return null;
          }

          return (
            <SidebarItem
              key={label}
              // @ts-ignore
              href={href(shop?.toString()!)}
              label={t(label)}
              icon={icon}
              childMenu={childMenu}
              miniSidebar={miniSidebar && width >= RESPONSIVE_WIDTH}
            />
          );
        },
      )}
    </div>
  );
};

const SideBarGroup = () => {
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { role } = getAuthCredentials();
  const menuItems: MenuItemsProps =
    role === 'staff'
      ? siteSettings?.sidebarLinks?.staff
      : siteSettings?.sidebarLinks?.shop;
  const menuKeys = Object.keys(menuItems);
  const { width } = useWindowSize();
  const { t } = useTranslation();

  return (
    <>
      {menuKeys?.map((menu, index) => (
        <div
          className={cn(
            'flex flex-col px-5',
            miniSidebar && width >= RESPONSIVE_WIDTH
              ? 'border-b border-dashed border-gray-200 py-5'
              : 'pt-6 pb-3',
          )}
          key={index}
        >
          <div
            className={cn(
              'px-3 pb-5 text-xs font-semibold uppercase tracking-[0.05em] text-body/60',
              miniSidebar && width >= RESPONSIVE_WIDTH ? 'hidden' : '',
            )}
          >
            {t(menuItems[menu]?.label)}
          </div>
          <SidebarItemMap menuItems={menuItems[menu]} />
        </div>
      ))}
    </>
  );
};

const ShopLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { locale } = useRouter();
  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
  const { width } = useWindowSize();
  const [underMaintenance] = useAtom(checkIsMaintenanceModeComing);
  const [underMaintenanceStart] = useAtom(checkIsMaintenanceModeStart);

  return (
    <div
      className="flex flex-col min-h-screen transition-colors duration-150 bg-gray-100"
      dir={dir}
    >
      <Navbar />
      <MobileNavigation>
        <SideBarGroup />
      </MobileNavigation>

      <div className="flex flex-1">
        <aside
          className={cn(
            'fixed bottom-0 z-10 hidden h-full w-72 bg-white shadow transition-[width] duration-300 ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto lg:block',
            width >= RESPONSIVE_WIDTH &&
              (underMaintenance || underMaintenanceStart)
              ? 'pt-[8.75rem]'
              : 'pt-20',
            miniSidebar && width >= RESPONSIVE_WIDTH ? 'lg:w-24' : 'lg:w-76',
          )}
        >
          <div className="w-full h-full overflow-x-hidden sidebar-scrollbar">
            <Scrollbar
              className="w-full h-full"
              options={{
                scrollbars: {
                  autoHide: 'never',
                },
              }}
            >
              <SideBarGroup />
            </Scrollbar>
          </div>
        </aside>
        <main
          className={cn(
            'relative flex w-full flex-col justify-start transition-[padding] duration-300',
            width >= RESPONSIVE_WIDTH &&
              (underMaintenance || underMaintenanceStart)
              ? 'lg:pt-[8.75rem]'
              : 'pt-[3.9375rem] lg:pt-[4.75rem]',
            miniSidebar && width >= RESPONSIVE_WIDTH
              ? 'ltr:pl-24 rtl:pr-24'
              : 'ltr:xl:pl-76 rtl:xl:pr-76 ltr:lg:pl-72 rtl:lg:pr-72 rtl:lg:pl-0',
          )}
        >
          <div className="h-full p-5 md:p-8">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
export default ShopLayout;
