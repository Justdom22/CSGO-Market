"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";
import { persistor, store } from "@/store";

import NiceModal from "@ebay/nice-modal-react";

import "react-toastify/dist/ReactToastify.css";
import { Flip, ToastContainer } from "react-toastify";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NiceModal.Provider>{children}</NiceModal.Provider>
          <ToastContainer transition={Flip} />
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
