import Layout from "@/components/layouts/admin";
import LineChart from "@/components/widgets/line-chart";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function BookingAnalytics() {
  return (
    <>
      <div className="lg:col-span-full 2xl:col-span-8 mb-5">
        {/* <LineChart
              widgetTitle="Monthly Sales"
              series={seriesData} // Pass the data to series
              color={['#18D8BC']}
              categories={categories} // Pass the month labels as categories
              seriesName="Revenue"
            /> */}
      </div>
    </>
  );
}

BookingAnalytics.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
