import * as yup from 'yup';
import { phoneRegExp, URLRegExp } from '@/utils/constants';

export const shopValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  balance: yup.object().shape({
    payment_info: yup.object().shape({
      email: yup
        .string()
        .required('form:error-account-holder-email-required')
        .typeError('form:error-email-string')
        .email('form:error-email-format'),
      name: yup.string().required('form:error-account-holder-name-required'),
      bank: yup.string().required('form:error-bank-name-required'),
      account: yup
        .number()
        .positive('form:error-account-number-positive-required')
        .integer('form:error-account-number-integer-required')
        .required('form:error-account-number-required')
        .transform((value) => (isNaN(value) ? undefined : value)),
    }),
  }),
  settings: yup.object().shape({
    contact: yup
      .string()
      .required('form:error-contact-number-required')
      .matches(phoneRegExp, 'form:error-contact-number-valid-required'),
    website: yup
      .string()
      .required('form:error-website-required')
      .matches(URLRegExp, 'form:error-url-valid-required'),
    socials: yup.array().of(
      yup.object().shape({
        url: yup.string().when('icon', (data) => {
          if (data) {
            return yup.string().required('form:error-url-required');
          }
          return yup.string().nullable();
        }),
      })
    ),
  }),
});
