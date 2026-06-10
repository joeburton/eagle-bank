import { describe, it, expect, beforeEach } from "vitest";
import { useTransactionsStore } from "@/stores/transactions-store";
import type { Transaction } from "@/types";

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-001",
    accountId: "acc-001",
    type: "deposit",
    amount: 3500,
    description: "Monthly Salary",
    category: "Income",
    date: "2024-06-01T08:00:00Z",
    status: "completed",
    reference: "SAL-001",
  },
  {
    id: "txn-002",
    accountId: "acc-001",
    type: "withdrawal",
    amount: 1200,
    description: "Rent",
    category: "Housing",
    date: "2024-06-02T10:00:00Z",
    status: "completed",
    reference: "DD-001",
  },
];

describe("useTransactionsStore", () => {
  beforeEach(() => {
    useTransactionsStore.getState().reset();
  });

  it("starts with empty state", () => {
    const { transactions, total, page } = useTransactionsStore.getState();
    expect(transactions).toHaveLength(0);
    expect(total).toBe(0);
    expect(page).toBe(1);
  });

  it("setTransactions updates the list", () => {
    useTransactionsStore.getState().setTransactions({
      transactions: MOCK_TRANSACTIONS,
      total: 2,
      totalPages: 1,
    });
    expect(useTransactionsStore.getState().transactions).toHaveLength(2);
    expect(useTransactionsStore.getState().total).toBe(2);
  });

  it("setFilters updates filters and resets page to 1", () => {
    useTransactionsStore.getState().setPage(3);
    useTransactionsStore.getState().setFilters({ type: "deposit" });
    const { filters, page } = useTransactionsStore.getState();
    expect(filters.type).toBe("deposit");
    expect(page).toBe(1);
  });

  it("setPage updates current page", () => {
    useTransactionsStore.getState().setPage(2);
    expect(useTransactionsStore.getState().page).toBe(2);
    expect(useTransactionsStore.getState().filters.page).toBe(2);
  });

  it("setError captures error message", () => {
    useTransactionsStore.getState().setError("Network error");
    expect(useTransactionsStore.getState().error).toBe("Network error");
  });

  it("reset returns to initial state", () => {
    useTransactionsStore.getState().setTransactions({
      transactions: MOCK_TRANSACTIONS,
      total: 2,
      totalPages: 1,
    });
    useTransactionsStore.getState().setPage(3);
    useTransactionsStore.getState().reset();
    const { transactions, total, page } = useTransactionsStore.getState();
    expect(transactions).toHaveLength(0);
    expect(total).toBe(0);
    expect(page).toBe(1);
  });
});
