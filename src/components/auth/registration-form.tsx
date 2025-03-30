import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Routes } from "@/config/routes";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "@/components/ui/link";
import {
  allowedRoles,
  hasAccess,
  setAuthCredentials,
} from "@/utils/auth-utils";
import { Permission } from "@/types";
import { useRegisterMutation } from "@/data/user";

type FormValues = {
  // first_name: string,
  // last_name: string;
  // username: string;
  email: string;
  password: string;
  permission: Permission;
};
const registrationFormSchema = yup.object().shape({
  // first_name: yup.string().notRequired(),
  // last_name: yup.string().notRequired(),
  // username: yup.string().required("Username Name is required"),
  email: yup
    .string()
    .email("form:error-email-format")
    .notRequired(),
  password: yup.string().required("form:error-password-required"),
  permission: yup.string().default("store_owner").oneOf(["store_owner"]),
});
const RegistrationForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(registrationFormSchema),
    defaultValues: {
      permission: Permission.StoreOwner,
    },
  });
  const router = useRouter();
  const { t } = useTranslation();

  async function onSubmit({ email, password, permission }: FormValues) {
    registerUser(
      {
        email,
        password,
        //@ts-ignore
        // permission,
      },

      {
        onSuccess: (data) => {
          router.push(Routes.login)
          // if (data?.token) {
          //   if (hasAccess(allowedRoles, data?.permissions)) {
          //     setAuthCredentials(data?.token, data?.permissions, data?.role);
          //     router.push(Routes.dashboard);
          //     return;
          //   }
          //   setErrorMessage("form:error-enough-permission");
          // } else {
          //   setErrorMessage("form:error-credential-wrong");
          // }
        },
        onError: (error: any) => {
          // Object.keys(error?.response?.data).forEach((field: any) => {
          //   setError(field, {
          //     type: "manual",
          //     message: error?.response?.data[field],
          //   });
          // });
        },
      }
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(
          //@ts-ignore
          onSubmit
        )}
        noValidate
      >
        {/* <Input
          label="First Name"
          {...register("first_name")}
          variant="outline"
          className="mb-4 col-span-2"
          error={t(errors?.first_name?.message!)}
        />
        <Input
          label="Last Name"
          {...register("last_name")}
          variant="outline"
          className="mb-4 col-span-2"
          error={t(errors?.last_name?.message!)}
        />
        <Input
          label="Username"
          {...register("username")}
          variant="outline"
          className="mb-4"
          error={t(errors?.username?.message!)}
        /> */}
        <Input
          label={t("form:input-label-email")}
          {...register("email")}
          type="email"
          variant="outline"
          className="mb-4"
          error={t(errors?.email?.message!)}
        />
        <PasswordInput
          label={t("form:input-label-password")}
          {...register("password")}
          error={t(errors?.password?.message!)}
          variant="outline"
          className="mb-4"
        />
        <Button className="w-full" loading={loading} disabled={loading}>
          {t("form:text-register")}
        </Button>

        {errorMessage ? (
          <Alert
            message={t(errorMessage)}
            variant="error"
            closeable={true}
            className="mt-5"
            onClose={() => setErrorMessage(null)}
          />
        ) : null}
      </form>
      <div className="relative flex flex-col items-center justify-center mt-8 mb-6 text-sm text-heading sm:mt-11 sm:mb-8">
        <hr className="w-full" />
        <span className="start-2/4 -ms-4 absolute -top-2.5 bg-light px-2">
          {t("common:text-or")}
        </span>
      </div>
      <div className="text-sm text-center text-body sm:text-base">
        {t("form:text-already-account")}{" "}
        <Link
          href={Routes.login}
          className="font-semibold underline transition-colors duration-200 ms-1 text-accent hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
        >
          {t("form:button-label-login")}
        </Link>
      </div>
    </>
  );
};

export default RegistrationForm;
