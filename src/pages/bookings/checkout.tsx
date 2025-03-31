import { useTranslation } from "next-i18next";
import { customerAtom } from "@/contexts/checkout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import Layout from "@/components/layouts/admin";
import { adminOnly } from "@/utils/auth-utils";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import Loader from "@/components/ui/loader/loader";
import { useUserQuery } from "@/data/user";
import { useBooking } from "@/contexts/quick-booking/booking.context";
import BookingCard from "@/components/checkout/item/booking-card";
import EmptyCartIcon from "@/components/icons/empty-cart";
import Button from "@/components/ui/button";
import usePrice from "@/utils/use-price";
import ValidationError from "@/components/ui/validation-error";
import Input from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "@/components/ui/date-picker";
import { useCreateBookingMutation } from "@/data/booking";

type FormValues = {
  name: string;
  id_number: string;
  check_in: string;
  check_out: string;
};

export const validationSchema = yup.object().shape({
  name: yup.string().required("Customer name is required"),
  id_number: yup.string().required("Customer ID is required"),
  check_in: yup.string().required("Check-In is required"),
  check_out: yup.string().required("Check-Out is required"),
  // .matches(
  //   /^[a-zA-Z0-9@_-]+$/,
  //   'form:error-coupon-code-cannot-contain-white-space',
  // ),
  // room_category: yup.object().required('Room Category is required'),
});

export default function BookingCheckoutPage() {
  const [customer] = useAtom(customerAtom);
  const { t } = useTranslation();
  const { rooms, isEmpty, total } = useBooking();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: createBooking, isLoading } = useCreateBookingMutation();

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
    resolver: yupResolver(validationSchema),
  });

  const { data: user, isLoading: loading, refetch } = useUserQuery({
    id: customer?.value,
  });
  useEffect(() => {
    if (customer?.value) {
      refetch(customer?.value);
    }
  }, [customer?.value]);

  if (loading) return <Loader text={t("common:text-loading")} />;
  const { price: totalPrice } = usePrice({
    amount: total,
  });

  const onSubmit = async (values: FormValues) => {
    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const data = {
      customer_name: values.name,
      customer_id_number: values.id_number,
      booking_items: rooms,
      check_in: formatDate(new Date(values.check_in)),
      check_out: formatDate(new Date(values.check_out)),
      status: 'Confirmed',
    };
    createBooking(data);
  };
  return (
    <div className="bg-gray-100">
      <div className="lg:space-s-8 m-auto flex w-full max-w-5xl flex-col items-center lg:flex-row lg:items-start">
        <div className="w-full space-y-6 lg:max-w-2xl">
          <div className="shadow-700 bg-light p-5 md:p-8">
            <div className="mb-5 flex items-center justify-between md:mb-8">
              <div className="space-s-3 md:space-s-4 flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-base text-light lg:text-xl">
                  1
                </span>
                <p className="text-lg capitalize text-heading lg:text-xl">
                  Customer Details
                </p>
              </div>
            </div>

            <form>
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
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full p-0 mb-5 sm:mb-0 sm:w-1/2 sm:pe-2">
                    <DatePicker
                      control={control}
                      name="check_in"
                      dateFormat="dd/MM/yyyy"
                      // minDate={new Date()}
                      // maxDate={new Date(expire_at)}
                      // startDate={new Date(active_from)}
                      // endDate={new Date(expire_at)}
                      label="Check-In"
                      className="border border-border-base"
                      // disabled={isTranslateCoupon}
                      error={t(errors.check_in?.message!)}
                      required
                    />
                  </div>
                  <div className="w-full p-0 sm:w-1/2 sm:ps-2">
                    <DatePicker
                      name="check_out"
                      dateFormat="dd/MM/yyyy"
                      control={control}
                      // startDate={new Date(active_from)}
                      // endDate={new Date(expire_at)}
                      // minDate={new Date(active_from)}
                      className="border border-border-base"
                      // disabled={isTranslateCoupon}
                      error={t(errors.check_out?.message!)}
                      label="Check-Out"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="mb-10 mt-10 w-full sm:mb-12 lg:mb-0 lg:w-96">
          <div className="flex flex-col border-b border-border-200 pb-2">
            {!isEmpty ? (
              rooms?.map((room) => {
                // const notAvailable = verifiedResponse?.unavailable_products?.find(
                //   (d: any) => d === item.id
                // );
                return (
                  <BookingCard
                    room={room}
                    key={room.id}
                    // notAvailable={!!notAvailable}
                  />
                );
              })
            ) : (
              <EmptyCartIcon />
            )}
            <div className="flex justify-between border-t-4 border-double border-border-200 pt-3">
              <p className="text-base font-semibold text-heading">
                {t("text-total")}
              </p>
              <span className="text-base font-semibold text-heading">
                {totalPrice}
              </span>
            </div>
          </div>
          <Button
            loading={isLoading}
            className="mt-5 w-full"
            onClick={handleSubmit(onSubmit)}
          >
            Place Booking
          </Button>
          {errorMessage && (
            <div className="mt-3">
              <ValidationError message={errorMessage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
BookingCheckoutPage.authenticate = {
  permissions: adminOnly,
};
BookingCheckoutPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ["table", "common", "form"])),
  },
});
