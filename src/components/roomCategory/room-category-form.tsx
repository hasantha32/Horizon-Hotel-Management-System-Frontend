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
import { roomCategoryValidationSchema } from "./room-validation-schema";
import { AttachmentInput, Room, RoomCategory } from "@/types";
import { getErrorMessage } from "@/utils/form-error";
import { Config } from "@/config";
import StickyFooterPanel from "@/components/ui/sticky-footer-panel";
import {
  useCreateRoomCategoryMutation,
  useUpdateRoomCategoryMutation,
} from "@/data/room-category";
import { formatSlug } from "@/utils/use-slug";
import RichTextEditor from "@/components/ui/wysiwyg-editor/editor";
import FileInput from "../ui/file-input";

type FormValues = {
  name: string;
  slug: string;
  image: AttachmentInput;
  description: string;
  capacity: number;
  price_per_night: number;
};

const defaultValues = {
  name: "",
  slug: "",
  image: '',
  description: "",
  capacity: 0,
  price_per_night: 0,
};

type IProps = {
  initialValues?: RoomCategory;
};
export default function CreateOrUpdateRoomCategoryForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { locale } = useRouter();
  const { t } = useTranslation();

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
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(roomCategoryValidationSchema),
  });
  const {
    mutate: createRoomCategory,
    isLoading: creating,
  } = useCreateRoomCategoryMutation();
  const {
    mutate: updateRoomCategory,
    isLoading: updating,
  } = useUpdateRoomCategoryMutation();

  const isTranslateCoupon = router.locale !== Config.defaultLanguage;

  const slugAutoSuggest = formatSlug(watch("name"));

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      slug: slugAutoSuggest,
      image: {
        thumbnail: values?.image?.thumbnail,
        original: values?.image?.original,
        id: values?.image?.id,
      },
      description: values.description,
      capacity: values.capacity,
      price_per_night: values.price_per_night,
    };

    try {
      if (!initialValues) {
        createRoomCategory({
          ...input,
        });
      } else {
        updateRoomCategory({
          id: initialValues.slug,
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
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-image')}
          details={t('form:coupon-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div>

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
            label="Name"
            {...register("name")}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            disabled={isTranslateCoupon}
            required
          />
          <Input
            label={t("form:input-label-slug")}
            {...register("slug")}
            value={slugAutoSuggest}
            variant="outline"
            className="mb-5"
            disabled
            readOnly
          />
          <div className="relative mb-5">
            <RichTextEditor
              title={t("form:input-label-description")}
              control={control}
              name="description"
              error={t(errors?.description?.message)}
            />
          </div>
          <Input
            label="Capacity"
            {...register("capacity")}
            type="number"
            error={t(errors.capacity?.message!)}
            variant="outline"
            className="mb-5"
            required
          />
          <Input
            label="Price Per Night"
            {...register("price_per_night")}
            type="number"
            error={t(errors.price_per_night?.message!)}
            variant="outline"
            className="mb-5"
            required
          />
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
              ? t("form:button-label-update-room-category")
              : t("form:button-label-add-room-category")}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
