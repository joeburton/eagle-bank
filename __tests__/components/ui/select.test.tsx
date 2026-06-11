import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

describe("Select", () => {
  function renderSelect(disabled = false) {
    return render(
      <Select>
        <SelectTrigger aria-label="Transaction type" disabled={disabled}>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="deposit">Deposit</SelectItem>
          <SelectItem value="withdrawal">Withdrawal</SelectItem>
          <SelectItem value="transfer">Transfer</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  it("renders the trigger button", () => {
    renderSelect();
    expect(screen.getByRole("combobox", { name: "Transaction type" })).toBeInTheDocument();
  });

  it("shows the placeholder text", () => {
    renderSelect();
    expect(screen.getByText("Select type")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    renderSelect(true);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("renders a controlled value", () => {
    render(
      <Select value="deposit" onValueChange={() => {}}>
        <SelectTrigger aria-label="Type">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="deposit">Deposit</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByRole("combobox", { name: "Type" })).toHaveTextContent("Deposit");
  });
});
