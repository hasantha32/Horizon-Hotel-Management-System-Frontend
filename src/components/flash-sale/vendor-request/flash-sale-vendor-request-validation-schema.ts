import * as yup from 'yup';

export const flashSaleVendorRequestValidationSchema = yup.object().shape({
  note: yup.string().required('form:error-notice-title-required'),
  // flashSale: yup
  //   .array()
  //   .required('form:error-select-single-products-required')
  //   .min(1, 'form:error-product-one-required'),
  products: yup
    .array()
    .required('form:error-select-single-products-required')
    .min(1, 'form:error-product-one-required'),
});
