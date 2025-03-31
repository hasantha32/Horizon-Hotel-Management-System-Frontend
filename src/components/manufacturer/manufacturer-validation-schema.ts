import * as yup from 'yup';

export const manufacturerValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-manufacturer-name-required'),
  type: yup.object().nullable().required('form:error-type-required'),
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
});
