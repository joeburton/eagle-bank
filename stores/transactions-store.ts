import { create } from "zustand";
import type { Transaction, TransactionFilters } from "@/types";

type TransactionsStore = {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
  filters: TransactionFilters;
  isLoading: boolean;
  error: string | null;
  setTransactions: (
    data: Pick<TransactionsStore, "transactions" | "total" | "totalPages">,
  ) => void;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const DEFAULT_FILTERS: TransactionFilters = {
  type: "all",
  sortBy: "date",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

export const useTransactionsStore = create<TransactionsStore>()((set) => ({
  transactions: [],
  total: 0,
  page: 1,
  totalPages: 1,
  filters: DEFAULT_FILTERS,
  isLoading: false,
  error: null,

  setTransactions: ({ transactions, total, totalPages }) =>
    set({ transactions, total, totalPages }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters, page: 1 },
      page: 1,
    })),

  setPage: (page) =>
    set((state) => ({
      page,
      filters: { ...state.filters, page },
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      transactions: [],
      total: 0,
      page: 1,
      totalPages: 1,
      filters: DEFAULT_FILTERS,
    }),
}));
