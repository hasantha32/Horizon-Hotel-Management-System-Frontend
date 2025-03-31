import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { languageMenu } from '@/utils/locals';
import { Popover } from '@headlessui/react';
import { ToggleIcon } from '@/components/icons/toggle-icon';
import {
  offset,
  flip,
  autoUpdate,
  useFloating,
  shift,
} from '@floating-ui/react';
import ActionButtons from '@/components/common/action-buttons';
import LanguageListbox from './lang-list-box';
import { Config } from '@/config';
import PopOver from '@/components/ui/popover';

export type LanguageSwitcherProps = {
  record: any;
  slug: string;
  deleteModalView?: string | any;
  routes: any;
  className?: string | undefined;
  enablePreviewMode?: boolean;
  isCouponApprove?: boolean;
  couponApproveButton?: boolean;
  isShop?: boolean;
  shopSlug?: string;
};

const LanguageSwitcher = ({
  record,
  slug,
  deleteModalView,
  routes,
  className = '',
  enablePreviewMode,
  isShop,
  shopSlug,
  isCouponApprove,
  couponApproveButton,
}: LanguageSwitcherProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { locales, locale } = router;

  let filterItem = [...languageMenu]?.filter(
    (element) => locales?.includes(element?.id),
  );

  let options = [...filterItem]?.filter(
    (filter) =>
      !record?.translated_languages?.find(
        (translated: any) => translated === filter?.value,
      ),
  );

  let filterTranslatedItem = [...languageMenu]
    ?.filter((element) => record?.translated_languages?.includes(element?.id))
    .filter((item: any) => !locale?.includes(item?.id));

  const { x, y, strategy, update, refs } = useFloating({
    strategy: 'fixed',
    placement: 'bottom',
    middleware: [offset(20), flip(), shift()],
  });

  // This one is for recalculating the position of the floating element if no space is left on the given placement
  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  const preview = `${process.env.NEXT_PUBLIC_SHOP_URL}/products/preview/${slug}`;

  return (
    <div className={`flex w-full items-center justify-end gap-3 ${className}`}>
      <ActionButtons
        id={record?.id}
        editUrl={
          isShop
            ? routes.editWithoutLang(slug, shopSlug)
            : routes.editWithoutLang(slug)
        }
        previewUrl={preview}
        deleteModalView={deleteModalView}
        enablePreviewMode={enablePreviewMode}
        couponApproveButton={couponApproveButton}
        isCouponApprove={isCouponApprove}
      />
      {Config.defaultLanguage === router.locale && (
        // <Popover className="relative inline-block">
        //   <Popover.Button
        //     className="p-2 text-base transition duration-200 opacity-80 hover:text-heading"
        //     ref={reference}
        //   >
        //     <ToggleIcon width={20} />
        //   </Popover.Button>
        //   <div
        //     ref={floating}
        //     style={{
        //       position: strategy,
        //       top: y ?? '',
        //       left: x ?? '',
        //       zIndex: 1,
        //     }}
        //   >
        //     <Popover.Panel className="w-[18rem] max-w-[20rem] overflow-hidden rounded bg-[#F7F8F9] px-4 shadow-translatePanel sm:px-0">
        //       {options?.length ? (
        //         <LanguageListbox
        //           title={t('text-non-translated-title')}
        //           items={options}
        //           translate="false"
        //           slug={slug}
        //           id={record?.id}
        //           routes={routes}
        //         />
        //       ) : (
        //         ''
        //       )}
        //       {filterTranslatedItem?.length ? (
        //         <LanguageListbox
        //           title={t('text-translated-title')}
        //           items={filterTranslatedItem}
        //           translate="true"
        //           slug={slug}
        //           id={record?.id}
        //           routes={routes}
        //         />
        //       ) : (
        //         ''
        //       )}
        //     </Popover.Panel>
        //   </div>
        // </Popover>
        <PopOver>
          {options?.length ? (
            <LanguageListbox
              title={t('text-non-translated-title')}
              items={options}
              translate="false"
              slug={slug}
              id={record?.id}
              routes={routes}
            />
          ) : null}
          {filterTranslatedItem?.length ? (
            <LanguageListbox
              title={t('text-translated-title')}
              items={filterTranslatedItem}
              translate="true"
              slug={slug}
              id={record?.id}
              routes={routes}
            />
          ) : null}
        </PopOver>
      )}
    </div>
  );
};

export default LanguageSwitcher;
