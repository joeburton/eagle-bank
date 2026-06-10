import { create } from "zustand";
import type { Transaction, TransactionFilters } from "@/types";

interface TransactionsState {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
  filters: TransactionFilters;
  isLoading: boolean;
  error: string | null;
}

interface TransactionsActions {
  setTransactions: (data: { transactions: Transaction[]; total: number; totalPages: number }) => void;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const DEFAULT_FILTERS: TransactionFilters = {
  type: "all",
  sortBy: "date",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

export const useTransactionsStore = create<TransactionsState & TransactionsActions>()((set) => ({
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
    set({ transactions: [], total: 0, page: 1, totalPages: 1, filters: DEFAULT_FILTERS }),
}));
