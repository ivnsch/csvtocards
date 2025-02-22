import { create } from "zustand";

type CsvRow = { [key: string]: string };

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
      const headers = Object.keys(newData[0]);
      set((state) => ({
        filters: Object.fromEntries(headers.map((header) => [header, true])), // Initialize filters
      }));
    }
  },
  toggleFilter: (header) =>
    set((state) => ({
      filters: { ...state.filters, [header]: !state.filters[header] },
    })),
}));
