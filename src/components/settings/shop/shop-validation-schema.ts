import * as yup from 'yup';

export const shopValidationSchema = yup.object().shape({
  deliveryTime: yup
    .array()
    .min(1, 'form:error-add-at-least-one-delivery-time')
    .of(
      yup.object().shape({
        title: yup.string().required('form:error-title-required'),
      })
    ),
});
