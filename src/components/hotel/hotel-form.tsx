import Input from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/button";
import Card from "@/components/common/card";
import Description from "@/components/ui/description";
import { useTranslation } from "next-i18next";
import StickyFooterPanel from "@/components/ui/sticky-footer-panel";
import { useUpdateHotelMutation } from "@/data/hotels";

type IProps = {
  initialValues?: any;
};

type FormValues = {
  name: string;
  location: string;
  description: string;
};

const defaultValues = {
  room_number: "",
  room_category: "",
  is_available: true,
};

export default function HotelForm({ initialValues }: IProps) {
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
    defaultValues: initialValues,
    //@ts-ignore
    // resolver: yupResolver(roomValidationSchema),
  });
  const { mutate: updateHotel, isLoading: updating } = useUpdateHotelMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      description: values.description,
      location: values.location,
    };

    updateHotel({
      id: initialValues.id,
      ...input,
    });
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
            label="Name"
            {...register("name")}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            required
          />
          <Input
            label="Location"
            {...register("location")}
            error={t(errors.location?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Description"
            {...register("description")}
            error={t(errors.description?.message!)}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          <Button loading={updating} disabled={updating}>
            Update Hotel
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
