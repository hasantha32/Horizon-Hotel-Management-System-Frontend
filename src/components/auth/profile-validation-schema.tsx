import * as yup from 'yup';

export const profileValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  profile: yup.object().shape({
    contact: yup.string().max(19, 'maximum 19 digit').optional(),
  }),
});
