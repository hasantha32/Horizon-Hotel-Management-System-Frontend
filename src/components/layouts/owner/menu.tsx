import { siteSettings } from '@/settings/site.settings';
import Link from '@/components/ui/link';
import { useTranslation } from 'next-i18next';
import { getIcon } from '@/utils/get-icon';
import * as sidebarIcons from '@/components/icons/sidebar';
import cn from 'classnames';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { miniSidebarInitialValue } from '@/utils/constants';
import { useAtom } from 'jotai';
import { useWindowSize } from '@/utils/use-window-size';
import { RESPONSIVE_WIDTH } from '@/utils/constants';

const SideBarMenu = () => {
  const { t } = useTranslation();
  const { sidebarLinks } = siteSettings;
  const router = useRouter();
  const sanitizedPath = router?.asPath?.split('#')[0]?.split('?')[0];
  const { pathname } = router;
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { width } = useWindowSize();

  return (
    <>
      {!isEmpty(sidebarLinks?.ownerDashboard) ? (
        <div className="flex flex-col px-5 pt-10 pb-3">
          {miniSidebar && width >= RESPONSIVE_WIDTH ? (
            ''
          ) : (
            <h3 className="px-3 pb-5 text-xs font-semibold uppercase tracking-[0.05em] text-body/60">
              {t('text-nav-menu')}
            </h3>
          )}
          <div className="space-y-2">
            {sidebarLinks?.ownerDashboard?.map((item, index) => {
              return (
                <Link
                  href={item?.href}
                  key={index}
                  className={cn(
                    'group flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-gray-700 text-start focus:text-accent',
                    miniSidebar && width >= RESPONSIVE_WIDTH
                      ? 'hover:text-accent-hover ltr:pl-3 rtl:pr-3'
                      : 'hover:bg-gray-100',
                    pathname === item?.href
                      ? `font-medium !text-accent-hover ${
                          !miniSidebar
                            ? 'bg-accent/10 hover:!bg-accent/10'
                            : null
                        }`
                      : null
                  )}
                  title={t(item?.label)}
                >
                  <span
                    className={cn(
                      pathname === item?.href
                        ? 'text-accent'
                        : 'text-gray-600 group-focus:text-accent',
                      miniSidebar && width >= RESPONSIVE_WIDTH ? 'm-auto' : ''
                    )}
                  >
                    {getIcon({
                      iconList: sidebarIcons,
                      iconName: item?.icon,
                      className: 'w-5 h-5',
                    })}
                  </span>
                  {miniSidebar && width >= RESPONSIVE_WIDTH ? (
                    ''
                  ) : (
                    <>{t(item?.label)}</>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default SideBarMenu;
