import * as yup from 'yup';
import { MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR } from '@/utils/constants';

export const faqsValidationSchema = yup.object().shape({
  faq_title: yup.string().required('form:error-faq-title-required'),
  faq_description: yup
    .string()
    .required('form:error-faq-description-required')
    .max(
      MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR,
      'form:error-description-maximum-title',
    )
    .test({
      name: 'faq_description',
      skipAbsent: true,
      test(item, ctx) {
        if (
          item?.replace(/<(.|\n)*?>/g, '')?.trim()?.length === 0 &&
          !item?.includes('<img')
        ) {
          return ctx.createError({
            message: 'form:error-faq-description-required',
          });
        }
        return true;
      },
    }),
});
