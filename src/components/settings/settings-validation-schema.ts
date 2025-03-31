import * as yup from 'yup';

export const settingsValidationSchema = yup.object().shape({
  currency: yup.object().nullable().required('form:error-currency-required'),
  currencyOptions: yup.object().shape({
    fractions: yup
      .number()
      .min(1, 'Fractional must be grater than 1')
      .max(5, 'Fractional number can not be grater than 5')
      .typeError('form:error-fractions-must-be-number')
      .positive('form:error-fractions-must-positive')
      .required('form:error-currency-number of decimals-required'),
  }),
  maximumQuestionLimit: yup
    .number()
    .positive()
    .required('form:error-maximum-question-limit')
    .typeError('form:error-maximum-question-limit'),
  minimumOrderAmount: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .moreThan(-1, 'form:error-sale-price-must-positive'),
  freeShippingAmount: yup
    .number()
    .moreThan(-1, 'form:error-free-shipping-amount-must-positive')
    .typeError('form:error-amount-number'),
  maxShopDistance: yup
    .number()
    .positive('form:error-max-shop-distance-must-positive')
    .required('form:error-max-shop-distance')
    .typeError('form:error-max-shop-distance'),
  deliveryTime: yup
    .array()
    .min(1, 'form:error-add-at-least-one-delivery-time')
    .of(
      yup.object().shape({
        title: yup.string().required('form:error-title-required'),
      })
    ),
});
