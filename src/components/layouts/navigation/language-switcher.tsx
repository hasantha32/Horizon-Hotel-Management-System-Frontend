import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { LangSwitcherIcon } from '@/components/icons/lang-switcher-icon';
import { languageMenu } from '@/utils/locals';
import { useCart } from '@/contexts/quick-cart/cart.context';
import Cookies from 'js-cookie';
import { WorldIcon } from '@/components/icons/worldIcon';

export default function LanguageSwitcher() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { asPath, locale, locales } = router;
  const { resetCart } = useCart();

  let filterItem = languageMenu?.filter((element) =>
    locales?.includes(element?.id)
  );

  const currentSelectedItem = locale
    ? filterItem?.find((o) => o?.value === locale)!
    : filterItem[2];
  const [selectedItem, setSelectedItem] = useState(currentSelectedItem);

  function handleItemClick(values: any) {
    Cookies.set('NEXT_LOCALE', values?.value, { expires: 365 });
    setSelectedItem(values);
    resetCart();
    router.push(asPath, undefined, {
      locale: values?.value,
    });
  }

  return (
    <Listbox value={selectedItem} onChange={handleItemClick}>
      {({ open }) => (
        <div className="min-w-90 relative z-10 py-2 sm:border-gray-200/80 sm:py-3 sm:border-s lg:py-4 lg:pe-6 lg:ms-0">
          <Listbox.Button className="gap-3r relative flex w-full cursor-pointer items-end rounded px-1.5 py-0.5 text-[13px] font-semibold text-heading text-start focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:px-6 xl:text-sm">
            <span className="hidden lg:block">
              <span className="text-xs font-medium text-gray-400">
                {t('common:text-language')}
              </span>
              <span className="flex items-center truncate font-medium text-black">
                {t(selectedItem.name)}
              </span>
            </span>
            <span className="pointer-events-none absolute bottom-0.5 hidden items-center ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto lg:flex">
              <LangSwitcherIcon
                className="h-4 w-4 text-[#666666]"
                aria-hidden="true"
              />
            </span>
            <span className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-gray-200/80 bg-[#F8F8FA] py-4 text-[#666666] lg:hidden xl:hidden">
              <WorldIcon className="h-5 w-5" />
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              static
              className="absolute right-0 mt-3 max-h-60 w-56 overflow-auto rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm shadow-box lg:mt-4"
            >
              {filterItem?.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `${
                      active ? 'text-accent' : 'text-gray-900'
                    } relative cursor-pointer select-none rounded-lg border-b border-dashed border-gray-200 py-2.5 last:border-0`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <span className="flex items-center [&>svg]:w-6">
                      {option.icon}
                      <span
                        className={`${
                          selected ? 'font-medium' : 'font-normal'
                        } block truncate ltr:ml-2.5 rtl:mr-2.5`}
                      >
                        {t(option.name)}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active && 'text-amber-600'
                          } absolute inset-y-0 flex items-center ltr:left-0 ltr:pl-3 rtl:right-0 rtl:pr-3`}
                        />
                      ) : null}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
