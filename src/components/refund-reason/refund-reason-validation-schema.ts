import * as yup from 'yup';

export const refundReasonValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-refund-reason-title-required')
  
});
