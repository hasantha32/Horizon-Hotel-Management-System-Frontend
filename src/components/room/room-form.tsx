import Input from "@/components/ui/input";
import { Control, FieldErrors, useForm } from "react-hook-form";
import Button from "@/components/ui/button";
import Description from "@/components/ui/description";
import Card from "@/components/common/card";
import Label from "@/components/ui/label";
import { useRouter } from "next/router";
import ValidationError from "@/components/ui/form-validation-error";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { roomValidationSchema } from "./room-validation-schema";
import { Room, RoomCategory } from "@/types";
import SelectInput from "@/components/ui/select-input";
import { getErrorMessage } from "@/utils/form-error";
import { Config } from "@/config";
import StickyFooterPanel from "@/components/ui/sticky-footer-panel";
import { useRoomCategoriesQuery } from "@/data/room-category";
import { useCreateRoomMutation, useUpdateRoomMutation } from "@/data/room";
import SwitchInput from "../ui/switch-input";

type FormValues = {
  room_number: string;
  room_category: RoomCategory;
  is_available: boolean;
};

const defaultValues = {
  room_number: '',
  room_category: '',
  is_available: true,
};

function SelectTypes({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { roomCategories, loading } = useRoomCategoriesQuery({
    language: locale,
  });
  return (
    <div className="mb-5">
      <Label>Room Category</Label>
      <SelectInput
        name="room_category"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={roomCategories!}
        isLoading={loading}
      />
      <ValidationError message={t(errors.room_category?.message)} />
    </div>
  );
}

type IProps = {
  initialValues?: Room;
};
export default function CreateOrUpdateRoomForm({ initialValues }: IProps) {
  const router = useRouter();
  const { locale } = useRouter();
  const { t } = useTranslation();

  const { roomCategories, loading } = useRoomCategoriesQuery({
    language: locale,
  });

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
    defaultValues: initialValues
      ? {
          ...initialValues,
          room_category: roomCategories.find((data) => data.name == initialValues.category)
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(roomValidationSchema),
  });
  const { mutate: createRoom, isLoading: creating } = useCreateRoomMutation();
  const {
    mutate: updateRoom,
    isLoading: updating,
  } = useUpdateRoomMutation();

  const isTranslateCoupon = router.locale !== Config.defaultLanguage;

  const onSubmit = async (values: FormValues) => {
    const input = {
      category_id: values.room_category.id,
      room_number: values.room_number,
      is_available: values.is_available,
    };

    try {
      if (!initialValues) {
        createRoom({
          ...input,
        });
      } else {
        updateRoom({
          id: initialValues.room_number,
          ...input,
        });
      }
    } catch (error) {
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split(".")[1], {
          type: "manual",
          message: serverErrors?.validation[field][0],
        });
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-image')}
          details={t('form:coupon-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div> */}

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t("form:input-label-description")}
          details={`${
            initialValues
              ? t("form:item-description-edit")
              : t("form:item-description-add")
          } ${t("form:room-form-info-help-text")}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Room No."
            {...register("room_number")}
            error={t(errors.room_number?.message!)}
            variant="outline"
            className="mb-5"
            disabled={isTranslateCoupon}
            required
          />
          <SelectTypes control={control} errors={errors} />
          <div className="flex items-center gap-x-4">
            <SwitchInput name="is_available" control={control} />
            <Label className="!mb-0.5">Available</Label>
          </div>
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="me-4"
              type="button"
            >
              {t("form:button-label-back")}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues
              ? t("form:button-label-update-room")
              : t("form:button-label-add-room")}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
