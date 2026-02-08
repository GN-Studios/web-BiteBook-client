import { createContext, useContext } from "react";
import type { AppAction, AppState } from "./storeTypes";

export type AppStoreValue = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
};

export const AppStoreContext = createContext<AppStoreValue | null>(null);

export const useAppStore = (): AppStoreValue => {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
};
