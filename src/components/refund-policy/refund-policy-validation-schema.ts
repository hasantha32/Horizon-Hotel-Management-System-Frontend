import * as yup from 'yup';
import { MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR } from '@/utils/constants';

export const refundPolicyValidationSchema = yup.object().shape({
  title: yup.string().required('form:error-refund-policy-title-required'),
  status: yup.string().required('form:error-status-required'),
  description: yup
    .string()
    .max(
      MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR,
      'form:error-description-maximum-title',
    ),
});
