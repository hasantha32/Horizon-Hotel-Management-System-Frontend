import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from '@/components/icons/chevronDownIcon';
import Link from '@/components/ui/link';
import { PlusIcon } from '@/components/icons/plus-icon';
import { EditIcon } from '@/components/icons/edit';
import { DEFlag } from '@/components/icons/flags/DEFlag';

export type LanguageListBoxProps = {
  title: string;
  items: any;
  translate: string;
  slug: string;
  id: string;
  routes: any;
};

const LanguageListbox = ({
  title,
  items,
  translate,
  slug,
  id,
  routes,
}: LanguageListBoxProps) => {
  const { t } = useTranslation('common');
  const {
    locale,
    query: { shop },
  } = useRouter();

  const currentSelectedItem = locale
    ? items?.find((o: any) => o?.value === locale)!
    : items[2];

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between border-b border-solid border-[#E5E5EB] bg-white p-4 text-left font-medium text-black">
            {title}
            <span className="text-[#8A8F9C]">
              <ChevronDown
                className={`${
                  open ? 'origin-center rotate-180 transform' : ''
                } h-4 w-4`}
              />
            </span>
          </Disclosure.Button>
          <Disclosure.Panel className="py-2">
            {items?.map((option: any, index: string) => (
              <span
                key={`language-${index}`}
                className={`relative flex cursor-pointer items-center px-4 py-2 transition-all hover:bg-white ${
                  currentSelectedItem?.id === option?.id ? 'bg-white' : ''
                }`}
              >
                <span className="relative overflow-hidden rounded-full">
                  {option?.icon}
                </span>
                <span className="ltr:ml-3 rtl:mr-3">{t(option?.name)}</span>
                {translate === 'true' ? (
                  <span className="cursor-pointer text-base transition duration-200 hover:text-heading ltr:ml-auto rtl:mr-auto">
                    <Link
                      href={routes.edit(slug, option?.id, shop)}
                      key={option?.id}
                      locale={false}
                      className="absolute top-0 left-0 h-full w-full"
                    ></Link>
                    <EditIcon width={16} />
                  </span>
                ) : (
                  <>
                    <span className="cursor-pointer text-base transition duration-200 hover:text-heading ltr:ml-auto rtl:mr-auto">
                      <Link
                        href={routes.translate(slug, option?.id, shop)}
                        key={option?.id}
                        locale={false}
                        className="absolute top-0 left-0 h-full w-full"
                      ></Link>
                      <PlusIcon width={24} />
                    </span>
                  </>
                )}
              </span>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default LanguageListbox;
