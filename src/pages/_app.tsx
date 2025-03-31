import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import "@/assets/css/main.css";
import { UIProvider } from "@/contexts/ui.context";
import { SettingsProvider } from "@/contexts/settings.context";
import ErrorMessage from "@/components/ui/error-message";
import PageLoader from "@/components/ui/page-loader/page-loader";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { useSettingsQuery } from "@/data/settings";
import { ReactQueryDevtools } from "react-query/devtools";
import { appWithTranslation } from "next-i18next";
import { ModalProvider } from "@/components/ui/modal/modal.context";
import DefaultSeo from "@/components/ui/default-seo";
import ManagedModal from "@/components/ui/modal/managed-modal";
import { CartProvider } from "@/contexts/quick-cart/cart.context";
import { useState } from "react";
import type { NextPageWithLayout } from "@/types";
import { useRouter } from "next/router";
import PrivateRoute from "@/utils/private-route";
import { Config } from "@/config";
import { BookingProvider } from "@/contexts/quick-booking/booking.context";
const Noop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

const AppSettings: React.FC<{ children?: React.ReactNode }> = (props) => {
  const { query, locale } = useRouter();
  const { settings, loading, error } = useSettingsQuery({ language: locale! });
  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error.message} />;
  // TODO: fix it
  // @ts-ignore
  return <SettingsProvider initialValue={settings?.options} {...props} />;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const CustomApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const Layout = (Component as any).Layout || Noop;
  const authProps = (Component as any).authenticate;
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout ?? ((page) => page);

  const { locale } = useRouter();
  const dir = Config.getDirection(locale);
  return (
    <div dir={dir}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps?.dehydratedState}>
          <AppSettings>
            <UIProvider>
              <ModalProvider>
                <>
                  <CartProvider>
                    <BookingProvider>
                      <DefaultSeo />
                      {authProps ? (
                        <PrivateRoute authProps={authProps}>
                          <Layout {...pageProps}>
                            <Component {...pageProps} />
                          </Layout>
                        </PrivateRoute>
                      ) : (
                        <Layout {...pageProps}>
                          <Component {...pageProps} />
                        </Layout>
                      )}
                      <ToastContainer autoClose={2000} theme="colored" />
                      <ManagedModal />
                    </BookingProvider>
                  </CartProvider>
                </>
              </ModalProvider>
            </UIProvider>
          </AppSettings>
          <ReactQueryDevtools />
        </Hydrate>
      </QueryClientProvider>
    </div>
  );
};

export default appWithTranslation(CustomApp);
