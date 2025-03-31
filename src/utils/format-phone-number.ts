import parsePhoneNumber from 'libphonenumber-js';
import { useMemo } from 'react';

export const useFormatPhoneNumber = ({
  customer_contact,
}: {
  customer_contact: string;
}) => {
  const phoneNumber = useMemo(() => {
    const number = parsePhoneNumber(`+${customer_contact as string}`);
    return number?.formatInternational();
  }, [customer_contact]);

  return phoneNumber;
};
