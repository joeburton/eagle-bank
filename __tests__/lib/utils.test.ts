import { describe, it, expect } from "vitest";
import {
  cn,
  formatCurrency,
  formatDate,
  maskAccountNumber,
  getTransactionSign,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("deduplicates tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("formatCurrency", () => {
  it("formats GBP correctly", () => {
    expect(formatCurrency(1234.56)).toContain("1,234.56");
    expect(formatCurrency(1234.56)).toContain("£");
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0)).toContain("0.00");
  });

  it("formats negative values correctly", () => {
    expect(formatCurrency(-500)).toContain("500.00");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string", () => {
    const result = formatDate("2024-06-01T08:00:00Z");
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/2024/);
  });

  it("accepts a Date object", () => {
    const result = formatDate(new Date("2024-01-15"));
    expect(result).toMatch(/Jan/);
  });
});

describe("maskAccountNumber", () => {
  it("shows only last 4 digits", () => {
    expect(maskAccountNumber("40275812345678")).toBe("••••5678");
  });

  it("works with short numbers", () => {
    expect(maskAccountNumber("1234")).toBe("••••1234");
  });
});

describe("getTransactionSign", () => {
  it("returns + for deposit", () => {
    expect(getTransactionSign("deposit")).toBe("+");
  });

  it("returns - for withdrawal", () => {
    expect(getTransactionSign("withdrawal")).toBe("-");
  });

  it("returns - for transfer", () => {
    expect(getTransactionSign("transfer")).toBe("-");
  });
});
