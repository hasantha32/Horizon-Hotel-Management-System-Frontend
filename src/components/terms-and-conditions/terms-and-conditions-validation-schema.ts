import * as yup from 'yup';
import { MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR } from '@/utils/constants';

export const termsAndConditionsValidationSchema = yup.object().shape({
  title: yup.string().required('form:error-terms-title-required'),
  description: yup
    .string()
    .required('form:error-term-description-required')
    .max(
      MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR,
      'form:error-description-maximum-title',
    )
    .test({
      name: 'description',
      skipAbsent: true,
      test(item, ctx) {
        if (
          item?.replace(/<(.|\n)*?>/g, '')?.trim()?.length === 0 &&
          !item?.includes('<img')
        ) {
          return ctx.createError({
            message: 'form:error-term-description-required',
          });
        }
        return true;
      },
    }),
});
