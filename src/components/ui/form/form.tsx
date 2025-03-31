import type {
  UseFormReturn,
  SubmitHandler,
  FieldValues,
  UseFormProps,
  Path,
  UnpackNestedValue,
  DeepPartial,
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
  options?: UseFormProps<TFormValues>;
  validationSchema?: Schema<TFormValues> | any;
  serverError?: ServerErrors<Partial<TFormValues>> | null;
  resetValues?: any | null;
  className?: string;
  [key: string]: unknown;
};

export const Form = <
  TFormValues extends Record<string, any> = Record<string, any>,
>({
  onSubmit,
  children,
  options,
  validationSchema,
  serverError,
  resetValues,
  ...props
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>(
    //@ts-ignore
    {
      ...(!!validationSchema && { resolver: yupResolver(validationSchema) }),
      ...(!!options && options),
    },
  );
  useEffect(() => {
    if (serverError) {
      Object.entries(serverError).forEach(([key, value]) => {
        methods.setError(key as Path<TFormValues>, {
          type: 'manual',
          message: value,
        });
      });
    }
  }, [serverError, methods]);

  useEffect(() => {
    if (resetValues) {
      methods.reset(resetValues);
    }
  }, [resetValues, methods]);
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} noValidate {...props}>
      {children(methods)}
    </form>
  );
};
