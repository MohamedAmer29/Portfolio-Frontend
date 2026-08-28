import { createContext, useContext } from "react";

type EntranceContextValue = {
  complete: boolean;
};

export const EntranceContext = createContext<EntranceContextValue>({
  complete: true,
});

export function useEntrance() {
  return useContext(EntranceContext);
}
