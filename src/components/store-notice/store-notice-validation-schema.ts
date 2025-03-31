import { StoreNoticeType } from '@/types';
import * as yup from 'yup';

const typeArr = [StoreNoticeType.all_shop, StoreNoticeType.all_vendor];

export const storeNoticeValidationSchema = yup.object().shape({
  priority: yup.object().nullable().required('form:error-priority-required'),
  notice: yup.string().required('form:error-notice-title-required'),
  description: yup.string().required('form:error-notice-description-required'),
  effective_from: yup.date().required('form:error-active-date-required'),
  expired_at: yup.date().required('form:error-expire-date-required'),
  received_by: yup.array().when('type', (type: any, schema: any) => {
    if ((type && !typeArr.includes(type.value)) || schema.min() === 0) {
      return yup
        .array()
        .min(1, 'form:error-received-by-required')
        .typeError('form:error-received-by-required');
    }
    return yup.array().notRequired();
  }),
});
