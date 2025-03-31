import * as yup from 'yup';

const currentDate = new Date();

export const maintenanceValidationSchema = yup.object().shape({
  maintenance: yup.object().when('isUnderMaintenance', {
    is: (value: boolean) => value,
    then: () =>
      yup.object().shape({
        title: yup.string().required('Title is required'),
        buttonTitleOne: yup.string().required('Button title one is required'),
        buttonTitleTwo: yup.string().required('Button title two is required'),
        newsLetterTitle: yup.string().required('News letter title is required'),
        aboutUsTitle: yup.string().required('About us title is required'),
        contactUsTitle: yup.string().required('Contact us title is required'),
        aboutUsDescription: yup
          .string()
          .required('About us description is required'),
        newsLetterDescription: yup
          .string()
          .required('News letter description is required'),
        description: yup.string().required('Description is required'),
        start: yup
          .date()
          .min(
            currentDate.toDateString(),
            `Maintenance start date  field must be later than ${currentDate.toDateString()}`,
          )
          .required('Start date is required'),
        until: yup
          .date()
          .required('Until date is required')
          .min(
            yup.ref('start'),
            'Until date must be greater than or equal to start date',
          ),
      }),
  }),
});
