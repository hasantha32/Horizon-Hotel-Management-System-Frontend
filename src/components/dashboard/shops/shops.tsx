import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { useMeQuery } from '@/data/user';
import ShopCard from '@/components/shop/shop-card';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import NotFound from '@/components/ui/not-found';
import { isEmpty } from 'lodash';

const ShopList = () => {
  const { t } = useTranslation();
  const { data, isLoading: loading, error } = useMeQuery();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      {permission ? (
        <div className="mb-5 border-b border-dashed border-border-base pb-5 md:mb-8 md:pb-7 ">
          <h1 className="text-lg font-semibold text-heading">
            {t('common:sidebar-nav-item-my-shops')}
          </h1>
        </div>
      ) : (
        ''
      )}
      {!isEmpty(data?.shops) ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4">
          {data?.shops?.map((myShop: any, idx: number) => (
            <ShopCard shop={myShop} key={idx} />
          ))}
        </div>
      ) : (
        ''
      )}
      {!data?.managed_shop && !data?.shops?.length ? (
        <NotFound
          image="/no-shop-found.svg"
          text="text-no-shop-found"
          className="mx-auto w-7/12"
        />
      ) : null}
      {!!data?.managed_shop ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4">
          <ShopCard shop={data?.managed_shop} />
        </div>
      ) : null}
    </>
  );
};

export default ShopList;
