import { create } from "zustand";

export type CsvRow = { [key: string]: string };

type Store = {
  data: CsvRow[];
  filters: {
    [key: string]: boolean;
  };
  setData: (newData: CsvRow[]) => void;
  toggleFilter: (header: string) => void;
};

export const useStore = create<Store>((set) => ({
  data: [],
  filters: {},
  setData: (newData) => {
    set({ data: newData });
    if (newData.length > 0) {
      set((state) => ({
        filters: toFilters(newData),
      }));
    }
  },
  toggleFilter: (header) =>
    set((state) => ({
      filters: { ...state.filters, [header]: !state.filters[header] },
    })),
}));

const toFilters = (data: CsvRow[]): { [key: string]: boolean } => {
  const headers = Object.keys(data[0]);
  return Object.fromEntries(headers.map((header) => [header, true]));
};
