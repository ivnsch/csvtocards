import { create } from "zustand";

export type CsvRow = { [key: string]: string };
export type Filters = { [key: string]: boolean };

type Store = {
  data: MyCsv | null;
  filters: Filters;
  cell: (rowIndex: number, column: string) => string;
  updateCell: (rowIndex: number, column: string, newValue: string) => void;
  setData: (newData: MyCsv | null) => void;
  toggleFilter: (header: string) => void;
};

export const useStore = create<Store>((set) => ({
  data: null,
  filters: {},
  cell: (rowIndex: number, column: string): string => {
    return useStore.getState().data?.rows[rowIndex]?.[column] ?? "";
  },
  updateCell: (rowIndex, column, newValue) =>
    set((state) => {
      if (!state.data) return state;

      const updatedRows = state.data.rows.map((row, i) =>
        i === rowIndex ? { ...row, [column]: newValue } : row
      );

      return {
        data: new MyCsv(state.data.name, state.data.headers, updatedRows),
      };
    }),

  setData: (newData) => {
    set({ data: newData });
    if (newData) {
      set(() => ({
        filters: toFilters(newData),
      }));
    }
  },
  toggleFilter: (header) =>
    set((state) => ({
      filters: { ...state.filters, [header]: !state.filters[header] },
    })),
}));

const toFilters = (data: MyCsv): Filters => {
  return Object.fromEntries(data.headers.map((header) => [header, true]));
};

export class MyCsv {
  constructor(
    public name: string,
    public headers: string[],
    public rows: CsvRow[]
  ) {}
}
