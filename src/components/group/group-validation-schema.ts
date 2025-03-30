import * as yup from 'yup';

export const typeValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  banners: yup
    .array()
    .min(1, 'form:error-min-one-banner')
    .when('settings.layoutType', {
      is: (layout: string) => !layout.includes('compact'),
      then: () =>
        yup.array().of(
          yup.object().shape({
            title: yup.string().required('form:error-title-required'),
          }),
        ),
      otherwise: () =>
        yup.array().of(
          yup.object().shape({
            image: yup.object().test(
              'check-digital-file',
              'form:error-banner-file-input-required',
              (file) =>
                file && // @ts-ignore
                file?.original,
            ),
          }),
        ),
    }),
  settings: yup.object().shape({
    bestSelling: yup.object().when('layoutType', {
      is: (layout: string) => layout.includes('compact'),
      then: () =>
        yup.object().shape({
          title: yup.string().when('enable', {
            is: (enable: boolean) => enable,
            then: () =>
              yup.string().required('Best selling title is required.'),
          }),
        }),
      otherwise: () =>
        yup.object().shape({
          title: yup.string().notRequired().nullable(),
        }),
    }),
    popularProducts: yup.object().when('layoutType', {
      is: (layout: string) => layout.includes('compact'),
      then: () =>
        yup.object().shape({
          title: yup.string().when('enable', {
            is: (enable: boolean) => enable,
            then: () =>
              yup.string().required('Popular products title is required.'),
          }),
        }),
      otherwise: () =>
        yup.object().shape({
          title: yup.string().notRequired().nullable(),
        }),
    }),
    category: yup.object().when('layoutType', {
      is: (layout: string) => layout.includes('compact'),
      then: () =>
        yup.object().shape({
          title: yup.string().when('enable', {
            is: (enable: boolean) => enable,
            then: () => yup.string().required('Category title is required.'),
          }),
        }),
      otherwise: () =>
        yup.object().shape({
          title: yup.string().notRequired().nullable(),
        }),
    }),
    handpickedProducts: yup.object().when('layoutType', {
      is: (layout: string) => layout.includes('compact'),
      then: () =>
        yup.object().shape({
          products: yup.array().when('enable', {
            is: (enable: boolean) => enable,
            then: () =>
              yup.array().when('enableSlider', {
                is: (enable: boolean) => !enable,
                then: () =>
                  yup
                    .array()
                    .required('Hand picked products is required.')
                    .min(1, 'Minimum 1 products is required.')
                    .max(3, 'You entered only maximum 3 items.'),
                otherwise: () =>
                  yup
                    .array()
                    .required('Hand picked products is required.')
                    .min(1, 'Minimum 1 products is required.'),
              }),
          }),
        }),
    }),
    newArrival: yup.object().when('layoutType', {
      is: (layout: string) => layout.includes('compact'),
      then: () =>
        yup.object().shape({
          title: yup.string().when('enable', {
            is: (enable: boolean) => enable,
            then: () =>
              yup.string().required('New arrival products title is required.'),
          }),
        }),
      otherwise: () =>
        yup.object().shape({
          title: yup.string().notRequired().nullable(),
        }),
    }),
    authors: yup.object().when('layoutType', {
      is: (layout: string) => layout.includes('compact'),
      then: () =>
        yup.object().shape({
          title: yup.string().when('enable', {
            is: (enable: boolean) => enable,
            then: () => yup.string().required('Authors title is required.'),
          }),
        }),
      otherwise: () =>
        yup.object().shape({
          title: yup.string().notRequired().nullable(),
        }),
    }),
    manufactures: yup.object().when('layoutType', {
      is: (layout: string) => layout.includes('compact'),
      then: () =>
        yup.object().shape({
          title: yup.string().when('enable', {
            is: (enable: boolean) => enable,
            then: () =>
              yup.string().required('Manufactures title is required.'),
          }),
        }),
      otherwise: () =>
        yup.object().shape({
          title: yup.string().notRequired().nullable(),
        }),
    }),
  }),
});
