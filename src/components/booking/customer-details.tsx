import { useAtom } from "jotai";
import { customerAtom } from "@/contexts/checkout";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { PlusIcon } from "@/components/icons/plus-icon";
import { useTranslation } from "next-i18next";
import { Control, FieldErrors, useForm } from "react-hook-form";
import Description from "@/components/ui/description";
import Card from "@/components/common/card";
import Label from "@/components/ui/label";
import Input from "@/components/ui/input";

interface CustomerProps {
  label: string;
  count?: number;
  className?: string;
}

type FormValues = {
  name: string;
  id_number: string;
};

const CustomerDetails = ({ label, count, className }: CustomerProps) => {
  const [customer] = useAtom(customerAtom);
  const { openModal } = useModalAction();
  const { t } = useTranslation("common");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-ignore
    // defaultValues: initialValues
    //   ? {
    //       ...initialValues,
    //       room_category: roomCategories.find((data) => data.name == initialValues.category)
    //     }
    //   : defaultValues,
    //@ts-ignore
    // resolver: yupResolver(roomValidationSchema),
  });

  function onAddOrChange() {
    openModal("SELECT_CUSTOMER");
  }

  const onSubmit = async (values: FormValues) => {
    // const input = {
    //   category_id: values.room_category.id,
    //   room_number: values.room_number,
    //   is_available: values.is_available,
    // };
    // try {
    //   if (!initialValues) {
    //     createRoom({
    //       ...input,
    //     });
    //   } else {
    //     updateRoom({
    //       id: initialValues.room_number,
    //       ...input,
    //     });
    //   }
    // } catch (error) {
    //   const serverErrors = getErrorMessage(error);
    //   Object.keys(serverErrors?.validation).forEach((field: any) => {
    //     setError(field.split(".")[1], {
    //       type: "manual",
    //       message: serverErrors?.validation[field][0],
    //     });
    //   });
    // }
  };

  return (
    <div className={className}>
      <div className="mb-5 flex items-center justify-between md:mb-8">
        <div className="space-s-3 md:space-s-4 flex items-center">
          {count && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-base text-light lg:text-xl">
              {count}
            </span>
          )}
          <p className="text-lg capitalize text-heading lg:text-xl">{label}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col flex-wrap my-5 sm:my-8">
          <Input
            label="Name"
            {...register("name")}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={isTranslateCoupon}
            required
          />
          <Input
            label="ID No."
            {...register("id_number")}
            error={t(errors.id_number?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={isTranslateCoupon}
            required
          />
        </div>
      </form>
    </div>
  );
};

export default CustomerDetails;
