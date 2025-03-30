import { useModalAction } from '@/components/ui/modal/modal.context';
import { customerAtom } from '@/contexts/checkout';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import AsyncSelect from 'react-select/async';
import { selectStyles } from '@/components/ui/select/select.styles';
import { QueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { userClient } from '@/data/client/user';

const AddOrUpdateCheckoutCustomer = () => {
  const { closeModal } = useModalAction();
  const { t } = useTranslation('common');
  const [selectedCustomer, setCustomer] = useAtom(customerAtom);

  function onCustomerUpdate(customer: any) {
    setCustomer(customer);
    closeModal();
  }

  console.log('On AuthResponse')

  async function fetchAsyncOptions(inputValue: string) {
    console.log('selection typing here: ', inputValue)
    const queryClient = new QueryClient();
    const data = await queryClient.fetchQuery(
      [API_ENDPOINTS.USERS, { text: inputValue, page: 1 }],
      () => userClient.fetchUsers({ name: inputValue, page: 1 })
    );

    return data?.data?.map((user: any) => ({
      value: user.id,
      label: user.name,
    }));
  }

  return (
    <div className="flex min-h-screen w-screen max-w-sm flex-col justify-center bg-light p-5 sm:p-8 md:min-h-0 md:rounded-xl">
      <h1 className="mb-5 text-center text-sm font-semibold text-heading sm:mb-6">
        {selectedCustomer ? t('text-update') : t('text-select')}{' '}
        {t('text-customer')}
      </h1>
      <div>
        <AsyncSelect
          styles={selectStyles}
          cacheOptions
          loadOptions={fetchAsyncOptions}
          defaultOptions
          onChange={onCustomerUpdate}
        />
      </div>
    </div>
  );
};

export default AddOrUpdateCheckoutCustomer;
