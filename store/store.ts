import { create } from "zustand";

export type CsvRow = { [key: string]: string };
export type Filters = { [key: string]: boolean };
export class CardSettings {
  constructor(public showHeaders: boolean) {}
}

type Store = {
  data: MyCsv | null;
  filters: Filters;
  cardSettings: CardSettings;
  cell: (rowIndex: number, column: string) => string;
  updateCell: (rowIndex: number, column: string, newValue: string) => void;
  done: boolean[];
  setDone: (done: boolean[]) => void;
  toggleDone: (rowIndex: number) => void;
  setData: (newData: MyCsv | null) => void;
  setFilters: (newFilters: Filters) => void;
  toggleFilter: (header: string) => void;
  toggleShowHeaders: () => void;
  cardIndex: number;
  setCardIndex: (index: number) => void;
};

export const useStore = create<Store>((set) => ({
  data: null,
  done: [],
  filters: {},
  cardIndex: 0,

  cardSettings: new CardSettings(true),
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

  setDone: (newDone) => {
    set({ done: newDone });
  },
  toggleDone: (rowIndex) =>
    set((state) => {
      const updatedDone = [...state.done];
      updatedDone[rowIndex] = !updatedDone[rowIndex];
      return { done: updatedDone };
    }),

  setData: (newData) => {
    set({ data: newData });
    if (newData) {
      set(() => ({
        filters: toFilters(newData),
      }));
    }
  },
  setFilters: (newFilters) => {
    set({ filters: newFilters });
  },
  toggleFilter: (header) =>
    set((state) => ({
      filters: { ...state.filters, [header]: !state.filters[header] },
    })),

  toggleShowHeaders: () =>
    set((state) => ({
      cardSettings: {
        ...state.cardSettings,
        showHeaders: !state.cardSettings.showHeaders,
      },
    })),

  setCardIndex: (index: number) =>
    set(() => ({
      cardIndex: index,
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
