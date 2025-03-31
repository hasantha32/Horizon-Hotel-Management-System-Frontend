import Card from '@/components/common/card';
import AttributeList from '@/components/attribute/attribute-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopLayout from '@/components/layouts/shop';
import router, { useRouter } from 'next/router';
import {
  adminOnly,
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useShopQuery } from '@/data/shop';
import { useState } from 'react';
import { SortOrder } from '@/types';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { MoreIcon } from '@/components/icons/more-icon';
import Button from '@/components/ui/button';
import { useAttributesQuery } from '@/data/attributes';
import { Config } from '@/config';
import { useMeQuery } from '@/data/user';
import { Routes } from '@/config/routes';
import PageHeading from '@/components/common/page-heading';
import cn from 'classnames';

export default function AttributePage() {
  const router = useRouter();
  const {
    query: { shop },
    locale,
  } = useRouter();
  const { permissions } = getAuthCredentials();
  const { t } = useTranslation();
  const { openModal } = useModalAction();
  const [orderBy, setOrder] = useState('updated_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { data: me } = useMeQuery();
  const { data: shopData, isLoading: fetchingShop } = useShopQuery({
    slug: shop as string,
  });
  const shopId = shopData?.id!;

  function handleImportModal() {
    openModal('EXPORT_IMPORT_ATTRIBUTE', shopId);
  }

  const { attributes, loading, error } = useAttributesQuery(
    {
      shop_id: shopId,
      orderBy,
      sortedBy,
      language: locale,
    },
    {
      enabled: Boolean(shopId),
    }
  );
  if (loading || fetchingShop)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(shopId) &&
    me?.managed_shop?.id != shopId
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('common:sidebar-nav-item-attributes')} />
        </div>

        <div className="flex w-full flex-col items-center ms-auto md:w-3/4 md:flex-row xl:w-2/4">
          <LinkButton
            href={`/${shop}/attributes/create`}
            className="mt-5 h-12 w-full md:mt-0 md:w-auto md:ms-auto"
          >
            <span>
              + {t('form:button-label-add')} {t('common:attribute')}
            </span>
          </LinkButton>

          <Button onClick={handleImportModal} className="mt-5 w-full md:hidden">
            {t('common:text-export-import')}
          </Button>
          <button
            onClick={handleImportModal}
            className={cn(
              'hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 transition duration-300 ms-6 hover:bg-gray-100 md:flex'
            )}
          >
            <MoreIcon className="w-3.5 text-body" />
          </button>
        </div>
      </Card>
      <AttributeList
        attributes={attributes}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
AttributePage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
AttributePage.Layout = ShopLayout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
