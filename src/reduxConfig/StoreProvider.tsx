"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/lib/integration/react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }
  const persistor = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
