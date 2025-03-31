import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import { useSettings } from '@/contexts/settings.context';
import { useTranslation } from 'next-i18next';

export type IFooterProp = {
  className?: string;
};

const Footer: React.FC<IFooterProp> = ({ className }) => {
  const { t } = useTranslation();
  const { siteTitle, siteLink, copyrightText, externalText, externalLink } =
    useSettings();
  const date = new Date();

  return (
    <footer className="mt-auto bg-white shadow">
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between bg-white px-5 py-6 md:px-8">
          <span className="text-sm text-body sm:text-center">
            ©{date.getFullYear()}{' '}
            <Link
              className="font-medium text-heading"
              href={siteLink ?? Routes?.dashboard}
            >
              {siteTitle}
            </Link>
            . {copyrightText}{' '}
            {externalText ? (
              <Link
                className="font-medium text-heading"
                href={externalLink ?? Routes?.dashboard}
              >
                {externalText}
              </Link>
            ) : (
              ''
            )}
          </span>
          <div className="flex space-x-6 text-sm font-medium text-body sm:justify-center">
            {process.env.NEXT_PUBLIC_VERSION}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
