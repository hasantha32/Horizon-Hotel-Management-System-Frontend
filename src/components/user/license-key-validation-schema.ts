import * as yup from 'yup';

export const licenseKeyValidationSchema = yup.object().shape({
  license_key: yup.string().min(3).required('form:error-refund-reason-title-required')
    .matches(/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i,'Please Enter a valid License Key.')
});
