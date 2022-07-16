/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import { store } from "@/common/store/store";
import "../styles/globals.css";
import Auth from "@/module/auth/components/Auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      {(Component as any)?.Auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </Provider>
  );
}

export default MyApp;
