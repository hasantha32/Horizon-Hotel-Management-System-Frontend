import * as yup from 'yup';
import { MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR } from '@/utils/constants';

export const flashSaleValidationSchema = yup.object().shape({
  title: yup.string().required('form:error-flash-sale-title-required'),
  description: yup
    .string()
    .required('form:error-flash-sale-description-required')
    .max(
      MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR,
      'form:error-description-maximum-title',
    )
    .test({
      name: 'description',
      skipAbsent: true,
      test(item, ctx) {
        console.log(item);
        if (
          item?.replace(/<(.|\n)*?>/g, '')?.trim()?.length === 0 &&
          !item?.includes('<img')
        ) {
          return ctx.createError({
            message: 'form:error-flash-sale-description-required',
          });
        }
        return true;
      },
    }),
  start_date: yup.date().required('form:error-active-date-required'),
  type: yup.string().required('form:error-flash-sale-campaign-type').nullable(),
  rate: yup.number().when('type', {
    is: (data: string) => data === 'percentage',
    then: () =>
      yup
        .number()
        .min(1, 'form:error-minimum-title')
        .max(99, 'form:error-maximum-title')
        .transform((value) => (isNaN(value) ? undefined : value))
        .positive('form:error-must-number')
        .required('form:error-rate-required'),

    otherwise: () =>
      yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .nullable(),
  }),
  sale_builder: yup.object().shape({
    data_type: yup
      .string()
      .required('form:error-products-filter-option-required')
      .nullable(),
  }),
  products: yup
    .array()
    .required('form:error-select-single-products-required')
    .min(1, 'form:error-product-one-required'),
  end_date: yup
    .date()
    .required('form:error-expire-date-required')
    .min(yup.ref('start_date'), 'form:error-expire-and-active-date'),
});
