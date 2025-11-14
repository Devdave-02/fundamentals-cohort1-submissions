import { create } from "zustand";
import type { StateCreator } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

type ConfigType<T> = {
  name?: string;
  storage?: string;
  skipPersist?: boolean;
  excludeFromPersist?: Array<keyof T>;
};

const createStore = <T extends object>(
  storeCreator: StateCreator<T, [["zustand/immer", never]], []>,
  config?: ConfigType<T>
) => {
  const { name, storage, skipPersist, excludeFromPersist } = config || {};

  const immerStore = immer(storeCreator);

  if (skipPersist) return create<T>()(immerStore);

  return create<T>()(
    persist(immerStore, {
      name: name || "zustand-store",
      storage: createJSONStorage(() =>
        storage === "local" ? localStorage : sessionStorage
      ),
      partialize: (
        state // cspell:ignore partialize
      ) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !excludeFromPersist?.includes(key as keyof T)
          )
        ),
    })
  );
};

export { createStore };
