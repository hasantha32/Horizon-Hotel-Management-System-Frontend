import Link from '@/components/ui/link';
import cn from 'classnames';
import { siteSettings } from '@/settings/site.settings';
import { useSettings } from '@/contexts/settings.context';
import { LogoSVG } from '@/components/icons/logo';
import LogoText from '@/components/icons/logo-text';
import { useAtom } from 'jotai';
import { miniSidebarInitialValue } from '@/utils/constants';
import { useWindowSize } from '@/utils/use-window-size';
import { RESPONSIVE_WIDTH } from '@/utils/constants';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSettingsQuery } from '@/data/settings';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  const { locale } = useRouter();
  const { settings } = useSettingsQuery({
    language: locale!,
  });
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { width } = useWindowSize();
  return (
    <Link
      href={siteSettings?.logo?.href}
      className={cn('inline-flex items-center gap-3', className)}
      // {...props}
    >
      {miniSidebar && width >= RESPONSIVE_WIDTH ? (
        <span
          className="relative overflow-hidden "
          style={{
            width: '100px',
            height: '100px',
          }}
        >
          <Image
            src={
              // settings?.options?.collapseLogo?.original ??
              siteSettings.collapseLogo.url
            }
            alt={settings?.options?.siteTitle ?? siteSettings.collapseLogo.alt}
            fill
            sizes="(max-width: 1200px) 100vw"
            className="object-contain"
            loading="eager"
          />
        </span>
      ) : (
        <span
          className="relative overflow-hidden "
          style={{
            width: '100px',
            height:'100px',
          }}
        >
          <Image
            src={
              // settings?.options?.logo?.original ?? 
              siteSettings.logo.url
            }
            alt={settings?.options?.siteTitle ?? siteSettings.logo.alt}
            fill
            sizes="(max-width: 1200px) 100vw"
            className="object-contain"
            loading="eager"
          />
        </span>
      )}
    </Link>
  );
};

export default Logo;
