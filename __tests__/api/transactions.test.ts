import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const MOCK_TRANSACTION = {
  id: "txn-001",
  accountId: "acc-001",
  type: "deposit",
  amount: 3500,
  description: "Monthly Salary",
  category: "Income",
  date: "2024-06-01T08:00:00Z",
  status: "completed",
  reference: "SAL-2406-001",
  counterparty: "Eagle Corp Ltd",
};

async function fetchTransaction(id: string) {
  const res = await fetch(`/api/transactions/${id}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const error = await res.json();
    throw { ...error, status: res.status };
  }
  return res.json();
}

describe("Transaction detail API", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns a transaction for a valid id", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: MOCK_TRANSACTION }),
    });

    const result = await fetchTransaction("txn-001");
    expect(result.data.id).toBe("txn-001");
    expect(result.data.description).toBe("Monthly Salary");
    expect(result.data.amount).toBe(3500);
  });

  it("throws with status 404 for an unknown id", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: "Transaction not found" }),
    });

    await expect(fetchTransaction("txn-unknown")).rejects.toMatchObject({
      message: "Transaction not found",
      status: 404,
    });
  });

  it("calls the correct endpoint", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: MOCK_TRANSACTION }),
    });

    await fetchTransaction("txn-001");
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/transactions/txn-001",
      expect.any(Object)
    );
  });

  it("returns all required transaction fields", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: MOCK_TRANSACTION }),
    });

    const result = await fetchTransaction("txn-001");
    const txn = result.data;
    expect(txn).toHaveProperty("id");
    expect(txn).toHaveProperty("type");
    expect(txn).toHaveProperty("amount");
    expect(txn).toHaveProperty("description");
    expect(txn).toHaveProperty("category");
    expect(txn).toHaveProperty("date");
    expect(txn).toHaveProperty("status");
    expect(txn).toHaveProperty("reference");
  });
});
