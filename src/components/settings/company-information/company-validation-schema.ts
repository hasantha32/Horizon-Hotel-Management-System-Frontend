import * as yup from 'yup';
import { phoneRegExp, URLRegExp } from '@/utils/constants';

export const companyValidationSchema = yup.object().shape({
  contactDetails: yup.object().shape({
    contact: yup
      .string()
      .required('form:error-phone-number-required')
      .matches(phoneRegExp, 'form:error-phone-number-valid-required'),
    website: yup
      .string()
      .required('form:error-website-required')
      .matches(URLRegExp, 'form:error-url-valid-required'),
    emailAddress: yup
      .string()
      .email('form:error-email-format')
      .required('form:error-email-required'),
    socials: yup.array().of(
      yup.object().shape({
        url: yup.string().when('icon', (data) => {
          if (data) {
            return yup
              .string()
              .url('form:error-invalid-url')
              .required('form:error-url-required');
          }
          return yup.string().nullable();
        }),
      }),
    ),
  }),
});
