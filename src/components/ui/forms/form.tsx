import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
  UseFormProps,
  Path,
} from 'react-hook-form';
import type { Schema } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';

type ServerErrors<T> = {
  [Property in keyof T]: string;
};
type FormProps<TFormValues extends FieldValues> = {
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  useFormProps?: UseFormProps<TFormValues>;
  validationSchema?: Schema<TFormValues> | any;
  fieldErrors?: ServerErrors<Partial<TFormValues>> | null;
  formError?: string | string[] | null;
};

const Form = <TFormValues extends Record<string, any> = Record<string, any>>({
  onSubmit,
  children,
  useFormProps,
  validationSchema,
  fieldErrors,
  formError,
  ...formProps
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    ...useFormProps,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  useEffect(() => {
    if (fieldErrors) {
      Object.entries(fieldErrors).forEach(([key, value]) => {
        methods.setError(key as Path<TFormValues>, {
          type: 'manual',
          message: value,
        });
      });
    }
  }, [fieldErrors, methods]);
  return (
    <div>
      {formError ? (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">Oops! </span>
          {formError}
        </p>
      ) : null}
      <form noValidate onSubmit={methods.handleSubmit(onSubmit)} {...formProps}>
        {children(methods)}
      </form>
    </div>
  );
};

export default Form;
