import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Regret } from "./types";

interface RegretState {
  regrets: Regret[];
  addRegret: (regret: Regret) => void;
  addRegrets: (regrets: Regret[]) => void;
  clearRegrets: () => void;
}

export const useRegretStore = create<RegretState>()(
  persist(
    (set) => ({
      regrets: [],
      addRegret: (regret) =>
        set((state) => ({
          regrets: [regret, ...state.regrets],
        })),
      addRegrets: (regrets) =>
        set((state) => ({
          regrets: [...regrets, ...state.regrets],
        })),
      clearRegrets: () => set({ regrets: [] }),
    }),
    {
      name: "regret-storage",
    }
  )
);
