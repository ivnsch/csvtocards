import { create } from "zustand";

type CsvRow = { [key: string]: string };

type CsvStore = {
  data: CsvRow[];
  setData: (newData: CsvRow[]) => void;
};

export const useCsvStore = create<CsvStore>((set) => ({
  data: [],
  setData: (newData) => set({ data: newData }),
}));
