import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from '@/components/ui/link';

const AccessDeniedPage = () => {
  const { t } = useTranslation('common');

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8">
      <div className="relative h-80 w-full sm:h-96 3xl:h-[580px]">
        <Image
          alt={t('text-access-denied')}
          src="/access-denied.svg"
          fill
          sizes="(max-width: 768px) 100vw"
        />
      </div>

      <h3 className="mt-5 text-center text-xl font-bold text-sub-heading sm:mt-10 md:text-2xl 3xl:text-3xl">
        {t('text-access-denied')}
      </h3>
      <p className="mt-2 text-center text-sm text-body 3xl:text-xl">
        {t('text-access-denied-message')}

        <Link
          href="/"
          className="text-accent transition-colors ps-1 hover:text-accent-hover"
        >
          {t('text-return-home')}
        </Link>
      </p>
    </div>
  );
};

export default AccessDeniedPage;
